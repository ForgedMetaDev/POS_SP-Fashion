const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    hsnCode: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: 0
    },
    mrp: {
      type: Number,
      required: true,
      min: 0
    },
    gstRate: {
      type: Number,
      required: true,
      min: 0
    },
    lowStockThreshold: {
      type: Number,
      required: true,
      min: 0
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
