import { v4 as uuidv4 } from 'uuid';
import {
  getAllProducts,
  getProductsByUMKM,
  getProductById,
  saveProduct,
  updateProduct,
  deleteProduct
} from '../models/productModel.js';

// Get all products (for buyer homepage)
export const getAllProductsController = async (req, res) => {
  try {
    const { umkmId, category, status } = req.query;
    let products = await getAllProducts();

    // Filter by UMKM if provided
    if (umkmId) {
      products = products.filter(p => p.umkmId === umkmId);
    }

    // Filter by category if provided
    if (category) {
      products = products.filter(p => p.category === category);
    }

    // Filter by status if provided (default: only active)
    if (status) {
      products = products.filter(p => p.status === status);
    } else {
      // Default: only show active products for buyers
      products = products.filter(p => p.status === 'active');
    }

    res.json(products);
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data produk' });
  }
};

// Get products by UMKM ID
export const getProductsByUMKMController = async (req, res) => {
  try {
    const { umkmId } = req.params;
    const products = await getProductsByUMKM(umkmId);
    res.json(products);
  } catch (error) {
    console.error('Get products by UMKM error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data produk' });
  }
};

// Get product by ID
export const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data produk' });
  }
};

// Create new product
export const createProductController = async (req, res) => {
  try {
    const { name, price, stock, category, description, image, umkmId, umkmName } = req.body;

    // Validasi input
    if (!name || !price || !stock || !category || !umkmId) {
      return res.status(400).json({ error: 'Data produk tidak lengkap' });
    }

    const newProduct = {
      id: uuidv4(),
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=400',
      umkmId,
      umkmName: umkmName || '',
      sold: 0,
      rating: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedProduct = await saveProduct(newProduct);
    console.log(`✅ Produk baru ditambahkan oleh UMKM ${umkmId}:`, savedProduct.name);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat produk' });
  }
};

// Update product
export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validasi bahwa produk ada
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    // Validasi bahwa UMKM yang mengupdate adalah pemilik produk
    if (updates.umkmId && updates.umkmId !== existingProduct.umkmId) {
      return res.status(403).json({ error: 'Anda tidak memiliki izin untuk mengupdate produk ini' });
    }

    // Parse numeric fields if provided
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.stock) updates.stock = parseInt(updates.stock);

    const updatedProduct = await updateProduct(id, updates);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengupdate produk' });
  }
};

// Delete product
export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    // Validasi bahwa produk ada
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    await deleteProduct(id);
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus produk' });
  }
};

