// components/CapsuleModal.jsx
import React from "react";

export default function CapsuleModal({ capsule, onClose }) {
    if (!capsule) return null;

    function formatTimestamp(timestampBigInt) {
        const date = new Date(Number(timestampBigInt) * 1000); // convertir en millisecondes

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");

        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        const sec = String(date.getSeconds()).padStart(2, "0");

        return `${dd}-${mm}-${yyyy} à ${hh}:${min}:${sec}`;
    }

    return (

        <>
            <div className="modal show d-block" tabIndex="-1" role="dialog">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">{capsule.name}</h1>
                            <button type="button" class="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <div>
                                <p><strong>Nom :</strong> {capsule.name} </p>
                                <p><strong>Description :</strong> {capsule.description}</p>
                                <p><strong>Héritier :</strong> {capsule.heir}</p>
                                <p><strong>Date de déverrouillage :</strong> { formatTimestamp(capsule.unlockDate) }</p>
                                <p><strong>Réclamée :</strong> {capsule.claimed ? "Oui" : "Non"}</p>
                                <p><strong>Solde :</strong> {capsule.balance} wei</p>
                                <a href={`https://crimson-gigantic-swift-833.mypinata.cloud/ipfs/${capsule.uri}`} target="_blank" rel="noopener noreferrer">
                                    📄 Voir le contenu IPFS
                                </a>
                            </div>

                        </div>
                        <div class="modal-footer">
                            <button type="button" onClick={onClose} class="btn btn-secondary">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
