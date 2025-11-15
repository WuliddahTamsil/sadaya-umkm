import express from 'express';
import { uploadDriverDocs, uploadUMKMDocs, uploadProductImage } from '../middleware/upload.js';
import { uploadDriverDocuments, uploadUMKMDocuments, uploadProductImageController } from '../controllers/uploadController.js';

const router = express.Router();

// Wrapper untuk handle multer errors
const handleUpload = (uploadMiddleware, controller) => {
  return async (req, res, next) => {
    try {
      console.log('📥 Upload route hit:', req.path);
      console.log('📥 Request method:', req.method);
      console.log('📥 Content-Type:', req.headers['content-type']);
      
      // Multer middleware akan populate req.files atau req.file
      await new Promise((resolve, reject) => {
        uploadMiddleware(req, res, (err) => {
          if (err) {
            console.error('❌ Multer error:', err);
            if (err.code === 'LIMIT_FILE_SIZE') {
              return res.status(400).json({ error: 'File terlalu besar. Maksimal 5MB per file.' });
            }
            if (err.message && err.message.includes('Hanya file gambar dan PDF yang diizinkan')) {
              return res.status(400).json({ error: err.message });
            }
            return res.status(400).json({ error: 'Error saat upload file: ' + (err.message || 'Unknown error') });
          }
          
          // Log files setelah multer process
          console.log('✅ Multer processed files:', {
            hasFiles: !!req.files,
            hasFile: !!req.file,
            filesKeys: req.files ? Object.keys(req.files) : 'none',
            filesCount: req.files ? Object.values(req.files).flat().length : 0
          });
          
          resolve();
        });
      });
      
      // Jika tidak ada error, lanjut ke controller
      if (!res.headersSent) {
        await controller(req, res, next);
      }
    } catch (error) {
      console.error('❌ Error in handleUpload:', error);
      if (!res.headersSent) {
        next(error);
      }
    }
  };
};

// POST /api/upload/driver - Upload dokumen driver
router.post('/driver', handleUpload(uploadDriverDocs, uploadDriverDocuments));

// POST /api/upload/umkm - Upload dokumen UMKM
router.post('/umkm', handleUpload(uploadUMKMDocs, uploadUMKMDocuments));

// POST /api/upload/products - Upload gambar produk
router.post('/products', handleUpload(uploadProductImage, uploadProductImageController));

export default router;

