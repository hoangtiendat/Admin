const mongoose = require('mongoose');
const Product = mongoose.model('Product');


module.exports = {
  getProductById(id){
    return Product.findOne({"productId": id}).exec();
  },
  getProductByCategory(category){
    return Product.find({"category": category}).exec();
  },
  getProductBySource(source){
    return Product.find({"source": source}).exec();
  }
};
