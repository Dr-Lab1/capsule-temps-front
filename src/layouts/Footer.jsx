export function Footer() {
    return <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
                <div>
                    <h3 className="text-xl font-['Pacifico'] mb-6">CapsuleTemps</h3>
                    <p className="text-gray-400 mb-6">Préservez votre héritage numérique pour les générations futures grâce à la technologie blockchain.</p>
                    <div className="flex space-x-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary/20">
                            <i className="ri-twitter-x-line"></i>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary/20">
                            <i className="ri-facebook-fill"></i>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary/20">
                            <i className="ri-instagram-line"></i>
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary/20">
                            <i className="ri-telegram-line"></i>
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-medium mb-4 text-lg">Produit</h4>
                    <ul className="space-y-3">
                        <li><a href="#" className="text-gray-400 hover:text-white">Fonctionnalités</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Tarifs</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Cas d'utilisation</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Sécurité</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Roadmap</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-medium mb-4 text-lg">Ressources</h4>
                    <ul className="space-y-3">
                        <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Communauté</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-medium mb-4 text-lg">Entreprise</h4>
                    <ul className="space-y-3">
                        <li><a href="#" className="text-gray-400 hover:text-white">À propos</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Équipe</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Carrières</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Partenaires</a></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-800 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">© 2025 CapsuleTemps. Tous droits réservés.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-500 hover:text-white text-sm">Conditions d'utilisation</a>
                        <a href="#" className="text-gray-500 hover:text-white text-sm">Politique de confidentialité</a>
                        <a href="#" className="text-gray-500 hover:text-white text-sm">Mentions légales</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
}