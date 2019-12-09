const Product = require('../models/product');

const product = (req, res) => {
    if (req.query.category){
        productCategory(req, res);
    } else if (req.query.source){
        productSource(req, res);
    }
}

const productCategory = async (req, res) => {
    const products = await Product.getProductByCategory(req.query.category);
    let title = "";
    switch(req.query.category){
        case "phone":
            title = "Điện thoại"
            break;
        case "laptop":
            title = "Laptop"
            break;
        case "tablet":
            title = "Tablet"
            break;
        case "watch":
            title = "Đồng hồ"
            break;
        default:
    }
    res.render('product', { title: title, products: products, user: (req.isAuthenticated) ? req.user : null });
};

const productSource = async (req, res) => {
    const products = await Product.getProductBySource(req.query.source);
    let title = "";
    switch(req.query.source){
        case "apple":
            title = "Sản phẩm của Apple";
            break;
        case "samsung":
            title = "Sản phẩm của Samsung";
            break;
        case "other":
            title = "Sản phẩm của hãng khác";
            break;
        default:
    }
    res.render('product', { title: title, products: products, user: (req.isAuthenticated) ? req.user : null });
};

const productDetail = async (req, res) => {
    const product = await Product.getProductById(req.query.productId);
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
};

module.exports = {
    product,
    productCategory,
    productSource,
    productDetail,
}
