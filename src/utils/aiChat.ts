// Fallback AI Chat jika backend tidak tersedia
export const getFallbackAIResponse = (message: string, userRole?: string): string => {
  const lowerMessage = message.toLowerCase().trim();

  // Math calculations (simple)
  const mathMatch = lowerMessage.match(/(\d+)\s*[x×*]\s*(\d+)|(\d+)\s*[+\-]\s*(\d+)|(\d+)\s*:\s*(\d+)|(\d+)\s*\/\s*(\d+)|(\d+)\s*berapa|berapa\s*(\d+)\s*[x×*]\s*(\d+)/);
  if (mathMatch) {
    let result: number;
    if (mathMatch[1] && mathMatch[2]) {
      result = parseInt(mathMatch[1]) * parseInt(mathMatch[2]);
      return `Hasil dari ${mathMatch[1]} × ${mathMatch[2]} adalah **${result}**. Ada yang bisa saya bantu lagi tentang SADAYA?`;
    } else if (mathMatch[3] && mathMatch[4]) {
      result = parseInt(mathMatch[3]) + parseInt(mathMatch[4]);
      return `Hasil dari ${mathMatch[3]} + ${mathMatch[4]} adalah **${result}**. Ada yang bisa saya bantu lagi tentang SADAYA?`;
    } else if (mathMatch[5] && mathMatch[6]) {
      result = parseInt(mathMatch[5]) / parseInt(mathMatch[6]);
      return `Hasil dari ${mathMatch[5]} : ${mathMatch[6]} adalah **${result}**. Ada yang bisa saya bantu lagi tentang SADAYA?`;
    } else if (mathMatch[7] && mathMatch[8]) {
      result = parseInt(mathMatch[7]) / parseInt(mathMatch[8]);
      return `Hasil dari ${mathMatch[7]} ÷ ${mathMatch[8]} adalah **${result}**. Ada yang bisa saya bantu lagi tentang SADAYA?`;
    } else if (mathMatch[10] && mathMatch[11]) {
      result = parseInt(mathMatch[10]) * parseInt(mathMatch[11]);
      return `Hasil dari ${mathMatch[10]} × ${mathMatch[11]} adalah **${result}**. Ada yang bisa saya bantu lagi tentang SADAYA?`;
    }
  }

  // Who are you / Introduction
  if (lowerMessage.match(/(kamu|anda|kalian|siapakah|siapa).*(siapa|apa|who|what)/) || 
      lowerMessage.match(/kenalan|perkenalkan|introduce/)) {
    return 'Saya adalah **AI Assistant SADAYA**! 🤖\n\nSaya siap membantu Anda dengan:\n• Cara melakukan pemesanan\n• Status pesanan dan tracking\n• Metode pembayaran\n• Informasi pengiriman\n• Produk dan UMKM\n• Pertanyaan tentang akun\n\nAda yang bisa saya bantu?';
  }

  // How to use website / Cara pakai web
  if (lowerMessage.match(/(cara|bagaimana|gimana|tutorial|panduan).*(pakai|gunakan|use|web|website|situs|aplikasi|platform)/) ||
      lowerMessage.match(/(pakai|gunakan|use).*(web|website|situs|aplikasi|platform)/)) {
    return '**Cara Menggunakan Website SADAYA:**\n\n1. **Untuk Pembeli (User):**\n   • Login/Register sebagai "Masyarakat"\n   • Jelajahi produk UMKM di halaman beranda\n   • Klik produk untuk detail, lalu "Tambah ke Keranjang"\n   • Klik ikon keranjang di header untuk checkout\n   • Pilih metode pembayaran dan konfirmasi\n   • Lacak pesanan di menu "Tracking Pesanan"\n\n2. **Untuk UMKM:**\n   • Login/Register sebagai "UMKM"\n   • Upload dokumen verifikasi (KTP, foto toko, SIUP)\n   • Setelah disetujui admin, tambahkan produk di "Manajemen Produk"\n   • Kelola pesanan di "Manajemen Pesanan"\n\n3. **Untuk Driver:**\n   • Login/Register sebagai "Driver"\n   • Upload dokumen (KTP, SIM, STNK, foto kendaraan)\n   • Setelah disetujui, ambil order di "Order Aktif"\n   • Update status pengiriman real-time\n\nAda pertanyaan spesifik tentang fitur tertentu?';
  }

  // Greetings
  if (lowerMessage.match(/^(halo|hai|hi|hello|hey|hallo|halow)/)) {
    return 'Halo! 👋 Selamat datang di SADAYA. Saya AI Assistant siap membantu Anda. Ada yang bisa saya bantu hari ini?';
  }

  if (lowerMessage.match(/selamat (pagi|siang|sore|malam)/)) {
    return 'Selamat ' + lowerMessage.match(/selamat (pagi|siang|sore|malam)/)?.[1] + '! 🌅\n\nSelamat datang di SADAYA. Ada yang bisa saya bantu?';
  }

  // Order related
  if (lowerMessage.match(/(cara|bagaimana|tutorial|gimana).*(pesan|order|beli|pembelian|checkout)/)) {
    return '**Cara Melakukan Pemesanan:**\n\n1. **Pilih Produk:**\n   • Jelajahi katalog produk di halaman beranda\n   • Klik produk untuk melihat detail\n   • Pilih jumlah yang diinginkan\n\n2. **Tambah ke Keranjang:**\n   • Klik tombol "Tambah ke Keranjang"\n   • Produk akan tersimpan di keranjang\n\n3. **Checkout:**\n   • Klik ikon keranjang di header\n   • Review produk di keranjang\n   • Klik "Checkout"\n\n4. **Pembayaran:**\n   • Pilih metode pembayaran (Transfer Bank, E-wallet, atau COD)\n   • Isi alamat pengiriman jika belum ada\n   • Konfirmasi pesanan\n\n5. **Konfirmasi:**\n   • Setelah pembayaran dikonfirmasi, pesanan akan diproses\n   • Anda akan mendapat notifikasi via email/notifikasi\n\nPesanan Anda akan diproses setelah pembayaran dikonfirmasi. Ada pertanyaan lain?';
  }

  if (lowerMessage.match(/(lacak|tracking|status|cek).*(pesanan|order)/)) {
    return '**Cara Melacak Pesanan:**\n\n1. Login ke akun Anda\n2. Buka menu **"Tracking Pesanan"** atau **"Riwayat Pesanan"**\n3. Pilih pesanan yang ingin dilacak\n4. Anda akan melihat:\n   • Status real-time (Menunggu Konfirmasi → Diproses → Dikirim → Selesai)\n   • Lokasi driver (jika sudah diambil)\n   • Estimasi waktu pengiriman\n   • Nomor resi (jika sudah dikirim)\n\nStatus diperbarui secara real-time. Ada pertanyaan tentang tracking?';
  }

  if (lowerMessage.match(/(batal|cancel|hapus).*(pesanan|order)/)) {
    return '**Cara Membatalkan Pesanan:**\n\n• Pesanan dapat dibatalkan jika status masih **"Menunggu Konfirmasi"**\n• Setelah status berubah menjadi "Diproses", hubungi customer service untuk bantuan\n• Untuk refund, silakan hubungi support@aslibogor.com dengan menyertakan:\n  - Nomor pesanan\n  - Alasan pembatalan\n  - Bukti foto (jika ada masalah)\n\nButuh bantuan lebih lanjut?';
  }

  // Payment related
  if (lowerMessage.match(/(pembayaran|bayar|payment|metode pembayaran|metode bayar)/)) {
    return '**Metode Pembayaran yang Tersedia:**\n\n💳 **Transfer Bank:**\n• BCA, Mandiri, BNI, BRI\n• Transfer ke rekening yang tertera\n• Upload bukti transfer saat checkout\n\n📱 **E-wallet:**\n• GoPay, OVO, Dana, ShopeePay\n• Scan QR code atau transfer ke nomor yang tertera\n\n💰 **COD (Cash on Delivery):**\n• Tersedia untuk area tertentu di Bogor\n• Bayar saat produk diterima\n• Cek ketersediaan saat checkout\n\n⏱️ **Verifikasi:**\n• Pembayaran diverifikasi dalam 1-2 jam setelah transfer\n• Anda akan mendapat notifikasi via email/notifikasi\n\nAda pertanyaan tentang pembayaran?';
  }

  if (lowerMessage.match(/(refund|pengembalian dana|uang kembali|kembalikan uang)/)) {
    return '**Kebijakan Refund:**\n\n✅ **Refund dapat dilakukan jika:**\n• Produk tidak sesuai pesanan\n• Produk rusak saat pengiriman\n• Pesanan dibatalkan sebelum diproses\n• Produk tidak diterima dalam waktu yang ditentukan\n\n📋 **Cara Request Refund:**\n1. Hubungi customer service: support@aslibogor.com\n2. Sertakan:\n   - Nomor pesanan\n   - Foto produk (jika ada masalah)\n   - Alasan refund\n3. Tim kami akan memproses dalam 1-3 hari kerja\n\n💰 **Proses Refund:**\n• Dana akan dikembalikan ke metode pembayaran yang digunakan\n• Waktu proses: 3-7 hari kerja setelah disetujui\n\nButuh bantuan lebih lanjut?';
  }

  // Delivery related
  if (lowerMessage.match(/(pengiriman|delivery|kirim|estimasi|berapa lama|kapan sampai)/)) {
    return '**Estimasi Waktu Pengiriman:**\n\n🚚 **Wilayah Bogor:**\n• 1-2 jam (untuk area pusat kota)\n• 2-4 jam (untuk area pinggiran)\n\n🚛 **Jabodetabek:**\n• 1-2 hari kerja\n• Pengiriman dilakukan setiap hari\n\n📦 **Luar Jabodetabek:**\n• 2-5 hari kerja\n• Tergantung lokasi tujuan\n\n✨ **Fitur Tracking:**\n• Real-time tracking via GPS\n• Notifikasi update status\n• Driver terverifikasi dan terpercaya\n\nAda pertanyaan tentang pengiriman?';
  }

  if (lowerMessage.match(/(ongkir|ongkos kirim|biaya pengiriman|tarif pengiriman)/)) {
    return '**Biaya Pengiriman:**\n\n💰 **Perhitungan Ongkir:**\n• Jarak dari UMKM ke alamat tujuan\n• Berat produk\n• Jenis kendaraan driver (motor/mobil)\n\n💵 **Estimasi Biaya:**\n• Area Bogor: Mulai dari Rp 10.000\n• Jabodetabek: Mulai dari Rp 25.000\n• Luar Jabodetabek: Mulai dari Rp 50.000\n\n📊 **Cara Cek Ongkir:**\n• Biaya akan ditampilkan saat checkout\n• Sebelum konfirmasi pembayaran\n• Bisa diubah jika alamat berubah\n\nAda pertanyaan tentang ongkir?';
  }

  // Product related
  if (lowerMessage.match(/(produk|barang|item).*(habis|stok|tersedia|ada|tidak ada)/)) {
    return '**Tentang Stok Produk:**\n\n📦 **Jika Produk Habis:**\n1. Cek produk serupa dari UMKM lain\n2. Tambahkan ke wishlist untuk notifikasi saat tersedia kembali\n3. Hubungi UMKM langsung melalui detail produk\n4. Cek kembali dalam beberapa hari\n\n🔄 **Update Stok:**\n• Stok produk diperbarui secara real-time\n• UMKM mengupdate stok setiap hari\n• Notifikasi akan muncul jika produk kembali tersedia\n\nAda produk spesifik yang Anda cari?';
  }

  // General help
  if (lowerMessage.match(/(bantuan|help|support|cs|customer service|kontak)/)) {
    return '**Hubungi Customer Service:**\n\n💬 **Live Chat:**\n• 24/7 tersedia (chat ini)\n• Respon instan\n\n📞 **Telepon:**\n• (0251) 123-4567\n• Senin-Jumat: 08:00-17:00 WIB\n\n📧 **Email:**\n• support@aslibogor.com\n• Respon dalam 1-2 jam kerja\n\n❓ **FAQ:**\n• Buka halaman Bantuan\n• Cari pertanyaan umum\n\nAda yang bisa saya bantu sekarang?';
  }

  // Default response dengan variasi
  const defaultResponses = [
    'Terima kasih atas pertanyaan Anda! 😊\n\nSaya adalah **AI Assistant SADAYA**. Saya bisa membantu dengan:\n\n🛒 **Pemesanan:** Cara order, tracking, pembatalan\n💳 **Pembayaran:** Metode bayar, refund\n🚚 **Pengiriman:** Estimasi waktu, ongkir\n📦 **Produk:** Stok, kualitas, rekomendasi\n👤 **Akun:** Profil, password, verifikasi\n\nSilakan tanyakan hal yang ingin Anda ketahui!',
    'Hmm, saya belum yakin dengan pertanyaan Anda. 🤔\n\nSaya bisa membantu dengan:\n• Cara melakukan pemesanan\n• Status dan tracking pesanan\n• Metode pembayaran\n• Informasi pengiriman\n• Produk dan UMKM\n• Cara menggunakan website\n\nBisa dijelaskan lebih detail atau tanyakan topik di atas?',
    'Maaf, saya belum memahami pertanyaan Anda dengan jelas. 😅\n\nCoba tanyakan tentang:\n• "Cara pesan produk?"\n• "Metode pembayaran apa saja?"\n• "Berapa lama pengiriman?"\n• "Cara pakai website ini?"\n• "Kamu siapa?"\n\nAtau jelaskan pertanyaan Anda lebih detail!',
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};
