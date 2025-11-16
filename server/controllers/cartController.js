import {
  getCartByUserId,
  getCartItemById,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../models/cartModel.js';
import { getProductById } from '../models/productModel.js';

// Get cart items by user ID
export const getCartController = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan' });
    }
    
    const cartItems = await getCartByUserId(userId);
    
    // Enrich dengan data produk
    const enrichedCartItems = await Promise.all(
      cartItems.map(async (item) => {
        try {
          const product = await getProductById(item.id_produk);
          return {
            ...item,
            product: product || null
          };
        } catch (error) {
          console.error(`Error fetching product ${item.id_produk}:`, error);
          return {
            ...item,
            product: null
          };
        }
      })
    );
    
    res.json(enrichedCartItems);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data keranjang' });
  }
};

// Add item to cart
export const addToCartController = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;
    
    // Validasi input
    if (!userId || !productId) {
      return res.status(400).json({ error: 'User ID dan Product ID diperlukan' });
    }
    
    // Validasi produk ada
    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    
    // Validasi stok
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Stok produk tidak mencukupi' });
    }
    
    // Validasi status produk
    if (product.status !== 'active') {
      return res.status(400).json({ error: 'Produk tidak tersedia' });
    }
    
    const cartItem = await addToCart(userId, productId, quantity, product.price);
    console.log(`✅ Produk ditambahkan ke keranjang: User ${userId}, Product ${productId}`);
    
    res.status(201).json({
      message: 'Produk berhasil ditambahkan ke keranjang',
      cartItem
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan ke keranjang' });
  }
};

// Update cart item quantity
export const updateCartItemController = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, userId } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Jumlah harus lebih dari 0' });
    }
    
    // Validasi item milik user
    const cartItem = await getCartItemById(id);
    if (!cartItem) {
      return res.status(404).json({ error: 'Item keranjang tidak ditemukan' });
    }
    
    if (cartItem.id_user !== userId) {
      return res.status(403).json({ error: 'Anda tidak memiliki izin untuk mengubah item ini' });
    }
    
    // Validasi stok produk
    const product = await getProductById(cartItem.id_produk);
    if (!product) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Stok produk tidak mencukupi' });
    }
    
    const updatedItem = await updateCartItem(id, { 
      jumlah: quantity,
      harga_saat_ini: product.price // Update harga terbaru
    });
    
    res.json({
      message: 'Item keranjang berhasil diperbarui',
      cartItem: updatedItem
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui item keranjang' });
  }
};

// Remove item from cart
export const removeCartItemController = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    // Validasi item milik user
    const cartItem = await getCartItemById(id);
    if (!cartItem) {
      return res.status(404).json({ error: 'Item keranjang tidak ditemukan' });
    }
    
    if (cartItem.id_user !== userId) {
      return res.status(403).json({ error: 'Anda tidak memiliki izin untuk menghapus item ini' });
    }
    
    await removeCartItem(id);
    console.log(`✅ Item dihapus dari keranjang: ${id}`);
    
    res.json({ message: 'Item berhasil dihapus dari keranjang' });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus item keranjang' });
  }
};

// Clear cart
export const clearCartController = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan' });
    }
    
    await clearCart(userId);
    console.log(`✅ Keranjang dikosongkan untuk user: ${userId}`);
    
    res.json({ message: 'Keranjang berhasil dikosongkan' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengosongkan keranjang' });
  }
};

