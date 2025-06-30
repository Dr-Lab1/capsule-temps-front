const hre = require("hardhat");

async function main() {
  const CapsuleNFT = await hre.ethers.getContractFactory("CapsuleNFT");
  const capsule = await CapsuleNFT.deploy();

  await capsule.deployed();

  console.log("✅ Contract deployed to:", capsule.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error during deployment:", error);
    process.exit(1);
  });
