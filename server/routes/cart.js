import express from 'express';
import {
  getCartController,
  addToCartController,
  updateCartItemController,
  removeCartItemController,
  clearCartController
} from '../controllers/cartController.js';

const router = express.Router();

// GET /api/cart/:userId - Get cart items by user ID
router.get('/:userId', getCartController);

// POST /api/cart/add - Add item to cart
router.post('/add', addToCartController);

// PATCH /api/cart/:id - Update cart item quantity
router.patch('/:id', updateCartItemController);

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', removeCartItemController);

// POST /api/cart/clear - Clear cart
router.post('/clear', clearCartController);

export default router;

