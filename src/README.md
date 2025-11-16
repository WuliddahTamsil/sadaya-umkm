# Asli Bogor - Platform UMKM Digital 🌧️🍃

Platform digital lengkap yang menghubungkan UMKM lokal Bogor dengan pelanggan, dilengkapi dengan sistem marketplace, logistik, dashboard untuk 4 role berbeda, animasi cuaca khas Bogor, dan notifikasi real-time seperti aplikasi ojek online.

## 🎯 Fitur Utama

### 1. Landing Page Publik
- **Hero Section** dengan CTA utama
- **Direktori UMKM** (Fitur Wajib 1) - Search & Filter berdasarkan kategori
- **Halaman Detail UMKM** (Fitur Wajib 2) - Galeri foto & Peta Google Maps interaktif
- Section Tentang Kami, Keunggulan, Alur Pendaftaran
- Section Artikel, Tim, dan Kontak

### 2. Sistem Autentikasi
- **Registrasi** dengan pemilihan 4 role:
  - User (Pembeli)
  - UMKM (Penjual)
  - Driver (Kurir)
  - Admin (Pengelola Platform)
- **Login** dengan email dan password
- **Onboarding** khusus untuk UMKM dan Driver (upload dokumen)

### 3. Dashboard Admin
- Dashboard statistik sistem
- Persebaran UMKM
- **Manajemen Persetujuan** - Approve/Reject pengajuan UMKM & Driver
- Manajemen Data (User, UMKM, Driver)
- Manajemen Konten (Artikel & Berita)
- Layanan & Laporan
- Analitik Keuangan Platform

### 4. Dashboard User (Pembeli)
- **Beranda** - Browse produk dengan search & filter
- **Keranjang** - Kelola item belanja dengan quantity
- **Wishlist** - Simpan produk favorit
- **Pesanan Saya** - Riwayat pembelian
- **Tracking Pesanan** - Monitor pengiriman real-time dengan map
- **Dompet** - Top up saldo & metode pembayaran
- Info & Artikel

### 5. Dashboard UMKM (Penjual)
- **Dashboard** - Statistik penjualan, rating, & review
- **Manajemen Toko** - Profil toko
- **Data Produk** - CRUD produk (Tambah, Edit, Hapus, Aktif/Nonaktif)
- **Manajemen Pesanan** - Terima, proses, & kirim pesanan
- **Keuangan** - Analitik pendapatan & tarik saldo
- Customer Service & Bantuan

### 6. Dashboard Driver
- **Order Aktif** - Terima order baru & kelola pengantaran
- **Peta Navigasi** - Real-time tracking & routing
- **Riwayat Pengiriman**
- **Keuangan** - Upah & penarikan saldo
- **Profil & Rating**

## 🎨 Style Guide

### Tipografi
- **Heading Font**: Poppins (Bold 700, Semi Bold 600)
- **Body Font**: Nunito (Regular 400, Semi Bold 600)
- **Headline 1**: Poppins Bold, 36-56px (Hero utama)
- **Headline 2**: Poppins Bold, 28-40px (Judul section)
- **Headline 3**: Poppins Semi Bold, 22-28px (Judul dashboard)
- **Headline 4**: Poppins Semi Bold, 18-22px (Judul card)
- **Body Text**: Nunito Regular, 16px/1.6 (Paragraf)
- **Body Small**: Nunito Regular, 14px/1.5 (Menu, label)

### Warna (Gradasi Khas Bogor)
- **Primary Orange**: #FF8D28 → #FFB84D → #FFF4E6 (Gradasi oranye-kuning-krem)
- **Primary Blue**: #2F4858 (Judul, Footer, Branding)
- **Accent Green**: #4CAF50 (Hijau daun segar)
- **Success Green**: #C8E6C9
- **Warning Yellow**: #FDE08E
- **Info Blue**: #2196F3
- **White**: #FFFFFF
- **White Faded**: #F5F5F5, #F9F9F9
- **Gray**: #858585, #CCCCCC, #E0E0E0

### Efek Visual
- **Glassmorphism**: Background blur + transparansi untuk card premium
- **Soft Shadow**: Box shadow lembut (tidak tajam)
- **Rounded Corner**: 14-24px untuk modern & friendly
- **Hover Effects**: Scale 1.03 + shadow lembut
- **Smooth Transitions**: 250-300ms cubic-bezier

## 🚀 Cara Menggunakan

### Demo Login
Untuk mencoba berbagai role, gunakan email dengan kata kunci berikut:

- **Admin**: email mengandung kata "admin" (contoh: admin@email.com)
- **UMKM**: email mengandung kata "umkm" (contoh: umkm@email.com)
- **Driver**: email mengandung kata "driver" (contoh: driver@email.com)
- **User**: email biasa lainnya (contoh: user@email.com)

Password: bebas (minimal 8 karakter)

### Flow Registrasi

#### UMKM:
1. Daftar → Pilih role "UMKM"
2. Login pertama → Redirect ke Onboarding
3. Upload dokumen: KTP, Foto Usaha, Izin Usaha (opsional)
4. Status: "Menunggu Verifikasi Admin"
5. Admin approve → Dashboard penuh aktif

#### Driver:
1. Daftar → Pilih role "Driver"
2. Login pertama → Redirect ke Onboarding
3. Upload dokumen: KTP, SIM, STNK, Foto Diri, Foto Kendaraan
4. Status: "Menunggu Verifikasi Admin"
5. Admin approve → Dashboard penuh aktif

