
import React, { useEffect, useMemo } from 'react';
import { RefreshCw, ShieldCheck, FileText, Scale, ChevronRight, HelpCircle, MessageCircle, Info } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import { RefundContent, PrivacyContent, TermsContent } from './content';
import { SiteConfig } from '../../types';

export const LegalPage = ({ config }: { config?: SiteConfig }) => {
  const { type } = useParams();
  const navigate = useNavigate();
  const waNumber = config?.whatsapp_number || "6282325103336";

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const LEGAL_TABS = useMemo(() => [
    { id: 'refund', label: 'Refund & Garansi', icon: RefreshCw, component: <RefundContent waNumber={waNumber} /> },
    { id: 'privacy', label: 'Kebijakan Privasi', icon: ShieldCheck, component: <PrivacyContent /> },
    { id: 'terms', label: 'Syarat & Ketentuan', icon: FileText, component: <TermsContent /> },
  ], [waNumber]);

  const activeTab = LEGAL_TABS.find(t => t.id === type);

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-20 animate-fade-in">
      <div className="container mx-auto px-4">
        
        {/* MOBILE TABS (Sticky Top for Mobile) */}
        <div className="lg:hidden sticky top-[70px] z-30 bg-brand-black/90 backdrop-blur-md py-3 -mx-4 px-4 border-b border-white/10 mb-8 overflow-x-auto custom-scrollbar">
            <div className="flex gap-2 min-w-max">
                {LEGAL_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => navigate(`/legal/${tab.id}`)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      type === tab.id 
                        ? 'bg-brand-orange text-white border-brand-orange shadow-neon' 
                        : 'bg-white/5 text-gray-400 border-white/10'
                    }`}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
            </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* SIDEBAR NAVIGATION (Desktop) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-28">
            <div className="bg-brand-card border border-white/10 rounded-2xl p-5 shadow-lg mb-6">
              <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 px-2">
                <Scale size={16} className="text-brand-orange"/> Dokumen Hukum
              </h4>
              <nav className="space-y-2">
                {LEGAL_TABS.map((tab) => {
                  const isActive = type === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => navigate(`/legal/${tab.id}`)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all group relative overflow-hidden ${
                        isActive 
                          ? 'bg-brand-orange text-white shadow-neon translate-x-2' 
                          : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <tab.icon size={18} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-brand-orange'} />
                      <span className="relative z-10">{tab.label}</span>
                      {isActive && <ChevronRight size={16} className="ml-auto relative z-10" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* PERSONAL HELP BOX */}
            <div className="p-6 bg-brand-dark rounded-2xl border border-white/5 relative overflow-hidden group">
                {/* Decor */}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <HelpCircle size={60} className="text-brand-orange"/>
                </div>

                <div className="relative z-10">
                    <p className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Info size={12}/> Help Center
                    </p>
                    <h4 className="text-white font-bold text-lg mb-2">Pusing Baca Pasal?</h4>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                        Bahasa hukum emang ribet, Bos. Kalau lo ragu atau ada yang ngeganjel, jangan dipendam. Chat gue, gue jelasin poin-poinnya pake bahasa tongkrongan biar clear.
                    </p>
                    <a 
                        href={`https://wa.me/${waNumber}?text=Halo Mas Amin, tolong jelasin soal garansi/legalitas dong, saya bingung bahasanya...`}
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-brand-orange to-red-600 hover:from-brand-orange hover:to-red-500 rounded-xl text-xs font-bold text-white transition-all gap-2 shadow-neon hover:shadow-neon-strong transform hover:-translate-y-0.5"
                    >
                        <MessageCircle size={16}/> Chat Admin Legal
                    </a>
                </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-9">
            <div className="bg-brand-card border border-white/5 rounded-3xl p-6 md:p-10 min-h-[600px] shadow-2xl relative overflow-hidden">
               {/* Background Decorative */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>
               
               <div className="relative z-10">
                   {activeTab ? (
                       activeTab.component
                   ) : (
                       <div className="text-center py-20 flex flex-col items-center">
                           <div className="w-24 h-24 bg-brand-dark rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-neon">
                                <Scale size={48} className="text-brand-orange"/>
                           </div>
                           <h3 className="text-2xl font-display font-bold text-white mb-3">Pusat Kebijakan</h3>
                           <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
                               Transparansi adalah kunci kepercayaan. Silakan pilih menu di sebelah kiri (atau atas) untuk membaca detail aturan main kami.
                           </p>
                           <Button onClick={() => navigate('/legal/refund')} className="px-8 py-3 shadow-neon">
                               Buka Kebijakan Refund
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
