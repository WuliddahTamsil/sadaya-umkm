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
  if (!file) {
    console.warn('⚠️ prepareFileForBlob: file is null/undefined');
    return null;
  }
  
  console.log('🔍 Preparing file for blob:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    hasBuffer: !!file.buffer,
    hasPath: !!file.path
  });
  
  // Jika file dari memory storage (Vercel)
  if (file.buffer) {
    console.log('✅ File has buffer, using memory storage format');
    return {
      buffer: file.buffer,
      filename: file.originalname,
      mimetype: file.mimetype,
      originalname: file.originalname
    };
  }
  
  // Jika file dari disk storage (local)
  if (file.path) {
    console.log('⚠️ File has path but no buffer - this should not happen in Vercel');
    // Di Vercel, kita selalu pakai memory storage, jadi ini tidak seharusnya terjadi
  }
  
  console.warn('⚠️ prepareFileForBlob: file has no buffer or path');
  return null;
}

export const uploadDriverDocuments = async (req, res) => {
  try {
    const { userId, phoneNumber, vehicleType, vehiclePlate } = req.body;

    console.log('=== UPLOAD DRIVER DOCUMENTS START ===');
    console.log('User ID:', userId);
    console.log('Request body:', { phoneNumber, vehicleType, vehiclePlate });

    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan' });
    }

    const files = req.files || {};
    console.log('📁 Files received:', Object.keys(files));
    console.log('📁 Files details:', {
      ktpFile: files.ktpFile ? `${files.ktpFile.length} file(s)` : 'none',
      simFile: files.simFile ? `${files.simFile.length} file(s)` : 'none',
      stnkFile: files.stnkFile ? `${files.stnkFile.length} file(s)` : 'none',
      selfieFile: files.selfieFile ? `${files.selfieFile.length} file(s)` : 'none',
      vehiclePhotoFile: files.vehiclePhotoFile ? `${files.vehiclePhotoFile.length} file(s)` : 'none'
    });

    const documents = {};

    // Cek apakah di Vercel (perlu upload ke blob) atau local (simpan ke disk)
    const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

    console.log('🔍 Environment check:', {
      isVercel,
      hasBlobToken,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV
    });

    if (isVercel && hasBlobToken) {
      // Upload ke Vercel Blob Storage
      console.log('📤 Uploading driver documents to Vercel Blob...');
      
      const filesToUpload = {};
      if (files.ktpFile && files.ktpFile[0]) {
        const prepared = prepareFileForBlob(files.ktpFile[0]);
        if (prepared) {
          filesToUpload.ktpFile = prepared;
          console.log('✅ Prepared ktpFile for upload');
        } else {
          console.warn('⚠️ Failed to prepare ktpFile');
        }
      }
      if (files.simFile && files.simFile[0]) {
        const prepared = prepareFileForBlob(files.simFile[0]);
        if (prepared) {
          filesToUpload.simFile = prepared;
          console.log('✅ Prepared simFile for upload');
        }
      }
      if (files.stnkFile && files.stnkFile[0]) {
        const prepared = prepareFileForBlob(files.stnkFile[0]);
        if (prepared) {
          filesToUpload.stnkFile = prepared;
          console.log('✅ Prepared stnkFile for upload');
        }
      }
      if (files.selfieFile && files.selfieFile[0]) {
        const prepared = prepareFileForBlob(files.selfieFile[0]);
        if (prepared) {
          filesToUpload.selfieFile = prepared;
          console.log('✅ Prepared selfieFile for upload');
        }
      }
      if (files.vehiclePhotoFile && files.vehiclePhotoFile[0]) {
        const prepared = prepareFileForBlob(files.vehiclePhotoFile[0]);
        if (prepared) {
          filesToUpload.vehiclePhotoFile = prepared;
          console.log('✅ Prepared vehiclePhotoFile for upload');
        }
      }

      console.log('📤 Files to upload:', Object.keys(filesToUpload));

      // Upload semua file ke blob
      const blobUrls = await uploadMultipleToBlob(filesToUpload, 'driver');
      
      console.log('📋 Blob URLs received:', blobUrls);
      
      // Simpan URL blob ke documents
      Object.assign(documents, blobUrls);
      
      console.log('✅ Driver documents uploaded to blob:', Object.keys(blobUrls));
      console.log('📝 Documents object:', documents);
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
    console.log('📝 Documents values:', documents);

    const updatedUser = await updateUser(userId, updateData);
    
    console.log('✅ User updated. File fields:', {
      ktpFile: updatedUser.ktpFile ? `✅ ${updatedUser.ktpFile.substring(0, 50)}...` : '❌',
      simFile: updatedUser.simFile ? `✅ ${updatedUser.simFile.substring(0, 50)}...` : '❌',
      stnkFile: updatedUser.stnkFile ? `✅ ${updatedUser.stnkFile.substring(0, 50)}...` : '❌',
      selfieFile: updatedUser.selfieFile ? `✅ ${updatedUser.selfieFile.substring(0, 50)}...` : '❌',
      vehiclePhotoFile: updatedUser.vehiclePhotoFile ? `✅ ${updatedUser.vehiclePhotoFile.substring(0, 50)}...` : '❌'
    });
    
    console.log('=== UPLOAD DRIVER DOCUMENTS END ===');

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

