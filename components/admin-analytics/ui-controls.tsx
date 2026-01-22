
import React, { useState } from 'react';
import { BarChart3, ShieldCheck, Check, Copy, RefreshCw } from 'lucide-react';

export const DashboardHeader = ({ 
    period, 
    setPeriod,
    onRefresh,
    isRefreshing,
    aiInsights // NEW PROP
}: { 
    period: number, 
    setPeriod: (d: number) => void,
    onRefresh: () => void,
    isRefreshing: boolean,
    aiInsights?: React.ReactNode // NEW TYPE
}) => {
    const isGhostMode = typeof window !== 'undefined' && localStorage.getItem('mks_ghost_mode') === 'true';

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-brand-card/30 p-4 rounded-xl border border-white/5 gap-4 mb-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="bg-brand-orange/10 p-2 rounded-lg text-brand-orange shrink-0">
                    <BarChart3 size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Traffic Command Center</h3>
                    <p className="text-xs text-gray-500">Live analytics pengunjung website.</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                {/* AI INSIGHTS BUTTON MOVED HERE */}
                {aiInsights}

                <button 
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-brand-orange rounded-lg border border-white/5 transition-all group"
                    title="Refresh Data"
                >
                    <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin text-brand-orange' : 'group-hover:rotate-180 transition-transform'}`} />
                </button>

                {isGhostMode && (
                    <span className="hidden sm:flex text-[10px] font-bold text-green-500 items-center gap-1 bg-green-900/20 px-3 py-1.5 rounded-full border border-green-500/30 animate-pulse whitespace-nowrap">
                        <ShieldCheck size={12}/> Ghost Mode
                    </span>
                )}
                
                <div className="bg-black/40 rounded-lg p-1 border border-white/10 flex">
                    {[7, 30].map(d => (
                        <button 
                            key={d}
                            onClick={() => setPeriod(d)}
                            className={`px-4 py-1.5 text-[10px] font-bold rounded-md transition-all ${period === d ? 'bg-brand-orange text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                        >
                            {d}D
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const GhostLinkCopier = () => {
    const [copied, setCopied] = useState(false);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const ghostLink = `${origin}/?mode=ghost_access`;
  
    const copyLink = () => {
      navigator.clipboard.writeText(ghostLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
  
    return (
      <div className="bg-brand-dark border border-white/5 rounded-xl p-6 h-full flex flex-col justify-center items-center text-center">
         <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
            <ShieldCheck size={32} className="text-green-400" />
         </div>
         <h4 className="text-white font-bold text-sm mb-2">Ghost Access Link</h4>
         <p className="text-[10px] text-gray-500 mb-6 leading-relaxed max-w-[200px]">
            Gunakan link ini di device baru agar tidak terhitung dalam analytics (Admin Mode).
         </p>
         
         <button 
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-gray-300 transition-all w-full justify-center"
         >
            {copied ? <Check size={14} className="text-green-400"/> : <Copy size={14} />}
            {copied ? 'Link Disalin!' : 'Salin Ghost Link'}
         </button>
      </div>
    );
};
