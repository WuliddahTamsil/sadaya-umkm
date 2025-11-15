import { useState } from "react";
import { Button } from "./ui/button";
import { Store, Bike, FileText, ShoppingBag, TrendingUp, CheckCircle, MapPin } from "lucide-react";

export function RegistrationFlowSection() {
  const [activeTab, setActiveTab] = useState<"umkm" | "driver">("umkm");

  const umkmSteps = [
    {
      icon: FileText,
      title: "1. Daftar sebagai UMKM Lokal",
      description: "Upload dokumen pendukung seperti Foto KTP, Foto tempat usaha, dan informasi bisnis lainnya untuk memulai proses verifikasi."
    },
    {
      icon: Store,
      title: "2. Buat Toko Online Sendiri",
      description: "Setelah diverifikasi, Anda dapat membuat toko online dengan mudah. Upload foto produk, atur harga jual, dan kelola stok produk Anda."
    },
    {
      icon: ShoppingBag,
      title: "3. Terima Pesanan & Pembayaran",
      description: "Sistem akan mengirimkan notifikasi otomatis ke penjual setiap ada pesanan baru. Dana dari pembayaran akan ditransfer otomatis ke akun Anda."
    },
    {
      icon: TrendingUp,
      title: "4. Keuntungan & Tujuan Sistem",
      description: "Platform ini mempermudah UMKM menjangkau lebih banyak pelanggan dengan transaksi yang aman dan terpercaya."
    }
  ];

  const driverSteps = [
    {
      icon: FileText,
      title: "1. Syarat Pendaftaran Driver",
      description: "Siapkan dokumen: Foto KTP asli dan SIM C aktif, STNK kendaraan, serta Foto diri dan kendaraan yang akan digunakan."
    },
    {
      icon: CheckCircle,
      title: "2. Cara Daftar",
      description: "Isi formulir pendaftaran dengan lengkap dan upload semua dokumen yang diperlukan. Tunggu proses verifikasi selama 1x24 jam."
    },
    {
      icon: MapPin,
      title: "3. Sistem Kerja & Pembayaran",
      description: "Setelah disetujui, Anda akan mendapat notifikasi order melalui aplikasi. Upah pengantaran akan otomatis masuk ke dompet digital Anda setelah pengantaran selesai."
    },
    {
      icon: Bike,
      title: "4. Keuntungan Jadi Driver Asli Bogor",
      description: "Kerja dengan waktu fleksibel sesuai keinginan Anda. Pendapatan transparan dengan sistem perhitungan yang jelas dan adil."
    }
  ];

  const steps = activeTab === "umkm" ? umkmSteps : driverSteps;

  return (
    <section id="alur" className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 style={{ color: '#2F4858' }} className="mb-4">
            Alur Mau Join Dengan Kami
          </h2>
          <p style={{ color: '#858585' }} className="mb-8">
            Mau jadi UMKM atau Driver?
          </p>

          {/* Toggle Buttons */}
          <div className="inline-flex rounded-lg border" style={{ borderColor: '#CCCCCC' }}>
            <Button
              onClick={() => setActiveTab("umkm")}
              variant={activeTab === "umkm" ? "default" : "ghost"}
              style={
                activeTab === "umkm"
                  ? { backgroundColor: '#FF8D28', color: '#FFFFFF' }
                  : { color: '#2F4858' }
              }
              className="body-3 rounded-r-none"
            >
              Saya UMKM
            </Button>
            <Button
              onClick={() => setActiveTab("driver")}
              variant={activeTab === "driver" ? "default" : "ghost"}
              style={
                activeTab === "driver"
                  ? { backgroundColor: '#FF8D28', color: '#FFFFFF' }
                  : { color: '#2F4858' }
              }
              className="body-3 rounded-l-none"
            >
              Saya Driver
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h3 style={{ color: '#2F4858' }}>
              {activeTab === "umkm" ? "Sistem & Alur Asli Bogor" : "Daftar Sebagai Driver Asli Bogor"}
            </h3>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  style={{ borderColor: '#CCCCCC' }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: '#FDE08E' }}
                  >
                    <Icon size={24} style={{ color: '#FF8D28' }} />
                  </div>
                  <h4 style={{ color: '#2F4858' }} className="mb-3">
                    {step.title}
                  </h4>
                  <p className="body-3" style={{ color: '#4A4A4A' }}>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button 
              style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
              className="px-8 py-6"
            >
              {activeTab === "umkm" ? "Daftar Sebagai UMKM" : "Daftar Sebagai Driver"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
