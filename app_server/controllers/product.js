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
    res.render('product', { title: title, products: products });
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
    res.render('product', { title: title, products: products});
};

const productDetail = async (req, res) => {
    const product = await Product.getProductById(req.params.productId);
    product.salePrice = parseInt(product.price) - parseInt(product.discount);
    if (product){
        res.render('product_detail', {
            title: 'Sản phẩm',
            productDetail: product,
        });
    } else {
        res.render('error', {
            title: 'Lỗi tìm kiếm sản phẩm',
            message: "Lỗi không tìm thấy sản phẩm"
        })
    }
};
const uploadProductImage = (req, res) => {
    const productId = req.body.productId;
    let numOfImages = req.body.numOfImages;
    const removedImages = req.body.removedImages.split(constant.urlImageSeperator);
    req.files.forEach(async (file, idx) => {
        if (removedImages.length > 0){
            const removedIdx = removedImages.pop();
            const url = await Product.uploadProductImages(productId, removedIdx, file);
        } else {
            const url = await Product.uploadProductImages(productId, ++numOfImages, file);
        }
    })
}
module.exports = {
    product,
    productCategory,
    productSource,
    productDetail,
    uploadProductImage
}
