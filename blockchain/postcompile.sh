#!/bin/bash

# Variables
SRC="artifacts/contracts/CapsuleNFT.sol/CapsuleNFT.json"
DEST="../src/abi/CapsuleNFT.json"

# Créer le dossier cible s’il n’existe pas
mkdir -p "$(dirname "$DEST")"

# Copier le fichier
cp "$SRC" "$DEST"

echo "✅ ABI copiée vers le projet React."
