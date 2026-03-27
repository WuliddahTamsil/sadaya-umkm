import {
  getCartByUserId,
  getCartItemById,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../models/cartModel.js';
import { getProductById } from '../models/productModel.js';
import { getAllUsers } from '../models/userModel.js';

// Helper function untuk enrich produk dengan data UMKM
async function enrichProductWithUMKM(product) {
  if (!product) return null;
  
  try {
    // Ambil semua UMKM sekaligus untuk efisiensi
    const allUsers = await getAllUsers();
    const umkmMap = new Map();
    
    // Buat map UMKM berdasarkan ID - TIDAK filter berdasarkan status untuk memastikan semua UMKM terdeteksi
    // Filter hanya berdasarkan role, status akan divalidasi saat checkout
    allUsers
      .filter(user => {
        const userRole = user.role?.toString().toLowerCase().trim();
        return userRole === 'umkm';
      })
      .forEach(umkm => {
        // Normalize UMKM ID untuk key map - gunakan multiple keys untuk memastikan ditemukan
        const normalizedId = umkm.id?.toString().trim();
        const lowerId = normalizedId?.toLowerCase();
        
        const umkmData = {
          id: normalizedId, // Simpan ID yang sudah dinormalisasi
          name: umkm.name || umkm.storeName || 'UMKM',
          storeName: umkm.storeName || umkm.name || 'UMKM',
          address: umkm.address || umkm.storeAddress || '',
          phone: umkm.phone || '',
          status: umkm.status || 'active',
          role: umkm.role || 'umkm'
        };
        
        // Set dengan multiple keys untuk memastikan lookup berhasil
        umkmMap.set(normalizedId, umkmData);
        if (lowerId && lowerId !== normalizedId) {
          umkmMap.set(lowerId, umkmData);
        }
      });

    // Enrich produk dengan data UMKM (case-insensitive lookup dengan multiple attempts)
    const normalizedProductUmkmId = product.umkmId?.toString().trim();
    let umkmInfo = null;
    
    if (normalizedProductUmkmId) {
      // 1. Try exact match
      umkmInfo = umkmMap.get(normalizedProductUmkmId);
      
      // 2. Try case-insensitive match
      if (!umkmInfo) {
        umkmInfo = umkmMap.get(normalizedProductUmkmId.toLowerCase());
      }
      
      // 3. Try case-insensitive lookup dari entries
      if (!umkmInfo) {
        for (const [umkmId, umkmData] of umkmMap.entries()) {
          const umkmIdNormalized = umkmId?.toString().trim();
          if (umkmIdNormalized?.toLowerCase() === normalizedProductUmkmId.toLowerCase()) {
            umkmInfo = umkmData;
            console.log(`✅ UMKM ditemukan dengan case-insensitive lookup: ${umkmId} untuk product ${product.id}`);
            break;
          }
        }
      }
    }
    
    // Gunakan umkmId yang sudah dinormalisasi dari umkmInfo jika ada, atau gunakan product.umkmId
    const finalUmkmId = umkmInfo?.id || normalizedProductUmkmId || product.umkmId;
    
    // Log jika UMKM tidak ditemukan untuk debugging
    if (!umkmInfo && normalizedProductUmkmId) {
      console.warn(`⚠️ UMKM dengan ID "${normalizedProductUmkmId}" tidak ditemukan untuk product ${product.id}. Total UMKM di map: ${umkmMap.size}`);
    }
    
    return {
      ...product,
      umkmId: finalUmkmId, // Gunakan ID yang sudah dinormalisasi
      umkmName: product.umkmName || umkmInfo?.name || umkmInfo?.storeName || 'UMKM',
      umkmStoreName: umkmInfo?.storeName || umkmInfo?.name || 'UMKM',
      umkmAddress: umkmInfo?.address || '',
      umkmPhone: umkmInfo?.phone || '',
      umkmStatus: umkmInfo?.status || 'active' // Include status untuk validasi di frontend
    };
  } catch (error) {
    console.error('Error enriching product with UMKM data:', error);
    // Jika error, return produk dengan umkmId minimal
    return {
      ...product,
      umkmId: product.umkmId || null,
      umkmName: product.umkmName || 'UMKM'
    };
  }
}

// Get cart items by user ID
export const getCartController = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan' });
    }
    
    const cartItems = await getCartByUserId(userId);
    
    // Enrich dengan data produk dan UMKM
    const enrichedCartItems = await Promise.all(
      cartItems.map(async (item) => {
        try {
          const product = await getProductById(item.id_produk);
          if (!product) {
            console.warn(`Product ${item.id_produk} not found for cart item ${item.id}`);
            return {
              ...item,
              product: null
            };
          }
          
          // Enrich produk dengan data UMKM
          const enrichedProduct = await enrichProductWithUMKM(product);
          
          return {
            ...item,
            product: enrichedProduct
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

