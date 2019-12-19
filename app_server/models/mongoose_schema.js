const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

//Product
const productSchema = new mongoose.Schema({
    new: Boolean,
    name: String,
    urlImage: String,
    imageUploadBy: Number,
    discount: Number,
    price: Number,
    storeId: Number,
    category: String,
    description: String,
    purchaseCount: Number,
    createdDate: Date
});

productSchema.index({coords: '2dsphere'});
productSchema.plugin(AutoIncrement, {inc_field: 'productId'});
mongoose.model('Product', productSchema);

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
    type: Number,
    isActive: Boolean
});

userSchema.index({coords: '2dsphere'});
userSchema.plugin(AutoIncrement, {inc_field: 'userId'});
mongoose.model('User', userSchema);

//Store
const storeSchema = new mongoose.Schema({
    brandId: Number,
    name: String,
    owner: String,
    address: String,
    city: String,
    purchaseCount: Number,
    createdDate: Date,
});
storeSchema.index({coords: '2dsphere'});
storeSchema.plugin(AutoIncrement, {inc_field: 'storeId'});
mongoose.model('Store', storeSchema);

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
});
billSchema.index({coords: '2dsphere'});
billSchema.plugin(AutoIncrement, {inc_field: 'billId'});
mongoose.model('Bill', billSchema);

//Bill Detail
const billDetailSchema = new mongoose.Schema({
    billId: Number,
    productId: Number,
    amount: Number
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
});
commentSchema.index({coords: '2dsphere'});
commentSchema.plugin(AutoIncrement, {inc_field: 'commentId'});
mongoose.model('Comment', commentSchema);
