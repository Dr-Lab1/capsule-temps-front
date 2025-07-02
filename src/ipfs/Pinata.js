const pinataSDK = require('@pinata/sdk');
const fs = require('fs');

const pinata = new pinataSDK('adec57c97b7db3569823', 'dea0875c91969eff91dc768667fa7424485996a997816455a98bf03306069601');

const readableStream = fs.createReadStream('./mon_document.pdf');

pinata.pinFileToIPFS(readableStream).then((result) => {
    console.log("CID IPFS :", result.IpfsHash);
}).catch((err) => {
    console.error(err);
});
