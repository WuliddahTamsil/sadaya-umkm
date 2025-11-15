# 📊 Dashboard Data System - Asli Bogor

## 🎯 Overview
Sistem Dashboard Data lengkap dengan visualisasi interaktif, animated counters, real-time notifications, dan analisis mendalam untuk semua role (UMKM, Driver, Admin).

---

## ✨ New Components Created

### 1. **AnimatedCounter Component** 🔢
**File:** `/components/AnimatedCounter.tsx`

Komponen untuk angka yang naik secara animatif dengan easing function.

**Features:**
- Animated number counting (0 → target value)
- Custom duration (default 2000ms)
- Prefix/suffix support (Rp, %, km, dll)
- Decimal places configuration
- Easing function: ease-out-quart
- Smooth scale & opacity animation

**Usage:**
```tsx
<AnimatedCounter value={12500000} prefix="Rp " />
<AnimatedCounter value={4.8} decimals={1} />
<AnimatedCounter value={342.5} suffix=" km" decimals={1} />
```

---

### 2. **BogorToast Component** 🎉
**File:** `/components/BogorToast.tsx`

Notifikasi toast dengan personality khas Bogor yang playful dan friendly.

**Toast Types:**

#### Order Notifications
- `BogorToast.newOrder(orderNumber)` - "Pesanan baru! Langsung gaskeun! 🚀"
- `BogorToast.orderProcessed(orderNumber)` - "Pesanan lagi diproses! 📦"
- `BogorToast.orderCompleted(orderNumber)` - "Yeay! Pesanan selesai! 🎉"

#### Sales Notifications
- `BogorToast.salesBoom()` - "Wah, UMKM kamu lagi rame nih! 🔥"
- `BogorToast.dailyTarget(percentage)` - "Target harian 85% tercapai!"

#### Weather-Themed
- `BogorToast.rainyDay()` - "Hujan turun ~ tetap semangat kirim pesanan ya! ☔"

#### Stock Alerts
- `BogorToast.lowStock(productName, stock)` - "Stok tinggal 5! ⚠️"
- `BogorToast.outOfStock(productName)` - "Waduh! Habis! 😱"

#### Driver Notifications
- `BogorToast.newDelivery(distance)` - "Order baru! Jarak 5.2 km 🏍️"
- `BogorToast.bonusAlert(remaining)` - "Semangat! Tinggal 2 order lagi bonus! 🎁"
- `BogorToast.deliveryCompleted()` - "Pengiriman selesai! Good job! 👍"

#### Customer Notifications
- `BogorToast.customerNew(name)` - "Pelanggan baru! 👋"
- `BogorToast.customerLoyal(name, orders)` - "Pelanggan setia nih! 💚"

#### Achievement
- `BogorToast.achievement(badgeName)` - "🏆 Achievement Unlocked!"

---

### 3. **ExportButton Component** 📥
**File:** `/components/dashboard/ExportButton.tsx`

Dropdown button untuk ekspor laporan dalam berbagai format.

**Features:**
- Export to PDF (📄 red icon)
- Export to Excel (📊 green icon)
- Export to CSV (📋 blue icon)
- Loading state dengan rotating icon
- Success toast notification
- Customizable filename

**Usage:**
```tsx
<ExportButton filename="sales-report" />
```

---

## 📊 UMKM Dashboard System

### Analytics Page
**File:** `/components/dashboard/umkm/AnalyticsPage.tsx`

#### Tabs Navigation:
1. **Overview** - Grafik penjualan & produk terlaris
2. **Analisis Pelanggan** - Customer insights & reviews
3. **Stok & Produk** - Low stock alerts & restock

#### Stats Cards:
- Total Revenue (Rp 45.2M)
- Total Pesanan (1,234)
- Produk Terjual (3,456)
- Total Pelanggan (892)
- Rating Rata-rata (4.8)
- Conversion Rate (24.5%)

All with animated counters & growth indicators!

---

### Customer Analysis Component
**File:** `/components/dashboard/umkm/CustomerAnalysis.tsx`

