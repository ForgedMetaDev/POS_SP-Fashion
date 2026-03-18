const express = require('express');
const {
  createProduct,
  getProducts,
  searchByHsn,
  updateProduct,
  softDeleteProduct
} = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  searchHsnValidation
} = require('../validations/productValidation');
const ROLES = require('../constants/roles');

const router = express.Router();

router.use(protect);

router.post('/', authorizeRoles(ROLES.ADMIN), createProductValidation, validateRequest, createProduct);
router.get('/', getProducts);
router.get('/search/hsn', searchHsnValidation, validateRequest, searchByHsn);
router.put('/:id', authorizeRoles(ROLES.ADMIN), updateProductValidation, validateRequest, updateProduct);
router.delete(
  '/:id',
  authorizeRoles(ROLES.ADMIN),
  productIdValidation,
  validateRequest,
  softDeleteProduct
);

module.exports = router;
