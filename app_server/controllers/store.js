const Store = require('../models/store');
const Product = require('../models/product');
const constant = require('../Utils/constant');

const stores = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            const page = parseInt(req.query.page) || 1;
            const stores  = await Store.getStoreInPage(page);
            const count = await Store.countStore();
            res.render('shop', {
                title: 'Cửa hàng',
                stores: stores,
                page: page,
                pages: Math.ceil(count / constant.perPage)
            });
        } catch(err) {
            console.log('err', err);
        }
    }
}

const store_detail = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        const storeDetail = await Store.getStore(req.params.storeId);
        const page = parseInt(req.query.page) || 1;
        const products = await Product.getProductByStoreIdInPage(req.params.storeId, page);
        const count = await Product.countProductOfStore(req.params.storeId);
        products.forEach((product) => {
            product.salePrice = parseInt(product.price) - parseInt(product.discount);
            product.urlImage = product.urlImage.split(constant.urlImageSeperator)[0];
        });
        if (storeDetail){
            res.render('shop_detail', {
                title: storeDetail.name,
                storeDetail: storeDetail,
                productChunks: constant.splitToChunk(products, 4),
                page: page,
                pages: Math.ceil(count / constant.productPerPage),
                storeDetailUrl: "store_detail/" + req.params.storeId
            });
        } else {
            res.render('error', {
                title: 'Lỗi tìm kiếm cửa hàng',
                message: "Lỗi không tìm thấy cửa hàng"
            })
        }
    }
};
module.exports = {
    stores,
    store_detail
}
