const express = require('express');
const router = express.Router();
const passport = require('passport');
const ctrlMain = require('../controllers/main');
const accountCtrl = require('../controllers/account');
const productCtrl = require('../controllers/product');
const userCtrl = require('../controllers/user');
const storeCtrl = require('../controllers/store');
const statisticsCtrl = require('../controllers/statistics');
const billCtrl = require('../controllers/bill');

const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const upload = multer({ storage: inMemoryStorage });
require('./passport');

/* GET home page. */
router.get('/', ctrlMain.home);

router.get('/profile', userCtrl.profile)

router.get('/edit_profile', userCtrl.editProfilePage);

router.post('/edit_profile', userCtrl.editProfile);

router.get('/statistics_product', statisticsCtrl.statistics_product);

router.get('/statistics_revenue', statisticsCtrl.statistics_revenue);


router.get('/store/', storeCtrl.stores);

router.get('/store_detail/:storeId', storeCtrl.store_detail);

router.get('/product_detail/:productId', productCtrl.productDetail);

router.get('/bill', billCtrl.bills);

router.get('/bill_detail/:billId', billCtrl.bill_detail);

router.get('/user/', userCtrl.users);

router.get('/user_detail/:userId', userCtrl.user_detail);

router.post('/user/setStatus', userCtrl.setStatus);

router.post('/product/uploadImage', upload.array('images'), productCtrl.uploadProductImage);

/* GET Login page. */
router.get('/login', accountCtrl.loginPage);
router.post('/login', function(req, res, next){
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login') }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next)
});

router.get('/logout', accountCtrl.logout);

router.get('/addAdmin', accountCtrl.signupPage);
router.post('/addAdmin', accountCtrl.signup);
    
module.exports = router;
