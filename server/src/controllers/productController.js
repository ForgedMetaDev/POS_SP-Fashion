const productService = require('../services/productService');

const createProduct = async (req, res, next) => {
  try {
    // Sample payload:
    // {
    //   "hsnCode": "6109",
    //   "name": "Men Cotton T-Shirt",
    //   "type": "Topwear",
    //   "quantity": 100,
    //   "purchasePrice": 250,
    //   "mrp": 499,
    //   "gstRate": 12,
    //   "lowStockThreshold": 10
    // }
    const product = await productService.createProduct(req.body);
    return res.status(201).json({ message: 'Product added successfully', data: product });
  } catch (error) {
    return next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json({ data: products });
  } catch (error) {
    return next(error);
  }
};

const searchByHsn = async (req, res, next) => {
  try {
    const products = await productService.searchProductsByHsn(req.query.hsn);
    return res.status(200).json({ data: products });
  } catch (error) {
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    return res.status(200).json({ message: 'Product updated successfully', data: product });
  } catch (error) {
    return next(error);
  }
};

const softDeleteProduct = async (req, res, next) => {
  try {
    const result = await productService.softDeleteProduct(req.params.id);
    return res.status(200).json({ message: 'Product deleted successfully', data: result });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  searchByHsn,
  updateProduct,
  softDeleteProduct
};
