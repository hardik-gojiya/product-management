import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All product routes are protected (require authentication)
router.use(protect);

// Product CRUD routes
router.route('/')
  .post(createProduct)      // Create product
  .get(getProducts);        // Get all user's products

router.route('/:id')
  .get(getProductById)      // Get single product
  .put(updateProduct)       // Update product
  .delete(deleteProduct);   // Delete product

export default router;