const { body, param } = require('express-validator');

const createUserValidation = [
  body('fullName').trim().notEmpty().withMessage('fullName is required'),
  body('username').trim().notEmpty().withMessage('username is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
  body('role').isIn(['admin', 'worker']).withMessage('invalid role')
];

const updateUserValidation = [
  param('id').isMongoId().withMessage('invalid user id'),
  body('fullName').optional().trim().notEmpty().withMessage('fullName cannot be empty'),
  body('username').optional().trim().notEmpty().withMessage('username cannot be empty'),
  body('role').optional().isIn(['admin', 'worker']).withMessage('invalid role'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters')
];

const toggleUserValidation = [param('id').isMongoId().withMessage('invalid user id')];

module.exports = {
  createUserValidation,
  updateUserValidation,
  toggleUserValidation
};
