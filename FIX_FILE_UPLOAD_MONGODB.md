# 🔧 Fix File Upload - Field-File Tidak Tersimpan ke MongoDB

## Masalah
Gambar/dokumen tidak muncul di admin dashboard karena field-file (ktpFile, simFile, dll) tidak tersimpan ke MongoDB.

## Penyebab
1. Field-file tidak tersimpan saat `updateUser` dipanggil
2. Field-file tersimpan tapi nilainya `null` atau `undefined`
3. Field-file tidak ter-fetch dengan benar di admin dashboard

## Solusi yang Sudah Diterapkan

### 1. ✅ Update `server/models/userModelMongo.js`
- Ditambahkan logging detail untuk tracking field-file sebelum dan sesudah update
- Memastikan field-file tersimpan dengan benar menggunakan `$set`

### 2. ✅ Update `server/controllers/uploadController.js`
- Ditambahkan logging detail untuk tracking field-file di `updateData`
- Memastikan field-file ada di `documents` object sebelum di-update

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
```
=== UPLOAD DRIVER DOCUMENTS START ===
📁 Files received: ['ktpFile', 'simFile', ...]
📤 Uploading driver documents to Vercel Blob...
✅ Prepared ktpFile for upload
📋 Blob URLs received: { ktpFile: 'https://...', simFile: 'https://...', ... }
📝 UpdateData file fields check:
  ktpFile: ✅ https://...
  simFile: ✅ https://...
  ...
🔄 Updating user: [userId]
📝 File fields in updates:
  ktpFile: ✅ https://...
  simFile: ✅ https://...
  ...
✅ User updated successfully
📋 File fields after update:
  ktpFile: ✅ https://...
  simFile: ✅ https://...
  ...
```

### 2. Cek MongoDB Atlas

1. Buka: https://cloud.mongodb.com/
2. Pilih cluster → **Browse Collections**
3. Pilih database: `aslibogor` → collection: `users`
4. Cari user yang baru upload (cari berdasarkan email atau ID)
5. **Cek apakah field-file ada:**
   - `ktpFile` → harus ada URL (https://...)
   - `simFile` → harus ada URL
   - `stnkFile` → harus ada URL
   - `selfieFile` → harus ada URL
   - `vehiclePhotoFile` → harus ada URL

### 3. Cek Admin Dashboard

1. Login sebagai admin
2. Buka **Manajemen Data**
3. Cari user yang baru upload
4. Klik **View Detail** (icon mata)
5. Scroll ke bagian **Dokumen Driver**
6. **File harus terlihat!**

## Troubleshooting

### ❌ Log menunjukkan: `📝 File fields in updates: ktpFile: ❌ not in updates`
**Masalah:** Field-file tidak ada di `updateData`
**Solusi:**
- Cek log `📝 Documents values:` - apakah field-file ada?
- Cek log `📋 Blob URLs received:` - apakah URL blob berhasil di-generate?
- Pastikan `Object.assign(documents, blobUrls)` berhasil

### ❌ Log menunjukkan: `📋 File fields after update: ktpFile: ❌ null/undefined`
**Masalah:** Field-file tidak tersimpan ke MongoDB
**Solusi:**
- Cek log `📝 File fields in updates:` - apakah field-file ada di `cleanUpdates`?
- Pastikan `$set` digunakan dengan benar
- Cek apakah ada error di MongoDB connection

### ❌ Field-file ada di MongoDB tapi tidak muncul di admin
**Masalah:** Field-file tidak ter-fetch dengan benar
**Solusi:**
- Refresh admin dashboard
- Cek browser console untuk error
- Cek apakah URL blob bisa diakses (buka URL langsung di browser)
- Pastikan `getImageUrl()` function bekerja dengan benar

### ❌ BLOB_READ_WRITE_TOKEN not set
**Masalah:** Environment variable tidak di-set
**Solusi:**
- Setup Vercel Blob Storage (lihat `SETUP_VERCEL_BLOB.md`)
- Tambahkan `BLOB_READ_WRITE_TOKEN` di Vercel Environment Variables
- Redeploy

## Testing

1. **Upload file sebagai driver:**
   - Login sebagai driver
   - Upload dokumen (KTP, SIM, STNK, Selfie, Foto Kendaraan)
   - Submit form

2. **Cek logs:**
   - Buka Vercel Function Logs
   - Pastikan semua log muncul dengan benar
   - Pastikan field-file ada di log

3. **Cek MongoDB:**
   - Buka MongoDB Atlas
   - Cari user yang baru upload
   - Pastikan field-file ada dan berisi URL

4. **Cek admin dashboard:**
   - Login sebagai admin
   - Buka Manajemen Data
   - View detail user
   - Pastikan dokumen terlihat

## Next Steps

Setelah fix ini:
1. ✅ Commit & push perubahan
2. ✅ Tunggu deployment selesai
3. ✅ Test upload file lagi
4. ✅ Cek logs dan MongoDB
5. ✅ Verifikasi di admin dashboard

---

**Dengan logging detail ini, kita bisa track di mana masalahnya!** 🔍

