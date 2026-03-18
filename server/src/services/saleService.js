const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const InventoryLog = require('../models/InventoryLog');
const INVENTORY_TYPES = require('../constants/inventoryTypes');
const gstCalculator = require('../utils/gstCalculator');

const createSale = async (items, soldBy) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let totalAmount = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let finalAmount = 0;

    const saleItems = [];

    for (const item of items) {
      const product = await Product.findOne({ _id: item.productId, isDeleted: false }).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      const lineAmount = Number((item.quantity * item.sellingPrice).toFixed(2));
      const { cgst, sgst, finalAmount: lineFinalAmount } = gstCalculator(lineAmount, product.gstRate);

      totalAmount += lineAmount;
      totalCgst += cgst;
      totalSgst += sgst;
      finalAmount += lineFinalAmount;

      saleItems.push({
        productId: product._id,
        productCode: product.productCode,
        hsnCode: product.hsnCode,
        name: product.name,
        type: product.type,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
        gstRate: product.gstRate,
        lineAmount,
        cgst,
        sgst,
        lineFinalAmount
      });

      const previousQty = product.quantity;
      product.quantity -= item.quantity;
      await product.save({ session });

      await InventoryLog.create(
        [
          {
            productId: product._id,
            type: INVENTORY_TYPES.SALE,
            quantityChanged: -item.quantity,
            previousQty,
            newQty: product.quantity,
            referenceId: uuidv4()
          }
        ],
        { session }
      );
    }

    const [sale] = await Sale.create(
      [
        {
          items: saleItems,
          totalAmount: Number(totalAmount.toFixed(2)),
          cgst: Number(totalCgst.toFixed(2)),
          sgst: Number(totalSgst.toFixed(2)),
          finalAmount: Number(finalAmount.toFixed(2)),
          soldBy
        }
      ],
      { session }
    );

    await session.commitTransaction();
    return sale;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getSalesByDate = async (dateString) => {
  const date = new Date(dateString);
  const startDate = new Date(date.setHours(0, 0, 0, 0));
  const endDate = new Date(date.setHours(23, 59, 59, 999));

  return Sale.find({ createdAt: { $gte: startDate, $lte: endDate } })
    .populate('soldBy', 'fullName username role')
    .sort({ createdAt: -1 });
};

const getAllSales = async () =>
  Sale.find()
    .populate('soldBy', 'fullName username role')
    .sort({ createdAt: -1 });

module.exports = {
  createSale,
  getSalesByDate,
  getAllSales
};
