import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Search, MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface UMKMItem {
  id: number;
  name: string;
  category: string;
  address: string;
  image: string;
  description: string;
  about?: string;
  phone?: string;
  operatingHours?: string;
  mapsLink?: string;
}

const umkmData: UMKMItem[] = [
  {
    id: 1,
    name: "Lapis Bogor Sangkuriang",
    category: "Makanan",
    address: "Jl. Pajajaran No.20i, RT.01/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143",
    image: "https://agrinesia.co.id/uploads/2024-07/jfzaH33tlscoG2xPGHd8ykIuUGsU3zTo5NrCzWX4.jpeg",
    description: "Pelopor dan pencetus pertama bolu lapis yang menggunakan bahan dasar talas",
    about: "Berdiri sejak tahun 2011, Lapis Bogor Sangkuriang merupakan pelopor dan pencetus pertama bolu lapis yang menggunakan bahan dasar talas. Dikenal dengan teksturnya yang lembut dan topping keju yang melimpah, Lapis Sangkuriang terus berinovasi untuk memberikan oleh-oleh khas Bogor terbaik.",
    phone: "(0251) 1500262",
    operatingHours: "Setiap Hari, 06.00 - 22.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Lapis+Bogor+Sangkuriang"
  },
  {
    id: 2,
    name: "Roti Unyil Venus",
    category: "Makanan",
    address: "Ruko V-Point, Jl. Pajajaran No.1, RT.01/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
    image: "https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/87ea29fa-9cf9-4c78-874a-a843af6c2747_Go-Biz_20230807_104930.jpeg",
    description: "Produsen 'Roti Unyil' legendaris di Bogor dengan ukuran kecil dan puluhan varian rasa",
    about: "Venus Bakery adalah produsen \"Roti Unyil\" yang legendaris di Bogor. Disebut roti unyil karena ukurannya yang kecil dan bisa dinikmati sekali lahap. Produknya selalu dibuat fresh setiap hari tanpa menggunakan bahan pengawet dan menawarkan puluhan varian rasa, dari asin (sosis, keju) hingga manis (cokelat, kismis).",
    phone: "0878-7880-5735",
    operatingHours: "Setiap Hari, 05.30 - 21.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Roti+Unyil+Venus+Bogor"
  },
  {
    id: 3,
    name: "Asinan Sedap Gedung Dalam",
    category: "Makanan",
    address: "Jl. Siliwangi No.27C, RT.01/RW.01, Sukasari, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16142",
    image: "https://assets.pikiran-rakyat.com/crop/0x0:0x0/750x500/photo/2022/06/27/903345014.jpg",
    description: "Salah satu gerai asinan paling legendaris dan tertua di Bogor, berdiri sejak 1978",
    about: "Salah satu gerai asinan paling legendaris dan tertua di Bogor, berdiri sejak 1978. Terkenal dengan asinan sayur dan asinan buahnya yang menggunakan bahan-bahan segar, kuah cuka yang khas (pedas, asam, manis), dan taburan kacang yang melimpah.",
    phone: "(0251) 8313099",
    operatingHours: "Setiap Hari, 07.00 - 20.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Asinan+Sedap+Gedung+Dalam"
  },
  {
    id: 4,
    name: "PIA Apple Pie",
    category: "Makanan",
    address: "Jl. Pangrango No.10, RT.04/RW.04, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
    image: "https://s3.us-east-1.wasabisys.com/agendaindonesia/2022/10/Pie-Apple-Pie-Bogor.jpg",
    description: "Toko pie terkenal di Bogor dengan apple pie yang renyah di luar dan lembut di dalam",
    about: "Toko pie yang sangat terkenal di Bogor dengan suasana tempat yang unik dan homey. Sesuai namanya, produk andalan mereka adalah apple pie (pai apel) yang renyah di luar dan lembut di dalam. Mereka juga menyediakan varian pie lain seperti stroberi, keju, dan pie gurih (ayam).",
    phone: "(0251) 8324169",
    operatingHours: "Senin-Jumat (07.00-20.00 WIB), Sabtu-Minggu (07.00-22.00 WIB)",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=PIA+Apple+Pie+Bogor"
  },
  {
    id: 5,
    name: "Bika Bogor Talubi",
    category: "Makanan",
    address: "Jl. Pajajaran No.20M, RT.01/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvrRS7rbZ9JBrHa85YQJgvl8ZW3uYsmoWwwCEvM_-L1en-5d5g6Oa6akl07FmbHbHnlzJPQ0GQPtA0ny44_7b7TazCgvtOneEj3hVZAf27KM28PPC1_t_B0GSyJ0hgM8CjwxYZS9zqeda7/s1600/20170103_165122_wm.jpg",
    description: "Inovasi oleh-oleh khas Bogor yang mengolah talas menjadi kue bika ambon",
    about: "Sebuah inovasi oleh-oleh khas Bogor yang mengolah talas menjadi kue bika ambon. Bika Bogor Talubi terkenal dengan teksturnya yang lembut, kenyal, dan memiliki aroma yang khas. Selain rasa original talas, tersedia juga varian rasa lain seperti Ubi Ungu, Nangka, dan Pandan.",
    phone: "(0251) 8338788",
    operatingHours: "Setiap Hari, 07.00 - 21.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Bika+Bogor+Talubi"
  },
  {
    id: 6,
    name: "Macaroni Panggang (MP)",
    category: "Makanan",
    address: "Jl. Salak No.24, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
    image: "https://images.tokopedia.net/img/cache/700/hDjmkQ/2025/4/18/856dcaaf-3fe4-4d7c-8a4b-095d0240b5e8.jpg",
    description: "UMKM legendaris di Bogor yang terkenal dengan makaroni skotel panggangnya",
    about: "Sebuah UMKM legendaris di Bogor yang terkenal dengan makaroni skotel panggangnya. Disajikan dalam cup aluminium foil, MP menawarkan makaroni panggang dengan isian keju, sosis, dan daging yang melimpah. Tempatnya juga cozy dan menjual aneka kue lain seperti pastries dan cookies.",
    phone: "(0251) 8324042",
    operatingHours: "Setiap Hari, 07.00 - 20.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Macaroni+Panggang+MP+Bogor"
  },
  {
    id: 7,
    name: "Jumbo Bakery (Pusat Strudel Bogor)",
    category: "Makanan",
    address: "Jl. Pajajaran No.3F, RT.02/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
    image: "https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/04075e47-6f71-4651-9a9c-b6941fb19e34.jpg",
    description: "Pelopor oleh-oleh Strudel khas Bogor dengan isian unik khas lokal",
    about: "Jumbo (akronim dari Jumpa Bogor) adalah pelopor oleh-oleh Strudel khas Bogor. Berbeda dari strudel biasa, Jumbo menawarkan isian unik khas lokal seperti talas, asinan, dan apel, yang dibalut dengan pastry renyah. Toko ini juga berfungsi sebagai pusat oleh-oleh lengkap yang menjual produk UMKM lain.",
    phone: "(0251) 8327456",
    operatingHours: "Setiap Hari, 06.00 - 21.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Jumbo+Bakery+Strudel+Bogor"
  },
  {
    id: 8,
    name: "Chocomory",
    category: "Makanan",
    address: "Jl. Raya Puncak - Gadog No.KM 77, Leuwimalang, Kec. Cisarua, Kabupaten Bogor, Jawa Barat 16770",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv5k0yCBRIKBB54hyFV80oTeLacCSN-1m1lQ&s",
    description: "Brand UMKM di bawah Cimory Group yang berfokus pada olahan cokelat premium",
    about: "Chocomory adalah brand UMKM di bawah Cimory Group yang berfokus pada olahan cokelat premium. Berlokasi di dalam destinasi wisata Cimory (seperti Riverside atau Dairyland), Chocomory terkenal dengan produk andalannya seperti \"Moo Moo Roll\" (bolu gulung), \"Choc-O-Bag\", dan aneka yogurt serta produk susu segar.",
    phone: "(0251) 8252935",
    operatingHours: "Setiap Hari, 08.00 - 21.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Cimory+Riverside+Bogor"
  },
  {
    id: 9,
    name: "Kacang Bogor Istana",
    category: "Makanan",
    address: "Dijual di banyak pusat oleh-oleh, contoh: Priangansari, Jl. Raya Puncak - Gadog No.45, Ciawi, Kabupaten Bogor",
    image: "https://blog-images.reddoorz.com/uploads/image/file/1852/kacang-bogor.jpg",
    description: "UMKM yang mempopulerkan kacang bogor (kacang tanah ungu) sebagai oleh-oleh modern",
    about: "Kacang Bogor Istana adalah UMKM yang mempopulerkan kacang bogor (kacang tanah ungu) sebagai oleh-oleh modern. Produk ini mengolah kacang bogor menjadi camilan renyah dan gurih yang dikemas secara premium, membuatnya lebih awet dan praktis untuk dibawa sebagai buah tangan.",
    phone: "N/A (Tergantung toko distributor)",
    operatingHours: "Mengikuti jam toko (07.00 - 21.00 WIB)",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Priangansari+Ciawi+Bogor"
  },
  {
    id: 10,
    name: "Bogor Raincake",
    category: "Makanan",
    address: "Jl. Pajajaran No.31, RT.02/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
    image: "https://s3-ap-southeast-1.amazonaws.com/paxelbucket/revamp/upload-image-TOG6QXP-24JW2ON-QBJ8RTM-RRWK0P2.jpg",
    description: "Pelopor kue oleh-oleh kekinian di Bogor dengan bolu lembut dan lapisan crispy pastry",
    about: "Bogor Raincake adalah salah satu pelopor kue oleh-oleh kekinian di Bogor. Produk utamanya adalah kue bolu lembut dengan berbagai isian filling premium dan lapisan crispy pastry di bagian bawahnya, menciptakan perpaduan tekstur yang unik.",
    phone: "0811-1172-250",
    operatingHours: "Setiap Hari, 07.00 - 21.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Bogor+Raincake"
  },
  {
    id: 11,
    name: "Rumah Talas Bogor",
    category: "Makanan",
    address: "Jl. Raya Pajajaran No.98, Bantarjati, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16153",
    image: "https://bimamedia-gurusiana.ap-south-1.linodeobjects.com/2be96323449fc62048a56a72fb6b8628/2020/02/19/l-img2020021818202134ef5a0b591cc85a04e0f97a7e5318cf20200219060715-bimacms.jpg",
    description: "UMKM yang mendedikasikan diri untuk mengolah Talas Bogor menjadi berbagai macam produk",
    about: "UMKM ini mendedikasikan diri untuk mengolah Talas Bogor menjadi berbagai macam produk, tidak hanya lapis. Mereka menawarkan bolu talas, cookies talas, hingga keripik talas. Menjadi salah satu \"one-stop-shopping\" untuk oleh-oleh berbahan dasar talas.",
    phone: "0812-9492-4112",
    operatingHours: "Setiap Hari, 07.00 - 21.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Rumah+Talas+Bogor"
  },
  {
    id: 12,
    name: "Miss Pumpkin",
    category: "Makanan",
    address: "Jl. Pajajaran No.43, RT.03/RW.10, Bantarjati, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16153",
    image: "https://carica.id/wp-content/uploads/2022/01/Miss-Pumpkin.jpg",
    description: "UMKM inovatif yang fokus mengolah labu kuning (pumpkin) menjadi oleh-oleh khas",
    about: "Miss Pumpkin adalah UMKM inovatif yang fokus mengolah labu kuning (pumpkin) menjadi oleh-oleh khas. Produk andalannya adalah bolu labu parang yang lembut, legit, dan memiliki aroma khas. Mereka juga mengembangkan varian lain seperti brownies dan cookies labu.",
    phone: "(0251) 8320134",
    operatingHours: "Setiap Hari, 08.00 - 20.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Miss+Pumpkin+Bogor"
  },
  {
    id: 13,
    name: "Brownies Pisang Citarasa",
    category: "Makanan",
    address: "Toko Oleh-Oleh Citarasa, Jl. Raya Puncak - Gadog, Ciawi, Bogor",
    image: "https://makassarkuliner.com/wp-content/uploads/2017/06/browcyl1.jpg",
    description: "UMKM yang berfokus pada olahan brownies yang unik menggunakan pisang sebagai bahan utama",
    about: "UMKM ini berfokus pada olahan brownies yang unik, yaitu menggunakan pisang sebagai bahan utama yang memberikan tekstur lebih lembab dan aroma wangi. Ini adalah oleh-oleh populer bagi mereka yang mencari variasi dari brownies cokelat biasa.",
    phone: "(0251) 8246049",
    operatingHours: "Setiap Hari, 08.00 - 21.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Toko+Citarasa+Ciawi+Bogor"
  },
  {
    id: 14,
    name: "Mochi Mochi 'Mochilaku'",
    category: "Makanan",
    address: "Ruko Villa Indah Pajajaran, Jl. Pajajaran No.18, RT.02/RW.11, Bantarjati, Kec. Bogor Utara, Kota Bogor",
    image: "https://filebroker-cdn.lazada.co.id/kf/S7db12f2e36d6414cac2b6e1a979c16d0S.jpg",
    description: "UMKM yang berfokus pada mochi sebagai oleh-oleh dengan tekstur super lembut dan isian premium",
    about: "UMKM yang berfokus pada mochi sebagai oleh-oleh. Mochilaku dikenal dengan tekstur mochi yang super lembut dan isian premium. Berbeda dari mochi biasa, mereka menawarkan varian modern seperti es krim mochi dan mochi dengan isian kekinian (cth: cokelat lumer, green tea).",
    phone: "0812-9010-8209",
    operatingHours: "Setiap Hari, 09.00 - 20.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Mochilaku+Bogor"
  },
  {
    id: 15,
    name: "Priangansari",
    category: "Makanan",
    address: "Jl. Raya Puncak - Gadog No.45, Ciawi, Kec. Ciawi, Kabupaten Bogor, Jawa Barat 16720",
    image: "https://priangansari.co.id/wp-content/uploads/2022/01/choose-1-v1.jpg",
    description: "Pusat Oleh-Oleh yang sangat besar dan lengkap, mengumpulkan berbagai produk UMKM Bogor",
    about: "Priangansari bukanlah produsen tunggal, melainkan Pusat Oleh-Oleh (UMKM) yang sangat besar dan lengkap. Tempat ini mengumpulkan berbagai produk UMKM Bogor di satu lokasi, mulai dari Lapis Talas, Roti Unyil, Kacang Bogor Istana, hingga keripik dan asinan. Ini adalah \"one-stop solution\" bagi wisatawan.",
    phone: "(0251) 8243157",
    operatingHours: "Setiap Hari, 07.00 - 21.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Priangansari+Ciawi+Bogor"
  },
  {
    id: 16,
    name: "Kopi Halimun",
    category: "Minuman",
    address: "Jl. Malabar No.23, RT.04/RW.07, Tegal Gundil, Kec. Bogor Utara, Kota Bogor",
    image: "https://asset.kompas.com/crops/FTrB76Sig9aY6i2PzEwixEdJWgs=/12x0:962x633/1200x800/data/photo/2023/07/10/64ab9d8c2c311.jpg",
    description: "UMKM yang berfokus pada promosi dan penjualan kopi robusta dan arabika asli dari petani lokal Bogor",
    about: "UMKM ini berfokus pada promosi dan penjualan kopi robusta dan arabika asli dari petani lokal di Bogor, khususnya dari lereng Gunung Halimun. Mereka menjual biji kopi, kopi bubuk, dan seringkali memiliki kedai kecil untuk ngopi di tempat, sekaligus sebagai etalase edukasi kopi Bogor.",
    phone: "0812-8899-1101",
    operatingHours: "Setiap Hari, 08.00 - 21.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Kopi+Halimun+Bogor"
  },
  {
    id: 17,
    name: "Batik Tradisiku",
    category: "Kerajinan",
    address: "Jl. Neglasari I No.2, RT.01/RW.04, Cikaret, Kec. Bogor Sel., Kota Bogor, Jawa Barat 16132",
    image: "https://www.batiklopedia.com/wp-content/uploads/2024/10/IMG_1984-OK-1.jpg",
    description: "Salah satu UMKM batik terkemuka di Bogor yang melestarikan motif batik khas Bogor",
    about: "Ini adalah salah satu UMKM batik terkemuka di Bogor. Mereka mendedikasikan diri untuk melestarikan dan mengembangkan motif batik khas Bogor (seperti motif Kujang, Rusa, dan Hujan). Mereka menawarkan kain batik, kemeja, dan pakaian jadi lainnya dengan kualitas premium.",
    phone: "(0251) 8378010",
    operatingHours: "Senin - Sabtu (08.00 - 17.00 WIB), Minggu Tutup",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Batik+Tradisiku+Bogor"
  },
  {
    id: 18,
    name: "Galeri Dekranasda Kota Bogor",
    category: "Kerajinan",
    address: "Jl. Bina Marga No.1D, RT.04/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor",
    image: "https://static.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/p2/247/2024/08/20/Dekranasda-3804713292.jpg",
    description: "Galeri yang menaungi banyak UMKM pengrajin dengan fokus kerajinan tangan khas Bogor",
    about: "Ini bukan satu UMKM, tapi galeri yang menaungi banyak UMKM pengrajin. Fokusnya adalah kerajinan tangan khas Bogor, terutama miniatur Tugu Kujang yang ikonik (terbuat dari kayu, logam, fiber). Tempat ini juga menjual kerajinan anyaman, fashion, dan produk lokal lainnya.",
    phone: "(0251) 8387000",
    operatingHours: "Setiap Hari, 09.00 - 17.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Galeri+Dekranasda+Kota+Bogor"
  },
  {
    id: 19,
    name: "Unchal Kaos Bogor",
    category: "Kerajinan",
    address: "Jl. Pajajaran No.1, RT.01/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor",
    image: "https://static.republika.co.id/uploads/images/inpicture_slide/t-shirt-unchal-_161003090541-796.jpg",
    description: "UMKM yang memproduksi kaos sebagai oleh-oleh dengan desain kreatif dan modern",
    about: "\"Unchal\" berarti \"Kijang\" dalam bahasa Sunda, yang merupakan simbol Kota Bogor. UMKM ini memproduksi kaos (T-shirt) sebagai oleh-oleh dengan desain yang kreatif, modern, dan tidak pasaran, berfokus pada ikon-ikon Bogor (Kujang, Rusa, Kebun Raya) dengan gaya desain yang lebih stylish.",
    phone: "0818-0293-6161",
    operatingHours: "Setiap Hari, 08.00 - 20.00 WIB",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Unchal+Kaos+Bogor"
  },
  {
    id: 20,
    name: "Bir Kotjok Si Abah",
    category: "Minuman",
    address: "Jl. Suryakencana No.291, RT.02/RW.06, Gudang, Kecamatan Bogor Tengah, Kota Bogor",
    image: "https://asset.kompas.com/crops/3FtA1wiV-nJQrRFaHcCPK6xb_qM=/0x0:780x390/780x390/data/photo/2016/05/25/0137024IMG-5541780x390.jpg",
    description: "UMKM minuman legendaris dan unik di area Suryakencana, 100% non-alkohol",
    about: "Sebuah UMKM minuman legendaris dan unik di area Suryakencana. Penting dicatat, ini 100% non-alkohol. \"Bir Kotjok\" adalah minuman tradisional Bogor yang terbuat dari jahe, kayu manis, cengkeh, dan rempah-rempah lain yang \"dikocok\" hingga berbusa. Minuman ini menyehatkan, menghangatkan, dan sangat khas.",
    phone: "0818-751-646",
    operatingHours: "Setiap Hari, 09.00 - 17.00 WIB (Terkadang bisa tutup lebih cepat jika habis)",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Bir+Kotjok+Si+Abah+Bogor"
  }
];

