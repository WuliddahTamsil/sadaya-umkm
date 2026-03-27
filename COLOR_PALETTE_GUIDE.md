# SADAYA Color Palette & Distribution Guide

## 📋 Overview
Sistem warna yang telah diperbarui dengan lebih banyak pilihan warna, gradien yang lebih kreatif, dan distribusi yang lebih seimbang. Mengurangi dominasi orange dan memanfaatkan seluruh spektrum warna secara merata.

---

## 🎨 Core Color System

### Primary Colors (Tetap Konsisten)
- **Orange** `#F99912` - Energi, Kehangatan, Call-to-Action
- **Lime** `#9ACD32` - Pertumbuhan, Kesuksesan, Positif
- **Purple** `#9370DB` - Inovasi, Kreatif, Premium

### Secondary Colors (Tambahan untuk Keseimbangan)
- **Teal** `#14B8A6` - Kepercayaan, Profesional, Teknologi
- **Indigo** `#6366F1` - Fokus, Stabil, Inteligent
- **Rose** `#F43F5E` - Perhatian, Penting, Alert
- **Cyan** `#06B6D4` - Segar, Modern, Dinamis
- **Amber** `#F59E0B` - Peringatan, Kehati-hatian
- **Fuchsia** `#D946EF` - Kreatif, Berani, Playful

### Accent Colors (Detail & Highlight)
- **Mint** `#10B981` - Harmoni, Keseimbangan
- **Emerald** `#059669` - Kealaman, Keberlanjutan
- **Sky** `#0EA5E9` - Terbuka, Cerah
- **Pink** `#EC4899` - Ceria, Ramah, Komunitas
- **Red** `#EF4444` - Error, Danger, Urgent
- **Blue** `#3B82F6` - Informatif, Umum, Terpercaya

---

## 🌈 Gradient Combinations

### 1. PRIMARY GRADIENTS (Penggunaan Utama)
```css
/* Multi-warna utama SADAYA */
--gradient-primary: Orange → Lime → Purple (135deg)

/* Balanced dengan warna baru */
--gradient-balanced: Purple → Cyan → Lime → Orange → Rose (135deg)

/* Vibrant & energik */
--gradient-vibrant: Rose → Orange → Lime → Teal → Purple (120deg)
```

### 2. WARM GRADIENTS (Bagian Energik)
```css
--gradient-warm: Orange → Amber → Pink
--gradient-sunset: Orange → Rose → Fuchsia
```
**Gunakan untuk**: CTA buttons, hero sections, promotional areas

### 3. COOL GRADIENTS (Bagian Tenang)
```css
--gradient-cool: Cyan → Indigo → Purple
--gradient-ocean: Sky → Cyan → Teal
```
**Gunakan untuk**: Neutral sections, feature cards, calm vibes

### 4. NATURE GRADIENTS (Bagian Alami)
```css
--gradient-forest: Emerald → Lime → Teal
```
**Gunakan untuk**: Education, growth, achievement sections

### 5. SOFT PASTEL GRADIENTS (Bagian Ringan)
```css
--gradient-soft-warm: Peach → Pale Lime
--gradient-soft-cool: Mint → Lavender
--gradient-soft-mixed: Light Red → Light Lime → Light Cyan
```
**Gunakan untuk**: Background, light sections, subtle elements

---

## 📦 Component Color Distribution Strategy

### Navigation & Header
```
Gunakan: Gradient balanced atau gradient-cool
Warna solid: Mix antara primary colors
```

### Hero Section
```
Pilihan A: Gradient-vibrant (paling energik)
Pilihan B: Gradient-balanced (profesional)
Pilihan C: Gradient-warm (energik hangat)
Hindari: Override dengan single color orange saja
```

### Feature Cards / Sections
**Gunakan rotasi warna:**
- Card 1: Purple → Indigo gradient
- Card 2: Teal → Cyan gradient
- Card 3: Orange → Amber gradient
- Card 4: Rose → Fuchsia gradient
- Card 5: Emerald → Lime gradient
- Dan seterusnya...

### Buttons
```
Primary Button: Orange atau Gradient-orange-lime
Secondary Button: Teal, Indigo, atau Cyan
Success Button: Lime atau Emerald
Attention Button: Rose atau Red
Neutral Button: Gray background
```

### Sections / Containers
```
Background Sections (berganti):
- Section 1: Gradient-soft-warm atau gradient-forest (light)
- Section 2: Gradient-cool (light) atau gradient-ocean
- Section 3: Gradient-balanced (light) atau gradient-soft-mixed
- Dst...

Container Cards:
- Alternate backgrounds dengan aksen warna berbeda
- Jangan semua orange gradient
```

### Badges & Tags
```
Status Badges:
- Success: Lime #9ACD32 atau Emerald #059669
- Warning/Featured: Amber #F59E0B atau Orange #F99912
- Info: Indigo #6366F1 atau Purple #9370DB
- Special/Promo: Fuchsia #D946EF
- New: Cyan #06B6D4
- Premium: Purple #9370DB
```

