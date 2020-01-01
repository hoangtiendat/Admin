const SALT_ROUNDS = 15;
const type = {
    superAdmin: 0,
    admin: 1,
    customer: 2
}
const perPage = 5;
const paginationMax = 5;
const currency = "VND";
const productPerPage = 8;
const urlImageSeperator = ", ";
const topLimit = 10;
const defaultShipCharge = 5000;
const billDefaultStatus = "Chưa giao";
const billStatus = {
    waiting: "Chưa giao",
    onGoing: "Đang giao",
    complete: "Đã giao"
};
const millisecondOfDay = 24 * 60 * 60 * 1000;
const millisecondOfWeek = millisecondOfDay * 7;
const chartDay = 10;
const chartWeekRange = 15;
const numOfWeekPerYear = 54;
const numOfMonth = 12;
const numOfQuarter = 4;
const monthOfQuarter = 3;
const chartYearRange = 5;
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
function parseDateMonth(date, seperator = "-") {
    return [("0" + date.getDate()).slice(-2), ("0" + (date.getMonth() + 1)).slice(-2)].join(seperator);
}
function createProductImageName(productId, num, extension){
    return `product_${productId}_image_${num}${extension}`;
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
    topLimit,
    defaultShipCharge,
    billDefaultStatus,
    billStatus,
    millisecondOfDay,
    millisecondOfWeek,
    chartDay,
    chartWeekRange,
    numOfWeekPerYear,
    numOfMonth,
    numOfQuarter,
    monthOfQuarter,
    chartYearRange,
    parseDateMonth,
    createProductImageName
};
