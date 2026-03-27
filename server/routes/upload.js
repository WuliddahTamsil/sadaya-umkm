import express from 'express';
import { put } from '@vercel/blob';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToBlob = async (file, folder) => {
  if (!file || !file.buffer) return null;
  
  // Membersihkan nama file agar tidak ada karakter aneh
  const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
  const filename = `${folder}/${Date.now()}-${cleanName}`;
  
  const blob = await put(filename, file.buffer, {
    access: 'public', // Tetap gunakan public
    addRandomSuffix: true, // WAJIB: Agar Vercel memberikan ID unik
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
  
  return blob.url;
};

// Route Universal untuk semua upload
router.post(['/products', '/profile', '/umkm', '/driver'], upload.any(), async (req, res) => {
  try {
    const results = {};
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({ error: 'File tidak terdeteksi' });
    }

    for (const file of files) {
      // Menentukan folder berdasarkan fieldname atau path
      const folder = file.fieldname || 'general';
      const url = await uploadToBlob(file, folder);
      results[file.fieldname] = url;
      results.url = url; // Fallback untuk upload tunggal
    }

    res.status(200).json({ 
      message: 'Upload sukses',
      ...results 
    });

  } catch (err) {
    console.error('❌ Blob Error:', err.message);
    res.status(500).json({ error: 'Gagal upload ke storage', detail: err.message });
  }
});

export default router;