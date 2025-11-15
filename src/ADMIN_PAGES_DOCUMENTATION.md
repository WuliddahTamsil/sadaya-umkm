# 📊 Admin Dashboard Pages - Asli Bogor

## 🎯 Overview
Sistem halaman Admin yang lengkap, modern, dan interaktif dengan animasi smooth dan UI/UX profesional untuk mengelola platform Asli Bogor.

---

## ✨ New Pages Created (5 Major Pages)

### 1. 🗺️ **Persebaran UMKM** (`PersebaranUMKM.tsx`)

#### Fitur Utama:
- **Interactive Map Visualization**
  - Custom-built map dengan grid background
  - Animated UMKM point markers
  - Pulsing animation untuk UMKM aktif
  - Color-coded by area (5 wilayah Bogor)
  - Mountain silhouette background
  
- **Area Statistics**
  - 5 wilayah cards dengan jumlah UMKM
  - Active/Inactive ratio
  - Color-coding per area:
    - Bogor Tengah: Orange (#FF8D28)
    - Bogor Utara: Blue (#2196F3)
    - Bogor Selatan: Yellow (#FFB800)
    - Bogor Timur: Green (#4CAF50)
    - Bogor Barat: Purple (#9C27B0)

- **Advanced Filtering**
  - Search by nama/kategori UMKM
  - Filter by wilayah
  - Zoom in/out controls
  - Real-time filtering

- **Interactive Tooltips**
  - Hover untuk quick info
  - Nama UMKM, alamat, kategori
  - Status (Aktif/Nonaktif)
  - Total orders & rating
  - Smooth fade-in animation

- **Detail Modal**
  - Click point untuk detail lengkap
  - Info alamat dengan icon
  - Stats: Orders & Rating
  - Kategori usaha
  - Color-coded styling

#### Animasi:
- Points muncul dengan stagger effect (delay per index)
- Pulsing animation untuk UMKM aktif
- Scale up on hover (1.3x)
- Smooth zoom transition
- Fade-in tooltips
- Modal scale animation

#### Stats Display:
- Total UMKM ditampilkan: Real-time count
- Interactive legend
- Area labels dengan positioning absolut

---

### 2. 📋 **Manajemen Data** (`ManajemenData.tsx`)

#### Fitur Utama:
- **Modern Data Table**
  - Sortable columns (Name, Date, Orders, Rating)
  - Clickable headers dengan sort indicator (ChevronUp/Down)
  - Checkbox selection (bulk actions ready)
  - Hover row highlight

- **Advanced Filtering System**
  - Real-time search (nama/email)
  - Role filter dropdown (UMKM/Driver/User)
  - Status filter (Active/Inactive/Pending)
  - Refresh button

- **Stats Overview**
  - Total UMKM (342, +18)
  - Total Driver (156, +12)
  - Total User (12,847, +342)
  - Pending Approval (23, -5)

- **Action Menu**
  - Dropdown per row (MoreVertical icon)
  - View Detail
  - Edit
  - Delete (red color)

- **Smart Badges**
  - Role badges dengan border color
  - Status badges dengan background color
  - Change indicators (+ atau -)

#### Table Columns:
1. Checkbox (bulk select)
2. Nama (sortable)
3. Email
4. Role (badge)
5. Status (badge)
6. Tanggal Bergabung (sortable, formatted)
7. Orders (sortable, color: orange)
8. Rating (sortable, with star, for UMKM/Driver only)
9. Aksi (dropdown menu)

#### Animasi:
- Row-by-row fade-in dengan stagger
- Stats cards scale animation
- Hover row background change
- Smooth sort transition

#### Pagination:
- Showing X of Y data
- Previous/Next buttons
- Page numbers (1, 2, 3...)
- Active page highlighted

---

### 3. 📰 **Manajemen Konten** (`ManajemenKonten.tsx`)

#### Fitur Utama:
- **Card Grid Layout**
  - Responsive 3-column grid (desktop)
  - 2-column (tablet)
  - 1-column (mobile)
  - Masonry-style layout

- **Content Types**
  - 📝 Article (Artikel)
  - 📢 Announcement (Pengumuman)
  - 🏷️ Promotion (Promosi)

- **Stats Dashboard**
  - Total Konten (156)
  - Views Bulan Ini (45,789)
  - Total Likes (3,421)
  - Engagement Rate (24.5%)

- **Tab Navigation**
  - Semua
  - Artikel
  - Pengumuman
  - Promosi

- **Each Content Card:**
  - Thumbnail image dengan hover zoom
  - Type badge (icon + label)
  - Status badge (Published/Draft/Scheduled)
  - Category badge
  - Title (line-clamp-2)
  - Excerpt (line-clamp-2)
  - Meta info:
    - Views (Eye icon)
    - Likes (Heart icon, red)
    - Comments (MessageSquare icon, blue)
  - Author name
  - Date (formatted)
  - Hover overlay dengan Edit/View buttons

#### Status System:
- **Published**: Green badge, visible to public
- **Draft**: Gray badge, not visible
- **Scheduled**: Orange badge, akan publish otomatis

#### Animasi:
- Card scale on hover
- Image zoom on hover (1.1x)
- Stagger animation per card
- Overlay fade-in on hover
- Layout animation saat filter berubah

#### Empty State:
- Search icon besar
- "Tidak ada konten ditemukan"
- Suggestion text

---

### 4. 💼 **Layanan & Laporan** (`LayananLaporan.tsx`)

#### Fitur Utama:
- **3-Tab System:**
  1. Keuangan
  2. Transaksi
  3. Layanan & Issues

#### **Tab 1: Keuangan**

**Financial Stats:**
- Total Pendapatan (Rp 456.8M, +18.5%)
- Biaya Operasional (Rp 89.2M, +5.2%)
- Profit Bersih (Rp 367.6M, +22.3%)
- Margin Profit (80.5%, +3.8%)

All dengan animated counters!

**Revenue Trend Chart:**
- Line chart dengan 3 lines:
  - Pendapatan (Blue)
  - Profit (Green)
  - Biaya (Red)
- Smooth line animation
- Interactive tooltips
- 6 months data

**Komposisi Pendapatan:**
- **Pie Chart:**
  - Komisi UMKM (61%) - Orange
  - Biaya Pengiriman (25%) - Blue
  - Iklan & Promosi (10%) - Green
  - Layanan Premium (4%) - Purple

- **Detail List:**
  - Progress bars per kategori
  - Animated width
  - Value in Rupiah
  - Percentage display

#### **Tab 2: Transaksi**

**Transaction Stats:**
- Total Transaksi (45,623)
- Transaksi Berhasil (44,189) - Green
- Transaksi Pending (892) - Orange
- Transaksi Gagal (542) - Red

Each dengan:
- Icon
- Animated counter
- Percentage dari total

#### **Tab 3: Layanan & Issues**

**Issue Tracking:**
- Category badge
- Priority badge (High/Medium/Low)
- Status badge (Resolved/Investigating/Ongoing)
- Issue title
- Report count
- Average resolution time

**Priorities:**
- 🔴 High: Red
- 🟠 Medium: Orange
- 🟢 Low: Green

**Status:**
- ✅ Resolved: Green
- ⚠️ Investigating: Orange
- 🔵 Ongoing: Blue

#### Period Selector:
- Harian
- Mingguan
- Bulanan
- Tahunan

#### Export Button:
- Export laporan keuangan
- PDF/Excel/CSV formats

---

### 5. 🚀 **Coming Soon Page** (`ComingSoonPage.tsx`)

#### Fitur:
- **Animated Background**
  - Gradient transition (3 colors cycle)
  - Floating particles (20 dots)
  - Random positions & animation timing
  - Color variety (4 colors)

- **Central Icon**
  - Rotating & scaling animation
  - 3 icon options: Wrench, Rocket, Sparkles
  - Circular background dengan glow

- **Status Badge**
  - "Dalam Pengembangan"
  - Pulsing glow effect
  - Zap icon rotating

- **Progress Animation**
  - 5 horizontal bars
  - Sequential color animation (gray → orange → gray)
  - Infinite loop

- **Feature Preview Cards**
  - 3 cards grid:
    - 🎨 UI Modern
    - ⚡ Super Cepat
    - 📊 Data Analytics
  - Floating animation (up/down)
  - Hover scale effect

- **Decorative Elements**
  - 2 gradient orbs (top-right, bottom-left)
  - Pulsing scale & opacity
  - Different colors (orange, green)

#### Props:
```tsx
interface ComingSoonPageProps {
  title: string;
  description?: string;
  icon?: 'wrench' | 'rocket' | 'sparkles';
}
```

#### Usage:
```tsx
<ComingSoonPage 
  title="Keuangan Platform" 
  description="Dashboard keuangan lengkap dengan analisis cash flow, profit margin, dan proyeksi pendapatan akan segera hadir!"
  icon="sparkles"
/>
```

---

## 🎨 Design System

### Color Palette:
```css
Primary: #FF8D28 (Orange)
Secondary: #FFB800 (Yellow)
Success: #4CAF50 (Green)
Info: #2196F3 (Blue)
Warning: #FF9800 (Orange)
Danger: #FF6B6B (Red)
Purple: #9C27B0
Text Dark: #2F4858
Text Gray: #858585
Text Light: #CCCCCC
Background: #F9F9F9
Border: #E0E0E0
```

### Typography:
- Headings: Poppins/Montserrat (Bold 600-700)
- Body: Nunito/Open Sans (Regular 400)
- Small Text: 11-12px
- Body: 13-14px
- Heading 4: 16-18px
- Heading 3: 20-24px
- Heading 2: 28-32px

### Spacing:
- Gap small: 8-12px
- Gap medium: 16-24px
- Gap large: 32-48px
- Card padding: 16-24px
- Section spacing: 24-32px

### Shadows:
```css
Card: 0 1px 3px rgba(0,0,0,0.1)
Hover: 0 4px 12px rgba(0,0,0,0.15)
Elevated: 0 8px 24px rgba(0,0,0,0.2)
Glow: 0 0 20px rgba(color, 0.3)
```

### Border Radius:
- Small: 8px
- Medium: 12px
- Large: 16px
- Full: 9999px (pills)

---

## 🎬 Animation Guidelines

### Entry Animations:
```tsx
// Fade + Slide Up
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}

// Scale
initial={{ opacity: 0, scale: 0.9 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.3 }}

// Slide from Left
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
```

### Stagger Effect:
```tsx
transition={{ delay: index * 0.05 }}
transition={{ delay: index * 0.1 }}
```

### Hover Effects:
```tsx
// Scale up
whileHover={{ scale: 1.05 }}

// Move
whileHover={{ x: -5 }}

// Glow
className="hover-scale"
```

### Loop Animations:
```tsx
// Pulse
animate={{
  scale: [1, 1.2, 1],
  opacity: [0.3, 0.5, 0.3]
}}
transition={{
  duration: 2,
  repeat: Infinity
}}

// Rotate
animate={{ rotate: [0, 360] }}
transition={{
  duration: 20,
  repeat: Infinity,
  ease: 'linear'
}}
```

### Loading States:
```tsx
// Progress bar fill
initial={{ width: 0 }}
animate={{ width: `${percentage}%` }}
transition={{ duration: 1 }}

// Sequential bars
animate={{
  backgroundColor: ['#E0E0E0', '#FF8D28', '#E0E0E0']
}}
transition={{
  duration: 1.5,
  repeat: Infinity,
  delay: i * 0.2
}}
```

---

## 📱 Responsive Design

### Breakpoints:
```tsx
// Tailwind defaults
sm: 640px   (mobile)
md: 768px   (tablet)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
```

### Grid Patterns:
```tsx
// Stats Cards
className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"

// Content Cards
className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"

// Two Column Layout
className="grid lg:grid-cols-2 gap-6"
```

### Mobile Optimizations:
- Stack filters vertically
- Full-width buttons
- Collapsible sidebar
- Touch-friendly tap targets (min 44px)
- Reduced padding on mobile
- Simplified charts on small screens

---

## 🔌 Integration

### DashboardWrapper.tsx Updates:
```tsx
import { PersebaranUMKM } from './admin/PersebaranUMKM';
import { ManajemenData } from './admin/ManajemenData';
import { ManajemenKonten } from './admin/ManajemenKonten';
import { LayananLaporan } from './admin/LayananLaporan';
import { ComingSoonPage } from './ComingSoonPage';

// In switch statement:
case 'persebaran':
  return <PersebaranUMKM />;
case 'manajemen-data':
  return <ManajemenData />;
case 'konten':
  return <ManajemenKonten />;
case 'laporan':
  return <LayananLaporan />;
case 'keuangan':
  return <ComingSoonPage 
    title="Keuangan Platform" 
    description="Dashboard keuangan lengkap..."
    icon="sparkles"
  />;
```

### Menu Navigation:
All menu items sudah terhubung di DashboardLayout.tsx:
- persebaran
- persetujuan
- manajemen-data
- konten
- laporan
- keuangan (Coming Soon)

---

## 📊 Data Structures

### UMKM Point:
```typescript
interface UMKMPoint {
  id: string;
  name: string;
  category: string;
  address: string;
  area: string;
  status: 'active' | 'inactive';
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  color: string;
  orders: number;
  rating: number;
}
```

### Data Item (Manajemen Data):
```typescript
interface DataItem {
  id: string;
  name: string;
  email: string;
  role: 'UMKM' | 'Driver' | 'User';
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  totalOrders: number;
  rating: number;
}
```

### Content Item:
```typescript
interface Content {
  id: string;
  type: 'article' | 'announcement' | 'promotion';
  title: string;
  excerpt: string;
  author: string;
  date: string;
  status: 'published' | 'draft' | 'scheduled';
  views: number;
  likes: number;
  comments: number;
  thumbnail: string;
  category: string;
}
```

---

## 🎯 Key Features Summary

### Persebaran UMKM:
✅ Interactive map dengan 14 UMKM points
✅ 5 wilayah Bogor color-coded
✅ Search & filter real-time
✅ Zoom controls
✅ Hover tooltips
✅ Click untuk detail modal
✅ Pulsing animation untuk aktif
✅ Area statistics cards

### Manajemen Data:
✅ Sortable table (4 columns)
✅ Search & dual filters
✅ Bulk selection ready
✅ Action dropdown menu
✅ Smart badges
✅ Pagination
✅ 8 sample users
✅ Stats overview

### Manajemen Konten:
✅ 3-tab navigation
✅ Card grid layout
✅ 6 sample contents
✅ Hover image zoom
✅ Edit/View overlay
✅ Stats dashboard
✅ Search functionality
✅ Empty state handling

### Layanan & Laporan:
✅ 3-tab system (Keuangan/Transaksi/Layanan)
✅ Animated counters
✅ 3 interactive charts (Line/Pie)
✅ Financial stats
✅ Transaction breakdown
✅ Issue tracking
✅ Priority system
✅ Period selector
✅ Export button

### Coming Soon Page:
✅ Animated background
✅ Floating particles
✅ Progress animation
✅ Feature preview cards
✅ Decorative elements
✅ Customizable props
✅ Back to dashboard button

---

## 📈 Performance Optimizations

### Implemented:
- Lazy loading untuk charts
- Memoized calculations
- Debounced search (ready)
- Optimized re-renders
- GPU-accelerated animations (transform & opacity)
- Compressed images (Unsplash optimized URLs)

### Recommendations:
- Implement virtual scrolling untuk large tables
- Add pagination untuk content grid
- Lazy load map points (load on viewport)
- Cache filter results
- Compress thumbnail images
- Use React.memo untuk card components

---

## 🔮 Future Enhancements

### Planned Features:
1. **Persebaran UMKM:**
   - Real map integration (Mapbox/Google Maps)
   - Clustering untuk banyak points
   - Directions & routing
   - Street view preview

2. **Manajemen Data:**
   - Bulk actions (delete, export, status change)
   - Advanced filters (date range, custom fields)
   - CSV import
   - Column customization

3. **Manajemen Konten:**
   - Drag & drop upload
   - Rich text editor
   - Schedule posting
   - SEO optimization
   - Draft autosave

4. **Layanan & Laporan:**
   - More chart types (Area, Scatter, Heatmap)
   - Forecasting & predictions
   - Custom date range picker
   - Automated reports (email)
   - Comparative analysis

---

## 🎨 Style Classes Reference

### Custom Utilities (globals.css):
```css
.hover-scale {
  transition: transform 0.3s ease;
}
.hover-scale:hover {
  transform: scale(1.05);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Common Patterns:
```tsx
// Card with hover effect
<Card className="hover-scale cursor-pointer">

// Text color
style={{ color: '#2F4858' }}  // Dark
style={{ color: '#858585' }}  // Gray
style={{ color: '#CCCCCC' }}  // Light

// Background with transparency
style={{ backgroundColor: '#FF8D2820' }}  // 20% opacity

// Gradient background
className="bg-gradient-to-br from-blue-50 to-green-50"
```

---

## 📚 Component Dependencies

### Required Imports:
```tsx
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { AnimatedCounter } from '../../AnimatedCounter';
import { ExportButton } from '../ExportButton';
```

### Icons Used:
```tsx
import {
  MapPin, Store, Search, Filter, ZoomIn, ZoomOut,
  Eye, Heart, MessageSquare, Edit, Trash2,
  Download, FileText, BarChart3, Calendar,
  DollarSign, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle, Clock,
  Plus, RefreshCw, Settings, MoreVertical
} from 'lucide-react';
```

---

## 🎓 Learning Resources

### Motion/Framer Motion:
- [Official Docs](https://motion.dev)
- Animation variants
- Layout animations
- Gesture animations

### Recharts:
- [Official Docs](https://recharts.org)
- Responsive charts
- Custom tooltips
- Animation configs

### Tailwind CSS:
- [Official Docs](https://tailwindcss.com)
- Responsive design
- Custom utilities
- Dark mode support

---

## ✅ Testing Checklist

### Functionality:
- [ ] Semua filters bekerja
- [ ] Sort columns berfungsi
- [ ] Search real-time
- [ ] Hover states muncul
- [ ] Click actions work
- [ ] Charts render properly
- [ ] Export buttons functional

### UI/UX:
- [ ] Animasi smooth
- [ ] No layout shift
- [ ] Loading states
- [ ] Empty states
- [ ] Error handling
- [ ] Responsive di mobile
- [ ] Touch-friendly

### Performance:
- [ ] No lag saat scroll
- [ ] Charts render cepat
- [ ] Animations tidak choppy
- [ ] Images load optimized
- [ ] Memory tidak leak

---

## 🎉 Summary

**Total New Files Created:** 5
1. PersebaranUMKM.tsx (Interactive Map)
2. ManajemenData.tsx (Data Table)
3. ManajemenKonten.tsx (Content Cards)
4. LayananLaporan.tsx (Financial Reports)
5. ComingSoonPage.tsx (Animated Placeholder)

**Total Updated Files:** 1
- DashboardWrapper.tsx (Routing integration)

**New Features:**
- ✅ Interactive map dengan 14 UMKM points
- ✅ Advanced data table dengan sorting & filtering
- ✅ Content management dengan card layout
- ✅ Financial dashboard dengan 3 charts
- ✅ Animated coming soon page
- ✅ Full responsive design
- ✅ Smooth animations everywhere
- ✅ Professional UI/UX
- ✅ Color-coded systems
- ✅ Real data structures

**Design Principles:**
- 🎨 Modern & Clean
- ⚡ Fast & Responsive  
- 🎭 Animated & Interactive
- 📱 Mobile-Friendly
- 🌈 Color-Coded
- 💎 Professional Grade

---

**Admin dashboard sekarang LENGKAP dengan halaman yang modern, interaktif, dan penuh animasi! Setiap halaman dirancang dengan attention to detail dan UX yang superior! 🚀✨🎉**
