
import React from 'react';
import { Package, Copy, Truck, Clock, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Order, OrderItem, SiteConfig } from '../../types';
import { formatRupiah } from '../../utils';
import { StatusBadge } from './atoms';
import { OrderDetail } from './order-detail';

interface OrderCardProps {
    order: Order;
    expanded: boolean;
    onToggle: () => void;
    items: OrderItem[];
    onStatusUpdate: (id: number, status: string) => void;
    onShippingUpdate: (id: number, c: string, t: string) => void;
    config: SiteConfig;
}

export const OrderCard: React.FC<OrderCardProps> = ({ 
    order, expanded, onToggle, items, onStatusUpdate, onShippingUpdate, config 
}) => {
    const copyId = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(order.id.toString());
        alert("ID Pesanan disalin!");
    };

    return (
        <div className={`bg-brand-dark/50 border transition-all rounded-2xl overflow-hidden mb-4 ${expanded ? 'border-brand-orange shadow-neon-strong translate-x-1' : 'border-white/5 hover:border-white/20'}`}>
            <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none" onClick={onToggle}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all shadow-lg shrink-0 ${expanded ? 'bg-brand-orange text-white border-brand-orange' : 'bg-brand-card text-gray-600 border-white/10'}`}>
                        <Package size={24} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-white text-base flex items-center gap-2">
                                #{order.id}
                                <button onClick={copyId} className="text-gray-600 hover:text-white transition-colors p-1" title="Salin ID"><Copy size={14} /></button>
                            </h4>
                            {order.tracking_number && (
                                <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30 font-bold flex items-center gap-1"><Truck size={10}/> OTW</span>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1"><User size={12}/> {order.customer_name}</span>
                            <span className="flex items-center gap-1 font-mono"><Clock size={12}/> {new Date(order.created_at).toLocaleDateString('id-ID')}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-4 md:gap-8 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                    <div className="flex flex-col md:items-end">
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">Mahar</p>
                        <p className="font-bold text-white text-lg font-display">{formatRupiah(order.total_amount)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={order.status} />
                        {expanded ? <ChevronUp size={20} className="text-brand-orange"/> : <ChevronDown size={20} className="text-gray-700"/>}
                    </div>
                </div>
            </div>
            
            {expanded && (
                <OrderDetail 
                    order={order} 
                    items={items} 
                    onStatusUpdate={onStatusUpdate} 
                    // FIX: Menggunakan 'onShippingUpdate' dari props karena 'updateShipping' tidak didefinisikan di scope ini
                    onShippingUpdate={onShippingUpdate} 
                    config={config}
                />
            )}
        </div>
    );
};
