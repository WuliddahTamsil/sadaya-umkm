import { readFile, writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = join(__dirname, '../data/cart.json');

// Helper function untuk membaca data dari file
async function readCart() {
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
async function writeCart(cartItems) {
  // Pastikan folder data ada
  const dataDir = dirname(DATA_FILE);
  
  try {
    await mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Folder sudah ada, tidak masalah
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
  
  await writeFile(DATA_FILE, JSON.stringify(cartItems, null, 2), 'utf-8');
  console.log(`✅ Keranjang berhasil disimpan ke database: ${DATA_FILE}`);
}

// Get all cart items by user ID
export async function getCartByUserId(userId) {
  const cartItems = await readCart();
  return cartItems.filter(item => item.id_user === userId);
}

// Get cart item by ID
export async function getCartItemById(id) {
  const cartItems = await readCart();
  return cartItems.find(item => item.id === id);
}

// Add item to cart (jika produk sudah ada, tambah jumlahnya)
export async function addToCart(userId, productId, quantity, currentPrice) {
  const cartItems = await readCart();
  
  // Cek apakah produk sudah ada di keranjang user ini
  const existingItem = cartItems.find(
    item => item.id_user === userId && item.id_produk === productId
  );
  
  if (existingItem) {
    // Jika sudah ada, tambah jumlahnya
    existingItem.jumlah += quantity;
    existingItem.harga_saat_ini = currentPrice; // Update harga terbaru
    existingItem.updatedAt = new Date().toISOString();
  } else {
    // Jika belum ada, buat item baru
    const newItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      id_user: userId,
      id_produk: productId,
      jumlah: quantity,
      harga_saat_ini: currentPrice,
      tanggal_ditambahkan: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    cartItems.push(newItem);
  }
  
  await writeCart(cartItems);
  return existingItem || cartItems[cartItems.length - 1];
}

// Update cart item quantity
export async function updateCartItem(id, updates) {
  const cartItems = await readCart();
  const index = cartItems.findIndex(item => item.id === id);
  
  if (index === -1) {
    throw new Error('Item keranjang tidak ditemukan');
  }
  
  cartItems[index] = { 
    ...cartItems[index], 
    ...updates, 
    updatedAt: new Date().toISOString() 
  };
  
  await writeCart(cartItems);
  return cartItems[index];
}

// Remove item from cart
export async function removeCartItem(id) {
  const cartItems = await readCart();
  const filteredItems = cartItems.filter(item => item.id !== id);
  await writeCart(filteredItems);
  return true;
}

// Clear cart for a user
export async function clearCart(userId) {
  const cartItems = await readCart();
  const filteredItems = cartItems.filter(item => item.id_user !== userId);
  await writeCart(filteredItems);
  return true;
}

