# 🛒 Alur E-Commerce Lengkap - Asli Bogor

## 📋 Ringkasan Sistem

Sistem e-commerce ini menghubungkan **3 role utama**:
1. **Pembeli (User)** - Membeli produk dari berbagai UMKM
2. **UMKM** - Menjual produk dan menerima pesanan
3. **Driver** - Mengantar pesanan ke pembeli

---

## 🔄 Alur Lengkap E-Commerce

### **1️⃣ Halaman Beranda Pembeli (UserBeranda.tsx)**

**Lokasi:** `src/components/dashboard/user/UserBeranda.tsx`

**Fitur:**
- ✅ Menampilkan **semua produk dari 20 UMKM** yang terdaftar
- ✅ Produk di-enrich dengan data UMKM (nama, alamat, dll)
- ✅ Filter berdasarkan kategori (Makanan, Minuman, Kerajinan, Jasa)
- ✅ Search produk
- ✅ Add to cart langsung dari beranda
- ✅ View detail produk

**API Endpoint:**
- `GET /api/products` - Mengambil semua produk aktif dari semua UMKM
- Produk otomatis di-enrich dengan data UMKM (umkmName, umkmStoreName, umkmAddress)

**Flow:**
```
User membuka beranda
  ↓
API mengambil semua produk aktif
  ↓
Produk di-enrich dengan data UMKM
  ↓
Produk ditampilkan di grid
  ↓
User bisa:
  - Search produk
  - Filter kategori
  - Add to cart
  - View detail
```

---

### **2️⃣ Add to Cart**

**Lokasi:** `UserBeranda.tsx` - `handleAddToCart()`

**API Endpoint:**
- `POST /api/cart/add`
- Body: `{ userId, productId, quantity }`

**Flow:**
```
User klik "Beli" pada produk
  ↓
Validasi user sudah login
  ↓
Validasi produk (stok, status)
  ↓
Jika produk sudah ada di cart → tambah quantity
Jika belum ada → tambah item baru
  ↓
Update cart di database (MongoDB/JSON)
  ↓
Toast notification: "Produk ditambahkan ke keranjang!"
```

**File terkait:**
- `server/controllers/cartController.js` - `addToCartController()`
- `server/models/cartModel.js` - `addToCart()`

---

### **3️⃣ Halaman Keranjang (Keranjang.tsx)**

**Lokasi:** `src/components/dashboard/user/Keranjang.tsx`

**Fitur:**
- ✅ Tampilkan semua item di cart
- ✅ Update quantity (tambah/kurang)
- ✅ Hapus item dari cart
- ✅ Select/deselect item untuk checkout
- ✅ Grouping berdasarkan UMKM/store
- ✅ Hitung subtotal, ongkir, total
- ✅ Pilih metode pembayaran (Cash, Wallet, Transfer)
- ✅ Checkout ke payment

**API Endpoints:**
- `GET /api/cart/:userId` - Ambil cart items
- `PATCH /api/cart/:id` - Update quantity
- `DELETE /api/cart/:id` - Hapus item

**Flow:**
```
User buka halaman keranjang
  ↓
Fetch cart items dari API
  ↓
Enrich dengan data produk (nama, harga, gambar, UMKM)
  ↓
Group items berdasarkan UMKM/store
  ↓
User bisa:
  - Update quantity
  - Hapus item
  - Select/deselect item
  - Pilih metode pembayaran
  - Klik "Checkout"
```

---

### **4️⃣ Checkout & Payment**

**Lokasi:** `Keranjang.tsx` - `proceedToPayment()`

**API Endpoints:**
- `POST /api/orders` - Buat order baru
- `POST /api/orders/payment` - Proses pembayaran

**Flow Checkout:**
```
User klik "Checkout" di keranjang
  ↓
Validasi:
  - Ada item yang dipilih
  - Saldo cukup (jika pakai wallet)
  ↓
Group items berdasarkan UMKM/store
  ↓
Untuk setiap store:
  - Hitung subtotal
  - Hitung ongkir (dibagi jumlah store)
  - Buat order baru via API
  ↓
Order dibuat dengan status: "preparing"
  ↓
Proses pembayaran:
  - Jika wallet: deduct saldo
  - Jika cash/transfer: paymentStatus = "pending"
  ↓
Clear cart items yang sudah di-checkout
  ↓
Redirect ke halaman pesanan
```

