import { updateUser } from '../models/userModel.js';
import { uploadToBlob, uploadMultipleToBlob } from '../utils/blobStorage.js';

// Helper untuk mendapatkan path relatif dari path absolut
function getRelativePath(fullPath) {
  const parts = fullPath.split(/[/\\]/);
  const uploadsIndex = parts.indexOf('uploads');
  if (uploadsIndex !== -1) {
    return parts.slice(uploadsIndex).join('/');
  }
  return fullPath;
}

// Helper untuk convert multer file ke format untuk blob upload
function prepareFileForBlob(file) {
  if (!file) return null;
  
  // Jika file dari memory storage (Vercel)
  if (file.buffer) {
    return {
      buffer: file.buffer,
      filename: file.originalname,
      mimetype: file.mimetype,
      originalname: file.originalname
    };
  }
  
  // Jika file dari disk storage (local)
  // Baca file dari disk dan convert ke buffer
  // Note: Di Vercel, kita selalu pakai memory storage
  return null;
}

export const uploadDriverDocuments = async (req, res) => {
  try {
    const { userId, phoneNumber, vehicleType, vehiclePlate } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan' });
    }

    const files = req.files || {};
    const documents = {};

    // Cek apakah di Vercel (perlu upload ke blob) atau local (simpan ke disk)
    const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

    if (isVercel && hasBlobToken) {
      // Upload ke Vercel Blob Storage
      console.log('📤 Uploading driver documents to Vercel Blob...');
      
      const filesToUpload = {};
      if (files.ktpFile && files.ktpFile[0]) {
        filesToUpload.ktpFile = prepareFileForBlob(files.ktpFile[0]);
      }
      if (files.simFile && files.simFile[0]) {
        filesToUpload.simFile = prepareFileForBlob(files.simFile[0]);
      }
      if (files.stnkFile && files.stnkFile[0]) {
        filesToUpload.stnkFile = prepareFileForBlob(files.stnkFile[0]);
      }
      if (files.selfieFile && files.selfieFile[0]) {
        filesToUpload.selfieFile = prepareFileForBlob(files.selfieFile[0]);
      }
      if (files.vehiclePhotoFile && files.vehiclePhotoFile[0]) {
        filesToUpload.vehiclePhotoFile = prepareFileForBlob(files.vehiclePhotoFile[0]);
      }

      // Upload semua file ke blob
      const blobUrls = await uploadMultipleToBlob(filesToUpload, 'driver');
      
      // Simpan URL blob ke documents
      Object.assign(documents, blobUrls);
      
      console.log('✅ Driver documents uploaded to blob:', Object.keys(blobUrls));
    } else if (!isVercel) {
      // Local development: simpan path file
      if (files.ktpFile && files.ktpFile[0]?.path) documents.ktpFile = getRelativePath(files.ktpFile[0].path);
      if (files.simFile && files.simFile[0]?.path) documents.simFile = getRelativePath(files.simFile[0].path);
      if (files.stnkFile && files.stnkFile[0]?.path) documents.stnkFile = getRelativePath(files.stnkFile[0].path);
      if (files.selfieFile && files.selfieFile[0]?.path) documents.selfieFile = getRelativePath(files.selfieFile[0].path);
      if (files.vehiclePhotoFile && files.vehiclePhotoFile[0]?.path) documents.vehiclePhotoFile = getRelativePath(files.vehiclePhotoFile[0].path);
    } else {
      console.warn('⚠️ BLOB_READ_WRITE_TOKEN not set. File uploads will be skipped.');
    }

    // Update user dengan data tambahan
    // Hanya include field yang ada nilainya (jangan undefined)
    const updateData = {
      ...documents, // File URLs dari blob
      isOnboarded: true, // Set onboarding selesai
      updatedAt: new Date().toISOString()
    };
    
    // Hanya tambahkan field jika ada nilainya
    if (phoneNumber) updateData.phone = phoneNumber;
    if (vehicleType) updateData.vehicleType = vehicleType;
    if (vehiclePlate) updateData.vehiclePlate = vehiclePlate;

    console.log('📝 Updating user with data:', JSON.stringify(updateData, null, 2));
    console.log('📝 File documents:', Object.keys(documents));

    const updatedUser = await updateUser(userId, updateData);
    
    console.log('✅ User updated. File fields:', {
      ktpFile: updatedUser.ktpFile ? '✅' : '❌',
      simFile: updatedUser.simFile ? '✅' : '❌',
      stnkFile: updatedUser.stnkFile ? '✅' : '❌',
      selfieFile: updatedUser.selfieFile ? '✅' : '❌',
      vehiclePhotoFile: updatedUser.vehiclePhotoFile ? '✅' : '❌'
    });

    // Hapus password dari response
    const { password, ...userWithoutPassword } = updatedUser;

    const message = Object.keys(documents).length > 0
      ? 'Dokumen driver berhasil diupload'
      : 'Data driver berhasil disimpan (tanpa file)';

    res.json({
      success: true,
      message: message,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Upload driver documents error:', error);
    console.error('Error stack:', error.stack);
    
    // Pastikan response belum dikirim
    if (!res.headersSent) {
      const errorMessage = error.message || 'Terjadi kesalahan saat upload dokumen';
      res.status(500).json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

export const uploadUMKMDocuments = async (req, res) => {
  try {
    const { userId, storeName, storeAddress, storeDescription, phoneNumber } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan' });
    }

    const files = req.files || {};
    const documents = {};

    // Cek apakah di Vercel (perlu upload ke blob) atau local (simpan ke disk)
    const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

    if (isVercel && hasBlobToken) {
      // Upload ke Vercel Blob Storage
      console.log('📤 Uploading UMKM documents to Vercel Blob...');
      
      const filesToUpload = {};
      if (files.ktpFile && files.ktpFile[0]) {
        filesToUpload.ktpFile = prepareFileForBlob(files.ktpFile[0]);
      }
      if (files.storePhotoFile && files.storePhotoFile[0]) {
        filesToUpload.storePhotoFile = prepareFileForBlob(files.storePhotoFile[0]);
      }
      if (files.businessPermitFile && files.businessPermitFile[0]) {
        filesToUpload.businessPermitFile = prepareFileForBlob(files.businessPermitFile[0]);
      }

      // Upload semua file ke blob
      const blobUrls = await uploadMultipleToBlob(filesToUpload, 'umkm');
      
      // Simpan URL blob ke documents
      Object.assign(documents, blobUrls);
      
      console.log('✅ UMKM documents uploaded to blob:', Object.keys(blobUrls));
    } else if (!isVercel) {
      // Local development: simpan path file
      if (files.ktpFile && files.ktpFile[0]?.path) documents.ktpFile = getRelativePath(files.ktpFile[0].path);
      if (files.storePhotoFile && files.storePhotoFile[0]?.path) documents.storePhotoFile = getRelativePath(files.storePhotoFile[0].path);
      if (files.businessPermitFile && files.businessPermitFile[0]?.path) documents.businessPermitFile = getRelativePath(files.businessPermitFile[0].path);
    } else {
      console.warn('⚠️ BLOB_READ_WRITE_TOKEN not set. File uploads will be skipped.');
    }

    // Update user dengan data tambahan
    // Hanya include field yang ada nilainya (jangan undefined)
    const updateData = {
      ...documents, // File URLs dari blob
      isOnboarded: true, // Set onboarding selesai
      updatedAt: new Date().toISOString()
    };
    
    // Hanya tambahkan field jika ada nilainya
    if (storeName) updateData.storeName = storeName;
    if (storeAddress) updateData.storeAddress = storeAddress;
    if (storeDescription) updateData.storeDescription = storeDescription;
    if (phoneNumber) updateData.phone = phoneNumber;

    console.log('📝 Updating UMKM user with data:', JSON.stringify(updateData, null, 2));
    console.log('📝 File documents:', Object.keys(documents));

    const updatedUser = await updateUser(userId, updateData);
    
    console.log('✅ UMKM user updated. File fields:', {
      ktpFile: updatedUser.ktpFile ? '✅' : '❌',
      storePhotoFile: updatedUser.storePhotoFile ? '✅' : '❌',
      businessPermitFile: updatedUser.businessPermitFile ? '✅' : '❌'
    });

    // Hapus password dari response
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Dokumen UMKM berhasil diupload',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Upload UMKM documents error:', error);
    console.error('Error stack:', error.stack);
    
    // Pastikan response belum dikirim
    if (!res.headersSent) {
      const errorMessage = error.message || 'Terjadi kesalahan saat upload dokumen';
      res.status(500).json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

export const uploadProductImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File gambar diperlukan' });
    }

    const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

    let imageUrl, imagePath;

    if (isVercel && hasBlobToken) {
      // Upload ke Vercel Blob Storage
      const fileData = prepareFileForBlob(req.file);
      if (!fileData) {
        return res.status(400).json({ error: 'File tidak valid' });
      }
      
      imageUrl = await uploadToBlob(
        fileData.buffer,
        fileData.filename,
        fileData.mimetype,
        'products'
      );
      imagePath = imageUrl; // Di blob, path = URL
    } else if (!isVercel) {
      // Local development: gunakan path relatif
      imagePath = getRelativePath(req.file.path);
      const baseUrl = 'http://localhost:3000';
      imageUrl = `${baseUrl}/${imagePath}`;
    } else {
      return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN tidak dikonfigurasi' });
    }

    res.json({
      success: true,
      message: 'Gambar produk berhasil diupload',
      imageUrl: imageUrl,
      imagePath: imagePath
    });
  } catch (error) {
    console.error('Upload product image error:', error);
    console.error('Error stack:', error.stack);
    
    // Pastikan response belum dikirim
    if (!res.headersSent) {
      const errorMessage = error.message || 'Terjadi kesalahan saat upload gambar';
      res.status(500).json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