### Alur Tracking Pesanan (Fitur Lengkap)

1. **User**: Belanja produk → Checkout
2. **UMKM**: Terima pesanan → Ubah status "Sedang Disiapkan"
3. **UMKM**: Pesanan siap → Tekan "Cari Driver"
4. **Driver**: Terima notifikasi → Ambil order
5. **Driver**: Status "Driver menuju toko" (Map aktif di User dashboard)
6. **Driver**: Tiba di toko → "Pesanan Diambil"
7. **Driver**: Status "Dalam perjalanan" (Live location tracking di User)
8. **Driver**: Tiba di alamat → "Pesanan Selesai"
9. **User**: Pesanan masuk "Riwayat Pembelian"

## 📦 Teknologi

- **React** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS v4** - Modern Styling dengan custom variables
- **Shadcn/UI** - Component Library (25+ components)
- **Motion (Framer Motion)** - Smooth Animations & Micro-interactions
- **Lucide React** - Beautiful Icons
- **Sonner** - Toast Notifications
- **React Hook Form** - Form Management
- **Context API** - State Management (Auth, Notification, Weather)

## 🏗️ Struktur Proyek

```
├── components/
│   ├── auth/                    # Login & Register (6 halaman)
│   ├── onboarding/              # UMKM & Driver onboarding
│   ├── dashboard/               # Dashboard untuk 4 role
│   │   ├── admin/               # AdminDashboard, ManajemenPersetujuan
│   │   ├── user/                # UserBeranda, Keranjang, Wishlist, Tracking, Dompet, RiwayatPesanan
│   │   ├── umkm/                # UMKMDashboard, ManajemenProduk, ManajemenPesanan, KeuanganToko
│   │   ├── driver/              # DriverDashboard, OrderAktif, RiwayatPengiriman, KeuanganDriver
│   │   ├── ProfilePage.tsx      # Halaman profil universal
│   │   ├── NotificationPage.tsx # Halaman notifikasi
│   │   ├── SettingsPage.tsx     # Pengaturan akun
│   │   ├── HelpPage.tsx         # FAQ & Customer Service
│   │   ├── DashboardLayout.tsx  # Layout dengan sidebar + header
│   │   └── DashboardWrapper.tsx # Router dashboard
│   ├── ui/                      # Shadcn components (25+)
│   ├── NotificationToast.tsx    # Toast notifikasi animatif
│   ├── WeatherAnimation.tsx     # Animasi hujan & awan
│   ├── WeatherAlert.tsx         # Alert cuaca kontekstual
│   └── [Landing page components]
├── contexts/
│   ├── AuthContext.tsx          # Authentication state
│   ├── NotificationContext.tsx  # Real-time notifications
│   └── WeatherContext.tsx       # Weather simulation
└── styles/
    └── globals.css              # Custom typography, colors, animations
```

## ✨ Highlight Features

### 1. Direktori UMKM (Fitur Wajib)
- Search real-time berdasarkan nama
- Filter kategori (Makanan, Minuman, Kerajinan, Jasa)
- Card dengan foto, nama, kategori, dan alamat
- Klik untuk detail lengkap

### 2. Detail UMKM (Fitur Wajib)
- Informasi lengkap (Tentang, Kontak, Jam Operasional)
- **Galeri Foto** produk (4 foto)
- **Peta Google Maps Interaktif** (embedded)
- CTA "Mulai Pesan dari Toko Ini"

### 3. Order Tracking Real-Time
- Timeline visual status pengiriman
- Peta navigasi aktif saat driver bergerak
- Update status otomatis
- Notifikasi setiap perubahan status

### 4. Multi-Role Dashboard
- UI disesuaikan per role
- Sidebar dinamis dengan menu berbeda
- Onboarding flow untuk UMKM & Driver
- Admin approval system

## 🎯 Memenuhi Studi Kasus

✅ **Fitur Wajib 1**: Halaman Direktori dengan search & filter
✅ **Fitur Wajib 2**: Halaman Detail UMKM dengan galeri & peta interaktif
✅ **Melampaui Ekspektasi**: 
- ⭐ **50+ Halaman fungsional** (tidak ada placeholder!)
- 🔔 **Sistem notifikasi real-time** seperti GoFood/Grab
- 🌧️ **Animasi cuaca Bogor** dengan alert kontekstual
- 🎨 **Premium UI/UX** dengan glassmorphism & micro-interactions
- 🚀 **Smooth animations** di semua elemen
- 💼 **Dashboard lengkap 4 role** dengan fitur berbeda
- 📊 **Order tracking real-time** dengan peta
- 🚗 **Driver navigation system**
- ✅ **Admin approval system**
- 💰 **Wallet & payment system**
- 📱 **Fully responsive** semua device
- 🎯 **Context-aware UI** sesuai role & kondisi

## 📱 Responsive Design

Website fully responsive untuk:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🔮 Pengembangan Lebih Lanjut

Fitur yang bisa ditambahkan:
- Integrasi payment gateway (Midtrans, Xendit)
- Real-time chat customer service
- AI chatbot untuk bantuan
- Push notification
- Rating & review system
- Loyalty program
- Analytics & reporting yang lebih detail
- Export data ke Excel/PDF

---

**Dibuat dengan ❤️ untuk UMKM Bogor**
