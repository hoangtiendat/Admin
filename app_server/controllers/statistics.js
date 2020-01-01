const Store = require('../models/Store');
const Product = require('../models/Product');
const constant = require('../Utils/constant');

const statistics_product = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            const storeId = (req.query.storeId)? parseInt(req.query.storeId) : -1;
            const storeNames  = await Store.getAllStoreName();
            const store = (storeId > 0)? await Store.getStore(storeId) : null;
            const topSaleProducts = (storeId > 0)? await Product.getTopSaleProductOfStore(storeId, constant.topLimit) : await Product.getTopSaleProduct(constant.topLimit);
            topSaleProducts.forEach((product) => {
                product.salePrice = parseInt(product.price) - parseInt(product.discount);
                product.urlImage = product.urlImage.split(constant.urlImageSeperator)[0];
            });
            res.render('statistics_product', {
                 title: 'Thống kê sản phẩm',
                storeId: storeId,
                storeNames: storeNames,
                store: store,
                topSaleProductChunks:  constant.splitToChunk(topSaleProducts, 4)
            });
        } catch(err) {
            console.log('err', err);
        }
    }
};
const statistics_revenue = async (req, res) => {
    if (!req.isAuthenticated()){
        res.redirect('/login');
    } else {
        try {
            //Day
            const statisticsByDay = await Product.statisticByDay(constant.chartDay);
            const startDate = Date.now() - constant.millisecondOfDay * constant.chartDay;
            const statisticsByDayLabels = statisticsByDay.map((count, index) => {
                const date = new Date(startDate + constant.millisecondOfDay * index);
                return '"' + constant.parseDateMonth(date, "/") + '"';
            });

            //Week
            const now = new Date();
            const statisticsByWeek = await Product.statisticByWeek(constant.chartWeekRange, now.getFullYear());
            const statisticsByWeekLabels = statisticsByWeek[1].map((count, index) => {
                return '"' + "Tuần " + (count + 1) + '"';
            });

            //Month
            const statisticsByMonth = await Product.statisticByMonth(now.getFullYear());
            const statisticsByMonthLabels = statisticsByMonth.map((count, index) => {
                return '"' + "Tháng " + (index + 1) + '"';
            });

            //Quarter
            const statisticsByQuarter = await Product.statisticByQuarter(now.getFullYear());
            const statisticsByQuarterLabels = statisticsByQuarter.map((count, index) => {
                return '"' + "Quý " + (index + 1) + '"';
            });

            //Quarter
            const startYear = now.getFullYear() - (constant.chartYearRange - 1);
            const statisticsByYear = await Product.statisticByYear(startYear, now.getFullYear());
            const statisticsByYearLabels = statisticsByYear.map((count, index) => {
                return '"' + (startYear + index) + '"';
            });
            res.render('statistics_revenue', {
                title: 'Thống kê doanh số',
                statisticsByDay: statisticsByDay,
                statisticsByDayLabels: statisticsByDayLabels,
                statisticsByWeek: statisticsByWeek[0],
                statisticsByWeekLabels: statisticsByWeekLabels,
                statisticsByMonth: statisticsByMonth,
                statisticsByMonthLabels: statisticsByMonthLabels,
                statisticsByQuarter: statisticsByQuarter,
                statisticsByQuarterLabels: statisticsByQuarterLabels,
                statisticsByYear: statisticsByYear,
                statisticsByYearLabels: statisticsByYearLabels,
                currentYear: now.getFullYear()
            });
        } catch(err) {
            console.log('err', err);
        }
    }
}

module.exports = {
    statistics_product,
    statistics_revenue
}
