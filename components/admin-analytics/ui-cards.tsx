import React from 'react';
import { Eye, Users, TrendingUp, Globe, Zap } from 'lucide-react';
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

export const ReferrerList = ({ referrers, totalViews }: { referrers: [string, number][], totalViews: number }) => (
    <div className="bg-brand-dark border border-white/5 rounded-2xl p-6 flex flex-col h-full shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5"><Globe size={100} /></div>
        
        <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2 relative z-10">
            <Globe size={16} className="text-blue-400"/> Pintu Masuk
        </h4>
        
        <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1 relative z-10">
            {referrers.map(([ref, count], idx) => {
                const percent = totalViews > 0 ? ((count / totalViews) * 100).toFixed(1) : "0";
                return (
                    <div key={idx} className="flex flex-col p-2.5 bg-white/[0.02] rounded-lg border border-white/5 hover:border-blue-500/30 transition-all group">
                        <div className="flex justify-between items-center mb-1.5">
                             <span className="text-[10px] text-gray-400 truncate font-bold group-hover:text-white transition-colors">{ref}</span>
                             <span className="text-[10px] font-bold text-white font-mono">{count}</span>
                        </div>
                        <div className="w-full bg-black/40 h-[2px] rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                        </div>
                    </div>
                );
            })}
            {referrers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 opacity-20">
                    <p className="text-[10px] italic font-bold uppercase tracking-widest">No signals detected.</p>
                </div>
            )}
        </div>
    </div>
);