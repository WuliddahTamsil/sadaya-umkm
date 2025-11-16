# 🔧 Troubleshooting Error 500 Internal Server Error pada Login

## ✅ Perbaikan yang Sudah Dilakukan

1. **Error Handling di authController.js** - Sekarang lebih detail dan informatif
2. **Error Handling di userModel.js** - Menangani kasus file kosong, corrupt, atau tidak valid
3. **Logging yang lebih baik** - Error details akan muncul di console server

## 🔍 Cara Debug Error 500

### 1. Cek Console Server

Buka terminal dimana server berjalan dan lihat error message yang muncul. Error akan menampilkan:
- Error message
- Error stack trace
- File path yang bermasalah

### 2. Cek File users.json

Pastikan file `frontend/server/data/users.json`:
- ✅ File ada
- ✅ Format JSON valid
- ✅ Berisi array
- ✅ User memiliki field `password` yang valid

### 3. Test dengan curl atau Postman

Test endpoint langsung:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"123123"}'
```

### 4. Cek Dependencies

Pastikan semua dependencies terinstall:
```bash
cd frontend
npm install
```

## 🐛 Kemungkinan Penyebab Error 500

### 1. File users.json Corrupt atau Invalid
**Gejala:** Error parsing JSON
**Solusi:** 
- Cek format JSON di `frontend/server/data/users.json`
- Pastikan file berisi array valid
- Jika corrupt, copy dari `users.example.json`

### 2. User Tidak Memiliki Password
**Gejala:** "Data user tidak valid"
**Solusi:**
- Pastikan semua user di users.json memiliki field `password`
- Password harus berupa bcrypt hash

### 3. Bcrypt Error
**Gejala:** "Terjadi kesalahan saat memverifikasi password"
**Solusi:**
- Pastikan password hash valid
- Pastikan bcryptjs terinstall: `npm install bcryptjs`

### 4. File Path Error
**Gejala:** "Error parsing users.json" atau "ENOENT"
**Solusi:**
- Pastikan folder `frontend/server/data/` ada
- Pastikan file `users.json` ada di folder tersebut
- Cek permission file

### 5. Server Tidak Berjalan
**Gejala:** "Failed to fetch" atau "Cannot connect"
**Solusi:**
- Pastikan server berjalan: `npm run dev:all`
- Cek apakah port 3000 sudah digunakan
- Cek console untuk error saat startup

## 📝 Error Messages yang Mungkin Muncul

### Development Mode
Di development mode, error message akan lebih detail:
```json
{
  "error": "Terjadi kesalahan saat login",
  "details": "Error message detail di sini"
}
```

### Production Mode
Di production mode, hanya error message umum:
```json
{
  "error": "Terjadi kesalahan saat login"
}
```

## ✅ Verifikasi Setup

1. **Cek Server Running:**
   ```bash
   # Terminal 1
   npm run dev:all
   ```

2. **Test Health Endpoint:**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Seharusnya return: `{"status":"OK","message":"Backend API is running"}`

3. **Test Login Endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@gmail.com","password":"123123"}'
   ```

4. **Cek Browser Console:**
   - Buka browser DevTools (F12)
   - Cek tab Console untuk error
   - Cek tab Network untuk melihat request/response

## 🔄 Langkah-langkah Debug

1. **Restart Server:**
   ```bash
   # Stop server (Ctrl+C)
   # Start lagi
   npm run dev:all
   ```

2. **Cek Logs:**
   - Lihat console server untuk error details
   - Error akan menampilkan stack trace

3. **Test dengan User yang Diketahui:**
   - Gunakan admin user: `admin@gmail.com` / `123123`
   - Atau user yang sudah terdaftar

4. **Cek File users.json:**
   ```bash
   # Windows
   type frontend\server\data\users.json
   
   # Mac/Linux
   cat frontend/server/data/users.json
   ```

5. **Validasi JSON:**
   - Pastikan format JSON valid
   - Gunakan online JSON validator jika perlu

## 📞 Jika Masih Error

Jika masih mendapat error 500 setelah melakukan semua langkah di atas:

1. **Copy error message lengkap dari console server**
2. **Copy request/response dari browser Network tab**
3. **Cek apakah file users.json valid**
4. **Pastikan semua dependencies terinstall**

Error details akan membantu mengidentifikasi masalah spesifik.

---

**Catatan:** Error handling sekarang lebih baik dan akan memberikan informasi lebih detail di development mode untuk membantu debugging.

