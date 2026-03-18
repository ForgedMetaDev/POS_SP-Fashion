const express = require('express');
const { login } = require('../controllers/authController');
const { loginValidation } = require('../validations/authValidation');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.post('/login', loginValidation, validateRequest, login);

module.exports = router;
