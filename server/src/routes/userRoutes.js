const express = require('express');
const {
  createUser,
  getUsers,
  updateUser,
  toggleUserStatus
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const {
  createUserValidation,
  updateUserValidation,
  toggleUserValidation
} = require('../validations/userValidation');
const ROLES = require('../constants/roles');

const router = express.Router();

router.use(protect);
router.use(authorizeRoles(ROLES.ADMIN));

router.post('/', createUserValidation, validateRequest, createUser);
router.get('/', getUsers);
router.put('/:id', updateUserValidation, validateRequest, updateUser);
router.patch('/:id/toggle-status', toggleUserValidation, validateRequest, toggleUserStatus);

module.exports = router;
