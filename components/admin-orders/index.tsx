
import React, { useState } from 'react';
import { SiteConfig } from '../../types';
import { OrdersPanel } from './orders-panel';
import { LeadsPanel } from './leads-panel';
import { SimulationsPanel } from './simulations-panel';

export const AdminOrders = ({ config }: { config: SiteConfig }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'leads' | 'simulations'>('orders');

  return (
    <div className="max-w-6xl mx-auto">
      {/* TAB NAVIGATION */}
      <div className="flex gap-4 mb-6 border-b border-white/10 pb-1 overflow-x-auto custom-scrollbar">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'orders' ? 'text-brand-orange border-b-2 border-brand-orange' : 'text-gray-500 hover:text-white'}`}
          >
            Order Toko
          </button>
          <button 
            onClick={() => setActiveTab('simulations')}
            className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'simulations' ? 'text-brand-orange border-b-2 border-brand-orange' : 'text-gray-500 hover:text-white'}`}
          >
            Leads Simulasi
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'leads' ? 'text-brand-orange border-b-2 border-brand-orange' : 'text-gray-500 hover:text-white'}`}
          >
            Shadow Leads
          </button>
      </div>

      {activeTab === 'orders' && <OrdersPanel config={config} />}
      {activeTab === 'simulations' && <SimulationsPanel config={config} />}
      {activeTab === 'leads' && <LeadsPanel />}
    </div>
  );
};
