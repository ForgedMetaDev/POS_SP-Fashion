const inventoryService = require('../services/inventoryService');

const getInventoryLogs = async (req, res, next) => {
  try {
    const logs = await inventoryService.getInventoryLogs(req.query.productId);
    return res.status(200).json({ data: logs });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getInventoryLogs
};
