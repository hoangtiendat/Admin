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
    getUserInPage(currentUserType, userId, page){
        if (currentUserType === constant.type["superAdmin"]){
            return User.find({
                userId: {$ne: userId},
            })
                .skip((constant.perPage * page) - constant.perPage)
                .limit(constant.perPage);
        } else {
            return User.find({
                userId: {$ne: userId},
                type: {$eq: constant.type["customer"]}
            })
                .skip((constant.perPage * page) - constant.perPage)
                .limit(constant.perPage);
        }
    },
    countUser(currentUserType, userId){
        if (currentUserType === constant.type["superAdmin"]){
            return User.count({
                userId: {$ne: userId},
            }).exec();
        } else {
            return User.count({
                userId: {$ne: userId},
                type: {$eq: constant.type["customer"]}
            }).exec();
        }
    },
    setStatus(userId, isActive){
        return User.findOneAndUpdate({userId: userId}, {isActive: isActive}).exec();
    },
    setUserInfo(userId, info){
        return User.findOneAndUpdate({userId: userId}, {
            firstName: info.firstName || "",
            lastName: info.lastName || "",
            gender: info.gender || "",
            email: info.email || "",
            birthDate: info.birthDate || "",
            phone: info.phone || "",
            address: info.address || "",
            city: info.city || "",
        }).exec();
    },
    countCustomer(){
        return User.count({type: constant.type.customer}).exec();
    },
};
