// src/components/ContractAccess.js
import { ethers } from "ethers";
import CapsuleNFT from "../abi/CapsuleNFT.json";

const CONTRACT_ADDRESS = "0x..."; // adresse déployée depuis Hardhat

export async function connectContract() {
  if (!window.ethereum) throw new Error("MetaMask required");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CapsuleNFT.abi, signer);

  return contract;
}
