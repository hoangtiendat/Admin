const hbs = require('hbs');
const constant = require('./app_server/Utils/constant');

hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
hbs.registerHelper("dec", function(value, options)
{
    return parseInt(value) - 1;
});
hbs.registerHelper("myAppend", function(str, suffix) {
    return String(str) + String(suffix);
});
hbs.registerHelper("getUserType", function(type) {
    return constant.getUserType(type);
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
hbs.registerHelper("numberizeBoolean", function(bool) {
    return (bool)? 1:0;
});
hbs.registerHelper("getStatusMsg", function(status) {
    if (status)
        return "Hoạt động";
    else
        return "Khóa";
});
hbs.registerHelper("getStatusColor", function(status) {
    if (status)
        return "#3c763d";
    else
        return "#D44638";
});
hbs.registerHelper("getStatusBlockMsg", function(status) {
    if (status)
        return "Khóa TK";
    else
        return "Mở khóa";
});
hbs.registerHelper("getStatusBlockMsgBill", function(status) {
    if (status == "Chưa giao")
        return "Đang giao";
    else if (status == "Đang giao")
        return "Đã giao";
    else
        return "Chưa giao"
});
hbs.registerHelper("getStatusBlockBtnClass", function(status) {
    if (status)
        return "btn-danger";
    else
        return "btn-success";
});
hbs.registerHelper("getStatusBlockBtnClassBill", function(status) {
    if (status == "Chưa giao")
        return "btn-primary";
    else if (status == "Đang giao")
        return "btn-success";
    else
        return "btn-danger"
});
hbs.registerHelper("generatePagination", function(route, page, count) {
    let pageStr = "";
    const pageMax = constant.paginationMax;
    let i = (page > pageMax)? page - (pageMax - 1): 1;
    if (i !== 1)
        pageStr += `<li class="page-item disabled"><a class="page-link" href="">...</a></li>`;
    for (; i <= page +  pageMax - 1 && i <= count; i++){
       if (i === page)
           pageStr += `<li class="page-item active"><a class="page-link" href="#">${i}</a></li>`;
       else
           pageStr += `<li class="page-item"><a class="page-link" href="/${route}?page=${i}">${i}</a></li>`;
       if (i === page + pageMax - 1 && i < count)
           pageStr += `<li class="page-item disabled"><a class="page-link" href="">...</a></li>`;
    }
    return pageStr;
});
hbs.registerHelper("formatPrice", function(price, isAppendCurrency = true) {
    if (isAppendCurrency)
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + constant.currency;
    else
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});
hbs.registerHelper("select", function(value, options) {
    return options.fn(this)
        .split('\n')
        .map(function(v) {
            const t = 'value="' + value + '"'
            return ! RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
        })
        .join('\n')
});
hbs.registerHelper("check", function(value, options) {
    return options.fn(this)
        .split('\n')
        .map(function(v) {
            const t = 'value="' + value + '"'
            return ! RegExp(t).test(v) ? v : v.replace(t, t + ' checked="checked"')
        })
        .join('\n')
});
hbs.registerHelper("getBillStatusClass", function(status) {
    switch (status) {
        case constant.billStatus.waiting:
            return "text-danger";
        case constant.billStatus.onGoing:
            return "text-warning";
        case constant.billStatus.complete:
            return "text-success";
        default:
            return "";
    }
});
const handlebarsHelpers = require('handlebars-helpers');
const helpers =  handlebarsHelpers();
// app.helper({'is': helpers.is});
hbs.registerHelper("is", helpers.is);
hbs.registerHelper("compare", helpers.compare);
hbs.registerHelper("default", helpers.default);
hbs.registerHelper("append", helpers.append);
hbs.registerHelper("compare", helpers.compare);
module.exports = hbs;
