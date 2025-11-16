# 🚀 Setup Vercel Blob Storage - CARA KEDUA (Lebih Mudah!)

Cara ini lebih mudah karena menggunakan **Vercel CLI** yang otomatis setup semuanya!

## ⚡ Langkah-Langkah (5 Menit)

### 1️⃣ Install Vercel CLI (jika belum)
```bash
npm install -g vercel
```

### 2️⃣ Login ke Vercel
```bash
vercel login
```
- Buka browser yang muncul
- Login dengan akun Vercel Anda
- Kembali ke terminal, tekan Enter

### 3️⃣ Link Project ke Vercel
```bash
vercel link
```
- Pilih project: **asli-bogor-v3**
- Atau buat project baru jika belum ada

### 4️⃣ Buat Blob Store via CLI
```bash
vercel blob create asli-bogor-v3-blob
```
- Pilih region: **Southeast Asia (Singapore)** atau yang terdekat
- Tunggu beberapa detik...

### 5️⃣ Pull Environment Variables
```bash
vercel env pull .env.local
```
Ini akan otomatis:
- ✅ Download semua environment variables dari Vercel
- ✅ Termasuk `BLOB_READ_WRITE_TOKEN` yang baru dibuat
- ✅ Simpan ke file `.env.local`

### 6️⃣ Tambahkan ke Vercel Dashboard (untuk production)

**Opsi A: Via CLI (Recommended)**
```bash
vercel env add BLOB_READ_WRITE_TOKEN
```
- Paste token dari `.env.local` (atau biarkan kosong, akan otomatis)
- Pilih environments: **Production, Preview, Development** (semua)

**Opsi B: Via Dashboard**
1. Buka: https://vercel.com/dashboard
2. Pilih project: **asli-bogor-v3**
3. **Settings** → **Environment Variables**
4. Copy value dari `.env.local`:
   ```bash
   # Buka file .env.local dan copy value BLOB_READ_WRITE_TOKEN
   ```
5. Tambahkan di Vercel:
   - Name: `BLOB_READ_WRITE_TOKEN`
   - Value: (paste dari .env.local)
   - Environment: ✅ Production, ✅ Preview, ✅ Development

### 7️⃣ Deploy!
```bash
git add .
git commit -m "Setup Vercel Blob Storage"
git push
```

Atau deploy langsung via CLI:
```bash
vercel --prod
```

## ✅ Selesai!

Setelah deployment selesai:
1. ✅ Blob store sudah dibuat
2. ✅ Environment variable sudah di-set
3. ✅ File upload akan otomatis ke Vercel Blob
4. ✅ File bisa dilihat di admin dashboard

## 🧪 Test

1. Buka aplikasi di Vercel
2. Daftar sebagai Driver/UMKM
3. Upload file (KTP, SIM, dll)
4. Cek di admin dashboard → Manajemen Data
5. File harus terlihat! 🎉

## 🔍 Troubleshooting

### Error: "vercel: command not found"
```bash
npm install -g vercel
```

### Error: "Project not linked"
```bash
vercel link
```

### Error: "BLOB_READ_WRITE_TOKEN not set"
- Pastikan sudah run `vercel env pull .env.local`
- Atau tambahkan manual di Vercel Dashboard

### File tidak terlihat
- Cek Vercel Function Logs
- Pastikan deployment sudah selesai
- Pastikan environment variable sudah di-set

## 💡 Tips

- File `.env.local` jangan di-commit ke git (sudah ada di .gitignore)
- Token di `.env.local` hanya untuk local development
- Untuk production, pastikan token sudah di-set di Vercel Dashboard

