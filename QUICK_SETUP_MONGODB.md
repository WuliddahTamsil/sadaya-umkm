# ⚡ Setup MongoDB - Panduan Cepat (10 Menit)

## 🎯 Langkah-langkah:

### 1️⃣ Daftar MongoDB Atlas (2 menit)
- Buka: https://www.mongodb.com/cloud/atlas/register
- Daftar dengan email atau Google/GitHub
- Pilih **"FREE"** (M0 Sandbox)
- Pilih region terdekat (Singapore/Jakarta)
- Klik **"Create Cluster"** (tunggu 1-2 menit)

### 2️⃣ Buat Database User (1 menit)
- Klik **"Database Access"** di sidebar
- Klik **"Add New Database User"**
- Username: `aslibogor`
- Password: Buat password kuat (simpan!)
- Privileges: **"Atlas admin"**
- Klik **"Add User"**

### 3️⃣ Allow Network Access (1 menit)
- Klik **"Network Access"** di sidebar
- Klik **"Add IP Address"**
- Pilih **"Allow Access from Anywhere"** (0.0.0.0/0)
- Klik **"Confirm"**

### 4️⃣ Dapatkan Connection String (2 menit)
- Klik **"Database"** → **"Connect"** pada cluster
- Pilih **"Connect your application"**
- Driver: **Node.js**, Version: **5.5 or later**
- **Copy connection string**, contoh:
  ```
  mongodb+srv://aslibogor:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- **Ganti `<password>`** dengan password dari Langkah 2
- **Tambahkan database name**, jadi:
  ```
  mongodb+srv://aslibogor:password123@cluster0.xxxxx.mongodb.net/aslibogor?retryWrites=true&w=majority
  ```

### 5️⃣ Setup di Vercel (3 menit)
- Buka: https://vercel.com/dashboard
- Pilih project: **"asli-bogor-v3"**
- **Settings** → **Environment Variables**
- **Add New:**
  - Name: `MONGODB_URI`
  - Value: Connection string dari Langkah 4 (yang sudah diganti password)
  - Environment: ✅ Production, ✅ Preview, ✅ Development
- Klik **"Save"**
- **Redeploy** project (atau tunggu auto-deploy)

### 6️⃣ Test! (1 menit)
- Setelah deployment selesai
- Coba daftar akun baru di website
- Data akan tersimpan di MongoDB! 🎉

## ✅ Selesai!

Code sudah siap! Tinggal setup MongoDB Atlas dan tambahkan `MONGODB_URI` di Vercel.

**Catatan:**
- Jika `MONGODB_URI` tidak di-set, aplikasi akan otomatis pakai file JSON (untuk development)
- Jika `MONGODB_URI` di-set, aplikasi akan pakai MongoDB (untuk production)

