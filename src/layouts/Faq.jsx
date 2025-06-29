import { useState } from 'react';

function FaqItem({ question, answer }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-sm mb-2">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-4 text-left font-medium"
            >
                <span>{question}</span>
                <i className={`ri-${open ? 'subtract' : 'add'}-line text-primary`} />
            </button>
            <div className={`${open ? '' : 'hidden'} px-4 py-2 text-gray-600`}>
                {answer}
            </div>
        </div>
    );
}

export default function FAQ() {
    const faqs = [
        { question: "Comment fonctionne la technologie blockchain derrière CapsuleTemps ?", answer: "CapsuleTemps utilise la blockchain Ethereum pour créer des NFTs (jetons non fongibles) qui représentent vos capsules temporelles. Le contenu réel est stocké de manière sécurisée sur IPFS ou Arweave, avec un cryptage de bout en bout. Les conditions de déverrouillage sont programmées via des contrats intelligents qui exécutent automatiquement les règles que vous définissez." },
        { question: "Ai-je besoin de connaissances techniques pour utiliser CapsuleTemps ?", answer: "Non, CapsuleTemps est conçu pour être accessible à tous, même sans connaissances en cryptomonnaies ou en blockchain. Notre interface intuitive vous guide à travers chaque étape. Vous aurez simplement besoin d'un portefeuille numérique comme MetaMask, que nous vous aiderons à configurer si nécessaire." },
        { question: "Que se passe-t-il si je perds l'accès à mon portefeuille ?", answer: "Nous recommandons fortement de conserver en lieu sûr votre phrase de récupération (seed phrase) de votre portefeuille. Cependant, CapsuleTemps propose également une option de récupération multi-signature qui permet de désigner des gardiens de confiance qui peuvent vous aider à récupérer l'accès à vos capsules en cas de perte de votre portefeuille principal." },
        { question: "Quels sont les frais associés à l'utilisation de CapsuleTemps ?", answer: "Non, CapsuleTemps est conçu pour être accessible à tous, même sans connaissances en cryptomonnaies ou en blockchain. Notre interface intuitive vous guide à travers chaque étape. Vous aurez simplement besoin d'un portefeuille numérique comme MetaMask, que nous vous aiderons à configurer si nécessaire." },

    ];

    return (
        <div>
            {faqs.map((faq, idx) => (
                <FaqItem key={idx} {...faq} />
            ))}
        </div>
    );
}
