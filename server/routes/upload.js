import express from 'express';
import { put } from '@vercel/blob';
import multer from 'multer';

const router = express.Router();

// 1. Konfigurasi Multer (Simpan di RAM, bukan Disk)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Saya naikkan ke 10MB agar aman untuk foto HP resolusi tinggi
});

// 2. Fungsi Helper Sakti untuk Upload ke Vercel Blob
const uploadToBlob = async (file, folder) => {
  if (!file) return null;
  
  // Membersihkan nama file dari karakter aneh agar tidak error
  const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
  const filename = `${folder}/${Date.now()}-${cleanFileName}`;
  
  const blob = await put(filename, file.buffer, {
    access: 'public',
    contentType: file.mimetype,
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
  
  return blob.url;
};

// --- ROUTE UNIVERSAL (Bisa untuk Produk, Profile, UMKM) ---
// Menggunakan upload.any() supaya tidak peduli apa nama field dari frontend
router.post(['/products', '/profile', '/umkm', '/driver'], upload.any(), async (req, res) => {
  try {
    const path = req.path; // Mengetahui ini request dari mana
    const folder = path.replace('/', '') || 'general';
    
    console.log(`📥 Menerima upload untuk: ${folder}`);

    if (!req.files || req.files.length === 0) {
      // Jika pakai upload.single('image') dari frontend, cek juga req.file
      if (!req.file) {
        return res.status(400).json({ error: 'Tidak ada file yang diterima server.' });
      }
    }

    // Gabungkan req.files (multiple) dan req.file (single) jika ada
    const filesToUpload = req.files || [req.file];
    const results = {};

    // Upload semua file secara paralel agar cepat
    await Promise.all(filesToUpload.map(async (file) => {
      const url = await uploadToBlob(file, folder);
      results[file.fieldname] = url;
      // Tambahan: agar frontend yang lama tetap jalan (beberapa butuh 'url' saja)
      results.url = url; 
    }));

    console.log('✅ Berhasil upload ke Vercel Blob:', results);

    // Kembalikan format yang lengkap agar semua fitur (UMKM/Produk) cocok
    res.status(200).json({ 
      message: 'Upload berhasil',
      url: results.url, // Untuk upload produk/profile
      urls: results,    // Untuk upload UMKM (KTP, Izin, dll)
      ...results        // Spread hasil agar fieldname-nya terbaca langsung
    });

  } catch (error) {
    console.error('❌ Error Vercel Blob:', error);
    res.status(500).json({ 
      error: 'Gagal upload ke cloud storage.',
      details: error.message 
    });
  }
});

export default router;