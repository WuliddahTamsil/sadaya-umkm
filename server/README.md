# Backend API - Project Asli Bogor

Backend API untuk aplikasi Project Asli Bogor menggunakan Node.js dan Express.

## Setup Awal

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Data Files

**PENTING:** File data sensitif (`users.json`, `orders.json`, `notifications.json`) tidak di-push ke GitHub untuk keamanan.

Untuk pertama kali setup, copy file example:
```bash
# Windows
copy data\users.example.json data\users.json
copy data\orders.example.json data\orders.json
copy data\notifications.example.json data\notifications.json

# Linux/Mac
cp data/users.example.json data/users.json
cp data/orders.example.json data/orders.json
cp data/notifications.example.json data/notifications.json
```

### 3. Setup Admin User

File `users.example.json` sudah berisi admin user:
- **Email:** `admin@gmail.com`
- **Password:** `123123`
- **Role:** `admin`

Untuk membuat password hash baru:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('password-anda', 10).then(hash => console.log(hash));"
```

### 4. Jalankan Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users (dengan filter role, status)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id/status` - Update user status

### Orders
- `GET /api/orders` - Get all orders (dengan filter userId, umkmId, driverId, status)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/user/:userId` - Get notifications by user
- `GET /api/notifications/user/:userId/unread-count` - Get unread count
- `POST /api/notifications` - Create notification
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/user/:userId/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications/user/:userId` - Clear all notifications

### Upload
- `POST /api/upload/driver` - Upload driver documents
- `POST /api/upload/umkm` - Upload UMKM documents

## Struktur Data

### User (Admin, UMKM, Driver, User)
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "password": "string (bcrypt hash)",
  "role": "admin" | "umkm" | "driver" | "user",
  "status": "active" | "inactive" | "pending",
  "isVerified": boolean,
  "isOnboarded": boolean,
  "storeName": "string (UMKM only)",
  "vehicleType": "string (Driver only)",
  ...
}
```

### Order
```json
{
  "id": "string",
  "userId": "string",
  "umkmId": "string",
  "storeName": "string",
  "items": [...],
  "status": "preparing" | "ready" | "pickup" | "delivered" | "completed",
  "driverId": "string | null",
  ...
}
```

## Auto-Notifications

System otomatis membuat notifikasi:
- **Saat order dibuat** → Notifikasi ke UMKM
- **Saat status jadi "ready"** → Notifikasi ke semua Driver aktif
- **Saat driver ambil order** → Notifikasi ke UMKM dan User
- **Saat order selesai** → Notifikasi ke User

## Notes

- Data disimpan di file JSON (`data/*.json`) sebagai mock database
- File upload disimpan di folder `uploads/`
- Untuk production, gunakan database sesungguhnya (PostgreSQL, MongoDB, dll)
