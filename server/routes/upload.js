import express from 'express';
import { uploadDriverDocs, uploadUMKMDocs, uploadProductImage } from '../middleware/upload.js';
import { uploadDriverDocuments, uploadUMKMDocuments, uploadProductImageController } from '../controllers/uploadController.js';

const router = express.Router();

// POST /api/upload/driver - Upload dokumen driver
router.post('/driver', uploadDriverDocs, uploadDriverDocuments);

// POST /api/upload/umkm - Upload dokumen UMKM
router.post('/umkm', uploadUMKMDocs, uploadUMKMDocuments);

// POST /api/upload/products - Upload gambar produk
router.post('/products', uploadProductImage, uploadProductImageController);

export default router;

