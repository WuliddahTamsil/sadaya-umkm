# ✅ Checklist Setup MongoDB - Pastikan Semua Sudah Benar

## 1. ✅ MongoDB Atlas - Network Access
- [ ] Buka: MongoDB Atlas → Network Access
- [ ] Pastikan ada entry: `0.0.0.0/0` dengan status "Active"
- [ ] Jika belum ada, klik "+ADD IP ADDRESS" → "Allow Access from Anywhere"

## 2. ✅ MongoDB Atlas - Database User
- [ ] Buka: MongoDB Atlas → Database Access
- [ ] Pastikan user `aslibogor` ada dengan password yang benar
- [ ] Pastikan privileges: "Atlas admin" atau "Read and write to any database"

## 3. ✅ Vercel - Environment Variable
- [ ] Buka: Vercel Dashboard → Project → Settings → Environment Variables
- [ ] Pastikan `MONGODB_URI` ada
- [ ] **PENTING:** Connection string harus ada `/aslibogor` sebelum `?`
- [ ] Format yang benar:
  ```
  mongodb+srv://aslibogor:TEKOMGALAK123@cluster0.3dnpctk.mongodb.net/aslibogor?retryWrites=true&w=majority
  ```
- [ ] Pastikan Environment: All Environments (Production, Preview, Development)

## 4. ✅ Vercel - Redeploy
- [ ] Setelah update Environment Variable, **HARUS** redeploy
- [ ] Buka: Deployments → Klik "..." pada deployment terbaru → "Redeploy"
- [ ] Atau tunggu auto-deploy (jika ada commit baru)

## 5. ✅ Test Connection
- [ ] Setelah redeploy selesai, coba registrasi lagi
- [ ] Cek logs di Vercel untuk melihat error detail

## 🔍 Troubleshooting

### Jika masih error "Could not connect to any server":
1. **Cek IP Access List:**
   - Pastikan `0.0.0.0/0` sudah ada dan "Active"
   - Tunggu 1-2 menit setelah menambahkan IP

2. **Cek Connection String:**
   - Pastikan format benar (ada `/aslibogor` sebelum `?`)
   - Pastikan password benar
   - Pastikan username benar

3. **Cek Environment Variable:**
   - Pastikan `MONGODB_URI` sudah di-set di Vercel
   - Pastikan sudah redeploy setelah update

4. **Cek Logs:**
   - Buka Vercel → Deployments → Logs
   - Lihat error detail untuk troubleshooting lebih lanjut

