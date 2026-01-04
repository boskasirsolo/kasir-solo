
import React, { useState, useEffect } from 'react';
import { 
  Download, FileText, Smartphone, Monitor, Search, 
  HelpCircle, PlayCircle, HardDrive, Package, 
  ChevronRight, ChevronLeft, AlertTriangle, MessageCircle, Wrench, X
} from 'lucide-react';
import { SectionHeader, Button } from '../components/ui';
import { INITIAL_DOWNLOADS, INITIAL_TUTORIALS, INITIAL_FAQS, supabase } from '../utils';
import { DownloadItem, Tutorial, FAQ } from '../types';

// Pagination Constants
const PAGE_SIZE_FILES = 9;
const PAGE_SIZE_VIDEOS = 5;
const PAGE_SIZE_FAQS = 5;

// Helper for category colors
const getCategoryColor = (category: string) => {
    switch (category) {
      case 'driver': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'manual': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'software': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'tools': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-white/5 text-gray-400 border-white/10';
    }
};

// --- MODAL COMPONENT ---
const DownloadDetailModal = ({ item, onClose }: { item: DownloadItem, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-lg bg-brand-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col animate-fade-in overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-brand-card flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${getCategoryColor(item.category)}`}>
                                {item.category}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500">{item.version}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white leading-tight">{item.title}</h3>
                    </div>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    <div className="flex justify-between items-center mb-6 bg-black/20 p-3 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 text-xs text-gray-300 w-full">
                            <Monitor size={14} className="text-blue-400" /> 
                            <span>Support: <strong>{item.os_support}</strong></span>
                        </div>
                        {/* File Size Information Removed */}
                    </div>

                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Deskripsi File</h4>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-6">
                        {item.description || "Tidak ada deskripsi detail."}
                    </p>

                    <div className="p-4 bg-yellow-500/5 border-l-4 border-yellow-500 rounded-r-lg text-xs text-gray-400 leading-relaxed">
                        <strong className="text-yellow-500 block mb-1 flex items-center gap-1"><AlertTriangle size={12}/> Warning:</strong>
                        Jangan asal install kalau ragu. Salah driver bisa bikin printer lo mogok. Kalau bingung, mending chat admin dulu.
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-white/10 bg-brand-card">
                    <a 
                        href={item.file_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-action text-white py-3 rounded-xl font-bold transition-all shadow-neon hover:shadow-neon-strong"
                    >
                        <Download size={18} /> SEDOT FILE
                    </a>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTS ---

const DownloadCard: React.FC<{ item: DownloadItem, onClick: () => void }> = ({ item, onClick }) => {
  const getIcon = () => {
    switch (item.category) {
      case 'driver': return <HardDrive size={20} className="text-blue-400" />;
      case 'manual': return <FileText size={20} className="text-yellow-400" />;
      case 'software': return <Smartphone size={20} className="text-green-400" />;
      case 'tools': return <Wrench size={20} className="text-red-400" />;
      default: return <Package size={20} className="text-gray-400" />;
    }
  };

  return (
    <div onClick={onClick} className="bg-brand-card border border-white/5 rounded-xl p-4 hover:border-brand-orange/50 transition-all group flex flex-col h-full shadow-lg cursor-pointer hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/10 bg-black/40 group-hover:bg-white/5 transition-colors">
          {getIcon()}
        </div>
        <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${getCategoryColor(item.category)}`}>
          {item.category}
        </span>
      </div>
      
      <h3 className="text-white font-bold text-xs mb-2 line-clamp-2 min-h-[2rem] group-hover:text-brand-orange transition-colors">
        {item.title}
      </h3>
      
      <div className="mt-auto pt-3 border-t border-white/5">
        <div className="flex justify-between items-center text-[9px] text-gray-500 mb-3">
           <span className="flex items-center gap-1"><Monitor size={8}/> {item.os_support}</span>
           <span>{item.file_size}</span>
        </div>
        {/* MODIFIED BUTTON STYLE: Orange Border & Text */}
        <button className="w-full flex items-center justify-center gap-2 border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white py-2 rounded text-[10px] font-bold transition-all shadow-[0_0_10px_rgba(255,95,31,0.15)]">
          Lihat Detail
        </button>
      </div>
    </div>
  );
};

const VideoCard: React.FC<{ item: Tutorial }> = ({ item }) => (
    <a 
        href={item.video_url} 
        target="_blank" 
        rel="noreferrer"
        className="flex items-center gap-3 p-3 rounded-lg bg-black/20 hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5"
    >
        <div className="w-8 h-8 rounded-full bg-red-900/20 text-red-500 flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <PlayCircle size={14} />
        </div>
        <span className="text-[11px] text-gray-300 font-bold group-hover:text-white line-clamp-2">{item.title}</span>
    </a>
);

