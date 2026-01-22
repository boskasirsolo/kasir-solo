
import React, { useState } from 'react';
import { Terminal, Menu, X, Zap } from 'lucide-react';
import { DashboardProps } from '../types';
import { useAdminDashboard } from '../logic';
import { SystemHealthWidget } from '../ui-parts';
import { Sidebar, LABEL_MAP } from './sidebar';
import { ModuleRenderer } from './module-renderer';

export const DashboardShell = (props: DashboardProps) => {
    const { activeTab, setActiveTab, storeSubTab, setStoreSubTab } = useAdminDashboard();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className="p-2.5 text-brand-orange bg-brand-orange/5 border border-brand-orange/20 rounded-xl active:scale-90 transition-transform"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* --- MAIN CONTENT (LEFT SIDE) --- */}
            <main className="flex-1 h-full overflow-y-auto custom-scrollbar p-4 lg:p-8 order-2 lg:order-1 pb-24 lg:pb-8 relative">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_top_left,rgba(255,95,31,0.05),transparent)] pointer-events-none -z-10"></div>
                
                <div className="max-w-[1600px] mx-auto">
                    <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3 text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mb-0.5">
                                <span className="p-1 bg-brand-orange/10 rounded border border-brand-orange/30"><Zap size={10} className="text-brand-orange" /></span>
                                Command &gt; {activeTab}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-display font-black text-white tracking-tighter leading-none">
                                {LABEL_MAP[activeTab]?.toUpperCase() || 'DASHBOARD'}
                            </h1>
                        </div>
                        
                        <div className="flex gap-3 items-center">
                             <SystemHealthWidget horizontal />
                             
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

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/95 backdrop-blur-md z-40 lg:hidden animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};
