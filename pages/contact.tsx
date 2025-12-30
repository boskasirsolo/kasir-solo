
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, HelpCircle, Building, CheckCircle2, ArrowRight, LifeBuoy, Users } from 'lucide-react';
import { SiteConfig } from '../types';
import { Button, Input, TextArea, SectionHeader, Card } from '../components/ui';

const ContactItem = ({ icon: Icon, title, value, sub, action }: { icon: any, title: string, value: string, sub?: string, action?: () => void }) => (
  <div onClick={action} className={`flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all ${action ? 'cursor-pointer group hover:border-brand-orange/30' : ''}`}>
    <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-brand-orange border border-white/10 group-hover:scale-110 transition-transform">
      <Icon size={20} />
    </div>
    <div>
      <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h4>
      <p className="text-white font-bold text-base md:text-lg leading-tight truncate max-w-[250px]">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  </div>
);

const FaqItem = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 flex justify-between items-center gap-4 text-gray-300 hover:text-brand-orange transition-colors"
      >
        <span className="font-bold text-sm md:text-base">{q}</span>
        <ArrowRight size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-90 text-brand-orange' : 'text-gray-600'}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-400 text-sm leading-relaxed pl-4 border-l-2 border-brand-orange/20">
          {a}
        </p>
      </div>
    </div>
  );
};

// Component helper to clean iframe code if pasted with tags
const MapEmbed = ({ embedCode, title, fallbackImage }: { embedCode?: string, title: string, fallbackImage: string }) => {
    if (!embedCode || embedCode.length < 10) {
        return <img src={fallbackImage} className="w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity" alt={title} />;
    }

    // Sanitize width/height to force fill parent
    const cleanEmbed = embedCode
        .replace(/width="[^"]*"/g, 'width="100%"')
        .replace(/height="[^"]*"/g, 'height="100%"')
        .replace(/style="[^"]*"/g, 'style="border:0;"');

    return (
        <div 
            className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity iframe-map-container"
            dangerouslySetInnerHTML={{ __html: cleanEmbed }} 
        />
    );
};

