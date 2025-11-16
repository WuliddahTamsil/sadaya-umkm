import { put } from '@vercel/blob';

/**
 * Upload file ke Vercel Blob Storage
 * @param {Buffer} buffer - File buffer
 * @param {string} filename - Nama file
 * @param {string} contentType - MIME type (e.g., 'image/jpeg', 'application/pdf')
 * @param {string} folder - Folder path (e.g., 'driver', 'umkm', 'products')
 * @returns {Promise<string>} URL file yang diupload
 */
export async function uploadToBlob(buffer, filename, contentType, folder = 'general') {
  try {
    // Pastikan BLOB_READ_WRITE_TOKEN ada
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set');
    }

    // Generate unique filename dengan folder path
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const blobPath = `${folder}/${timestamp}_${sanitizedFilename}`;

    console.log(`📤 Uploading to blob: ${blobPath}`);

    // Upload ke Vercel Blob
    const blob = await put(blobPath, buffer, {
      access: 'public', // File bisa diakses publik
      contentType: contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    console.log(`✅ File uploaded successfully: ${blob.url}`);
    return blob.url;
  } catch (error) {
    console.error('❌ Error uploading to blob:', error);
    throw error;
  }
}

/**
 * Upload multiple files ke Vercel Blob Storage
 * @param {Array<{buffer: Buffer, filename: string, contentType: string}>} files - Array of files
 * @param {string} folder - Folder path
 * @returns {Promise<Object>} Object dengan key-value pairs: fieldName -> blobUrl
 */
export async function uploadMultipleToBlob(files, folder = 'general') {
  const results = {};
  
  console.log(`📤 Uploading ${Object.keys(files).length} files to blob folder: ${folder}`);
  
  for (const [fieldName, fileData] of Object.entries(files)) {
    if (!fileData) {
      console.warn(`⚠️ File data is null/undefined for ${fieldName}`);
      continue;
    }
    
    if (!fileData.buffer) {
      console.warn(`⚠️ File buffer is missing for ${fieldName}`);
      continue;
    }
    
    try {
      console.log(`📤 Uploading ${fieldName}...`);
      const url = await uploadToBlob(
        fileData.buffer,
        fileData.filename || fileData.originalname || `${fieldName}.${fileData.mimetype?.split('/')[1] || 'file'}`,
        fileData.mimetype || 'application/octet-stream',
        folder
      );
      results[fieldName] = url;
      console.log(`✅ ${fieldName} uploaded successfully: ${url}`);
    } catch (error) {
      console.error(`❌ Error uploading ${fieldName}:`, error);
      console.error(`Error details:`, error.message);
      // Continue dengan file lain meskipun satu file gagal
    }
  }
  
  console.log(`✅ Upload complete. ${Object.keys(results).length} files uploaded successfully.`);
  console.log(`📋 Uploaded files:`, Object.keys(results));
  
  return results;
}

