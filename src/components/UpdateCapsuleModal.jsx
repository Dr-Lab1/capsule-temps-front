// components/CapsuleModal.jsx
import React from "react";

export default function UpdateCapsuleModal({ capsule, onClose }) {
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
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Mettre à jour : {capsule.name}</h1>
                            <button type="button" class="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        <div class="row modal-body d-flex justify-content-center">

                            <div class="col-10 mb-3">
                                <label for="name" class="form-label">Name</label>
                                <input type="text" class="form-control" id="name" value={capsule.name}/>
                            </div>
                            <div class="col-10 mb-3">
                                <label for="description" class="form-label">Description</label>
                                <textarea class="form-control" id="description" rows="3" value={capsule.description} />
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
