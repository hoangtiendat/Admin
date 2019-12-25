const SALT_ROUNDS = 15;
const type = {
    superAdmin: 0,
    admin: 1,
    customer: 2
}
const perPage = 5;
const paginationMax = 5;
const currency = "VND";
const productPerPage = 10
const urlImageSeperator = ", ";
const topLimit = 10;
function getUserType(typeStr){
    return Object.keys(type).find(key => type[key] === typeStr);
}
function splitToChunk(arr, size){
    let temp = [];
    for (let i = 0; i < arr.length; i+=size){
        temp.push(arr.slice(i, i + size));
    }
    return temp;
}
module.exports = {
    SALT_ROUNDS,
    type,
    getUserType,
    perPage,
    paginationMax,
    currency,
    splitToChunk,
    productPerPage,
    urlImageSeperator,
    topLimit
}
