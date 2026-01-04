
import React from 'react';
import { Package, Copy, Truck, Clock, ChevronDown, ChevronUp } from 'lucide-react';
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

export const OrderCard = ({ 
    order, expanded, onToggle, items, onStatusUpdate, onShippingUpdate, config 
}: OrderCardProps) => {
    const copyId = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(order.id.toString());
        alert("ID Pesanan disalin!");
    };

    return (
        <div className={`bg-brand-dark border transition-all rounded-xl overflow-hidden mb-3 ${expanded ? 'border-brand-orange/50 shadow-neon-text/10' : 'border-white/5 hover:border-white/20'}`}>
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none" onClick={onToggle}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg border transition-colors ${expanded ? 'bg-brand-orange text-white border-brand-orange' : 'bg-brand-card text-gray-500 border-white/10'}`}>
                        <Package size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                Order #{order.id}
                                <button onClick={copyId} className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded" title="Salin ID"><Copy size={12} /></button>
                            </h4>
                            {order.tracking_number && (
                                <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 flex items-center gap-1"><Truck size={8}/> Dikirim</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Clock size={10} />
                            {new Date(order.created_at).toLocaleDateString('id-ID')} • {new Date(order.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-4 md:gap-8 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                    <StatusBadge status={order.status} />
                    <p className="font-bold text-white text-sm min-w-[100px] text-right">{formatRupiah(order.total_amount)}</p>
                    {expanded ? <ChevronUp size={16} className="text-brand-orange"/> : <ChevronDown size={16} className="text-gray-600"/>}
                </div>
            </div>
            
            {expanded && (
                <OrderDetail 
                    order={order} 
                    items={items} 
                    onStatusUpdate={onStatusUpdate} 
                    onShippingUpdate={onShippingUpdate} 
                    config={config}
                />
            )}
        </div>
    );
};
