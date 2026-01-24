
import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Eye, Users, TrendingUp, Globe, Smartphone, Monitor } from 'lucide-react';
import { supabase } from '../../utils';
import { AnalyticsLog } from '../../types';
import { LoadingSpinner } from '../ui';

// --- HELPER: Process Data for Specific Page ---
const processPageData = (logs: AnalyticsLog[]) => {
    const totalViews = logs.filter(l => l.event_type === 'page_view').length;
    const uniqueVisitors = new Set(logs.map(l => l.visitor_id)).size;
    
    const trend: Record<string, number> = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        trend[d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })] = 0;
    }
    
    const sources: Record<string, number> = {};
    const devices = { mobile: 0, desktop: 0 };

    logs.forEach(log => {
        if (log.event_type === 'page_view') {
            const d = new Date(log.created_at!);
            const dateKey = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            if (trend[dateKey] !== undefined) trend[dateKey]++;

            let ref = log.referrer || 'Direct';
            const lowerRef = ref.toLowerCase();
            if (lowerRef.includes('google')) ref = 'Google';
            else if (lowerRef.includes('facebook') || lowerRef.includes('fb')) ref = 'Facebook';
            else if (lowerRef.includes('instagram')) ref = 'Instagram';
            else if (lowerRef.includes('whatsapp') || lowerRef.includes('wa.me')) ref = 'WhatsApp'; 
            else if (lowerRef.includes('direct') || ref === '') ref = 'Direct'; 
            else {
                try { ref = new URL(ref).hostname.replace('www.', ''); } catch(e) {}
            }
            sources[ref] = (sources[ref] || 0) + 1;

            if (log.device_type === 'mobile') devices.mobile++;
            else devices.desktop++;
        }
    });

    const sortedSources = Object.entries(sources).sort(([,a], [,b]) => b - a).slice(0, 5);
    return { totalViews, uniqueVisitors, trend, sortedSources, devices };
};

