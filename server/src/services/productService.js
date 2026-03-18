const { v4: uuidv4 } = require('uuid');
const Product = require('../models/Product');
const InventoryLog = require('../models/InventoryLog');
const INVENTORY_TYPES = require('../constants/inventoryTypes');
const generateProductCode = require('../utils/generateProductCode');

const createProduct = async (payload) => {
  const productCode = await generateProductCode();

  const product = await Product.create({
    ...payload,
    productCode
  });

  await InventoryLog.create({
    productId: product._id,
    type: INVENTORY_TYPES.ADD,
    quantityChanged: product.quantity,
    previousQty: 0,
    newQty: product.quantity,
    referenceId: uuidv4()
  });

  return product;
};

const getAllProducts = async () =>
  Product.find({ isDeleted: false }).sort({ createdAt: -1 });

const searchProductsByHsn = async (hsn) =>
  Product.find({
    isDeleted: false,
    hsnCode: { $regex: hsn, $options: 'i' }
  }).sort({ createdAt: -1 });

const updateProduct = async (id, payload) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new Error('Product not found');
  }

  const previousQty = product.quantity;

  Object.entries(payload).forEach(([key, value]) => {
    product[key] = value;
  });

  await product.save();

  if (payload.quantity !== undefined && previousQty !== product.quantity) {
    await InventoryLog.create({
      productId: product._id,
      type: INVENTORY_TYPES.EDIT,
      quantityChanged: product.quantity - previousQty,
      previousQty,
      newQty: product.quantity,
      referenceId: uuidv4()
    });
  }

  return product;
};

const softDeleteProduct = async (id) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new Error('Product not found');
  }

  product.isDeleted = true;
  await product.save();

  return { id: product._id, isDeleted: product.isDeleted };
};

module.exports = {
  createProduct,
  getAllProducts,
  searchProductsByHsn,
  updateProduct,
  softDeleteProduct
};
