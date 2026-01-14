
import React, { useState } from 'react';
import { LogOut, Zap, Activity, Eye, MousePointerClick, ChevronLeft, ChevronRight, Clock, ShoppingBag, Image as ImageIcon, FileText, Layout } from 'lucide-react';
import { AnalyticsStats } from './types';

// --- TABLE 1: Top Pages ---
export const TopPagesTable = ({ 
    pages, 
    onPageClick 
}: { 
    pages: { path: string; hits: number; avgTime: string }[], 
    onPageClick: (path: string) => void 
}) => {
    // UPDATED: Limit to 6 items per page
    const ITEMS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(pages.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = pages.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Helper to get Icon and Label
    const getPageContext = (path: string) => {
        if (path.includes('/shop/')) return { icon: ShoppingBag, label: 'PRODUK', color: 'text-green-400 bg-green-500/10 border-green-500/20' };
        if (path.includes('/gallery/')) return { icon: ImageIcon, label: 'PROYEK', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
        if (path.includes('/articles/')) return { icon: FileText, label: 'ARTIKEL', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' };
        if (path.includes('/services/')) return { icon: Zap, label: 'JASA', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
        return { icon: Layout, label: 'PAGE', color: 'text-gray-400 bg-gray-500/10 border-gray-500/20' };
    };

    return (
        <div className="lg:col-span-2 bg-brand-dark border border-white/5 rounded-xl p-4 md:p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2 shrink-0">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Konten Terlaris</h4>
                <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded">Total: {pages.length}</span>
            </div>
            
            <div className="space-y-2 flex-grow">
                {currentData.map((item, idx) => {
                    const page = item.path;
                    const count = item.hits;
                    const avgTime = item.avgTime;
                    const rank = startIndex + idx + 1;
                    
                    const { icon: Icon, label, color } = getPageContext(page);

                    return (
                        <div 
                            key={idx} 
                            onClick={() => onPageClick(page)}
                            className="flex justify-between items-center p-2 md:p-2.5 bg-white/5 rounded-lg border border-white/5 hover:border-brand-orange hover:bg-brand-orange/5 transition-all group cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex items-center gap-2 md:gap-3 overflow-hidden relative z-10 flex-1">
                                <span className="w-5 h-5 md:w-6 md:h-6 rounded bg-black/50 text-gray-500 flex items-center justify-center text-[9px] md:text-[10px] font-bold shrink-0 border border-white/5 group-hover:text-brand-orange group-hover:border-brand-orange/50 transition-colors">
                                    {rank}
                                </span>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-[10px] md:text-xs text-white font-medium truncate w-full group-hover:text-brand-orange transition-colors">{page}</span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className={`text-[8px] md:text-[9px] px-1.5 py-0.5 rounded w-fit font-bold border flex items-center gap-1 ${color}`}>
                                            <Icon size={8} /> {label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 md:gap-3 relative z-10 shrink-0">
                                {/* AVG TIME INDICATOR (Hidden on Mobile) */}
                                <div className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded border ${avgTime !== '-' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-white/5 border-white/5 text-gray-600'}`} title="Rata-rata Durasi Baca">
                                    <Clock size={10} />
                                    <span className="text-[10px] font-mono font-bold">{avgTime}</span>
                                </div>

                                <span className="text-xs md:text-sm font-bold text-white bg-black/40 px-2 py-1 md:px-3 md:py-1 rounded border border-white/10 shadow-sm group-hover:border-brand-orange/30 group-hover:text-brand-orange transition-colors min-w-[50px] md:min-w-[70px] text-center">
                                    {count} Hits
                                </span>
                            </div>
                        </div>
                    )
                })}
                {pages.length === 0 && <p className="text-gray-500 text-xs italic text-center py-4">Belum ada data.</p>}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-6 pt-4 border-t border-white/5 shrink-0">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-brand-orange/20 text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-xs font-bold text-gray-400">
                        <span className="text-brand-orange">{currentPage}</span> / {totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-brand-orange/20 text-white disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

// --- TABLE 2: Exit Pages ---
export const ExitPagesList = ({ pages }: { pages: [string, number][] }) => (
    <div className="bg-brand-dark border border-white/5 rounded-xl p-5 md:p-6">
        <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <LogOut size={16} className="text-red-400"/> Top Exit Pages
        </h4>
        <p className="text-[10px] text-gray-500 mb-4">Halaman terakhir dilihat user.</p>
        <div className="space-y-2">
            {pages.map(([page, count], idx) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 p-1 rounded transition-colors">
                    <span className="text-gray-300 truncate max-w-[150px] md:max-w-[180px]">{page}</span>
                    <span className="text-red-400 font-bold">{count} Exit</span>
                </div>
            ))}
            {pages.length === 0 && <p className="text-[10px] text-gray-500 italic">Belum ada data.</p>}
        </div>
    </div>
);

// --- PANEL: Quality Score ---
export const QualityScorePanel = ({ bounceRate, avgPages }: { bounceRate: number, avgPages: string }) => (
    <div className="bg-brand-dark border border-white/5 rounded-xl p-5 md:p-6 flex flex-col justify-between">
        <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <Zap size={16} className="text-yellow-400"/> Quality Score
            </h4>
            <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group hover:border-yellow-500/30 transition-colors">
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Bounce Rate</p>
                        <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors">{bounceRate}%</h3>
                    </div>
                    <div className={`text-[10px] px-2 py-1 rounded font-bold ${bounceRate < 40 ? 'bg-green-500/20 text-green-400' : bounceRate < 70 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {bounceRate < 40 ? 'Excellent' : bounceRate < 70 ? 'Normal' : 'High'}
                    </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Avg. Pages/Visit</p>
                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{avgPages}</h3>
                    </div>
                    <Activity size={20} className="text-blue-400"/>
                </div>
            </div>
        </div>
    </div>
);
