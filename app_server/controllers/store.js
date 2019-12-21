const Store = require('../models/Store');
const constant = require('../Utils/constant');

const stores = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            const page = parseInt(req.query.page) || 1;
            const stores  = await Store.getStoreInPage(page);
            const count = await Store.countStore();
            res.render('shop', {
                title: 'Cửa hàng',
                stores: stores,
                page: page,
                pages: Math.ceil(count / constant.perPage)
            });
        } catch(err) {
            console.log('err', err);
        }
    }
}

module.exports = {
    stores
}
