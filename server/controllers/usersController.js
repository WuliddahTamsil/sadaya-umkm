import { getAllUsers as getAllUsersModel, getUserById as getUserByIdModel, updateUser } from '../models/userModel.js';

export const getAllUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    let users = await getAllUsersModel();

    // Filter by role jika ada
    if (role && role !== 'all') {
      users = users.filter(user => {
        const userRole = user.role === 'umkm' ? 'UMKM' : 
                        user.role === 'driver' ? 'Driver' : 
                        user.role === 'user' ? 'User' : user.role;
        return userRole === role;
      });
    }

    // Filter by status jika ada
    if (status && status !== 'all') {
      users = users.filter(user => user.status === status);
    }

    // Hapus password dari response
    const usersWithoutPassword = users.map(({ password, ...user }) => user);

    res.json({
      success: true,
      count: usersWithoutPassword.length,
      data: usersWithoutPassword
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdModel(id);

    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    // Hapus password dari response
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data user' });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid' });
    }

    const user = await getUserByIdModel(id);
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    // Update status dan isVerified jika status menjadi active
    // Jika status menjadi active dan sudah ada dokumen, set isOnboarded: true
    const updateData = {
      status,
      isVerified: status === 'active' ? true : user.isVerified,
      updatedAt: new Date().toISOString()
    };

    // Jika status menjadi active dan sudah verified, set isOnboarded: true untuk semua role
    // Jika admin sudah setujui (active + verified), berarti user sudah boleh pakai dashboard
    if (status === 'active' && updateData.isVerified && !user.isOnboarded) {
      updateData.isOnboarded = true;
    }

    const updatedUser = await updateUser(id, updateData);

    // Hapus password dari response
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Status user berhasil diupdate',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat update status user' });
  }
};

