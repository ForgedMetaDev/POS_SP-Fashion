const express = require('express');
const { getInventoryLogs } = require('../controllers/inventoryController');
const { protect } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const ROLES = require('../constants/roles');

const router = express.Router();

router.get('/logs', protect, authorizeRoles(ROLES.ADMIN), getInventoryLogs);

module.exports = router;
