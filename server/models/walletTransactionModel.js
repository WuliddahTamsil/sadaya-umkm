import { readFile, writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Jika MONGODB_URI ada, gunakan MongoDB, jika tidak gunakan file JSON
const useMongoDB = !!process.env.MONGODB_URI;

// Lazy load MongoDB model
let mongoWalletTransactionModelPromise = null;
async function getMongoModel() {
  if (!useMongoDB) return null;
  if (!mongoWalletTransactionModelPromise) {
    mongoWalletTransactionModelPromise = import('./walletTransactionModelMongo.js').then(module => {
      console.log('✅ Using MongoDB for wallet transaction storage');
      return module;
    }).catch(error => {
      console.warn('⚠️ MongoDB import failed, falling back to JSON file:', error.message);
      return null;
    });
  }
  return await mongoWalletTransactionModelPromise;
}

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
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getTransactionsByUserId(userId);
  }
  const transactions = await readTransactions();
  return transactions
    .filter(t => t.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Create new transaction
export async function createTransaction(transactionData) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.createTransaction(transactionData);
  }
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

