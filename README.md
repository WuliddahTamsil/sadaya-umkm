# Asli Bogor - Platform E-Commerce UMKM Khas Bogor

Platform e-commerce yang menghubungkan pembeli dengan UMKM lokal di Bogor, memungkinkan pembelian produk khas Bogor secara online dengan sistem pengiriman terintegrasi.

## Tech Stack

### Frontend
- **React** - Library JavaScript untuk membangun user interface
- **TypeScript** - Superset JavaScript dengan type safety
- **Vite** - Build tool dan development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Komponen UI yang accessible
- **Framer Motion** - Library animasi untuk React
- **React Hook Form** - Form management library
- **Zod** - Schema validation
- **Sonner** - Toast notification library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express** - Web framework untuk Node.js
- **MongoDB** (Optional) - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing
- **Multer** - File upload middleware
- **Vercel Blob** - Cloud storage untuk file upload

### Tools & Utilities
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **Concurrently** - Run multiple commands concurrently

## Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/Ghinn/Asli_Bogor_v3.git
cd Asli_Bogor_v3
```

### 2. Install Dependencies

```bash
# Install dependencies untuk frontend dan backend
npm install

# Install dependencies untuk server (jika diperlukan)
cd server
npm install
cd ..
```

### 3. Setup Environment Variables

Buat file `.env` di root directory (opsional, untuk MongoDB):

```env
MONGODB_URI=your_mongodb_connection_string
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### 4. Jalankan Project

#### Development Mode (Frontend + Backend)

```bash
# Jalankan frontend dan backend secara bersamaan
npm run dev:all
```

Atau jalankan secara terpisah:

```bash
# Terminal 1: Jalankan frontend (port 5173)
npm run dev

# Terminal 2: Jalankan backend (port 3000)
npm run dev:server
```

#### Production Mode

```bash
# Build frontend
npm run build

# Jalankan production server
npm start
```

### 5. Akses Aplikasi

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health

## Catatan

- Project ini menggunakan JSON files sebagai default storage. Untuk menggunakan MongoDB, set environment variable `MONGODB_URI`.
- File upload menggunakan Vercel Blob Storage jika `BLOB_READ_WRITE_TOKEN` diset, atau local storage jika tidak.
