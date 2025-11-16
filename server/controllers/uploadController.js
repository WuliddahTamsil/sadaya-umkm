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
    // PASTIKAN field-file SELALU diset ke updateData, tidak peduli ada atau tidak
    const updateData = {
      isOnboarded: true, // Set onboarding selesai
      updatedAt: new Date().toISOString()
    };
    
    // PASTIKAN field-file SELALU diset dari documents
    // Jika ada di documents, gunakan nilainya. Jika tidak, tetap set tapi null
    updateData.ktpFile = documents.ktpFile || null;
    updateData.simFile = documents.simFile || null;
    updateData.stnkFile = documents.stnkFile || null;
    updateData.selfieFile = documents.selfieFile || null;
    updateData.vehiclePhotoFile = documents.vehiclePhotoFile || null;
    
    // Hanya tambahkan field jika ada nilainya
    if (phoneNumber) updateData.phone = phoneNumber;
    if (vehicleType) updateData.vehicleType = vehicleType;
    if (vehiclePlate) updateData.vehiclePlate = vehiclePlate;

    console.log('📝 Documents object:', documents);
    console.log('📝 Documents keys:', Object.keys(documents));
    console.log('📝 Documents values:', {
      ktpFile: documents.ktpFile ? `✅ ${documents.ktpFile.substring(0, 50)}...` : '❌ not in documents',
      simFile: documents.simFile ? `✅ ${documents.simFile.substring(0, 50)}...` : '❌ not in documents',
      stnkFile: documents.stnkFile ? `✅ ${documents.stnkFile.substring(0, 50)}...` : '❌ not in documents',
      selfieFile: documents.selfieFile ? `✅ ${documents.selfieFile.substring(0, 50)}...` : '❌ not in documents',
      vehiclePhotoFile: documents.vehiclePhotoFile ? `✅ ${documents.vehiclePhotoFile.substring(0, 50)}...` : '❌ not in documents'
    });
    console.log('📝 Updating user with data:', JSON.stringify(updateData, null, 2));
    console.log('📝 UpdateData file fields check:', {
      ktpFile: updateData.ktpFile ? `✅ ${updateData.ktpFile.substring(0, 50)}...` : '❌ null',
      simFile: updateData.simFile ? `✅ ${updateData.simFile.substring(0, 50)}...` : '❌ null',
      stnkFile: updateData.stnkFile ? `✅ ${updateData.stnkFile.substring(0, 50)}...` : '❌ null',
      selfieFile: updateData.selfieFile ? `✅ ${updateData.selfieFile.substring(0, 50)}...` : '❌ null',
      vehiclePhotoFile: updateData.vehiclePhotoFile ? `✅ ${updateData.vehiclePhotoFile.substring(0, 50)}...` : '❌ null'
    });
    
    // PASTIKAN setidaknya ada satu file field yang berhasil diupload sebelum update
    if (!documents.ktpFile && !documents.simFile && !documents.stnkFile && !documents.selfieFile && !documents.vehiclePhotoFile) {
      console.error('❌ ERROR: No file fields to save! Documents object is empty or invalid.');
      console.error('❌ Documents:', documents);
      console.error('❌ Files received:', files);
      return res.status(400).json({ 
        error: 'Tidak ada file yang berhasil diupload. Pastikan file valid dan BLOB_READ_WRITE_TOKEN terkonfigurasi dengan benar.' 
      });
    }

    const updatedUser = await updateUser(userId, updateData);
    
    console.log('✅ User updated. File fields:', {
      ktpFile: updatedUser.ktpFile ? `✅ ${updatedUser.ktpFile.substring(0, 50)}...` : '❌ null/undefined',
      simFile: updatedUser.simFile ? `✅ ${updatedUser.simFile.substring(0, 50)}...` : '❌ null/undefined',
      stnkFile: updatedUser.stnkFile ? `✅ ${updatedUser.stnkFile.substring(0, 50)}...` : '❌ null/undefined',
      selfieFile: updatedUser.selfieFile ? `✅ ${updatedUser.selfieFile.substring(0, 50)}...` : '❌ null/undefined',
      vehiclePhotoFile: updatedUser.vehiclePhotoFile ? `✅ ${updatedUser.vehiclePhotoFile.substring(0, 50)}...` : '❌ null/undefined'
    });
    
    // Verifikasi bahwa file benar-benar tersimpan
    if (!updatedUser.ktpFile && !updatedUser.simFile && !updatedUser.stnkFile && !updatedUser.selfieFile && !updatedUser.vehiclePhotoFile) {
      console.error('❌ WARNING: No file fields saved to user!');
      console.error('❌ Documents object:', documents);
      console.error('❌ UpdateData:', updateData);
    }
    
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
      console.log('📁 Files received:', Object.keys(files));
      console.log('📁 Files details:', {
        ktpFile: files.ktpFile ? `${files.ktpFile.length} file(s)` : 'none',
        storePhotoFile: files.storePhotoFile ? `${files.storePhotoFile.length} file(s)` : 'none',
        businessPermitFile: files.businessPermitFile ? `${files.businessPermitFile.length} file(s)` : 'none'
      });
      
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
      if (files.storePhotoFile && files.storePhotoFile[0]) {
        const prepared = prepareFileForBlob(files.storePhotoFile[0]);
        if (prepared) {
          filesToUpload.storePhotoFile = prepared;
          console.log('✅ Prepared storePhotoFile for upload');
        } else {
          console.warn('⚠️ Failed to prepare storePhotoFile');
        }
      }
      if (files.businessPermitFile && files.businessPermitFile[0]) {
        const prepared = prepareFileForBlob(files.businessPermitFile[0]);
        if (prepared) {
          filesToUpload.businessPermitFile = prepared;
          console.log('✅ Prepared businessPermitFile for upload');
        } else {
          console.warn('⚠️ Failed to prepare businessPermitFile');
        }
      }

      console.log('📤 Files to upload:', Object.keys(filesToUpload));

      // Upload semua file ke blob
      const blobUrls = await uploadMultipleToBlob(filesToUpload, 'umkm');
      
      console.log('📋 Blob URLs received:', blobUrls);
      console.log('📋 Blob URLs keys:', Object.keys(blobUrls));
      
      // Simpan URL blob ke documents
      Object.assign(documents, blobUrls);
      
      console.log('✅ UMKM documents uploaded to blob:', Object.keys(blobUrls));
      console.log('📝 Documents object after assign:', documents);
    } else if (!isVercel) {
      // Local development: simpan path file
      if (files.ktpFile && files.ktpFile[0]?.path) documents.ktpFile = getRelativePath(files.ktpFile[0].path);
      if (files.storePhotoFile && files.storePhotoFile[0]?.path) documents.storePhotoFile = getRelativePath(files.storePhotoFile[0].path);
      if (files.businessPermitFile && files.businessPermitFile[0]?.path) documents.businessPermitFile = getRelativePath(files.businessPermitFile[0].path);
    } else {
      console.warn('⚠️ BLOB_READ_WRITE_TOKEN not set. File uploads will be skipped.');
    }

    // Update user dengan data tambahan
    // PASTIKAN field-file SELALU diset ke updateData, tidak peduli ada atau tidak
    const updateData = {
      isOnboarded: true, // Set onboarding selesai
      updatedAt: new Date().toISOString()
    };
    
    // PASTIKAN field-file SELALU diset dari documents
    // Jika ada di documents, gunakan nilainya. Jika tidak, tetap set tapi null
    updateData.ktpFile = documents.ktpFile || null;
    updateData.storePhotoFile = documents.storePhotoFile || null;
    updateData.businessPermitFile = documents.businessPermitFile || null;
    
    // Hanya tambahkan field jika ada nilainya
    if (storeName) updateData.storeName = storeName;
    if (storeAddress) updateData.storeAddress = storeAddress;
    if (storeDescription) updateData.storeDescription = storeDescription;
    if (phoneNumber) updateData.phone = phoneNumber;

    console.log('📝 Documents object:', documents);
    console.log('📝 Documents keys:', Object.keys(documents));
    console.log('📝 Documents values:', {
      ktpFile: documents.ktpFile ? `✅ ${documents.ktpFile.substring(0, 50)}...` : '❌ not in documents',
      storePhotoFile: documents.storePhotoFile ? `✅ ${documents.storePhotoFile.substring(0, 50)}...` : '❌ not in documents',
      businessPermitFile: documents.businessPermitFile ? `✅ ${documents.businessPermitFile.substring(0, 50)}...` : '❌ not in documents'
    });
    console.log('📝 Updating UMKM user with data:', JSON.stringify(updateData, null, 2));
    console.log('📝 UpdateData file fields check:', {
      ktpFile: updateData.ktpFile ? `✅ ${updateData.ktpFile.substring(0, 50)}...` : '❌ null',
      storePhotoFile: updateData.storePhotoFile ? `✅ ${updateData.storePhotoFile.substring(0, 50)}...` : '❌ null',
      businessPermitFile: updateData.businessPermitFile ? `✅ ${updateData.businessPermitFile.substring(0, 50)}...` : '❌ null'
    });
    
    // PASTIKAN setidaknya ada satu file field yang berhasil diupload sebelum update
    if (!documents.ktpFile && !documents.storePhotoFile && !documents.businessPermitFile) {
      console.error('❌ ERROR: No file fields to save! Documents object is empty or invalid.');
      console.error('❌ Documents:', documents);
      console.error('❌ Files received:', files);
      return res.status(400).json({ 
        error: 'Tidak ada file yang berhasil diupload. Pastikan file valid dan BLOB_READ_WRITE_TOKEN terkonfigurasi dengan benar.' 
      });
    }

    const updatedUser = await updateUser(userId, updateData);
    
    console.log('✅ UMKM user updated. File fields:', {
      ktpFile: updatedUser.ktpFile ? `✅ ${updatedUser.ktpFile.substring(0, 50)}...` : '❌ null/undefined',
      storePhotoFile: updatedUser.storePhotoFile ? `✅ ${updatedUser.storePhotoFile.substring(0, 50)}...` : '❌ null/undefined',
      businessPermitFile: updatedUser.businessPermitFile ? `✅ ${updatedUser.businessPermitFile.substring(0, 50)}...` : '❌ null/undefined'
    });
    
    // Verifikasi bahwa file benar-benar tersimpan
    if (!updatedUser.ktpFile && !updatedUser.storePhotoFile && !updatedUser.businessPermitFile) {
      console.error('❌ WARNING: No file fields saved to user!');
      console.error('❌ Documents object:', documents);
      console.error('❌ UpdateData:', updateData);
    }

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

