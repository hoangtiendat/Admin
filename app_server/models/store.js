const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const constant = require('../Utils/constant');

module.exports = {
    getAllStoreName(){
        return Store.find({})
            .select("storeId name")
            .exec();
    },
    getStoreInPage(page){
        return Store.find({}).populate("brand")
                    .skip((constant.perPage * page) - constant.perPage)
                    .limit(constant.perPage)
                    .exec();
    },
    countStore(){
        return Store.count().exec();
    },
    getStore(storeId){
        return Store.findOne({storeId: storeId}).populate("brand");
    }
};
