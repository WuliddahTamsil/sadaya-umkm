import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { MessageCircle, Phone, Mail, HelpCircle, Send, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

export function HelpPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  const getFAQs = () => {
    const commonFAQs = [
      {
        q: 'Bagaimana cara melakukan pemesanan?',
        a: 'Anda dapat memilih produk yang diinginkan, tambahkan ke keranjang, lalu lakukan checkout. Ikuti instruksi pembayaran yang muncul.'
      },
      {
        q: 'Metode pembayaran apa saja yang tersedia?',
        a: 'Kami menerima berbagai metode pembayaran: Transfer Bank, E-wallet (GoPay, OVO, Dana), dan COD untuk area tertentu.'
      },
      {
        q: 'Berapa lama estimasi pengiriman?',
        a: 'Untuk wilayah Bogor biasanya 1-2 jam. Untuk luar Bogor bisa 1-3 hari tergantung lokasi.'
      }
    ];

    const roleFAQs = {
      user: [
        {
          q: 'Bagaimana cara melacak pesanan saya?',
          a: 'Anda dapat melacak pesanan di menu "Tracking Pesanan". Klik pesanan yang ingin dilacak untuk melihat status real-time.'
        },
        {
          q: 'Bisakah saya membatalkan pesanan?',
          a: 'Pesanan dapat dibatalkan selama status masih "Menunggu Konfirmasi". Setelah diproses, hubungi customer service.'
        }
      ],
      umkm: [
        {
          q: 'Bagaimana cara menambah produk baru?',
          a: 'Buka menu "Manajemen Produk", lalu klik tombol "Tambah Produk". Isi detail produk dan upload foto.'
        },
        {
          q: 'Kapan dana penjualan dicairkan?',
          a: 'Dana penjualan dicairkan otomatis setiap hari Senin untuk transaksi yang sudah selesai.'
        }
      ],
      driver: [
        {
          q: 'Bagaimana cara mengambil order?',
          a: 'Buka menu "Order Aktif", pilih order yang tersedia, lalu klik "Ambil Order". Pastikan Anda sudah dekat dengan lokasi pickup.'
        },
        {
          q: 'Bagaimana sistem pembayaran driver?',
          a: 'Pembayaran dihitung per pengiriman. Dana akan masuk ke dompet driver setiap hari Jumat.'
        }
      ],
      admin: [
        {
          q: 'Bagaimana cara menyetujui UMKM baru?',
          a: 'Buka menu "Manajemen Persetujuan", review data UMKM, lalu klik "Setujui" atau "Tolak".'
        },
        {
          q: 'Bagaimana cara mengelola konten?',
          a: 'Gunakan menu "Manajemen Konten" untuk mengatur banner, artikel, dan promosi.'
        }
      ]
    };

    return [...commonFAQs, ...(roleFAQs[user?.role || 'user'] || [])];
  };

  const faqs = getFAQs().filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!message.trim()) return;
    toast.success('Pesan Anda telah terkirim! Tim kami akan segera merespons.');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Quick Contact */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div 
              className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: '#4CAF5020' }}
            >
              <MessageCircle size={28} style={{ color: '#4CAF50' }} />
            </div>
            <h4 style={{ color: '#2F4858' }}>Live Chat</h4>
            <p className="body-3 mt-2" style={{ color: '#858585' }}>
              Chat dengan CS kami
            </p>
            <Button 
              className="mt-3" 
              size="sm"
              style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
            >
              Mulai Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div 
              className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: '#2196F320' }}
            >
              <Phone size={28} style={{ color: '#2196F3' }} />
            </div>
            <h4 style={{ color: '#2F4858' }}>Telepon</h4>
            <p className="body-3 mt-2" style={{ color: '#858585' }}>
              (0251) 123-4567
            </p>
            <Button 
              className="mt-3" 
              size="sm"
              style={{ backgroundColor: '#2196F3', color: '#FFFFFF' }}
            >
              Hubungi
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div 
              className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: '#FF8D2820' }}
            >
              <Mail size={28} style={{ color: '#FF8D28' }} />
            </div>
            <h4 style={{ color: '#2F4858' }}>Email</h4>
            <p className="body-3 mt-2" style={{ color: '#858585' }}>
              support@aslibogor.com
            </p>
            <Button 
              className="mt-3" 
              size="sm"
              style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
            >
              Kirim Email
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#FF8D2820' }}
            >
              <HelpCircle size={20} style={{ color: '#FF8D28' }} />
            </div>
            <CardTitle style={{ color: '#2F4858' }}>Pertanyaan Umum (FAQ)</CardTitle>
          </div>
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2" 
              size={18} 
              style={{ color: '#858585' }} 
            />
            <Input
              placeholder="Cari pertanyaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {faqs.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ color: '#858585' }}>Tidak ada hasil yang ditemukan</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger style={{ color: '#2F4858' }}>
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent style={{ color: '#858585' }}>
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#2F4858' }}>Kirim Pesan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="body-3" style={{ color: '#858585' }}>
            Tidak menemukan jawaban? Kirimkan pertanyaan Anda dan kami akan segera membantu!
          </p>
          <Textarea
            placeholder="Tuliskan pertanyaan atau masalah Anda di sini..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
          <Button
            onClick={handleSendMessage}
            style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
          >
            <Send size={18} className="mr-2" />
            Kirim Pesan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
