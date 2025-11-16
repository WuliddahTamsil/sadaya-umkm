import { Button } from "./ui/button";
import { ArrowLeft, MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Import product data function from ShopPage
// This ensures we use the same product images
const getProductsByUMKM = (umkmId: number) => {
  const productsMap: Record<number, Array<{ image: string }>> = {
    1: [ // Lapis Bogor Sangkuriang
      { image: 'https://agrinesia.co.id/uploads/2021-12/RRiADXWrufCvfF2yN4mUpnrdMnWgo1tNkqIJehsy.webp' },
      { image: 'https://agrinesia.co.id/uploads/2021-12/Eq0QR8tMAXrFYpopQikJimf5d2G3hsYuB7kyswe0.webp' },
      { image: 'https://bake.co.id/wp-content/uploads/2025/04/word-image-7552-5.png' },
      { image: 'https://lapisbogor.co.id/wp-content/uploads/2024/06/WEB-Produk-LBS-Ketan-Wangi.webp' }
    ],
    2: [ // Roti Unyil Venus
      { image: 'https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/5ee1114b-7c33-459b-bac9-be71fb2fe38c_Go-Biz_20220308_033923.jpeg?auto=format' },
      { image: 'https://img.lazcdn.com/g/ff/kf/Sb1abc7940166415b9678ffaeee3d5c8fE.jpg_720x720q80.jpg' },
      { image: 'https://ik.imagekit.io/goodid/gnfi/uploads/articles/large-451985063-1146992496376403-7425551945084217907-n-8ad6edb9947b48e00167431ebab2d40a.jpg?tr=w-449,h-252,fo-center' },
      { image: 'https://i0.wp.com/i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/bfe39da5-34ff-40f6-b08f-bafa31bb513d.jpg' }
    ],
    3: [ // Asinan Sedap Gedung Dalam
      { image: 'https://s3-ap-southeast-1.amazonaws.com/paxelbucket/revamp/upload-image-1BQ4P6I-E6RINM8-MG2EE3E-R4QAADJ.png' },
      { image: 'https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/da7d74dd-e79c-4bd9-8065-d073dba21ef1.jpg' },
      { image: 'https://asset.kompas.com/data/photo/2014/11/07/1636436manisann1780x390.jpg' },
      { image: 'https://s3-ap-southeast-1.amazonaws.com/paxelbucket/revamp/upload-image-1BQ4P6I-E6RINM8-MG2EE3E-R4QAADJ.png' }
    ],
    4: [ // PIA Apple Pie
      { image: 'https://s3.us-east-1.wasabisys.com/agendaindonesia/2022/10/Pie-Apple-Pie-Bogor.jpg' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6t-ylG1uVhiQF7Ih8G1uV1stJqCZ4RjY0Dw&s' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmWYg93IeybdBlWC6BRhYGpBQ8OQ09WHFOnegv6RsbNeSf-PO7SevZjAmkD0wfD0cq1cI&usqp=CAU' },
      { image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/22/64/d1/10/caption.jpg?w=1100&h=1100&s=1' }
    ],
    5: [ // Bika Bogor Talubi
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUowS62iaN2nLs9ndploKV9YFdUO3Oj4bs1w&s' },
      { image: 'https://evrinasp.com/wp-content/uploads/2017/01/bika-bogor-talubi-5.jpg' },
      { image: 'https://evrinasp.com/wp-content/uploads/2017/01/bika-bogor-talubi-11.jpg' },
      { image: 'https://storage.googleapis.com/paxelmarket_v3_bucket/2023/07/19/FNLOCQIAH7W6YY1K.jpg' }
    ],
    6: [ // Macaroni Panggang (MP)
      { image: 'https://static.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/p2/255/2024/11/08/2-makaroni-panggang-merupakan-kuliner-nusantara-yang-bercita-rasa-asing_-1-1245957777.jpg' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdRTbVMz8Q_rgcENl_zu1vkJzMz1tV0yCR0w&s' },
      { image: 'https://media-cdn.tripadvisor.com/media/photo-s/09/6d/1c/c3/macaroni-panggang-mp.jpg' },
      { image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiDLGtX2ETecPOJRFBIs4HCz1n2L6DK8NsUvr8SE8bvGm91D5EMJPrXHXo8MIJStNDKYtPUiTlN_D1qPhyi7OBc3oyJcoCTWpY7Q9Y0e8KT_5vDSia7ulR-l2jhOwpiWkiPxFp4s3GDEbI/s1600/macaroni-panggang.jpg' }
    ],
    7: [ // Jumbo Bakery (Pusat Strudel Bogor)
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR61Vyx-OZcxeHSHWFaORz4HUTs9Dtyfg6AzQ&s' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI3DHL1Q-2WkewIcXIfrg5wDX9AzDqzIpkWDP8nxTMAC5Apueqne7lcvEItb6c240C2pE&usqp=CAU' },
      { image: 'https://down-id.img.susercontent.com/file/04ab864484da9d4d4d2d6ed9b1366303' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQW0_w13gtsD2ItvZt6Lrq9PfNLeq_Kbeh8VjEC1eMFThH7QC8tZRmwL3x4hVCbyMG_u_8&usqp=CAU' }
    ],
    8: [ // Chocomory
      { image: 'https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/14b14d84-85c7-42a4-850b-5099fb1de594_menu-item-image_1758767722374.jpg' },
      { image: 'https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/27c8682b-5a95-45fb-bbaa-8d0a1389b189_gobiz-dashboard-image_1760692087448.jpg' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8B2bUq_C2nT7BlMcTF6jZ6YBBDx9oEed4Lg&s' },
      { image: 'https://i0.wp.com/i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/37c8dc4f-c50f-4d42-9ef9-59436d5f52fb_restaurant-image_1674038758587.jpg' }
    ],
    9: [ // Kacang Bogor Istana
      { image: 'https://cnc-magazine.oramiland.com/parenting/images/iwang.width-500.format-webp.webp' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjuol-YKj96yV2fsLHG_eMpFkNC55yGcJ62w&s' },
      { image: 'https://filebroker-cdn.lazada.co.id/kf/S56ec3607f0a547d89061b54637ca5bacn.jpg' },
      { image: 'https://filebroker-cdn.lazada.co.id/kf/Sf25bb16dc6d149908077c46aa8028da0z.jpg' }
    ],
    10: [ // Bogor Raincake
      { image: 'data:image/jpeg;base64,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' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_2XqMny_sCvhMX7cTD6BkJYVBu3NwdTGzJJAt1OB0-9DMnuNVsFcBP5Rm9pJ-uXDYTaQ&usqp=CAU' },
      { image: 'https://idntrip.com/wp-content/uploads/Bogor-Raincake.png' },
      { image: 'https://s3-ap-southeast-1.amazonaws.com/paxelbucket/revamp/upload-image-GX3JPXW-S7LT6RN-WT1AHA7-344YKBL.jpg' }
    ],
    11: [ // Rumah Talas Bogor
      { image: 'https://i0.wp.com/i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/ecf3ee05-b841-4932-b935-9af9fbdd49bf.jpg' },
      { image: 'https://img-global.cpcdn.com/recipes/ce33c8f8f2977278/680x781cq80/lapis-talas-bogor-gluten-free-foto-resep-utama.jpg' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlrpN2UGHlcy5Sqe_s0j0zN2O_wAVmg71XW91LuJW8TZS51BmxJgPaOyGp5ColQWbDMIE&usqp=CAU' },
      { image: 'https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/9d218e04-9e00-4e6b-ab07-1bbbf05ba0f8_Go-Biz_20240628_230716.jpeg' }
    ],
    12: [ // Miss Pumpkin
      { image: 'https://lovelybogor.com/wp-content/uploads/2015/06/cake-labu-kuning2b.jpg' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKp926Nefjf9aKQ3IsnjYf3SEQUY8wOl9ENg&s' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxfAKZm4H50mUNX2sau1AkF1NqdGYyyAS1clhrRHmheSO6hA_o47JxyaZUeCrcjeprb0g&usqp=CAU' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7lQnGTJ2ef6fgd3HYvMzDZY169TS5I3Jb14Btp-lSpIoRj8-gn9D21pWrAeYbbGTRedE&usqp=CAU' }
    ],
    13: [ // Brownies Pisang Citarasa
      { image: 'https://image.idn.media/post/20240306/brownies-pisang-panggang-050d7c823376e5868043b1f6ae8078e6-11b9a4a2c99059f1e0e3b10315c98081.jpg' },
      { image: 'https://static.promediateknologi.id/crop/0x0:0x0/750x500/webp/photo/p1/828/2024/02/24/IMG_20240224_193026-3617035622.jpg' },
      { image: 'https://akcdn.detik.net.id/visual/2024/06/07/ilustrasi-bolu-pisang_43.jpeg?w=720&q=90' },
      { image: 'https://cdn0-production-images-kly.akamaized.net/szcWVwIZ2R2qyv6_ElFQx12YR7c=/469x625/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3307424/original/082225200_1606360738-bolu_pisang.jpg' }
    ],
    14: [ // Mochi Mochi "Mochilaku"
      { image: 'https://images.tokopedia.net/img/cache/500-square/VqbcmM/2022/5/16/93541390-a97b-4efe-a806-554cefd0fdff.jpg' },
      { image: 'https://jid.storage.googleapis.com/wp-content/uploads/2022/03/01135627/mochi-oleh-oleh-Sukabumi.jpg' },
      { image: 'https://asset.kompas.com/crops/RKucRN_86s-ywsPR1d08875rI4w=/0x23:1000x689/1200x800/data/photo/2021/09/29/61541255e9dcb.jpg' },
      { image: 'https://img-global.cpcdn.com/recipes/c6d0dd61e4e0c6c1/1200x630cq80/photo.jpg' }
    ],
    15: [ // Priangansari
      { image: 'https://priangansari.co.id/wp-content/uploads/2022/01/choose-4-v1.jpg' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeKN_zrkHbH4HEt6GW433_633GGtTPqQE-1b3Q2ujkCkZ7VwAwXmtRVsvWapqcxxfxhOA&usqp=CAU' },
      { image: 'https://down-id.img.susercontent.com/file/id-11134207-7rask-m4sjzgiwx5omb5_tn.webp' },
      { image: 'https://down-id.img.susercontent.com/file/id-11134207-7rash-m4sgzlk1by8m34_tn.webp' }
    ],
    16: [ // Kopi Halimun
      { image: 'https://asset.kompas.com/crops/FTrB76Sig9aY6i2PzEwixEdJWgs=/12x0:962x633/1200x800/data/photo/2023/07/10/64ab9d8c2c311.jpg' },
      { image: 'https://media.rs-jih.co.id/media-rsjih/jogja/news/img_FuVZ92o.jpg' },
      { image: 'https://hikenrun.com/cdn/shop/files/f213e18d-2e0d-4ac1-a635-9dadf41e2f5e_a583dc37-973d-496c-8ae5-18810582a171.jpg?v=1717150094' },
      { image: 'https://images.tokopedia.net/blog-tokopedia-com/uploads/2019/09/kopi.jpg' }
    ],
    17: [ // Batik Tradisiku
      { image: 'https://down-id.img.susercontent.com/file/bc566d32a64abded24595676fb2af15b' },
      { image: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/MTA-7522101/batik-tradisiku_batik-tradisiku-bc-cisadane_full06.jpg' },
      { image: 'https://down-id.img.susercontent.com/file/29afac45a9ba6818faff19b6236f3a93_tn.webp' },
      { image: 'https://down-id.img.susercontent.com/file/955b24a77f2902e6f0174902f8df6260_tn.webp' }
    ],
    18: [ // Galeri Dekranasda Kota Bogor
      { image: 'https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/247/2024/08/27/Dekrasnada-1149915348.jpg' },
      { image: 'https://img.antarafoto.com/cache/1200x816/2020/12/17/galeri-pusat-kerajinan-kota-bogor-s6dg-dom.jpg' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0Hr8aifh05WTWcVfISXk350HuVEt7-T5W7OP-zvHetTcvg1s0le4ntBI43PvaFWVzYeA&usqp=CAU' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyWOhuf43moG-mMBwJGF7nmEcE7E12TyvVYizzLy7urW53Wb7swPqdNuyJSKsYdIN3b8I&usqp=CAU' }
    ],
    19: [ // Unchal Kaos Bogor
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoD-rGYQ1h2FYagC7cmkRumuO5e-YXYBLIm4jqAe91va7Nlsnl9qQ9qmL62ZUX4HB6pJ8&usqp=CAU' },
      { image: 'https://images.tokopedia.net/img/cache/700/VqbcmM/2025/2/10/c116d95d-2ff6-4e87-8395-be1d7dd82f03.png' },
      { image: 'https://filebroker-cdn.lazada.co.id/kf/S5f83c67dfb834605a8701f703dcbcd3cf.jpg' },
      { image: 'https://id-live-01.slatic.net/p/b73e848a2fdbe1949c9543cdfad7d462.jpg' }
    ],
    20: [ // Bir Kotjok Si Abah
      { image: 'https://umkmtv.com/wp-content/uploads/2023/02/BIR.png' },
      { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUKfj3thgvdgUkfzg5RDIMb3yOl9iL9KxzRzc6Hvh-rCMZeGmmGf4xdPjM1Rm50h0Q7Xw&usqp=CAU' },
      { image: 'https://asset.kompas.com/crops/1kll0VdbV1JmBIwz8xwgSzmjjK4=/0x0:0x0/1200x800/data/photo/2016/05/25/0137024IMG-5541p.jpg' },
      { image: 'https://asset-2.tribunnews.com/priangan/foto/bank/images/Bir-Kotjok-Khas-Bogor.jpg' }
    ]
  };
  return productsMap[umkmId] || [];
};

interface UMKMDetailPageProps {
  umkm: {
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
  };
  onBack: () => void;
  onStartOrder?: () => void;
}

// Function to get product images for gallery based on UMKM
// These images are specific to the products sold by each UMKM
const getProductImagesForUMKM = (umkmId: number, defaultImage: string): string[] => {
  const products = getProductsByUMKM(umkmId);
  
  // If we have product images, use them; otherwise use default images
  if (products.length > 0) {
    const productImages = products.map(p => p.image);
    // Ensure we have at least 4 images, pad with default if needed
    while (productImages.length < 4) {
      productImages.push(defaultImage);
    }
    return productImages.slice(0, 4);
  }
  
  // Fallback to default images
  return [
    defaultImage,
    'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=800&q=80',
    'https://images.unsplash.com/photo-1762592957827-99db60cfd0c7?w=800&q=80',
    'https://images.unsplash.com/photo-1575277340549-70f2441dee09?w=800&q=80'
  ];
};

export function UMKMDetailPage({ umkm, onBack, onStartOrder }: UMKMDetailPageProps) {
  // Get product-specific images for gallery based on products sold
  const galleryImages = getProductImagesForUMKM(umkm.id, umkm.image);

  // Google Maps embed URL for Bogor area
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56402638384!2d106.72782745!3d-6.595038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5d2e602b5f5%3A0x4027980f0e5c7e0!2sBogor%2C%20West%20Java%2C%20Indonesia!5e0!3m2!1sen!2s!4v1234567890";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="body-3"
            style={{ color: '#2F4858' }}
          >
            <ArrowLeft className="mr-2" size={20} />
            Kembali ke Direktori
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block px-4 py-2 rounded-full mb-4" style={{ backgroundColor: '#FDE08E' }}>
            <span className="body-3" style={{ color: '#2F4858' }}>{umkm.category}</span>
          </div>
          <h2 style={{ color: '#2F4858' }} className="mb-4">
            {umkm.name}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column: Information */}
          <div className="space-y-8">
            {/* Tentang Kami */}
            <div>
              <h3 style={{ color: '#2F4858' }} className="mb-4">
                Tentang Kami
              </h3>
              <p style={{ color: '#4A4A4A' }}>
                {umkm.about || umkm.description}
              </p>
            </div>

            {/* Informasi Kontak */}
            <div>
              <h3 style={{ color: '#2F4858' }} className="mb-4">
                Informasi Kontak
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} style={{ color: '#FF8D28' }} className="mt-1" />
                  <div>
                    <p className="body-3" style={{ color: '#858585' }}>Alamat</p>
                    <p style={{ color: '#2F4858' }}>{umkm.address}</p>
                  </div>
                </div>
                {umkm.phone && (
                  <div className="flex items-start gap-3">
                    <Phone size={20} style={{ color: '#FF8D28' }} className="mt-1" />
                    <div>
                      <p className="body-3" style={{ color: '#858585' }}>Telepon</p>
                      <p style={{ color: '#2F4858' }}>{umkm.phone}</p>
                    </div>
                  </div>
                )}
                {umkm.operatingHours && (
                  <div className="flex items-start gap-3">
                    <Clock size={20} style={{ color: '#FF8D28' }} className="mt-1" />
                    <div>
                      <p className="body-3" style={{ color: '#858585' }}>Jam Operasional</p>
                      <p style={{ color: '#2F4858' }}>{umkm.operatingHours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lokasi (Peta Interaktif - Wajib) */}
            <div>
              <h3 style={{ color: '#2F4858' }} className="mb-4">
                Lokasi
              </h3>
              <div className="w-full h-80 rounded-lg overflow-hidden border mb-4">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Peta lokasi ${umkm.name}`}
                />
              </div>
              {umkm.mapsLink && (
                <a
                  href={umkm.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm"
                  style={{ color: '#FF8D28' }}
                >
                  <ExternalLink size={16} />
                  <span>Klik di sini untuk Peta dan Galeri Foto Lengkap (Google Maps)</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Gallery and Action */}
          <div className="space-y-8">
            {/* Galeri Foto (Wajib) */}
            <div>
              <h3 style={{ color: '#2F4858' }} className="mb-4">
                Galeri Foto
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {galleryImages.map((image, index) => (
                  <ImageWithFallback
                    key={index}
                    src={image}
                    alt={`${umkm.name} foto ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
                  />
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="bg-[#F5F5F5] p-6 rounded-lg">
              <h4 style={{ color: '#2F4858' }} className="mb-3">
                Tertarik dengan produk kami?
              </h4>
              <p className="body-3 mb-6" style={{ color: '#858585' }}>
                Mulai pesan sekarang dan nikmati produk asli Bogor langsung dari toko ini!
              </p>
              <Button 
                style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
                className="w-full"
                onClick={onStartOrder}
              >
                Mulai Pesan dari Toko Ini
              </Button>
            </div>

            {/* Additional Info */}
            <div className="border rounded-lg p-6">
              <h4 style={{ color: '#2F4858' }} className="mb-4">
                Keunggulan Kami
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF8D28' }}>
                    <span className="body-3" style={{ color: '#FFFFFF' }}>✓</span>
                  </div>
                  <p className="body-3" style={{ color: '#4A4A4A' }}>
                    Produk 100% asli dan berkualitas
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF8D28' }}>
                    <span className="body-3" style={{ color: '#FFFFFF' }}>✓</span>
                  </div>
                  <p className="body-3" style={{ color: '#4A4A4A' }}>
                    Pengiriman cepat ke seluruh Bogor
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF8D28' }}>
                    <span className="body-3" style={{ color: '#FFFFFF' }}>✓</span>
                  </div>
                  <p className="body-3" style={{ color: '#4A4A4A' }}>
                    Harga bersahabat langsung dari produsen
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
