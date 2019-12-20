const Store = require('../models/Store');
const constant = require('../Utils/constant');

const stores = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            const stores  = await Store.getAllStore();
            res.render('shop', {
                title: 'Cửa hàng',
                stores: stores,
            });
        } catch(err) {
            console.log('err', err);
        }
    }
}

module.exports = {
    stores
}
