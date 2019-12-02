const mongoose = require('mongoose');
const Product = mongoose.model('Product');

const product = (req, res) => {
    if(req.query.category === 'phone'){
        Product.find({"category": "phone"}, function(err, products) {
            res.render('product', { title: 'Điện thoại', products: products, user: (req.isAuthenticated) ? req.user : null });
        });
    } else if (req.query.category === 'laptop') {
        Product.find({"category": "laptop"}, function(err, products) {
            res.render('product', { title: 'Laptop', products: products, user: (req.isAuthenticated) ? req.user : null });
        });
    } else if (req.query.category === 'tablet') {
        Product.find({"category": "tablet"}, function(err, products) {
            res.render('product', { title: 'Tablet', products: products, user: (req.isAuthenticated) ? req.user : null });
        });
    } else if (req.query.category === 'watch') {
        Product.find({"category": "watch"}, function(err, products) {
            res.render('product', { title: 'Đồng hồ', products: products, user: (req.isAuthenticated) ? req.user : null });
        });
    } else if (req.query.source === 'apple') {
        Product.find({"source": "apple"}, function(err, products) {
            res.render('product', { title: 'Sản phẩm của Apple', products: products, user: (req.isAuthenticated) ? req.user : null });
        });
    } else if (req.query.source === 'samsung') {
        Product.find({"source": "samsung"}, function(err, products) {
            res.render('product', { title: 'Sản phẩm của Samsung', products: products, user: (req.isAuthenticated) ? req.user : null });
        });
    } else if (req.query.source === 'other') {
        Product.find({"source": "other"}, function(err, products) {
            res.render('product', { title: 'Sản phẩm của các hãng khác', products: products, user: (req.isAuthenticated) ? req.user : null });
        });
    } else {
        Product.find( function(err, products) {
            res.render('product', { title: 'Tất cả sản phẩm', products: products, user: (req.isAuthenticated) ? req.user : null });
        });
    }
};

const productDetail = (req, res) => {
    Product.findOne({"id": req.query.id}, function(err, product) {
        res.render('item_detail', (!product)? {
            title: 'Sản phẩm'
        }: {
            title: 'Sản phẩm',
            new: product.new,
            name: product.name,
            discount: product.discount,
            price: product.price,
            urlImage: product.urlImage,
            category: product.category,
            source: product.source,
            user: (req.isAuthenticated) ? req.user : null
        });
    });
};

module.exports = {
    product,
    productDetail,
}