**Struktur Order:**
```javascript
{
  id: "ORD-1234567890-ABC",
  userId: "user-123",
  userName: "Nama Pembeli",
  userEmail: "pembeli@email.com",
  umkmId: "umkm-456",
  storeName: "Nama UMKM",
  storeAddress: "Alamat UMKM",
  items: [
    {
      id: "product-789",
      name: "Nama Produk",
      quantity: 2,
      price: 50000
    }
  ],
  subtotal: 100000,
  deliveryFee: 10000,
  total: 110000,
  deliveryAddress: "Alamat pengiriman",
  paymentMethod: "wallet" | "cash" | "transfer",
  paymentStatus: "pending" | "paid" | "failed",
  status: "preparing" | "ready" | "pickup" | "delivered" | "completed",
  driverId: null, // Akan diisi saat driver mengambil order
  driverName: null,
  createdAt: "2025-01-15T10:00:00.000Z",
  updatedAt: "2025-01-15T10:00:00.000Z"
}
```

**Notifikasi yang Dibuat:**
1. ✅ **Untuk UMKM:** "Pesanan Baru! 🎉" - Pesanan baru dari [Nama Pembeli]
2. ✅ **Untuk User:** "Pesanan Berhasil Dibuat ✓"

---

### **5️⃣ UMKM Menerima Order**

**Lokasi:** Dashboard UMKM - Halaman Pesanan

**Flow:**
```
UMKM login ke dashboard
  ↓
Lihat notifikasi: "Pesanan Baru! 🎉"
  ↓
Buka halaman Pesanan
  ↓
Lihat order dengan status: "preparing"
  ↓
UMKM memproses pesanan:
  - Siapkan produk
  - Kemas produk
  ↓
UMKM update status order ke: "ready"
  ↓
Sistem otomatis:
  - Generate tracking number
  - Buat notifikasi untuk semua driver yang tersedia
  - Order muncul di dashboard driver
```

**API Endpoint:**
- `PATCH /api/orders/:id/tracking` - Update status order (UMKM)
- Body: `{ status: "ready", umkmId }`

**Notifikasi yang Dibuat:**
1. ✅ **Untuk Driver:** "Order Menunggu! 🚚" - Order baru dari [Nama UMKM]
2. ✅ **Untuk User:** "Pesanan Diproses UMKM ✓"

---

### **6️⃣ Driver Mengambil Order**

**Lokasi:** Dashboard Driver - Halaman Pesanan

**Flow:**
```
Driver login ke dashboard
  ↓
Lihat notifikasi: "Order Menunggu! 🚚"
  ↓
Buka halaman Pesanan
  ↓
Lihat order dengan status: "ready" (belum ada driverId)
  ↓
Driver klik "Ambil Order"
  ↓
Driver update status order ke: "pickup"
  ↓
Sistem otomatis:
  - Set driverId dan driverName
  - Set pickupTime
  - Set driverLocation (default: koordinat Bogor)
  - Buat notifikasi untuk UMKM dan User
```

**API Endpoint:**
- `PATCH /api/orders/:id/status` - Update status order (Driver)
- Body: `{ status: "pickup", driverId }`

**Notifikasi yang Dibuat:**
1. ✅ **Untuk UMKM:** "Order Diambil Driver ✓" - Driver [Nama Driver] telah mengambil order
2. ✅ **Untuk User:** "Pesanan Sedang Dikirim ✓" - Driver [Nama Driver] sedang mengantar pesanan Anda

---

### **7️⃣ Driver Mengantar Order**

**Lokasi:** Dashboard Driver - Halaman Pesanan (Detail Order)

**Flow:**
```
Driver sudah mengambil order (status: "pickup")
  ↓
Driver pergi ke alamat UMKM/store
  ↓
Driver ambil paket dari UMKM
  ↓
Driver update lokasi real-time (opsional):
  - POST /api/orders/:id/driver-location
  - Body: { lat, lng, driverId }
  ↓
Driver pergi ke alamat pengiriman (deliveryAddress)
  ↓
Driver sampai di alamat pengiriman
  ↓
Driver update status order ke: "delivered"
  ↓
Sistem otomatis:
  - Set deliveredAt
  - Buat notifikasi untuk User
```

**API Endpoint:**
- `PATCH /api/orders/:id/status` - Update status order
- Body: `{ status: "delivered", driverId }`
- `POST /api/orders/:id/driver-location` - Update lokasi driver (opsional)

**Notifikasi yang Dibuat:**
1. ✅ **Untuk User:** "Pesanan Telah Diterima! 🎉" - Pesanan [Order ID] telah diterima

---

### **8️⃣ Order Selesai**

