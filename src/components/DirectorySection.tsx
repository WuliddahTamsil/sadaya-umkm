import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Search, MapPin, Star, ChevronLeft, ChevronRight, Sparkles, Store, TrendingUp, Users, Award } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface UMKMItem {
  id: number;
  name: string;
  category: string;
  address: string;
  image: string;
  description: string;
  rating?: number;
  about?: string;
  phone?: string;
  operatingHours?: string;
  mapsLink?: string;
}

export const umkmData: UMKMItem[] = [
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

export const categories = ["Semua", "Makanan", "Minuman", "Jasa", "Kerajinan"] as const;

// Helper function to ensure HD image quality
const getHDImageUrl = (url: string): string => {
  if (!url) return url;
  // If it's an external URL, try to add quality parameters if supported
  // For now, return as-is since most URLs already have quality settings
  return url;
};

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
    <section id="direktori" className="pb-16 lg:pb-24 relative overflow-hidden" style={{ paddingTop: '100px' }}>
      {/* Background with gradient */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FEF5E7 100%)'
        }}
      />
      
      {/* Animated decorative elements */}
      <motion.div 
        className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-10 blur-3xl" 
        style={{ background: '#9370DB' }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-10 blur-3xl" 
        style={{ background: '#9ACD32' }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, 20, 0],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full opacity-5 blur-3xl transform -translate-x-1/2 -translate-y-1/2" 
        style={{ background: '#2196F3' }}
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Sparkles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        >
          <Sparkles size={16 + Math.random() * 8} style={{ color: '#9ACD32', opacity: 0.6 }} />
        </motion.div>
      ))}
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10" style={{ paddingTop: '20px' }}>
        {/* Title Section - Enhanced */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
              style={{ background: 'linear-gradient(135deg, #9370DB 0%, #B4A7D6 100%)' }}
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <Store size={32} className="text-white" />
            </motion.div>
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl"
              style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' }}
              whileHover={{ scale: 1.2, rotate: -360 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <TrendingUp size={32} className="text-white" />
            </motion.div>
          </motion.div>

          <motion.h1 
            className="text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: '#2F4858' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Direktori UMKM
          </motion.h1>
          <motion.p 
            className="text-xl lg:text-2xl mb-8 font-semibold" 
            style={{ color: '#4A4A4A' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Temukan UMKM Lokal Terbaik
          </motion.p>
          <motion.p 
            className="text-lg" 
            style={{ color: '#858585', maxWidth: '800px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Jelajahi berbagai produk dan jasa dari UMKM terbaik di Bogor dengan kualitas premium
          </motion.p>
        </motion.div>

        {/* Quick Stats - New */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {[
            { icon: Store, value: "500+", label: "UMKM", color: "#F99912" },
            { icon: Users, value: "10K+", label: "Pengguna", color: "#9ACD32" },
            { icon: TrendingUp, value: "50+", label: "Driver", color: "#2196F3" },
            { icon: Award, value: "4.8", label: "Rating", color: "#9370DB" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border-2 border-orange-100 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5, type: "spring" }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div 
                  className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}CC 100%)` }}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </h3>
                <p className="text-xs font-medium" style={{ color: '#4A4A4A' }}>
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Search Bar - Premium Design */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div className="relative group">
            {/* Decorative background */}
            <div 
              className="absolute -inset-1 rounded-3xl opacity-75 blur-xl transition duration-300 group-hover:opacity-100"
              style={{ 
                background: 'linear-gradient(135deg, #9370DB 0%, #9ACD32 50%, #9ACD32 100%)'
              }}
            />
            
            {/* Search container */}
              <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-transparent group-hover:border-[#F99912]/30 transition-all">
              <div className="flex items-center gap-4 p-2">
                {/* Search icon */}
                <div 
                  className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ml-2"
                  style={{ 
                    background: 'linear-gradient(135deg, #9370DB 0%, #B4A7D6 100%)'
                  }}
                >
                  <Search className="text-white" size={24} />
                </div>
                
                {/* Input */}
                <Input
                  placeholder="Cari UMKM berdasarkan nama, kategori, atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="flex-1 border-0 focus:ring-0 text-base py-6 px-0 bg-transparent"
                  style={{ 
                    color: '#2F4858',
                    fontSize: '16px'
                  }}
                />
                
                {/* Search button */}
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-6 py-3 rounded-xl font-semibold text-sm mr-2"
                    style={{ 
                      background: 'linear-gradient(135deg, #9370DB 0%, #B4A7D6 100%)',
                      color: '#FFFFFF'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cari
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Buttons - Premium Design */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {categories.map((category, index) => {
            const getCategoryGradient = (cat: string) => {
              switch(cat) {
                case 'Semua':
                  return 'linear-gradient(135deg, #9370DB 0%, #9ACD32 100%)';
                case 'Makanan':
                  return 'linear-gradient(135deg, #9370DB 0%, #9ACD32 100%)';
                case 'Minuman':
                  return 'linear-gradient(135deg, #9ACD32 0%, #9370DB 100%)';
                case 'Jasa':
                  return 'linear-gradient(135deg, #9370DB 0%, #9ACD32 100%)';
                case 'Kerajinan':
                  return 'linear-gradient(135deg, #9370DB 0%, #9ACD32 100%)';
                default:
                  return 'linear-gradient(135deg, #9370DB 0%, #9ACD32 100%)';
              }
            };
            
            return (
              <motion.button
                key={category}
                onClick={() => handleCategoryChange(category)}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.3, type: "spring", stiffness: 300 }}
                className={`relative px-8 py-4 rounded-2xl font-bold text-sm transition-all overflow-hidden ${
                  activeCategory === category ? 'shadow-2xl' : 'shadow-lg hover:shadow-xl'
                }`}
                style={
                  activeCategory === category
                    ? { 
                        background: getCategoryGradient(category), 
                        color: '#FFFFFF', 
                        border: 'none',
                        boxShadow: '0 8px 25px rgba(255, 141, 40, 0.5)',
                        transform: 'scale(1.05)'
                      }
                    : { 
                        backgroundColor: '#FFFFFF', 
                        borderColor: '#FFE5CC', 
                        borderWidth: '2px',
                        color: '#2F4858',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                      }
                }
              >
                {/* Shine effect for active */}
                {activeCategory === category && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "linear"
                    }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* UMKM Grid - Enhanced Design */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-10">
          {currentUMKM.map((umkm, index) => (
            <motion.div
              key={umkm.id}
              initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -12, 
                scale: 1.02,
                rotateY: 2,
                transition: { duration: 0.3 }
              }}
            >
              <Card 
                className="overflow-hidden cursor-pointer border-2 border-gray-100 hover:border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white group relative"
                onClick={() => onSelectUMKM(umkm)}
                style={{ borderRadius: '20px' }}
              >
                <div className="relative overflow-hidden">
                  {/* Image with HD quality */}
                  <div className="relative h-64 lg:h-72 overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={getHDImageUrl(umkm.image)}
                      alt={umkm.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      style={{ 
                        imageRendering: 'high-quality',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        minHeight: '256px'
                      }}
                      loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                  
                  {/* Category Badge - Top Left */}
                  <div 
                    className="absolute top-4 left-4 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm"
                    style={{ 
                      background: umkm.category === 'Makanan' 
                        ? 'linear-gradient(135deg, rgba(255, 141, 40, 0.95) 0%, rgba(255, 184, 77, 0.95) 100%)' :
                        umkm.category === 'Minuman' 
                        ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.95) 0%, rgba(46, 125, 50, 0.95) 100%)' :
                        umkm.category === 'Kerajinan'
                        ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.95) 0%, rgba(25, 118, 210, 0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 184, 77, 0.95) 0%, rgba(255, 141, 40, 0.95) 100%)'
                    }}
                  >
                    <span className="text-xs font-bold text-white">{umkm.category}</span>
                  </div>
                  
                  {/* Rating Badge - Top Right */}
                  <div 
                    className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center space-x-1 shadow-lg"
                  >
                    <Star size={16} className="text-yellow-500 fill-current" />
                    <span className="text-sm font-bold" style={{ color: '#2F4858' }}>4.8</span>
                  </div>
                </div>
                
                <CardContent className="p-6 relative z-10">
                  {/* UMKM Name */}
                  <motion.h4 
                    style={{ 
                      color: '#2F4858',
                      fontSize: '20px',
                      fontWeight: 700,
                      lineHeight: 1.3
                    }} 
                    className="mb-3 group-hover:text-[#9370DB] transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {umkm.name}
                  </motion.h4>
                  
                  {/* Description */}
                  <p 
                    className="text-sm mb-4 line-clamp-2" 
                    style={{ 
                      color: '#4A4A4A',
                      lineHeight: 1.5
                    }}
                  >
                    {umkm.description}
                  </p>
                  
                  {/* Address */}
                  <div className="flex items-start gap-2 pt-3 border-t" style={{ borderColor: '#D7BDE2' }}>
                    <MapPin size={18} style={{ color: '#9370DB' }} className="mt-0.5 flex-shrink-0" />
                    <p className="text-sm line-clamp-2" style={{ color: '#858585' }}>
                      {umkm.address}
                    </p>
                  </div>
                  
                  {/* View Button - Appears on Hover */}
                  <motion.div 
                    className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    <motion.div 
                      className="w-full py-2.5 rounded-xl text-center font-semibold text-sm cursor-pointer"
                      style={{ 
                        background: 'linear-gradient(135deg, #9370DB 0%, #B4A7D6 100%)',
                        color: '#FFFFFF'
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Lihat Detail →
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls - Enhanced */}
        {filteredUMKM.length > itemsPerPage && (
          <motion.div 
            className="flex items-center justify-center gap-4 mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
              style={{
                borderColor: currentPage === 1 ? '#E0E0E0' : '#9370DB',
                borderWidth: '2px',
                color: currentPage === 1 ? '#858585' : '#9370DB',
                backgroundColor: currentPage === 1 ? '#F5F5F5' : '#FFFFFF',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              <ChevronLeft size={20} />
              <span>Sebelumnya</span>
            </Button>
            
            <div 
              className="px-6 py-3 rounded-xl"
              style={{ 
                backgroundColor: '#E8DAEF',
                border: '2px solid #D7BDE2'
              }}
            >
              <span className="text-sm font-semibold" style={{ color: '#2F4858' }}>
                Halaman <span style={{ color: '#9370DB' }}>{currentPage}</span> dari {totalPages}
              </span>
            </div>

            <Button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
              style={{
                borderColor: currentPage === totalPages ? '#E0E0E0' : '#9370DB',
                borderWidth: '2px',
                color: currentPage === totalPages ? '#858585' : '#9370DB',
                backgroundColor: currentPage === totalPages ? '#F5F5F5' : '#FFFFFF',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              <span>Selanjutnya</span>
              <ChevronRight size={20} />
            </Button>
          </motion.div>
        )}

        {filteredUMKM.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="inline-block p-6 rounded-2xl mb-4"
              style={{ backgroundColor: '#E8DAEF' }}
            >
              <Search size={48} style={{ color: '#9370DB' }} />
            </div>
            <h3 style={{ color: '#2F4858', fontSize: '24px', fontWeight: 600 }} className="mb-2">
              Tidak ada UMKM yang ditemukan
            </h3>
            <p style={{ color: '#858585', fontSize: '16px' }}>
              Coba gunakan kata kunci lain atau pilih kategori yang berbeda
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
