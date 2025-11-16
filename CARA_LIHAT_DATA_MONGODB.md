# 📊 Cara Melihat Data User di MongoDB Atlas

Data user yang daftar sekarang disimpan di **MongoDB Atlas** (cloud database).

## 🔍 Cara Melihat Data di MongoDB Atlas

### **Cara 1: Via MongoDB Atlas Dashboard (Paling Mudah)**

1. **Login ke MongoDB Atlas**
   - Buka: https://cloud.mongodb.com/
   - Login dengan akun MongoDB Atlas Anda

2. **Pilih Cluster**
   - Klik cluster yang Anda gunakan (misalnya: `Cluster0`)

3. **Buka Database**
   - Klik tombol **"Browse Collections"** atau **"Collections"**
   - Pilih database: `aslibogor` (atau nama database yang Anda set di connection string)

4. **Lihat Collection `users`**
   - Klik collection `users`
   - Semua data user akan terlihat di sini!

### **Cara 2: Via MongoDB Compass (Desktop App)**

1. **Download MongoDB Compass**
   - Buka: https://www.mongodb.com/try/download/compass
   - Download dan install

2. **Connect ke MongoDB Atlas**
   - Copy connection string dari MongoDB Atlas
   - Paste di MongoDB Compass
   - Klik **Connect**

3. **Browse Data**
   - Pilih database: `aslibogor`
   - Pilih collection: `users`
   - Lihat semua data user!

### **Cara 3: Via API Endpoint**

Buat endpoint untuk melihat semua users (hanya untuk admin):

```bash
# Get all users
GET https://asli-bogor-v3.vercel.app/api/users
```

## 📋 Struktur Data User

Setiap user memiliki data seperti ini:

```json
{
  "_id": "...",
  "id": "user-001",
  "name": "Nama User",
  "email": "user@example.com",
  "password": "$2a$10$...", // Hashed password
  "role": "user", // atau "admin", "umkm", "driver"
  "phone": "081234567890",
  "address": "Alamat",
  "status": "active", // atau "pending", "suspended"
  "isVerified": true,
  "isOnboarded": true,
  "joinDate": "2025-01-01",
  "totalOrders": 0,
  "rating": 0,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

## 🔄 Migrate Data dari users.json ke MongoDB

Jika Anda punya data di `users.json` yang ingin dipindahkan ke MongoDB:

### **Cara 1: Via Script (Recommended)**

Saya bisa buatkan script untuk migrate semua data dari `users.json` ke MongoDB.

### **Cara 2: Manual via MongoDB Atlas**

1. Buka MongoDB Atlas → Collections
2. Klik **"Insert Document"**
3. Copy data dari `users.json`
4. Paste dan save

## ✅ Verifikasi Data Tersimpan

Setelah user daftar:

1. **Cek di MongoDB Atlas**
   - Buka Collections → `users`
   - User baru harus muncul di sini

2. **Cek via API**
   ```bash
   GET /api/users
   ```

3. **Cek di Admin Dashboard**
   - Login sebagai admin
   - Buka **Manajemen Data**
   - User baru harus terlihat

## 🐛 Troubleshooting

### Data tidak muncul di MongoDB Atlas
- Pastikan `MONGODB_URI` sudah benar di Vercel
- Pastikan database name di connection string benar (`/aslibogor`)
- Cek Vercel Function Logs untuk error

### Ingin kembali pakai users.json?
- Hapus atau comment `MONGODB_URI` di Vercel Environment Variables
- Redeploy aplikasi
- Data akan kembali pakai `users.json` (hanya untuk local)

## 💡 Tips

- **Backup Data:** MongoDB Atlas otomatis backup data
- **Query Data:** Bisa query data langsung di MongoDB Atlas Dashboard
- **Export Data:** Bisa export data dari MongoDB Atlas untuk backup