const FaqItem: React.FC<{ item: FAQ }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/5 rounded-lg bg-brand-card/30 overflow-hidden mb-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-3 flex justify-between items-center text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all"
      >
        <span className="line-clamp-2 flex-1 pr-2">{item.question}</span>
        <ChevronRight size={14} className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-90 text-brand-orange' : 'text-gray-600'}`} />
      </button>
      <div className={`bg-black/20 px-3 text-[10px] text-gray-400 leading-relaxed border-t border-white/5 transition-all duration-300 ${isOpen ? 'max-h-40 py-3 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
        {item.answer}
      </div>
    </div>
  );
};

const SimplePagination = ({ page, totalPages, setPage }: { page: number, totalPages: number, setPage: (p: number) => void }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-center gap-2 mt-4">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30"><ChevronLeft size={14} className="text-white"/></button>
            <span className="text-[10px] text-gray-400 py-1">{page}/{totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30"><ChevronRight size={14} className="text-white"/></button>
        </div>
    );
};

// --- MAIN PAGE ---

export const SupportPage = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDownload, setSelectedDownload] = useState<DownloadItem | null>(null);
  const [activeDownloadTab, setActiveDownloadTab] = useState('all');
  
  // Pagination States
  const [pageFiles, setPageFiles] = useState(1);
  const [pageVideos, setPageVideos] = useState(1);
  const [pageFaqs, setPageFaqs] = useState(1);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchAllData = async () => {
        if (!supabase) {
            setDownloads(INITIAL_DOWNLOADS);
            setTutorials(INITIAL_TUTORIALS);
            setFaqs(INITIAL_FAQS);
            setLoading(false);
            return;
        }

        try {
            const [dlRes, vidRes, faqRes] = await Promise.all([
                supabase.from('downloads').select('*').order('created_at', { ascending: false }),
                supabase.from('tutorials').select('*').order('created_at', { ascending: false }),
                supabase.from('faqs').select('*').order('created_at', { ascending: false })
            ]);

            setDownloads(dlRes.data && dlRes.data.length > 0 ? dlRes.data : INITIAL_DOWNLOADS);
            setTutorials(vidRes.data && vidRes.data.length > 0 ? vidRes.data : INITIAL_TUTORIALS);
            setFaqs(faqRes.data && faqRes.data.length > 0 ? faqRes.data : INITIAL_FAQS);
        } catch (e) {
            console.error("Fetch Error:", e);
        } finally {
            setLoading(false);
        }
    };
    fetchAllData();
  }, []);

  // --- FILTER & PAGINATION LOGIC ---
  const filterData = <T,>(data: T[], key: keyof T): T[] => {
      return data.filter((item: any) => 
          item[key] && typeof item[key] === 'string' && item[key].toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  const filteredDownloads = downloads.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeDownloadTab === 'all' || item.category === activeDownloadTab;
      return matchesSearch && matchesTab;
  });

  const filteredTutorials = filterData<Tutorial>(tutorials, 'title');
  const filteredFaqs = filterData<FAQ>(faqs, 'question');

  const paginate = <T,>(data: T[], page: number, size: number): T[] => {
      const start = (page - 1) * size;
      return data.slice(start, start + size);
  };

  useEffect(() => { setPageFiles(1); setPageVideos(1); setPageFaqs(1); }, [searchTerm, activeDownloadTab]);

  const handleFileClick = (item: DownloadItem) => {
      setSelectedDownload(item);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in pt-10">
      
      {/* HEADER SECTION */}
      <div className="relative bg-brand-dark border-b border-white/5 pb-16 pt-10 overflow-hidden">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="container mx-auto px-4 relative z-10 text-center">
            <SectionHeader 
                title="Bengkel" 
                highlight="Digital." 
                subtitle="Mesin kasir lo macet? Printer ngadat? Tenang, jangan panik. Ambil 'kunci inggris' digital lo di sini atau panggil mekanik gue." 
            />
            
            {/* SEARCH BAR GLOBAL */}
            <div className="max-w-xl mx-auto mt-8 relative group">
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ketik masalah lo... (misal: printer error)"
                    className="w-full bg-brand-card border border-white/10 rounded-full py-4 pl-12 pr-6 text-white shadow-2xl focus:border-brand-orange outline-none transition-all placeholder-gray-500"
                />
                <Search className="absolute left-4 top-4 text-gray-500 group-focus-within:text-brand-orange transition-colors" size={20} />
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-16">
         <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* COL 1: FILES (50% = 6 cols) */}
            <div className="lg:col-span-6 bg-brand-dark/30 border border-white/5 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-3">
                    <h3 className="text-white font-bold flex items-center gap-2 text-base">
                        <HardDrive size={18} className="text-blue-400" /> Gudang Senjata (Files)
                    </h3>
                    
                    {/* TABS */}
                    <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
                        {['all', 'driver', 'software', 'manual', 'tools'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveDownloadTab(tab)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap border ${
                                    activeDownloadTab === tab
                                    ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {tab === 'all' ? 'Semua' : tab}
                            </button>
                        ))}
                    </div>
                </div>
                
                {loading ? <div className="text-center py-10 text-gray-500">Loading...</div> : (
                    <>
                        {filteredDownloads.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {paginate(filteredDownloads, pageFiles, PAGE_SIZE_FILES).map((item: DownloadItem) => (
                                    <DownloadCard 
                                        key={item.id} 
                                        item={item} 
                                        onClick={() => handleFileClick(item)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-xs">File tidak ditemukan.</div>
                        )}
                        <SimplePagination page={pageFiles} totalPages={Math.ceil(filteredDownloads.length/PAGE_SIZE_FILES)} setPage={setPageFiles} />
                    </>
                )}
            </div>

            {/* COL 2: VIDEOS (25% = 3 cols) */}
            <div className="lg:col-span-3 bg-brand-dark/30 border border-white/5 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-base border-b border-white/10 pb-3">
                    <PlayCircle size={18} className="text-red-500" /> Tutorial Anti-Gaptek
                </h3>
                
                <div className="space-y-2">
                    {paginate(filteredTutorials, pageVideos, PAGE_SIZE_VIDEOS).map(item => (
                        <VideoCard key={item.id} item={item} />
                    ))}
                    {filteredTutorials.length === 0 && <div className="text-center py-8 text-gray-500 text-xs">Video tidak ditemukan.</div>}
                </div>
                <SimplePagination page={pageVideos} totalPages={Math.ceil(filteredTutorials.length/PAGE_SIZE_VIDEOS)} setPage={setPageVideos} />
                
                <Button variant="outline" className="w-full mt-6 text-xs h-9" onClick={() => window.open('https://youtube.com', '_blank')}>
                    Lihat Channel Youtube
                </Button>
            </div>

            {/* COL 3: FAQ & CONTACT (25% = 3 cols) */}
            <div className="lg:col-span-3 space-y-6">
                
                {/* FAQ BOX */}
                <div className="bg-brand-dark/30 border border-white/5 rounded-2xl p-5">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-base border-b border-white/10 pb-3">
                        <HelpCircle size={18} className="text-brand-orange" /> Pertanyaan Langganan
                    </h3>
                    <div className="space-y-1">
                        {paginate(filteredFaqs, pageFaqs, PAGE_SIZE_FAQS).map(item => (
                            <FaqItem key={item.id} item={item} />
                        ))}
                        {filteredFaqs.length === 0 && <div className="text-center py-8 text-gray-500 text-xs">FAQ tidak ditemukan.</div>}
                    </div>
                    <SimplePagination page={pageFaqs} totalPages={Math.ceil(filteredFaqs.length/PAGE_SIZE_FAQS)} setPage={setPageFaqs} />
                </div>

                {/* CONTACT BOX - REVISED */}
                <div className="bg-brand-orange/10 border border-brand-orange/30 p-5 rounded-xl text-center">
                    <p className="text-brand-orange text-[10px] font-bold uppercase tracking-widest mb-2">Mentok & Nyerah?</p>
                    <p className="text-gray-300 text-xs mb-4 leading-relaxed">
                        Udah mentok? Jangan dipaksa, Bos. Daripada makin ambyar, mending serahin ke teknisi gue. Tinggal duduk manis, biar tim gue yang beresin kekacauan ini.
                    </p>
                    <a 
                        href="https://wa.me/6282325103336?text=Halo Tim Teknis, saya butuh bantuan urgent."
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-red-600 hover:from-brand-orange hover:to-red-500 text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-neon w-full justify-center transform hover:-translate-y-0.5 transition-all"
                    >
                        <MessageCircle size={14} /> Panggil Mekanik
                    </a>
                </div>

            </div>

         </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedDownload && (
          <DownloadDetailModal 
            item={selectedDownload} 
            onClose={() => setSelectedDownload(null)} 
          />
      )}
    </div>
  );
};
