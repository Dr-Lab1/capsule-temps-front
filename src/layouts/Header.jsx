import { useState } from "react";

export function Header() {

    const [connected, setConnected] = useState(false);

    const handleConnect = () => {
        setConnected(!connected);
    };

    return <header class="bg-white shadow-sm">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <h1 class="text-2xl font-['Pacifico'] text-primary">CapsuleTemps</h1>
                <nav class="hidden md:flex ml-10">
                    <a href="/" class="px-4 py-2 text-gray-700 hover:text-primary font-medium">Accueil</a>
                    <a href="#how-it-works" class="px-4 py-2 text-gray-700 hover:text-primary font-medium">Comment ça marche</a>
                    <a href="#my-capsules" class="px-4 py-2 text-gray-700 hover:text-primary font-medium">Mes capsules</a>
                    <a href="#faq" class="px-4 py-2 text-gray-700 hover:text-primary font-medium">FAQ</a>
                </nav>
            </div>
            <div class="flex items-center space-x-4">
                <div class="hidden md:flex items-center text-sm text-gray-500">
                    <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Réseau: Ethereum
                </div>

                {
                    connected ? (
                        <button onClick={handleConnect} class={`bg-green-600 text-white px-4 py-2 rounded-button whitespace-nowrap flex items-center`}>
                            <div class="w-5 h-5 flex items-center justify-center mr-2">
                                <i class="ri-wallet-3-line"></i>
                            </div>
                            0x7Fc9...3E4b
                        </button>

                    ) : (
                        <button onClick={handleConnect} class={`bg-primary text-white px-4 py-2 rounded-button whitespace-nowrap flex items-center`}>
                            <div class="w-5 h-5 flex items-center justify-center mr-2">
                                <i class="ri-wallet-3-line"></i>
                            </div>
                            Connecter Wallet
                        </button>
                    )
                }

                <button class="md:hidden w-10 h-10 flex items-center justify-center text-gray-700">
                    <i class="ri-menu-line ri-lg"></i>
                </button>
            </div>
        </div>
    </header>
}