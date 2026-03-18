const dashboardService = require('../services/dashboardService');

const getMetrics = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardMetrics();
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMetrics
};
