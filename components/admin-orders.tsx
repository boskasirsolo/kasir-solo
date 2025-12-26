
import React, { useEffect, useState } from 'react';
import { supabase, formatRupiah } from '../utils';
import { Order, OrderItem } from '../types';
import { LoadingSpinner } from './ui';
import { ChevronDown, ChevronUp, Package, Phone, User, MapPin, Clock } from 'lucide-react';

// --- LOGIC: Custom Hook ---
const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<Record<number, OrderItem[]>>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!supabase) {
        setLoading(false);
        return;
    }
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
        const { data, error } = await supabase.from('order_items').select('*').eq('order_id', orderId);
        if (error) throw error;
        setOrderItems(prev => ({ ...prev, [orderId]: data || [] }));
        setExpandedOrderId(orderId);
    } catch (e) { console.error(e); }
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    if (!supabase) return;
    try {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        if (error) throw error;
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
    } catch(e) { alert("Gagal update status"); }
  };

  return { orders, loading, expandedOrderId, orderItems, fetchOrderItems, updateStatus };
};

// --- UTILS: Helper Functions ---
const getStatusColor = (status: string) => {
  switch(status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'paid': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'processed': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500';
  }
};

// --- ATOMIC COMPONENT: Order Details ---
const OrderDetail = ({ 
    order, 
    items, 
    onStatusUpdate 
}: { 
    order: Order, 
    items: OrderItem[], 
    onStatusUpdate: (id: number, status: string) => void 
}) => (
    <div className="border-t border-white/5 bg-black/20 p-6 animate-fade-in text-sm">
        <div className="grid md:grid-cols-2 gap-8 mb-6">
            {/* Customer Info */}
            <div className="space-y-3">
                <h5 className="font-bold text-brand-orange uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2"><User size={12}/> Info Pelanggan</h5>
                <div className="bg-brand-card/50 p-4 rounded-lg border border-white/5 space-y-2">
                    <div className="flex items-center gap-3 text-gray-300">
                        <span className="text-white font-bold">{order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                        <Phone size={14} className="text-gray-500"/> 
                        <a href={`https://wa.me/${order.customer_phone}`} target="_blank" rel="noreferrer" className="hover:text-brand-orange transition-colors">
                            {order.customer_phone}
                        </a>
                    </div>
                    <div className="flex items-start gap-3 text-gray-400">
                        <MapPin size={14} className="text-gray-500 shrink-0 mt-0.5"/> 
                        <span className="leading-snug">{order.customer_address}</span>
                    </div>
                </div>
                {order.customer_note && (
                    <div className="mt-2 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded text-xs text-yellow-500/80 italic">
                        "Catatan: {order.customer_note}"
                    </div>
                )}
            </div>
            
            {/* Items Info */}
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

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-2 pt-4 border-t border-white/5">
                {['pending', 'paid', 'processed', 'completed', 'cancelled'].map(status => (
                    <button
                    key={status}
                    onClick={() => onStatusUpdate(order.id, status)}
                    disabled={order.status === status}
                    className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all border ${
                        order.status === status 
                        ? 'bg-brand-orange text-white border-brand-orange opacity-100 cursor-default' 
                        : 'bg-transparent border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                    }`}
                    >
                    {status}
                    </button>
                ))}
        </div>
    </div>
);

// --- ATOMIC COMPONENT: Order Card (Row) ---
const OrderCard = ({ 
    order, 
    expanded, 
    onToggle, 
    items,
    onStatusUpdate,
    key
}: { 
    order: Order, 
    expanded: boolean, 
    onToggle: () => void,
    items: OrderItem[],
    onStatusUpdate: (id: number, status: string) => void,
    key?: any
}) => (
    <div className={`bg-brand-dark border transition-all rounded-xl overflow-hidden mb-3 ${expanded ? 'border-brand-orange/50 shadow-neon-text/10' : 'border-white/5 hover:border-white/20'}`}>
        <div 
            className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
            onClick={onToggle}
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg border transition-colors ${expanded ? 'bg-brand-orange text-white border-brand-orange' : 'bg-brand-card text-gray-500 border-white/10'}`}>
                    <Package size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm">Order #{order.id}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Clock size={10} />
                        {new Date(order.created_at).toLocaleDateString('id-ID')} • {new Date(order.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 md:gap-8 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(order.status)}`}>
                    {order.status}
                    </span>
                    <p className="font-bold text-white text-sm min-w-[100px] text-right">{formatRupiah(order.total_amount)}</p>
                    {expanded ? <ChevronUp size={16} className="text-brand-orange"/> : <ChevronDown size={16} className="text-gray-600"/>}
            </div>
        </div>

        {expanded && (
            <OrderDetail 
                order={order} 
                items={items} 
                onStatusUpdate={onStatusUpdate} 
            />
        )}
    </div>
);

// --- MAIN COMPONENT ---
export const AdminOrders = () => {
  const { orders, loading, expandedOrderId, orderItems, fetchOrderItems, updateStatus } = useAdminOrders();

  if (loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      {orders.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-2xl">
            <Package size={48} className="text-gray-700 mx-auto mb-4"/>
            <p className="text-gray-500">Belum ada pesanan masuk saat ini.</p>
        </div>
      ) : (
        <div className="space-y-2">
           <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Daftar Transaksi</span>
              <span className="text-xs text-brand-orange bg-brand-orange/10 px-2 py-1 rounded border border-brand-orange/20">Total: {orders.length}</span>
           </div>
           {orders.map((order) => (
             <OrderCard 
               key={order.id}
               order={order}
               expanded={expandedOrderId === order.id}
               onToggle={() => fetchOrderItems(order.id)}
               items={orderItems[order.id]}
               onStatusUpdate={updateStatus}
             />
           ))}
        </div>
      )}
    </div>
  );
};
