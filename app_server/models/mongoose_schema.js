const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

//Product
const productSchema = new mongoose.Schema({
    new: Boolean,
    name: String,
    urlImage: String,
    discount: String,
    price: String,
    category: String,
    description: String,
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
    email: String,
    birthDate: Date,
    address: String,
    city: Number,
    phone: String,
    avatar: String,
    createdDate: Date,
    type: Number
});

userSchema.index({coords: '2dsphere'});
userSchema.plugin(AutoIncrement, {inc_field: 'userId'});
mongoose.model('User', userSchema);
