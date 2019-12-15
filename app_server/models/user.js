const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const constant = require('../Utils/constant');

module.exports = {
    checkUsername(username){
        return User.findOne({username: username}).exec();
    },
    addUser(username, email, password){
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, constant.SALT_ROUNDS, (err,   hash) => {
                const newUser = new User({
                    username: username,
                    email: email,
                    password: hash,
                    type: constant.type["admin"],
                    isActive: true,
                    createdDate: Date.now()
                });
                try {
                    newUser.save(function (err) {
                        if (err){
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
                } catch(err) {
                    console.log('error' + err);
                }
            })
        })
    },
    getUser(userId){
        return User.findOne({userId: userId}).exec();
    },
    getAllUser(currentUserType, userId){
       if (currentUserType === constant.type["superAdmin"]){
           return User.find({
               userId: {$ne: userId},
           });
       } else {
           return User.find({
               userId: {$ne: userId},
               type: {$eq: constant.type["customer"]}
           });
       }
    },
    setStatus(userId, isActive){
        return User.findOneAndUpdate({userId: userId}, {isActive: isActive}).exec();
    }
};
