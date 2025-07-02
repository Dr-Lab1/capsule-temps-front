import { useState, useEffect } from 'react'
import './App.css'

import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'

import { ethers } from "ethers";
import CapsuleNFT from "./abi/CapsuleNFT.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

import FAQ from "./layouts/Faq";


function App() {

  const [capsule, setCapsule] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [timer, setTimer] = useState(0);

  const [files, setFiles] = useState([]);
  const [unlockDate, setUnlockDate] = useState("");
  const [tokenId, setTokenId] = useState("");

  const [formData, setFormData] = useState({
    capsuleName: "",
    heir: "",
    description: "",
    date: "",
    // files: [],
    unlockDate: "",
    tokenId: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  setInterval(() => {
    setTimer(timer + 1);
    console.log('Timer', timer);
  }, 10000);

  async function connectWallet() {
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
  }

  const uploadToIPFS = async () => {
    if (!files.length) return null;

    const formData = new FormData();
    for (let file of files) {
      formData.append("file", file);
    }

    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        pinata_api_key: "adec57c97b7db3569823",
        pinata_secret_api_key: "dea0875c91969eff91dc768667fa7424485996a997816455a98bf03306069601",
      },
    });

    return `ipfs://${res.data.IpfsHash}`;
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  async function mintCapsule() {
    if (!contract) return;

    try {
      const uri = await uploadToIPFS();

      const { heir, date } = formData;
      const unlockDate = Math.floor(new Date(date).getTime() / 1000);

      const tx = await contract.mintCapsule(heir, unlockDate, uri, {
        value: ethers.parseEther("0.01"),
      });
      await tx.wait();
      alert("Capsule créée !");
    } catch (error) {
      alert("Erreur : " + error.message);
    }

  }

  async function getCapsule(id) {
    if (!contract) return;
    try {
      const data = await contract.getCapsule(id);
      setCapsule(data);
    } catch (err) {
      alert("Capsule introuvable");
    }
  }

  async function claimCapsule(id) {
    if (!contract) return;
    try {
      const tx = await contract.claimCapsule(id);
      await tx.wait();
      alert("Capsule réclamée !");
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  }

  useEffect(() => {
    connectWallet();
  }, [timer]);

  return <>
    <Header walletConnected={walletConnected} account={account} connectWallet={connectWallet} />
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden"
        style={{
          backgroundImage: "url('https://readdy.ai/api/search-image?query=A%20modern%20digital%20time%20capsule%20concept%20with%20blockchain%20technology%2C%20showing%20a%20futuristic%20interface%20with%20glowing%20capsules%20containing%20documents%20and%20memories.%20The%20image%20has%20a%20gradient%20blue%20to%20purple%20background%20with%20soft%20lighting%2C%20African%20cultural%20elements%20subtly%20integrated%2C%20and%20a%20clean%20minimalist%20design&width=1600&height=800&seq=hero1&orientation=landscape')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }} >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-transparent"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Préservez votre héritage numérique pour les générations futures</h1>
            <p className="text-xl mb-8">Créez des capsules temporelles numériques sécurisées sur la blockchain pour transmettre vos documents importants, souvenirs et messages à vos proches.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#create-my-capsule" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-button whitespace-nowrap font-medium">
                Créer ma première capsule
              </a>
              <button className="bg-white hover:bg-gray-100 text-primary px-6 py-3 rounded-button whitespace-nowrap font-medium">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-16 bg-white" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comment fonctionne CapsuleTemps</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Une solution simple et sécurisée pour préserver et transmettre vos données importantes grâce à la technologie blockchain.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <i className="ri-file-upload-line ri-xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Créez votre capsule</h3>
              <p className="text-gray-600">Téléchargez vos documents, photos, vidéos ou messages et transformez-les en NFT sécurisés sur la blockchain.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <i className="ri-lock-line ri-xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Définissez les conditions</h3>
              <p className="text-gray-600">Programmez quand et comment votre capsule sera accessible : date précise, événement spécifique ou période d'inactivité.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <i className="ri-user-received-line ri-xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Transmettez en toute sécurité</h3>
              <p className="text-gray-600">Désignez vos bénéficiaires qui pourront accéder au contenu de votre capsule lorsque les conditions seront remplies.</p>
            </div>
          </div>
        </div>
      </section>

      <div>
        <h1>Capsule Viewer</h1>
        {capsule ? (
          <pre>{JSON.stringify(capsule, null, 2)}</pre>
        ) : (
          <p>Aucune capsule chargée</p>
        )}
      </div>


      {/* Create Capsule Section */}
      <section className="py-16 bg-gray-50" id="create-my-capsule">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Créer une nouvelle capsule temporelle</h2>

              {/* Tabs */}
              <div className="flex mb-8 bg-gray-100 p-1 rounded-full inline-block align-items-center">
                <ul className="nav nav-pills m-2" id="pills-tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="tab-button active px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium text-gray-700 nav-link" id="pills-documents-tab" data-bs-toggle="pill" data-bs-target="#pills-documents" type="button" role="tab" aria-controls="pills-documents" aria-selected="true">Documents</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="tab-button px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium text-gray-700 nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Cryptos</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="tab-button px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium text-gray-700 nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Messages</button>
                  </li>
                </ul>
              </div>


              <div className="tab-content" id="pills-tabContent">

                <form className="row d-flex tab-pane fade show active" id="pills-documents" role="tabpanel" aria-labelledby="pills-documents-tab" tabindex="0">
                  {/* Left Column: Upload Area */}
                  <div className="col-lg-7">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-primary/50 transition-colors">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-upload-cloud-line ri-2x text-gray-500"></i>
                      </div>
                      <h3 className="text-lg font-medium mb-2">Glissez-déposez vos fichiers ici</h3>
                      <p className="text-gray-500 text-sm mb-4">Formats supportés: PDF, JPG, PNG, MP4 (Max. 100MB)</p>
                      {/* <input type="file" className="bg-primary text-white px-4 py-2 rounded-button whitespace-nowrap" /> */}
                      <input
                        className="form-control px-4 py-2 rounded-button whitespace-nowrap"
                        required type="file"
                        // accept="image/*"
                        id="formFile"
                        name="image"
                        multiple
                        onChange={(e) => setFiles([...e.target.files])}
                      />

                    </div>


                    {files.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-3">Fichiers sélectionnés</h3>
                        <div className="space-y-3">
                          <div className="space-y-3">
                            {files.map((file, idx) => (
                              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg mr-3">
                                    <i className="ri-file-text-line ri-lg text-blue-600"></i>
                                  </div>
                                  <div>
                                    <p className="font-medium">{file.name}</p>
                                    <p className="text-xs text-gray-500">{file.type || 'N/A'}</p>
                                    <p className="text-xs text-gray-500">{(file.size / (1024 * 1000)).toFixed(2)} MB</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(idx)}
                                  className="text-gray-500 hover:text-red-500"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-lg font-medium mb-3">Type de NFT</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary relative">
                          <input type="radio" name="nft-type" id="erc721" className="sr-only" checked />
                          <label for="erc721" className="flex flex-col items-center cursor-pointer">
                            <span className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full mb-2">
                              <i className="ri-nft-line text-primary"></i>
                            </span>
                            <span className="font-medium">ERC-721</span>
                            <span className="text-xs text-gray-500">NFT unique</span>
                          </label>
                          <div className="absolute top-3 right-3 w-4 h-4 bg-primary rounded-full"></div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary">
                          <input type="radio" name="nft-type" id="erc1155" className="sr-only" />
                          <label for="erc1155" className="flex flex-col items-center cursor-pointer">
                            <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mb-2">
                              <i className="ri-nft-line text-gray-500"></i>
                            </span>
                            <span className="font-medium">ERC-1155</span>
                            <span className="text-xs text-gray-500">NFT multiple</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Settings */}
                  <div className="col-lg-5">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la capsule</label>
                      <input type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        placeholder="Ex: Testament familial"
                        name="capsuleName"
                        value={formData.capsuleName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description (optionnelle)</label>
                      <textarea
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        rows="3"
                        placeholder="Décrivez le contenu de cette capsule..."
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bénéficiaires</label>
                      <div className="flex items-center mb-3">
                        <input
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg"
                          placeholder="Adresse Ethereum ou ENS"
                          name="heir"
                          value={formData.heir}
                          onChange={handleChange}
                        />
                        <button className="bg-primary text-white px-4 py-2 rounded-r-lg whitespace-nowrap">
                          Ajouter
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                              <i className="ri-user-line text-primary"></i>
                            </div>
                            <span className="text-sm">0x7Fc9...3E4b</span>
                          </div>
                          <button className="text-gray-500 hover:text-red-500">
                            <i className="ri-close-line"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Conditions de déverrouillage</label>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input type="checkbox" id="date-condition" className="custom-checkbox mr-2" />
                          <label for="date-condition" className="text-sm">Date spécifique</label>
                        </div>
                        <div className="pl-8">
                          <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                        </div>

                        <div className="flex items-center">
                          <input type="checkbox" id="inactivity-condition" className="custom-checkbox mr-2" />
                          <label for="inactivity-condition" className="text-sm">Période d'inactivité</label>
                        </div>
                        <div className="pl-8">
                          <div className="mb-2">
                            <input type="range" min="1" max="36" value="6" className="custom-range" />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>1 mois</span>
                            <span>6 mois</span>
                            <span>36 mois</span>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <input type="checkbox" id="oracle-condition" className="custom-checkbox mr-2" />
                          <label for="oracle-condition" className="text-sm">Événement externe (Oracle)</label>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Cryptage avancé</label>
                        <label className="custom-switch">
                          <input type="checkbox" checked />
                          <span className="slider"></span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">Le contenu sera crypté et ne pourra être déchiffré que par les bénéficiaires désignés.</p>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">Frais de gas estimés:</span>
                        <span className="font-medium">~0.0042 ETH</span>
                      </div>
                      <button onClick={mintCapsule} className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-button whitespace-nowrap font-medium">
                        Créer ma capsule temporelle
                      </button>
                    </div>
                  </div>
                </form>
                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">...</div>
                <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabindex="0">...</div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* My Capsules Section */}
      <section className="py-16 bg-white" id="my-capsules">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Mes capsules temporelles</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-500">
                  <i className="ri-search-line"></i>
                </div>
              </div>
              <div className="relative">
                <div className="dropdown">
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <span>Trier par</span>
                    <div className="w-4 h-4 flex items-center justify-center ml-2">
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Action</a></li>
                    <li><a className="dropdown-item" href="#">Another action</a></li>
                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Capsule 1 */}
            <div className="capsule-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
              <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                <div className="absolute top-3 right-3 bg-white/90 text-xs font-medium px-2 py-1 rounded-full">
                  Verrouillée
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2">Testament Familial</h3>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <div className="w-4 h-4 flex items-center justify-center mr-1">
                    <i className="ri-time-line"></i>
                  </div>
                  <span>Créée le 12 juin 2025</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <div className="w-4 h-4 flex items-center justify-center mr-1">
                    <i className="ri-lock-line"></i>
                  </div>
                  <span>Déverrouillage: Inactivité (6 mois)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                      <i className="ri-user-line"></i>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                      <i className="ri-user-line"></i>
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary/80">
                    Gérer
                  </button>
                </div>
              </div>
            </div>

            {/* Capsule 2 */}
            <div className="capsule-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
              <div className="h-40 bg-gradient-to-r from-green-500 to-teal-600 relative">
                <div className="absolute top-3 right-3 bg-white/90 text-xs font-medium px-2 py-1 rounded-full">
                  Verrouillée
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2">Titres Fonciers Kinshasa</h3>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <div className="w-4 h-4 flex items-center justify-center mr-1">
                    <i className="ri-time-line"></i>
                  </div>
                  <span>Créée le 3 mai 2025</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <div className="w-4 h-4 flex items-center justify-center mr-1">
                    <i className="ri-calendar-line"></i>
                  </div>
                  <span>Déverrouillage: 15 janvier 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                      <i className="ri-user-line"></i>
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary/80">
                    Gérer
                  </button>
                </div>
              </div>
            </div>

            {/* Capsule 3 */}
            <div className="capsule-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
              <div className="h-40 bg-gradient-to-r from-purple-500 to-pink-600 relative">
                <div className="absolute top-3 right-3 bg-white/90 text-xs font-medium px-2 py-1 rounded-full">
                  Verrouillée
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2">Souvenirs Familiaux</h3>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <div className="w-4 h-4 flex items-center justify-center mr-1">
                    <i className="ri-time-line"></i>
                  </div>
                  <span>Créée le 20 avril 2025</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <div className="w-4 h-4 flex items-center justify-center mr-1">
                    <i className="ri-lock-line"></i>
                  </div>
                  <span>Déverrouillage: Inactivité (12 mois)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                      <i className="ri-user-line"></i>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                      <i className="ri-user-line"></i>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                      <i className="ri-user-line"></i>
                    </div>
                  </div>
                  <button className="text-primary hover:text-primary/80">
                    Gérer
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="text-primary hover:text-primary/80 font-medium">
              Voir toutes mes capsules
            </button>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cas d'utilisation</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Découvrez comment CapsuleTemps peut vous aider à préserver et transmettre vos données importantes.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-56" style={{
                backgroundImage: "url('https://readdy.ai/api/search-image?query=A%20traditional%20African%20family%20gathered%20together%20looking%20at%20documents%2C%20with%20an%20elder%20explaining%20important%20papers%20to%20younger%20family%20members.%20The%20scene%20shows%20warmth%20and%20knowledge%20transfer%20between%20generations%2C%20with%20subtle%20digital%20elements%20suggesting%20blockchain%20technology.%20High%20quality%20photograph%20with%20natural%20lighting&width=600&height=400&seq=usecase1&orientation=landscape')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Préservation du patrimoine familial</h3>
                <p className="text-gray-600 mb-4">Sécurisez vos titres fonciers, actes de propriété et documents familiaux importants contre la perte, les catastrophes naturelles ou les conflits. Assurez la transmission de votre patrimoine à vos héritiers.</p>
                <div className="flex items-center text-primary font-medium">
                  <span>En savoir plus</span>
                  <div className="w-4 h-4 flex items-center justify-center ml-1">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-56" style={{
                backgroundImage: "url('https://readdy.ai/api/search-image?query=A%20digital%20time%20capsule%20concept%20showing%20a%20person%20writing%20a%20heartfelt%20message%20on%20a%20tablet%20with%20holographic%20elements%20floating%20around.%20The%20scene%20depicts%20emotional%20connection%20across%20time%2C%20with%20photographs%20and%20memories%20being%20preserved%20digitally.%20The%20setting%20has%20subtle%20African%20design%20elements%20and%20warm%20lighting&width=600&height=400&seq=usecase2&orientation=landscape')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Messages pour l'avenir</h3>
                <p className="text-gray-600 mb-4">Créez des messages vidéo, lettres ou souvenirs numériques pour vos enfants ou petits-enfants, à délivrer à des moments importants de leur vie comme leurs 18 ans ou leur mariage.</p>
                <div className="flex items-center text-primary font-medium">
                  <span>En savoir plus</span>
                  <div className="w-4 h-4 flex items-center justify-center ml-1">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ce que disent nos utilisateurs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Découvrez comment CapsuleTemps aide les familles à préserver leur héritage numérique.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                </div>
              </div>
              <p className="text-gray-700 mb-6">"Après avoir perdu des documents importants lors des inondations à Kinshasa, j'ai décidé de tout numériser avec CapsuleTemps. Maintenant, je suis serein sachant que mes titres fonciers sont en sécurité et seront transmis à mes enfants."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-medium">Jean-Claude Mutombo</h4>
                  <p className="text-sm text-gray-500">Kinshasa, RDC</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                </div>
              </div>
              <p className="text-gray-700 mb-6">"J'ai créé des capsules temporelles pour chacun de mes petits-enfants, avec des photos et des vidéos de notre famille. Elles s'ouvriront à leurs 18 ans. C'est une façon moderne de préserver notre histoire familiale."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-medium">Marie Ndiaye</h4>
                  <p className="text-sm text-gray-500">Dakar, Sénégal</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-half-fill"></i>
                </div>
              </div>
              <p className="text-gray-700 mb-6">"En tant qu'entrepreneur, j'utilise CapsuleTemps pour sécuriser mes contrats et documents d'entreprise. La technologie blockchain offre une sécurité que les solutions cloud traditionnelles ne peuvent pas égaler."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-medium">Ibrahim Konaté</h4>
                  <p className="text-sm text-gray-500">Abidjan, Côte d'Ivoire</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50" id="faq">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Questions fréquentes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Tout ce que vous devez savoir sur notre service de capsules temporelles numériques.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <FAQ />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Commencez à préserver votre héritage numérique dès aujourd'hui</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Rejoignez des milliers d'utilisateurs qui font confiance à CapsuleTemps pour sécuriser et transmettre leurs données importantes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#create-my-capsule" className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-button whitespace-nowrap font-medium">
              Créer ma première capsule
            </a>
            <button className="bg-transparent border border-white hover:bg-white/10 px-6 py-3 rounded-button whitespace-nowrap font-medium">
              Découvrir nos forfaits
            </button>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
}


export default App;