# ⚠️ PENTING: Masalah Penyimpanan Data di Vercel

## 🔴 Masalah Saat Ini

Aplikasi saat ini menggunakan **file JSON** (`server/data/users.json`) untuk menyimpan data. Ini **TIDAK BEKERJA** di Vercel karena:

1. **Vercel Serverless Functions memiliki file system READ-ONLY**
   - File system di Vercel tidak bisa di-write
   - Data yang ditulis ke file akan hilang setelah function selesai
   - Setiap function invocation adalah stateless

2. **Data tidak tersimpan permanen**
   - Kalau teman daftar akun baru, data akan hilang
   - Data hanya tersimpan di memory selama function berjalan
   - Setelah function selesai, data hilang

## ✅ Solusi: Gunakan Database

Untuk production, Anda **HARUS** menggunakan database. Pilihan database:

### 1. **MongoDB Atlas** (Recommended - Gratis)
- Database NoSQL yang mudah digunakan
- Gratis tier: 512MB storage
- Setup mudah dengan Mongoose

### 2. **PostgreSQL** (via Supabase atau Neon)
- Database SQL yang powerful
- Supabase: Gratis tier dengan PostgreSQL
- Neon: PostgreSQL serverless gratis

### 3. **Vercel KV** (Redis)
- Key-value store dari Vercel
- Cocok untuk data sederhana
- Terintegrasi dengan Vercel

### 4. **PlanetScale** (MySQL)
- MySQL serverless
- Gratis tier tersedia
- Auto-scaling

## 🚀 Rekomendasi: MongoDB Atlas

### Setup MongoDB Atlas:

1. **Daftar di MongoDB Atlas**
   - Buka: https://www.mongodb.com/cloud/atlas
   - Buat akun gratis
   - Buat cluster gratis (M0)

2. **Dapatkan Connection String**
   - Klik "Connect" pada cluster
   - Pilih "Connect your application"
   - Copy connection string

3. **Setup di Vercel**
   - Buka Vercel Dashboard → Project → Settings → Environment Variables
   - Tambahkan: `MONGODB_URI` = connection string dari MongoDB

4. **Install Dependencies**
   ```bash
   npm install mongoose
   ```

5. **Update Code**
   - Ganti `userModel.js` untuk menggunakan MongoDB
   - Ganti semua model untuk menggunakan MongoDB

## 📝 Untuk Development (Local)

Di local development, file JSON masih bisa digunakan karena:
- File system bisa di-write
- Server berjalan terus (bukan serverless)

Tapi untuk production di Vercel, **HARUS** pakai database!

## ⚠️ Status Saat Ini

**Saat ini, jika teman daftar:**
- ❌ Data akan hilang (tidak tersimpan permanen)
- ❌ Hanya bisa login dengan akun yang sudah ada di `users.json`
- ❌ Data baru tidak akan tersimpan

**Solusi sementara:**
- Untuk testing, gunakan akun yang sudah ada
- Atau setup database segera untuk production

