import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { saveUser, getUserByEmail, getAllUsers } from '../models/userModel.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, description, businessName } = req.body;

    // Validasi input
    if (!name && !businessName) {
      return res.status(400).json({ error: 'Nama atau nama bisnis harus diisi' });
    }
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, dan role harus diisi' });
    }

    // Cegah registrasi dengan email admin
    if (email === 'admin@gmail.com') {
      return res.status(400).json({ error: 'Email ini tidak dapat digunakan untuk registrasi' });
    }

    // Cegah registrasi role admin
    if (role === 'admin') {
      return res.status(400).json({ error: 'Role admin tidak dapat didaftarkan' });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tentukan nama berdasarkan role
    const displayName = role === 'umkm' ? businessName : name;

    // Buat user object
    const newUser = {
      id: uuidv4(),
      name: displayName,
      email,
      password: hashedPassword,
      role,
      phone: phone || null,
      address: address || null,
      description: description || null,
      status: role === 'admin' || role === 'user' ? 'active' : 'pending', // Driver dan UMKM perlu verifikasi
      isVerified: role === 'admin' || role === 'user',
      isOnboarded: role === 'user' || role === 'admin',
      joinDate: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Simpan user
    await saveUser(newUser);

    // Return user tanpa password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'Registrasi berhasil',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat registrasi' });
  }
};

export const loginUser = async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body));
    console.log('Request headers:', req.headers);
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Validation failed: email or password missing');
      return res.status(400).json({ error: 'Email dan password harus diisi' });
    }
    
    console.log('Looking for user with email:', email);

    // Cari user
    let user;
    try {
      console.log('Calling getUserByEmail...');
      user = await getUserByEmail(email);
      console.log('User found:', user ? 'Yes' : 'No');
      if (user) {
        console.log('User ID:', user.id);
        console.log('User email:', user.email);
        console.log('User has password:', !!user.password);
      }
    } catch (dbError) {
      console.error('Database error saat mencari user:', dbError);
      console.error('Error stack:', dbError.stack);
      return res.status(500).json({ 
        error: 'Terjadi kesalahan saat mengakses database',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // Pastikan user memiliki password
    if (!user.password) {
      console.error('User tidak memiliki password:', user.email);
      return res.status(500).json({ error: 'Data user tidak valid' });
    }

    // Verifikasi password
    let isValidPassword;
    try {
      console.log('Comparing password with bcrypt...');
      isValidPassword = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isValidPassword);
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError);
      console.error('Bcrypt error stack:', bcryptError.stack);
      return res.status(500).json({ 
        error: 'Terjadi kesalahan saat memverifikasi password',
        details: process.env.NODE_ENV === 'development' ? bcryptError.message : undefined
      });
    }

    if (!isValidPassword) {
      console.log('Password invalid');
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // Return user tanpa password
    console.log('Login successful, preparing response...');
    const { password: _, ...userWithoutPassword } = user;
    
    console.log('Sending success response');
    res.json({
      message: 'Login berhasil',
      user: userWithoutPassword
    });
    console.log('=== LOGIN SUCCESS ===');
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Terjadi kesalahan saat login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

