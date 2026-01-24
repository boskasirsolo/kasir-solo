import React from 'react';
import { Eye, Users, TrendingUp, Globe, Zap, ExternalLink } from 'lucide-react';
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
    const maxCount = Math.max(...referrers.map(([, count]) => count), 1);

    return (
        <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 flex flex-col h-full shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Globe size={80} /></div>
            
            <h4 className="text-white font-black text-xs mb-4 flex items-center gap-2 uppercase tracking-widest relative z-10">
                <Globe size={14} className="text-blue-400"/> Pintu Masuk (Traffic)
            </h4>
            <p className="text-[9px] text-gray-600 mb-6 font-bold uppercase tracking-widest relative z-10">Darimana calon juragan dateng:</p>
            
            <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-1 relative z-10">
                {referrers.map(([ref, count], idx) => {
                    const percent = Math.round((count / maxCount) * 100);
                    return (
                        <div key={idx} className="group/item">
                            <div className="flex justify-between items-center text-[10px] mb-2 font-mono">
                                 <span className="text-gray-400 truncate max-w-[180px] group-hover/item:text-white transition-colors flex items-center gap-1.5">
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
            <p className="text-[9px] text-gray-700 mt-6 font-bold uppercase tracking-widest text-center italic shrink-0">Berdasarkan HTTP Referer & UTM Audit</p>
        </div>
    );
};