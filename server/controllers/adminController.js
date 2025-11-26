import { getAllUsers as getAllUsersModel } from '../models/userModel.js';
import { getAllOrders as getAllOrdersModel } from '../models/orderModel.js';

// Get recent activities for admin dashboard
export const getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20; // Default 20 activities
    const hours = parseInt(req.query.hours) || 24; // Default last 24 hours

    const now = new Date();
    const hoursAgo = new Date(now.getTime() - hours * 60 * 60 * 1000);

    // Get all users and orders
    const [users, orders] = await Promise.all([
      getAllUsersModel(),
      getAllOrdersModel()
    ]);

    const activities = [];

    // 1. New UMKM pending approval (created recently, not verified)
    const newUMKMPending = users
      .filter(user => {
        if (user.role !== 'umkm') return false;
        if (user.isVerified) return false;
        const createdAt = new Date(user.createdAt || user.joinDate || now);
        return createdAt >= hoursAgo;
      })
      .map(user => ({
        type: 'UMKM Baru',
        id: user.id || user._id,
        name: user.storeName || user.name,
        time: user.createdAt || user.joinDate,
        status: 'pending',
        role: 'umkm',
        email: user.email
      }));

    // 2. New Driver pending approval (created recently, not verified)
    const newDriverPending = users
      .filter(user => {
        if (user.role !== 'driver') return false;
        if (user.isVerified) return false;
        const createdAt = new Date(user.createdAt || user.joinDate || now);
        return createdAt >= hoursAgo;
      })
      .map(user => ({
        type: 'Driver Baru',
        id: user.id || user._id,
        name: user.name,
        time: user.createdAt || user.joinDate,
        status: 'pending',
        role: 'driver',
        email: user.email
      }));

    // 3. UMKM approved recently (updated recently, verified)
    const umkmApproved = users
      .filter(user => {
        if (user.role !== 'umkm') return false;
        if (!user.isVerified) return false;
        const updatedAt = new Date(user.updatedAt || now);
        return updatedAt >= hoursAgo && updatedAt > new Date(user.createdAt || user.joinDate || 0);
      })
      .map(user => ({
        type: 'UMKM Disetujui',
        id: user.id || user._id,
        name: user.storeName || user.name,
        time: user.updatedAt,
        status: 'approved',
        role: 'umkm',
        email: user.email
      }));

    // 4. Driver approved recently (updated recently, verified)
    const driverApproved = users
      .filter(user => {
        if (user.role !== 'driver') return false;
        if (!user.isVerified) return false;
        const updatedAt = new Date(user.updatedAt || now);
        return updatedAt >= hoursAgo && updatedAt > new Date(user.createdAt || user.joinDate || 0);
      })
      .map(user => ({
        type: 'Driver Disetujui',
        id: user.id || user._id,
        name: user.name,
        time: user.updatedAt,
        status: 'approved',
        role: 'driver',
        email: user.email
      }));

    // 5. Recent orders
    const recentOrders = orders
      .filter(order => {
        const createdAt = new Date(order.createdAt || now);
        return createdAt >= hoursAgo;
      })
      .map(order => ({
        type: 'Pesanan',
        id: order.id || order._id,
        name: `Order #${(order.id || order._id).toString().substring(0, 8)}`,
        time: order.createdAt,
        status: order.status === 'completed' || order.status === 'delivered' ? 'completed' : 'pending',
        orderId: order.id || order._id,
        userName: order.userName,
        storeName: order.storeName,
        total: order.total
      }));

    // Combine all activities
    activities.push(...newUMKMPending);
    activities.push(...newDriverPending);
    activities.push(...umkmApproved);
    activities.push(...driverApproved);
    activities.push(...recentOrders);

    // Sort by time (most recent first)
    activities.sort((a, b) => {
      const timeA = new Date(a.time || 0).getTime();
      const timeB = new Date(b.time || 0).getTime();
      return timeB - timeA;
    });

    // Limit results
    const limitedActivities = activities.slice(0, limit);

    // Format time relative to now
    const formattedActivities = limitedActivities.map(activity => {
      const activityTime = new Date(activity.time);
      const diffMs = now.getTime() - activityTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      let timeAgo = '';
      if (diffMins < 1) {
        timeAgo = 'Baru saja';
      } else if (diffMins < 60) {
        timeAgo = `${diffMins} menit yang lalu`;
      } else if (diffHours < 24) {
        timeAgo = `${diffHours} jam yang lalu`;
      } else {
        timeAgo = `${diffDays} hari yang lalu`;
      }

      return {
        ...activity,
        timeAgo,
        timestamp: activity.time
      };
    });

    res.json({
      success: true,
      count: formattedActivities.length,
      data: formattedActivities
    });
  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Terjadi kesalahan saat mengambil aktivitas terbaru',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

