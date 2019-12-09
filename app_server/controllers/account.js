const User = require('../models/user');

const loginPage = (req, res) => {
    res.render('login', {
        title: 'Đăng nhập',
        layout: false ,
    });
}
const login = (req, res) => {
    res.redirect('index', {
        title: 'Trang chủ',
    });
}
const logout = (req, res) => {
    req.logOut();
    res.redirect('/login');
}
const signupPage = (req, res) => {
    res.render('signup', {
        title: 'Thêm Admin',
        layout: false ,
    });
}
const signup =  async (req, res) => {
    let user = await User.checkUsername(req.body.username);
    if (user){
        res.render('signup', {
            title: 'Thêm Admin',
            layout: false,
            error_message: "Tên đăng nhập đã tồn tại !!!"
        });
    } else {
        const result = await User.addUser(req.body.username, req.body.email, req.body.password);
        if (result){
            //Success
            res.render('index', {
                title: 'Trang chủ',
                user: req.user,
                success_message: "Tạo tài khoản admin thành công"
            });
        } else {
            //Fail
            res.render('signup', {
                title: 'Đăng ký',
                layout: false,
                error_message: "Đăng ký thất bại !!!"
            });
        }
    }
}
module.exports = {
    loginPage,
    login,
    logout,
    signupPage,
    signup
};
