
import React, { useEffect, useState } from 'react';
import { supabase, formatRupiah } from '../utils';
import { Order, OrderItem, SiteConfig } from '../types';
import { LoadingSpinner } from './ui';
import { ChevronDown, ChevronUp, Package, Phone, User, MapPin, Clock, Truck, Save, Copy, Printer, FileText } from 'lucide-react';

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

  const updateShipping = async (orderId: number, courier: string, trackingNumber: string) => {
      if (!supabase) return;
      try {
          const { error } = await supabase.from('orders').update({ 
              courier: courier,
              tracking_number: trackingNumber,
              // Auto update status to completed/shipped if tracking is filled
              status: trackingNumber ? 'completed' : 'processed'
          }).eq('id', orderId);
          
          if(error) throw error;
          
          setOrders(orders.map(o => o.id === orderId ? { 
              ...o, 
              courier, 
              tracking_number: trackingNumber,
              status: trackingNumber ? 'completed' : 'processed' as any
          } : o));
          alert("Data pengiriman disimpan!");
      } catch(e) { alert("Gagal simpan resi"); }
  };

  return { orders, loading, expandedOrderId, orderItems, fetchOrderItems, updateStatus, updateShipping };
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

// --- INVOICE GENERATOR ---
const handlePrintInvoice = (order: Order, items: OrderItem[], config: SiteConfig) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert("Pop-up diblokir. Izinkan pop-up untuk mencetak invoice.");

    const invoiceDate = new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const dueDate = new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const companyName = config.companyLegalName || "PT MESIN KASIR SOLO";
    const companyAddress = config.addressSolo || "Perum Graha Tiara 2 B1, Kartasura, Sukoharjo, Jawa Tengah";
    const companyPhone = config.whatsappNumber ? (config.whatsappNumber.startsWith('62') ? '+' + config.whatsappNumber : config.whatsappNumber) : "+62 823 2510 3336";
    const statusLabel = order.status === 'completed' || order.status === 'paid' || order.status === 'processed' ? 'LUNAS (PAID)' : 'UNPAID';
    const stampColor = order.status === 'cancelled' ? 'text-red-500 border-red-500' : 'text-green-600 border-green-600';

    const html = `
    <html>
    <head>
        <title>Invoice #${order.id} - ${companyName}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
            .watermark { 
                position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 8rem; font-weight: 900; opacity: 0.1; border: 8px solid; padding: 20px; z-index: 0;
            }
        </style>
    </head>
    <body class="bg-white text-gray-900 p-8 max-w-4xl mx-auto border border-gray-200 min-h-screen relative overflow-hidden">
        
        <!-- WATERMARK -->
        <div class="watermark ${stampColor}">
            ${order.status.toUpperCase()}
        </div>

        <!-- HEADER -->
        <div class="flex justify-between items-start mb-12 border-b border-gray-200 pb-8 relative z-10">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-1 tracking-tight">${companyName}</h1>
                <p class="text-sm text-gray-500 max-w-xs leading-relaxed">${companyAddress}</p>
                <p class="text-sm text-gray-500 mt-1">Tel: ${companyPhone}</p>
            </div>
            <div class="text-right">
                <h2 class="text-4xl font-bold text-gray-200 uppercase tracking-widest mb-2">Invoice</h2>
                <p class="text-sm font-bold text-gray-700">#INV-${order.id}</p>
                <p class="text-xs text-gray-500 mt-1">Date: ${invoiceDate}</p>
                <p class="text-xs text-gray-500">Due Date: ${dueDate}</p>
            </div>
        </div>

        <!-- BILL TO -->
        <div class="flex justify-between mb-12 relative z-10">
            <div>
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tagihan Kepada:</h3>
                <p class="text-lg font-bold text-gray-800">${order.customer_name}</p>
                <p class="text-sm text-gray-600 max-w-xs leading-relaxed">${order.customer_address}</p>
                <p class="text-sm text-gray-600 mt-1">${order.customer_phone}</p>
            </div>
            ${order.tracking_number ? `
            <div class="text-right">
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pengiriman:</h3>
                <p class="text-sm font-bold text-gray-800">${order.courier}</p>
                <p class="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block mt-1">${order.tracking_number}</p>
            </div>` : ''}
        </div>

        <!-- TABLE -->
        <table class="w-full mb-12 relative z-10">
            <thead>
                <tr class="bg-gray-50 border-y border-gray-200">
                    <th class="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Deskripsi Item</th>
                    <th class="py-3 px-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                    <th class="py-3 px-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Harga Satuan</th>
                    <th class="py-3 px-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
                ${items.map(item => `
                <tr>
                    <td class="py-4 px-4 text-sm font-bold text-gray-800">${item.product_name}</td>
                    <td class="py-4 px-4 text-center text-sm text-gray-600">${item.quantity}</td>
                    <td class="py-4 px-4 text-right text-sm text-gray-600">Rp ${new Intl.NumberFormat('id-ID').format(item.price)}</td>
                    <td class="py-4 px-4 text-right text-sm font-bold text-gray-800">Rp ${new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <!-- TOTALS & PAYMENT -->
        <div class="flex flex-col md:flex-row justify-between items-start mb-16 relative z-10">
            <div class="bg-gray-50 p-6 rounded-lg w-full md:w-1/2 mb-6 md:mb-0">
                <h4 class="text-xs font-bold text-gray-500 uppercase mb-3">Metode Pembayaran</h4>
                <div class="text-sm text-gray-700">
                    <p class="font-bold">Bank Neo Commerce (BNC)</p>
                    <p class="font-mono mt-1">5859 4594 0674 0414</p>
                    <p class="text-xs mt-1 text-gray-500">a.n PT MESIN KASIR SOLO</p>
                </div>
            </div>
            <div class="w-full md:w-1/3 space-y-3">
                <div class="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${formatRupiah(order.total_amount)}</span>
                </div>
                <div class="flex justify-between text-sm text-gray-600 border-b border-gray-200 pb-3">
                    <span>Pajak (0%)</span>
                    <span>Rp 0</span>
                </div>
                <div class="flex justify-between text-xl font-bold text-gray-900 pt-1">
                    <span>Total</span>
                    <span>${formatRupiah(order.total_amount)}</span>
                </div>
            </div>
        </div>

        <!-- FOOTER & SIGNATURE -->
        <div class="grid grid-cols-2 gap-8 mt-auto pt-12 border-t border-gray-200 relative z-10">
            <div>
                <h4 class="text-xs font-bold text-gray-400 uppercase mb-2">Catatan:</h4>
                <p class="text-xs text-gray-500 leading-relaxed italic">
                    Barang yang sudah dibeli tidak dapat ditukar/dikembalikan kecuali ada perjanjian garansi tertulis. 
                    Invoice ini sah dan diproses oleh komputer.
                </p>
            </div>
            <div class="text-center pl-12">
                <p class="text-sm font-bold text-gray-800 mb-16">Hormat Kami,</p>
                <div class="border-t border-gray-300 w-2/3 mx-auto"></div>
                <p class="text-xs text-gray-500 mt-2">Finance Dept.</p>
            </div>
        </div>

        <script>
            window.onload = () => { setTimeout(() => window.print(), 500); }
        </script>
    </body>
    </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
};

