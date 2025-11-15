import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
  return await readOrders();
}

// Get order by ID
export async function getOrderById(id) {
  const orders = await readOrders();
  return orders.find(order => order.id === id);
}

// Get orders by user ID
export async function getOrdersByUserId(userId) {
  const orders = await readOrders();
  return orders.filter(order => order.userId === userId);
}

// Get orders by UMKM ID
export async function getOrdersByUmkmId(umkmId) {
  const orders = await readOrders();
  return orders.filter(order => order.umkmId === umkmId);
}

// Get orders by driver ID
export async function getOrdersByDriverId(driverId) {
  const orders = await readOrders();
  return orders.filter(order => order.driverId === driverId);
}

// Save new order
export async function saveOrder(newOrder) {
  const orders = await readOrders();
  orders.push(newOrder);
  await writeOrders(orders);
  return newOrder;
}

// Update order
export async function updateOrder(id, changes) {
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
  const orders = await readOrders();
  const filteredOrders = orders.filter(order => order.id !== id);
  
  if (filteredOrders.length === orders.length) {
    return null; // Order not found
  }
  
  await writeOrders(filteredOrders);
  return true;
}

