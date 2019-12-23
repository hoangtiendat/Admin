const Store = require('../models/Store');
const Product = require('../models/Product');
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
        const products = await Product.getProductByStoreId(req.params.storeId);
        products.forEach((product) => {
            product.salePrice = parseInt(product.price) - parseInt(product.discount);
        })
        if (storeDetail){
            res.render('shop_detail', {
                title: 'Người dùng',
                storeDetail: storeDetail,
                productChunks: constant.splitToChunk(products, 4)
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
