const hbs = require('hbs');
const constant = require('./app_server/Utils/constant');

hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
hbs.registerHelper("myAppend", function(str, suffix) {
    return String(str) + String(suffix);
});
hbs.registerHelper("getUserType", function(type) {
    return Object.keys(constant.type).find(key => constant.type[key] === type);
});
hbs.registerHelper("parseDate", function(dateString, seperator) {
    seperator = seperator || '-';
    const date = new Date(dateString);
    return [("0" + date.getDate()).slice(-2), ("0" + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(seperator);
});
hbs.registerHelper("parseDateInput", function(dateString, seperator) {
    seperator = seperator || '-';
    const date = new Date(dateString);
    return [date.getFullYear(), ("0" + (date.getMonth() + 1)).slice(-2), ("0" + date.getDate()).slice(-2)].join(seperator);
});
hbs.registerHelper("parseDateTime", function(dateString, seperator) {
    seperator = seperator || '-';
    const date = new Date(dateString);
    return [("0" + date.getDate()).slice(-2), ("0" + (date.getMonth() + 1)).slice(-2), date.getFullYear()].join(seperator) + ' ' + [("0" + date.getHours()).slice(-2), ("0" + date.getMinutes()).slice(-2)].join(':');
});
hbs.registerHelper("numberWithCommas", function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});
hbs.registerHelper("getStatusMsg", function(status) {
    if (status)
        return "Hoạt động";
    else
        return "Khóa";
});
hbs.registerHelper("getStatusColor", function(status) {
    if (status)
        return "#333333";
    else
        return "#D44638";
});
const handlebarsHelpers = require('handlebars-helpers');
const helpers =  handlebarsHelpers();
// app.helper({'is': helpers.is});
hbs.registerHelper("is", helpers.is);
hbs.registerHelper("compare", helpers.compare);
hbs.registerHelper("default", helpers.default);
hbs.registerHelper("append", helpers.append);

module.exports = hbs;
