const { body, param, query } = require('express-validator');

const createProductValidation = [
  body('hsnCode').trim().notEmpty().withMessage('hsnCode is required'),
  body('name').trim().notEmpty().withMessage('name is required'),
  body('type').trim().notEmpty().withMessage('type is required'),
  body('quantity').isFloat({ min: 0 }).withMessage('quantity must be >= 0'),
  body('purchasePrice').isFloat({ min: 0 }).withMessage('purchasePrice must be >= 0'),
  body('mrp').isFloat({ min: 0 }).withMessage('mrp must be >= 0'),
  body('gstRate').isFloat({ min: 0 }).withMessage('gstRate must be >= 0'),
  body('lowStockThreshold').isFloat({ min: 0 }).withMessage('lowStockThreshold must be >= 0')
];

const updateProductValidation = [
  param('id').isMongoId().withMessage('invalid product id'),
  body('hsnCode').optional().trim().notEmpty().withMessage('hsnCode cannot be empty'),
  body('name').optional().trim().notEmpty().withMessage('name cannot be empty'),
  body('type').optional().trim().notEmpty().withMessage('type cannot be empty'),
  body('quantity').optional().isFloat({ min: 0 }).withMessage('quantity must be >= 0'),
  body('purchasePrice').optional().isFloat({ min: 0 }).withMessage('purchasePrice must be >= 0'),
  body('mrp').optional().isFloat({ min: 0 }).withMessage('mrp must be >= 0'),
  body('gstRate').optional().isFloat({ min: 0 }).withMessage('gstRate must be >= 0'),
  body('lowStockThreshold')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('lowStockThreshold must be >= 0')
];

const productIdValidation = [param('id').isMongoId().withMessage('invalid product id')];
const searchHsnValidation = [query('hsn').trim().notEmpty().withMessage('hsn query is required')];

module.exports = {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  searchHsnValidation
};