#### Customer Stats:
- Total Pelanggan (892)
- Pelanggan Baru (127 bulan ini)
- Pelanggan Loyal (234)
- Rata-rata Rating (4.8)

#### Features:
1. **Top Customers List**
   - Customer avatar dengan initial
   - Total orders & spending
   - Last order time
   - Color-coded avatars

2. **Ulasan Terbaru**
   - Customer name
   - Star rating (visual stars)
   - Review comment
   - Time ago

3. **Komplain & Feedback**
   - Customer name
   - Issue description
   - Status: Resolved/Pending
   - Color-coded cards

4. **Pertumbuhan Pelanggan**
   - Progress bars untuk:
     - Pelanggan Baru (127/150)
     - Retention Rate (78%)
     - Customer Satisfaction (92%)

---

### Stock Alert Component
**File:** `/components/dashboard/umkm/StockAlert.tsx`

#### Alert Summary Cards:
- 🔴 Stok Kritis (2 Produk)
- 🟠 Stok Menipis (2 Produk)
- ⚫ Stok Habis (2 Produk)

#### Low Stock Products:
- Product image thumbnail
- Stock current/minimum
- Sold in 24 hours
- Progress bar visualization
- Urgency badges (KRITIS!/Peringatan)
- Color-coded: Red (critical), Orange (warning)
- Restock button

#### Out of Stock Products:
- Grayed out product image with "HABIS" overlay
- Last stock date
- Missed sales count
- "Aktifkan Lagi" button

---

## 🏍️ Driver Dashboard System

### Driver Analytics Page
**File:** `/components/dashboard/driver/DriverAnalyticsPage.tsx`

#### Performance Stats:
- Total Pengiriman (156 hari ini)
- Total Jarak (342.5 km)
- Total Pendapatan (Rp 1,250,000)
- Rating Driver (4.9)

#### Performance Chart:
- **Period selector**: Hari Ini / Minggu Ini / Bulan Ini
- Line chart showing deliveries per hour/day/week
- Interactive tooltips
- Animated data entry

#### Area Heatmap:
- 5 wilayah Bogor dengan color-coding:
  - Bogor Tengah (Red)
  - Bogor Utara (Orange)
  - Bogor Selatan (Yellow)
  - Bogor Timur (Green)
  - Bogor Barat (Blue)
- Horizontal bars showing:
  - Number of deliveries
  - Total earnings per area
  - Animated width based on volume

#### Rewards & Bonuses:
1. **Bonus Harian** 🎯
   - Target: 20 orders
   - Current: 16
   - Remaining: "Tinggal 4 order lagi! 💪"
   - Reward: Rp 50,000

2. **Speed Bonus** ⚡
   - Target: 10 fast deliveries
   - Progress: 7/10
   - Reward: Rp 30,000

3. **Rating Bonus** ⭐
   - Target: 4.8 rating
   - Current: 4.9
   - Status: Completed! ✨
   - Reward: Rp 100,000

#### Performance Metrics:
- Waktu Rata-rata Antar (18 menit vs 20 target)
- Customer Satisfaction (98%)
- On-Time Delivery (96%)
- Complaint Rate (0.5%)

All metrics show:
- Current value
- Target value
- Status color (green/blue/orange)
- Change percentage

---

## 👔 Admin Dashboard System

### Admin Analytics Page
**File:** `/components/dashboard/admin/AdminAnalyticsPage.tsx`

#### Platform Statistics:
- Total UMKM (342 total, 289 active)
- Total Driver (156 total, 98 active)
- Total Pengguna (12,847 total, 8,932 active)
- Transaksi Hari Ini (1,243)
- Total GMV (Rp 45,250,000)
- Pertumbuhan Platform (18.5%)

#### Transaction Trends:
- **Multi-period view**: Harian / Mingguan / Bulanan / Tahunan
- Dual-line chart:
  - Blue line: Number of orders
  - Green line: GMV (Gross Merchandise Value)
- Interactive tooltips
- Smooth animations

