const saleService = require('../services/saleService');

const createSale = async (req, res, next) => {
  try {
    // Sample payload:
    // {
    //   "items": [
    //     {
    //       "productId": "65f0e5a0ab12cd34ef56aa12",
    //       "quantity": 2,
    //       "sellingPrice": 450
    //     }
    //   ]
    // }
    const sale = await saleService.createSale(req.body.items, req.user._id);
    return res.status(201).json({ message: 'Sale created successfully', data: sale });
  } catch (error) {
    return next(error);
  }
};

const getSalesByDate = async (req, res, next) => {
  try {
    const sales = await saleService.getSalesByDate(req.query.date);
    return res.status(200).json({ data: sales });
  } catch (error) {
    return next(error);
  }
};

const getAllSales = async (req, res, next) => {
  try {
    const sales = await saleService.getAllSales();
    return res.status(200).json({ data: sales });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createSale,
  getSalesByDate,
  getAllSales
};
