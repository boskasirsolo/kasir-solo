
import React, { useState } from 'react';
import { SiteConfig } from '../../types';
import { OrdersPanel } from './orders-panel';
import { LeadsPanel } from './leads-panel';

export const AdminOrders = ({ config }: { config: SiteConfig }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'leads'>('orders');

  return (
    <div className="max-w-4xl mx-auto">
      {/* TAB NAVIGATION */}
      <div className="flex gap-4 mb-6 border-b border-white/10 pb-1">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'text-brand-orange border-b-2 border-brand-orange' : 'text-gray-500 hover:text-white'}`}
          >
            Order Masuk
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'text-brand-orange border-b-2 border-brand-orange' : 'text-gray-500 hover:text-white'}`}
          >
            Shadow Leads (Prospek)
          </button>
      </div>

      {activeTab === 'orders' ? (
          <OrdersPanel config={config} />
      ) : (
          <LeadsPanel />
      )}
    </div>
  );
};
