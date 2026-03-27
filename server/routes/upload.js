import express from 'express';
import { put } from '@vercel/blob';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Helper Upload
const uploadToBlob = async (file) => {
  if (!file || !file.buffer) return null;
  const filename = `sadaya/${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
  const blob = await put(filename, file.buffer, {
    access: 'private', // Sesuai dengan store kamu yang statusnya private
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
  return blob.url;
};

// ROUTE UNIVERSAL - Menangani POST ke /api/upload/umkm, /api/upload/products, dll
router.post('*', upload.any(), async (req, res) => {
  try {
    console.log('📥 Request masuk ke:', req.path);
    
    // Cek apakah ada file yang masuk
    const files = req.files || [];
    if (files.length === 0) {
      console.log('❌ Tidak ada file di req.files');
      return res.status(400).json({ error: 'Server tidak menerima file. Cek form-data kamu.' });
    }

    const results = {};
    // Proses semua file (KTP, Foto Usaha, dll)
    for (const file of files) {
      const url = await uploadToBlob(file);
      results[file.fieldname] = url; // Simpan berdasarkan nama field aslinya
      results.url = url; // Fallback
    }

    console.log('✅ Berhasil upload:', results);
    res.status(200).json({ 
      message: 'Upload sukses',
      ...results 
    });

  } catch (error) {
    console.error('❌ Error Backend:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;