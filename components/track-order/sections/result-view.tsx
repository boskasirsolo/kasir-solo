
import React from 'react';
import { Copy, Truck } from 'lucide-react';
import { formatRupiah } from '../../../utils';
import { OrderResult } from '../types';
import { getStatusLabel } from '../utils';
import { Timeline } from '../ui-parts';

interface ResultViewProps {
    result: OrderResult;
    onCopy: (text: string, label?: string) => void;
}

export const ResultView = ({ result, onCopy }: ResultViewProps) => {
    const { order, items } = result;

    return (
        <div className="bg-brand-dark border border-white/10 rounded-2xl overflow-hidden animate-fade-in shadow-2xl">
            {/* Header Status */}
            <div className="bg-white/5 p-6 border-b border-white/5 flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Status Misi</p>
                    <h3 className="text-2xl font-display font-bold text-white capitalize">
                        {getStatusLabel(order.status)}
                    </h3>
                </div>
                <div className="text-right">
                    <p className="text-gray-500 text-xs">Order ID</p>
                    <button 
                        onClick={() => onCopy(order.id.toString(), 'Order ID')}
                        className="flex items-center justify-end gap-2 text-brand-orange font-mono font-bold text-lg hover:text-white transition-colors group"
                        title="Klik untuk menyalin"
                    >
                        #{order.id} 
                        <Copy size={14} className="opacity-50 group-hover:opacity-100 transition-opacity"/>
                    </button>
                </div>
            </div>

            {/* Timeline */}
            <div className="p-6 md:p-8 border-b border-white/5">
                <Timeline status={order.status} created_at={order.created_at} />
            </div>

            {/* Tracking Info (If Shipped) */}
            {order.tracking_number && (
                <div className="p-6 bg-brand-orange/5 border-b border-brand-orange/20 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center text-white shadow-neon">
                            <Truck size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-brand-orange uppercase tracking-widest">Resi Pengiriman ({order.courier})</p>
                            <p className="text-xl font-mono text-white font-bold tracking-wide">{order.tracking_number}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => onCopy(order.tracking_number!, 'Nomor Resi')}
                        className="px-4 py-2 bg-black/40 hover:bg-brand-orange text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all border border-white/10"
                    >
                        <Copy size={14} /> Salin Resi
                    </button>
                </div>
            )}

            {/* Item Summary */}
            <div className="p-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Senjata Yang Dipesan</h4>
                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-brand-card rounded flex items-center justify-center text-gray-500 text-xs font-bold">
                                    {item.quantity}x
                                </div>
                                <span className="text-sm text-gray-300">{item.product_name}</span>
                            </div>
                            <span className="text-sm font-bold text-white">{formatRupiah(item.price * item.quantity)}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Total Mahar</span>
                    <span className="text-xl font-bold text-brand-orange">{formatRupiah(order.total_amount)}</span>
                </div>
            </div>

            {/* Footer Help */}
            <div className="p-4 bg-white/5 text-center">
                <p className="text-xs text-gray-500">
                    Paket mandeg atau nyasar? <a href="https://wa.me/6282325103336" target="_blank" className="text-brand-orange hover:underline font-bold">Lapor Komandan (Admin)</a>
                </p>
            </div>
        </div>
    );
};
