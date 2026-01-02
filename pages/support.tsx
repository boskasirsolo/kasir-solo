
import React, { useState, useEffect } from 'react';
import { 
  Download, FileText, Smartphone, Monitor, Search, 
  HelpCircle, PlayCircle, HardDrive, Package, 
  ChevronRight, AlertTriangle, MessageCircle, Wrench
} from 'lucide-react';
import { SectionHeader, Button } from '../components/ui';
import { INITIAL_DOWNLOADS, supabase } from '../utils'; // Import supabase
import { DownloadItem } from '../types';

// --- COMPONENTS ---

const DownloadCard = ({ item }: { item: DownloadItem }) => {
  const getIcon = () => {
    switch (item.category) {
      case 'driver': return <HardDrive size={24} className="text-blue-400" />;
      case 'manual': return <FileText size={24} className="text-yellow-400" />;
      case 'software': return <Smartphone size={24} className="text-green-400" />;
      case 'tools': return <Wrench size={24} className="text-red-400" />;
      default: return <Package size={24} className="text-gray-400" />;
    }
  };

  const getBadgeColor = () => {
    switch (item.category) {
      case 'driver': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'manual': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'software': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'tools': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="bg-brand-card border border-white/5 rounded-xl p-5 hover:border-brand-orange/50 transition-all group flex flex-col h-full shadow-lg hover:shadow-neon/20">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center border border-white/10 bg-black/40 ${getBadgeColor()}`}>
          {getIcon()}
        </div>
        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${getBadgeColor()}`}>
          {item.category}
        </span>
      </div>
      
      <h3 className="text-white font-bold text-base mb-2 line-clamp-2 min-h-[3rem] group-hover:text-brand-orange transition-colors">
        {item.title}
      </h3>
      
      <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-3 flex-grow">
        {item.description}
      </p>
      
      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="flex justify-between items-center text-[10px] text-gray-500 mb-3">
           <span className="flex items-center gap-1"><Monitor size={10}/> {item.os_support}</span>
           <span>{item.file_size} • {item.version}</span>
        </div>
        <a 
          href={item.file_url} 
          target="_blank" 
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-brand-orange hover:text-white text-gray-300 py-2.5 rounded-lg text-xs font-bold transition-all"
        >
          <Download size={14} /> DOWNLOAD
        </a>
      </div>
    </div>
  );
};