export const ContactPage = ({ config }: { config: SiteConfig }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    category: 'Sales',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.name || !form.message) return alert("Mohon lengkapi pesan Anda");
    
    // Auto-format WhatsApp Message
    const text = `*FORM KONTAK WEBSITE*%0A%0ANama: ${form.name}%0ANo HP: ${form.phone}%0AKategori: ${form.category}%0A%0APesan:%0A${form.message}`;
    const url = `https://wa.me/${config.whatsappNumber}?text=${text}`;
    window.open(url, '_blank');
  };

  const email = config.emailAddress || "admin@kasirsolo.com";

  // Helper for Phone Display
  const getDisplayPhone = (num?: string) => {
      if (!num) return "0823 2510 3336";
      // If starts with 62, slice 2 digits -> +62 8xx
      if (num.startsWith('62')) return `+62 ${num.substring(2)}`;
      // If starts with 0, slice 1 digit -> +62 8xx
      if (num.startsWith('0')) return `+62 ${num.substring(1)}`;
      return num;
  };

  return (
    <div className="animate-fade-in">
      {/* HEADER SECTION */}
      <section className="pt-32 pb-16 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
               Hubungi <span className="text-brand-orange">Tim Kami</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed">
               Punya pertanyaan tentang produk kasir, butuh penawaran resmi, atau kendala teknis? 
               Kami siap membantu operasional bisnis Anda berjalan lancar.
            </p>
         </div>
      </section>

      <div className="container mx-auto px-4 pb-24">
         <div className="grid lg:grid-cols-12 gap-12">
            
            {/* LEFT COLUMN: Contact Info */}
            <div className="lg:col-span-5 space-y-8">
               
               {/* Contact Channels */}
               <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                     <Users size={20} className="text-brand-orange"/> Layanan Pelanggan
                  </h3>
                  <ContactItem 
                     icon={Phone} 
                     title="Sales & Konsultasi" 
                     value={getDisplayPhone(config.whatsappNumber)} 
                     sub="Senin - Sabtu (08:00 - 17:00 WIB)"
                     action={() => window.open(`https://wa.me/${config.whatsappNumber}`, '_blank')}
                  />
                  <ContactItem 
                     icon={LifeBuoy} 
                     title="Technical Support" 
                     value="Siap 24 Jam" 
                     sub="Khusus kendala teknis & darurat (Urgent)"
                     action={() => window.open(`https://wa.me/${config.whatsappNumber}?text=Halo%20Support,%20saya%20butuh%20bantuan%20teknis.`, '_blank')}
                  />
                  <ContactItem 
                     icon={Mail} 
                     title="Email Resmi" 
                     value={email} 
                     sub="Untuk penawaran korporat / tender"
                     action={() => window.location.href = `mailto:${email}`}
                  />
               </div>

               {/* Office Locations */}
               <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                     <Building size={20} className="text-brand-orange"/> Lokasi Kantor
                  </h3>
                  
                  {/* Solo Map Card */}
                  <div className="group relative h-48 bg-gray-800 rounded-xl overflow-hidden border border-white/10 cursor-pointer">
                     <div className="absolute inset-0 z-0">
                        <MapEmbed 
                            embedCode={config.mapSoloEmbed} 
                            title="Office Solo" 
                            fallbackImage="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=600"
                        />
                     </div>
                     <div className="absolute inset-0 p-5 flex flex-col justify-end pointer-events-none">
                        <div className="flex items-start justify-between">
                           <div>
                              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest bg-black/80 px-2 py-1 rounded backdrop-blur-sm shadow-lg">KANTOR LEGAL (SOLO RAYA)</span>
                              <p className="text-white font-bold text-lg mt-2 leading-tight drop-shadow-md">Head Office</p>
                              <p className="text-gray-200 text-xs line-clamp-2 mt-1 bg-black/60 p-1 rounded inline-block">{config.addressSolo}</p>
                           </div>
                           {/* Only show icon if no embed, or as an overlay button */}
                           {!config.mapSoloEmbed && (
                               <div className="bg-brand-orange p-2 rounded-full text-white shadow-lg transform group-hover:-translate-y-2 transition-transform">
                                  <MapPin size={20} />
                               </div>
                           )}
                        </div>
                     </div>
                     {/* Click overlay for external link if embed is missing or user wants full map */}
                     <a href={config.mapSoloLink} target="_blank" rel="noreferrer" className="absolute inset-0 z-10" aria-label="Open Map"></a>
                  </div>

                  {/* Blora Map Card */}
                  <div className="group relative h-48 bg-gray-800 rounded-xl overflow-hidden border border-white/10 cursor-pointer">
                     <div className="absolute inset-0 z-0">
                        <MapEmbed 
                            embedCode={config.mapBloraEmbed} 
                            title="Office Blora" 
                            fallbackImage="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600"
                        />
                     </div>
                     <div className="absolute inset-0 p-5 flex flex-col justify-end pointer-events-none">
                        <div className="flex items-start justify-between">
                           <div>
                              <span className="text-blue-400 font-bold text-xs uppercase tracking-widest bg-black/80 px-2 py-1 rounded backdrop-blur-sm shadow-lg">KANTOR OPERASIONAL & SHOWROOM</span>
                              <p className="text-white font-bold text-lg mt-2 leading-tight drop-shadow-md">Blora - Jawa Tengah</p>
                              <p className="text-gray-200 text-xs line-clamp-2 mt-1 bg-black/60 p-1 rounded inline-block">{config.addressBlora}</p>
                           </div>
                           {!config.mapBloraEmbed && (
                               <div className="bg-brand-dark border border-brand-orange text-brand-orange p-2 rounded-full shadow-lg transform group-hover:-translate-y-2 transition-transform">
                                  <MapPin size={20} />
                               </div>
                           )}
                        </div>
                     </div>
                     <a href={config.mapBloraLink} target="_blank" rel="noreferrer" className="absolute inset-0 z-10" aria-label="Open Map"></a>
                  </div>

               </div>
            </div>

            {/* RIGHT COLUMN: Form & FAQ */}
            <div className="lg:col-span-7 space-y-10">
               
               {/* Contact Form */}
               <Card className="p-6 md:p-8 bg-brand-dark/50 border-brand-orange/20 shadow-neon-text/5">
                  <h3 className="text-2xl font-display font-bold text-white mb-6">Kirim Pesan</h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                     <div className="grid md:grid-cols-2 gap-5">
                        <div>
                           <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Nama Lengkap</label>
                           <Input 
                              value={form.name} 
                              onChange={e => setForm({...form, name: e.target.value})} 
                              placeholder="Nama Anda"
                           />
                        </div>
                        <div>
                           <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Nomor WhatsApp</label>
                           <Input 
                              value={form.phone} 
                              onChange={e => setForm({...form, phone: e.target.value})} 
                              placeholder="0812xxxx"
                              type="tel"
                           />
                        </div>
                     </div>
                     
                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Kategori Pesan</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                           {['Sales', 'Support', 'Kerjasama', 'Lainnya'].map(cat => (
                              <button
                                 key={cat}
                                 type="button"
                                 onClick={() => setForm({...form, category: cat})}
                                 className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                                    form.category === cat 
                                    ? 'bg-brand-orange text-white border-brand-orange' 
                                    : 'bg-black/20 text-gray-400 border-white/10 hover:border-white/30'
                                 }`}
                              >
                                 {cat}
                              </button>
                           ))}
                        </div>
                     </div>

                     <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Isi Pesan</label>
                        <TextArea 
                           value={form.message} 
                           onChange={e => setForm({...form, message: e.target.value})} 
                           placeholder="Tuliskan kebutuhan atau pertanyaan Anda secara detail..."
                           className="h-32"
                        />
                     </div>

                     <Button type="submit" className="w-full py-4 text-sm font-bold shadow-neon hover:shadow-neon-strong">
                        <Send size={18} /> KIRIM KE WHATSAPP ADMIN
                     </Button>
                     <p className="text-[10px] text-gray-500 text-center">
                        *Anda akan diarahkan ke aplikasi WhatsApp untuk mengirim pesan ini secara otomatis.
                     </p>
                  </form>
               </Card>

               {/* FAQ Section */}
               <div className="pt-8 border-t border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                     <HelpCircle size={20} className="text-brand-orange"/> Pertanyaan Umum (FAQ)
                  </h3>
                  <div className="bg-brand-card rounded-xl border border-white/5 px-6">
                     <FaqItem 
                        q="Apakah tersedia toko fisik untuk melihat barang?" 
                        a="Ya, tentu saja. Anda bisa mengunjungi SHOWROOM dan KANTOR OPERASIONAL kami di Banjarejo, Blora. Silakan lihat peta di bagian kiri halaman ini atau hubungi admin untuk share location." 
                     />
                     <FaqItem 
                        q="Apakah melayani pengiriman ke luar kota/pulau?" 
                        a="Betul. Kami telah melayani pengiriman dan instalasi ke seluruh Indonesia (Jawa, Sumatera, Kalimantan, Sulawesi, hingga Papua) menggunakan ekspedisi aman berasuransi." 
                     />
                     <FaqItem 
                        q="Bagaimana dengan garansi produk?" 
                        a="Semua hardware baru bergaransi resmi 1 Tahun. Untuk software SIBOS/Kasir, kami memberikan garansi support teknis selamanya (Lifetime Support) selama berlangganan." 
                     />
                     <FaqItem 
                        q="Apakah saya akan diajari cara pakainya?" 
                        a="Pasti. Setiap pembelian paket kasir sudah termasuk layanan Training (Pelatihan) untuk owner dan staff sampai bisa. Bisa via Zoom (jarak jauh) atau tatap muka (jika di area jangkauan)." 
                     />
                  </div>
               </div>

            </div>
         </div>
      </div>
    </div>
  );
};
