const User = require('../models/user');
const constant = require('../Utils/constant');

const users = async (req, res) => {
    try {
        const users  = await User.getAllUser(req.user.type, req.user.userId);
        res.render('user', {
            title: 'Nguời dùng',
            users: users,
            user: req.user,
            isSuperAdmin: req.user.type === constant.type["superAdmin"]
        });
    } catch(err) {
        console.log('err', err);
    }
}
module.exports = {
    users,
};
