
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { SiteConfig } from '../../types';
import { OrdersPanel } from './orders-panel';
import { LeadsPanel } from './leads-panel';
import { SimulationsPanel } from './simulations-panel';

export const AdminOrders = ({ config }: { config: SiteConfig }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'leads' | 'simulations'>('orders');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshAll = () => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    // Beri sedikit delay untuk animasi icon spin
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* TAB NAVIGATION & REFRESH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-white/10 gap-4">
        <div className="flex gap-4 pb-1 overflow-x-auto custom-scrollbar w-full sm:w-auto">
            <button 
                onClick={() => setActiveTab('orders')}
                className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${activeTab === 'orders' ? 'text-brand-orange border-brand-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
            >
                Order Toko
            </button>
            <button 
                onClick={() => setActiveTab('simulations')}
                className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${activeTab === 'simulations' ? 'text-brand-orange border-brand-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
            >
                Leads Simulasi
            </button>
            <button 
                onClick={() => setActiveTab('leads')}
                className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${activeTab === 'leads' ? 'text-brand-orange border-brand-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
            >
                Shadow Leads
            </button>
        </div>

        <button 
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="mb-2 sm:mb-0 flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 hover:text-brand-orange transition-all"
        >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-brand-orange' : ''} />
            REFRESH SEMUA DATA
        </button>
      </div>

      {activeTab === 'orders' && <OrdersPanel config={config} refreshKey={refreshKey} />}
      {activeTab === 'simulations' && <SimulationsPanel config={config} refreshKey={refreshKey} />}
      {activeTab === 'leads' && <LeadsPanel refreshKey={refreshKey} />}
    </div>
  );
};
