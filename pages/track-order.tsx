
import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, Copy, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { supabase, formatRupiah } from '../utils';
import { SectionHeader, Input, Button, Card, LoadingSpinner } from '../components/ui';
import { Order, OrderItem } from '../types';

// --- COMPONENTS ---

const StatusStep = ({ 
    active, 
    completed, 
    icon: Icon, 
    label, 
    date 
}: { 
    active: boolean, 
    completed: boolean, 
    icon: any, 
    label: string, 
    date?: string 
}) => {
    let colorClass = 'text-gray-600 border-gray-700 bg-brand-dark';
    if (completed) colorClass = 'text-green-500 border-green-500 bg-green-500/10';
    if (active) colorClass = 'text-brand-orange border-brand-orange bg-brand-orange/10 animate-pulse';

    return (
        <div className="flex flex-col items-center text-center relative z-10 w-1/4">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 transition-all ${colorClass}`}>
                <Icon size={18} />
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${active || completed ? 'text-white' : 'text-gray-600'}`}>{label}</p>
            {date && <p className="text-[9px] text-gray-500 mt-1">{date}</p>}
        </div>
    );
};

const Timeline = ({ status, created_at }: { status: string, created_at: string }) => {
    const steps = ['pending', 'paid', 'processed', 'completed'];
    const currentIndex = steps.indexOf(status === 'cancelled' ? 'pending' : status);
    
    // Progress Bar Width
    const progress = Math.max(0, Math.min(100, (currentIndex / (steps.length - 1)) * 100));

    return (
        <div className="relative my-8 px-4">
            {/* Background Line */}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-white/10 -z-0"></div>
            {/* Active Line */}
            <div 
                className="absolute top-5 left-0 h-0.5 bg-brand-orange -z-0 transition-all duration-1000"
                style={{ width: `${progress}%` }}
            ></div>

            <div className="flex justify-between relative z-10">
                <StatusStep 
                    active={status === 'pending'} 
                    completed={currentIndex > 0} 
                    icon={Clock} 
                    label="Nunggu Duit" 
                    date={new Date(created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                />
                <StatusStep 
                    active={status === 'paid'} 
                    completed={currentIndex > 1} 
                    icon={CheckCircle2} 
                    label="Udah Lunas" 
                />
                <StatusStep 
                    active={status === 'processed'} 
                    completed={currentIndex > 2} 
                    icon={Package} 
                    label="Lagi Dirakit" 
                />
                <StatusStep 
                    active={status === 'completed'} 
                    completed={status === 'completed'} 
                    icon={Truck} 
                    label="Meluncur" 
                />
            </div>
        </div>
    );
};

export const TrackOrderPage = () => {
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ order: Order, items: OrderItem[] } | null>(null);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        // Clean input: remove spaces, remove '#' if user typed it
        const cleanId = orderId.trim().replace('#', '');
        
        if (!cleanId) return;
        
        setLoading(true);
        setError('');
        setResult(null);

        console.log("Searching for Order ID:", cleanId);

        try {
            if (!supabase) throw new Error("Database not connected");

            // 1. Fetch Order Head
            // Using .maybeSingle() instead of .single() to avoid JSON errors on 404
            const { data: order, error: orderErr } = await supabase
                .from('orders')
                .select('*')
                .eq('id', cleanId)
                .maybeSingle();

            if (orderErr) {
                console.error("Supabase Error:", orderErr);
                throw orderErr;
            }

            if (!order) {
                setError("Pesanan ga ketemu, Bos. Coba cek lagi Order ID di WhatsApp lo.");
            } else {
                console.log("Order Found:", order);
                
                // 2. Fetch Order Items
                const { data: items, error: itemsErr } = await supabase
                    .from('order_items')
                    .select('*')
                    .eq('order_id', order.id);
                
                if (itemsErr) console.error("Items Error:", itemsErr);

                setResult({ order, items: items || [] });
            }
        } catch (err: any) {
            console.error("Catch Error:", err);
            // Handle specific Supabase Policy error or Type error
            if (err.message && err.message.includes('invalid input syntax')) {
                setError("Format ID salah. ID harusnya angka doang.");
            } else {
                setError("Gagal loading data. Sinyal lo jelek atau server gue yang lagi bengong.");
            }
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Nomor resi udah disalin. Cek di web kurir ya!");
    };

    const getStatusLabel = (status: string) => {
        switch(status) {
            case 'pending': return 'Nunggu Transfer';
            case 'paid': return 'Pembayaran Diterima (Verified)';
            case 'processed': return 'Sedang Dirakit / Packing';
            case 'completed': return 'Dalam Perjalanan (OTW)';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };

    return (
        <div className="animate-fade-in pt-24 pb-20">
            <div className="container mx-auto px-4">
                <SectionHeader 
                    title="Paket Gue" 
                    highlight="Sampe Mana?" 
                    subtitle="Gak usah was-was barang lo dicolong kurir atau nyasar. Cek status real-time di sini. Gue pantau terus sampe depan pintu lo."
                />

                <div className="max-w-2xl mx-auto">
                    {/* SEARCH BOX */}
                    <div className="bg-brand-card border border-white/10 rounded-2xl p-6 md:p-8 shadow-neon mb-8">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Order ID (Cek WhatsApp)</label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-3.5 text-gray-500" size={18} />
                                    <Input 
                                        value={orderId} 
                                        onChange={e => setOrderId(e.target.value)} 
                                        placeholder="Contoh: 123456789012" 
                                        className="pl-12 py-3 text-lg font-mono tracking-widest"
                                        type="number" // Enforce number input for mobile keyboards
                                    />
                                </div>
                            </div>
                            <div className="flex items-end">
                                <Button type="submit" disabled={loading} className="w-full md:w-auto h-[50px] px-8 shadow-neon">
                                    {loading ? <LoadingSpinner /> : "LACAK SEKARANG"}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* ERROR STATE */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-center text-red-400 mb-8 animate-fade-in flex items-center justify-center gap-2">
                            <ShieldAlert size={20} /> {error}
                        </div>
                    )}

                    {/* RESULT CARD */}
                    {result && (
                        <div className="bg-brand-dark border border-white/10 rounded-2xl overflow-hidden animate-fade-in shadow-2xl">
                            {/* Header Status */}
                            <div className="bg-white/5 p-6 border-b border-white/5 flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Status Misi</p>
                                    <h3 className="text-2xl font-display font-bold text-white capitalize">
                                        {getStatusLabel(result.order.status)}
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 text-xs">Order ID</p>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(result.order.id.toString());
                                            alert("Order ID disalin!");
                                        }}
                                        className="flex items-center justify-end gap-2 text-brand-orange font-mono font-bold text-lg hover:text-white transition-colors group"
                                        title="Klik untuk menyalin"
                                    >
                                        #{result.order.id} 
                                        <Copy size={14} className="opacity-50 group-hover:opacity-100 transition-opacity"/>
                                    </button>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="p-6 md:p-8 border-b border-white/5">
                                <Timeline status={result.order.status} created_at={result.order.created_at} />
                            </div>

                            {/* Tracking Info (If Shipped) */}
                            {result.order.tracking_number && (
                                <div className="p-6 bg-brand-orange/5 border-b border-brand-orange/20 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center text-white shadow-neon">
                                            <Truck size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-brand-orange uppercase tracking-widest">Resi Pengiriman ({result.order.courier})</p>
                                            <p className="text-xl font-mono text-white font-bold tracking-wide">{result.order.tracking_number}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(result.order.tracking_number!)}
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
                                    {result.items.map((item, idx) => (
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
                                    <span className="text-xl font-bold text-brand-orange">{formatRupiah(result.order.total_amount)}</span>
                                </div>
                            </div>

                            {/* Footer Help */}
                            <div className="p-4 bg-white/5 text-center">
                                <p className="text-xs text-gray-500">
                                    Paket mandeg atau nyasar? <a href="https://wa.me/6282325103336" target="_blank" className="text-brand-orange hover:underline font-bold">Lapor Komandan (Admin)</a>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
