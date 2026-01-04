
import React, { useEffect, useMemo } from 'react';
import { RefreshCw, ShieldCheck, FileText, Scale, ChevronRight, HelpCircle, MessageCircle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';
import { RefundContent, PrivacyContent, TermsContent } from '../components/legal-parts';

export const LegalPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const LEGAL_TABS = useMemo(() => [
    { id: 'refund', label: 'Refund & Garansi', icon: RefreshCw, component: <RefundContent /> },
    { id: 'privacy', label: 'Kebijakan Privasi', icon: ShieldCheck, component: <PrivacyContent /> },
    { id: 'terms', label: 'Syarat & Ketentuan', icon: FileText, component: <TermsContent /> },
  ], []);

  const activeTab = LEGAL_TABS.find(t => t.id === type);

  return (
    <div className="min-h-screen bg-brand-black pt-28 pb-20 animate-fade-in">
      <div className="container mx-auto px-4">
        
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR NAVIGATION - UPDATED STYLE */}
          <div className="lg:col-span-3">
            <div className="bg-brand-card border border-white/10 rounded-2xl p-5 sticky top-28 shadow-lg">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <Scale size={14} className="text-brand-orange"/> Dokumen Hukum
              </h4>
              <nav className="space-y-2">
                {LEGAL_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => navigate(`/legal/${tab.id}`)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all group border ${
                      type === tab.id 
                        ? 'bg-brand-orange text-white shadow-neon border-brand-orange' 
                        : 'bg-black/20 text-gray-400 border-transparent hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <tab.icon size={16} className={type === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-brand-orange'} />
                    {tab.label}
                    {type === tab.id && <ChevronRight size={14} className="ml-auto" />}
                  </button>
                ))}
              </nav>

              {/* PERSONAL HELP BOX */}
              <div className="mt-8 p-5 bg-brand-dark rounded-2xl border border-white/5 relative overflow-hidden group">
                {/* Decor */}
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <HelpCircle size={50}/>
                </div>

                <p className="text-sm text-white mb-2 font-bold relative z-10">Bingung Bahasa Hukum?</p>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed relative z-10">
                    Gak usah pusing baca pasal-pasal ribet. Kalau ada yang ngeganjel atau lo ragu, langsung chat gue aja biar clear.
                </p>
                <a 
                    href="https://wa.me/6282325103336?text=Halo Mas Amin, saya mau tanya soal legalitas dan garansi biar lebih paham..." 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center w-full py-3 bg-brand-gradient hover:bg-brand-gradient-hover rounded-xl text-xs font-bold text-white transition-all gap-2 shadow-neon relative z-10 transform hover:-translate-y-0.5"
                >
                    <MessageCircle size={16}/> Chat Tim Legal
                </a>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-9">
            <div className="bg-brand-card border border-white/5 rounded-2xl p-6 md:p-10 min-h-[600px] shadow-2xl relative overflow-hidden">
               {/* Background Decorative */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>
               
               <div className="relative z-10">
                   {activeTab ? (
                       activeTab.component
                   ) : (
                       <div className="text-center py-20 flex flex-col items-center">
                           <div className="w-20 h-20 bg-brand-dark rounded-full flex items-center justify-center mb-6 border border-white/10">
                                <Scale size={40} className="text-brand-orange opacity-50"/>
                           </div>
                           <h3 className="text-xl font-bold text-white mb-2">Pusat Kebijakan</h3>
                           <p className="text-gray-500 max-w-md mx-auto mb-8">
                               Transparansi adalah kunci kepercayaan. Silakan pilih menu kebijakan di sebelah kiri untuk membaca detail aturan main kami.
                           </p>
                           <Button onClick={() => navigate('/legal/refund')} className="px-8 shadow-neon">
                               Lihat Kebijakan Refund
                           </Button>
                       </div>
                   )}
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
