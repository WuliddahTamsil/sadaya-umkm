import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = join(__dirname, '../data/users.json');

// 20 UMKM data based on DirectorySection
const umkmList = [
  {
    name: "Lapis Bogor Sangkuriang",
    email: "lapissangkuriang@gmail.com",
    phone: "(0251) 1500262",
    address: "Jl. Pajajaran No.20i, RT.01/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143",
    description: "Pelopor dan pencetus pertama bolu lapis yang menggunakan bahan dasar talas",
    storeName: "Lapis Bogor Sangkuriang",
    storeAddress: "Jl. Pajajaran No.20i, RT.01/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143",
    storeDescription: "Berdiri sejak tahun 2011, Lapis Bogor Sangkuriang merupakan pelopor dan pencetus pertama bolu lapis yang menggunakan bahan dasar talas. Dikenal dengan teksturnya yang lembut dan topping keju yang melimpah, Lapis Sangkuriang terus berinovasi untuk memberikan oleh-oleh khas Bogor terbaik."
  },
  {
    name: "Roti Unyil Venus",
    email: "rotinyilvenus@gmail.com",
    phone: "0878-7880-5735",
    address: "Ruko V-Point, Jl. Pajajaran No.1, RT.01/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
    description: "Produsen 'Roti Unyil' legendaris di Bogor dengan ukuran kecil dan puluhan varian rasa",
    storeName: "Roti Unyil Venus",
    storeAddress: "Ruko V-Point, Jl. Pajajaran No.1, RT.01/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
    storeDescription: "Venus Bakery adalah produsen \"Roti Unyil\" yang legendaris di Bogor. Disebut roti unyil karena ukurannya yang kecil dan bisa dinikmati sekali lahap. Produknya selalu dibuat fresh setiap hari tanpa menggunakan bahan pengawet dan menawarkan puluhan varian rasa, dari asin (sosis, keju) hingga manis (cokelat, kismis)."
  },
  {
    name: "Asinan Sedap Gedung Dalam",
    email: "asinangedungdalam@gmail.com",
    phone: "(0251) 8313099",
    address: "Jl. Siliwangi No.27C, RT.01/RW.01, Sukasari, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16142",
    description: "Salah satu gerai asinan paling legendaris dan tertua di Bogor, berdiri sejak 1978",
    storeName: "Asinan Sedap Gedung Dalam",
    storeAddress: "Jl. Siliwangi No.27C, RT.01/RW.01, Sukasari, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16142",
    storeDescription: "Salah satu gerai asinan paling legendaris dan tertua di Bogor, berdiri sejak 1978. Terkenal dengan asinan sayur dan asinan buahnya yang menggunakan bahan-bahan segar, kuah cuka yang khas (pedas, asam, manis), dan taburan kacang yang melimpah."
  },
  {
    name: "PIA Apple Pie",
    email: "piaapplepie@gmail.com",
    phone: "(0251) 8324169",
    address: "Jl. Pangrango No.10, RT.04/RW.04, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
    description: "Toko pie terkenal di Bogor dengan apple pie yang renyah di luar dan lembut di dalam",
    storeName: "PIA Apple Pie",
    storeAddress: "Jl. Pangrango No.10, RT.04/RW.04, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
    storeDescription: "Toko pie yang sangat terkenal di Bogor dengan suasana tempat yang unik dan homey. Sesuai namanya, produk andalan mereka adalah apple pie (pai apel) yang renyah di luar dan lembut di dalam. Mereka juga menyediakan varian pie lain seperti stroberi, keju, dan pie gurih (ayam)."
  },
  {
    name: "Bika Bogor Talubi",
    email: "bikabogortalubi@gmail.com",
    phone: "(0251) 8338788",
    address: "Jl. Pajajaran No.20M, RT.01/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143",
    description: "Inovasi oleh-oleh khas Bogor yang mengolah talas menjadi kue bika ambon",
    storeName: "Bika Bogor Talubi",
    storeAddress: "Jl. Pajajaran No.20M, RT.01/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143",
    storeDescription: "Sebuah inovasi oleh-oleh khas Bogor yang mengolah talas menjadi kue bika ambon. Bika Bogor Talubi terkenal dengan teksturnya yang lembut, kenyal, dan memiliki aroma yang khas. Selain rasa original talas, tersedia juga varian rasa lain seperti Ubi Ungu, Nangka, dan Pandan."
  },
  {
    name: "Macaroni Panggang (MP)",
    email: "macaronipanggang@gmail.com",
    phone: "(0251) 8324042",
    address: "Jl. Salak No.24, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
    description: "UMKM legendaris di Bogor yang terkenal dengan makaroni skotel panggangnya",
    storeName: "Macaroni Panggang (MP)",
    storeAddress: "Jl. Salak No.24, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
    storeDescription: "Sebuah UMKM legendaris di Bogor yang terkenal dengan makaroni skotel panggangnya. Disajikan dalam cup aluminium foil, MP menawarkan makaroni panggang dengan isian keju, sosis, dan daging yang melimpah. Tempatnya juga cozy dan menjual aneka kue lain seperti pastries dan cookies."
  },
  {
    name: "Jumbo Bakery (Pusat Strudel Bogor)",
    email: "jumbobakery@gmail.com",
    phone: "(0251) 8327456",
    address: "Jl. Pajajaran No.3F, RT.02/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
    description: "Pelopor oleh-oleh Strudel khas Bogor dengan isian unik khas lokal",
    storeName: "Jumbo Bakery (Pusat Strudel Bogor)",
    storeAddress: "Jl. Pajajaran No.3F, RT.02/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
    storeDescription: "Jumbo (akronim dari Jumpa Bogor) adalah pelopor oleh-oleh Strudel khas Bogor. Berbeda dari strudel biasa, Jumbo menawarkan isian unik khas lokal seperti talas, asinan, dan apel, yang dibalut dengan pastry renyah. Toko ini juga berfungsi sebagai pusat oleh-oleh lengkap yang menjual produk UMKM lain."
  },
  {
    name: "Chocomory",
    email: "chocomory@gmail.com",
    phone: "(0251) 8252935",
    address: "Jl. Raya Puncak - Gadog No.KM 77, Leuwimalang, Kec. Cisarua, Kabupaten Bogor, Jawa Barat 16770",
    description: "Brand UMKM di bawah Cimory Group yang berfokus pada olahan cokelat premium",
    storeName: "Chocomory",
    storeAddress: "Jl. Raya Puncak - Gadog No.KM 77, Leuwimalang, Kec. Cisarua, Kabupaten Bogor, Jawa Barat 16770",
    storeDescription: "Chocomory adalah brand UMKM di bawah Cimory Group yang berfokus pada olahan cokelat premium. Berlokasi di dalam destinasi wisata Cimory (seperti Riverside atau Dairyland), Chocomory terkenal dengan produk andalannya seperti \"Moo Moo Roll\" (bolu gulung), \"Choc-O-Bag\", dan aneka yogurt serta produk susu segar."
  },
  {
    name: "Kacang Bogor Istana",
    email: "kacangbogoristana@gmail.com",
    phone: "N/A (Tergantung toko distributor)",
    address: "Dijual di banyak pusat oleh-oleh, contoh: Priangansari, Jl. Raya Puncak - Gadog No.45, Ciawi, Kabupaten Bogor",
    description: "UMKM yang mempopulerkan kacang bogor (kacang tanah ungu) sebagai oleh-oleh modern",
    storeName: "Kacang Bogor Istana",
    storeAddress: "Dijual di banyak pusat oleh-oleh, contoh: Priangansari, Jl. Raya Puncak - Gadog No.45, Ciawi, Kabupaten Bogor",
    storeDescription: "Kacang Bogor Istana adalah UMKM yang mempopulerkan kacang bogor (kacang tanah ungu) sebagai oleh-oleh modern. Produk ini mengolah kacang bogor menjadi camilan renyah dan gurih yang dikemas secara premium, membuatnya lebih awet dan praktis untuk dibawa sebagai buah tangan."
  },
  {
    name: "Bogor Raincake",
    email: "bogorraincake@gmail.com",
    phone: "0811-1172-250",
    address: "Jl. Pajajaran No.31, RT.02/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
    description: "Pelopor kue oleh-oleh kekinian di Bogor dengan bolu lembut dan lapisan crispy pastry",
    storeName: "Bogor Raincake",
    storeAddress: "Jl. Pajajaran No.31, RT.02/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
    storeDescription: "Bogor Raincake adalah salah satu pelopor kue oleh-oleh kekinian di Bogor. Produk utamanya adalah kue bolu lembut dengan berbagai isian filling premium dan lapisan crispy pastry di bagian bawahnya, menciptakan perpaduan tekstur yang unik."
  },
  {
    name: "Rumah Talas Bogor",
    email: "rumahtalasbogor@gmail.com",
    phone: "0812-9492-4112",
    address: "Jl. Raya Pajajaran No.98, Bantarjati, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16153",
    description: "UMKM yang mendedikasikan diri untuk mengolah Talas Bogor menjadi berbagai macam produk",
    storeName: "Rumah Talas Bogor",
    storeAddress: "Jl. Raya Pajajaran No.98, Bantarjati, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16153",
    storeDescription: "UMKM ini mendedikasikan diri untuk mengolah Talas Bogor menjadi berbagai macam produk, tidak hanya lapis. Mereka menawarkan bolu talas, cookies talas, hingga keripik talas. Menjadi salah satu \"one-stop-shopping\" untuk oleh-oleh berbahan dasar talas."
  },
  {
    name: "Miss Pumpkin",
    email: "misspumpkin@gmail.com",
    phone: "(0251) 8320134",
    address: "Jl. Pajajaran No.43, RT.03/RW.10, Bantarjati, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16153",
    description: "UMKM inovatif yang fokus mengolah labu kuning (pumpkin) menjadi oleh-oleh khas",
    storeName: "Miss Pumpkin",
    storeAddress: "Jl. Pajajaran No.43, RT.03/RW.10, Bantarjati, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16153",
    storeDescription: "Miss Pumpkin adalah UMKM inovatif yang fokus mengolah labu kuning (pumpkin) menjadi oleh-oleh khas. Produk andalannya adalah bolu labu parang yang lembut, legit, dan memiliki aroma khas. Mereka juga mengembangkan varian lain seperti brownies dan cookies labu."
  },
  {
    name: "Brownies Pisang Citarasa",
    email: "browniespisangcitarasa@gmail.com",
    phone: "(0251) 8246049",
    address: "Toko Oleh-Oleh Citarasa, Jl. Raya Puncak - Gadog, Ciawi, Bogor",
    description: "UMKM yang berfokus pada olahan brownies yang unik menggunakan pisang sebagai bahan utama",
    storeName: "Brownies Pisang Citarasa",
    storeAddress: "Toko Oleh-Oleh Citarasa, Jl. Raya Puncak - Gadog, Ciawi, Bogor",
    storeDescription: "UMKM ini berfokus pada olahan brownies yang unik, yaitu menggunakan pisang sebagai bahan utama yang memberikan tekstur lebih lembab dan aroma wangi. Ini adalah oleh-oleh populer bagi mereka yang mencari variasi dari brownies cokelat biasa."
  },
  {
    name: "Mochi Mochi 'Mochilaku'",
    email: "mochilaku@gmail.com",
    phone: "0812-9010-8209",
    address: "Ruko Villa Indah Pajajaran, Jl. Pajajaran No.18, RT.02/RW.11, Bantarjati, Kec. Bogor Utara, Kota Bogor",
    description: "UMKM yang berfokus pada mochi sebagai oleh-oleh dengan tekstur super lembut dan isian premium",
    storeName: "Mochi Mochi 'Mochilaku'",
    storeAddress: "Ruko Villa Indah Pajajaran, Jl. Pajajaran No.18, RT.02/RW.11, Bantarjati, Kec. Bogor Utara, Kota Bogor",
    storeDescription: "UMKM yang berfokus pada mochi sebagai oleh-oleh. Mochilaku dikenal dengan tekstur mochi yang super lembut dan isian premium. Berbeda dari mochi biasa, mereka menawarkan varian modern seperti es krim mochi dan mochi dengan isian kekinian (cth: cokelat lumer, green tea)."
  },
  {
    name: "Priangansari",
    email: "priangansari@gmail.com",
    phone: "(0251) 8243157",
    address: "Jl. Raya Puncak - Gadog No.45, Ciawi, Kec. Ciawi, Kabupaten Bogor, Jawa Barat 16720",
    description: "Pusat Oleh-Oleh yang sangat besar dan lengkap, mengumpulkan berbagai produk UMKM Bogor",
    storeName: "Priangansari",
    storeAddress: "Jl. Raya Puncak - Gadog No.45, Ciawi, Kec. Ciawi, Kabupaten Bogor, Jawa Barat 16720",
    storeDescription: "Priangansari bukanlah produsen tunggal, melainkan Pusat Oleh-Oleh (UMKM) yang sangat besar dan lengkap. Tempat ini mengumpulkan berbagai produk UMKM Bogor di satu lokasi, mulai dari Lapis Talas, Roti Unyil, Kacang Bogor Istana, hingga keripik dan asinan. Ini adalah \"one-stop solution\" bagi wisatawan."
  },
  {
    name: "Kopi Halimun",
    email: "kopihalimun@gmail.com",
    phone: "0812-8899-1101",
    address: "Jl. Malabar No.23, RT.04/RW.07, Tegal Gundil, Kec. Bogor Utara, Kota Bogor",
    description: "UMKM yang berfokus pada promosi dan penjualan kopi robusta dan arabika asli dari petani lokal Bogor",
    storeName: "Kopi Halimun",
    storeAddress: "Jl. Malabar No.23, RT.04/RW.07, Tegal Gundil, Kec. Bogor Utara, Kota Bogor",
    storeDescription: "UMKM ini berfokus pada promosi dan penjualan kopi robusta dan arabika asli dari petani lokal di Bogor, khususnya dari lereng Gunung Halimun. Mereka menjual biji kopi, kopi bubuk, dan seringkali memiliki kedai kecil untuk ngopi di tempat, sekaligus sebagai etalase edukasi kopi Bogor."
  },
  {
    name: "Batik Tradisiku",
    email: "batiktradisiku@gmail.com",
    phone: "(0251) 8378010",
    address: "Jl. Neglasari I No.2, RT.01/RW.04, Cikaret, Kec. Bogor Sel., Kota Bogor, Jawa Barat 16132",
    description: "Salah satu UMKM batik terkemuka di Bogor yang melestarikan motif batik khas Bogor",
    storeName: "Batik Tradisiku",
    storeAddress: "Jl. Neglasari I No.2, RT.01/RW.04, Cikaret, Kec. Bogor Sel., Kota Bogor, Jawa Barat 16132",
    storeDescription: "Ini adalah salah satu UMKM batik terkemuka di Bogor. Mereka mendedikasikan diri untuk melestarikan dan mengembangkan motif batik khas Bogor (seperti motif Kujang, Rusa, dan Hujan). Mereka menawarkan kain batik, kemeja, dan pakaian jadi lainnya dengan kualitas premium."
  },
  {
    name: "Galeri Dekranasda Kota Bogor",
    email: "galeridekranasda@gmail.com",
    phone: "(0251) 8387000",
    address: "Jl. Bina Marga No.1D, RT.04/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor",
    description: "Galeri yang menaungi banyak UMKM pengrajin dengan fokus kerajinan tangan khas Bogor",
    storeName: "Galeri Dekranasda Kota Bogor",
    storeAddress: "Jl. Bina Marga No.1D, RT.04/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor",
    storeDescription: "Ini bukan satu UMKM, tapi galeri yang menaungi banyak UMKM pengrajin. Fokusnya adalah kerajinan tangan khas Bogor, terutama miniatur Tugu Kujang yang ikonik (terbuat dari kayu, logam, fiber). Tempat ini juga menjual kerajinan anyaman, fashion, dan produk lokal lainnya."
  },
  {
    name: "Unchal Kaos Bogor",
    email: "unchalkaosbogor@gmail.com",
    phone: "0818-0293-6161",
    address: "Jl. Pajajaran No.1, RT.01/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor",
    description: "UMKM yang memproduksi kaos sebagai oleh-oleh dengan desain kreatif dan modern",
    storeName: "Unchal Kaos Bogor",
    storeAddress: "Jl. Pajajaran No.1, RT.01/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor",
    storeDescription: "\"Unchal\" berarti \"Kijang\" dalam bahasa Sunda, yang merupakan simbol Kota Bogor. UMKM ini memproduksi kaos (T-shirt) sebagai oleh-oleh dengan desain yang kreatif, modern, dan tidak pasaran, berfokus pada ikon-ikon Bogor (Kujang, Rusa, Kebun Raya) dengan gaya desain yang lebih stylish."
  },
  {
    name: "Bir Kotjok Si Abah",
    email: "birkotjoksiabah@gmail.com",
    phone: "0818-751-646",
    address: "Jl. Suryakencana No.291, RT.02/RW.06, Gudang, Kecamatan Bogor Tengah, Kota Bogor",
    description: "UMKM minuman legendaris dan unik di area Suryakencana, 100% non-alkohol",
    storeName: "Bir Kotjok Si Abah",
    storeAddress: "Jl. Suryakencana No.291, RT.02/RW.06, Gudang, Kecamatan Bogor Tengah, Kota Bogor",
    storeDescription: "Sebuah UMKM minuman legendaris dan unik di area Suryakencana. Penting dicatat, ini 100% non-alkohol. \"Bir Kotjok\" adalah minuman tradisional Bogor yang terbuat dari jahe, kayu manis, cengkeh, dan rempah-rempah lain yang \"dikocok\" hingga berbusa. Minuman ini menyehatkan, menghangatkan, dan sangat khas."
  }
];

