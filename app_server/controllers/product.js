const Product = require('../models/product');
const Store = require('../models/store');
const Param = require('../models/params');
const constant = require('../Utils/constant');

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
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        const product = await Product.getProductById(req.params.productId);
        if (product){
            product.salePrice = parseInt(product.price) - parseInt(product.discount);
            product.description = decodeURI(product.description);
            res.render('product_detail', {
                title: product  .name,
                productDetail: product,
                imageUrlChunks: constant.splitToChunk(product.urlImage.split(constant.urlImageSeperator), 4)

            });
        } else {
            res.render('error', {
                title: 'Lỗi tìm kiếm sản phẩm',
                message: "Lỗi không tìm thấy sản phẩm"
            })
        }
    }
};
const uploadProductImage = async (req, res) => {
    try {
        const productId = (req.body.productId) ? parseInt(req.body.productId) : -1;
        const imageUrls = req.body.imageUrls;
        let imageUrlsArr;
        //Remove images
        let removedImages;
        if (req.body.removedImages) {
            removedImages = req.body.removedImages.split(constant.urlImageSeperator);
            const deletes = await Product.deleteProductImages(removedImages.map((removedImage) => {
                return {
                    productId: productId,
                    imageNum: removedImage,
                    extension: ""
                };
            }));

            imageUrlsArr = imageUrls.split(constant.urlImageSeperator).filter((imageUrl) => {
                return removedImages.filter((removed) => {
                    return imageUrl.includes(constant.createProductImageName(productId, removed, ""));
                }).length === 0;
            });
        } else {
            imageUrlsArr = imageUrls.split(constant.urlImageSeperator);
        }

        for (let i = 0; i < req.files.length; i++){
            try {
                const url = await Product.uploadProductImages(productId, req.files[i]);
                imageUrlsArr.push(url);
            } catch (err) {
                res.json({
                    error: "Upload ảnh thất bại"
                })
            }
        }
        const setUrlResult = await Product.setProductUrlImage(productId, imageUrlsArr.join(constant.urlImageSeperator));
        res.json({
            success: "Upload ảnh thành công"
        })
    } catch(err){
        res.json({
            error: "Upload ảnh thất bại"
        })
    }
}
const editProductPage = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        const product = await Product.getProductById(req.params.productId);
        product.salePrice = parseInt(product.price) - parseInt(product.discount);
        product.description = decodeURI(product.description);
        if (product){
            const storeNames  = await Store.getAllStoreName();
            const categories = await Param.getAllCategory();
            res.render('edit_product', {
                title: product.name,
                product: product,
                storeNames: storeNames,
                categories: categories
            });
        } else {
            res.render('error', {
                title: 'Lỗi tìm kiếm sản phẩm',
                message: "Lỗi không tìm thấy sản phẩm"
            })
        }
    }
};
const editProduct = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            const productId = (req.body.productId)? parseInt(req.body.productId) : -1;
            const info = {
                name: req.body.name || "",
                new: req.body.new === "on",
                price: (req.body.price)? parseInt(req.body.price) : 0,
                discount: (req.body.discount)? parseInt(req.body.discount) : 0,
                categoryId: (req.body.categoryId)? parseInt(req.body.categoryId) : 1,
                storeId: (req.body.storeId)? parseInt(req.body.storeId) : 1,
                description: encodeURI(req.body.description) || "",
            };
            const product = await Product.setProductInfo(productId, info);
            if (product) {
                res.redirect('/product_detail/' + productId);
            } else {
                res.redirect('/edit_product/' + productId);
            }
        } catch(err) {
            console.log('err', err);
        }
    }
};
const editProductImagePage = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        const product = await Product.getProductById(req.params.productId);
        if (product){
            product.salePrice = parseInt(product.price) - parseInt(product.discount);
            product.description = decodeURI(product.description);
            res.render('edit_product_image', {
                title: product.name,
                product: product,
            });
        } else {
            res.render('error', {
                title: 'Lỗi tìm kiếm sản phẩm',
                message: "Lỗi không tìm thấy sản phẩm"
            })
        }
    }
};
const addProductPage = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            const storeId = (req.params.storeId)? parseInt(req.params.storeId) : -1;
            const store  = await Store.getStore(storeId);
            const categories = await Param.getAllCategory();
            res.render('add_product', {
                title: 'Thêm sản phẩm ' + store.name,
                product: product,
                store: store,
                categories: categories
            });
        } catch(err){
            console.log(err);
        }
    }
};
const addProduct = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            const info = {
                new: req.body.new === "true" || false,
                name: req.body.name || "",
                imageUploadBy: parseInt(req.user.userId) || 1,
                discount: Number(req.body.discount) || 0,
                price: Number(req.body.price) || 0,
                storeId:   parseInt(req.body.storeId) || 0,
                categoryId:  parseInt(req.body.categoryId) || 0,
                description:  req.body.description || "",
            };
            const product = await Product.addProduct(info);
            let imageUrlsArr = [];
            if (product.productId){
                for (let i = 0; i < req.files.length; i++){
                    try {
                        const url = await Product.uploadProductImages(product.productId, req.files[i]);
                        imageUrlsArr.push(url);
                    } catch (err) {
                        res.json({
                            error: "Upload ảnh thất bại"
                        })
                    }
                }
                const setUrlResult = await Product.setProductUrlImage(product.productId, imageUrlsArr.join(constant.urlImageSeperator));
                res.json({
                    productId: product.productId,
                })
            }
        } catch(err) {
            console.log('err', err);
            res.json({
                error: "Upload ảnh thất bại"
            })
        }
    }
};
module.exports = {
    product,
    productCategory,
    productSource,
    productDetail,
    uploadProductImage,
    editProductPage,
    editProduct,
    editProductImagePage,
    addProductPage,
    addProduct
}
