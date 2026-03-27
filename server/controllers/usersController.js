import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { getAllUsers as getAllUsersModel, getUserById as getUserByIdModel, updateUser, deleteUser as deleteUserModel, saveUser, getUserByEmail } from '../models/userModel.js';

export const getAllUsers = async (req, res) => {
  try {
    const { role, status } = req.query;
    let users = await getAllUsersModel();

    // Filter by role jika ada (case-insensitive)
    if (role && role !== 'all') {
      users = users.filter(user => {
        const userRole = user.role?.toString().toLowerCase().trim();
        const normalizedRole = role.toString().toLowerCase().trim();
        
        // Map role untuk matching
        const roleMap = {
          'umkm': 'umkm',
          'driver': 'driver',
          'user': 'user',
          'UMKM': 'umkm',
          'Driver': 'driver',
          'User': 'user'
        };
        
        const mappedUserRole = roleMap[userRole] || userRole;
        const mappedFilterRole = roleMap[normalizedRole] || normalizedRole;
        
        return mappedUserRole === mappedFilterRole;
      });
    }

    // Filter by status jika ada (case-insensitive)
    if (status && status !== 'all') {
      users = users.filter(user => {
        const userStatus = user.status?.toString().toLowerCase().trim();
        const normalizedStatus = status.toString().toLowerCase().trim();
        return userStatus === normalizedStatus;
      });
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

// Update user profile (untuk semua role)
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      phone, 
      address, 
      description,
      storeName,
      storeAddress,
      storeDescription,
      ktpFile,
      storePhotoFile,
      businessPermitFile,
      vehicleType,
      vehiclePlate,
      simFile,
      stnkFile,
      selfieFile,
      vehiclePhotoFile,
      profilePhoto,
      isOnboarded
    } = req.body;

    const user = await getUserByIdModel(id);
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    // Build update data
    const updateData = {
      updatedAt: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (description !== undefined) updateData.description = description;
    
    // UMKM specific fields
    if (storeName !== undefined) updateData.storeName = storeName;
    if (storeAddress !== undefined) updateData.storeAddress = storeAddress;
    if (storeDescription !== undefined) updateData.storeDescription = storeDescription;
    if (ktpFile !== undefined) updateData.ktpFile = ktpFile;
    if (storePhotoFile !== undefined) updateData.storePhotoFile = storePhotoFile;
    if (businessPermitFile !== undefined) updateData.businessPermitFile = businessPermitFile;
    
    // Driver specific fields
    if (vehicleType !== undefined) updateData.vehicleType = vehicleType;
    if (vehiclePlate !== undefined) updateData.vehiclePlate = vehiclePlate;
    if (simFile !== undefined) updateData.simFile = simFile;
    if (stnkFile !== undefined) updateData.stnkFile = stnkFile;
    if (selfieFile !== undefined) updateData.selfieFile = selfieFile;
    if (vehiclePhotoFile !== undefined) updateData.vehiclePhotoFile = vehiclePhotoFile;

    // Shared upload fields
    if (profilePhoto !== undefined) updateData.profilePhoto = profilePhoto;
    if (isOnboarded !== undefined) updateData.isOnboarded = isOnboarded;

    const updatedUser = await updateUser(id, updateData);

    // Hapus password dari response
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat update profil' });
  }
};

// Delete user (untuk admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await getUserByIdModel(id);
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    await deleteUserModel(id);

    res.json({
      success: true,
      message: 'User berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus user' });
  }
};

export const createUser = async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      role,
      phone,
      address,
      description,
      storeName,
      storeAddress,
      storeDescription,
      vehicleType,
      vehiclePlate,
      status
    } = req.body;

    if (!name && !storeName) {
      return res.status(400).json({ error: 'Nama harus diisi' });
    }

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, dan role wajib diisi' });
    }

    email = email.toLowerCase().trim();
    password = password.trim();
    const normalizedRole = role.toString().toLowerCase();

    if (normalizedRole === 'admin') {
      return res.status(400).json({ error: 'Role admin tidak dapat dibuat melalui dashboard' });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    const defaultStatus = status || (normalizedRole === 'user' ? 'active' : 'pending');
    const isActive = defaultStatus === 'active';

    const newUser = {
      id: uuidv4(),
      name: normalizedRole === 'umkm' ? storeName || name : name,
      email,
      password: hashedPassword,
      role: normalizedRole,
      phone: phone || null,
      address: address || null,
      description: description || null,
      storeName: storeName || null,
      storeAddress: storeAddress || null,
      storeDescription: storeDescription || null,
      vehicleType: vehicleType || null,
      vehiclePlate: vehiclePlate || null,
      status: defaultStatus,
      isVerified: normalizedRole === 'user' ? true : isActive,
      isOnboarded: normalizedRole === 'user' ? true : isActive,
      totalOrders: 0,
      rating: 0,
      joinDate: now.split('T')[0],
      createdAt: now,
      updatedAt: now
    };

    await saveUser(newUser);
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User berhasil dibuat',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat user' });
  }
};

