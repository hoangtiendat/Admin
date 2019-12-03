const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
userSchema.plugin(AutoIncrement, {inc_field: 'id'});
mongoose.model('User', userSchema);
