# 🔧 Setup Admin User di MongoDB

Admin user perlu dibuat di MongoDB agar bisa login. Ikuti langkah berikut:

## 🚀 Cara Setup Admin (Pilih Salah Satu)

### **Cara 1: Via Browser (Paling Mudah!)**

1. **Buka browser** dan akses URL berikut:
   ```
   https://asli-bogor-v3.vercel.app/api/setup/setup-admin
   ```
   
   Atau untuk local development:
   ```
   http://localhost:3000/api/setup/setup-admin
   ```

2. **Klik Enter** atau buka URL tersebut

3. **Tunggu beberapa detik** - akan muncul response:
   ```json
   {
     "success": true,
     "message": "Admin user created successfully!",
     "email": "admin@gmail.com",
     "password": "123123"
   }
   ```

4. **Selesai!** Sekarang admin bisa login dengan:
   - **Email:** `admin@gmail.com`
   - **Password:** `123123`

### **Cara 2: Via Terminal (curl)**

```bash
# Untuk Vercel
curl -X POST https://asli-bogor-v3.vercel.app/api/setup/setup-admin

# Untuk local
curl -X POST http://localhost:3000/api/setup/setup-admin
```

### **Cara 3: Via Postman/Thunder Client**

1. **Method:** POST
2. **URL:** `https://asli-bogor-v3.vercel.app/api/setup/setup-admin`
3. **Body:** (kosong, tidak perlu body)
4. **Send**

## ✅ Verifikasi

Setelah setup, coba login dengan:
- **Email:** `admin@gmail.com`
- **Password:** `123123`

## 🔄 Update Password Admin

Jika perlu update password admin, cukup panggil endpoint yang sama lagi. Password akan di-update ke "123123".

## ⚠️ Catatan

- Endpoint ini **aman** untuk dipanggil berkali-kali
- Jika admin sudah ada, password akan di-update
- Jika admin belum ada, akan dibuat baru
- Password selalu di-set ke: `123123`

## 🐛 Troubleshooting

### Error: "MONGODB_URI not configured"
- Pastikan `MONGODB_URI` sudah di-set di Vercel Environment Variables
- Pastikan sudah redeploy setelah menambahkan environment variable

### Error: "Failed to setup admin"
- Cek Vercel Function Logs untuk detail error
- Pastikan MongoDB connection string benar
- Pastikan Network Access di MongoDB Atlas sudah allow `0.0.0.0/0`