export const PageAnalyticsModal = ({ pagePath, onClose }: { pagePath: string, onClose: () => void }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AnalyticsLog[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }

        const rafId = requestAnimationFrame(() => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo(0, 0);
            }
        });

        return () => {
            document.body.style.overflow = originalStyle;
            cancelAnimationFrame(rafId);
        };
    }, [pagePath]);

    useEffect(() => {
        const fetchData = async () => {
            if (!supabase) return;
            setLoading(true);
            const cleanPath = pagePath.split('?')[0];
            const { data: logs, error } = await supabase
                .from('analytics_logs')
                .select('*')
                .ilike('page_path', `${cleanPath}%`) 
                .order('created_at', { ascending: true });
            if (!error && logs) setData(logs);
            setLoading(false);
        };
        fetchData();
    }, [pagePath]);

    const stats = useMemo(() => processPageData(data), [data]);
    const maxTrendValue = Math.max(...(Object.values(stats.trend) as number[]), 1);

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-6 md:p-8">
            {/* BACKDROP */}
            <div 
                className="fixed inset-0 bg-black/95 backdrop-blur-md animate-fade-in transition-all cursor-pointer" 
                onClick={onClose}
            ></div>
            
            {/* MODAL CONTAINER (Optimized for Tablet) */}
            <div className="relative w-full max-w-2xl bg-brand-dark border border-brand-orange/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">
                
                {/* HEADER (Sticky & Tight) */}
                <div className="p-4 border-b border-white/10 bg-brand-card flex justify-between items-center shrink-0">
                    <div className="min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[7px] font-black bg-brand-orange text-white px-1.5 py-0.5 rounded uppercase tracking-widest shadow-neon">
                                Live Intel
                            </span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-white truncate font-display opacity-80">{pagePath}</h3>
                    </div>
                    <div className="flex gap-1 shrink-0">
                        <a 
                            href={pagePath} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-2 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white rounded-lg transition-all"
                        >
                            <ExternalLink size={14} />
                        </a>
                        <button 
                            onClick={onClose} 
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* CONTENT AREA (More Compact) */}
                <div 
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-black/5"
                >
                    {loading ? (
                        <div className="h-40 flex flex-col items-center justify-center gap-3">
                            <LoadingSpinner size={28}/>
                            <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest animate-pulse">Scanning Radar...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            
                            {/* KPI GRID (Smaller text, tighter gap) */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <div className="bg-brand-card border border-white/5 p-3 rounded-xl shadow-inner">
                                    <span className="text-gray-600 text-[7px] font-black uppercase block mb-1.5">Views</span>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-display font-black text-white">{stats.totalViews}</p>
                                        <Eye size={12} className="text-blue-500 opacity-50"/>
                                    </div>
                                </div>
                                <div className="bg-brand-card border border-white/5 p-3 rounded-xl shadow-inner">
                                    <span className="text-gray-600 text-[7px] font-black uppercase block mb-1.5">Unique</span>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-display font-black text-white">{stats.uniqueVisitors}</p>
                                        <Users size={12} className="text-purple-500 opacity-50"/>
                                    </div>
                                </div>
                                <div className="bg-brand-card border border-white/5 p-3 rounded-xl shadow-inner">
                                    <span className="text-gray-600 text-[7px] font-black uppercase block mb-1.5">Desktop</span>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-display font-black text-white">{stats.devices.desktop}</p>
                                        <Monitor size={12} className="text-green-500 opacity-50"/>
                                    </div>
                                </div>
                                <div className="bg-brand-card border border-white/5 p-3 rounded-xl shadow-inner">
                                    <span className="text-gray-600 text-[7px] font-black uppercase block mb-1.5">Mobile</span>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-display font-black text-white">{stats.devices.mobile}</p>
                                        <Smartphone size={12} className="text-brand-orange opacity-50"/>
                                    </div>
                                </div>
                            </div>

                            {/* MAIN CHARTS (Stack on mobile, side-by-side on tablet/desktop) */}
                            <div className="grid sm:grid-cols-1 md:grid-cols-1 gap-4">
                                {/* CHART: TREND */}
                                <div className="bg-brand-card/40 border border-white/5 p-4 rounded-2xl relative overflow-hidden">
                                    <h4 className="text-[8px] font-black text-gray-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
                                        <TrendingUp size={10} className="text-brand-orange"/> Traffic 7 Hari
                                    </h4>
                                    <div className="h-24 flex items-end justify-between gap-1 relative">
                                        {Object.entries(stats.trend).map(([date, count], idx) => {
                                            const heightPercent = ((count as number) / maxTrendValue) * 100;
                                            return (
                                                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                                    <div 
                                                        className={`w-full rounded-t-sm transition-all duration-700 min-h-[1px] ${count === maxTrendValue ? 'bg-brand-orange shadow-neon' : 'bg-white/10 group-hover:bg-brand-orange/40'}`} 
                                                        style={{ height: `${Math.max(heightPercent, 4)}%` }}
                                                    ></div>
                                                    <span className="text-[6px] text-gray-700 mt-2 truncate w-full text-center font-bold">{date}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* LIST: SOURCES */}
                                <div className="bg-brand-card/40 border border-white/5 p-4 rounded-2xl">
                                    <h4 className="text-[8px] font-black text-gray-400 mb-5 flex items-center gap-2 uppercase tracking-widest">
                                        <Globe size={10} className="text-blue-400"/> Pintu Masuk Teratas
                                    </h4>
                                    <div className="space-y-3">
                                        {stats.sortedSources.map(([source, count], idx) => {
                                            const percentage = ((count as number) / stats.totalViews) * 100;
                                            return (
                                                <div key={idx}>
                                                    <div className="flex justify-between items-center text-[8px] mb-1 font-bold uppercase">
                                                        <span className="text-gray-500 truncate max-w-[120px]">{source}</span>
                                                        <span className="text-white font-mono">{count}</span>
                                                    </div>
                                                    <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${idx === 0 ? 'bg-blue-500' : 'bg-gray-700'}`} 
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {stats.sortedSources.length === 0 && <p className="text-[8px] text-gray-700 italic py-2 text-center">No signals detected.</p>}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
                
                {/* FOOTER INFO (Mini) */}
                <div className="p-2.5 bg-brand-dark border-t border-white/5 text-center shrink-0">
                    <p className="text-[6px] text-gray-800 font-black uppercase tracking-[0.4em]">Surveillance Data Port // PT MKS v3.1</p>
                </div>
            </div>
        </div>,
        document.body
    );
};
