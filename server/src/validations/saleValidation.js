const { body, query } = require('express-validator');

const createSaleValidation = [
  body('items').isArray({ min: 1 }).withMessage('items must be a non-empty array'),
  body('items.*.productId').isMongoId().withMessage('invalid productId'),
  body('items.*.quantity').isFloat({ min: 1 }).withMessage('quantity must be >= 1'),
  body('items.*.sellingPrice').isFloat({ min: 0 }).withMessage('sellingPrice must be >= 0')
];

const getSalesByDateValidation = [
  query('date')
    .isISO8601()
    .withMessage('date must be valid ISO date (YYYY-MM-DD)')
];

module.exports = {
  createSaleValidation,
  getSalesByDateValidation
};
