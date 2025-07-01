import { useEffect, useState } from "react";

import { ethers } from "ethers";
import CapsuleNFT from "../abi/CapsuleNFT.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export function Header() {

    const [walletConnected, setWalletConnected] = useState(false);
    const [contract, setContract] = useState(null);
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState(null);

    function afficherAdresseAbregee(adresse, debut = 6, fin = 4) {
        if (!adresse || adresse.length < debut + fin) {
            return adresse;
        }
        return `${adresse.slice(0, debut)}...${adresse.slice(-fin)}`;
    }

    useEffect(() => {
        if (!window.ethereum) return alert("Installez MetaMask !");



        try {
            const accounts = window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("🔑 Compte connecté :", accounts[0]);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const _signer = provider.getSigner();
            const _contract = new ethers.Contract(CONTRACT_ADDRESS, CapsuleNFT.abi, _signer);
            setWalletConnected(true);
            setSigner(_signer);
            setContract(_contract);

            if (window.ethereum) {
                window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
                    if (accounts.length > 0) {
                        console.log("✅ MetaMask détecté. Compte :", accounts[0]);
                        setAccount(accounts[0]);
                    } else {
                        console.log("⚠️ MetaMask ouvert mais non connecté.");
                    }
                });
            } else {
                console.log("❌ MetaMask non trouvé.");
            }

        } catch (error) {
            alert("Connexion échouée : " + error.message);
            console.error(error);
        }
    }, []);

    async function connectWallet() {
        if (!window.ethereum) return alert("Installez MetaMask !");

        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("🔑 Compte connecté :", accounts[0]);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const _signer = await provider.getSigner();
            const _contract = new ethers.Contract(CONTRACT_ADDRESS, CapsuleNFT.abi, _signer);
            setWalletConnected(true);
            setSigner(_signer);
            setContract(_contract);

        } catch (error) {
            alert("Connexion échouée : " + error.message);
            console.error(error);
        }
    }

    return <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
                <h1 className="text-2xl font-['Pacifico'] text-primary">CapsuleTemps</h1>
                <nav className="hidden md:flex ml-10">
                    <a href="/" className="px-4 py-2 text-gray-700 hover:text-primary font-medium">Accueil</a>
                    <a href="#how-it-works" className="px-4 py-2 text-gray-700 hover:text-primary font-medium">Comment ça marche</a>
                    <a href="#my-capsules" className="px-4 py-2 text-gray-700 hover:text-primary font-medium">Mes capsules</a>
                    <a href="#faq" className="px-4 py-2 text-gray-700 hover:text-primary font-medium">FAQ</a>
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center text-sm text-gray-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Réseau: Ethereum
                </div>

                {
                    walletConnected ? (
                        <button className={`bg-green-600 text-white px-4 py-2 rounded-button whitespace-nowrap flex items-center`}>
                            <div className="w-5 h-5 flex items-center justify-center mr-2">
                                <i className="ri-wallet-3-line"></i>
                            </div>
                            {afficherAdresseAbregee(account)}
                        </button>

                    ) : (
                        <button onClick={connectWallet} className={`bg-primary text-white px-4 py-2 rounded-button whitespace-nowrap flex items-center`}>
                            <div className="w-5 h-5 flex items-center justify-center mr-2">
                                <i className="ri-wallet-3-line"></i>
                            </div>
                            Connecter Wallet
                        </button>
                    )
                }

                <button className="md:hidden w-10 h-10 flex items-center justify-center text-gray-700">
                    <i className="ri-menu-line ri-lg"></i>
                </button>
            </div>
        </div>
    </header>
}