
import React, { useState } from 'react';
import { LogOut, Zap, Clock, ShoppingBag, ImageIcon, FileText, Layout, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export const TopPagesTable = ({ 
    pages, 
    onPageClick 
}: { 
    pages: { path: string; hits: number; avgTime: string }[], 
    onPageClick: (path: string) => void 
}) => {
    const ITEMS_PER_PAGE = 6;
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(pages.length / ITEMS_PER_PAGE);
    const currentData = pages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const getPageContext = (path: string) => {
        if (path.includes('/shop/')) return { icon: ShoppingBag, label: 'PRODUK', color: 'text-green-400 border-green-500/20 bg-green-500/10' };
        if (path.includes('/gallery/')) return { icon: ImageIcon, label: 'PROYEK', color: 'text-purple-400 border-purple-500/20 bg-purple-500/10' };
        if (path.includes('/articles/')) return { icon: FileText, label: 'ARTIKEL', color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' };
        if (path.includes('/services/')) return { icon: Zap, label: 'JASA', color: 'text-blue-400 border-blue-500/20 bg-blue-500/10' };
        return { icon: Layout, label: 'PAGE', color: 'text-gray-400 border-gray-500/20 bg-gray-500/10' };
    };

    return (
        <div className="lg:col-span-2 bg-brand-dark border border-white/5 rounded-xl p-4 md:p-6 flex flex-col h-full shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    <Eye size={16} className="text-brand-orange"/> Konten Terlaris
                </h4>
                <span className="text-[10px] text-gray-500 font-mono">Total: {pages.length}</span>
            </div>
            
            <div className="space-y-2 flex-grow overflow-y-auto custom-scrollbar">
                {currentData.map((item, idx) => {
                    const { icon: Icon, label, color } = getPageContext(item.path);
                    const rank = ((currentPage - 1) * ITEMS_PER_PAGE) + idx + 1;

                    return (
                        <div 
                            key={idx} 
                            onClick={() => onPageClick(item.path)}
                            className="flex justify-between items-center p-3 bg-brand-card/40 rounded-xl border border-white/5 hover:border-brand-orange/40 hover:bg-brand-card transition-all group cursor-pointer"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <span className="w-6 h-6 rounded bg-black flex items-center justify-center text-[10px] font-black text-gray-600 border border-white/10 group-hover:text-brand-orange group-hover:border-brand-orange/30 transition-colors">
                                    {rank}
                                </span>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-xs text-white font-bold truncate w-full group-hover:text-brand-orange transition-colors">{item.path}</span>
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded w-fit font-black mt-1 border ${color}`}>
                                        {label}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 shrink-0">
                                <div className="hidden sm:flex flex-col items-end">
                                    <p className="text-[8px] text-gray-600 font-black uppercase mb-0.5">Waktu Baca</p>
                                    <div className="flex items-center gap-1 text-blue-400 font-mono text-[10px] font-bold">
                                        <Clock size={10}/> {item.avgTime}
                                    </div>
                                </div>
                                <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 group-hover:border-brand-orange/20 text-center min-w-[70px] shadow-inner">
                                    <p className="text-[8px] text-gray-600 font-black uppercase mb-0.5">Hits</p>
                                    <span className="text-xs font-black text-white group-hover:text-brand-orange transition-colors">{item.hits}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6 pt-4 border-t border-white/5">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20"><ChevronLeft size={16}/></button>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hal <span className="text-brand-orange">{currentPage}</span> / {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20"><ChevronRight size={16}/></button>
                </div>
            )}
        </div>
    );
};

export const ExitPagesList = ({ pages }: { pages: [string, number][] }) => (
    <div className="bg-brand-dark border border-white/5 rounded-xl p-5 md:p-6 shadow-xl">
        <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <LogOut size={16} className="text-red-400"/> Exit Points
        </h4>
        <p className="text-[10px] text-gray-500 mb-6 leading-relaxed">Halaman tempat Juragan milih pamit dari web lo.</p>
        <div className="space-y-3">
            {pages.map(([page, count], idx) => (
                <div key={idx} className="flex flex-col border-b border-white/5 pb-2 last:border-0 group">
                    <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-gray-400 truncate max-w-[180px] group-hover:text-white transition-colors">{page}</span>
                        <span className="text-red-500 font-black font-mono">{count}</span>
                    </div>
                </div>
            ))}
            {pages.length === 0 && <p className="text-[10px] text-gray-500 italic">Data exit belum terekam.</p>}
        </div>
    </div>
);

export const QualityScorePanel = ({ bounceRate, avgPages }: { bounceRate: number, avgPages: string }) => (
    <div className="bg-brand-dark border border-white/5 rounded-xl p-5 md:p-6 flex flex-col justify-between shadow-xl">
        <div>
            <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2 uppercase tracking-widest">
                <Zap size={16} className="text-yellow-400"/> Quality Score
            </h4>
            <div className="space-y-4">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-all group">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Boncos Rate (Bounce)</p>
                    <div className="flex justify-between items-end">
                        <h3 className="text-3xl font-display font-black text-white group-hover:text-yellow-400 transition-colors">{bounceRate}%</h3>
                        <div className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${bounceRate < 40 ? 'bg-green-500/20 text-green-400' : bounceRate < 70 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-500'}`}>
                            {bounceRate < 40 ? 'LOW' : bounceRate < 70 ? 'NORMAL' : 'HIGH'}
                        </div>
                    </div>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Kedalaman Jelajah</p>
                    <div className="flex justify-between items-end">
                        <h3 className="text-3xl font-display font-black text-white group-hover:text-blue-400 transition-colors">{avgPages}</h3>
                        <span className="text-[9px] text-gray-600 font-black uppercase mb-1">Hal / Visit</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
