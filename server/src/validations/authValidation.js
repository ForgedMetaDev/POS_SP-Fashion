const { body } = require('express-validator');

const loginValidation = [
  body('username').trim().notEmpty().withMessage('username is required'),
  body('password').notEmpty().withMessage('password is required')
];

module.exports = {
  loginValidation
};
