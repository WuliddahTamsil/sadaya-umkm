# 🚀 Panduan Deployment ke Vercel

## ✅ Konfigurasi yang Sudah Dibuat

1. **File `vercel.json`** - Konfigurasi routing untuk Vercel
2. **File `api/index.js`** - Serverless function handler untuk API routes
3. **Build command** - `npm run build` untuk build frontend

## 📋 Langkah-langkah Deployment

### 1. Pastikan File Data Ter-deploy

File `server/data/users.json` harus ter-deploy ke Vercel. Pastikan file ini **TIDAK** di `.gitignore` atau pastikan file ini di-commit ke git.

**PENTING:** Jika file `users.json` tidak ter-deploy, API akan error karena tidak bisa membaca data user.

### 2. Deploy ke Vercel

```bash
# Install Vercel CLI (jika belum)
npm i -g vercel

# Deploy
vercel

# Atau deploy production
vercel --prod
```

Atau deploy melalui GitHub:
1. Push code ke GitHub
2. Connect repository ke Vercel
3. Vercel akan otomatis deploy

### 3. Verifikasi Deployment

Setelah deploy, test endpoint:
- Health check: `https://asli-bogor-v3.vercel.app/api/health`
- Login: `POST https://asli-bogor-v3.vercel.app/api/auth/login`

## 🔧 Troubleshooting Error 404

### Masalah: Login gagal dengan error 404

**Kemungkinan penyebab:**
1. File `api/index.js` tidak ter-deploy
2. Routing di `vercel.json` tidak benar
3. File `server/data/users.json` tidak ter-deploy
4. Build command tidak benar

**Solusi:**
1. Cek di Vercel dashboard → Functions → apakah `api/index.js` muncul
2. Cek logs di Vercel dashboard → Functions → `api/index.js` → Logs
3. Pastikan file `server/data/users.json` ter-commit ke git
4. Pastikan `vercel.json` ada di root project

### Masalah: Error 500 setelah fix 404

**Kemungkinan penyebab:**
1. File `server/data/users.json` tidak ada di deployment
2. Path relatif tidak bekerja di Vercel
3. Dependencies tidak terinstall

**Solusi:**
1. Cek logs di Vercel dashboard untuk melihat error detail
2. Pastikan semua dependencies di `package.json` terinstall
3. Pastikan file `server/data/users.json` ter-deploy

## 📝 Checklist Sebelum Deploy

- [ ] File `vercel.json` ada di root project
- [ ] File `api/index.js` ada dan export default app
- [ ] File `server/data/users.json` ter-commit ke git (atau pastikan ter-deploy)
- [ ] Build command: `npm run build` berhasil di local
- [ ] Dependencies di `package.json` lengkap
- [ ] Test login di localhost berhasil

## 🔍 Debug di Vercel

1. Buka Vercel dashboard
2. Pilih project
3. Klik "Functions" tab
4. Klik function `api/index.js`
5. Lihat logs untuk melihat error detail

## ✅ Setelah Deploy

1. Test health check: `https://asli-bogor-v3.vercel.app/api/health`
2. Test login dengan admin credentials
3. Cek logs jika ada error

