
import React, { useState, useMemo, useEffect } from 'react';
import { useCRMLogic } from './logic';
import { LeadStatus, LeadTemperature } from './types';
import { Kanban, Sparkles, X, Filter, Package, Radar, Box, Search, ChevronDown } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { SimpleMarkdown } from '../admin-articles/markdown';

// Feature Modules
import { CustomerDetailModal } from './customer-detail';
import { PipelineModule } from './pipeline';
import { RadarJuraganCard } from './shared/radar-card';
import { OrdersPanel } from '../admin-orders/orders-panel';

type CRMViewMode = 'radar' | 'board' | 'orders';

export const AdminCRM = () => {
    const { 
        state, filteredCustomers, 
        updateStatus, runRecoveryAI, isGeneratingScript, 
        aiRecommendation, setAiRecommendation, 
        selectedCustomer, setSelectedCustomer,
        setSearchTerm, refresh
    } = useCRMLogic();

    const [viewMode, setViewMode] = useState<CRMViewMode>('radar');
    const [tempFilter, setTempFilter] = useState<LeadTemperature | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
    const [catFilter, setCatFilter] = useState<string | 'all'>('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // --- GLOBAL REFRESH LISTENER ---
    // Menangkap sinyal refresh dari tombol di Dashboard Header
    useEffect(() => {
        const handleGlobalRefresh = (e: any) => {
            if (e.detail?.tab === 'sales' || !e.detail?.tab) {
                refresh();
            }
        };
        window.addEventListener('mks:refresh-module', handleGlobalRefresh);
        return () => window.removeEventListener('mks:refresh-module', handleGlobalRefresh);
    }, [refresh]);

    const finalFiltered = useMemo(() => {
        return filteredCustomers.filter(c => {
            const matchesTemp = tempFilter === 'all' || c.lead_temperature === tempFilter;
            const matchesStatus = statusFilter === 'all' || c.lead_status === statusFilter;
            const matchesCat = catFilter === 'all' || c.detected_category === catFilter;
            return matchesTemp && matchesStatus && matchesCat;
        });
    }, [filteredCustomers, tempFilter, statusFilter, catFilter]);

    const filterActiveCount = (tempFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (catFilter !== 'all' ? 1 : 0);

    const TABS = [
        { id: 'radar', label: 'Radar Juragan', desc: 'Helicopter View', icon: Radar },
        { id: 'board', label: 'Strategy Board', desc: 'Pipeline Progres', icon: Kanban },
        { id: 'orders', label: 'Logistik Order', desc: 'Transaksi Fisik', icon: Package },
    ];

    return (
        <div className="space-y-6 relative">
            {/* TACTICAL HEADER (MATCHING RADAR ANALYTICS STYLE) */}
            <div className="sticky top-0 z-30 bg-brand-black/80 backdrop-blur-md -mx-4 px-4 border-b border-white/5 shadow-xl transition-all">
                <div className="py-3 flex flex-col gap-4">
                    {/* TOP BAR: Navigation & Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* View Switcher Cards with Descriptions */}
                        <div className="flex gap-2 overflow-x-auto custom-scrollbar-hide shrink-0 pb-1">
                            {TABS.map((tab) => {
                                const isActive = viewMode === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setViewMode(tab.id as CRMViewMode)}
                                        className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all shrink-0 group ${
                                            isActive 
                                                ? 'bg-brand-orange border-brand-orange text-white shadow-neon' 
                                                : 'bg-brand-card/50 border-white/5 text-gray-500 hover:text-white hover:border-white/20'
                                        }`}
                                    >
                                        <tab.icon size={16} className={isActive ? 'text-white' : 'text-gray-600 group-hover:text-brand-orange'} />
                                        <div className="text-left">
                                            <p className="text-[9px] font-black uppercase tracking-widest leading-none">{tab.label}</p>
                                            <p className={`text-[8px] mt-0.5 font-bold ${isActive ? 'text-white/60' : 'text-gray-700'}`}>{tab.desc}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Integrated Search & Filter Trigger */}
                        <div className="flex items-center gap-2 flex-1 md:max-w-xl">
                            <div className="relative flex-1 group">
                                <Search size={14} className="absolute left-3 top-3 text-gray-600 group-focus-within:text-brand-orange transition-colors" />
                                <input 
                                    type="text"
                                    value={state.searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari Nama/WA Juragan..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-[11px] font-bold text-white outline-none focus:border-brand-orange transition-all placeholder:text-gray-700 shadow-inner h-11"
                                />
                            </div>
                            
                            <button 
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`h-11 flex items-center gap-2 px-5 py-2 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all relative shrink-0 ${
                                    isFilterOpen || filterActiveCount > 0
                                    ? 'bg-brand-orange/10 border-brand-orange text-brand-orange shadow-neon-text/5' 
                                    : 'bg-brand-card/50 border-white/5 text-gray-500 hover:text-white'
                                }`}
                            >
                                <Filter size={14} />
                                <span className="hidden sm:inline">Filter</span>
                                {filterActiveCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange text-white rounded-full flex items-center justify-center text-[8px] shadow-neon">
                                        {filterActiveCount}
                                    </span>
                                )}
                                <ChevronDown size={12} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* ACCORDION FILTER PANEL */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isFilterOpen ? 'max-h-[500px] opacity-100 mb-2' : 'max-h-0 opacity-0'}`}>
                        <div className="bg-brand-card/40 border border-white/5 rounded-2xl p-5 grid md:grid-cols-3 gap-8">
                            {/* Temperature Filter */}
                            <div className="space-y-3">
                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] px-1">Suhu Minat</p>
                                <div className="flex gap-1.5 flex-wrap">
                                    {['all', 'hot', 'warm', 'cold'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTempFilter(t as any)}
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${
                                                tempFilter === t 
                                                    ? 'bg-brand-orange border-brand-orange text-white shadow-neon-text/10' 
                                                    : 'bg-black/40 border-white/5 text-gray-500 hover:text-white'
                                            }`}
                                        >
                                            {t === 'all' ? 'SEMUA' : t === 'hot' ? '🔥 HOT' : t === 'warm' ? '🟠 WARM' : '🔵 COLD'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="space-y-3">
                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] px-1">Tahapan</p>
                                <div className="flex gap-1.5 flex-wrap">
                                    {[
                                        { id: 'all', label: 'SEMUA' },
                                        { id: 'new', label: '🆕 BARU' },
                                        { id: 'contacted', label: '📞 DISAPA' },
                                        { id: 'negotiating', label: '📑 NEGO' },
                                        { id: 'closed', label: '🤝 DEAL' },
                                        { id: 'lost', label: '❌ BATAL' }
                                    ].map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => setStatusFilter(s.id as any)}
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${
                                                statusFilter === s.id 
                                                    ? 'bg-blue-600 border-blue-500 text-white shadow-neon-text/10' 
                                                    : 'bg-black/40 border-white/5 text-gray-500 hover:text-white'
                                            }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Filter (Produk/Jasa) */}
                            <div className="space-y-3">
                                <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] px-1">Target Kategori</p>
                                <div className="flex gap-1.5 flex-wrap">
                                    {[
                                        { id: 'all', label: 'SEMUA' },
                                        { id: 'hardware', label: '🛒 PRODUK' },
                                        { id: 'website', label: '🌐 WEBSITE' },
                                        { id: 'webapp', label: '💻 WEBAPP' },
                                        { id: 'seo', label: '📈 SEO' }
                                    ].map((c) => (
                                        <button
                                            key={c.id}
                                            onClick={() => setCatFilter(c.id)}
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${
                                                catFilter === c.id 
                                                    ? 'bg-green-600 border-green-500 text-white shadow-neon-text/10' 
                                                    : 'bg-black/40 border-white/5 text-gray-500 hover:text-white'
                                            }`}
                                        >
                                            {c.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI STRATEGIC OVERLAY (Floating Style) */}
            {aiRecommendation && (
                <div className="mx-1 bg-brand-orange/10 border border-brand-orange/30 p-6 rounded-3xl relative animate-fade-in shadow-neon-text/5">
                    <button onClick={() => setAiRecommendation(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={18}/></button>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="p-2 bg-brand-orange/10 rounded-xl border border-brand-orange/30"><Sparkles className="text-brand-orange" size={20} /></span>
                        <h3 className="text-white font-black text-sm uppercase tracking-widest">Saran Strategi SIBOS</h3>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                        <SimpleMarkdown content={aiRecommendation} />
                    </div>
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            <div className="animate-fade-in min-h-[600px] px-1">
                {state.loading ? (
                    <div className="flex justify-center py-24"><LoadingSpinner size={32} /></div>
                ) : viewMode === 'radar' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {finalFiltered.length === 0 ? (
                            <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                                <Box size={48} className="mx-auto mb-4" />
                                <p className="text-xs font-bold uppercase tracking-widest">Data Tidak Ditemukan, Bos.</p>
                            </div>
                        ) : finalFiltered.map(c => (
                            <RadarJuraganCard 
                                key={c.phone} 
                                customer={c} 
                                onClick={() => setSelectedCustomer(c)} 
                            />
                        ))}
                    </div>
                ) : viewMode === 'board' ? (
                    <PipelineModule 
                        customers={finalFiltered} 
                        onOpenDetail={setSelectedCustomer} 
                        onStatusUpdate={updateStatus}
                        onRescue={runRecoveryAI}
                        isRescuingId={isGeneratingScript}
                    />
                ) : (
                    <OrdersPanel 
                        config={{ 
                            company_legal_name: "PT MESIN KASIR SOLO",
                            address_solo: "Perum Graha Tiara 2 B1, Kartasura",
                            whatsapp_number: "628816566935",
                            email_address: "admin@kasirsolo.my.id"
                        } as any} 
                        searchTerm={state.searchTerm}
                    />
                )}
            </div>

            {selectedCustomer && (
                <CustomerDetailModal 
                    customer={selectedCustomer} 
                    onClose={() => setSelectedCustomer(null)} 
                />
            )}
        </div>
    );
};
