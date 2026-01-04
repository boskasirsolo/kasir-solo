
import React from 'react';
import { Package } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { useOrderLogic } from './logic';
import { OrderCard } from './order-card';
import { SiteConfig } from '../../types';

export const OrdersPanel = ({ config }: { config: SiteConfig }) => {
    const { state, updateStatus, updateShipping, toggleExpand } = useOrderLogic();

    if (state.loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    if (state.orders.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl">
                <Package size={48} className="text-gray-700 mx-auto mb-4"/>
                <p className="text-gray-500">Belum ada pesanan masuk saat ini.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-4 px-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Daftar Transaksi</span>
                <span className="text-xs text-brand-orange bg-brand-orange/10 px-2 py-1 rounded border border-brand-orange/20">
                    Total: {state.orders.length}
                </span>
            </div>
            {state.orders.map((order) => (
                <OrderCard 
                    key={order.id}
                    order={order}
                    expanded={state.expandedOrderId === order.id}
                    onToggle={() => toggleExpand(order.id)}
                    items={state.orderItems[order.id]}
                    onStatusUpdate={updateStatus}
                    onShippingUpdate={updateShipping}
                    config={config}
                />
            ))}
        </div>
    );
};
