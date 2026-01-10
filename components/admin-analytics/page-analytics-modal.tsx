
import React, { useState, useEffect, useMemo } from 'react';
import { X, ExternalLink, Eye, Users, MousePointer, TrendingUp, Calendar, Globe, Smartphone, Monitor } from 'lucide-react';
import { supabase } from '../../utils';
import { AnalyticsLog } from '../../types';
import { LoadingSpinner } from '../ui';

// --- HELPER: Process Data for Specific Page ---
const processPageData = (logs: AnalyticsLog[]) => {
    const totalViews = logs.filter(l => l.event_type === 'page_view').length;
    const uniqueVisitors = new Set(logs.map(l => l.visitor_id)).size;
    
    // 1. Trend Last 7 Days
    const trend: Record<string, number> = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        trend[d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })] = 0;
    }
    
    // 2. Sources & Devices
    const sources: Record<string, number> = {};
    const devices = { mobile: 0, desktop: 0 };

    logs.forEach(log => {
        if (log.event_type === 'page_view') {
            // Trend
            const d = new Date(log.created_at!);
            const dateKey = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            if (trend[dateKey] !== undefined) trend[dateKey]++;

            // Source
            let ref = log.referrer || 'Direct';
            if (ref.includes('google')) ref = 'Google';
            else if (ref.includes('facebook') || ref.includes('fb')) ref = 'Facebook';
            else if (ref.includes('instagram')) ref = 'Instagram';
            else if (ref.includes('direct') || ref === '') ref = 'Direct / WA';
            else {
                try { ref = new URL(ref).hostname.replace('www.', ''); } catch(e) {}
            }
            sources[ref] = (sources[ref] || 0) + 1;

            // Device
            if (log.device_type === 'mobile') devices.mobile++;
            else devices.desktop++;
        }
    });

    // Sort Sources
    const sortedSources = Object.entries(sources).sort(([,a], [,b]) => b - a).slice(0, 5);

    return { totalViews, uniqueVisitors, trend, sortedSources, devices };
};

export const PageAnalyticsModal = ({ pagePath, onClose }: { pagePath: string, onClose: () => void }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AnalyticsLog[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!supabase) return;
            setLoading(true);
            
            // Clean path for query (remove params if any, though usually passed clean)
            const cleanPath = pagePath.split('?')[0];

            const { data: logs, error } = await supabase
                .from('analytics_logs')
                .select('*')
                .ilike('page_path', `${cleanPath}%`) // Match exact or with query params
                .order('created_at', { ascending: true });

            if (!error && logs) {
                setData(logs);
            }
            setLoading(false);
        };
        fetchData();
    }, [pagePath]);

    const stats = useMemo(() => processPageData(data), [data]);
    const maxTrendValue = Math.max(...(Object.values(stats.trend) as number[]), 1);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 animate-fade-in">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-4xl bg-brand-dark border border-brand-orange/30 rounded-2xl shadow-neon-strong flex flex-col max-h-[90vh] overflow-hidden">
                
                {/* HEADER */}
                <div className="p-6 border-b border-white/10 bg-brand-card flex justify-between items-start shrink-0">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold bg-brand-orange/20 text-brand-orange px-2 py-1 rounded border border-brand-orange/30 uppercase tracking-wider">
                                Page Intel
                            </span>
                            <span className="text-xs text-gray-500 font-mono">Last 30 Days Data</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white break-all font-display">{pagePath}</h3>
                    </div>
                    <div className="flex gap-2">
                        <a 
                            href={pagePath} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors border border-white/5"
                            title="Buka Halaman Live"
                        >
                            <ExternalLink size={20} />
                        </a>
                        <button onClick={onClose} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-black/20">
                    {loading ? (
                        <div className="h-64 flex items-center justify-center"><LoadingSpinner size={40}/></div>
                    ) : (
                        <div className="space-y-8">
                            
                            {/* KPI CARDS */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-brand-card border border-white/5 p-4 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-500 text-xs font-bold uppercase">Total Views</span>
                                        <Eye size={16} className="text-blue-400"/>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{stats.totalViews}</p>
                                </div>
                                <div className="bg-brand-card border border-white/5 p-4 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-500 text-xs font-bold uppercase">Unik Visitor</span>
                                        <Users size={16} className="text-purple-400"/>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{stats.uniqueVisitors}</p>
                                </div>
                                <div className="bg-brand-card border border-white/5 p-4 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-500 text-xs font-bold uppercase">Desktop</span>
                                        <Monitor size={16} className="text-green-400"/>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{stats.devices.desktop}</p>
                                </div>
                                <div className="bg-brand-card border border-white/5 p-4 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-500 text-xs font-bold uppercase">Mobile</span>
                                        <Smartphone size={16} className="text-brand-orange"/>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{stats.devices.mobile}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {/* CHART: TREND 7 HARI */}
                                <div className="md:col-span-2 bg-brand-card/50 border border-white/5 p-6 rounded-xl">
                                    <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                        <TrendingUp size={16} className="text-brand-orange"/> Tren Kunjungan (7 Hari Terakhir)
                                    </h4>
                                    <div className="h-40 flex items-end justify-between gap-2 relative">
                                        {/* Grid Lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                                            <div className="border-t border-white w-full"></div>
                                            <div className="border-t border-white w-full"></div>
                                            <div className="border-t border-white w-full"></div>
                                        </div>
                                        
                                        {Object.entries(stats.trend).map(([date, count], idx) => {
                                            const heightPercent = ((count as number) / maxTrendValue) * 100;
                                            return (
                                                <div key={idx} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
                                                    <div className="absolute -top-8 bg-white text-black text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {count}
                                                    </div>
                                                    <div 
                                                        className="w-full bg-gradient-to-t from-brand-orange/20 to-brand-orange rounded-t-sm hover:brightness-125 transition-all min-h-[2px]" 
                                                        style={{ height: `${Math.max(heightPercent, 2)}%` }}
                                                    ></div>
                                                    <span className="text-[9px] text-gray-500 mt-2 truncate w-full text-center font-mono">{date}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* LIST: TRAFFIC SOURCE */}
                                <div className="md:col-span-1 bg-brand-card/50 border border-white/5 p-6 rounded-xl">
                                    <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                        <Globe size={16} className="text-blue-400"/> Asal Pengunjung
                                    </h4>
                                    <div className="space-y-3">
                                        {stats.sortedSources.map(([source, count], idx) => {
                                            const percentage = ((count as number) / stats.totalViews) * 100;
                                            return (
                                                <div key={idx}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-gray-300 font-medium truncate max-w-[150px]">{source}</span>
                                                        <span className="text-white font-bold">{count}</span>
                                                    </div>
                                                    <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                                                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {stats.sortedSources.length === 0 && <p className="text-gray-500 text-xs italic">Belum ada data source.</p>}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
