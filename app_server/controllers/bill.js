const Bill = require('../models/Bill');
const Product = require('../models/Product');
const constant = require('../Utils/constant');

const bills = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            const page = parseInt(req.query.page) || 1;
            const bills  = await Bill.getBillInPage(page);
            const count = await Bill.countBill();
            res.render('bill', {
                title: 'Hồ sơ',
                bills: bills,
                page: page,
                pages: Math.ceil(count / constant.perPage),
            });
        } catch(err) {
            console.log('err', err);
        }
    }
};
module.exports = {
    bills
}
