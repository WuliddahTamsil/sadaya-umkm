import express from 'express';
import { put } from '@vercel/blob'; // Tambahkan ini
import multer from 'multer'; // Tambahkan ini

// Gunakan Memory Storage agar file tidak disimpan di disk server yang terkunci
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Batas 5MB
});

const router = express.Router();

// Fungsi helper untuk upload ke Vercel Blob
const uploadToBlob = async (file, folder) => {
  if (!file) return null;
  
  // Membuat path unik, misal: products/gambar-123.jpg
  const filename = `${folder}/${Date.now()}-${file.originalname}`;
  
  const blob = await put(filename, file.buffer, {
    access: 'public',
    contentType: file.mimetype,
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
  
  return blob.url; // Mengembalikan link https://...
};

// --- ROUTE UNTUK PRODUK ---
router.post('/products', upload.single('image'), async (req, res) => {
  try {
    console.log('📥 Upload produk ke Vercel Blob dimulai...');
    
    if (!req.file) {
      return res.status(400).json({ error: 'Tidak ada file gambar yang dipilih.' });
    }

    const imageUrl = await uploadToBlob(req.file, 'products');

    console.log('✅ Berhasil upload ke Blob:', imageUrl);
    res.status(200).json({ 
      message: 'Upload berhasil', 
      url: imageUrl 
    });

  } catch (error) {
    console.error('❌ Error Upload Produk:', error);
    res.status(500).json({ error: 'Gagal mengupload gambar ke Vercel Blob.' });
  }
});

// --- ROUTE UNTUK PROFILE ---
router.post('/profile', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = await uploadToBlob(req.file, 'profiles');
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Gagal upload foto profil.' });
  }
});

// --- ROUTE UNTUK DOKUMEN (DRIVER/UMKM) ---
// Jika butuh banyak file (multiple), gunakan upload.fields
router.post('/umkm', upload.any(), async (req, res) => {
    try {
        const results = {};
        for (const file of req.files) {
            results[file.fieldname] = await uploadToBlob(file, 'docs-umkm');
        }
        res.status(200).json({ message: 'Dokumen berhasil diupload', urls: results });
    } catch (error) {
        res.status(500).json({ error: 'Gagal upload dokumen UMKM.' });
    }
});

export default router;