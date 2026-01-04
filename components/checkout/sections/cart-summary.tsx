
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CartItemRow } from '../ui-parts';
import { CartItem } from '../../../types';

interface CartSummaryProps {
    cart: CartItem[];
    onUpdateQty: (id: number, delta: number) => void;
    onRemove: (id: number) => void;
    onClear: () => void;
    onBack: () => void;
}

export const CartSummary = ({ cart, onUpdateQty, onRemove, onClear, onBack }: CartSummaryProps) => {
    return (
        <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
                {cart.map((item) => (
                    <CartItemRow 
                        key={item.id} 
                        item={item} 
                        onUpdateQty={onUpdateQty} 
                        onRemove={onRemove} 
                    />
                ))}
            </div>
            
            <div className="flex justify-between items-center pt-6 border-t border-white/10">
                <button 
                    onClick={onBack} 
                    className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Lanjut Belanja
                </button>
                <button 
                    onClick={onClear} 
                    className="text-red-500 hover:text-red-400 text-sm font-bold hover:underline"
                >
                    Hapus Semua
                </button>
            </div>
        </div>
    );
};
