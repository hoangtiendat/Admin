const User = require('../models/user');
const constant = require('../Utils/constant');

const users = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            const page = parseInt(req.query.page) || 1;
            const users  = await User.getUserInPage(req.user.type, req.user.userId, page);
            const count = await User.countUser(req.user.type, req.user.userId);
            res.render('user', {
                title: 'Nguời dùng',
                users: users,
                page: page,
                pages: Math.ceil(count / constant.perPage),
                isSuperAdmin: req.user.type === constant.type["superAdmin"],
            });
        } catch(err) {
            console.log('err', err);
        }
    }
}

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
    users,
    user_detail,
    setStatus
};
