const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const constant = require('../Utils/constant');

const account = process.env.AZURE_BLOB_ACCOUNT;
const accountKey = process.env.AZURE_BLOB_KEY;
const containerName = process.env.AZURE_BLOB_CONTAINER_NAME;

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function uploadImage(productId, image, extension) {
    let allBlobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
        allBlobs.push(blob.name);
    }
    const allBlobsStr = allBlobs.join(" ");
    let num = 1;
    let imageName = constant.createProductImageName(productId, num, "");
    while (allBlobsStr.includes(imageName)){
        num++;
        imageName = constant.createProductImageName(productId, num, "");
    }
    imageName += extension;
    const blockBlobClient = containerClient.getBlockBlobClient(imageName);
    const uploadBlobResponse = await blockBlobClient.upload(image.buffer, image.size);
    return blockBlobClient.url;
}
async function deleteImages(imageNames){
    let allBlobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
        allBlobs.push(blob.name);
    }
    let deletePromises = imageNames.map((imageName) => {
        return new Promise(async (resolve, reject) => {
            try {
                const deleteBlock = allBlobs.filter((blob) => {
                    return blob.includes(imageName);
                })
                if (deleteBlock.length > 0){
                    let result = await containerClient.deleteBlob(deleteBlock[0], {
                        deleteSnapshots: "include"
                    });
                    resolve(result);
                }
                resolve(1);
            } catch (err) {
                console.log(err);
            }
        })
    });
    return Promise.all(deletePromises);
}
module.exports = {
    uploadImage: uploadImage,
    deleteImages: deleteImages
}
