# Setup Vercel Blob Storage untuk File Upload

File upload sekarang menggunakan **Vercel Blob Storage** untuk menyimpan file di cloud. File yang diupload akan tersimpan di Vercel Blob dan bisa diakses dari admin dashboard.

## Langkah Setup

### 1. Install Vercel CLI (jika belum)
```bash
npm install -g vercel
```

### 2. Login ke Vercel
```bash
vercel login
```

### 3. Link Project ke Vercel (jika belum)
```bash
vercel link
```

### 4. Buat Blob Store di Vercel

**Cara 1: Via Vercel Dashboard**
1. Buka https://vercel.com/dashboard
2. Pilih project **Asli_Bogor_v3**
3. Klik tab **Storage**
4. Klik **Create Database** → Pilih **Blob**
5. Beri nama: `asli-bogor-blob` (atau nama lain)
6. Pilih region: **Southeast Asia (Singapore)** atau yang terdekat
7. Klik **Create**

**Cara 2: Via Vercel CLI**
```bash
vercel blob create asli-bogor-blob
```

### 5. Dapatkan BLOB_READ_WRITE_TOKEN

**Via Vercel Dashboard:**
1. Buka https://vercel.com/dashboard
2. Pilih project **Asli_Bogor_v3**
3. Klik tab **Storage** → Pilih blob store yang baru dibuat
4. Klik tab **Settings**
5. Copy **Read/Write Token**

**Via Vercel CLI:**
```bash
vercel env pull .env.local
```
Token akan otomatis ditambahkan ke `.env.local`

### 6. Tambahkan Environment Variable di Vercel

1. Buka https://vercel.com/dashboard
2. Pilih project **Asli_Bogor_v3**
3. Klik **Settings** → **Environment Variables**
4. Tambahkan variable baru:
   - **Name:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** (paste token dari langkah 5)
   - **Environment:** Pilih semua (Production, Preview, Development)
5. Klik **Save**

### 7. Redeploy Application

Setelah menambahkan environment variable, redeploy:
```bash
git add .
git commit -m "Add Vercel Blob Storage support"
git push
```

Atau via Vercel Dashboard:
1. Klik **Deployments**
2. Klik **...** pada deployment terbaru
3. Klik **Redeploy**

## Cara Kerja

1. **Local Development:**
   - File disimpan di `server/uploads/` (local disk)
   - URL: `http://localhost:3000/uploads/...`

2. **Vercel Production:**
   - File diupload ke Vercel Blob Storage
   - URL: `https://[blob-url].public.blob.vercel-storage.com/...`
   - URL disimpan di MongoDB sebagai field (ktpFile, simFile, dll)

3. **Admin Dashboard:**
   - Otomatis detect apakah URL full (blob) atau relatif (local)
   - Menampilkan file dengan benar di kedua environment

## Testing

1. **Test di Local:**
   ```bash
   npm run dev
   ```
   - Upload file via onboarding form
   - File akan tersimpan di `server/uploads/`
   - Cek di admin dashboard apakah file terlihat

2. **Test di Vercel:**
   - Deploy ke Vercel
   - Upload file via onboarding form
   - File akan tersimpan di Vercel Blob
   - Cek di admin dashboard apakah file terlihat

## Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN environment variable is not set"
- Pastikan environment variable sudah ditambahkan di Vercel
- Pastikan sudah redeploy setelah menambahkan variable
- Cek di Vercel Dashboard → Settings → Environment Variables

### File tidak terlihat di admin
- Pastikan URL disimpan dengan benar di MongoDB
- Cek console browser untuk error loading image
- Pastikan URL blob bisa diakses (public access)

### Upload gagal
- Cek Vercel Function logs untuk error detail
- Pastikan file size tidak melebihi 5MB
- Pastikan file type adalah image atau PDF

## Catatan

- File di Vercel Blob bersifat **public** (bisa diakses siapa saja yang punya URL)
- Untuk keamanan lebih, bisa setup private blob dengan signed URL (perlu modifikasi code)
- Storage limit: Free tier Vercel Blob = 1GB
- Bandwidth limit: Free tier = 100GB/month

