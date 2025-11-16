import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useState } from "react";
import { toast } from "sonner";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pesan Anda telah dikirim! Kami akan segera menghubungi Anda.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section id="kontak" className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 style={{ color: '#2F4858' }} className="mb-4">
            Hubungi Kami
          </h2>
          <p style={{ color: '#858585' }}>
            Ada pertanyaan atau ingin bergabung? Kami siap membantu Anda
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="body-3" style={{ color: '#2F4858' }}>
                Nama Lengkap
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email" className="body-3" style={{ color: '#2F4858' }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="subject" className="body-3" style={{ color: '#2F4858' }}>
                Subjek
              </Label>
              <Input
                id="subject"
                type="text"
                placeholder="Subjek pesan Anda"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="message" className="body-3" style={{ color: '#2F4858' }}>
                Pesan
              </Label>
              <Textarea
                id="message"
                placeholder="Tulis pesan Anda di sini..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="mt-2 min-h-32"
              />
            </div>

            <Button 
              type="submit"
              style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
              className="w-full"
            >
              Hubungi Kami Disini
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
