const mongoose = require('mongoose');
const Param = mongoose.model('Param');
const constant = require('../Utils/constant');

module.exports = {
    getAllCity(){
        return Param.find({paramId: 1}).then((param) => {
            return param[0].city.split(constant.urlImageSeperator);
        });
    }
};
