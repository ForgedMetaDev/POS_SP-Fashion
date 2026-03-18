const reportService = require('../services/reportService');

const getDailySalesSummary = async (req, res, next) => {
  try {
    const data = await reportService.getDailySummary();
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

const getMonthlySalesSummary = async (req, res, next) => {
  try {
    const data = await reportService.getMonthlySummary();
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

const exportDailySalesSummaryExcel = async (req, res, next) => {
  try {
    const buffer = await reportService.exportDailySummaryExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="daily-sales-summary.xlsx"');
    return res.send(buffer);
  } catch (error) {
    return next(error);
  }
};

const exportMonthlySalesSummaryExcel = async (req, res, next) => {
  try {
    const buffer = await reportService.exportMonthlySummaryExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="monthly-sales-summary.xlsx"');
    return res.send(buffer);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDailySalesSummary,
  getMonthlySalesSummary,
  exportDailySalesSummaryExcel,
  exportMonthlySalesSummaryExcel
};
