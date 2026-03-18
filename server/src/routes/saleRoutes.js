const express = require('express');
const { createSale, getSalesByDate, getAllSales } = require('../controllers/saleController');
const { protect } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createSaleValidation, getSalesByDateValidation } = require('../validations/saleValidation');
const ROLES = require('../constants/roles');

const router = express.Router();

router.use(protect);

router.post('/', authorizeRoles(ROLES.ADMIN, ROLES.WORKER), createSaleValidation, validateRequest, createSale);
router.get('/by-date', getSalesByDateValidation, validateRequest, getSalesByDate);
router.get('/', getAllSales);

module.exports = router;
