# 🔍 Debug File Upload - Dokumen Tidak Muncul

## Masalah
File sudah di-upload tapi tidak muncul di admin dashboard dan MongoDB.

## Langkah Debugging

### 1. Cek Vercel Function Logs

Setelah upload file, cek logs di Vercel:

1. Buka: https://vercel.com/dashboard
2. Pilih project: **asli-bogor-v3**
3. Klik tab **Deployments**
4. Klik deployment terbaru
5. Klik tab **Logs** atau **Function Logs**
6. Cari log yang dimulai dengan: `=== UPLOAD DRIVER DOCUMENTS START ===`

**Log yang harus muncul:**
- `📁 Files received:` - List file yang diterima
- `🔍 Environment check:` - Cek apakah di Vercel dan ada BLOB_READ_WRITE_TOKEN
- `📤 Uploading driver documents to Vercel Blob...`
- `✅ Prepared [fieldName] for upload` - Untuk setiap file
- `📋 Blob URLs received:` - URL dari blob storage
- `📝 Updating user with data:` - Data yang akan di-update
- `✅ User updated. File fields:` - Status field-file setelah update

### 2. Cek Environment Variables

Pastikan di Vercel:
- ✅ `MONGODB_URI` sudah di-set
- ✅ `BLOB_READ_WRITE_TOKEN` sudah di-set

**Cara cek:**
1. Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Pastikan kedua variable ada dan sudah di-set untuk semua environment

### 3. Cek MongoDB Atlas

1. Buka: https://cloud.mongodb.com/
2. Pilih cluster → **Browse Collections**
3. Pilih database: `aslibogor` → collection: `users`
4. Cari user yang baru upload
5. Cek apakah field-file ada:
   - `ktpFile`
   - `simFile`
   - `stnkFile`
   - `selfieFile`
   - `vehiclePhotoFile`

### 4. Kemungkinan Masalah

#### A. BLOB_READ_WRITE_TOKEN tidak di-set
**Gejala:** Log menunjukkan `⚠️ BLOB_READ_WRITE_TOKEN not set`
**Solusi:** 
- Setup Vercel Blob Storage (lihat `SETUP_VERCEL_BLOB.md`)
- Tambahkan `BLOB_READ_WRITE_TOKEN` di Vercel Environment Variables
- Redeploy

#### B. File tidak ter-upload ke blob
**Gejala:** Log menunjukkan `📋 Blob URLs received: {}` (kosong)
**Solusi:**
- Cek apakah file benar-benar di-upload (cek log `📁 Files received`)
- Cek apakah `prepareFileForBlob` berhasil (cek log `✅ Prepared [fieldName]`)
- Cek error di blob upload (cek log `❌ Error uploading`)

#### C. URL tidak tersimpan ke MongoDB
**Gejala:** Log menunjukkan blob URLs ada, tapi tidak tersimpan di MongoDB
**Solusi:**
- Cek log `📝 Updating user with data:` - pastikan documents ada di updateData
- Cek log `✅ User updated. File fields:` - pastikan field ter-update
- Cek MongoDB untuk memastikan data tersimpan

#### D. Data tidak ter-fetch di admin
**Gejala:** Data ada di MongoDB tapi tidak muncul di admin
**Solusi:**
- Refresh admin dashboard
- Cek browser console untuk error
- Cek apakah `fetchUsers` berhasil

## Test Manual

### Test 1: Cek apakah file ter-upload
```bash
# Setelah upload, cek Vercel Blob Storage
# Buka: Vercel Dashboard → Storage → Blob Store
# Cek apakah file ada di folder "driver"
```

### Test 2: Cek apakah URL tersimpan
```bash
# Query MongoDB langsung
# Buka MongoDB Atlas → Data Explorer
# Query: { email: "driver8@gmail.com" }
# Cek field-file apakah ada URL
```

### Test 3: Test API langsung
```bash
# Get user by ID
GET https://asli-bogor-v3.vercel.app/api/users/[userId]
# Cek apakah field-file ada di response
```

## Log yang Harus Muncul

Jika semua berjalan dengan benar, log harus menunjukkan:

```
=== UPLOAD DRIVER DOCUMENTS START ===
User ID: [userId]
📁 Files received: ['ktpFile', 'simFile', ...]
🔍 Environment check: { isVercel: true, hasBlobToken: true }
📤 Uploading driver documents to Vercel Blob...
✅ Prepared ktpFile for upload
✅ Prepared simFile for upload
📤 Files to upload: ['ktpFile', 'simFile', ...]
📤 Uploading 2 files to blob folder: driver
📤 Uploading ktpFile...
✅ ktpFile uploaded successfully: https://...
📋 Blob URLs received: { ktpFile: 'https://...', simFile: 'https://...' }
📝 Updating user with data: { ktpFile: 'https://...', ... }
🔄 Updating user: [userId]
✅ User updated successfully
✅ User updated. File fields: { ktpFile: '✅', simFile: '✅', ... }
=== UPLOAD DRIVER DOCUMENTS END ===
```

## Next Steps

1. **Commit & push** perubahan (logging sudah ditambahkan)
2. **Redeploy** aplikasi
3. **Test upload** file lagi
4. **Cek Vercel Function Logs** untuk melihat proses lengkap
5. **Beri tahu saya** hasil log yang muncul

