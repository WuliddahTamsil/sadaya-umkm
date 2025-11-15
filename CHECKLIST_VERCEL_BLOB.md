# ✅ Checklist Setup Vercel Blob Storage

## 1. ✅ Blob Store Created
- [x] Blob store `asli-bogor-v3-blob` sudah dibuat
- [x] Region: SIN1 (Southeast Asia Singapore)

## 2. ⏳ Environment Variable
- [ ] Buka: Vercel Dashboard → Project → **Settings** → **Environment Variables**
- [ ] Cek apakah `BLOB_READ_WRITE_TOKEN` sudah ada
- [ ] Jika **BELUM ADA**, lakukan:
  1. Buka: **Storage** → Pilih blob store `asli-bogor-v3-blob`
  2. Klik tab **Settings**
  3. Copy **Read/Write Token**
  4. Kembali ke **Settings** → **Environment Variables**
  5. Klik **Add New**
  6. Name: `BLOB_READ_WRITE_TOKEN`
  7. Value: (paste token)
  8. Environment: ✅ Production, ✅ Preview, ✅ Development
  9. Klik **Save**

## 3. ⏳ Redeploy
- [ ] Setelah environment variable ditambahkan, **HARUS** redeploy
- [ ] Buka: **Deployments** tab
- [ ] Klik **...** pada deployment terbaru
- [ ] Klik **Redeploy**
- [ ] Tunggu deployment selesai (1-2 menit)

## 4. ⏳ Test Upload
- [ ] Buka aplikasi di Vercel
- [ ] Login sebagai user biasa
- [ ] Daftar sebagai **Driver** atau **UMKM**
- [ ] Upload file (KTP, SIM, STNK, dll)
- [ ] Cek apakah upload berhasil
- [ ] Login sebagai **Admin**
- [ ] Buka **Manajemen Data**
- [ ] Cek apakah file terlihat di detail user

## 🔍 Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN environment variable is not set"
- Pastikan environment variable sudah ditambahkan di Vercel
- Pastikan sudah redeploy setelah menambahkan variable
- Cek di Vercel Dashboard → Settings → Environment Variables

### File tidak terlihat di admin
- Cek console browser untuk error loading image
- Pastikan URL blob bisa diakses (public access)
- Cek Vercel Function logs untuk error detail

### Upload gagal
- Cek Vercel Function logs untuk error detail
- Pastikan file size tidak melebihi 5MB
- Pastikan file type adalah image atau PDF

