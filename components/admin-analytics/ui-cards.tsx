import React, { useState } from 'react';
import { Eye, Users, TrendingUp, Globe, Zap, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnalyticsStats } from './types';
import { MetricBlock } from './ui-parts';

export const KPIGrid = ({ stats }: { stats: AnalyticsStats }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricBlock 
            label="Views Radar" 
            value={stats.totalViews.value} 
            trend={stats.totalViews.percentage} 
            icon={Eye} 
            color="text-blue-500" 
        />
        <MetricBlock 
            label="Calon Juragan" 
            value={stats.uniqueVisitors.value} 
            trend={stats.uniqueVisitors.percentage} 
            icon={Users} 
            color="text-purple-500" 
        />
        <MetricBlock 
            label="Sinyal Cuan" 
            value={stats.totalActions.value} 
            trend={stats.totalActions.percentage} 
            icon={Zap} 
            color="text-brand-orange" 
        />
        <MetricBlock 
            label="Efisiensi Ruko" 
            value={`${stats.conversionRate.value}%`} 
            trend={stats.conversionRate.percentage} 
            icon={TrendingUp} 
            color="text-green-500" 
        />
    </div>
);

export const ReferrerList = ({ referrers, totalViews }: { referrers: [string, number][], totalViews: number }) => {
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);
    
    const totalPages = Math.ceil(referrers.length / ITEMS_PER_PAGE);
    const currentData = referrers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const maxCount = Math.max(...referrers.map(([, count]) => count), 1);

    return (
        <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 flex flex-col h-full min-h-[400px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Globe size={80} /></div>
            
            <div className="flex justify-between items-start relative z-10 mb-4">
                <div>
                    <h4 className="text-white font-black text-xs flex items-center gap-2 uppercase tracking-widest">
                        <Globe size={14} className="text-blue-400"/> Pintu Masuk (Traffic)
                    </h4>
                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">Darimana calon juragan dateng:</p>
                </div>
                {totalPages > 1 && (
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-colors border border-white/10"><ChevronLeft size={14}/></button>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-colors border border-white/10"><ChevronRight size={14}/></button>
                    </div>
                )}
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1 relative z-10">
                {currentData.map(([ref, count], idx) => {
                    const percent = Math.round((count / maxCount) * 100);
                    return (
                        <div key={idx} className="group/item">
                            <div className="flex justify-between items-center text-[10px] mb-2 font-mono">
                                 <span className="text-gray-400 truncate max-w-[220px] group-hover/item:text-white transition-colors flex items-center gap-1.5">
                                    <ExternalLink size={10} className="text-gray-600" /> {ref}
                                 </span>
                                 <span className="text-blue-400 font-black">{count}</span>
                            </div>
                            <div className="w-full bg-blue-500/5 h-1.5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                <div 
                                    className="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.4)]" 
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
                {referrers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 opacity-20 uppercase tracking-widest">
                        <p className="text-[10px] italic font-bold">No signals detected.</p>
                    </div>
                )}
            </div>
            <p className="text-[9px] text-gray-700 mt-6 font-bold uppercase tracking-widest text-center italic shrink-0 relative z-10">Berdasarkan HTTP Referer & UTM Audit</p>
        </div>
    );
};