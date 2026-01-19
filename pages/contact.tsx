
import React from 'react';
import { Building, Users, Coffee, LifeBuoy, Mail, MapPin, HelpCircle } from 'lucide-react';
import { SiteConfig } from '../types';
import { useContactLogic, ContactItem, FaqAccordion, MapEmbed, ContactForm } from '../components/contact/index';

export const ContactPage = ({ config }: { config: SiteConfig }) => {
  const { form, setForm, handleShadowCapture, handleSubmit } = useContactLogic(config);

  const email = config.emailAddress || "admin@kasirsolo.my.id";

  const getDisplayPhone = (num?: string) => {
      if (!num) return "0823 2510 3336";
      if (num.startsWith('62')) return `+62 ${num.substring(2)}`;
      if (num.startsWith('0')) return `+62 ${num.substring(1)}`;
      return num;
  };

  return (
    <div className="animate-fade-in">
      <section className="pt-32 pb-16 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
               Gak Usah Sungkan,<br/> <span className="text-brand-orange">Chat Gue Aja.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed">
               Di sini gak ada Chatbot atau Admin Robot. Lo bakal ngobrol sama manusia asli (Gue & Tim Inti) yang ngerti lapangan. Gue pastikan setiap chat lo dibalas solusi, bukan template.
            </p>
         </div>
      </section>

      <div className="container mx-auto px-4 pb-24">
         <div className="grid lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5 space-y-8">
               <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                     <Users size={20} className="text-brand-orange"/> Jalur Komunikasi
                  </h3>
                  <ContactItem 
                     icon={Coffee} 
                     title="Konsultasi Strategi (Gratis)" 
                     value={getDisplayPhone(config.whatsappNumber)} 
                     sub="Mau curhat bisnis? Langsung WA aja."
                     action={() => window.open(`https://wa.me/${config.whatsappNumber}`, '_blank')}
                  />
                  <ContactItem 
                     icon={LifeBuoy} 
                     title="Jalur Darurat (Teknis)" 
                     value="Prioritas 24 Jam" 
                     sub="Khusus kalau kasir error pas toko lagi rame."
                     action={() => window.open(`https://wa.me/${config.whatsappNumber}?text=URGENT%20SUPPORT:%20Kasir%20saya%20bermasalah.`, '_blank')}
                  />
                  <ContactItem 
                     icon={Mail} 
                     title="Urusan Legal / Tender" 
                     value={email} 
                     sub="Untuk penawaran korporat resmi."
                     action={() => window.location.href = `mailto:${email}`}
                  />
               </div>

               <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                     <Building size={20} className="text-brand-orange"/> Markas Besar
                  </h3>
                  
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
                              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest bg-black/80 px-2 py-1 rounded backdrop-blur-sm shadow-lg">SOLO RAYA (HQ)</span>
                              <p className="text-white font-bold text-lg mt-2 leading-tight drop-shadow-md">Markas Legal</p>
                              <p className="text-gray-200 text-xs line-clamp-2 mt-1 bg-black/60 p-1 rounded inline-block">{config.addressSolo}</p>
                           </div>
                           {!config.mapSoloEmbed && (
                               <div className="bg-brand-orange p-2 rounded-full text-white shadow-lg transform group-hover:-translate-y-2 transition-transform">
                                  <MapPin size={20} />
                               </div>
                           )}
                        </div>
                     </div>
                     <a href={config.mapSoloLink} target="_blank" rel="noreferrer" className="absolute inset-0 z-10" aria-label="Open Map"></a>
                  </div>

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
                              <span className="text-blue-400 font-bold text-xs uppercase tracking-widest bg-black/80 px-2 py-1 rounded backdrop-blur-sm shadow-lg">BLORA (WORKSHOP)</span>
                              <p className="text-white font-bold text-lg mt-2 leading-tight drop-shadow-md">Markas Operasi</p>
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

            <div className="lg:col-span-7 space-y-10">
               
               <ContactForm 
                  form={form} 
                  setForm={setForm} 
                  onSubmit={handleSubmit} 
                  onBlur={handleShadowCapture}
               />

               <div className="pt-8 border-t border-white/10">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                     <HelpCircle size={20} className="text-brand-orange"/> Q&A Singkat (Yang Sering Ditanya)
                  </h3>
                  <div className="bg-brand-card rounded-xl border border-white/5 px-6">
                     <FaqAccordion 
                        q="Mas, ada toko fisiknya gak buat liat barang?" 
                        a="Sekarang gue fokus main *Online & Gudang* aja. Kenapa? Biar gue gak perlu bebanin biaya sewa ruko mahal ke harga barang lo (jadi lebih murah). Gantinya? Kita *Video Call* sepuasnya buat demo unit, atau transaksi via Marketplace (Tokped/Shopee) biar lo aman." 
                     />
                     <FaqAccordion 
                        q="Bisa kirim ke luar pulau? Aman gak?" 
                        a="Aman 100%. Gue udah kirim unit dari Aceh sampe Papua. Packing kayu, asuransi, garansi sampai tujuan nyala normal. Kalau pecah, gue ganti baru." 
                     />
                     <FaqAccordion 
                        q="Kalau rusak gimana klaim garansinya?" 
                        a="Hardware garansi resmi 1 tahun. Software? Gue support seumur hidup selama lo langganan. Gue gak bakal lari dari tanggung jawab." 
                     />
                     <FaqAccordion 
                        q="Saya gaptek Mas, bakal diajari cara pakainya?" 
                        a="Wajib. Gue haram hukumnya jual lepas. Tim gue bakal training lo & staf sampe bener-bener lancar (bisa via Zoom atau datang langsung)." 
                     />
                  </div>
               </div>

            </div>
         </div>
      </div>
    </div>
  );
};
