const Sale = require('../models/Sale');
const { createSalesExcelBuffer } = require('../utils/excelGenerator');

const getDailySummary = async () => {
  const summary = await Sale.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        orderCount: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
        cgst: { $sum: '$cgst' },
        sgst: { $sum: '$sgst' },
        finalAmount: { $sum: '$finalAmount' }
      }
    },
    { $sort: { _id: -1 } }
  ]);

  return summary;
};

const getMonthlySummary = async () => {
  const summary = await Sale.aggregate([
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m', date: '$createdAt' }
        },
        orderCount: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
        cgst: { $sum: '$cgst' },
        sgst: { $sum: '$sgst' },
        finalAmount: { $sum: '$finalAmount' }
      }
    },
    { $sort: { _id: -1 } }
  ]);

  return summary;
};

const exportDailySummaryExcel = async () => {
  const summary = await getDailySummary();
  const rows = summary.map((item) => ({
    label: item._id,
    orderCount: item.orderCount,
    totalAmount: Number(item.totalAmount.toFixed(2)),
    cgst: Number(item.cgst.toFixed(2)),
    sgst: Number(item.sgst.toFixed(2)),
    finalAmount: Number(item.finalAmount.toFixed(2))
  }));

  return createSalesExcelBuffer('Daily Sales Summary', rows);
};

const exportMonthlySummaryExcel = async () => {
  const summary = await getMonthlySummary();
  const rows = summary.map((item) => ({
    label: item._id,
    orderCount: item.orderCount,
    totalAmount: Number(item.totalAmount.toFixed(2)),
    cgst: Number(item.cgst.toFixed(2)),
    sgst: Number(item.sgst.toFixed(2)),
    finalAmount: Number(item.finalAmount.toFixed(2))
  }));

  return createSalesExcelBuffer('Monthly Sales Summary', rows);
};

module.exports = {
  getDailySummary,
  getMonthlySummary,
  exportDailySummaryExcel,
  exportMonthlySummaryExcel
};
