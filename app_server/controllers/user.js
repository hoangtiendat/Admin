const User = require('../models/user');
const Param = require('../models/params');
const constant = require('../Utils/constant');

const profile = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            const user = await User.getUser(req.user.userId);
            res.render('profile', {
                title: 'Nguời dùng',
                user: Object.assign({}, user._doc, {
                    typeStr: constant.getUserType(user.type),
                    birthDate: (user.birthDate)? user.birthDate.toString() : "",
                    createdDate: user.createdDate.toString(),
                })
            });
        } catch(err) {
            console.log('err', err);
        }
    }
};

const editProfilePage = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            const user = await User.getUser(req.user.userId);
            const cities = await Param.getAllCity();
            res.render('edit_profile', {
                title: 'Hồ sơ',
                user: Object.assign({}, user._doc, {
                    birthDate: (user.birthDate)? user.birthDate.toString() : "",
                    createdDate: user.createdDate.toString(),

                }),
                cities: cities
            });
        } catch(err) {
            console.log('err', err);
        }
    }
};

const editProfile = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            const info = {
                firstName: req.body.firstName || "",
                lastName: req.body.lastName || "",
                gender: req.body.gender || "",
                email: req.body.email || "",
                birthDate: req.body.birthDate || "",
                phone: req.body.phone || "",
                address: req.body.address || "",
                city: req.body.city || "",
            };
            const user = await User.setUserInfo(req.user.userId, info);
            if (user) {
                res.redirect('/profile');
            } else {
                const user = await User.getUser(req.user.userId);
                const cities = await Param.getAllCity();
                res.render('edit_profile', {
                    title: 'Hồ sơ',
                    user: Object.assign({}, user._doc, {
                        birthDate: (user.birthDate)? user.birthDate.toString() : "",
                        createdDate: user.createdDate.toString(),
                        error_message: "Cập nhật thông tin thất bại"
                    }),
                    cities: cities
                });
            }

        } catch(err) {
            console.log('err', err);
        }
    }
};

const users = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            const page = parseInt(req.query.page) || 1;
            const users  = await User.getUserInPage(req.user.type, req.user.userId, page);
            const count = await User.countUser(req.user.type, req.user.userId);
            res.render('user', {
                title: 'Hồ sơ',
                users: users,
                page: page,
                pages: Math.ceil(count / constant.perPage),
                isSuperAdmin: req.user.type === constant.type["superAdmin"],
            });
        } catch(err) {
            console.log('err', err);
        }
    }
};

const user_detail = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            const userDetail = await User.getUser(req.params.userId);
            if (userDetail){
                res.render('user_detail', {
                    title: 'Người dùng',
                    userDetail: Object.assign({}, userDetail._doc, {
                        status: userDetail.isActive,
                        type: Object.keys(constant.type).find(key => constant.type[key] === userDetail.type ),
                        birthDate: (userDetail.birthDate)? userDetail.birthDate.toString() : "",
                        createdDate: userDetail.createdDate.toString(),
                    })
                });
            } else {
                res.render('error', {
                    title: 'Lỗi tìm kiếm người dùng',
                    message: "Lỗi không tìm thấy người dùng"
                })
            }

        } catch(err){
            console.log('err', err);
        }
    }
}

const setStatus = async (req, res) => {
    if (req.isAuthenticated() && req.user.type === constant.type["superAdmin"]){
        try {
            const result = await User.setStatus(parseInt(req.body.userId), req.body.isActive );
            res.json({
                isSuccess: true
            })

        } catch(err){
            console.log('err', err);
            res.json({
                isSuccess: false
            })
        }
    } else {
        res.json({
            isSuccess: false
        })
    }

}

module.exports = {
    profile,
    editProfilePage,
    editProfile,
    users,
    user_detail,
    setStatus
};
