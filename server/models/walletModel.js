import { readFile, writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = join(__dirname, '../data/wallets.json');

// Helper function untuk membaca data dari file
async function readWallets() {
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
async function writeWallets(wallets) {
  const dataDir = dirname(DATA_FILE);
  
  try {
    await mkdir(dataDir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
  
  await writeFile(DATA_FILE, JSON.stringify(wallets, null, 2), 'utf-8');
}

// Get wallet by user ID (create if not exists)
export async function getWalletByUserId(userId) {
  const wallets = await readWallets();
  let wallet = wallets.find(w => w.userId === userId);
  
  if (!wallet) {
    // Create new wallet with 0 balance
    wallet = {
      userId,
      balance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    wallets.push(wallet);
    await writeWallets(wallets);
  }
  
  return wallet;
}

// Update wallet balance
export async function updateWalletBalance(userId, amount, operation = 'add') {
  const wallets = await readWallets();
  let wallet = wallets.find(w => w.userId === userId);
  
  if (!wallet) {
    wallet = {
      userId,
      balance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    wallets.push(wallet);
  }
  
  if (operation === 'add') {
    wallet.balance += amount;
  } else if (operation === 'subtract') {
    wallet.balance -= amount;
  } else if (operation === 'set') {
    wallet.balance = amount;
  }
  
  wallet.updatedAt = new Date().toISOString();
  await writeWallets(wallets);
  return wallet;
}