### Gamification Elements
```
XP/Progress Bar:
- Container: Gradient-lime-emerald (aktif)
- Track: Light gray

Badges/Achievement:
- Level 1: Cyan → Sky gradient
- Level 2: Lime → Emerald gradient
- Level 3: Purple → Fuchsia gradient
- Level 4: Orange → Amber gradient
- Level 5: Rose → Pink gradient
```

### Footer
```
Jangan: Semuanya orange gradient
Pilihan:
- Gradient-cool atau gradient-ocean untuk solid blue tone
- Gradient-balanced untuk multi-color
- Dark navy background + accent colors untuk elemen
```

---

## 📊 Color Usage Distribution (Target)

**Ideal Balance:**
- **Orange** 15-20% (reduce dari current usage)
- **Purple** 15-20%
- **Lime** 15-20%
- **Other Secondary/Accent** 35-50%
- **Neutral/Gray** 10-15%

**Current Problem:**
- Orange terlalu dominan di hero section dan footer
- Kurang variasi warna di sections lainnya
- Beberapa kombinasi gradien terasa repetitif

---

## 🎯 Implementation Checklist

### Header/Navigation
- [ ] Update gradient background (gunakan gradient-balanced atau gradient-cool)
- [ ] Diversify button colors di navbar

### Hero Section
- [ ] Ganti solid orange gradient dengan gradient-vibrant atau gradient-balanced
- [ ] Tambah elemen cyan atau teal untuk balance

### Section Cards
- [ ] Implementasikan color rotation untuk setiap card
- [ ] Gunakan kombinasi secondary + accent colors

### Buttons & CTAs
- [ ] Varied button colors sesuai context
- [ ] Jangan semua orange

### Gamification (Daya Quest, Harvest)
- [ ] Multi-color badges berdasarkan tipe
- [ ] Rainbow gradient untuk progress bars

### Footer
- [ ] Ganti pure orange gradient
- [ ] Gunakan gradient-cool atau gradient-balanced
- [ ] Highlight links dengan warna accent berbeda

---

## 🚀 Tailwind CSS Usage

### Available Classes:

**Colors:**
```html
<!-- Text Colors -->
<p class="text-primary-orange">Orange Text</p>
<p class="text-secondary-teal">Teal Text</p>
<p class="text-accent-emerald">Emerald Text</p>

<!-- Background Colors -->
<div class="bg-primary-purple">Purple Background</div>
<div class="bg-secondary-cyan">Cyan Background</div>
<div class="bg-accent-sky">Sky Background</div>
```

**Gradients:**
```html
<!-- Primary Gradients -->
<div class="bg-gradient-primary">Orange-Lime-Purple</div>
<div class="bg-gradient-balanced">Full Spectrum</div>
<div class="bg-gradient-vibrant">Rose-Orange-Lime-Teal-Purple</div>

<!-- Specific Gradients -->
<div class="bg-gradient-cool">Cyan-Indigo-Purple</div>
<div class="bg-gradient-forest">Emerald-Lime-Teal</div>
<div class="bg-gradient-ocean">Sky-Cyan-Teal</div>
<div class="bg-gradient-warm">Orange-Amber-Pink</div>

<!-- Soft Pastel -->
<div class="bg-gradient-soft-warm">Soft Peach-Lime</div>
<div class="bg-gradient-soft-cool">Soft Mint-Lavender</div>
```

---

## 💡 Design Principles

1. **Variety Over Repetition** - Hindari menggunakan warna yang sama berulang
2. **Purpose-Driven Colors** - Setiap warna memiliki makna dan fungsi
3. **Balanced Distribution** - Warna tersebar merata di seluruh interface
4. **Harmony = Multiple Gradients** - Gunakan gradien yang berbeda untuk visual interest
5. **Accessibility** - Pastikan contrast ratio yang cukup untuk readability

---

## 🎨 Example Color Combinations (yang sudah tested baik):

**Energik & Hangat:**
Orange → Amber → Rose

**Profesional & Modern:**
Purple → Indigo → Cyan

**Fresh & Natural:**
Emerald → Lime → Teal

**Premium & Bold:**
Purple → Fuchsia → Rose

**Calm & Trustworthy:**
Sky → Cyan → Teal

---

## 📝 Notes for Development Team

- Gunakan palet yang sudah didefinisikan di `tailwind.config.js`
- Hindari hardcoding warna - selalu gunakan CSS variables atau Tailwind classes
- Sebelum approve design, check color distribution
- Aim untuk merata distribution, bukan dominated oleh satu warna
- Test readability dengan accessibility tools (WCAG contrast checker)

---

**Last Updated:** March 2026
**Version:** 2.0 (Enhanced Palette)
