const express = require('express');
const {
  getDailySalesSummary,
  getMonthlySalesSummary,
  exportDailySalesSummaryExcel,
  exportMonthlySalesSummaryExcel
} = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const ROLES = require('../constants/roles');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN));

router.get('/daily-summary', getDailySalesSummary);
router.get('/monthly-summary', getMonthlySalesSummary);
router.get('/daily-summary/excel', exportDailySalesSummaryExcel);
router.get('/monthly-summary/excel', exportMonthlySalesSummaryExcel);

module.exports = router;
