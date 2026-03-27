import express from 'express';
import { put } from '@vercel/blob';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } 
});

const uploadToBlob = async (file, folder) => {
  if (!file || !file.buffer) return null;
  const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
  const filename = `${folder}/${Date.now()}-${cleanName}`;
  
  const blob = await put(filename, file.buffer, {
    access: 'private',
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
  return blob.url;
};

// Satu handler untuk semua jenis upload (Produk, UMKM, Profile, dll)
router.post(['/products', '/profile', '/umkm', '/driver'], upload.any(), async (req, res) => {
  try {
    const results = {};
    // Gabungkan file single (upload.single) atau multiple (upload.any)
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({ error: 'Tidak ada file yang dipilih' });
    }

    for (const file of files) {
      const url = await uploadToBlob(file, 'sadaya-uploads');
      results[file.fieldname] = url;
      results.url = url; // Fallback untuk request satu file
    }

    res.status(200).json({ 
      message: 'Upload sukses',
      ...results 
    });

  } catch (err) {
    console.error('❌ Vercel Blob Error:', err.message);
    res.status(500).json({ error: 'Gagal upload ke cloud storage', detail: err.message });
  }
});

export default router;