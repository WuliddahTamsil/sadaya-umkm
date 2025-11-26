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
      console.log('📋 Blob URLs keys:', Object.keys(blobUrls));
      console.log('📋 Blob URLs values:', Object.values(blobUrls).map(url => url.substring(0, 50) + '...'));
      
      // PASTIKAN URL blob disimpan ke documents object
      // Set secara eksplisit untuk setiap field
      if (blobUrls.ktpFile) {
        documents.ktpFile = blobUrls.ktpFile;
        console.log('✅ Set documents.ktpFile:', documents.ktpFile.substring(0, 50) + '...');
      }
      if (blobUrls.simFile) {
        documents.simFile = blobUrls.simFile;
        console.log('✅ Set documents.simFile:', documents.simFile.substring(0, 50) + '...');
      }
      if (blobUrls.stnkFile) {
        documents.stnkFile = blobUrls.stnkFile;
        console.log('✅ Set documents.stnkFile:', documents.stnkFile.substring(0, 50) + '...');
      }
      if (blobUrls.selfieFile) {
        documents.selfieFile = blobUrls.selfieFile;
        console.log('✅ Set documents.selfieFile:', documents.selfieFile.substring(0, 50) + '...');
      }
      if (blobUrls.vehiclePhotoFile) {
        documents.vehiclePhotoFile = blobUrls.vehiclePhotoFile;
        console.log('✅ Set documents.vehiclePhotoFile:', documents.vehiclePhotoFile.substring(0, 50) + '...');
      }
      
      console.log('✅ Driver documents uploaded to blob:', Object.keys(blobUrls));
      console.log('📝 Documents object final:', documents);
      console.log('📝 Documents object keys:', Object.keys(documents));
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
    // PASTIKAN field-file SELALU diset ke updateData dengan cara EKSPLISIT
    const updateData = {
      isOnboarded: true, // Set onboarding selesai
      updatedAt: new Date().toISOString()
    };
    
    // PASTIKAN field-file SELALU diset dari documents dengan cara EKSPLISIT
    // Set setiap field secara eksplisit
    if (documents.ktpFile) {
      updateData.ktpFile = documents.ktpFile;
      console.log('✅ Set updateData.ktpFile from documents');
    }
    if (documents.simFile) {
      updateData.simFile = documents.simFile;
      console.log('✅ Set updateData.simFile from documents');
    }
    if (documents.stnkFile) {
      updateData.stnkFile = documents.stnkFile;
      console.log('✅ Set updateData.stnkFile from documents');
    }
    if (documents.selfieFile) {
      updateData.selfieFile = documents.selfieFile;
      console.log('✅ Set updateData.selfieFile from documents');
    }
    if (documents.vehiclePhotoFile) {
      updateData.vehiclePhotoFile = documents.vehiclePhotoFile;
      console.log('✅ Set updateData.vehiclePhotoFile from documents');
    }
    
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
    
    // PASTIKAN setidaknya ada satu file field yang berhasil diupload sebelum update
    if (!documents.ktpFile && !documents.simFile && !documents.stnkFile && !documents.selfieFile && !documents.vehiclePhotoFile) {
      console.error('❌ ERROR: No file fields to save! Documents object is empty or invalid.');
      console.error('❌ Documents:', documents);
      console.error('❌ Files received:', files);
      return res.status(400).json({ 
        error: 'Tidak ada file yang berhasil diupload. Pastikan file valid dan BLOB_READ_WRITE_TOKEN terkonfigurasi dengan benar.' 
      });
    }
    
    // VERIFIKASI FINAL sebelum update
    console.log('🔍 FINAL VERIFICATION before update:');
    console.log('🔍 updateData keys:', Object.keys(updateData));
    console.log('🔍 updateData file fields:', {
      ktpFile: updateData.ktpFile ? `✅ EXISTS: ${updateData.ktpFile.substring(0, 50)}...` : '❌ MISSING',
      simFile: updateData.simFile ? `✅ EXISTS: ${updateData.simFile.substring(0, 50)}...` : '❌ MISSING',
      stnkFile: updateData.stnkFile ? `✅ EXISTS: ${updateData.stnkFile.substring(0, 50)}...` : '❌ MISSING',
      selfieFile: updateData.selfieFile ? `✅ EXISTS: ${updateData.selfieFile.substring(0, 50)}...` : '❌ MISSING',
      vehiclePhotoFile: updateData.vehiclePhotoFile ? `✅ EXISTS: ${updateData.vehiclePhotoFile.substring(0, 50)}...` : '❌ MISSING'
    });
    console.log('📝 Updating user with data:', JSON.stringify(updateData, null, 2));
    
    // DOUBLE CHECK: Pastikan field-file benar-benar ada di updateData
    if (!updateData.ktpFile && !updateData.simFile && !updateData.stnkFile && !updateData.selfieFile && !updateData.vehiclePhotoFile) {
      console.error('❌ CRITICAL ERROR: updateData tidak memiliki field-file!');
      console.error('❌ updateData:', updateData);
      console.error('❌ documents:', documents);
      return res.status(500).json({ 
        error: 'Gagal menyiapkan data untuk update. Field-file tidak terdeteksi.' 
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
      console.log('📋 Blob URLs values:', Object.values(blobUrls).map(url => url.substring(0, 50) + '...'));
      
      // PASTIKAN URL blob disimpan ke documents object
      // Set secara eksplisit untuk setiap field
      if (blobUrls.ktpFile) {
        documents.ktpFile = blobUrls.ktpFile;
        console.log('✅ Set documents.ktpFile:', documents.ktpFile.substring(0, 50) + '...');
      }
      if (blobUrls.storePhotoFile) {
        documents.storePhotoFile = blobUrls.storePhotoFile;
        console.log('✅ Set documents.storePhotoFile:', documents.storePhotoFile.substring(0, 50) + '...');
      }
      if (blobUrls.businessPermitFile) {
        documents.businessPermitFile = blobUrls.businessPermitFile;
        console.log('✅ Set documents.businessPermitFile:', documents.businessPermitFile.substring(0, 50) + '...');
      }
      
      console.log('✅ UMKM documents uploaded to blob:', Object.keys(blobUrls));
      console.log('📝 Documents object final:', documents);
      console.log('📝 Documents object keys:', Object.keys(documents));
    } else if (!isVercel) {
      // Local development: simpan path file
      if (files.ktpFile && files.ktpFile[0]?.path) documents.ktpFile = getRelativePath(files.ktpFile[0].path);
      if (files.storePhotoFile && files.storePhotoFile[0]?.path) documents.storePhotoFile = getRelativePath(files.storePhotoFile[0].path);
      if (files.businessPermitFile && files.businessPermitFile[0]?.path) documents.businessPermitFile = getRelativePath(files.businessPermitFile[0].path);
    } else {
      console.warn('⚠️ BLOB_READ_WRITE_TOKEN not set. File uploads will be skipped.');
    }

    // Update user dengan data tambahan
    // PASTIKAN field-file SELALU diset ke updateData dengan cara EKSPLISIT
    const updateData = {
      isOnboarded: true, // Set onboarding selesai
      updatedAt: new Date().toISOString()
    };
    
    // PASTIKAN field-file SELALU diset dari documents dengan cara EKSPLISIT
    // Set setiap field secara eksplisit, tidak menggunakan || null
    if (documents.ktpFile) {
      updateData.ktpFile = documents.ktpFile;
      console.log('✅ Set updateData.ktpFile from documents');
    }
    if (documents.storePhotoFile) {
      updateData.storePhotoFile = documents.storePhotoFile;
      console.log('✅ Set updateData.storePhotoFile from documents');
    }
    if (documents.businessPermitFile) {
      updateData.businessPermitFile = documents.businessPermitFile;
      console.log('✅ Set updateData.businessPermitFile from documents');
    }
    
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
    
    // PASTIKAN setidaknya ada satu file field yang berhasil diupload sebelum update
    if (!documents.ktpFile && !documents.storePhotoFile && !documents.businessPermitFile) {
      console.error('❌ ERROR: No file fields to save! Documents object is empty or invalid.');
      console.error('❌ Documents:', documents);
      console.error('❌ Files received:', files);
      return res.status(400).json({ 
        error: 'Tidak ada file yang berhasil diupload. Pastikan file valid dan BLOB_READ_WRITE_TOKEN terkonfigurasi dengan benar.' 
      });
    }
    
    // VERIFIKASI FINAL sebelum update
    console.log('🔍 FINAL VERIFICATION before update:');
    console.log('🔍 updateData keys:', Object.keys(updateData));
    console.log('🔍 updateData file fields:', {
      ktpFile: updateData.ktpFile ? `✅ EXISTS: ${updateData.ktpFile.substring(0, 50)}...` : '❌ MISSING',
      storePhotoFile: updateData.storePhotoFile ? `✅ EXISTS: ${updateData.storePhotoFile.substring(0, 50)}...` : '❌ MISSING',
      businessPermitFile: updateData.businessPermitFile ? `✅ EXISTS: ${updateData.businessPermitFile.substring(0, 50)}...` : '❌ MISSING'
    });
    console.log('📝 Updating UMKM user with data:', JSON.stringify(updateData, null, 2));
    
    // DOUBLE CHECK: Pastikan field-file benar-benar ada di updateData
    if (!updateData.ktpFile && !updateData.storePhotoFile && !updateData.businessPermitFile) {
      console.error('❌ CRITICAL ERROR: updateData tidak memiliki field-file!');
      console.error('❌ updateData:', updateData);
      console.error('❌ documents:', documents);
      return res.status(500).json({ 
        error: 'Gagal menyiapkan data untuk update. Field-file tidak terdeteksi.' 
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

export const uploadProfilePhotoController = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID diperlukan' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'File foto profil diperlukan' });
    }

    console.log('=== UPLOAD PROFILE PHOTO START ===');
    console.log('User ID:', userId);

    const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

    let profilePhotoUrl;

    if (isVercel && hasBlobToken) {
      // Upload ke Vercel Blob Storage
      const fileData = prepareFileForBlob(req.file);
      if (!fileData) {
        return res.status(400).json({ error: 'File tidak valid' });
      }
      
      profilePhotoUrl = await uploadToBlob(
        fileData.buffer,
        fileData.filename,
        fileData.mimetype,
        'profiles'
      );
      console.log('✅ Profile photo uploaded to blob:', profilePhotoUrl);
    } else if (!isVercel) {
      // Local development: gunakan path relatif
      const imagePath = getRelativePath(req.file.path);
      const baseUrl = 'http://localhost:3000';
      profilePhotoUrl = `${baseUrl}/${imagePath}`;
    } else {
      return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN tidak dikonfigurasi' });
    }

    // Update user dengan profile photo URL
    const updateData = {
      profilePhoto: profilePhotoUrl,
      updatedAt: new Date().toISOString()
    };

    const updatedUser = await updateUser(userId, updateData);
    
    console.log('✅ User profile photo updated');
    console.log('=== UPLOAD PROFILE PHOTO END ===');

    // Hapus password dari response
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Foto profil berhasil diupload',
      profilePhotoUrl: profilePhotoUrl,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Upload profile photo error:', error);
    console.error('Error stack:', error.stack);
    
    // Pastikan response belum dikirim
    if (!res.headersSent) {
      const errorMessage = error.message || 'Terjadi kesalahan saat upload foto profil';
      res.status(500).json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

