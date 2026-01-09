
import React from 'react';
import { LogOut, Zap, Activity, Eye, MousePointerClick } from 'lucide-react';
import { AnalyticsStats } from './types';

// --- TABLE 1: Top Pages ---
export const TopPagesTable = ({ 
    pages, 
    onPageClick 
}: { 
    pages: [string, number][], 
    onPageClick: (path: string) => void 
}) => (
    <div className="lg:col-span-2 bg-brand-dark border border-white/5 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Konten Terlaris</h4>
            <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded">Top 6 Pages</span>
        </div>
        <div className="space-y-2">
            {pages.map(([page, count], idx) => {
                const isProduct = page.includes('/shop/');
                const isArticle = page.includes('/articles/');
                const typeLabel = isProduct ? 'PRODUK' : isArticle ? 'ARTIKEL' : 'HALAMAN';
                const typeColor = isProduct ? 'text-green-400 bg-green-500/10 border-green-500/20' : isArticle ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-gray-400 bg-gray-500/10 border-gray-500/20';

                return (
                    <div 
                        key={idx} 
                        onClick={() => onPageClick(page)}
                        className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-brand-orange hover:bg-brand-orange/5 transition-all group cursor-pointer relative overflow-hidden"
                    >
                        <div className="flex items-center gap-3 overflow-hidden relative z-10">
                            <span className="w-6 h-6 rounded bg-black/50 text-gray-500 flex items-center justify-center text-[10px] font-bold shrink-0 border border-white/5 group-hover:text-brand-orange group-hover:border-brand-orange/50 transition-colors">
                                {idx+1}
                            </span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs text-white font-medium truncate max-w-[200px] md:max-w-sm group-hover:text-brand-orange transition-colors">{page}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded w-fit mt-0.5 font-bold border ${typeColor}`}>{typeLabel}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="flex items-center gap-1 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                                <MousePointerClick size={12}/> Detail
                            </div>
                            <span className="text-sm font-bold text-white shrink-0 bg-black/40 px-3 py-1 rounded border border-white/10 shadow-sm group-hover:border-brand-orange/30 group-hover:text-brand-orange transition-colors">
                                {count} Hits
                            </span>
                        </div>
                    </div>
                )
            })}
            {pages.length === 0 && <p className="text-gray-500 text-xs italic">Belum ada data.</p>}
        </div>
    </div>
);

// --- TABLE 2: Exit Pages ---
export const ExitPagesList = ({ pages }: { pages: [string, number][] }) => (
    <div className="bg-brand-dark border border-white/5 rounded-xl p-6">
        <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <LogOut size={16} className="text-red-400"/> Top Exit Pages
        </h4>
        <p className="text-[10px] text-gray-500 mb-4">Halaman terakhir yang dilihat user sebelum pergi.</p>
        <div className="space-y-2">
            {pages.map(([page, count], idx) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 p-1 rounded transition-colors">
                    <span className="text-gray-300 truncate max-w-[180px]">{page}</span>
                    <span className="text-red-400 font-bold">{count} Exit</span>
                </div>
            ))}
            {pages.length === 0 && <p className="text-[10px] text-gray-500 italic">Belum ada data.</p>}
        </div>
    </div>
);

// --- PANEL: Quality Score ---
export const QualityScorePanel = ({ bounceRate, avgPages }: { bounceRate: number, avgPages: string }) => (
    <div className="bg-brand-dark border border-white/5 rounded-xl p-6 flex flex-col justify-between">
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