#### Category Distribution:
- **Pie Chart** showing:
  - Makanan (45%) - Orange
  - Minuman (30%) - Green
  - Kerajinan (15%) - Blue
  - Fashion (7%) - Purple
  - Jasa (3%) - Red
- List view with GMV per category

#### Area Distribution Map:
- 5 wilayah Bogor
- Horizontal animated bars showing:
  - Number of orders
  - Number of UMKM
  - Number of Drivers
- Color-coded per area

#### Top Performing UMKM:
1. Tahu Gejrot Raos (456 transaksi, +25%)
2. Kopi Bogor Asli (389 transaksi, +18%)
3. Kerajinan Bambu (312 transaksi, +22%)
4. Batik Bogor (278 transaksi, +15%)
5. Roti Unyil Venus (234 transaksi, +12%)

Each showing:
- Rank number
- Category
- Transactions & GMV
- Growth percentage
- Rating

#### Top Performing Drivers:
- Name with avatar
- Total deliveries
- Total earnings
- Rating with star icon
- Sorted by performance

#### Pending Approvals:
- UMKM Registrations (12 pending)
- Driver Applications (8 pending)
- Complaints (3 pending)

Interactive cards that navigate to approval pages.

---

## 🎨 UI/UX Features

### Animated Transitions:
```css
/* All stats cards */
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ delay: index * 0.05 }}

/* List items */
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: index * 0.1 }}

/* Progress bars */
initial={{ width: 0 }}
animate={{ width: `${percentage}%` }}
transition={{ duration: 1, delay: 0.3 }}
```

### Hover Effects:
- `.hover-scale` - Scale up to 1.05 on hover
- Card shadow enhancement
- Smooth transitions (0.3s)

### Color Coding System:
- **Success/Growth**: #4CAF50 (Green)
- **Warning**: #FF9800 (Orange)
- **Critical**: #FF6B6B (Red)
- **Info**: #2196F3 (Blue)
- **Premium**: #FFB800 (Gold)
- **Brand**: #FF8D28 (Orange)

### Status Badges:
```tsx
<Badge style={{
  backgroundColor: status === 'completed' ? '#4CAF50' : '#FF9800',
  color: '#FFFFFF'
}}>
  {statusText}
</Badge>
```

---

## 📈 Charts Configuration

### Recharts Setup:
```tsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
    <XAxis stroke="#858585" style={{ fontSize: '12px' }} />
    <YAxis stroke="#858585" style={{ fontSize: '12px' }} />
    <Tooltip
      contentStyle={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    />
    <Line 
      type="monotone" 
      dataKey="value" 
      stroke="#FF8D28" 
      strokeWidth={3}
      dot={{ fill: '#FF8D28', r: 5 }}
      activeDot={{ r: 8 }}
    />
  </LineChart>
</ResponsiveContainer>
```

---

## 🔄 Integration Points

### Dashboard Navigation:
All 3 roles now have **Analytics** menu item:

**UMKM:**
- Dashboard → Analytics (BarChart3 icon)

**Driver:**
- Dashboard → Analytics (BarChart3 icon)

**Admin:**
- Dashboard → Analytics Platform (BarChart3 icon)

### Routing Setup:
**DashboardWrapper.tsx** updated with:
```tsx
case 'analytics':
  return <UMKMAnalyticsPage />; // for UMKM
  return <DriverAnalyticsPage />; // for Driver
  return <AdminAnalyticsPage />; // for Admin
```

**DashboardLayout.tsx** menu items updated with:
```tsx
{ id: 'analytics', label: 'Analytics', icon: BarChart3 }
```

---

## 📊 Data Visualization Summary

### UMKM Analytics:
- ✅ Sales trends (line/bar charts)
- ✅ Product performance ranking
- ✅ Customer analysis & segmentation
- ✅ Stock alerts with urgency levels
- ✅ Review & complaint management
- ✅ Customer growth metrics
- ✅ Export functionality (PDF/Excel/CSV)

