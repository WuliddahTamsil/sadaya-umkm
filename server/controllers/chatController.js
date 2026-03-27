// Simple AI Chat Controller
// This is a rule-based AI that responds to common questions about SADAYA

const getAIResponse = (message, userRole, conversationHistory = []) => {
  const lowerMessage = message.toLowerCase().trim();

  // Math calculations (simple)
  const mathMatch = lowerMessage.match(/(\d+)\s*[x×*]\s*(\d+)|(\d+)\s*[+\-]\s*(\d+)|(\d+)\s*:\s*(\d+)|(\d+)\s*\/\s*(\d+)|(\d+)\s*berapa|berapa\s*(\d+)\s*[x×*]\s*(\d+)/);
  if (mathMatch) {
    let result;
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
    const time = lowerMessage.match(/selamat (pagi|siang|sore|malam)/)?.[1];
    return `Selamat ${time}! 🌅\n\nSelamat datang di SADAYA. Ada yang bisa saya bantu?`;
  }

  // Order related
  if (lowerMessage.match(/(cara|bagaimana|tutorial).*(pesan|order|beli|pembelian)/)) {
    return 'Untuk melakukan pemesanan:\n1. Pilih produk yang Anda inginkan\n2. Tambahkan ke keranjang\n3. Klik "Checkout"\n4. Pilih metode pembayaran\n5. Konfirmasi pesanan\n\nPesanan Anda akan diproses setelah pembayaran dikonfirmasi.';
  }

  if (lowerMessage.match(/(lacak|tracking|status).*(pesanan|order)/)) {
    return 'Anda dapat melacak pesanan di menu "Tracking Pesanan" atau "Riwayat Pesanan". Status akan diperbarui secara real-time mulai dari "Menunggu Konfirmasi", "Diproses", "Dikirim", hingga "Selesai".';
  }

  if (lowerMessage.match(/(batal|cancel).*(pesanan|order)/)) {
    return 'Pesanan dapat dibatalkan jika status masih "Menunggu Konfirmasi". Setelah diproses, silakan hubungi customer service untuk bantuan lebih lanjut.';
  }

  // Payment related
  if (lowerMessage.match(/(pembayaran|bayar|payment|metode pembayaran)/)) {
    return 'Kami menerima berbagai metode pembayaran:\n• Transfer Bank (BCA, Mandiri, BNI, BRI)\n• E-wallet (GoPay, OVO, Dana, ShopeePay)\n• COD (Cash on Delivery) untuk area tertentu di Bogor\n\nPembayaran akan diverifikasi dalam 1-2 jam setelah transfer.';
  }

  if (lowerMessage.match(/(refund|pengembalian dana|uang kembali)/)) {
    return 'Pengembalian dana dapat dilakukan jika:\n• Produk tidak sesuai pesanan\n• Produk rusak saat pengiriman\n• Pesanan dibatalkan sebelum diproses\n\nSilakan hubungi customer service dengan menyertakan bukti foto untuk proses refund.';
  }

  // Delivery related
  if (lowerMessage.match(/(pengiriman|delivery|kirim|estimasi|berapa lama)/)) {
    return 'Estimasi pengiriman:\n• Wilayah Bogor: 1-2 jam\n• Jabodetabek: 1-2 hari\n• Luar Jabodetabek: 2-5 hari kerja\n\nPengiriman dilakukan oleh driver terverifikasi dengan sistem tracking real-time.';
  }

  if (lowerMessage.match(/(ongkir|ongkos kirim|biaya pengiriman)/)) {
    return 'Biaya pengiriman dihitung berdasarkan:\n• Jarak dari UMKM ke alamat tujuan\n• Berat produk\n• Jenis kendaraan driver\n\nBiaya akan ditampilkan saat checkout. Untuk area Bogor, ongkir mulai dari Rp 10.000.';
  }

  // Product related
  if (lowerMessage.match(/(produk|barang|item).*(habis|stok|tersedia)/)) {
    return 'Jika produk habis, Anda dapat:\n1. Cek produk serupa dari UMKM lain\n2. Tambahkan ke wishlist untuk notifikasi saat tersedia kembali\n3. Hubungi UMKM langsung melalui detail produk\n\nStok produk diperbarui secara real-time.';
  }

  if (lowerMessage.match(/(kualitas|mutu|bagus|enak)/)) {
    return 'Semua produk di SADAYA berasal dari UMKM terverifikasi dengan standar kualitas tinggi. Kami menjamin:\n• Produk asli dan autentik\n• Bahan baku berkualitas\n• Kemasan higienis\n• Garansi kepuasan pelanggan';
  }

  // UMKM specific
  if (userRole === 'umkm' && lowerMessage.match(/(tambah|buat|upload).*(produk)/)) {
    return 'Untuk menambah produk:\n1. Buka menu "Manajemen Produk"\n2. Klik "Tambah Produk"\n3. Isi detail produk (nama, harga, deskripsi, stok)\n4. Upload foto produk (minimal 1 foto)\n5. Klik "Simpan"\n\nProduk akan langsung muncul di katalog setelah disimpan.';
  }

  if (userRole === 'umkm' && lowerMessage.match(/(dana|pencairan|penarikan|saldo)/)) {
    return 'Dana penjualan dicairkan otomatis setiap hari Senin untuk transaksi yang sudah selesai (status "Selesai"). Dana akan masuk ke dompet UMKM dan dapat ditarik ke rekening bank yang terdaftar.';
  }

  // Driver specific
  if (userRole === 'driver' && lowerMessage.match(/(ambil|take|accept).*(order|pesanan)/)) {
    return 'Untuk mengambil order:\n1. Buka menu "Order Aktif"\n2. Pilih order yang tersedia di area Anda\n3. Klik "Ambil Order"\n4. Pastikan Anda sudah dekat dengan lokasi pickup\n5. Update status pengiriman sesuai progress\n\nPastikan kendaraan dan dokumen Anda sudah terverifikasi.';
  }

  if (userRole === 'driver' && lowerMessage.match(/(gaji|pendapatan|bayaran|komisi)/)) {
    return 'Pembayaran driver dihitung per pengiriman berdasarkan:\n• Jarak tempuh\n• Berat paket\n• Waktu pengiriman\n\nDana akan masuk ke dompet driver setiap hari Jumat untuk order yang sudah selesai.';
  }

  // Admin specific
  if (userRole === 'admin' && lowerMessage.match(/(setujui|approve|verifikasi).*(umkm|driver)/)) {
    return 'Untuk menyetujui UMKM/Driver baru:\n1. Buka menu "Manajemen Data"\n2. Pilih tab "UMKM" atau "Driver"\n3. Review data dan dokumen yang diupload\n4. Klik "Setujui" untuk mengaktifkan atau "Tolak" jika ada masalah\n\nPastikan semua dokumen lengkap sebelum menyetujui.';
  }

  // Account related
  if (lowerMessage.match(/(ubah|ganti|edit).*(profil|password|email|nama)/)) {
    return 'Untuk mengubah profil:\n1. Buka menu "Profil"\n2. Klik "Edit Profil"\n3. Ubah data yang ingin diubah\n4. Klik "Simpan"\n\nUntuk mengubah password, gunakan fitur "Ubah Password" di halaman profil.';
  }

  if (lowerMessage.match(/(lupa|reset).*(password|sandi)/)) {
    return 'Jika lupa password:\n1. Klik "Lupa Password?" di halaman login\n2. Masukkan email terdaftar\n3. Cek email untuk link reset password\n4. Ikuti instruksi di email\n\nJika tidak menerima email, hubungi support@aslibogor.com';
  }

  // General help
  if (lowerMessage.match(/(bantuan|help|support|cs|customer service)/)) {
    return 'Kami siap membantu Anda melalui:\n• Live Chat (24/7)\n• Telepon: (0251) 123-4567\n• Email: support@aslibogor.com\n• FAQ di halaman ini\n\nTim kami akan merespons dalam 1-2 jam pada hari kerja.';
  }

  if (lowerMessage.match(/(jam|waktu|operasional|buka|tutup)/)) {
    return 'Layanan SADAYA tersedia 24/7 untuk pemesanan online. Untuk customer service:\n• Live Chat: 24/7\n• Telepon: Senin-Jumat, 08:00-17:00 WIB\n• Email: Direspons dalam 1-2 jam kerja';
  }

  // Default responses based on context
  if (conversationHistory.length > 0) {
    const lastUserMessage = conversationHistory
      .filter((msg) => msg.role === 'user')
      .slice(-1)[0]?.content?.toLowerCase() || '';

    if (lastUserMessage.match(/(order|pesanan|pembelian)/)) {
      return 'Apakah ada yang ingin Anda ketahui tentang pesanan? Saya bisa membantu dengan tracking, pembayaran, atau pengiriman.';
    }

    if (lastUserMessage.match(/(produk|barang)/)) {
      return 'Apakah ada pertanyaan lain tentang produk? Saya bisa membantu dengan stok, kualitas, atau rekomendasi produk.';
    }
  }

  // Fallback responses
  const fallbackResponses = [
    'Maaf, saya belum memahami pertanyaan Anda. Bisa dijelaskan lebih detail? Atau coba tanyakan tentang:\n• Cara melakukan pemesanan\n• Status pesanan\n• Metode pembayaran\n• Pengiriman\n• Produk dan UMKM',
    'Saya belum yakin dengan pertanyaan Anda. Apakah Anda ingin tahu tentang:\n• Pemesanan dan checkout\n• Tracking pesanan\n• Pembayaran dan refund\n• Pengiriman\n• Akun dan profil',
    'Bisa tolong jelaskan lebih detail? Saya bisa membantu dengan berbagai topik seperti pemesanan, pembayaran, pengiriman, atau pertanyaan tentang produk SADAYA.',
  ];

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

export const chatController = async (req, res) => {
  try {
    console.log('=== CHAT REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body));
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);

    const { message, userId, role, conversationHistory } = req.body;

    if (!message || !message.trim()) {
      console.log('Validation failed: message is empty');
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    console.log('Processing message:', message);
    console.log('User role:', role);

    // Simulate AI processing delay (optional, for realism)
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

    const response = getAIResponse(message, role, conversationHistory || []);
    console.log('AI Response generated:', response.substring(0, 50) + '...');

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });
    
    console.log('=== CHAT SUCCESS ===');
  } catch (error) {
    console.error('Chat controller error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Terjadi kesalahan saat memproses chat',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

