const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const passport = require('passport');


const home = (req, res) => {
	if (req.user != null) { 
		res.render('index', {
			title: 'Trang chủ',
			user: req.user
		});
	} else {
		res.redirect('/login');
	}
};

const statistics_product = (req, res) => {
	if (req.user != null) { 
		res.render('statistics_product', {
			title: 'Thống kê',
			user: req.user
		});
	} else {
		res.redirect('/login');
	}
};

const statistics_revenue = (req, res) => {
	if (req.user != null) { 
		res.render('statistics_revenue', {
			title: 'Thống kê',
			user: req.user
		});
	} else {
		res.redirect('/login');
	}
};

const shop = (req, res) => {
	if (req.user != null) { 
		res.render('shop', {
			title: 'Cửa hàng',
			user: req.user
		});
	} else {
		res.redirect('/login');
	}
};

const shop_detail = (req, res) => {
	if (req.user != null) { 
		res.render('shop_detail', {
			title: 'Cửa hàng',
			user: req.user
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

const user = (req, res) => {
	if (req.user != null) { 
		res.render('user', {
			title: 'Người dùng',
			user: req.user
		});
	} else {
		res.redirect('/login');
	}
}

const user_detail = (req, res) => {
	if (req.user != null) { 
		res.render('user_detail', {
			title: 'Người dùng',
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
	shop,
	shop_detail,
	order,
	user,
	user_detail
};