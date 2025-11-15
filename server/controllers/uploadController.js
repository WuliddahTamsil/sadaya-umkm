import { updateUser } from '../models/userModel.js';

// Helper untuk mendapatkan path relatif dari path absolut
function getRelativePath(fullPath) {
  const parts = fullPath.split(/[/\\]/);
  const uploadsIndex = parts.indexOf('uploads');
  if (uploadsIndex !== -1) {
    return parts.slice(uploadsIndex).join('/');
  }
  return fullPath;
}

export const uploadDriverDocuments = async (req, res) => {
  try {
    const { userId, phoneNumber, vehicleType, vehiclePlate } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan' });
    }

    const files = req.files;
    const documents = {};

    // Map file paths
    if (files.ktpFile) documents.ktpFile = getRelativePath(files.ktpFile[0].path);
    if (files.simFile) documents.simFile = getRelativePath(files.simFile[0].path);
    if (files.stnkFile) documents.stnkFile = getRelativePath(files.stnkFile[0].path);
    if (files.selfieFile) documents.selfieFile = getRelativePath(files.selfieFile[0].path);
    if (files.vehiclePhotoFile) documents.vehiclePhotoFile = getRelativePath(files.vehiclePhotoFile[0].path);

    // Update user dengan data tambahan
    const updateData = {
      ...documents,
      phone: phoneNumber || undefined,
      vehicleType: vehicleType || undefined,
      vehiclePlate: vehiclePlate || undefined,
      isOnboarded: true, // Set onboarding selesai
      updatedAt: new Date().toISOString()
    };

    const updatedUser = await updateUser(userId, updateData);

    // Hapus password dari response
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Dokumen driver berhasil diupload',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Upload driver documents error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat upload dokumen' });
  }
};

export const uploadUMKMDocuments = async (req, res) => {
  try {
    const { userId, storeName, storeAddress, storeDescription, phoneNumber } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan' });
    }

    const files = req.files;
    const documents = {};

    // Map file paths
    if (files.ktpFile) documents.ktpFile = getRelativePath(files.ktpFile[0].path);
    if (files.storePhotoFile) documents.storePhotoFile = getRelativePath(files.storePhotoFile[0].path);
    if (files.businessPermitFile) documents.businessPermitFile = getRelativePath(files.businessPermitFile[0].path);

    // Update user dengan data tambahan
    const updateData = {
      ...documents,
      storeName: storeName || undefined,
      storeAddress: storeAddress || undefined,
      storeDescription: storeDescription || undefined,
      phone: phoneNumber || undefined,
      isOnboarded: true, // Set onboarding selesai
      updatedAt: new Date().toISOString()
    };

    const updatedUser = await updateUser(userId, updateData);

    // Hapus password dari response
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Dokumen UMKM berhasil diupload',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Upload UMKM documents error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat upload dokumen' });
  }
};

export const uploadProductImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File gambar diperlukan' });
    }

    // Get relative path untuk URL
    const imagePath = getRelativePath(req.file.path);
    // Use relative path in production, full URL in development
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction ? '' : 'http://localhost:3000';
    const imageUrl = `${baseUrl}/${imagePath}`;

    res.json({
      success: true,
      message: 'Gambar produk berhasil diupload',
      imageUrl: imageUrl,
      imagePath: imagePath
    });
  } catch (error) {
    console.error('Upload product image error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat upload gambar' });
  }
};

