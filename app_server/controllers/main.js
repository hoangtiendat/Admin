const mongoose = require('mongoose');
const User = require("../models/user");
const Product = require("../models/product");
const Store = require("../models/store");
const passport = require('passport');


const home = async (req, res) => {
	if (req.user != null) {
		const countCustomer = await User.countCustomer();
		const countProduct = await Product.countProduct();
		const countStore = await Store.countStore();
		res.render('index', {
			title: 'Shoppy',
			countCustomer: countCustomer,
			countProduct: countProduct,
			countStore: countStore
		});
	} else {
		res.redirect('/login');
	}
};

const statistics_revenue = (req, res) => {
	if (req.user != null) { 
		res.render('statistics_revenue', {
			title: 'Thống kê',
		});
	} else {
		res.redirect('/login');
	}
};

const order = (req, res) => {
	if (req.user != null) { 
		res.render('order', {
			title: 'Đơn hàng',
			user: req.user
		});
	} else {
		res.redirect('/login');
	}
}

module.exports = {
	home,
	statistics_revenue,
	order,
};
