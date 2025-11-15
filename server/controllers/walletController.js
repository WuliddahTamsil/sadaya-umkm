import { getWalletByUserId, updateWalletBalance } from '../models/walletModel.js';
import { createTransaction, getTransactionsByUserId } from '../models/walletTransactionModel.js';

// Get wallet balance by user ID
export const getWalletController = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan' });
    }
    
    const wallet = await getWalletByUserId(userId);
    
    res.json({
      success: true,
      data: wallet
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data dompet' });
  }
};

// Top up wallet
export const topUpWalletController = async (req, res) => {
  try {
    const { userId, amount, paymentMethod } = req.body;
    
    if (!userId || !amount) {
      return res.status(400).json({ error: 'User ID dan jumlah top up diperlukan' });
    }
    
    if (amount < 10000) {
      return res.status(400).json({ error: 'Minimal top up Rp 10.000' });
    }
    
    // Simulasi pembayaran top up (dalam real app, ini akan terhubung ke payment gateway)
    // Untuk sekarang, langsung approve
    const wallet = await updateWalletBalance(userId, amount, 'add');
    
    // Create transaction record
    await createTransaction({
      userId,
      type: 'topup',
      amount: amount,
      description: `Top Up via ${paymentMethod || 'Transfer Bank'}`,
      status: 'completed'
    });
    
    console.log(`✅ Top up berhasil: User ${userId}, Amount Rp ${amount}`);
    
    res.json({
      success: true,
      message: 'Top up berhasil',
      data: wallet
    });
  } catch (error) {
    console.error('Top up error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat top up' });
  }
};

// Get transaction history
export const getTransactionHistoryController = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan' });
    }
    
    const transactions = await getTransactionsByUserId(userId);
    
    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil riwayat transaksi' });
  }
};
