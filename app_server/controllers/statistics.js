const Store = require('../models/Store');
const Product = require('../models/Product');
const constant = require('../Utils/constant');

const statistics_product = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            const storeId = (req.query.storeId)? parseInt(req.query.storeId) : -1;
            const storeNames  = await Store.getAllStoreName();
            const store = (storeId > 0)? await Store.getStore(storeId) : null;
            const topSaleProducts = (storeId > 0)? await Product.getTopSaleProductOfStore(storeId, constant.topLimit) : await Product.getTopSaleProduct(constant.topLimit);
            topSaleProducts.forEach((product) => {
                product.salePrice = parseInt(product.price) - parseInt(product.discount);
                product.urlImage = product.urlImage.split(constant.urlImageSeperator)[0];
            });
            res.render('statistics_product', {
                 title: 'Thống kê',
                storeId: storeId,
                storeNames: storeNames,
                store: store,
                topSaleProductChunks:  constant.splitToChunk(topSaleProducts, 4)
            });
        } catch(err) {
            console.log('err', err);
        }
    }
};
module.exports = {
    statistics_product,
}