const FaqAccordion = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/5 rounded-lg bg-brand-card/30 overflow-hidden mb-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-4 flex justify-between items-center text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all"
      >
        {q}
        <ChevronRight size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-90 text-brand-orange' : 'text-gray-600'}`} />
      </button>
      <div className={`bg-black/20 px-4 text-xs text-gray-400 leading-relaxed border-t border-white/5 transition-all duration-300 ${isOpen ? 'max-h-40 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
        {a}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export const SupportPage = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'driver' | 'manual' | 'software' | 'tools'>('all');

  // --- FETCH DATA FROM DB ---
  useEffect(() => {
    const fetchData = async () => {
        if (!supabase) {
            // Fallback to static if no DB
            setDownloads(INITIAL_DOWNLOADS);
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('downloads')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            if (data && data.length > 0) {
                setDownloads(data);
            } else {
                // Keep static if DB empty to avoid blank page
                setDownloads(INITIAL_DOWNLOADS);
            }
        } catch (e) {
            console.error("Error fetching downloads:", e);
            setDownloads(INITIAL_DOWNLOADS); // Safe fallback
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  // Filter Logic
  const filteredItems = downloads.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'driver', label: 'Drivers' },
    { id: 'manual', label: 'Manual Book' },
    { id: 'software', label: 'Software' },
    { id: 'tools', label: 'Tools' },
  ];

  return (
    <div className="animate-fade-in pt-10">
      
      {/* HEADER SECTION */}
      <div className="relative bg-brand-dark border-b border-white/5 pb-16 pt-10 overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="container mx-auto px-4 relative z-10 text-center">
            <SectionHeader 
                title="Download &" 
                highlight="Support Center" 
                subtitle="Pusat unduhan driver, manual, dan software pendukung. Langsung dari teknisi untuk kelancaran bisnis Anda." 
            />
            
            {/* SEARCH BAR */}
            <div className="max-w-xl mx-auto mt-8 relative group">
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari driver printer, manual book, atau software..."
                    className="w-full bg-brand-card border border-white/10 rounded-full py-4 pl-12 pr-6 text-white shadow-2xl focus:border-brand-orange outline-none transition-all placeholder-gray-500"
                />
                <Search className="absolute left-4 top-4 text-gray-500 group-focus-within:text-brand-orange transition-colors" size={20} />
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-16">
         <div className="grid lg:grid-cols-12 gap-10">
            
            {/* LEFT: DOWNLOADS (8 Columns) */}
            <div className="lg:col-span-8">
                {/* CATEGORY TABS */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id as any)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                                activeCategory === cat.id 
                                ? 'bg-brand-orange text-white border-brand-orange shadow-neon' 
                                : 'bg-brand-card text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* GRID ITEMS */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading data...</div>
                ) : filteredItems.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        {filteredItems.map(item => (
                            <React.Fragment key={item.id}>
                                <DownloadCard item={item} />
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-brand-card/30 rounded-xl border border-white/5 border-dashed">
                        <AlertTriangle className="mx-auto text-gray-600 mb-4" size={40} />
                        <h3 className="text-white font-bold mb-1">File Tidak Ditemukan</h3>
                        <p className="text-gray-500 text-sm">Coba kata kunci lain atau hubungi saya langsung.</p>
                    </div>
                )}
            </div>

            {/* RIGHT: HELP & FAQ (4 Columns) */}
            <div className="lg:col-span-4 space-y-8">
                
                {/* TUTORIAL BOX */}
                <div className="bg-brand-card border border-white/10 rounded-xl p-6 shadow-lg">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <PlayCircle size={20} className="text-red-500" /> Video Tutorial
                    </h3>
                    <div className="space-y-3">
                        {[
                            "Cara Install Driver Printer 58mm",
                            "Setting Laci Kasir Otomatis",
                            "Tutorial Input Stok Awal SIBOS",
                            "Cara Koneksi Scanner Barcode"
                        ].map((title, i) => (
                            <a 
                                key={i} 
                                href="https://youtube.com/" 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg bg-black/20 hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5"
                            >
                                <div className="w-8 h-8 rounded-full bg-red-900/20 text-red-500 flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                    <PlayCircle size={14} />
                                </div>
                                <span className="text-xs text-gray-300 font-bold group-hover:text-white line-clamp-1">{title}</span>
                            </a>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 text-xs h-10 border-white/10 hover:border-red-500 hover:text-red-500">
                        Lihat Channel Youtube
                    </Button>
                </div>

                {/* FAQ BOX */}
                <div>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <HelpCircle size={20} className="text-brand-orange" /> Troubleshooting
                    </h3>
                    <div className="space-y-1">
                        <FaqAccordion 
                            q="Printer tidak terdeteksi di Windows?" 
                            a="Pastikan kabel USB terpasang rapat. Coba pindah port USB lain. Restart printer. Jika masih gagal, reinstall driver dari menu di kiri." 
                        />
                        <FaqAccordion 
                            q="Laci kasir tidak terbuka otomatis?" 
                            a="Cek kabel RJ11 (seperti kabel telepon) dari laci ke printer. Pastikan settingan printer di 'Device Settings' sudah enable Cash Drawer #1." 
                        />
                        <FaqAccordion 
                            q="Scanner barcode tidak bunyi?" 
                            a="Scan barcode 'Reset Factory' yang ada di buku manual scanner. Pastikan kabel tidak putus dalam." 
                        />
                    </div>
                </div>

                {/* DIRECT HELP */}
                <div className="bg-brand-orange/10 border border-brand-orange/30 p-6 rounded-xl text-center">
                    <p className="text-brand-orange text-xs font-bold uppercase tracking-widest mb-2">Support Langsung Founder</p>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                        Bingung setting sendiri? Tenang. Saya (Amin) siap memandu Anda langsung via Remote (TeamViewer) atau Video Call sampai alat berfungsi normal. Tanpa admin perantara.
                    </p>
                    <a 
                        href="https://wa.me/6282325103336?text=Halo%20Mas%20Amin,%20saya%20butuh%20bantuan%20setting%20alat."
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-action text-white px-6 py-3 rounded-lg text-sm font-bold shadow-neon transition-transform hover:-translate-y-1"
                    >
                        <MessageCircle size={18} /> Chat Mas Amin
                    </a>
                </div>

            </div>

         </div>
      </div>
    </div>
  );
};
