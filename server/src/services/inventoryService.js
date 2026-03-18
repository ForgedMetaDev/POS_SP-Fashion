const InventoryLog = require('../models/InventoryLog');

const getInventoryLogs = async (productId) => {
  const query = {};
  if (productId) {
    query.productId = productId;
  }

  return InventoryLog.find(query)
    .populate('productId', 'productCode name hsnCode')
    .sort({ createdAt: -1 });
};

module.exports = {
  getInventoryLogs
};
