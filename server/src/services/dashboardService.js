const Sale = require('../models/Sale');
const Product = require('../models/Product');

const getDateRange = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const getMonthRange = (date = new Date()) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

  return { start, end };
};

const sumField = async (match, field) => {
  const result = await Sale.aggregate([
    { $match: match },
    { $group: { _id: null, total: { $sum: `$${field}` } } }
  ]);

  return result[0]?.total || 0;
};

const getDashboardMetrics = async () => {
  const { start: todayStart, end: todayEnd } = getDateRange();
  const { start: monthStart, end: monthEnd } = getMonthRange();

  const [todaySalesTotal, monthlySalesTotal, totalOrders, lowStockProducts] = await Promise.all([
    sumField({ createdAt: { $gte: todayStart, $lte: todayEnd } }, 'finalAmount'),
    sumField({ createdAt: { $gte: monthStart, $lte: monthEnd } }, 'finalAmount'),
    Sale.countDocuments(),
    Product.find({
      isDeleted: false,
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
    }).select('productCode name quantity lowStockThreshold')
  ]);

  return {
    todaySalesTotal: Number(todaySalesTotal.toFixed(2)),
    monthlySalesTotal: Number(monthlySalesTotal.toFixed(2)),
    totalOrders,
    lowStockProductsCount: lowStockProducts.length,
    lowStockProducts
  };
};

module.exports = {
  getDashboardMetrics
};
