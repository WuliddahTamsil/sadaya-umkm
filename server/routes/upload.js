import express from 'express';
import { put } from '@vercel/blob';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToBlob = async (file, folder) => {
  if (!file || !file.buffer) return null;
  
  const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
  const filename = `${folder}/${Date.now()}-${cleanName}`;
  
  const blob = await put(filename, file.buffer, {
    // UBAH INI JADI PRIVATE agar Vercel tidak menolak upload
    access: 'private', 
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
  
  return blob.url;
};

// Route untuk semua jenis upload
router.post(['/products', '/profile', '/umkm', '/driver'], upload.any(), async (req, res) => {
  try {
    const results = {};
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) return res.status(400).json({ error: 'File tidak ditemukan' });

    for (const file of files) {
      const folder = file.fieldname || 'uploads';
      const url = await uploadToBlob(file, folder);
      results[file.fieldname] = url;
      results.url = url; 
    }

    console.log('✅ Berhasil upload ke Private Store:', results);
    res.status(200).json({ message: 'Upload sukses', ...results });

  } catch (err) {
    console.error('❌ Blob Error:', err.message);
    res.status(500).json({ error: 'Gagal upload', detail: err.message });
  }
});

export default router;