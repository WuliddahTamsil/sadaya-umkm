import { readFile, writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = join(__dirname, '../data/walletTransactions.json');

// Helper function untuk membaca data dari file
async function readTransactions() {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Helper function untuk menulis data ke file
async function writeTransactions(transactions) {
  const dataDir = dirname(DATA_FILE);
  
  try {
    await mkdir(dataDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
  
  await writeFile(DATA_FILE, JSON.stringify(transactions, null, 2), 'utf-8');
}

// Get transactions by user ID
export async function getTransactionsByUserId(userId) {
  const transactions = await readTransactions();
  return transactions
    .filter(t => t.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Create new transaction
export async function createTransaction(transactionData) {
  const transactions = await readTransactions();
  
  const newTransaction = {
    id: uuidv4(),
    userId: transactionData.userId,
    type: transactionData.type, // 'topup', 'payment', 'refund'
    amount: transactionData.amount,
    description: transactionData.description || '',
    orderId: transactionData.orderId || null,
    status: transactionData.status || 'completed', // 'completed', 'pending', 'failed'
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  transactions.push(newTransaction);
  await writeTransactions(transactions);
  return newTransaction;
}