const categories = ["Semua", "Makanan", "Minuman", "Jasa", "Kerajinan"];

interface DirectorySectionProps {
  onSelectUMKM: (umkm: UMKMItem) => void;
}

export function DirectorySection({ onSelectUMKM }: DirectorySectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredUMKM = umkmData.filter(umkm => {
    const matchesSearch = umkm.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "Semua" || umkm.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUMKM.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUMKM = filteredUMKM.slice(startIndex, endIndex);

  // Reset to page 1 when search or category changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <section id="direktori" className="py-24 lg:py-32 relative" style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, #FFF4E6 100%)' }}>
      <div className="container mx-auto px-4">
        {/* Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{ color: '#2F4858' }} className="mb-4">
            Temukan UMKM Lokal
          </h2>
          <p style={{ color: '#4A4A4A', fontSize: '18px' }}>
            Jelajahi berbagai produk dan jasa dari UMKM terbaik di Bogor
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: '#858585' }} size={20} />
            <Input
              placeholder="Cari berdasarkan nama UMKM..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-12 py-6 body-3 border-orange-200 focus:border-orange-400"
            />
          </div>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
            >
              <Button
                onClick={() => handleCategoryChange(category)}
                variant={activeCategory === category ? "default" : "outline"}
                style={
                  activeCategory === category
                    ? { background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)', color: '#FFFFFF', border: 'none' }
                    : { borderColor: '#E0E0E0', color: '#2F4858' }
                }
                className="body-3 hover-lift"
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* UMKM Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentUMKM.map((umkm, index) => (
            <motion.div
              key={umkm.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card 
                className="overflow-hidden hover-lift cursor-pointer border-2 border-transparent hover:border-orange-300 transition-all"
                onClick={() => onSelectUMKM(umkm)}
              >
                <div className="relative">
                  <ImageWithFallback
                    src={umkm.image}
                    alt={umkm.name}
                    className="w-full h-48 object-cover"
                  />
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>4.8</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div 
                    className="inline-block px-3 py-1 rounded-full mb-3" 
                    style={{ 
                      background: umkm.category === 'Makanan' ? 'linear-gradient(135deg, #FFE5CC 0%, #FFD4A3 100%)' :
                                 umkm.category === 'Minuman' ? 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)' :
                                 'linear-gradient(135deg, #FFF4E6 0%, #FFE0B2 100%)'
                    }}
                  >
                    <span className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>{umkm.category}</span>
                  </div>
                  <h4 style={{ color: '#2F4858' }} className="mb-2">
                    {umkm.name}
                  </h4>
                  <div className="flex items-start gap-2">
                    <MapPin size={16} style={{ color: '#858585' }} className="mt-1 flex-shrink-0" />
                    <p className="body-3" style={{ color: '#858585' }}>
                      {umkm.address}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        {filteredUMKM.length > itemsPerPage && (
          <motion.div 
            className="flex items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              variant="outline"
              className="flex items-center gap-2"
              style={{
                borderColor: currentPage === 1 ? '#E0E0E0' : '#FF8D28',
                color: currentPage === 1 ? '#858585' : '#2F4858',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="body-3" style={{ color: '#2F4858' }}>
                Halaman {currentPage} dari {totalPages}
              </span>
            </div>

            <Button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              variant="outline"
              className="flex items-center gap-2"
              style={{
                borderColor: currentPage === totalPages ? '#E0E0E0' : '#FF8D28',
                color: currentPage === totalPages ? '#858585' : '#2F4858',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </Button>
          </motion.div>
        )}

        {filteredUMKM.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p style={{ color: '#858585' }}>
              Tidak ada UMKM yang ditemukan. Coba kata kunci lain.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
