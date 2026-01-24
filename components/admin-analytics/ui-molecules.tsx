
import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPageContext } from './ui-utils';

// FIX: Padding dikurangi dari p-3.5 ke p-2.5 agar lebih rapat
export const PageHitsRow: React.FC<{ 
    rank: number; 
    path: string; 
    hits: number; 
    avgTime: string; 
    onClick: () => void 
}> = ({ 
    rank, 
    path, 
    hits, 
    avgTime, 
    onClick 
}) => {
    const { label, color } = getPageContext(path);
    return (
        <div 
            onClick={onClick}
            className="flex justify-between items-center p-2.5 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-brand-orange/40 transition-all group cursor-pointer hover:bg-brand-orange/5"
        >
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <span className="w-6 h-6 rounded-lg bg-black flex items-center justify-center text-[9px] font-black text-gray-600 border border-white/5 group-hover:text-brand-orange transition-colors shrink-0">
                    {rank}
                </span>
                <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs text-white font-bold truncate group-hover:text-brand-orange transition-colors">{path}</span>
                    <div className="mt-0.5">
                        <span className={`text-[7px] px-1.5 py-0 rounded-md font-black border uppercase tracking-widest ${color}`}>
                            {label}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4 md:gap-6 shrink-0 ml-4">
                <div className="text-right hidden sm:block">
                    <p className="text-[11px] font-black text-white group-hover:text-brand-orange transition-colors">{hits}</p>
                    <p className="text-[7px] text-gray-600 font-black uppercase tracking-tighter">Views</p>
                </div>
                <div className="text-right hidden sm:block border-l border-white/5 pl-4 md:pl-6">
                    <p className="text-[11px] font-black text-blue-400 group-hover:text-white transition-colors">{avgTime}</p>
                    <p className="text-[7px] text-gray-600 font-black uppercase tracking-tighter">Engagement</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-gray-600 group-hover:bg-brand-orange group-hover:text-white transition-all">
                    <ArrowRight size={12} />
                </div>
            </div>
        </div>
    );
};

// FIX: Jarak mb-3 dikurangi ke mb-2, h-3.5 dikurangi ke h-2
export const ExitSourceRow: React.FC<{ 
    path: string; 
    count: number; 
    percent: number 
}> = ({ 
    path, 
    count, 
    percent 
}) => (
    <div className="group/item">
        <div className="flex justify-between items-center text-xs mb-2 font-bold">
            <span className="text-gray-300 truncate max-w-[280px] group-hover/item:text-white transition-colors">{path}</span>
            <span className="text-red-500 font-black font-mono text-sm">{count}</span>
        </div>
        <div className="w-full bg-red-500/5 h-2 rounded-full overflow-hidden border border-white/5">
            <div 
                className="h-full bg-red-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(239,68,68,0.6)]" 
                style={{ width: `${percent}%` }}
            ></div>
        </div>
    </div>
);

export const AnalyticsPagination: React.FC<{ 
    currentPage: number; 
    totalPages: number; 
    onPrev: () => void; 
    onNext: () => void; 
}> = ({ 
    currentPage, 
    totalPages, 
    onPrev, 
    onNext 
}) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-center items-center gap-6 mt-4 pt-4 border-t border-white/5 relative z-10">
            <button 
                onClick={onPrev} 
                disabled={currentPage === 1} 
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all border border-white/10"
            >
                <ChevronLeft size={16} className="text-white"/>
            </button>
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                Hal <span className="text-brand-orange">{currentPage}</span> / {totalPages}
            </span>
            <button 
                onClick={onNext} 
                disabled={currentPage === totalPages} 
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all border border-white/10"
            >
                <ChevronRight size={16} className="text-white"/>
            </button>
        </div>
    );
};

// FIX: Padding dikurangi dari p-6 ke p-4 agar lebih compact
export const QualityScoreBox: React.FC<{ 
    label: string; 
    value: string | number; 
    badgeLabel?: string; 
    badgeColor?: string; 
    unit?: string 
}> = ({ 
    label, 
    value, 
    badgeLabel, 
    badgeColor, 
    unit 
}) => (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all group/box shadow-inner">
        <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-1">{label}</p>
        <div className="flex justify-between items-end">
            <h3 className="text-2xl font-display font-black text-white transition-colors">{value}{unit === '%' && '%'}</h3>
            {badgeLabel ? (
                <div className={`text-[8px] px-2 py-0.5 rounded font-black uppercase border ${badgeColor}`}>
                    {badgeLabel}
                </div>
            ) : unit && (
                <span className="text-[8px] text-gray-700 font-black uppercase mb-1">{unit}</span>
            )}
        </div>
    </div>
);
