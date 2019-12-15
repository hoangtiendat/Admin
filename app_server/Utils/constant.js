const SALT_ROUNDS = 15;
const type = {
    superAdmin: 0,
    admin: 1,
    customer: 2
}
function getUserType(typeStr){
    Object.keys(type).find(key => type[key] === typeStr);
}
module.exports = {
    SALT_ROUNDS,
    type,
    getUserType
}