// --- ATOMIC COMPONENT: Order Details ---
const OrderDetail = ({ 
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

    return (
    <div className="border-t border-white/5 bg-black/20 p-6 animate-fade-in text-sm">
        <div className="grid md:grid-cols-2 gap-8 mb-6">
            {/* LEFT: Customer & Items */}
            <div className="space-y-6">
                {/* Customer Info */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h5 className="font-bold text-brand-orange uppercase text-[10px] tracking-widest flex items-center gap-2"><User size={12}/> Info Pelanggan</h5>
                        
                        {/* INVOICE BUTTON */}
                        <button 
                            onClick={() => handlePrintInvoice(order, items, config)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] font-bold text-white transition-all group"
                            title="Download PDF / Print Invoice"
                        >
                            <Printer size={12} className="text-brand-orange group-hover:scale-110 transition-transform" /> 
                            Cetak Invoice
                        </button>
                    </div>

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

            {/* RIGHT: Actions & Shipping */}
            <div className="space-y-6">
                
                {/* SHIPPING MANAGEMENT */}
                <div className="bg-brand-card/50 p-4 rounded-lg border border-white/5">
                    <h5 className="font-bold text-blue-400 uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2">
                        <Truck size={12}/> Update Pengiriman
                    </h5>
                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] text-gray-500 block mb-1">Kurir / Ekspedisi</label>
                            <input 
                                value={courier}
                                onChange={e => setCourier(e.target.value)}
                                placeholder="JNE, J&T, Sicepat..."
                                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-brand-orange outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 block mb-1">Nomor Resi (Tracking ID)</label>
                            <div className="flex gap-2">
                                <input 
                                    value={tracking}
                                    onChange={e => setTracking(e.target.value)}
                                    placeholder="Input resi..."
                                    className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white focus:border-brand-orange outline-none font-mono"
                                />
                                <button 
                                    onClick={() => onShippingUpdate(order.id, courier, tracking)}
                                    className="px-3 bg-brand-orange text-white rounded text-xs font-bold hover:bg-brand-action transition-all flex items-center gap-1"
                                >
                                    <Save size={14} />
                                </button>
                            </div>
                        </div>
                        <p className="text-[9px] text-gray-500 italic mt-2">
                            *Mengisi nomor resi akan otomatis mengubah status menjadi <strong>COMPLETED</strong> dan bisa dilacak user.
                        </p>
                    </div>
                </div>

                {/* MANUAL STATUS CONTROL */}
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

// --- ATOMIC COMPONENT: Order Card (Row) ---
const OrderCard = ({ 
    order, 
    expanded, 
    onToggle, 
    items,
    onStatusUpdate,
    onShippingUpdate,
    config
}: { 
    order: Order, 
    expanded: boolean, 
    onToggle: () => void,
    items: OrderItem[],
    onStatusUpdate: (id: number, status: string) => void,
    onShippingUpdate: (id: number, c: string, t: string) => void,
    config: SiteConfig
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
                    <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">Order #{order.id}</h4>
                        {order.tracking_number && (
                            <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 flex items-center gap-1">
                                <Truck size={8}/> Dikirim
                            </span>
                        )}
                    </div>
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
                onShippingUpdate={onShippingUpdate}
                config={config}
            />
        )}
    </div>
);

// --- MAIN COMPONENT ---
export const AdminOrders = ({ config }: { config: SiteConfig }) => {
  const { orders, loading, expandedOrderId, orderItems, fetchOrderItems, updateStatus, updateShipping } = useAdminOrders();

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
             <React.Fragment key={order.id}>
               <OrderCard 
                 order={order}
                 expanded={expandedOrderId === order.id}
                 onToggle={() => fetchOrderItems(order.id)}
                 items={orderItems[order.id]}
                 onStatusUpdate={updateStatus}
                 onShippingUpdate={updateShipping}
                 config={config}
               />
             </React.Fragment>
           ))}
        </div>
      )}
    </div>
  );
};
