import { v4 as uuidv4 } from 'uuid';
import {
  getAllOrders as getAllOrdersModel,
  getOrderById as getOrderByIdModel,
  getOrdersByUserId,
  getOrdersByUmkmId,
  getOrdersByDriverId,
  saveOrder as saveOrderModel,
  updateOrder as updateOrderModel,
  deleteOrder as deleteOrderModel
} from '../models/orderModel.js';
import {
  saveNotification as saveNotificationModel
} from '../models/notificationModel.js';
import { getUserById, getAllUsers as getAllUsersModel } from '../models/userModel.js';
import { getWalletByUserId, updateWalletBalance } from '../models/walletModel.js';
import { createTransaction } from '../models/walletTransactionModel.js';

// Get all orders (with filters)
export const getAllOrders = async (req, res) => {
  try {
    const { userId, umkmId, driverId, status } = req.query;
    let orders = await getAllOrdersModel();

    // Filter by userId
    if (userId && userId !== 'all') {
      orders = orders.filter(order => order.userId === userId);
    }

    // Filter by umkmId
    if (umkmId && umkmId !== 'all') {
      orders = orders.filter(order => order.umkmId === umkmId);
    }

    // Filter by driverId - khusus untuk driver
    // Driver bisa lihat: 
    // 1. Orders dengan status "ready" (belum ada driverId) - order baru yang siap diambil
    // 2. Orders dengan status "pickup" atau "delivered" yang driverId-nya sesuai - order yang sudah diambil driver tersebut
    if (driverId && driverId !== 'all') {
      orders = orders.filter(order => {
        // Order siap diambil (ready) dan belum ada driver
        if (order.status === 'ready' && !order.driverId) {
          return true;
        }
        // Order yang sudah diambil oleh driver ini (status pickup atau delivered)
        if (order.driverId === driverId && (order.status === 'pickup' || order.status === 'delivered' || order.status === 'completed')) {
          return true;
        }
        return false;
      });
    }

    // Filter by status
    if (status && status !== 'all') {
      orders = orders.filter(order => order.status === status);
    }

    // Sort by createdAt (newest first)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data orders' });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdModel(id);

    if (!order) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data order' });
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      umkmId,
      storeName,
      storeAddress,
      items,
      total,
      deliveryFee,
      deliveryAddress,
      paymentMethod,
      notes
    } = req.body;

    // Validasi input
    if (!userId || !umkmId || !items || items.length === 0 || !total || !deliveryAddress) {
      return res.status(400).json({ error: 'Data order tidak lengkap' });
    }

    // Validasi user dan UMKM
    const user = await getUserById(userId);
    const umkm = await getUserById(umkmId);

    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    if (!umkm || umkm.role !== 'umkm') {
      return res.status(404).json({ error: 'UMKM tidak ditemukan' });
    }

    // Buat order baru
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newOrder = {
      id: orderId,
      userId,
      userName: user.name,
      userEmail: user.email,
      umkmId,
      storeName: storeName || umkm.storeName || umkm.name,
      storeAddress: storeAddress || umkm.storeAddress || umkm.address,
      items,
      subtotal: total - (deliveryFee || 0),
      deliveryFee: deliveryFee || 0,
      total,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cash',
      paymentStatus: 'pending', // pending, paid, failed
      notes: notes || null,
      status: 'preparing', // preparing -> ready -> pickup -> delivered -> completed
      driverId: null,
      driverName: null,
      trackingNumber: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Simpan order
    const savedOrder = await saveOrderModel(newOrder);

    // Buat notifikasi untuk UMKM
    await saveNotificationModel({
      id: uuidv4(),
      userId: umkmId,
      type: 'order',
      title: 'Pesanan Baru! 🎉',
      message: `Pesanan baru dari ${user.name} - Total: Rp ${total.toLocaleString('id-ID')}`,
      orderId: savedOrder.id,
      status: 'pending',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Order berhasil dibuat',
      data: savedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat order' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, driverId, notes } = req.body;

    // Validasi status
    const validStatuses = ['preparing', 'ready', 'pickup', 'delivered', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status tidak valid. Status yang diizinkan: ${validStatuses.join(', ')}` });
    }

    const order = await getOrderByIdModel(id);
    if (!order) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    const updateData = {
      status,
      updatedAt: new Date().toISOString()
    };

    // Jika status ready, buat notifikasi untuk driver
    if (status === 'ready' && order.status !== 'ready') {
      try {
        // Cari driver yang online (bisa dikembangkan lebih lanjut)
        const allUsers = await getAllUsersModel();
        const availableDrivers = allUsers.filter(
          user => user.role === 'driver' && user.status === 'active' && user.isVerified
        );

        // Buat notifikasi untuk semua driver yang tersedia
        for (const driver of availableDrivers) {
          try {
            await saveNotificationModel({
              id: uuidv4(),
              userId: driver.id,
              type: 'delivery',
              title: 'Order Menunggu! 🚚',
              message: `Order baru dari ${order.storeName} - Upah: Rp ${(order.deliveryFee || 0).toLocaleString('id-ID')}`,
              orderId: order.id,
              status: 'pending',
              read: false,
              createdAt: new Date().toISOString()
            });
          } catch (notifError) {
            console.error(`Error creating notification for driver ${driver.id}:`, notifError);
            // Continue dengan driver lainnya meskipun satu gagal
          }
        }
      } catch (error) {
        console.error('Error processing driver notifications:', error);
        // Jangan gagalkan update order hanya karena notifikasi gagal
      }
    }

    // Jika driver mengambil order
    if (driverId && status === 'pickup') {
      const driver = await getUserById(driverId);
      if (driver) {
        updateData.driverId = driverId;
        updateData.driverName = driver.name;
        updateData.pickupTime = new Date().toISOString();
        // Set initial driver location to store location (will be updated by driver)
        updateData.driverLocation = {
          lat: -6.5978, // Default Bogor coordinates
          lng: 106.8067,
          updatedAt: new Date().toISOString()
        };

        // Notifikasi untuk UMKM
        await saveNotificationModel({
          id: uuidv4(),
          userId: order.umkmId,
          type: 'order',
          title: 'Order Diambil Driver ✓',
          message: `Driver ${driver.name} telah mengambil order ${order.id}`,
          orderId: order.id,
          status: 'processing',
          read: false,
          createdAt: new Date().toISOString()
        });

        // Notifikasi untuk User
        await saveNotificationModel({
          id: uuidv4(),
          userId: order.userId,
          type: 'order',
          title: 'Pesanan Sedang Dikirim ✓',
          message: `Driver ${driver.name} sedang mengantar pesanan Anda`,
          orderId: order.id,
          status: 'processing',
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    }

    // Jika order selesai
    if (status === 'delivered') {
      updateData.deliveredAt = new Date().toISOString();

      // Notifikasi untuk User
      await saveNotificationModel({
        id: uuidv4(),
        userId: order.userId,
        type: 'order',
        title: 'Pesanan Telah Diterima! 🎉',
        message: `Pesanan ${order.id} telah diterima. Terima kasih sudah berbelanja!`,
        orderId: order.id,
        status: 'completed',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    if (notes) {
      updateData.notes = notes;
    }

    const updatedOrder = await updateOrderModel(id, updateData);
    
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order tidak ditemukan atau gagal diupdate' });
    }

    res.json({
      success: true,
      message: 'Status order berhasil diupdate',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      id: req.params.id,
      status: req.body.status
    });
    res.status(500).json({ 
      error: 'Terjadi kesalahan saat update status order',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Process payment
export const processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, userId } = req.body;

    if (!orderId || !paymentMethod || !userId) {
      return res.status(400).json({ error: 'Order ID, payment method, dan user ID diperlukan' });
    }

    const order = await getOrderByIdModel(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ error: 'Anda tidak memiliki izin untuk membayar order ini' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Order sudah dibayar' });
    }

    // Handle payment based on method
    if (paymentMethod === 'wallet' || paymentMethod === 'saldo') {
      // Check wallet balance
      const wallet = await getWalletByUserId(userId);
      if (wallet.balance < order.total) {
        return res.status(400).json({ error: 'Saldo tidak mencukupi' });
      }

      // Deduct wallet balance
      await updateWalletBalance(userId, order.total, 'subtract');
      
      // Save transaction
      await createTransaction({
        userId,
        type: 'payment',
        amount: order.total,
        description: `Pembayaran Order ${order.id}`,
        orderId: order.id,
        status: 'completed'
      });
    }

    // Update order payment status
    const updatedOrder = await updateOrderModel(orderId, {
      paymentStatus: 'paid',
      paymentMethod: paymentMethod,
      paidAt: new Date().toISOString()
    });

    // Create notification for UMKM
    await saveNotificationModel({
      id: uuidv4(),
      userId: order.umkmId,
      type: 'order',
      title: 'Pembayaran Diterima! 💰',
      message: `Pembayaran order ${order.id} telah diterima - Rp ${order.total.toLocaleString('id-ID')}`,
      orderId: order.id,
      status: 'processing',
      read: false,
      createdAt: new Date().toISOString()
    });

    console.log(`✅ Pembayaran berhasil: Order ${orderId}, Method ${paymentMethod}`);

    res.json({
      success: true,
      message: 'Pembayaran berhasil',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses pembayaran' });
  }
};

// Update order status (for UMKM to update tracking)
export const updateOrderTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, notes, umkmId } = req.body;

    const order = await getOrderByIdModel(id);
    if (!order) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    // Validasi UMKM
    if (order.umkmId !== umkmId) {
      return res.status(403).json({ error: 'Anda tidak memiliki izin untuk mengupdate order ini' });
    }

    // Validasi status
    const validStatuses = ['preparing', 'ready', 'pickup', 'delivered', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status tidak valid. Status yang diizinkan: ${validStatuses.join(', ')}` });
    }

    const updateData = {
      updatedAt: new Date().toISOString()
    };

    if (status) {
      updateData.status = status;
      
      // Generate tracking number when status changes to ready
      if (status === 'ready' && !order.trackingNumber) {
        updateData.trackingNumber = `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      }
    }

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    if (notes) {
      updateData.notes = notes;
    }

    const updatedOrder = await updateOrderModel(id, updateData);

    // Create notification for user
    if (status) {
      const statusMessages = {
        'preparing': 'Pesanan Diterima',
        'ready': 'Pesanan Diproses UMKM',
        'pickup': 'Pesanan Dikemas',
        'delivered': 'Pesanan Dikirim',
        'completed': 'Pesanan Selesai'
      };

      await saveNotificationModel({
        id: uuidv4(),
        userId: order.userId,
        type: 'order',
        title: `${statusMessages[status]} ✓`,
        message: `Status pesanan ${order.id} telah diupdate`,
        orderId: order.id,
        status: status === 'completed' ? 'completed' : 'processing',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      message: 'Status order berhasil diupdate',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Update order tracking error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengupdate status order' });
  }
};

// Update driver location
export const updateDriverLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng, driverId } = req.body;

    if (!lat || !lng || !driverId) {
      return res.status(400).json({ error: 'Latitude, longitude, dan driver ID diperlukan' });
    }

    const order = await getOrderByIdModel(id);
    if (!order) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    // Validasi bahwa driver yang mengupdate adalah driver yang mengambil order
    if (order.driverId !== driverId) {
      return res.status(403).json({ error: 'Anda tidak memiliki izin untuk mengupdate lokasi order ini' });
    }

    // Validasi bahwa order status adalah pickup atau delivered
    if (order.status !== 'pickup' && order.status !== 'delivered') {
      return res.status(400).json({ error: 'Lokasi driver hanya bisa diupdate saat order sedang diantar' });
    }

    const updateData = {
      driverLocation: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        updatedAt: new Date().toISOString()
      }
    };

    const updatedOrder = await updateOrderModel(id, updateData);

    res.json({
      success: true,
      message: 'Lokasi driver berhasil diupdate',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Update driver location error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengupdate lokasi driver' });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteOrderModel(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Order tidak ditemukan' });
    }

    res.json({
      success: true,
      message: 'Order berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus order' });
  }
};

