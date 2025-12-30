
import React, { useEffect, useMemo } from 'react';
import { RefreshCw, ShieldCheck, FileText, Scale, ChevronRight, HelpCircle } from 'lucide-react';
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
          
          {/* SIDEBAR NAVIGATION */}
          <div className="lg:col-span-3">
            <div className="bg-brand-card border border-white/5 rounded-xl p-4 sticky top-28 shadow-lg">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
                <Scale size={14}/> Legalitas
              </h4>
              <nav className="space-y-1">
                {LEGAL_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => navigate(`/legal/${tab.id}`)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all group ${
                      type === tab.id 
                        ? 'bg-brand-orange text-white shadow-neon' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <tab.icon size={18} className={type === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-brand-orange'} />
                    {tab.label}
                    {type === tab.id && <ChevronRight size={16} className="ml-auto" />}
                  </button>
                ))}
              </nav>

              <div className="mt-8 p-4 bg-brand-dark rounded-lg border border-white/5">
                <p className="text-xs text-gray-400 mb-3 font-bold">Butuh bantuan khusus?</p>
                <a 
                    href="https://wa.me/6282325103336" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center w-full py-2 bg-white/5 hover:bg-white/10 border border-brand-orange rounded text-xs font-bold text-white transition-colors gap-2"
                >
                    <HelpCircle size={14}/> Hubungi Admin
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
                           <Button onClick={() => navigate('/legal/refund')} className="px-8">
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
