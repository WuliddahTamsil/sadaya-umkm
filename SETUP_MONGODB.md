# 🚀 Setup MongoDB Atlas - Panduan Cepat

## Langkah 1: Daftar MongoDB Atlas (5 menit)

1. **Buka:** https://www.mongodb.com/cloud/atlas/register
2. **Daftar** dengan email (atau login dengan Google/GitHub)
3. **Pilih:** "Build a Database" → "FREE" (M0 Sandbox)
4. **Pilih Cloud Provider:** AWS (default)
5. **Pilih Region:** Pilih yang terdekat (misalnya: Singapore atau Jakarta jika ada)
6. **Cluster Name:** Biarkan default atau ubah sesuai keinginan
7. **Klik:** "Create Cluster" (tunggu 1-2 menit)

## Langkah 2: Setup Database Access (2 menit)

1. **Klik:** "Database Access" di sidebar kiri
2. **Klik:** "Add New Database User"
3. **Authentication Method:** Password
4. **Username:** `aslibogor` (atau username lain)
5. **Password:** Buat password yang kuat (simpan password ini!)
6. **Database User Privileges:** "Atlas admin" (atau "Read and write to any database")
7. **Klik:** "Add User"

## Langkah 3: Setup Network Access (1 menit)

1. **Klik:** "Network Access" di sidebar kiri
2. **Klik:** "Add IP Address"
3. **Pilih:** "Allow Access from Anywhere" (0.0.0.0/0)
   - Atau untuk lebih aman, tambahkan IP Vercel
4. **Klik:** "Confirm"

## Langkah 4: Dapatkan Connection String (2 menit)

1. **Klik:** "Database" di sidebar kiri
2. **Klik:** "Connect" pada cluster Anda
3. **Pilih:** "Connect your application"
4. **Driver:** Node.js
5. **Version:** 5.5 or later
6. **Copy connection string** yang muncul, contoh:
   ```
   mongodb+srv://aslibogor:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Ganti `<password>`** dengan password yang Anda buat di Langkah 2
8. **Tambahkan database name** di akhir, contoh:
   ```
   mongodb+srv://aslibogor:password123@cluster0.xxxxx.mongodb.net/aslibogor?retryWrites=true&w=majority
   ```

## Langkah 5: Setup di Vercel (3 menit)

1. **Buka:** https://vercel.com/dashboard
2. **Pilih project:** "asli-bogor-v3"
3. **Klik:** "Settings" → "Environment Variables"
4. **Tambahkan variable baru:**
   - **Name:** `MONGODB_URI`
   - **Value:** Connection string dari Langkah 4 (yang sudah diganti password)
   - **Environment:** Production, Preview, Development (centang semua)
5. **Klik:** "Save"
6. **Redeploy** project (atau tunggu auto-deploy)

## Langkah 6: Install Dependencies

```bash
npm install mongoose
```

## Langkah 7: Update Code

Code sudah disiapkan di file `server/models/userModelMongo.js` (akan dibuat)

## ✅ Selesai!

Setelah semua langkah selesai, registrasi akan bekerja dan data akan tersimpan di MongoDB!

