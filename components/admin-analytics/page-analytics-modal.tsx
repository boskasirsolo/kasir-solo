
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
            const lowerRef = ref.toLowerCase();

            if (lowerRef.includes('google')) ref = 'Google';
            else if (lowerRef.includes('facebook') || lowerRef.includes('fb')) ref = 'Facebook';
            else if (lowerRef.includes('instagram')) ref = 'Instagram';
            else if (lowerRef.includes('whatsapp') || lowerRef.includes('wa.me')) ref = 'WhatsApp'; 
            else if (lowerRef.includes('direct') || ref === '') ref = 'Direct Traffic'; 
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
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // --- PORTAL & BODY LOCK LOGIC ---
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

            if (!error && logs) {
                setData(logs);
            }
            setLoading(false);
        };
        fetchData();
    }, [pagePath]);

    const stats = useMemo(() => processPageData(data), [data]);
    const maxTrendValue = Math.max(...(Object.values(stats.trend) as number[]), 1);

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 md:p-10">
            {/* BACKDROP */}
            <div 
                className="fixed inset-0 bg-black/90 backdrop-blur-md animate-fade-in transition-all cursor-pointer" 
                onClick={onClose}
            ></div>
            
            {/* MODAL CONTAINER (Compact) */}
            <div className="relative w-full max-w-3xl bg-brand-dark border border-brand-orange/30 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.7)] flex flex-col max-h-[95vh] overflow-hidden animate-fade-in">
                
                {/* HEADER (More Compact) */}
                <div className="p-4 md:p-5 border-b border-white/10 bg-brand-card flex justify-between items-center shrink-0">
                    <div className="min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[8px] font-black bg-brand-orange/20 text-brand-orange px-1.5 py-0.5 rounded border border-brand-orange/30 uppercase tracking-widest">
                                Quick Intel
                            </span>
                        </div>
                        <h3 className="text-sm md:text-lg font-bold text-white truncate font-display">{pagePath}</h3>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                        <a 
                            href={pagePath} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-2 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white rounded-lg transition-all border border-white/5"
                            title="Buka Live"
                        >
                            <ExternalLink size={16} />
                        </a>
                        <button 
                            onClick={onClose} 
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all border border-red-500/20"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* CONTENT AREA (Tight Padding) */}
                <div 
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-black/10"
                >
                    {loading ? (
                        <div className="h-48 flex flex-col items-center justify-center gap-3">
                            <LoadingSpinner size={32}/>
                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest animate-pulse">Syncing Radar...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            
                            {/* KPI GRID (Compact) */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                                <div className="bg-brand-card border border-white/5 p-3 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Hits</span>
                                        <div className="text-blue-500"><Eye size={12}/></div>
                                    </div>
                                    <p className="text-xl font-display font-black text-white">{stats.totalViews}</p>
                                </div>
                                <div className="bg-brand-card border border-white/5 p-3 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-600 text-[8px] font-black uppercase tracking-widest">Unik</span>
                                        <div className="text-purple-500"><Users size={12}/></div>
                                    </div>
                                    <p className="text-xl font-display font-black text-white">{stats.uniqueVisitors}</p>
                                </div>
                                <div className="bg-brand-card border border-white/5 p-3 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-600 text-[8px] font-black uppercase tracking-widest">PC</span>
                                        <div className="text-green-500"><Monitor size={12}/></div>
                                    </div>
                                    <p className="text-xl font-display font-black text-white">{stats.devices.desktop}</p>
                                </div>
                                <div className="bg-brand-card border border-white/5 p-3 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-gray-600 text-[8px] font-black uppercase tracking-widest">HP</span>
                                        <div className="text-brand-orange"><Smartphone size={12}/></div>
                                    </div>
                                    <p className="text-xl font-display font-black text-white">{stats.devices.mobile}</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-12 gap-5">
                                {/* CHART: TREND (8 Col) */}
                                <div className="md:col-span-8 bg-brand-card/40 border border-white/5 p-5 rounded-2xl">
                                    <h4 className="text-[9px] font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
                                        <TrendingUp size={12} className="text-brand-orange"/> Tren 7 Hari
                                    </h4>
                                    <div className="h-32 flex items-end justify-between gap-1.5 relative">
                                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                                            <div className="border-t border-white w-full"></div>
                                            <div className="border-t border-white w-full"></div>
                                        </div>
                                        
                                        {Object.entries(stats.trend).map(([date, count], idx) => {
                                            const heightPercent = ((count as number) / maxTrendValue) * 100;
                                            return (
                                                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                                    <div className="absolute -top-8 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20">
                                                        {count}
                                                    </div>
                                                    <div 
                                                        className={`w-full rounded-t-sm transition-all duration-700 min-h-[2px] ${count === maxTrendValue ? 'bg-brand-orange shadow-neon' : 'bg-white/10 group-hover:bg-brand-orange/40'}`} 
                                                        style={{ height: `${Math.max(heightPercent, 2)}%` }}
                                                    ></div>
                                                    <span className="text-[7px] text-gray-700 mt-2 truncate w-full text-center font-bold">{date}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* LIST: SOURCES (4 Col) */}
                                <div className="md:col-span-4 bg-brand-card/40 border border-white/5 p-5 rounded-2xl">
                                    <h4 className="text-[9px] font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
                                        <Globe size={12} className="text-blue-400"/> Top Sources
                                    </h4>
                                    <div className="space-y-4">
                                        {stats.sortedSources.map(([source, count], idx) => {
                                            const percentage = ((count as number) / stats.totalViews) * 100;
                                            return (
                                                <div key={idx}>
                                                    <div className="flex justify-between items-center text-[9px] mb-1.5 font-bold uppercase">
                                                        <span className="text-gray-500 truncate max-w-[80px]">{source}</span>
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
                                        {stats.sortedSources.length === 0 && <p className="text-[9px] text-gray-700 italic py-4 text-center">No signal.</p>}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
                
                {/* FOOTER INFO (Mini) */}
                <div className="p-3 bg-brand-dark border-t border-white/5 text-center shrink-0">
                    <p className="text-[7px] text-gray-700 font-black uppercase tracking-[0.3em]">Surveillance System v3.1 // PT MKS</p>
                </div>
            </div>
        </div>,
        document.body
    );
};
