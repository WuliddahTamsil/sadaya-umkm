import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Konfigurasi storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Tentukan folder berdasarkan route (driver, umkm, atau products)
    let route = 'general';
    if (req.path.includes('/driver')) {
      route = 'driver';
    } else if (req.path.includes('/umkm')) {
      route = 'umkm';
    } else if (req.path.includes('/products')) {
      route = 'products';
    }
    // Uploads should be in server/uploads to match server-combined.js
    const uploadPath = join(__dirname, '../uploads', route);
    
    // Buat folder jika belum ada
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Format: userId_timestamp_originalname
    const userId = req.body.userId || 'unknown';
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${userId}_${timestamp}_${originalName}`;
    cb(null, filename);
  }
});

// Filter file type
const fileFilter = (req, file, cb) => {
  // Allow images and PDFs
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar dan PDF yang diizinkan'), false);
  }
};

// Konfigurasi upload
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Middleware untuk multiple files dengan field names yang berbeda
export const uploadDriverDocs = upload.fields([
  { name: 'ktpFile', maxCount: 1 },
  { name: 'simFile', maxCount: 1 },
  { name: 'stnkFile', maxCount: 1 },
  { name: 'selfieFile', maxCount: 1 },
  { name: 'vehiclePhotoFile', maxCount: 1 }
]);

export const uploadUMKMDocs = upload.fields([
  { name: 'ktpFile', maxCount: 1 },
  { name: 'storePhotoFile', maxCount: 1 },
  { name: 'businessPermitFile', maxCount: 1 }
]);

// Middleware untuk upload gambar produk
export const uploadProductImage = upload.single('productImage');

