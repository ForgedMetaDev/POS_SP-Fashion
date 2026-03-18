const express = require('express');
const { getMetrics } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const ROLES = require('../constants/roles');

const router = express.Router();

router.get('/metrics', protect, authorizeRoles(ROLES.ADMIN), getMetrics);

module.exports = router;
