# 🚀 Panduan Development - Project Asli Bogor

## ⚠️ PENTING: Cara Menjalankan Development Server

Karena backend sudah digabungkan ke frontend, ada **2 cara** untuk menjalankan development:

### ✅ Cara 1: Jalankan Bersama (RECOMMENDED)

Jalankan frontend dan backend secara bersamaan dengan satu command:

```bash
cd frontend
npm install
npm run dev:all
```

Ini akan:
- Menjalankan Vite dev server di port **5173** (frontend)
- Menjalankan Express server di port **3000** (backend API)
- Vite proxy akan otomatis mengarahkan request `/api/*` ke backend di port 3000

### ✅ Cara 2: Jalankan Terpisah (2 Terminal)

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd frontend
npm run dev:server
```

## 🔧 Konfigurasi API

API sudah dikonfigurasi untuk menggunakan **relative path** `/api`:
- Di development: Vite proxy mengarahkan `/api/*` ke `http://localhost:3000/api/*`
- Di production: Server yang sama melayani frontend dan backend, jadi `/api/*` langsung ke backend

## ❌ JANGAN Hanya Menjalankan `npm run dev`

Jika Anda hanya menjalankan `npm run dev` tanpa menjalankan backend server, maka:
- ❌ API calls akan gagal
- ❌ Akan muncul error: "Tidak dapat terhubung ke server"
- ❌ Login/Register tidak akan bekerja

**Solusi:** Pastikan backend server juga berjalan (gunakan `npm run dev:all`)

## 🐛 Troubleshooting

### Error: "Tidak dapat terhubung ke server"

**Penyebab:** Backend server tidak berjalan di port 3000

**Solusi:**
1. Pastikan Anda menjalankan `npm run dev:all` (bukan hanya `npm run dev`)
2. Atau jalankan `npm run dev:server` di terminal terpisah
3. Cek apakah port 3000 sudah digunakan: `netstat -ano | findstr :3000` (Windows) atau `lsof -i :3000` (Mac/Linux)

### API calls masih gagal

**Penyebab:** Proxy Vite tidak bekerja atau backend tidak berjalan

**Solusi:**
1. Pastikan backend server berjalan di port 3000
2. Cek browser console (F12) untuk melihat error detail
3. Cek Network tab untuk melihat apakah request `/api/*` berhasil atau gagal
4. Pastikan tidak ada CORS error

### Port 3000 sudah digunakan

**Penyebab:** Aplikasi lain menggunakan port 3000

**Solusi:**
1. Tutup aplikasi yang menggunakan port 3000
2. Atau ubah PORT di `server/server.js` dan `server-combined.js`
3. Atau ubah proxy target di `vite.config.ts`

## 📝 Script yang Tersedia

- `npm run dev` - Hanya frontend (port 5173) - **PERLU backend terpisah**
- `npm run dev:server` - Hanya backend (port 3000) - **PERLU frontend terpisah**
- `npm run dev:all` - Frontend + Backend bersamaan - **RECOMMENDED** ✅
- `npm run build` - Build frontend untuk production
- `npm start` - Jalankan server terpadu (untuk production)

## 🌐 URL Development

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Health Check: `http://localhost:3000/api/health`

## ✅ Verifikasi Setup

1. Jalankan `npm run dev:all`
2. Buka browser ke `http://localhost:5173`
3. Buka browser console (F12)
4. Coba login/register
5. Cek Network tab - request ke `/api/auth/login` harus berhasil (status 200)

---

**Ingat:** Selalu gunakan `npm run dev:all` untuk development! 🚀

