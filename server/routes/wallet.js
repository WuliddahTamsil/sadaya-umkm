import express from 'express';
import {
  getWalletController,
  topUpWalletController,
  getTransactionHistoryController
} from '../controllers/walletController.js';

const router = express.Router();

// GET /api/wallet/:userId - Get wallet balance
router.get('/:userId', getWalletController);

// POST /api/wallet/topup - Top up wallet
router.post('/topup', topUpWalletController);

// GET /api/wallet/:userId/transactions - Get transaction history
router.get('/:userId/transactions', getTransactionHistoryController);

export default router;
