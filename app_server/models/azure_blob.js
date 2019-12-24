const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

const account = process.env.AZURE_BLOB_ACCOUNT;
const accountKey = process.env.AZURE_BLOB_KEY;
const containerName = process.env.AZURE_BLOB_CONTAINER_NAME;

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function uploadImage(image, imageName) {
    const blockBlobClient = containerClient.getBlockBlobClient(imageName);
    const uploadBlobResponse = await blockBlobClient.upload(image.buffer, image.size);
    return blockBlobClient.url;
}
module.exports = {
    uploadImage: uploadImage
}
