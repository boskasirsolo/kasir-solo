
import React, { useState } from 'react';
import { useCart } from '../context/cart-context';
import { formatRupiah, supabase, normalizePhone } from '../utils';
import { Button, Input, TextArea, Card, SectionHeader, LoadingSpinner } from '../components/ui';
import { Trash2, Plus, Minus, ArrowLeft, CheckCircle2, Copy, ShoppingBag } from 'lucide-react';

export const CheckoutPage = ({ setPage }: { setPage: (p: string) => void }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ id: number, total: number } | null>(null);

  // --- GENERATOR: 12-Digit Random ID ---
  // Range: 100,000,000,000 to 999,999,999,999
  // Fits in Javascript Number (Safe limit is 9 quadrillion / 16 digits)
  // Probability collision: 1 in 900 Billion (System effectively works once)
  // Logic: Min value starts with 1, ensuring NO leading zeros (0000...).
  const generateOrderId = () => {
    const min = 100000000000;
    const max = 999999999999;
    return Math.floor(min + Math.random() * (max - min + 1));
  };

  // --- SMART INSERT: Auto-Retry if ID exists ---
  const createOrderSafe = async (payload: any, maxRetries = 5) => {
    for (let i = 0; i < maxRetries; i++) {
      const newId = generateOrderId();
      
      // Try insert
      const { data, error } = await supabase
        .from('orders')
        .insert([{ ...payload, id: newId }])
        .select()
        .single();

      if (!error) return data; // Success! Return the order data

      // If error is NOT a duplicate key error (Postgres code 23505), throw it immediately
      if (error.code !== '23505') {
        throw error;
      }
      
      // If it IS a duplicate key (extremely rare with 12 digits), retry silently
      console.warn(`Order ID Collision ${newId}. Retrying... (${i + 1}/${maxRetries})`);
    }
    throw new Error("Gagal membuat Order ID unik. Silakan coba lagi.");
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Mohon lengkapi Nama, No. HP, dan Alamat.");
      return;
    }

    // STRICT PHONE VALIDATION
    const cleanPhone = normalizePhone(formData.phone);
    if (!cleanPhone) {
      alert("Format Nomor WhatsApp tidak valid.\n\nContoh yang benar:\n- 081234567890\n- 6281234567890\n\n(Minimal 10 digit, Maksimal 15 digit)");
      return;
    }

    setIsSubmitting(true);

    try {
      // DEMO MODE CHECK
      if (!supabase) {
        console.warn("Database connection missing. Running in demo mode.");
        await new Promise(resolve => setTimeout(resolve, 1500));
        setOrderSuccess({ id: generateOrderId(), total: totalPrice });
        clearCart();
        return;
      }

      // 1. Create Order Head (With Smart Retry)
      const orderPayload = {
        customer_name: formData.name,
        customer_phone: cleanPhone, // Use validated phone
        customer_address: formData.address,
        customer_note: formData.note,
        total_amount: totalPrice,
        status: 'pending',
        payment_method: 'transfer_bnc'
      };

      // This function handles the looping automatically
      const orderData = await createOrderSafe(orderPayload);

      // 2. Create Order Items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        // Rollback: Delete order if items fail
        await supabase.from('orders').delete().eq('id', orderData.id);
        throw itemsError;
      }

      // Success!
      setOrderSuccess({ id: orderData.id, total: totalPrice });
      clearCart();

    } catch (error: any) {
      console.error(error);
      if (error.message?.includes('foreign key constraint') || error.code === '23503') {
        alert("Sistem mendeteksi perubahan data produk. Keranjang Anda akan diperbarui otomatis.");
        clearCart();
        setPage('shop');
      } else {
        alert(`Gagal membuat pesanan: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Nomor rekening disalin!");
  };

  // --- VIEW: SUCCESS SCREEN ---
  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 animate-fade-in flex justify-center">
        <div className="max-w-2xl w-full bg-brand-card border border-brand-orange rounded-3xl p-8 md:p-12 text-center shadow-neon">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Pesanan Diterima!</h2>
          <p className="text-gray-400 mb-8">Order ID: <span className="text-brand-orange font-mono text-xl md:text-2xl font-bold tracking-wider">#{orderSuccess.id}</span></p>

          <div className="bg-brand-dark p-6 rounded-xl border border-white/10 mb-8 text-left">
            <p className="text-sm text-gray-400 mb-2">Silakan transfer total pembayaran:</p>
            <div className="text-2xl font-bold text-white mb-6">{formatRupiah(orderSuccess.total)}</div>

            <p className="text-sm text-gray-400 mb-2">Ke Rekening Bank Neo Commerce (BNC):</p>
            <div className="flex items-center justify-between bg-black/40 p-4 rounded-lg border border-white/5">
              <div>
                <p className="font-mono text-xl text-brand-orange font-bold tracking-wider">5859 4594 0674 0414</p>
                <p className="text-sm text-gray-300">a.n PT MESIN KASIR SOLO</p>
              </div>
              <button onClick={() => copyToClipboard('5859459406740414')} className="p-2 hover:text-brand-orange text-gray-400 transition-colors">
                <Copy size={20} />
              </button>
            </div>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            Setelah transfer, mohon konfirmasi bukti pembayaran ke WhatsApp Admin agar pesanan segera diproses.
          </p>

          <a 
            href={`https://wa.me/6282325103336?text=Halo Admin PT Mesin Kasir Solo, saya sudah transfer untuk Order ID #${orderSuccess.id} sebesar ${formatRupiah(orderSuccess.total)}. Berikut bukti transfernya...`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-green-500/20"
          >
            Konfirmasi via WhatsApp
          </a>

          <div className="mt-8">
            <button onClick={() => setPage('home')} className="text-gray-500 hover:text-white text-sm">Kembali ke Beranda</button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: CART & CHECKOUT FORM ---
  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      <SectionHeader title="Keranjang" highlight="Belanja" />
      
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 min-h-[400px] bg-brand-card/50 rounded-3xl border-2 border-dashed border-white/10">
          <div className="w-24 h-24 bg-brand-orange/10 rounded-full flex items-center justify-center mb-6 text-brand-orange shadow-neon">
             <ShoppingBag size={48} />
          </div>
          <h3 className="text-2xl font-display font-bold text-white mb-3">Wah, Keranjang Kosong!</h3>
          <p className="text-gray-400 mb-8 max-w-md text-center leading-relaxed">
            Sepertinya Anda belum menambahkan produk apapun. Mari temukan mesin kasir terbaik untuk bisnis Anda.
          </p>
          <Button 
             onClick={() => setPage('shop')} 
             className="px-8 py-4 text-base md:text-lg shadow-neon hover:shadow-neon-strong transition-transform hover:-translate-y-1"
          >
             Lihat Katalog Produk
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: Cart Items */}
          <div className="lg:col-span-7 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-brand-card border border-white/5 rounded-xl items-center">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-black" />
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-1">{item.name}</h4>
                  <p className="text-brand-orange text-sm font-bold">{formatRupiah(item.price)}</p>
                </div>
                <div className="flex items-center gap-3 bg-black/30 rounded-lg p-1 border border-white/5">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-gray-400 hover:text-white"><Minus size={16} /></button>
                  <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-gray-400 hover:text-white"><Plus size={16} /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <div className="flex justify-between items-center pt-6 border-t border-white/10">
               <button onClick={() => setPage('shop')} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm"><ArrowLeft size={16} /> Lanjut Belanja</button>
               <button onClick={clearCart} className="text-red-500 hover:text-red-400 text-sm">Hapus Semua</button>
            </div>
          </div>

          {/* RIGHT: Checkout Form */}
          <div className="lg:col-span-5">
            <div className="bg-brand-dark border border-white/10 rounded-2xl p-6 md:p-8 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                Info Pengiriman
              </h3>
              
              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Lengkap</label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nama Penerima" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp (Wajib)</label>
                  <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Contoh: 081234567890" type="tel" />
                  <p className="text-[10px] text-gray-500 mt-1">Format: 08xx atau 628xx (Min 10 digit)</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alamat Lengkap</label>
                  <TextArea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Jalan, No Rumah, Kelurahan, Kecamatan..." className="h-24" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Catatan (Opsional)</label>
                  <Input value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} placeholder="Patokan lokasi, warna, dll" />
                </div>

                <div className="pt-6 border-t border-white/10 mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Subtotal Produk</span>
                    <span className="text-white font-bold">{formatRupiah(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400">Ongkos Kirim</span>
                    <span className="text-green-400 text-sm italic">Cek via WA Admin</span>
                  </div>
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-xl text-white font-bold">Total Estimasi</span>
                    <span className="text-2xl text-brand-orange font-bold font-display">{formatRupiah(totalPrice)}</span>
                  </div>

                  <Button type="submit" className="w-full py-4 text-lg" disabled={isSubmitting}>
                    {isSubmitting ? <LoadingSpinner /> : "BUAT PESANAN SEKARANG"}
                  </Button>
                  <p className="text-center text-xs text-gray-600 mt-4">
                    Dengan membuat pesanan, Anda setuju untuk melakukan transfer pembayaran ke rekening perusahaan.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
