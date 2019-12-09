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
const handlebarsHelpers = require('handlebars-helpers');
const helpers =  handlebarsHelpers();
// app.helper({'is': helpers.is});
hbs.registerHelper("is", helpers.is);
hbs.registerHelper("compare", helpers.compare);
hbs.registerHelper("default", helpers.default);
hbs.registerHelper("append", helpers.append);

module.exports = hbs;
