
import React, { useEffect, useState } from 'react';
import { supabase, formatRupiah } from '../utils';
import { Order, OrderItem } from '../types';
import { LoadingSpinner } from './ui';
import { ChevronDown, ChevronUp, Package, Phone, User, MapPin } from 'lucide-react';

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<Record<number, OrderItem[]>>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (e) {
      console.error(e);
      alert("Gagal mengambil data pesanan.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: number) => {
    if (orderItems[orderId]) {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
        return;
    }

    if (!supabase) return;
    try {
        const { data, error } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);
        
        if (error) throw error;
        setOrderItems(prev => ({ ...prev, [orderId]: data || [] }));
        setExpandedOrderId(orderId);
    } catch (e) {
        console.error(e);
    }
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    if (!supabase) return;
    try {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        if (error) throw error;
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
    } catch(e) { alert("Gagal update status"); }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
        case 'paid': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
        case 'processed': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
        case 'completed': return 'bg-green-500/20 text-green-500 border-green-500/30';
        case 'cancelled': return 'bg-red-500/20 text-red-500 border-red-500/30';
        default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  if (loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-10">Belum ada pesanan masuk.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-brand-dark border border-white/5 rounded-xl overflow-hidden">
            {/* Header */}
            <div 
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => fetchOrderItems(order.id)}
            >
                <div className="flex items-center gap-4">
                    <div className="bg-brand-card p-3 rounded-lg border border-white/10">
                        <Package className="text-brand-orange" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-lg">Order #{order.id}</h4>
                        <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('id-ID')} {new Date(order.created_at).toLocaleTimeString('id-ID')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${getStatusColor(order.status)}`}>
                        {order.status}
                     </span>
                     <p className="font-bold text-white min-w-[120px] text-right">{formatRupiah(order.total_amount)}</p>
                     {expandedOrderId === order.id ? <ChevronUp size={20} className="text-gray-500"/> : <ChevronDown size={20} className="text-gray-500"/>}
                </div>
            </div>

            {/* Details */}
            {expandedOrderId === order.id && (
                <div className="border-t border-white/10 bg-black/20 p-6 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-8 mb-6">
                        <div className="space-y-3">
                            <h5 className="font-bold text-brand-orange uppercase text-xs tracking-wider mb-2">Info Pelanggan</h5>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <User size={16} className="text-gray-500"/> {order.customer_name}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Phone size={16} className="text-gray-500"/> 
                                <a href={`https://wa.me/${order.customer_phone}`} target="_blank" rel="noreferrer" className="hover:text-brand-orange">
                                    {order.customer_phone}
                                </a>
                            </div>
                            <div className="flex items-start gap-3 text-sm text-gray-300">
                                <MapPin size={16} className="text-gray-500 shrink-0 mt-1"/> {order.customer_address}
                            </div>
                            {order.customer_note && (
                                <div className="mt-2 p-3 bg-white/5 rounded text-xs text-gray-400 italic">
                                    "Catatan: {order.customer_note}"
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-3">
                             <h5 className="font-bold text-brand-orange uppercase text-xs tracking-wider mb-2">Item Belanja</h5>
                             <div className="space-y-2">
                                {orderItems[order.id]?.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm text-gray-300 border-b border-white/5 pb-2 last:border-0">
                                        <span>{item.quantity}x {item.product_name}</span>
                                        <span className="text-gray-500">{formatRupiah(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                             </div>
                             <div className="pt-2 flex justify-between font-bold text-white text-lg">
                                <span>Total</span>
                                <span>{formatRupiah(order.total_amount)}</span>
                             </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                         {['pending', 'paid', 'processed', 'completed', 'cancelled'].map(status => (
                             <button
                                key={status}
                                onClick={() => updateStatus(order.id, status)}
                                disabled={order.status === status}
                                className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${
                                    order.status === status 
                                    ? 'bg-brand-orange text-white opacity-100 cursor-default' 
                                    : 'bg-white/5 text-gray-500 hover:bg-white/10'
                                }`}
                             >
                                {status}
                             </button>
                         ))}
                    </div>
                </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
