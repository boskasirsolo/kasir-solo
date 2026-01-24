import React, { useState } from 'react';
import { LogOut, Eye, Sparkles, AlertTriangle, Zap } from 'lucide-react';
import { PageHitsRow, ExitSourceRow, AnalyticsPagination, QualityScoreBox } from './ui-molecules';

/**
 * Organisme: Tabel Konten Terlaris
 * Assembly: PageHitsRow + AnalyticsPagination
 */
export const TopPagesTable = ({ 
    pages, 
    onPageClick 
}: { 
    pages: { path: string; hits: number; avgTime: string }[], 
    onPageClick: (path: string) => void 
}) => {
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(pages.length / ITEMS_PER_PAGE);
    const currentData = pages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col h-full shadow-2xl relative overflow-hidden min-h-[1064px]">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Eye size={120}/></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/5 pb-5 gap-4 relative z-10">
                <div>
                    <h4 className="text-white font-black text-lg uppercase tracking-wider flex items-center gap-2">
                        <Sparkles size={18} className="text-brand-orange animate-pulse"/> Konten Paling Cuan
                    </h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Audit Traffic & Durasi Tiap Halaman</p>
                </div>
                <div className="bg-black/40 px-3 py-1.5 rounded-full border border-white/5 text-[10px] font-mono text-gray-500">
                    Total: {pages.length} Assets
                </div>
            </div>
            
            <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar relative z-10 pr-2">
                {currentData.map((item, idx) => (
                    <PageHitsRow 
                        key={idx} 
                        rank={((currentPage - 1) * ITEMS_PER_PAGE) + idx + 1}
                        {...item} 
                        onClick={() => onPageClick(item.path)} 
                    />
                ))}
                {pages.length === 0 && <p className="text-center py-20 text-gray-600 italic text-xs">Belum ada jejak konten...</p>}
            </div>

            <AnalyticsPagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPrev={() => setCurrentPage(p => Math.max(1, p - 1))} 
                onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            />
        </div>
    );
};

/**
 * Organisme: List Titik Pamit (Exit Points)
 * Assembly: ExitSourceRow + Custom Navigation
 */
export const ExitPagesList = ({ pages }: { pages: [string, number][] }) => {
    const ITEMS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);
    
    const totalPages = Math.ceil(pages.length / ITEMS_PER_PAGE);
    const currentData = pages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const maxExit = Math.max(...pages.map(([, count]) => count), 1);
    
    return (
        <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group flex flex-col h-full min-h-[520px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform"><LogOut size={100}/></div>
            
            <div className="flex justify-between items-start relative z-10 mb-8">
                <div>
                    <h4 className="text-white font-black text-base flex items-center gap-2 uppercase tracking-widest">
                        <LogOut size={20} className="text-red-500"/> Exit Points (Titik Pamit)
                    </h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Halaman terakhir sebelum kabur:</p>
                </div>
                
                {/* Compact Control for Header Area */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white disabled:opacity-20 transition-all"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <span className="text-[9px] font-mono text-gray-600">{currentPage}/{totalPages}</span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white disabled:opacity-20 transition-all"
                    >
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-10 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-1">
                {currentData.map(([page, count], idx) => (
                    <ExitSourceRow 
                        key={idx} 
                        path={page} 
                        count={count} 
                        percent={Math.round((count / maxExit) * 100)} 
                    />
                ))}
                {pages.length === 0 && <p className="text-sm text-gray-700 italic text-center py-10 uppercase font-bold tracking-widest">Aman, Belum ada exit.</p>}
            </div>
            
            <div className="mt-8 p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex gap-3 items-center shrink-0 relative z-10">
                <AlertTriangle size={20} className="text-red-500 shrink-0" />
                <p className="text-[9px] text-gray-500 leading-relaxed italic uppercase font-bold">Analisa halaman ini. Mungkin copy atau UI-nya kurang nge-hook.</p>
            </div>
        </div>
    );
};

/**
 * Organisme: Panel Skor Kualitas
 * Assembly: QualityScoreBox
 */
export const QualityScorePanel = ({ bounceRate, avgPages }: { bounceRate: number, avgPages: string }) => {
    const getBounceStatus = () => {
        if (bounceRate < 40) return { label: 'LOW', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
        if (bounceRate < 70) return { label: 'NORMAL', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30' };
        return { label: 'HIGH', color: 'bg-red-500/20 text-red-500 border-red-500/30' };
    };

    const status = getBounceStatus();

    return (
        <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 flex flex-col justify-center shadow-2xl relative overflow-hidden min-h-[480px]">
            <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none"><Zap size={100}/></div>
            <h4 className="text-white font-black text-xs mb-8 flex items-center gap-2 uppercase tracking-widest relative z-10">
                <Zap size={14} className="text-yellow-400"/> Quality Score
            </h4>
            
            <div className="space-y-6 relative z-10">
                <QualityScoreBox 
                    label="Boncos Rate (Bounce)" 
                    value={bounceRate} 
                    unit="%" 
                    badgeLabel={status.label} 
                    badgeColor={status.color} 
                />
                <QualityScoreBox 
                    label="Kedalaman Jelajah" 
                    value={avgPages} 
                    unit="Hal / Visit" 
                />
            </div>
        </div>
    );
};

import { ArrowLeft, ArrowRight } from 'lucide-react';