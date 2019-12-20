const mongoose = require('mongoose');
const Store = mongoose.model('Store');

module.exports = {
    getAllStore(){
        return Store.find({}).populate("brand").exec();
    },
};
