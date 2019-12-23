const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const passport = require('passport');


const home = (req, res) => {
	if (req.user != null) { 
		res.render('index', {
			title: 'Trang chủ',
		});
	} else {
		res.redirect('/login');
	}
};

const statistics_product = (req, res) => {
	if (req.user != null) { 
		res.render('statistics_product', {
			title: 'Thống kê',
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
	statistics_product,
	statistics_revenue,
	order,
};
