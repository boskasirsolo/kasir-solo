
import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPageContext } from './ui-utils';

// FIX: Added React.FC type to support 'key' prop in lists and ensure standard component prop behavior
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
            className="flex justify-between items-center p-3.5 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-brand-orange/40 transition-all group cursor-pointer hover:bg-brand-orange/5"
        >
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-[10px] font-black text-gray-600 border border-white/5 group-hover:text-brand-orange transition-colors shrink-0">
                    {rank}
                </span>
                <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs md:text-sm text-white font-bold truncate group-hover:text-brand-orange transition-colors">{path}</span>
                    <div className="mt-1">
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-black border uppercase tracking-widest ${color}`}>
                            {label}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4 md:gap-8 shrink-0 ml-4">
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-white group-hover:text-brand-orange transition-colors">{hits}</p>
                    <p className="text-[8px] text-gray-600 font-black uppercase tracking-tighter">Views</p>
                </div>
                <div className="text-right hidden sm:block border-l border-white/5 pl-4 md:pl-8">
                    <p className="text-xs font-black text-blue-400 group-hover:text-white transition-colors">{avgTime}</p>
                    <p className="text-[8px] text-gray-600 font-black uppercase tracking-tighter">Engagement</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-600 group-hover:bg-brand-orange group-hover:text-white transition-all">
                    <ArrowRight size={14} />
                </div>
            </div>
        </div>
    );
};

// FIX: Added React.FC type to support 'key' prop in lists and ensure standard component prop behavior
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
        <div className="flex justify-between items-center text-sm mb-3 font-bold">
            <span className="text-gray-200 truncate max-w-[320px] group-hover/item:text-white transition-colors">{path}</span>
            <span className="text-red-500 font-black font-mono text-base">{count}</span>
        </div>
        <div className="w-full bg-red-500/5 h-3.5 rounded-full overflow-hidden border border-white/5">
            <div 
                className="h-full bg-red-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(239,68,68,0.6)]" 
                style={{ width: `${percent}%` }}
            ></div>
        </div>
    </div>
);

// FIX: Explicitly typed as React.FC for consistent component definition
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
        <div className="flex justify-center items-center gap-6 mt-8 pt-6 border-t border-white/5 relative z-10">
            <button 
                onClick={onPrev} 
                disabled={currentPage === 1} 
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all border border-white/10"
            >
                <ChevronLeft size={20} className="text-white"/>
            </button>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                Hal <span className="text-brand-orange">{currentPage}</span> / {totalPages}
            </span>
            <button 
                onClick={onNext} 
                disabled={currentPage === totalPages} 
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all border border-white/10"
            >
                <ChevronRight size={20} className="text-white"/>
            </button>
        </div>
    );
};

// FIX: Explicitly typed as React.FC for consistent component definition
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
    <div className="p-8 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all group/box shadow-inner">
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{label}</p>
        <div className="flex justify-between items-end">
            <h3 className="text-4xl font-display font-black text-white transition-colors">{value}{unit === '%' && '%'}</h3>
            {badgeLabel ? (
                <div className={`text-[9px] px-2 py-0.5 rounded font-black uppercase border ${badgeColor}`}>
                    {badgeLabel}
                </div>
            ) : unit && (
                <span className="text-[9px] text-gray-600 font-black uppercase mb-1">{unit}</span>
            )}
        </div>
    </div>
);