**Flow:**
```
User menerima pesanan (status: "delivered")
  ↓
User konfirmasi pesanan diterima (opsional)
  ↓
Sistem update status order ke: "completed"
  ↓
Update statistik:
  - UMKM: totalOrders++, rating (jika ada)
  - Driver: totalOrders++, rating (jika ada)
  - Product: sold++ (untuk setiap item)
```

---

## 🔗 Integrasi Data Antar Role

### **Pembeli → UMKM**
- ✅ Order dibuat dengan `umkmId` dan `storeName`
- ✅ UMKM menerima notifikasi saat order baru
- ✅ UMKM bisa lihat semua order miliknya
- ✅ UMKM bisa update status order

### **UMKM → Driver**
- ✅ Saat order status = "ready", notifikasi dikirim ke semua driver
- ✅ Driver bisa lihat order dengan status "ready" (belum ada driverId)
- ✅ Driver bisa mengambil order (set driverId)
- ✅ UMKM mendapat notifikasi saat driver mengambil order

### **Driver → Pembeli**
- ✅ Driver update lokasi real-time (opsional)
- ✅ Driver update status ke "delivered"
- ✅ Pembeli mendapat notifikasi saat pesanan diantar dan diterima

---

## 📊 Status Order Flow

```
preparing (UMKM memproses)
    ↓
ready (Siap diambil driver)
    ↓
pickup (Driver mengambil order)
    ↓
delivered (Driver mengantar ke pembeli)
    ↓
completed (Pesanan selesai)
```

---

## 💰 Payment Flow

### **Metode Pembayaran:**
1. **Cash (COD)** - Bayar saat terima barang
   - `paymentStatus: "pending"` → `"paid"` saat delivered

2. **Wallet (Saldo)** - Bayar dari saldo wallet
   - Validasi saldo cukup
   - Deduct saldo saat checkout
   - `paymentStatus: "paid"` langsung

3. **Transfer** - Transfer bank/e-wallet
   - `paymentStatus: "pending"` → `"paid"` setelah konfirmasi

---

## 🔔 Notifikasi System

**Notifikasi dibuat otomatis untuk:**
1. ✅ **Pembeli:**
   - Order berhasil dibuat
   - Status order berubah
   - Pesanan sedang dikirim
   - Pesanan diterima

2. ✅ **UMKM:**
   - Pesanan baru masuk
   - Driver mengambil order
   - Pembayaran diterima

3. ✅ **Driver:**
   - Order baru siap diambil (status: "ready")
   - Order yang sudah diambil (status: "pickup")

---

## 📁 File-File Penting

### **Frontend:**
- `src/components/dashboard/user/UserBeranda.tsx` - Halaman beranda pembeli
- `src/components/dashboard/user/Keranjang.tsx` - Halaman keranjang & checkout
- `src/components/dashboard/user/ProductDetailPage.tsx` - Detail produk

### **Backend:**
- `server/controllers/productController.js` - API produk (dengan enrich UMKM)
- `server/controllers/cartController.js` - API cart
- `server/controllers/orderController.js` - API order (dengan notifikasi)
- `server/models/productModel.js` - Model produk
- `server/models/cartModel.js` - Model cart
- `server/models/orderModel.js` - Model order
- `server/models/notificationModel.js` - Model notifikasi

---

## ✅ Checklist Fitur

- ✅ Halaman beranda menampilkan produk dari semua UMKM
- ✅ Produk di-enrich dengan data UMKM
- ✅ Add to cart dari beranda
- ✅ Halaman keranjang dengan grouping per UMKM
- ✅ Checkout dengan multiple orders (per UMKM)
- ✅ Payment processing (wallet, cash, transfer)
- ✅ Order flow: preparing → ready → pickup → delivered → completed
- ✅ Notifikasi untuk semua role
- ✅ Driver bisa mengambil order
- ✅ Driver bisa update lokasi
- ✅ Integrasi data antar role

---

## 🚀 Testing Checklist

1. ✅ Test add to cart dari beranda
2. ✅ Test update quantity di keranjang
3. ✅ Test checkout dengan multiple items dari different UMKM
4. ✅ Test payment dengan wallet
5. ✅ Test UMKM menerima notifikasi order baru
6. ✅ Test UMKM update status ke "ready"
7. ✅ Test driver melihat order "ready"
8. ✅ Test driver mengambil order
9. ✅ Test driver update status ke "delivered"
10. ✅ Test notifikasi untuk semua role

---

**Sistem e-commerce sudah lengkap dan siap digunakan!** 🎉

