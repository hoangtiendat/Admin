const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const Bill = mongoose.model('Bill');
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
  async uploadProductImages(productId, image){
    const extension = image.originalname.slice(image.originalname.lastIndexOf('.'));
    return await azureBlob.uploadImage(productId, image, extension);
  },
  async deleteProductImages(productImages){
    const imageNames = productImages.map((productImage) => {
      return constant.createProductImageName(productImage.productId, productImage.imageNum, productImage.extension || "");
    });
    const results =  await azureBlob.deleteImages(imageNames);
    let errors = [];
    results.forEach((result, index) => {
      if (result.errorCode)
        errors.push(index);
    });
    return errors;
  },
  setProductUrlImage(productId, urlImage){
    Product.findOneAndUpdate({productId: productId}, {urlImage: urlImage}).exec();
  },
  setProductInfo(productId, info){
    return Product.findOneAndUpdate({productId: productId}, {
      name: info.name || "",
      new: info.new || false,
      price: (info.price)? parseInt(info.price) : 0,
      discount: (info.discount)? parseInt(info.discount) : 0,
      categoryId: (info.categoryId)? parseInt(info.categoryId) : 1,
      storeId: (info.storeId)? parseInt(info.storeId) : 1,
      description: info.description || "",
    }).exec();
  },
  async increasePurchaseCount(productId, value){
    const product = await Product.findOneAndUpdate({productId: productId}, {$inc: {purchaseCount: value}}).exec();
    await StoreModel.increasePurchaseCount(product.storeId, value);
    return Promise.resolve();
  },
  async statisticByDay(day){
    return new Promise( (resolve, reject) => {
      Bill.aggregate([
        {
          $match: {
            "purchaseDate": {
              $gte: new Date(Date.now() - constant.millisecondOfDay * day),
              $lte: new Date()
            }
          }
        },
        {
          $lookup: {
            from: 'billdetails',
            localField: 'billId',
            foreignField: 'billId',
            as: 'BillDetail'
          },
        },
        { $unwind: "$BillDetail" },
        {
          $group: {
            _id: "$purchaseDate",
            purchaseCount: {
              $sum: "$BillDetail.amount"
            }
          },
        },
        {
          $sort: { _id: 1}
        }
      ]).then((statistics) => {
        let result = Array(day).fill(0);
        const startDate = Date.now() - constant.millisecondOfDay * day;
        for (let statistic of statistics){
          result[Math.floor((statistic._id.getTime() - startDate) / constant.millisecondOfDay)] = statistic.purchaseCount;
        }
        resolve(result);
      });
    })
  },
  async statisticByWeek(weekRange, year) {
    return new Promise((resolve, reject) => {
      Bill.aggregate([
        {
          $match: {
            "purchaseDate": {
              $gte: new Date(Date.now() - constant.millisecondOfWeek * weekRange),
              $lte: new Date()
            }
          }
        },
        {
          $lookup: {
            from: 'billdetails',
            localField: 'billId',
            foreignField: 'billId',
            as: 'BillDetail'
          },
        },
        {$unwind: "$BillDetail"},
        {
          $group: {
            _id: {$week: "$purchaseDate"},
            purchaseCount: {
              $sum: "$BillDetail.amount"
            },
          },
        },
        {
          $sort: {_id: 1}
        }
      ]).then((statistics) => {
        const currentWeek = Math.floor((Date.now() - new Date(year + "/01/01" ).getTime()) / constant.millisecondOfWeek);
        const startWeek = (currentWeek - (weekRange - 1) + constant.numOfWeekPerYear - 1) % (constant.numOfWeekPerYear - 1);
        let result = Array(weekRange).fill(0);
        for (let statistic of statistics) {
          result[statistic._id - startWeek] = statistic.purchaseCount;
        }
        let weeks = [];
        for (let i = startWeek; i <= currentWeek; i++)
          weeks.push(i);
        resolve([result, weeks]);
      });
    })
  },
  async statisticByMonth(year){
    return new Promise( (resolve, reject) => {
      Bill.aggregate([
        {
          $match: {
            "purchaseDate": {
              $gte: new Date(year + "/01/01"),
              $lte: new Date(year + "/12/31")
            }
          }
        },
        {
          $lookup: {
            from: 'billdetails',
            localField: 'billId',
            foreignField: 'billId',
            as: 'BillDetail'
          },
        },
        { $unwind: "$BillDetail" },
        {
          $group: {
            _id: {$month: "$purchaseDate"},
            purchaseCount: {
              $sum: "$BillDetail.amount"
            }
          },
        },
        {
          $sort: { _id: 1}
        }
      ]).then((statistics) => {
        let result = Array(constant.numOfMonth).fill(0);
        for (let statistic of statistics){
          result[statistic._id - 1] = statistic.purchaseCount;
        }
        resolve(result);
      });
    })
  },
  async statisticByQuarter(year) {
    return new Promise((resolve, reject) => {
      Bill.aggregate([
        {
          $match: {
            "purchaseDate": {
              $gte: new Date(year + "/01/01"),
              $lte: new Date(year + "/12/31")
            }
          }
        },
        {
          $lookup: {
            from: 'billdetails',
            localField: 'billId',
            foreignField: 'billId',
            as: 'BillDetail'
          },
        },
        {
          $project:
              {
                "purchaseDate": "$purchaseDate",
                "BillDetail": "$BillDetail",
                "quarter":
                    {$cond:[{$lte:[{$month:"$purchaseDate"},3]},
                      0,
                    {$cond:[{$lte:[{$month:"$purchaseDate"},6]},
                      1,
                    {$cond:[{$lte:[{$month:"$purchaseDate"},9]},
                      2,
                      3]}]}]}
              }
        },
        {$unwind: "$BillDetail"},
        {
          $group: {
            _id: "$quarter",
            purchaseCount: {
              $sum: "$BillDetail.amount"
            }
          },
        },
        {
          $sort: {_id: 1}
        }
      ]).then((statistics) => {
        let result = Array(constant.numOfQuarter).fill(0);
        for (let statistic of statistics) {
          result[statistic._id] = statistic.purchaseCount;
        }
        resolve(result);
      });
    })
  },
  async statisticByYear(start, end) {
    return new Promise((resolve, reject) => {
      Bill.aggregate([
        {
          $match: {
            "purchaseDate": {
              $gte: new Date(start + "/01/01"),
              $lte: new Date(end + "/12/31")
            }
          }
        },
        {
          $lookup: {
            from: 'billdetails',
            localField: 'billId',
            foreignField: 'billId',
            as: 'BillDetail'
          },
        },
        {$unwind: "$BillDetail"},
        {
          $group: {
            _id: {$year: "$purchaseDate"},
            purchaseCount: {
              $sum: "$BillDetail.amount"
            }
          },
        },
        {
          $sort: {_id: 1}
        }
      ]).then((statistics) => {
        const numOfYear = end - start + 1;
        let result = Array(numOfYear).fill(0);
        for (let statistic of statistics) {
          result[(statistic._id  - start) % numOfYear] = statistic.purchaseCount;
        }
        resolve(result);
      });
    })
  }
};
