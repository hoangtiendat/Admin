const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const ProductModel = require('./product');
const Bill = mongoose.model('Bill');
const BillDetail = mongoose.model('BillDetail');
const Store = mongoose.model('Store');
const Brand = mongoose.model('Brand');
const constant = require('../Utils/constant');

module.exports = {
    getBillInPage(page){
        return Bill.find()
            .skip((constant.perPage * page) - constant.perPage)
            .limit(constant.perPage)
            .sort({purchaseDate: -1})
            .populate("buyer")
            .exec();
    },
    countBill(){
        return Bill.count().exec();
    },
    getBill(billId){
        return Bill.findOne({billId: billId})
            .populate({
                path: "billDetail",
                populate: "product"
            })
            .populate("buyer")
            .exec();
    },
    addBillDetail(billId, productId, amount){
        const billDetail = new BillDetail({
            billId: billId,
            productId: productId,
            amount: amount
        });
        return billDetail.save();
    },
    async addBill(buyerId, products, info){
        try {
            const productIds = products.map((product) => product.productId);
            const prices = await Product.find({productId: {$in: productIds}})
                .select("productId discount price")
                .exec();
            const totalPrice = products.reduce((totalPrice, product) => {
                let price = prices.filter((price) => price.productId === product.productId)[0];
                price = parseInt(price.price) - parseInt(price.discount);
                return totalPrice + price * product.amount;
            }, 0);
            const bill = new Bill({
                buyerId: buyerId,
                receiverName: info.receiverName || "",
                phone: info.phone || "",
                email: info.email || "",
                address: info.address || "",
                city: info.city || "",
                description: info.description || "",
                totalPrice: totalPrice || 0,
                shipCharge: info.shipCharge || constant.defaultShipCharge,
                purchaseDate: info.purchaseDate || Date.now(),
                deliveryDate: "",
                status: constant.billDefaultStatus,
            });
            const result = await bill.save();
            for (let product of products){
                await this.addBillDetail(bill.billId, product.productId, product.amount);
                await ProductModel.increasePurchaseCount(product.productId, product.amount);
            }
            return result;
        } catch(err){
            console.log(err);
        }
    },
    setStatus(billId, status){
        if (status === constant.billStatus.complete){
            return Bill.findOneAndUpdate({billId}, {status: status, deliveryDate: Date.now()}).exec();
        }
        return Bill.findOneAndUpdate({billId}, {status: status}).exec();
    }
};
