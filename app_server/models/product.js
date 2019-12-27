const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const StoreModel = require('./store');
const constant = require('../Utils/constant');
const azureBlob = require('./azure_blob');

module.exports = {
  getProductById(id){
    return Product.findOne({"productId": id})
        .populate({
          path: "store",
          populate: {
            path: "brand"
          }
        })
        .populate("category")
        .exec();
  },
  getProductByCategory(category){
    return Product.find({"category": category}).exec();
  },
  getProductBySource(source){
    return Product.find({"source": source}).exec();
  },
  getProductByStoreIdInPage(storeId, page){
    return Product.find({"storeId": storeId})
                  .skip((constant.productPerPage * page) - constant.productPerPage)
                  .limit(constant.productPerPage);
  },
  countProductOfStore(storeId){
    return Product.count({storeId: storeId}).exec();
  },
  getTopSaleProduct(limit){
    return Product.find({})
        .sort({purchaseCount: -1})
        .limit(limit)
        .exec();
  },
  getTopSaleProductOfStore(storeId, limit){
    return Product.find({storeId: storeId})
        .sort({purchaseCount: -1})
        .limit(limit)
        .exec();
  },
  async uploadProductImages(productId, imageNum, image){
    const extension = image.originalname.slice(image.originalname.lastIndexOf('.'));
    const imageName = "product_" + productId+ "_image_" + imageNum + extension;
    return await azureBlob.uploadImage(image, imageName);
  },
  setProductUrlImage(productId, urlImage){
    Product.findOneAndUpdate({productId: productId}, {urlImage: urlImage}).exec();
  },
  async increasePurchaseCount(productId, value){
    const product = await Product.findOneAndUpdate({productId: productId}, {$inc: {purchaseCount: value}}).exec();
    await StoreModel.increasePurchaseCount(product.storeId, value);
    return Promise.resolve();
  }
};
