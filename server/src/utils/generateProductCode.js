const Product = require('../models/Product');

const generateProductCode = async () => {
  const lastProduct = await Product.findOne({}, { productCode: 1 })
    .sort({ productCode: -1 })
    .lean();

  if (!lastProduct?.productCode) {
    return 'GAR-0001';
  }

  const lastNumber = Number(lastProduct.productCode.split('-')[1] || 0);
  const nextNumber = String(lastNumber + 1).padStart(4, '0');

  return `GAR-${nextNumber}`;
};

module.exports = generateProductCode;
