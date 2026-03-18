const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productCode: {
      type: String,
      required: true
    },
    hsnCode: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0
    },
    gstRate: {
      type: Number,
      required: true,
      min: 0
    },
    lineAmount: {
      type: Number,
      required: true
    },
    cgst: {
      type: Number,
      required: true
    },
    sgst: {
      type: Number,
      required: true
    },
    lineFinalAmount: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    items: {
      type: [saleItemSchema],
      required: true,
      validate: {
        validator: (val) => val.length > 0,
        message: 'At least one sale item is required'
      }
    },
    totalAmount: {
      type: Number,
      required: true
    },
    cgst: {
      type: Number,
      required: true
    },
    sgst: {
      type: Number,
      required: true
    },
    finalAmount: {
      type: Number,
      required: true
    },
    soldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

saleSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Sale', saleSchema);
