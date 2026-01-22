
import React from 'react';
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight, Wallet } from 'lucide-react';
import { useCart } from '../../context/cart-context';
import { formatRupiah, optimizeImage } from '../../utils';
import { Button } from '../ui';
import { useNavigate } from 'react-router-dom';

export const CartDrawer = () => {
    const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart, totalPrice } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setCartOpen(false);
        navigate('/checkout');
    };

    return (
        <>
            {/* Backdrop Layer */}
            <div 
                className={`fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setCartOpen(false)}
            />

            {/* Sidebar Panel */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-dark border-l border-white/10 z-[9995] shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-brand-card shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange">
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg leading-none">Tas Belanja</h3>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{cart.length} Item Terpilih</p>
                        </div>
                    </div>
                    <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-white/5 text-gray-500 hover:text-white rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 bg-brand-black/20">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                            <ShoppingBag size={64} className="mb-4 mx-auto text-gray-700" />
                            <p className="text-sm font-bold uppercase tracking-widest">Masih Kosong, Bos.</p>
                            <p className="text-xs mt-2">Yuk borong alat tempurnya!</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-4 group animate-fade-in bg-white/5 p-3 rounded-2xl border border-white/5">
                                <div className="w-16 h-16 bg-black rounded-xl border border-white/10 overflow-hidden shrink-0">
                                    <img src={optimizeImage(item.image, 200)} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h4 className="text-white font-bold text-xs truncate mb-1">{item.name}</h4>
                                    <p className="text-brand-orange font-bold text-xs mb-3">{formatRupiah(item.price)}</p>
                                    
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/5">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-gray-500 hover:text-white transition-colors"><Minus size={12}/></button>
                                            <span className="text-[10px] font-bold text-white w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-gray-500 hover:text-white transition-colors"><Plus size={12}/></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500/50 hover:text-red-500 transition-colors">
                                            <Trash2 size={14}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-white/10 bg-brand-card shrink-0">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Total Tagihan</p>
                            <p className="text-2xl font-display font-bold text-white">{formatRupiah(totalPrice)}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[9px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 uppercase">Aman Terenkripsi</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-brand-gradient hover:bg-brand-gradient-hover text-white rounded-xl font-bold text-sm shadow-neon hover:shadow-neon-strong transition-all transform active:scale-95 disabled:opacity-30"
                    >
                        <Wallet size={18} /> LANJUT CHECKOUT <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </>
    );
};
