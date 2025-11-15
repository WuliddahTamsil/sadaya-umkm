import express from 'express';
import {
  getAllProductsController,
  getProductsByUMKMController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController
} from '../controllers/productController.js';

const router = express.Router();

// Get all products (with optional filters)
router.get('/', getAllProductsController);

// Get products by UMKM ID
router.get('/umkm/:umkmId', getProductsByUMKMController);

// Get product by ID
router.get('/:id', getProductByIdController);

// Create new product
router.post('/', createProductController);

// Update product
router.patch('/:id', updateProductController);

// Delete product
router.delete('/:id', deleteProductController);

export default router;