### Driver Analytics:
- ✅ Delivery performance by hour/day/week/month
- ✅ Area heatmap visualization
- ✅ Reward progress tracking
- ✅ Performance metrics dashboard
- ✅ Earnings tracking
- ✅ Real-time bonus notifications
- ✅ Export functionality

### Admin Analytics:
- ✅ Platform-wide statistics
- ✅ Multi-period transaction trends
- ✅ Category distribution (pie chart)
- ✅ Geographic distribution map
- ✅ Top performers (UMKM & Drivers)
- ✅ Pending approvals overview
- ✅ Real-time monitoring
- ✅ Export functionality

---

## 🎯 Key Achievements

### Data Accuracy:
- Real sample data for realistic preview
- Proper Indonesian locale formatting (Rp, dates)
- Percentage calculations
- Growth indicators

### User Experience:
- **Playful notifications** dengan bahasa Bogor
- **Animated counters** untuk engagement
- **Color-coded urgency** untuk prioritization
- **Interactive charts** dengan tooltips
- **Smooth transitions** di semua element
- **Responsive design** mobile-friendly

### Professional Features:
- Multi-format export (PDF/Excel/CSV)
- Period filtering (daily/weekly/monthly/yearly)
- Real-time status updates
- Comprehensive metrics tracking
- Visual data storytelling

---

## 🚀 Performance Optimizations

### Animation Performance:
- Using `transform` & `opacity` only (GPU-accelerated)
- RequestAnimationFrame untuk smooth counting
- Lazy loading charts
- Memoized calculations

### Chart Performance:
- ResponsiveContainer untuk adaptif sizing
- Optimized data points
- Debounced interactions
- Conditional rendering

---

## 📝 Usage Examples

### UMKM Dashboard:
```tsx
// Low stock notification
useEffect(() => {
  products.forEach(product => {
    if (product.stock <= 5) {
      BogorToast.lowStock(product.name, product.stock);
    }
  });
}, [products]);

// New order notification
socket.on('newOrder', (order) => {
  BogorToast.newOrder(order.id);
});
```

### Driver Dashboard:
```tsx
// Bonus progress check
if (completedToday === targetDaily - 2) {
  BogorToast.bonusAlert(2);
}

// Weather alert
if (isRaining) {
  BogorToast.rainyDay();
}
```

### Admin Dashboard:
```tsx
// Achievement unlock
if (umkmCount >= 300) {
  BogorToast.achievement('300 UMKM Milestone');
}
```

---

## 🎉 Summary

**Total New Files:** 8
1. AnimatedCounter.tsx
2. BogorToast.tsx
3. ExportButton.tsx
4. CustomerAnalysis.tsx (UMKM)
5. StockAlert.tsx (UMKM)
6. DriverAnalyticsPage.tsx
7. AdminAnalyticsPage.tsx
8. DASHBOARD_DATA_SYSTEM.md

**Total Updated Files:** 6
1. UMKMAnalyticsPage.tsx
2. DashboardWrapper.tsx
3. DashboardLayout.tsx
4. ManajemenPesanan.tsx (toast integration)
5. OrderAktif.tsx (toast integration)

**New Features:**
- ✅ Animated counters untuk semua angka
- ✅ Playful Bogor-themed notifications
- ✅ Comprehensive analytics untuk 3 roles
- ✅ Interactive charts & visualizations
- ✅ Customer analysis & insights
- ✅ Stock alert system
- ✅ Driver rewards tracking
- ✅ Platform-wide monitoring (Admin)
- ✅ Multi-format export functionality
- ✅ Period filtering sistem
- ✅ Real-time updates
- ✅ Micro-interactions everywhere

**Design Philosophy:**
- 🌧️ Khas Bogor (hujan, gunung, alam)
- 😄 Playful & friendly
- 📊 Data-driven insights
- 🎨 Modern & professional
- 🚀 Fast & responsive
- 💚 Lokal & bangga

---

**Platform sekarang punya sistem dashboard data yang LENGKAP, INTERAKTIF, dan berkarakter khas Bogor! 🎉📊🌧️**
