import express from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  processPayment,
  updateOrderTracking,
  updateDriverLocation,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

// GET /api/orders - Get all orders (with filters: userId, umkmId, driverId, status)
router.get('/', getAllOrders);

// GET /api/orders/:id - Get order by ID
router.get('/:id', getOrderById);

// POST /api/orders - Create new order
router.post('/', createOrder);

// POST /api/orders/payment - Process payment
router.post('/payment', processPayment);

// PATCH /api/orders/:id/status - Update order status (for driver/admin)
router.patch('/:id/status', updateOrderStatus);

// PATCH /api/orders/:id/tracking - Update order tracking (for UMKM)
router.patch('/:id/tracking', updateOrderTracking);

// PATCH /api/orders/:id/driver-location - Update driver location (for driver)
router.patch('/:id/driver-location', updateDriverLocation);

// DELETE /api/orders/:id - Delete order
router.delete('/:id', deleteOrder);

export default router;

