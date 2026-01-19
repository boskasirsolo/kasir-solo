
import React from 'react';
import { ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItemRow } from '../ui-parts';
import { CartItem } from '../../../types';
import { Button } from '../../ui';
import { formatRupiah } from '../../../utils';

interface CartSummaryProps {
    cart: CartItem[];
    subtotal: number;
    onUpdateQty: (id: number, delta: number) => void;
    onRemove: (id: number) => void;
    onClear: () => void;
    onBack: () => void;
    onNext: () => void;
}

export const CartSummary = ({ cart, subtotal, onUpdateQty, onRemove, onClear, onBack, onNext }: CartSummaryProps) => {
    return (
        <div className="space-y-6 p-4 md:p-2">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <ShoppingBag size={18} className="text-brand-orange" />
                    Daftar Belanja ({cart.length} Item)
                </h3>
                <button 
                    onClick={onClear} 
                    className="text-red-500 hover:text-red-400 text-xs font-bold hover:underline"
                >
                    Hapus Semua
                </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {cart.map((item) => (
                    <CartItemRow 
                        key={item.id} 
                        item={item} 
                        onUpdateQty={onUpdateQty} 
                        onRemove={onRemove} 
                    />
                ))}
            </div>
            
            <div className="bg-brand-dark border border-white/10 rounded-2xl p-6 mt-6">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400 text-sm">Subtotal Estimasi</span>
                    <span className="text-xl md:text-2xl font-display font-bold text-white">{formatRupiah(subtotal)}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                        onClick={onBack} 
                        className="py-4 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} /> Lanjut Belanja
                    </button>
                    <Button 
                        onClick={onNext} 
                        className="w-full py-4 text-sm font-bold shadow-neon bg-brand-gradient hover:bg-brand-gradient-hover"
                    >
                        LANJUT PENGIRIMAN <ArrowRight size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
};
