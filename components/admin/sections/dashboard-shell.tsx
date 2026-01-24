
import React, { useState, useEffect } from 'react';
import { Terminal, Menu, X, Zap, RefreshCw, Search } from 'lucide-react';
import { DashboardProps } from '../types';
import { useAdminDashboard } from '../logic';
import { SystemHealthWidget } from '../ui-parts';
import { Sidebar, LABEL_MAP } from './sidebar';
import { ModuleRenderer } from './module-renderer';

export const DashboardShell = (props: DashboardProps) => {
    const { activeTab, setActiveTab, storeSubTab, setStoreSubTab } = useAdminDashboard();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isGlobalLoading, setIsGlobalLoading] = useState(false);
    const [headerSearch, setHeaderSearch] = useState('');

    // Listener untuk sinkronisasi loading state dari modul
    useEffect(() => {
        const handleLoading = (e: any) => setIsGlobalLoading(!!e.detail);
        window.addEventListener('mks:loading', handleLoading);
        return () => window.removeEventListener('mks:loading', handleLoading);
    }, []);

    const handleRefreshTrigger = () => {
        // Broadcast event refresh ke modul yang sedang aktif
        window.dispatchEvent(new CustomEvent('mks:refresh'));
    };

    const handleGlobalSearch = (val: string) => {
        setHeaderSearch(val);
        // Broadcast event search agar modul yang aktif bisa memfilter data
        window.dispatchEvent(new CustomEvent('mks:search', { detail: val }));
    };

    return (
        <div className="h-screen bg-brand-black flex flex-col lg:flex-row relative overflow-hidden selection:bg-brand-orange selection:text-white">
            
            {/* --- MOBILE TOP HEADER --- */}
            <div className="lg:hidden h-16 bg-brand-card/95 border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-[60] backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center text-white shadow-[0_0_15px_#FF5F1F]">
                        <Terminal size={18} />
                    </div>
                    <span className="font-display font-black text-white uppercase tracking-widest text-[10px]">SOLO_CMD_V3</span>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className="p-2.5 text-brand-orange bg-brand-orange/5 border border-brand-orange/20 rounded-xl active:scale-90 transition-transform"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* --- MAIN CONTENT (LEFT SIDE) --- */}
            <main className="flex-1 h-full overflow-y-auto custom-scrollbar p-4 lg:p-8 order-2 lg:order-1 pb-24 lg:pb-8 relative">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_top_left,rgba(255,95,31,0.05),transparent)] pointer-events-none -z-10"></div>
                
                <div className="max-w-[1600px] mx-auto">
                    <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-4">
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-3 text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mb-0.5">
                                <span className="p-1 bg-brand-orange/10 rounded border border-brand-orange/30"><Zap size={10} className="text-brand-orange" /></span>
                                Command &gt; {activeTab}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <h1 className="text-2xl md:text-3xl font-display font-black text-white tracking-tighter leading-none shrink-0">
                                    {LABEL_MAP[activeTab]?.toUpperCase() || 'DASHBOARD'}
                                </h1>
                                
                                {/* GLOBAL TACTICAL SEARCH */}
                                <div className="relative group max-w-md w-full sm:ml-4">
                                    <Search size={14} className="absolute left-3 top-2.5 text-gray-600 group-focus-within:text-brand-orange transition-colors" />
                                    <input 
                                        type="text"
                                        value={headerSearch}
                                        onChange={(e) => handleGlobalSearch(e.target.value)}
                                        placeholder={`Cari di ${LABEL_MAP[activeTab]}...`}
                                        className="w-full bg-brand-card border border-white/10 rounded-xl pl-9 pr-4 py-2 text-[10px] font-bold text-white outline-none focus:border-brand-orange transition-all placeholder:text-gray-700 shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 items-center">
                             <SystemHealthWidget horizontal />

                             {/* TOMBOL REFRESH GLOBAL */}
                             <button 
                                onClick={handleRefreshTrigger}
                                disabled={isGlobalLoading}
                                className="bg-brand-card/80 backdrop-blur-md border border-white/10 p-2.5 rounded-2xl flex items-center justify-center shadow-xl group hover:border-brand-orange/30 transition-all active:scale-90 disabled:opacity-50"
                                title="Refresh Modul Aktif"
                             >
                                <RefreshCw size={18} className={`text-gray-400 group-hover:text-brand-orange transition-colors ${isGlobalLoading ? 'animate-spin text-brand-orange' : ''}`} />
                             </button>
                             
                             <div className="bg-brand-card/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xl group hover:border-brand-orange/30 transition-all cursor-help">
                                <div className="relative">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,1)]"></div>
                                    <div className="absolute inset-0 rounded-full bg-green-500/50 animate-ping"></div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[8px] font-black text-white uppercase tracking-widest block leading-none mb-0.5">System Live</span>
                                    <span className="text-[7px] text-gray-500 font-mono uppercase tracking-tighter block leading-none">Lat: 18ms</span>
                                </div>
                             </div>
                        </div>
                    </header>

                    <ModuleRenderer 
                        activeTab={activeTab} 
                        storeSubTab={storeSubTab} 
                        setStoreSubTab={setStoreSubTab} 
                        props={props} 
                    />
                </div>
            </main>

            {/* --- COMPACT SIDEBAR NAV (RIGHT SIDE) --- */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                onLogout={props.onLogout} 
            />

            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/95 backdrop-blur-md z-40 lg:hidden animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};
