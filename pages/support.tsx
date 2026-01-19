
import React from 'react';
import { HardDrive, PlayCircle, HelpCircle, MessageCircle, Search } from 'lucide-react';
import { SectionHeader, Button } from '../components/ui';
import { 
    useSupportLogic, 
    DownloadCard, 
    VideoCard, 
    FaqItem, 
    SimplePagination, 
    CategoryTabs,
    DownloadDetailModal,
    PAGE_SIZE_FILES,
    PAGE_SIZE_VIDEOS,
    PAGE_SIZE_FAQS 
} from '../components/support/index';
import { DownloadItem, Tutorial, FAQ, SiteConfig } from '../types';

export const SupportPage = ({ config }: { config?: SiteConfig }) => {
  const { state, computed, actions } = useSupportLogic();
  const waNumber = config?.whatsapp_number || "6282325103336";

  const handleFileClick = (item: DownloadItem) => {
      actions.setSelectedDownload(item);
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
                    value={state.searchTerm}
                    onChange={(e) => actions.setSearchTerm(e.target.value)}
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
                    <CategoryTabs activeTab={state.activeDownloadTab} onChange={actions.setActiveDownloadTab} />
                </div>
                
                {state.loading ? <div className="text-center py-10 text-gray-500">Loading...</div> : (
                    <>
                        {computed.filteredDownloads.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {computed.paginate(computed.filteredDownloads, state.pageFiles, PAGE_SIZE_FILES).map((item: DownloadItem) => (
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
                        <SimplePagination page={state.pageFiles} totalPages={Math.ceil(computed.filteredDownloads.length/PAGE_SIZE_FILES)} setPage={actions.setPageFiles} />
                    </>
                )}
            </div>

            {/* COL 2: VIDEOS (25% = 3 cols) */}
            <div className="lg:col-span-3 bg-brand-dark/30 border border-white/5 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-base border-b border-white/10 pb-3">
                    <PlayCircle size={18} className="text-red-500" /> Tutorial Anti-Gaptek
                </h3>
                
                <div className="space-y-2">
                    {computed.paginate(computed.filteredTutorials, state.pageVideos, PAGE_SIZE_VIDEOS).map((item: Tutorial) => (
                        <VideoCard key={item.id} item={item} />
                    ))}
                    {computed.filteredTutorials.length === 0 && <div className="text-center py-8 text-gray-500 text-xs">Video tidak ditemukan.</div>}
                </div>
                <SimplePagination page={state.pageVideos} totalPages={Math.ceil(computed.filteredTutorials.length/PAGE_SIZE_VIDEOS)} setPage={actions.setPageVideos} />
                
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
                        {computed.paginate(computed.filteredFaqs, state.pageFaqs, PAGE_SIZE_FAQS).map((item: FAQ) => (
                            <FaqItem key={item.id} item={item} />
                        ))}
                        {computed.filteredFaqs.length === 0 && <div className="text-center py-8 text-gray-500 text-xs">FAQ tidak ditemukan.</div>}
                    </div>
                    <SimplePagination page={state.pageFaqs} totalPages={Math.ceil(computed.filteredFaqs.length/PAGE_SIZE_FAQS)} setPage={actions.setPageFaqs} />
                </div>

                {/* CONTACT BOX */}
                <div className="bg-brand-orange/10 border border-brand-orange/30 p-5 rounded-xl text-center">
                    <p className="text-brand-orange text-[10px] font-bold uppercase tracking-widest mb-2">Mentok & Nyerah?</p>
                    <p className="text-gray-300 text-xs mb-4 leading-relaxed">
                        Udah mentok? Jangan dipaksa, Bos. Daripada makin ambyar, mending serahin ke teknisi gue.
                    </p>
                    <a 
                        href={`https://wa.me/${waNumber}?text=Halo Tim Teknis, saya butuh bantuan urgent.`}
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
      {state.selectedDownload && (
          <DownloadDetailModal 
            item={state.selectedDownload} 
            onClose={() => actions.setSelectedDownload(null)} 
          />
      )}
    </div>
  );
};
