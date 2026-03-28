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
    console.warn('âš ï¸ prepareFileForBlob: file is null/undefined');
    return null;
  }
  
  console.log('ðŸ” Preparing file for blob:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    hasBuffer: !!file.buffer,
    hasPath: !!file.path
  });
  
  // Jika file dari memory storage (Vercel)
  if (file.buffer) {
    console.log('âœ… File has buffer, using memory storage format');
    return {
      buffer: file.buffer,
      filename: file.originalname,
      mimetype: file.mimetype,
      originalname: file.originalname
    };
  }
  
  // Jika file dari disk storage (local)
  if (file.path) {
    console.log('âš ï¸ File has path but no buffer - this should not happen in Vercel');
    // Di Vercel, kita selalu pakai memory storage, jadi ini tidak seharusnya terjadi
  }
  
  console.warn('âš ï¸ prepareFileForBlob: file has no buffer or path');
  return null;
}

function getMissingBlobTokenResponse() {
  return {
    error: 'BLOB_READ_WRITE_TOKEN belum dikonfigurasi di Vercel. Tambahkan env ini di Project Settings > Environment Variables lalu redeploy.'
  };
}

function normalizeUploadFolder(folder) {
  const allowedFolders = new Set(['driver', 'umkm', 'products', 'profiles', 'general']);
  if (!folder || typeof folder !== 'string') {
    return 'general';
  }

  const normalizedFolder = folder.trim().toLowerCase();
  return allowedFolders.has(normalizedFolder) ? normalizedFolder : 'general';
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
    console.log('ðŸ“ Files received:', Object.keys(files));
    console.log('ðŸ“ Files details:', {
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

    console.log('ðŸ” Environment check:', {
      isVercel,
      hasBlobToken,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV
    });

    if (isVercel && !hasBlobToken) {
      console.error('Ã¢ÂÅ’ BLOB_READ_WRITE_TOKEN tidak tersedia untuk upload driver di Vercel');
      return res.status(500).json(getMissingBlobTokenResponse());
    }

    if (isVercel && hasBlobToken) {
      // Upload ke Vercel Blob Storage
      console.log('ðŸ“¤ Uploading driver documents to Vercel Blob...');
      
      const filesToUpload = {};
      if (files.ktpFile && files.ktpFile[0]) {
        const prepared = prepareFileForBlob(files.ktpFile[0]);
        if (prepared) {
          filesToUpload.ktpFile = prepared;
          console.log('âœ… Prepared ktpFile for upload');
        } else {
          console.warn('âš ï¸ Failed to prepare ktpFile');
        }
      }
      if (files.simFile && files.simFile[0]) {
        const prepared = prepareFileForBlob(files.simFile[0]);
        if (prepared) {
          filesToUpload.simFile = prepared;
          console.log('âœ… Prepared simFile for upload');
        }
      }
      if (files.stnkFile && files.stnkFile[0]) {
        const prepared = prepareFileForBlob(files.stnkFile[0]);
        if (prepared) {
          filesToUpload.stnkFile = prepared;
          console.log('âœ… Prepared stnkFile for upload');
        }
      }
      if (files.selfieFile && files.selfieFile[0]) {
        const prepared = prepareFileForBlob(files.selfieFile[0]);
        if (prepared) {
          filesToUpload.selfieFile = prepared;
          console.log('âœ… Prepared selfieFile for upload');
        }
      }
      if (files.vehiclePhotoFile && files.vehiclePhotoFile[0]) {
        const prepared = prepareFileForBlob(files.vehiclePhotoFile[0]);
        if (prepared) {
          filesToUpload.vehiclePhotoFile = prepared;
          console.log('âœ… Prepared vehiclePhotoFile for upload');
        }
      }

      console.log('ðŸ“¤ Files to upload:', Object.keys(filesToUpload));

      // Upload semua file ke blob
      const blobUrls = await uploadMultipleToBlob(filesToUpload, 'driver');
      
      console.log('ðŸ“‹ Blob URLs received:', blobUrls);
      console.log('ðŸ“‹ Blob URLs keys:', Object.keys(blobUrls));
      console.log('ðŸ“‹ Blob URLs values:', Object.values(blobUrls).map(url => url.substring(0, 50) + '...'));
      
      // PASTIKAN URL blob disimpan ke documents object
      // Set secara eksplisit untuk setiap field
      if (blobUrls.ktpFile) {
        documents.ktpFile = blobUrls.ktpFile;
        console.log('âœ… Set documents.ktpFile:', documents.ktpFile.substring(0, 50) + '...');
      }
      if (blobUrls.simFile) {
        documents.simFile = blobUrls.simFile;
        console.log('âœ… Set documents.simFile:', documents.simFile.substring(0, 50) + '...');
      }
      if (blobUrls.stnkFile) {
        documents.stnkFile = blobUrls.stnkFile;
        console.log('âœ… Set documents.stnkFile:', documents.stnkFile.substring(0, 50) + '...');
      }
      if (blobUrls.selfieFile) {
        documents.selfieFile = blobUrls.selfieFile;
        console.log('âœ… Set documents.selfieFile:', documents.selfieFile.substring(0, 50) + '...');
      }
      if (blobUrls.vehiclePhotoFile) {
        documents.vehiclePhotoFile = blobUrls.vehiclePhotoFile;
        console.log('âœ… Set documents.vehiclePhotoFile:', documents.vehiclePhotoFile.substring(0, 50) + '...');
      }
      
      console.log('âœ… Driver documents uploaded to blob:', Object.keys(blobUrls));
      console.log('ðŸ“ Documents object final:', documents);
      console.log('ðŸ“ Documents object keys:', Object.keys(documents));
    } else if (!isVercel) {
      // Local development: simpan path file
      if (files.ktpFile && files.ktpFile[0]?.path) documents.ktpFile = getRelativePath(files.ktpFile[0].path);
      if (files.simFile && files.simFile[0]?.path) documents.simFile = getRelativePath(files.simFile[0].path);
      if (files.stnkFile && files.stnkFile[0]?.path) documents.stnkFile = getRelativePath(files.stnkFile[0].path);
      if (files.selfieFile && files.selfieFile[0]?.path) documents.selfieFile = getRelativePath(files.selfieFile[0].path);
      if (files.vehiclePhotoFile && files.vehiclePhotoFile[0]?.path) documents.vehiclePhotoFile = getRelativePath(files.vehiclePhotoFile[0].path);
    } else {
      console.warn('âš ï¸ BLOB_READ_WRITE_TOKEN not set. File uploads will be skipped.');
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
      console.log('âœ… Set updateData.ktpFile from documents');
    }
    if (documents.simFile) {
      updateData.simFile = documents.simFile;
      console.log('âœ… Set updateData.simFile from documents');
    }
    if (documents.stnkFile) {
      updateData.stnkFile = documents.stnkFile;
      console.log('âœ… Set updateData.stnkFile from documents');
    }
    if (documents.selfieFile) {
      updateData.selfieFile = documents.selfieFile;
      console.log('âœ… Set updateData.selfieFile from documents');
    }
    if (documents.vehiclePhotoFile) {
      updateData.vehiclePhotoFile = documents.vehiclePhotoFile;
      console.log('âœ… Set updateData.vehiclePhotoFile from documents');
    }
    
    // Hanya tambahkan field jika ada nilainya
    if (phoneNumber) updateData.phone = phoneNumber;
    if (vehicleType) updateData.vehicleType = vehicleType;
    if (vehiclePlate) updateData.vehiclePlate = vehiclePlate;

    console.log('ðŸ“ Documents object:', documents);
    console.log('ðŸ“ Documents keys:', Object.keys(documents));
    console.log('ðŸ“ Documents values:', {
      ktpFile: documents.ktpFile ? `âœ… ${documents.ktpFile.substring(0, 50)}...` : 'âŒ not in documents',
      simFile: documents.simFile ? `âœ… ${documents.simFile.substring(0, 50)}...` : 'âŒ not in documents',
      stnkFile: documents.stnkFile ? `âœ… ${documents.stnkFile.substring(0, 50)}...` : 'âŒ not in documents',
      selfieFile: documents.selfieFile ? `âœ… ${documents.selfieFile.substring(0, 50)}...` : 'âŒ not in documents',
      vehiclePhotoFile: documents.vehiclePhotoFile ? `âœ… ${documents.vehiclePhotoFile.substring(0, 50)}...` : 'âŒ not in documents'
    });
    
    // PASTIKAN setidaknya ada satu file field yang berhasil diupload sebelum update
    if (!documents.ktpFile && !documents.simFile && !documents.stnkFile && !documents.selfieFile && !documents.vehiclePhotoFile) {
      console.error('âŒ ERROR: No file fields to save! Documents object is empty or invalid.');
      console.error('âŒ Documents:', documents);
      console.error('âŒ Files received:', files);
      return res.status(502).json({
        error: 'Upload ke Vercel Blob gagal. Pastikan token valid, Blob Store terhubung ke project ini, dan file yang dikirim tidak rusak.'
      });
    }
    
    // VERIFIKASI FINAL sebelum update
    console.log('ðŸ” FINAL VERIFICATION before update:');
    console.log('ðŸ” updateData keys:', Object.keys(updateData));
    console.log('ðŸ” updateData file fields:', {
      ktpFile: updateData.ktpFile ? `âœ… EXISTS: ${updateData.ktpFile.substring(0, 50)}...` : 'âŒ MISSING',
      simFile: updateData.simFile ? `âœ… EXISTS: ${updateData.simFile.substring(0, 50)}...` : 'âŒ MISSING',
      stnkFile: updateData.stnkFile ? `âœ… EXISTS: ${updateData.stnkFile.substring(0, 50)}...` : 'âŒ MISSING',
      selfieFile: updateData.selfieFile ? `âœ… EXISTS: ${updateData.selfieFile.substring(0, 50)}...` : 'âŒ MISSING',
      vehiclePhotoFile: updateData.vehiclePhotoFile ? `âœ… EXISTS: ${updateData.vehiclePhotoFile.substring(0, 50)}...` : 'âŒ MISSING'
    });
    console.log('ðŸ“ Updating user with data:', JSON.stringify(updateData, null, 2));
    
    // DOUBLE CHECK: Pastikan field-file benar-benar ada di updateData
    if (!updateData.ktpFile && !updateData.simFile && !updateData.stnkFile && !updateData.selfieFile && !updateData.vehiclePhotoFile) {
      console.error('âŒ CRITICAL ERROR: updateData tidak memiliki field-file!');
      console.error('âŒ updateData:', updateData);
      console.error('âŒ documents:', documents);
      return res.status(500).json({ 
        error: 'Gagal menyiapkan data untuk update. Field-file tidak terdeteksi.' 
      });
    }

    const updatedUser = await updateUser(userId, updateData);
    
    console.log('âœ… User updated. File fields:', {
      ktpFile: updatedUser.ktpFile ? `âœ… ${updatedUser.ktpFile.substring(0, 50)}...` : 'âŒ null/undefined',
      simFile: updatedUser.simFile ? `âœ… ${updatedUser.simFile.substring(0, 50)}...` : 'âŒ null/undefined',
      stnkFile: updatedUser.stnkFile ? `âœ… ${updatedUser.stnkFile.substring(0, 50)}...` : 'âŒ null/undefined',
      selfieFile: updatedUser.selfieFile ? `âœ… ${updatedUser.selfieFile.substring(0, 50)}...` : 'âŒ null/undefined',
      vehiclePhotoFile: updatedUser.vehiclePhotoFile ? `âœ… ${updatedUser.vehiclePhotoFile.substring(0, 50)}...` : 'âŒ null/undefined'
    });
    
    // Verifikasi bahwa file benar-benar tersimpan
    if (!updatedUser.ktpFile && !updatedUser.simFile && !updatedUser.stnkFile && !updatedUser.selfieFile && !updatedUser.vehiclePhotoFile) {
      console.error('âŒ WARNING: No file fields saved to user!');
      console.error('âŒ Documents object:', documents);
      console.error('âŒ UpdateData:', updateData);
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

    if (isVercel && !hasBlobToken) {
      console.error('BLOB_READ_WRITE_TOKEN tidak tersedia untuk upload UMKM di Vercel');
      return res.status(500).json(getMissingBlobTokenResponse());
    }

    if (isVercel && hasBlobToken) {
      // Upload ke Vercel Blob Storage
      console.log('ðŸ“¤ Uploading UMKM documents to Vercel Blob...');
      console.log('ðŸ“ Files received:', Object.keys(files));
      console.log('ðŸ“ Files details:', {
        ktpFile: files.ktpFile ? `${files.ktpFile.length} file(s)` : 'none',
        storePhotoFile: files.storePhotoFile ? `${files.storePhotoFile.length} file(s)` : 'none',
        businessPermitFile: files.businessPermitFile ? `${files.businessPermitFile.length} file(s)` : 'none'
      });
      
      const filesToUpload = {};
      if (files.ktpFile && files.ktpFile[0]) {
        const prepared = prepareFileForBlob(files.ktpFile[0]);
        if (prepared) {
          filesToUpload.ktpFile = prepared;
          console.log('âœ… Prepared ktpFile for upload');
        } else {
          console.warn('âš ï¸ Failed to prepare ktpFile');
        }
      }
      if (files.storePhotoFile && files.storePhotoFile[0]) {
        const prepared = prepareFileForBlob(files.storePhotoFile[0]);
        if (prepared) {
          filesToUpload.storePhotoFile = prepared;
          console.log('âœ… Prepared storePhotoFile for upload');
        } else {
          console.warn('âš ï¸ Failed to prepare storePhotoFile');
        }
      }
      if (files.businessPermitFile && files.businessPermitFile[0]) {
        const prepared = prepareFileForBlob(files.businessPermitFile[0]);
        if (prepared) {
          filesToUpload.businessPermitFile = prepared;
          console.log('âœ… Prepared businessPermitFile for upload');
        } else {
          console.warn('âš ï¸ Failed to prepare businessPermitFile');
        }
      }

      console.log('ðŸ“¤ Files to upload:', Object.keys(filesToUpload));

      // Upload semua file ke blob
      const blobUrls = await uploadMultipleToBlob(filesToUpload, 'umkm');
      
      console.log('ðŸ“‹ Blob URLs received:', blobUrls);
      console.log('ðŸ“‹ Blob URLs keys:', Object.keys(blobUrls));
      console.log('ðŸ“‹ Blob URLs values:', Object.values(blobUrls).map(url => url.substring(0, 50) + '...'));
      
      // PASTIKAN URL blob disimpan ke documents object
      // Set secara eksplisit untuk setiap field
      if (blobUrls.ktpFile) {
        documents.ktpFile = blobUrls.ktpFile;
        console.log('âœ… Set documents.ktpFile:', documents.ktpFile.substring(0, 50) + '...');
      }
      if (blobUrls.storePhotoFile) {
        documents.storePhotoFile = blobUrls.storePhotoFile;
        console.log('âœ… Set documents.storePhotoFile:', documents.storePhotoFile.substring(0, 50) + '...');
      }
      if (blobUrls.businessPermitFile) {
        documents.businessPermitFile = blobUrls.businessPermitFile;
        console.log('âœ… Set documents.businessPermitFile:', documents.businessPermitFile.substring(0, 50) + '...');
      }
      
      console.log('âœ… UMKM documents uploaded to blob:', Object.keys(blobUrls));
      console.log('ðŸ“ Documents object final:', documents);
      console.log('ðŸ“ Documents object keys:', Object.keys(documents));
    } else if (!isVercel) {
      // Local development: simpan path file
      if (files.ktpFile && files.ktpFile[0]?.path) documents.ktpFile = getRelativePath(files.ktpFile[0].path);
      if (files.storePhotoFile && files.storePhotoFile[0]?.path) documents.storePhotoFile = getRelativePath(files.storePhotoFile[0].path);
      if (files.businessPermitFile && files.businessPermitFile[0]?.path) documents.businessPermitFile = getRelativePath(files.businessPermitFile[0].path);
    } else {
      console.warn('âš ï¸ BLOB_READ_WRITE_TOKEN not set. File uploads will be skipped.');
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
      console.log('âœ… Set updateData.ktpFile from documents');
    }
    if (documents.storePhotoFile) {
      updateData.storePhotoFile = documents.storePhotoFile;
      console.log('âœ… Set updateData.storePhotoFile from documents');
    }
    if (documents.businessPermitFile) {
      updateData.businessPermitFile = documents.businessPermitFile;
      console.log('âœ… Set updateData.businessPermitFile from documents');
    }
    
    // Hanya tambahkan field jika ada nilainya
    if (storeName) updateData.storeName = storeName;
    if (storeAddress) updateData.storeAddress = storeAddress;
    if (storeDescription) updateData.storeDescription = storeDescription;
    if (phoneNumber) updateData.phone = phoneNumber;

    console.log('ðŸ“ Documents object:', documents);
    console.log('ðŸ“ Documents keys:', Object.keys(documents));
    console.log('ðŸ“ Documents values:', {
      ktpFile: documents.ktpFile ? `âœ… ${documents.ktpFile.substring(0, 50)}...` : 'âŒ not in documents',
      storePhotoFile: documents.storePhotoFile ? `âœ… ${documents.storePhotoFile.substring(0, 50)}...` : 'âŒ not in documents',
      businessPermitFile: documents.businessPermitFile ? `âœ… ${documents.businessPermitFile.substring(0, 50)}...` : 'âŒ not in documents'
    });
    
    // PASTIKAN setidaknya ada satu file field yang berhasil diupload sebelum update
    if (!documents.ktpFile && !documents.storePhotoFile && !documents.businessPermitFile) {
      console.error('âŒ ERROR: No file fields to save! Documents object is empty or invalid.');
      console.error('âŒ Documents:', documents);
      console.error('âŒ Files received:', files);
      return res.status(502).json({
        error: 'Upload ke Vercel Blob gagal. Pastikan token valid, Blob Store terhubung ke project ini, dan file yang dikirim tidak rusak.'
      });
    }
    
    // VERIFIKASI FINAL sebelum update
    console.log('ðŸ” FINAL VERIFICATION before update:');
    console.log('ðŸ” updateData keys:', Object.keys(updateData));
    console.log('ðŸ” updateData file fields:', {
      ktpFile: updateData.ktpFile ? `âœ… EXISTS: ${updateData.ktpFile.substring(0, 50)}...` : 'âŒ MISSING',
      storePhotoFile: updateData.storePhotoFile ? `âœ… EXISTS: ${updateData.storePhotoFile.substring(0, 50)}...` : 'âŒ MISSING',
      businessPermitFile: updateData.businessPermitFile ? `âœ… EXISTS: ${updateData.businessPermitFile.substring(0, 50)}...` : 'âŒ MISSING'
    });
    console.log('ðŸ“ Updating UMKM user with data:', JSON.stringify(updateData, null, 2));
    
    // DOUBLE CHECK: Pastikan field-file benar-benar ada di updateData
    if (!updateData.ktpFile && !updateData.storePhotoFile && !updateData.businessPermitFile) {
      console.error('âŒ CRITICAL ERROR: updateData tidak memiliki field-file!');
      console.error('âŒ updateData:', updateData);
      console.error('âŒ documents:', documents);
      return res.status(500).json({ 
        error: 'Gagal menyiapkan data untuk update. Field-file tidak terdeteksi.' 
      });
    }

    const updatedUser = await updateUser(userId, updateData);
    
    console.log('âœ… UMKM user updated. File fields:', {
      ktpFile: updatedUser.ktpFile ? `âœ… ${updatedUser.ktpFile.substring(0, 50)}...` : 'âŒ null/undefined',
      storePhotoFile: updatedUser.storePhotoFile ? `âœ… ${updatedUser.storePhotoFile.substring(0, 50)}...` : 'âŒ null/undefined',
      businessPermitFile: updatedUser.businessPermitFile ? `âœ… ${updatedUser.businessPermitFile.substring(0, 50)}...` : 'âŒ null/undefined'
    });
    
    // Verifikasi bahwa file benar-benar tersimpan
    if (!updatedUser.ktpFile && !updatedUser.storePhotoFile && !updatedUser.businessPermitFile) {
      console.error('âŒ WARNING: No file fields saved to user!');
      console.error('âŒ Documents object:', documents);
      console.error('âŒ UpdateData:', updateData);
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
      return res.status(500).json(getMissingBlobTokenResponse());
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
    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      fieldname: req.file.fieldname,
      hasBuffer: !!req.file.buffer,
      hasPath: !!req.file.path
    });

    const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

    console.log('ðŸ” Environment check:', {
      isVercel,
      hasBlobToken,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      BLOB_TOKEN_EXISTS: !!process.env.BLOB_READ_WRITE_TOKEN
    });

    let profilePhotoUrl;

    if (isVercel && hasBlobToken) {
      // Upload ke Vercel Blob Storage
      console.log('ðŸ“¤ Uploading to Vercel Blob Storage...');
      const fileData = prepareFileForBlob(req.file);
      if (!fileData) {
        console.error('âŒ Failed to prepare file for blob');
        return res.status(400).json({ error: 'File tidak valid atau tidak dapat diproses' });
      }
      
      console.log('ðŸ“¤ File prepared for blob:', {
        filename: fileData.filename,
        mimetype: fileData.mimetype,
        bufferSize: fileData.buffer?.length || 0
      });
      
      try {
        profilePhotoUrl = await uploadToBlob(
          fileData.buffer,
          fileData.filename,
          fileData.mimetype,
          'profiles'
        );
        console.log('âœ… Profile photo uploaded to blob:', profilePhotoUrl);
        
        // Verifikasi URL valid
        if (!profilePhotoUrl || !profilePhotoUrl.startsWith('http')) {
          throw new Error('URL yang dihasilkan tidak valid');
        }
      } catch (blobError) {
        console.error('âŒ Error uploading to blob:', blobError);
        console.error('Error details:', {
          message: blobError.message,
          stack: blobError.stack
        });
        throw new Error(`Gagal upload ke Vercel Blob Storage: ${blobError.message}`);
      }
    } else if (!isVercel) {
      // Local development: gunakan path relatif
      console.log('ðŸ“ Local development mode - using file system');
      if (!req.file.path) {
        return res.status(400).json({ error: 'File path tidak ditemukan' });
      }
      const imagePath = getRelativePath(req.file.path);
      const baseUrl = 'http://localhost:3000';
      profilePhotoUrl = `${baseUrl}/${imagePath}`;
      console.log('âœ… Profile photo path (local):', profilePhotoUrl);
    } else {
      console.error('âŒ BLOB_READ_WRITE_TOKEN tidak dikonfigurasi');
      return res.status(500).json(getMissingBlobTokenResponse());
    }

    // Pastikan URL valid sebelum menyimpan
    if (!profilePhotoUrl || !profilePhotoUrl.trim()) {
      throw new Error('URL foto profil tidak valid');
    }

    console.log('ðŸ’¾ Saving profile photo URL to MongoDB:', profilePhotoUrl);

    // Update user dengan profile photo URL
    const updateData = {
      profilePhoto: profilePhotoUrl.trim(),
      updatedAt: new Date().toISOString()
    };

    console.log('ðŸ“ Update data:', {
      profilePhoto: updateData.profilePhoto.substring(0, 100) + '...',
      updatedAt: updateData.updatedAt
    });

    const updatedUser = await updateUser(userId, updateData);
    
    // Verifikasi bahwa profilePhoto tersimpan
    if (!updatedUser.profilePhoto) {
      console.error('âŒ CRITICAL: profilePhoto tidak tersimpan di database!');
      throw new Error('Gagal menyimpan URL foto profil ke database');
    }
    
    console.log('âœ… User profile photo updated successfully');
    console.log('âœ… Profile photo URL in database:', updatedUser.profilePhoto.substring(0, 100) + '...');
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

export const uploadGenericFileController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File diperlukan' });
    }

    const isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
    const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;
    const folder = normalizeUploadFolder(req.body.folder);

    let fileUrl;
    let filePath;

    if (isVercel && hasBlobToken) {
      const fileData = prepareFileForBlob(req.file);
      if (!fileData) {
        return res.status(400).json({ error: 'File tidak valid atau tidak dapat diproses' });
      }

      fileUrl = await uploadToBlob(
        fileData.buffer,
        fileData.filename,
        fileData.mimetype,
        folder
      );
      filePath = fileUrl;
    } else if (!isVercel) {
      filePath = getRelativePath(req.file.path);
      const baseUrl = 'http://localhost:3000';
      fileUrl = `${baseUrl}/${filePath}`;
    } else {
      return res.status(500).json(getMissingBlobTokenResponse());
    }

    res.json({
      success: true,
      message: 'File berhasil diupload',
      fileUrl,
      filePath,
      folder
    });
  } catch (error) {
    console.error('Upload generic file error:', error);

    if (!res.headersSent) {
      const errorMessage = error.message || 'Terjadi kesalahan saat upload file';
      res.status(500).json({
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};

