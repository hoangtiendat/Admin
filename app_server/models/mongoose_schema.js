const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

//User
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    gender: String,
    email: String,
    birthDate: Date,
    address: String,
    city: String,
    phone: String,
    avatar: String,
    createdDate: Date,
    isActive: Boolean,
    type: Number
});

userSchema.index({coords: '2dsphere'});
userSchema.plugin(AutoIncrement, {inc_field: 'userId'});
mongoose.model('User', userSchema);


//Brand
const brandSchema = new mongoose.Schema({
    name: String,
    ceo: String,
    headquarterAddress: String,
    nation: String,
    purchaseCount: Number,
    createdDate: Date,
});
brandSchema.index({coords: '2dsphere'});
brandSchema.plugin(AutoIncrement, {inc_field: 'brandId'});
mongoose.model('Brand', brandSchema);

//Store
const storeSchema = new mongoose.Schema({
    brandId: Number,
    name: String,
    owner: String,
    address: String,
    city: String,
    purchaseCount: Number,
    createdDate: Date,
}, { toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
storeSchema.virtual('brand',{
    ref: 'Brand',
    localField: 'brandId',
    foreignField: 'brandId',
    justOne: true
});
storeSchema.index({coords: '2dsphere'});
storeSchema.plugin(AutoIncrement, {inc_field: 'storeId'});
mongoose.model('Store', storeSchema);

//Category
const categorySchema = new mongoose.Schema({
    categoryName: String,

});
categorySchema.index({coords: '2dsphere'});
categorySchema.plugin(AutoIncrement, {inc_field: 'categoryId'});
mongoose.model('Category', categorySchema);


//Product
const productSchema = new mongoose.Schema({
    new: Boolean,
    name: String,
    urlImage: String,
    imageUploadBy: Number,
    discount: Number,
    price: Number,
    storeId:  Number,
    categoryId: Number,
    description: String,
    purchaseCount: Number,
    createdDate: Date
}, { toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productSchema.virtual('store',{
    ref: 'Store',
    localField: 'storeId',
    foreignField: 'storeId',
    justOne: true
});
productSchema.virtual('category',{
    ref: 'Category',
    localField: 'categoryId',
    foreignField: 'categoryId',
    justOne: true
});
productSchema.index({coords: '2dsphere'});
productSchema.plugin(AutoIncrement, {inc_field: 'productId'});
mongoose.model('Product', productSchema);

//Bill
const billSchema = new mongoose.Schema({
    buyerId: Number,
    productId: Number,
    receiverName: String,
    phone: String,
    email: String,
    address: String,
    city: String,
    description: String,
    totalPrice: Number,
    shipCharge: Number,
    purchaseDate: Date,
    deliveryDate: Date,
    status: String,
}, { toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
billSchema.virtual('buyer',{
    ref: 'User',
    localField: 'buyerId',
    foreignField: 'userId',
    justOne: true
});
billSchema.virtual('product',{
    ref: 'Product',
    localField: 'productId',
    foreignField: 'productId',
    justOne: true
});
billSchema.index({coords: '2dsphere'});
billSchema.plugin(AutoIncrement, {inc_field: 'billId'});
mongoose.model('Bill', billSchema);

//Bill Detail
const billDetailSchema = new mongoose.Schema({
    billId: Number,
    productId: Number,
    amount: Number
}, { toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
billDetailSchema.virtual('bill',{
    ref: 'Bill',
    localField: 'billId',
    foreignField: 'billId',
    justOne: true
});
billDetailSchema.virtual('product',{
    ref: 'Product',
    localField: 'productId',
    foreignField: 'productId',
    justOne: true
});
billDetailSchema.index({coords: '2dsphere'});
billDetailSchema.plugin(AutoIncrement, {inc_field: 'billDetailId'});
mongoose.model('BillDetail', billDetailSchema);

//Comment
const commentSchema = new mongoose.Schema({
    userId: Number,
    productId: Number,
    content: String,
    createdDate: Date
}, { toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
commentSchema.virtual('user',{
    ref: 'User',
    localField: 'userId',
    foreignField: 'userId',
    justOne: true
});
commentSchema.virtual('product',{
    ref: 'Product',
    localField: 'productId',
    foreignField: 'productId',
    justOne: true
});
commentSchema.index({coords: '2dsphere'});
commentSchema.plugin(AutoIncrement, {inc_field: 'commentId'});
mongoose.model('Comment', commentSchema);

//Param
const paramSchema = new mongoose.Schema({
    paramId: Number,
    category: String,
    brands: String,
    city: String
});
paramSchema.index({coords: '2dsphere'});
mongoose.model('Param', paramSchema);
