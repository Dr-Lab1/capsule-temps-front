// CapsuleNFT.sol — Compatible zkSync Era
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CapsuleNFT is ERC721, Ownable {
    uint256 public nextTokenId;

    struct Capsule {
        string name;
        string description;
        string uri;
        uint256 unlockDate;
        address heir;
        bool claimed;
        uint256 balance; // ETH associé à la capsule
        uint256 createdAt;
        uint256 updatedAt;
        uint256 deletedAt;
    }

    mapping(uint256 => Capsule) public capsules;
    uint256[] private allTokenIds;

    event CapsuleMinted(
        uint256 indexed tokenId,
        address indexed creator,
        address indexed heir,
        uint256 unlockDate,
        string name,
        string description,
        string uri,
        uint256 value
    );
    event CapsuleClaimed(
        uint256 indexed tokenId,
        address indexed heir,
        uint256 value
    );

    constructor() ERC721("CapsuleNFT", "CNFT") {}

    function mintCapsule(
        address heir,
        uint256 unlockDate,
        string memory name,
        string memory description,
        string memory uri
    ) external payable {
        require(unlockDate > block.timestamp, "Unlock date must be in future");
        require(heir != msg.sender, "Heir cannot be the capsule creator");

        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);

        capsules[tokenId] = Capsule({
            name: name,
            description: description,
            uri: uri,
            unlockDate: unlockDate,
            heir: heir,
            claimed: false,
            balance: msg.value,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            deletedAt: 0
        });

        allTokenIds.push(tokenId);
        emit CapsuleMinted(
            tokenId,
            msg.sender,
            heir,
            unlockDate,
            name,
            description,
            uri,
            msg.value
        );
    }

    function claimCapsule(uint256 tokenId) external {
        Capsule storage cap = capsules[tokenId];
        require(_exists(tokenId), "Invalid token");
        require(block.timestamp >= cap.unlockDate, "Capsule is still locked");
        require(msg.sender == cap.heir, "You are not the designated heir");
        require(!cap.claimed, "Capsule already claimed");

        cap.claimed = true;
        _transfer(ownerOf(tokenId), msg.sender, tokenId);

        uint256 amount = cap.balance;
        if (amount > 0) {
            cap.balance = 0;
            (bool sent, ) = payable(msg.sender).call{value: amount}("");
            require(sent, "Transfer failed");
        }

        emit CapsuleClaimed(tokenId, msg.sender, amount);
    }

    function addFundsToCapsule(uint256 tokenId) external payable {
        require(_exists(tokenId), "Invalid token");
        require(
            ownerOf(tokenId) == msg.sender,
            "Only capsule owner can fund it"
        );
        require(!capsules[tokenId].claimed, "Capsule already claimed");

        capsules[tokenId].balance += msg.value;
    }

    function getCapsule(
        uint256 tokenId
    )
        external
        view
        returns (
            string memory name,
            string memory description,
            string memory uri,
            uint256 unlockDate,
            address heir,
            bool claimed,
            uint256 balance,
            uint256 createdAt,
            uint256 updatedAt,
            uint256 deletedAt
        )
    {
        require(_exists(tokenId), "Capsule does not exist");
        Capsule memory c = capsules[tokenId];
        return (
            c.name,
            c.description,
            c.uri,
            c.unlockDate,
            c.heir,
            c.claimed,
            c.balance,
            c.createdAt,
            c.updatedAt,
            c.deletedAt
        );
    }

    function getCapsuleBalance(
        uint256 tokenId
    ) external view returns (uint256) {
        require(_exists(tokenId), "Capsule does not exist");
        return capsules[tokenId].balance;
    }

    function getAllCapsules() external view returns (uint256[] memory) {
        return allTokenIds;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return capsules[tokenId].uri;
    }

    function updateHeir(uint256 tokenId, address newHeir) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(
            block.timestamp < capsules[tokenId].unlockDate,
            "Capsule already unlocked"
        );
        capsules[tokenId].heir = newHeir;
        capsules[tokenId].updatedAt = block.timestamp;
    }

    function deleteCapsule(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        capsules[tokenId].deletedAt = block.timestamp;
        capsules[tokenId].updatedAt = block.timestamp;
    }

    receive() external payable {
        revert("Use addFundsToCapsule to fund a capsule");
    }
}
