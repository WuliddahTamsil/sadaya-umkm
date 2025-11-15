import { readFile, writeFile, mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Jika MONGODB_URI ada, gunakan MongoDB, jika tidak gunakan file JSON
const useMongoDB = !!process.env.MONGODB_URI;

// Lazy load MongoDB model
let mongoProductModelPromise = null;
async function getMongoModel() {
  if (!useMongoDB) return null;
  if (!mongoProductModelPromise) {
    mongoProductModelPromise = import('./productModelMongo.js').then(module => {
      console.log('✅ Using MongoDB for product storage');
      return module;
    }).catch(error => {
      console.warn('⚠️ MongoDB import failed, falling back to JSON file:', error.message);
      return null;
    });
  }
  return await mongoProductModelPromise;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = join(__dirname, '../data/products.json');

// Helper function untuk membaca data dari file
async function readProducts() {
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
async function writeProducts(products) {
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
  
  await writeFile(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`✅ Produk berhasil disimpan ke database: ${DATA_FILE}`);
}

// Get all products
export async function getAllProducts() {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getAllProducts();
  }
  return await readProducts();
}

// Get products by UMKM ID
export async function getProductsByUMKM(umkmId) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getProductsByUMKM(umkmId);
  }
  const products = await readProducts();
  return products.filter(product => product.umkmId === umkmId);
}

// Get product by ID
export async function getProductById(id) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getProductById(id);
  }
  const products = await readProducts();
  return products.find(product => product.id === id);
}

// Save new product
export async function saveProduct(newProduct) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.saveProduct(newProduct);
  }
  const products = await readProducts();
  products.push(newProduct);
  await writeProducts(products);
  return newProduct;
}

// Update product
export async function updateProduct(id, updates) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.updateProduct(id, updates);
  }
  const products = await readProducts();
  const index = products.findIndex(product => product.id === id);
  
  if (index === -1) {
    throw new Error('Produk tidak ditemukan');
  }

  products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
  await writeProducts(products);
  return products[index];
}

// Delete product
export async function deleteProduct(id) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    const result = await mongoModel.deleteProduct(id);
    return result;
  }
  const products = await readProducts();
  const filteredProducts = products.filter(product => product.id !== id);
  await writeProducts(filteredProducts);
  return true;
}

