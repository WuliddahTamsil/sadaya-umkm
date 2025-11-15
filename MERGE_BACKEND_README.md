# Penggabungan Backend ke Frontend

Dokumen ini menjelaskan perubahan yang telah dilakukan untuk menggabungkan folder backend ke dalam folder frontend.

## Perubahan Struktur

### Sebelum:
```
Project_Asli_Bogor/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── data/
│   └── server.js
└── frontend/
    ├── src/
    └── package.json
```

### Sesudah:
```
Project_Asli_Bogor/
└── frontend/
    ├── server/          # Backend yang sudah dipindahkan
    │   ├── controllers/
    │   ├── routes/
    │   ├── models/
    │   ├── data/
    │   └── server.js
    ├── api/             # Vercel serverless functions
    │   └── index.js
    ├── server-combined.js  # Server terpadu untuk hosting tradisional
    ├── src/
    └── package.json
```

## File yang Telah Diubah

1. **package.json** - Menambahkan dependencies backend dan script baru
2. **vite.config.ts** - Menambahkan proxy untuk API requests
3. **src/config/api.ts** - Menggunakan relative paths di production
4. **vercel.json** - Update untuk routing API
5. **server/server.js** - Path uploads diperbaiki
6. **server-combined.js** - Server baru yang melayani frontend + backend
7. **api/index.js** - Wrapper untuk Vercel serverless functions

## Cara Menggunakan

### Development (Local)

#### Opsi 1: Jalankan Frontend dan Backend Terpisah
```bash
cd frontend
npm install
npm run dev          # Terminal 1: Frontend di port 5173
npm run dev:server   # Terminal 2: Backend di port 3000
```

#### Opsi 2: Jalankan Bersama (Recommended)
```bash
cd frontend
npm install
npm run dev:all      # Menjalankan frontend dan backend bersamaan
```

### Production

#### Untuk Hosting Tradisional (Node.js server)
```bash
cd frontend
npm install
npm run build        # Build frontend
npm start            # Jalankan server terpadu (frontend + backend)
```

Server akan berjalan di port yang ditentukan oleh environment variable `PORT` (default: 3000).

#### Untuk Vercel
Vercel akan otomatis menggunakan:
- `api/index.js` untuk API routes
- `dist/` untuk static files

Pastikan build command di vercel.json sudah benar:
```json
{
  "buildCommand": "cd frontend && npm install && npx vite build"
}
```

## Konfigurasi API

### Development
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Vite proxy akan mengarahkan `/api/*` ke `http://localhost:3000/api/*`

### Production
- API menggunakan relative paths: `/api/*`
- Semua request API akan diarahkan ke server yang sama

## Environment Variables

Jika perlu mengubah URL API, buat file `.env` di folder `frontend`:
```env
VITE_API_BASE_URL=http://your-api-url.com/api
```

## Troubleshooting

### Backend tidak bisa diakses
1. Pastikan dependencies sudah diinstall: `npm install`
2. Pastikan port 3000 tidak digunakan aplikasi lain
3. Cek apakah server berjalan: `npm run dev:server`

### API calls gagal di production
1. Pastikan API routes menggunakan relative paths (`/api/*`)
2. Cek konfigurasi hosting platform (Vercel, Netlify, dll)
3. Pastikan serverless functions sudah ter-deploy dengan benar

### Upload files tidak bekerja
1. Pastikan folder `server/uploads` ada dan memiliki permission write
2. Cek path di `server/server.js` dan `server-combined.js`

## Catatan Penting

- Semua file backend sekarang berada di `frontend/server/`
- Folder `backend/` lama masih ada, bisa dihapus setelah memastikan semuanya bekerja
- Untuk hosting yang tidak mendukung serverless functions, gunakan `server-combined.js`
- Pastikan semua dependencies backend sudah ditambahkan ke `package.json`

