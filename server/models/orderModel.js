import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Jika MONGODB_URI ada, gunakan MongoDB, jika tidak gunakan file JSON
const useMongoDB = !!process.env.MONGODB_URI;

// Lazy load MongoDB model
let mongoOrderModelPromise = null;
async function getMongoModel() {
  if (!useMongoDB) return null;
  if (!mongoOrderModelPromise) {
    mongoOrderModelPromise = import('./orderModelMongo.js').then(module => {
      console.log('✅ Using MongoDB for order storage');
      return module;
    }).catch(error => {
      console.warn('⚠️ MongoDB import failed, falling back to JSON file:', error.message);
      return null;
    });
  }
  return await mongoOrderModelPromise;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = join(__dirname, '../data/orders.json');

// Helper function untuk membaca data dari file
async function readOrders() {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Jika file tidak ada, return array kosong
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Helper function untuk menulis data ke file
async function writeOrders(orders) {
  await writeFile(DATA_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

// Get all orders
export async function getAllOrders() {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getAllOrders();
  }
  return await readOrders();
}

// Get order by ID
export async function getOrderById(id) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getOrderById(id);
  }
  const orders = await readOrders();
  return orders.find(order => order.id === id);
}

// Get orders by user ID
export async function getOrdersByUserId(userId) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getOrdersByUserId(userId);
  }
  const orders = await readOrders();
  return orders.filter(order => order.userId === userId);
}

// Get orders by UMKM ID
export async function getOrdersByUmkmId(umkmId) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getOrdersByUMKMId(umkmId);
  }
  const orders = await readOrders();
  return orders.filter(order => order.umkmId === umkmId);
}

// Get orders by driver ID
export async function getOrdersByDriverId(driverId) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getOrdersByDriverId(driverId);
  }
  const orders = await readOrders();
  return orders.filter(order => order.driverId === driverId);
}

// Save new order
export async function saveOrder(newOrder) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.saveOrder(newOrder);
  }
  const orders = await readOrders();
  orders.push(newOrder);
  await writeOrders(orders);
  return newOrder;
}

// Update order
export async function updateOrder(id, changes) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.updateOrder(id, changes);
  }
  const orders = await readOrders();
  const index = orders.findIndex(order => order.id === id);
  
  if (index === -1) {
    return null;
  }
  
  orders[index] = {
    ...orders[index],
    ...changes,
    updatedAt: new Date().toISOString()
  };
  
  await writeOrders(orders);
  return orders[index];
}

// Delete order
export async function deleteOrder(id) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    const result = await mongoModel.deleteOrder(id);
    return result ? true : null;
  }
  const orders = await readOrders();
  const filteredOrders = orders.filter(order => order.id !== id);
  
  if (filteredOrders.length === orders.length) {
    return null; // Order not found
  }
  
  await writeOrders(filteredOrders);
  return true;
}