async function createUMKMAccounts() {
  try {
    // Read existing users
    const users = await readFile(DATA_FILE, 'utf-8').then(data => JSON.parse(data)).catch(() => []);
    
    // Hash password for 123123
    const defaultPassword = await bcrypt.hash('123123', 10);
    
    // Check which UMKM already exist
    const existingEmails = new Set(users.map(u => u.email));
    
    const newUMKM = umkmList
      .filter(umkm => !existingEmails.has(umkm.email))
      .map(umkm => ({
        id: uuidv4(),
        name: umkm.name,
        email: umkm.email,
        password: defaultPassword,
        role: 'umkm',
        phone: umkm.phone,
        address: umkm.address,
        description: umkm.description,
        status: 'active',
        isVerified: true,
        isOnboarded: true,
        joinDate: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        storeName: umkm.storeName,
        storeAddress: umkm.storeAddress,
        storeDescription: umkm.storeDescription
      }));
    
    if (newUMKM.length > 0) {
      users.push(...newUMKM);
      await writeFile(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
      console.log(`✅ Berhasil menambahkan ${newUMKM.length} akun UMKM baru`);
      console.log('📧 Email UMKM yang ditambahkan:');
      newUMKM.forEach(umkm => {
        console.log(`   - ${umkm.email} (Password: 123123)`);
      });
    } else {
      console.log('ℹ️  Semua UMKM sudah terdaftar');
    }
    
    // Show all UMKM accounts
    const allUMKM = users.filter(u => u.role === 'umkm');
    console.log(`\n📊 Total UMKM terdaftar: ${allUMKM.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createUMKMAccounts();

