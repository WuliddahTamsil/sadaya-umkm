# 🚀 Panduan Deployment ke Parcel Hosting

Dokumen ini menjelaskan cara deploy project yang sudah digabungkan (frontend + backend) ke Parcel hosting.

## Struktur Project

Project ini sudah digabungkan menjadi satu struktur:
```
frontend/
├── server/              # Backend API (sudah digabungkan)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── data/
│   └── middleware/
├── src/                 # Frontend React
├── dist/                # Build output (dibuat saat build)
├── server-combined.js   # Server terpadu (frontend + backend)
└── package.json
```

## Konfigurasi Parcel Hosting

### 1. Build Command
```
npm run build
```
Command ini akan:
- Build frontend React ke folder `dist/`
- Menyiapkan semua file static yang diperlukan

### 2. Start Command
```
npm start
```
Command ini akan:
- Menjalankan `server-combined.js`
- Server akan melayani:
  - Frontend static files dari `dist/`
  - Backend API routes di `/api/*`
  - Upload files di `/uploads/*`

### 3. Environment Variables (jika diperlukan)
Di Parcel dashboard, tambahkan environment variables jika diperlukan:
- `PORT`: Port untuk server (default: 3000, Parcel biasanya set otomatis)
- `NODE_ENV`: `production`

## Langkah-langkah Deployment

### Persiapan
1. Pastikan semua perubahan sudah di-commit dan push ke repository
2. Pastikan folder `frontend` adalah root directory project di Parcel

### Deploy di Parcel
1. Login ke [Parcel](https://parcel.app) dashboard
2. Klik "New Project" atau "Add Project"
3. Connect repository GitHub/GitLab
4. Pilih folder `frontend` sebagai root directory
5. Set konfigurasi:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18.x atau lebih baru
6. Klik "Deploy"

### Setelah Deploy
1. Tunggu proses build selesai
2. Parcel akan otomatis menjalankan `npm start`
3. Website akan live di URL yang diberikan Parcel
4. Test API endpoint: `https://your-domain.parcel.app/api/health`

## Verifikasi Deployment

### 1. Test Frontend
- Buka URL Parcel di browser
- Pastikan halaman utama muncul
- Test navigasi dan routing

### 2. Test Backend API
- Buka: `https://your-domain.parcel.app/api/health`
- Seharusnya muncul:
  ```json
  {
    "status": "OK",
    "message": "Backend API is running"
  }
  ```

### 3. Test Login/Register
- Coba fitur login/register
- Pastikan tidak ada error "Tidak dapat terhubung ke server"
- Check browser console (F12) untuk error

## Troubleshooting

### Error: "Tidak dapat terhubung ke server"
**Penyebab**: Backend tidak berjalan atau API routes tidak terdeteksi

**Solusi**:
1. Pastikan `npm start` berjalan dengan benar
2. Check logs di Parcel dashboard
3. Pastikan `server-combined.js` ada di root folder `frontend`
4. Pastikan semua dependencies sudah terinstall (check `package.json`)

### Build Error
**Penyebab**: Dependencies tidak terinstall atau build error

**Solusi**:
1. Pastikan `package.json` memiliki semua dependencies
2. Check build logs di Parcel dashboard
3. Pastikan Node.js version sesuai (18.x atau lebih baru)

### API Routes tidak bekerja
**Penyebab**: Routing tidak dikonfigurasi dengan benar

**Solusi**:
1. Pastikan `server-combined.js` sudah benar
2. Check apakah API routes menggunakan prefix `/api`
3. Pastikan CORS sudah dikonfigurasi untuk domain Parcel

### Upload files tidak bekerja
**Penyebab**: Folder uploads tidak ada atau tidak memiliki permission

**Solusi**:
1. Pastikan folder `server/uploads` ada
2. Parcel biasanya membuat folder otomatis saat pertama kali upload
3. Check permission folder di Parcel dashboard

## Catatan Penting

1. **Single Server**: Semua request (frontend + backend) dilayani oleh satu server di port yang ditentukan Parcel
2. **Relative Paths**: API calls menggunakan relative paths (`/api/*`) sehingga otomatis mengarah ke server yang sama
3. **Static Files**: Frontend build files disimpan di `dist/` dan dilayani sebagai static files
4. **SPA Routing**: Semua route non-API akan mengarah ke `index.html` untuk React Router
5. **Data Persistence**: File JSON di `server/data/` akan persist selama deployment, tapi akan reset jika rebuild dari awal

## Development vs Production

### Development (Local)
```bash
npm run dev:all  # Jalankan frontend (port 5173) + backend (port 3000) terpisah
```

### Production (Parcel)
```bash
npm run build    # Build frontend
npm start        # Jalankan server terpadu
```

## Support

Jika masih ada masalah, check:
- Parcel dashboard logs
- Browser console (F12)
- Network tab di browser untuk melihat request/response

