import React, { useState } from 'react';
import { LogOut, Zap, Clock, ShoppingBag, ImageIcon, FileText, Layout, ChevronLeft, ChevronRight, Eye, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';
import { formatRupiah } from '../../utils';

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

    const getPageContext = (path: string) => {
        if (path.includes('/shop/')) return { icon: ShoppingBag, label: 'PRODUK', color: 'text-green-400 border-green-500/20 bg-green-500/10' };
        if (path.includes('/gallery/')) return { icon: ImageIcon, label: 'PROYEK', color: 'text-purple-400 border-purple-500/20 bg-purple-500/10' };
        if (path.includes('/articles/')) return { icon: FileText, label: 'ARTIKEL', color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' };
        if (path.includes('/services/')) return { icon: Zap, label: 'JASA', color: 'text-blue-400 border-blue-500/20 bg-blue-500/10' };
        return { icon: Layout, label: 'PAGE', color: 'text-gray-400 border-gray-500/20 bg-gray-500/10' };
    };

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
                {currentData.map((item, idx) => {
                    const { icon: Icon, label, color } = getPageContext(item.path);
                    const rank = ((currentPage - 1) * ITEMS_PER_PAGE) + idx + 1;

                    return (
                        <div 
                            key={idx} 
                            onClick={() => onPageClick(item.path)}
                            className="flex justify-between items-center p-3.5 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-brand-orange/40 transition-all group cursor-pointer hover:bg-brand-orange/5"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <span className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-[10px] font-black text-gray-600 border border-white/5 group-hover:text-brand-orange transition-colors shrink-0">
                                    {rank}
                                </span>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-xs md:text-sm text-white font-bold truncate group-hover:text-brand-orange transition-colors">{item.path}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-black border uppercase tracking-widest ${color}`}>
                                            {label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 md:gap-8 shrink-0 ml-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-black text-white group-hover:text-brand-orange transition-colors">{item.hits}</p>
                                    <p className="text-[8px] text-gray-600 font-black uppercase tracking-tighter">Views</p>
                                </div>
                                <div className="text-right hidden sm:block border-l border-white/5 pl-4 md:pl-8">
                                    <p className="text-xs font-black text-blue-400 group-hover:text-white transition-colors">{item.avgTime}</p>
                                    <p className="text-[8px] text-gray-600 font-black uppercase tracking-tighter">Engagement</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-600 group-hover:bg-brand-orange group-hover:text-white transition-all">
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        </div>
                    )
                })}
                {pages.length === 0 && <p className="text-center py-20 text-gray-600 italic text-xs">Belum ada jejak konten...</p>}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-8 pt-6 border-t border-white/5 relative z-10">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                        disabled={currentPage === 1} 
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all border border-white/10"
                    >
                        <ChevronLeft size={20} className="text-white"/>
                    </button>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                        Hal <span className="text-brand-orange">{currentPage}</span> / {totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                        disabled={currentPage === totalPages} 
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-all border border-white/10"
                    >
                        <ChevronRight size={20} className="text-white"/>
                    </button>
                </div>
            )}
        </div>
    );
};

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
                {totalPages > 1 && (
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-colors border border-white/10"><ChevronLeft size={18}/></button>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-colors border border-white/10"><ChevronRight size={18}/></button>
                    </div>
                )}
            </div>

            <div className="space-y-10 relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-1">
                {currentData.map(([page, count], idx) => {
                    const percent = Math.round((count / maxExit) * 100);
                    return (
                        <div key={idx} className="group/item">
                            <div className="flex justify-between items-center text-sm mb-3 font-bold">
                                <span className="text-gray-200 truncate max-w-[320px] group-hover/item:text-white transition-colors">{page}</span>
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
                })}
                {pages.length === 0 && <p className="text-sm text-gray-700 italic text-center py-10 uppercase font-bold tracking-widest">Aman, Belum ada exit.</p>}
            </div>
            
            <div className="mt-8 p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex gap-3 items-center shrink-0 relative z-10">
                <AlertTriangle size={20} className="text-red-500 shrink-0" />
                <p className="text-[9px] text-gray-500 leading-relaxed italic uppercase font-bold">Analisa halaman ini. Mungkin copy atau UI-nya kurang nge-hook.</p>
            </div>
        </div>
    );
};

export const QualityScorePanel = ({ bounceRate, avgPages }: { bounceRate: number, avgPages: string }) => (
    <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 flex flex-col justify-center shadow-2xl relative overflow-hidden min-h-[480px]">
        <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none"><Zap size={100}/></div>
        <h4 className="text-white font-black text-xs mb-8 flex items-center gap-2 uppercase tracking-widest relative z-10">
            <Zap size={14} className="text-yellow-400"/> Quality Score
        </h4>
        <div className="space-y-6 relative z-10">
            <div className="p-8 bg-white/5 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-all group/box shadow-inner">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Boncos Rate (Bounce)</p>
                <div className="flex justify-between items-end">
                    <h3 className="text-4xl font-display font-black text-white group-hover/box:text-yellow-400 transition-colors">{bounceRate}%</h3>
                    <div className={`text-[9px] px-2 py-0.5 rounded font-black uppercase border ${bounceRate < 40 ? 'bg-green-500/20 text-green-400 border-green-500/30' : bounceRate < 70 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30'}`}>
                        {bounceRate < 40 ? 'LOW' : bounceRate < 70 ? 'NORMAL' : 'HIGH'}
                    </div>
                </div>
            </div>
            <div className="p-8 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group/box shadow-inner">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Kedalaman Jelajah</p>
                <div className="flex justify-between items-end">
                    <h3 className="text-4xl font-display font-black text-white group-hover/box:text-blue-400 transition-colors">{avgPages}</h3>
                    <span className="text-[9px] text-gray-600 font-black uppercase mb-1">Hal / Visit</span>
                </div>
            </div>
        </div>
    </div>
);