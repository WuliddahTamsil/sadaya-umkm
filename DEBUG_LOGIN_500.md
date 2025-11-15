# 🔍 Debug Error 500 pada Login

## ✅ Logging Detail Sudah Ditambahkan

Sekarang setiap request login akan menampilkan log detail di console server. Ini akan membantu mengidentifikasi di mana tepatnya error terjadi.

## 📋 Langkah-langkah Debug

### 1. Restart Server

**PENTING:** Setelah perubahan, restart server untuk menerapkan logging baru:

```bash
# Stop server (Ctrl+C)
# Start lagi
npm run dev:all
```

### 2. Coba Login

Coba login lagi dan perhatikan **console server** (bukan browser console).

### 3. Periksa Log di Console Server

Anda akan melihat log seperti ini:

```
=== LOGIN REQUEST ===
Request body: {"email":"admin@gmail.com","password":"123123"}
Request headers: {...}
Looking for user with email: admin@gmail.com
Calling getUserByEmail...
Reading users.json from: D:\backup_v3\Project_Asli_Bogor\frontend\server\data\users.json
File read successfully, length: 1234
Parsing JSON...
JSON parsed successfully, type: object
Users array length: 5
User found: Yes
User ID: admin-001
User email: admin@gmail.com
User has password: true
Comparing password with bcrypt...
Password valid: true
Login successful, preparing response...
Sending success response
=== LOGIN SUCCESS ===
```

### 4. Identifikasi Error

Jika ada error, log akan berhenti di titik tertentu. Perhatikan di mana log berhenti:

- **Jika berhenti di "Reading users.json"** → Masalah membaca file
- **Jika berhenti di "Parsing JSON"** → File JSON corrupt
- **Jika berhenti di "User found: No"** → Email tidak ditemukan
- **Jika berhenti di "Comparing password"** → Error bcrypt
- **Jika berhenti di "Sending success response"** → Error saat mengirim response

## 🐛 Kemungkinan Masalah

### 1. File users.json Tidak Ditemukan

**Log akan menampilkan:**
```
File users.json tidak ditemukan di: [path]
```

**Solusi:**
- Pastikan file ada di `frontend/server/data/users.json`
- Jika tidak ada, copy dari `users.example.json`

### 2. File JSON Corrupt

**Log akan menampilkan:**
```
Error parsing users.json: [error message]
```

**Solusi:**
- Validasi format JSON
- Pastikan file berisi array valid
- Gunakan online JSON validator

### 3. User Tidak Memiliki Password

**Log akan menampilkan:**
```
User tidak memiliki password: [email]
```

**Solusi:**
- Pastikan semua user di users.json memiliki field `password`
- Password harus berupa bcrypt hash

### 4. Bcrypt Error

**Log akan menampilkan:**
```
Bcrypt error: [error message]
Bcrypt error stack: [stack trace]
```

**Solusi:**
- Pastikan password hash valid
- Pastikan bcryptjs terinstall: `npm install bcryptjs`

### 5. Error Saat Mengirim Response

**Log akan menampilkan:**
```
Login successful, preparing response...
[Error terjadi di sini]
```

**Solusi:**
- Cek apakah user object valid
- Cek apakah ada field yang menyebabkan error saat serialize

## 📝 Copy Error Message

Jika masih error, **copy semua log dari console server** mulai dari:
```
=== LOGIN REQUEST ===
```

Sampai error message terakhir. Ini akan membantu mengidentifikasi masalah spesifik.

## ✅ Test dengan curl

Anda juga bisa test langsung dengan curl untuk melihat response:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@gmail.com\",\"password\":\"123123\"}"
```

## 🔄 Next Steps

1. **Restart server** dengan `npm run dev:all`
2. **Coba login** dan perhatikan console server
3. **Copy semua log** yang muncul
4. **Identifikasi** di mana log berhenti
5. **Perbaiki** masalah sesuai dengan error yang muncul

---

**Catatan:** Logging detail ini akan membantu mengidentifikasi masalah dengan cepat. Pastikan untuk melihat **console server** (bukan browser console) untuk melihat log ini.

