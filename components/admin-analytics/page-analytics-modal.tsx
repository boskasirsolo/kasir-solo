
import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
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
        // Gembok scroll body utama
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        
        // Paksa reset scroll modal container ke paling atas
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }

        // Double check setelah render frame
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

    // Gunakan createPortal biar modal bener-bener "bebas" di layer paling atas body
    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-10">
            {/* FULL SCREEN BACKDROP */}
            <div 
                className="fixed inset-0 bg-black/95 backdrop-blur-md animate-fade-in transition-all cursor-pointer" 
                onClick={onClose}
                aria-hidden="true"
            ></div>
            
            {/* MODAL CONTAINER */}
            <div className="relative w-full max-w-5xl bg-brand-dark border border-brand-orange/30 rounded-3xl shadow-[0_0_50px_rgba(255,95,31,0.2)] flex flex-col max-h-[92vh] overflow-hidden animate-fade-in">
                
                {/* HEADER (Sticky Top) */}
                <div className="p-6 md:p-8 border-b border-white/10 bg-brand-card flex justify-between items-start shrink-0">
                    <div className="min-w-0 pr-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-black bg-brand-orange/20 text-brand-orange px-2 py-1 rounded border border-brand-orange/30 uppercase tracking-[0.2em]">
                                Page Intel
                            </span>
                            <span className="text-[9px] text-gray-500 font-mono uppercase">Database Surveillance Active</span>
                        </div>
                        <h3 className="text-xl md:text-3xl font-bold text-white break-all font-display leading-tight">{pagePath}</h3>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <a 
                            href={pagePath} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all border border-white/5"
                            title="Buka Halaman Live"
                        >
                            <ExternalLink size={20} />
                        </a>
                        <button 
                            onClick={onClose} 
                            className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all border border-red-500/20"
                            title="Tutup Modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* CONTENT AREA (Scrollable) */}
                <div 
                    ref={scrollContainerRef}
                    className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-black/20"
                >
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <LoadingSpinner size={40}/>
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest animate-pulse">Menghitung Data Radar...</p>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            
                            {/* KPI CARDS GRID */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-brand-card border border-white/5 p-5 rounded-2xl hover:border-blue-500/30 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Total Views</span>
                                        <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400"><Eye size={16}/></div>
                                    </div>
                                    <p className="text-3xl font-display font-black text-white">{stats.totalViews}</p>
                                </div>
                                <div className="bg-brand-card border border-white/5 p-5 rounded-2xl hover:border-purple-500/30 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Unik Visitor</span>
                                        <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400"><Users size={16}/></div>
                                    </div>
                                    <p className="text-3xl font-display font-black text-white">{stats.uniqueVisitors}</p>
                                </div>
                                <div className="bg-brand-card border border-white/5 p-5 rounded-2xl hover:border-green-500/30 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Desktop</span>
                                        <div className="p-1.5 bg-green-500/10 rounded-lg text-green-400"><Monitor size={16}/></div>
                                    </div>
                                    <p className="text-3xl font-display font-black text-white">{stats.devices.desktop}</p>
                                </div>
                                <div className="bg-brand-card border border-white/5 p-5 rounded-2xl hover:border-brand-orange/30 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Mobile</span>
                                        <div className="p-1.5 bg-brand-orange/10 rounded-lg text-brand-orange"><Smartphone size={16}/></div>
                                    </div>
                                    <p className="text-3xl font-display font-black text-white">{stats.devices.mobile}</p>
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-12 gap-8">
                                {/* CHART: TREND 7 HARI */}
                                <div className="lg:col-span-8 bg-brand-card/50 border border-white/5 p-8 rounded-3xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp size={100}/></div>
                                    <h4 className="text-xs font-black text-white mb-8 flex items-center gap-2 uppercase tracking-[0.2em] relative z-10">
                                        <TrendingUp size={16} className="text-brand-orange animate-pulse"/> Tren Kunjungan (7 Hari Terakhir)
                                    </h4>
                                    <div className="h-48 flex items-end justify-between gap-3 relative z-10">
                                        {/* Grid lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                                            <div className="border-t border-white w-full"></div>
                                            <div className="border-t border-white w-full"></div>
                                            <div className="border-t border-white w-full"></div>
                                        </div>
                                        
                                        {Object.entries(stats.trend).map(([date, count], idx) => {
                                            const heightPercent = ((count as number) / maxTrendValue) * 100;
                                            return (
                                                <div key={idx} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
                                                    <div className="absolute -top-10 bg-white text-black text-[10px] font-black px-2 py-1 rounded shadow-neon opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1">
                                                        {count} View
                                                    </div>
                                                    <div 
                                                        className={`w-full rounded-t-lg transition-all duration-700 min-h-[4px] ${count === maxTrendValue ? 'bg-brand-orange shadow-neon' : 'bg-white/10 group-hover:bg-brand-orange/40'}`} 
                                                        style={{ height: `${Math.max(heightPercent, 2)}%` }}
                                                    ></div>
                                                    <span className={`text-[8px] mt-4 truncate w-full text-center font-black uppercase tracking-tighter ${count === maxTrendValue ? 'text-brand-orange' : 'text-gray-600 group-hover:text-gray-400'}`}>{date}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* LIST: TRAFFIC SOURCE */}
                                <div className="lg:col-span-4 bg-brand-card/50 border border-white/5 p-8 rounded-3xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5"><Globe size={100}/></div>
                                    <h4 className="text-xs font-black text-white mb-8 flex items-center gap-2 uppercase tracking-[0.2em] relative z-10">
                                        <Globe size={16} className="text-blue-400"/> Pintu Masuk
                                    </h4>
                                    <div className="space-y-5 relative z-10">
                                        {stats.sortedSources.map(([source, count], idx) => {
                                            const percentage = ((count as number) / stats.totalViews) * 100;
                                            return (
                                                <div key={idx} className="group">
                                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2">
                                                        <span className="text-gray-400 group-hover:text-white transition-colors truncate max-w-[150px]">{source}</span>
                                                        <span className="text-white font-mono">{count}</span>
                                                    </div>
                                                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                                                        <div 
                                                            className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gray-700'}`} 
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {stats.sortedSources.length === 0 && <p className="text-gray-500 text-xs italic py-10 text-center uppercase tracking-widest opacity-30">No radar signal found.</p>}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
                
                {/* FOOTER (Bottom Info) */}
                <div className="p-4 bg-brand-dark border-t border-white/5 text-center shrink-0">
                    <p className="text-[8px] text-gray-700 font-black uppercase tracking-[0.4em]">Proprietary Data Extraction Engine // PT MKS v3.1</p>
                </div>
            </div>
        </div>,
        document.body
    );
};
