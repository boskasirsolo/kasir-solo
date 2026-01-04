
import React, { useState } from 'react';
import { User, Phone, MapPin, Share2, Printer, Package, Truck, Save } from 'lucide-react';
import { Order, OrderItem, SiteConfig } from '../../types';
import { formatRupiah } from '../../utils';
import { handlePrintInvoice } from './utils';
import { ActionBtn, InfoRow } from './atoms';

export const OrderDetail = ({ 
    order, 
    items, 
    onStatusUpdate, 
    onShippingUpdate, 
    config 
}: { 
    order: Order, 
    items: OrderItem[], 
    onStatusUpdate: (id: number, status: string) => void, 
    onShippingUpdate: (id: number, c: string, t: string) => void, 
    config: SiteConfig 
}) => {
    const [courier, setCourier] = useState(order.courier || '');
    const [tracking, setTracking] = useState(order.tracking_number || '');

    const handleShare = () => {
        const text = `*Halo Kak ${order.customer_name},*\n\nBerikut rincian pesanan Anda di PT Mesin Kasir Solo:\n\n*No. Order:* #${order.id}\n*Total:* ${formatRupiah(order.total_amount)}\n*Status:* ${order.status.toUpperCase()}\n\nTerima kasih telah berbelanja!`;
        let phone = order.customer_phone.replace(/\D/g, '');
        if (phone.startsWith('0')) phone = '62' + phone.substring(1);
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="border-t border-white/5 bg-black/20 p-6 animate-fade-in text-sm">
            <div className="grid md:grid-cols-2 gap-8 mb-6">
                
                {/* LEFT: CUSTOMER & ITEMS */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h5 className="font-bold text-brand-orange uppercase text-[10px] tracking-widest flex items-center gap-2"><User size={12}/> Info Pelanggan</h5>
                            <div className="flex gap-2">
                                <ActionBtn onClick={handleShare} variant="success" title="Kirim WA"><Share2 size={12} /> Share</ActionBtn>
                                <ActionBtn onClick={() => handlePrintInvoice(order, items, config)} variant="default" title="Cetak Invoice"><Printer size={12} /> Cetak</ActionBtn>
                            </div>
                        </div>
                        <div className="bg-brand-card/50 p-4 rounded-lg border border-white/5 space-y-2">
                            <InfoRow icon={User} value={order.customer_name} label="true" />
                            <InfoRow icon={Phone} value={order.customer_phone} href={`https://wa.me/${order.customer_phone}`} />
                            <InfoRow icon={MapPin} value={order.customer_address} />
                        </div>
                        {order.customer_note && (<div className="mt-2 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded text-xs text-yellow-500/80 italic">"Catatan: {order.customer_note}"</div>)}
                    </div>

                    <div className="space-y-3">
                        <h5 className="font-bold text-brand-orange uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2"><Package size={12}/> Item Belanja</h5>
                        <div className="bg-brand-card/50 p-4 rounded-lg border border-white/5">
                            <div className="space-y-2 mb-3">
                                {items?.map((item) => (
                                    <div key={item.id} className="flex justify-between text-gray-300 pb-2 border-b border-white/5 last:border-0 last:pb-0">
                                        <span>{item.quantity}x {item.product_name}</span>
                                        <span className="text-gray-500">{formatRupiah(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-2 flex justify-between font-bold text-white border-t border-dashed border-white/10">
                                <span>Total Tagihan</span>
                                <span className="text-brand-orange">{formatRupiah(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: SHIPPING & STATUS */}
                <div className="space-y-6">
                    <div className="bg-brand-card/50 p-4 rounded-lg border border-white/5">
                        <h5 className="font-bold text-blue-400 uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2"><Truck size={12}/> Update Pengiriman</h5>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] text-gray-500 block mb-1">Kurir / Ekspedisi</label>
                                <input value={courier} onChange={e => setCourier(e.target.value)} placeholder="JNE, J&T..." className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-brand-orange outline-none"/>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 block mb-1">Nomor Resi (Tracking ID)</label>
                                <div className="flex gap-2">
                                    <input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Input resi..." className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-brand-orange outline-none font-mono"/>
                                    <button onClick={() => onShippingUpdate(order.id, courier, tracking)} className="px-3 bg-brand-orange text-white rounded text-xs font-bold hover:bg-brand-action transition-all flex items-center gap-1"><Save size={14} /></button>
                                </div>
                                <p className="text-[9px] text-gray-500 italic mt-2">*Otomatis ubah status ke <strong>COMPLETED</strong>.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h5 className="font-bold text-gray-500 uppercase text-[10px] tracking-widest mb-2">Status Manual</h5>
                        <div className="flex flex-wrap gap-2">
                            {['pending', 'paid', 'processed', 'completed', 'cancelled'].map(status => (
                                <button 
                                    key={status} 
                                    onClick={() => onStatusUpdate(order.id, status)} 
                                    disabled={order.status === status}
                                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                        order.status === status 
                                        ? 'bg-white/10 text-white border-white/30 opacity-100 cursor-default' 
                                        : 'bg-transparent border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
