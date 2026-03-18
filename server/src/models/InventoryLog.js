const mongoose = require('mongoose');
const INVENTORY_TYPES = require('../constants/inventoryTypes');

const inventoryLogSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    type: {
      type: String,
      enum: Object.values(INVENTORY_TYPES),
      required: true
    },
    quantityChanged: {
      type: Number,
      required: true
    },
    previousQty: {
      type: Number,
      required: true
    },
    newQty: {
      type: Number,
      required: true
    },
    referenceId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

inventoryLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
