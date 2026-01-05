
import React from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CheckCircle2, Copy } from 'lucide-react';
import { formatRupiah } from '../../utils';
import { CartItem } from '../../types';
import { Button } from '../ui';

// --- ATOM: Cart Item Row ---
export const CartItemRow: React.FC<{ 
    item: CartItem, 
    onUpdateQty: (id: number, delta: number) => void, 
    onRemove: (id: number) => void 
}> = ({ 
    item, 
    onUpdateQty, 
    onRemove 
}) => (
    <div className="flex gap-4 p-4 bg-brand-card border border-white/5 rounded-xl items-center">
        <div className="w-20 h-20 bg-black rounded-lg shrink-0 overflow-hidden border border-white/10">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white mb-1 truncate text-sm md:text-base">{item.name}</h4>
            <p className="text-brand-orange text-sm font-bold">{formatRupiah(item.price)}</p>
        </div>
        <div className="flex items-center gap-3 bg-black/30 rounded-lg p-1 border border-white/5">
            <button onClick={() => onUpdateQty(item.id, -1)} className="p-1 text-gray-400 hover:text-white"><Minus size={14} /></button>
            <span className="text-white text-xs w-6 text-center font-bold">{item.quantity}</span>
            <button onClick={() => onUpdateQty(item.id, 1)} className="p-1 text-gray-400 hover:text-white"><Plus size={14} /></button>
        </div>
        <button onClick={() => onRemove(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
            <Trash2 size={18} />
        </button>
    </div>
);

// --- ATOM: Bank Details Card ---
export const BankTransferCard = ({ onCopy }: { onCopy: (text: string) => void }) => (
    <div className="bg-brand-dark p-6 rounded-xl border border-white/10 mb-8 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <p className="text-sm text-gray-400 mb-2">Transfer ke Rekening Resmi:</p>
        <div className="flex items-center justify-between bg-black/40 p-4 rounded-lg border border-white/5">
            <div>
                <p className="font-mono text-xl text-brand-orange font-bold tracking-wider">5859 4594 0674 0414</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-white">Bank Neo Commerce (BNC)</span>
                    <span className="text-[10px] text-gray-500 px-2 py-0.5 rounded bg-white/10">a.n PT MESIN KASIR SOLO</span>
                </div>
            </div>
            <button onClick={() => onCopy('5859459406740414')} className="p-2 hover:text-brand-orange text-gray-400 transition-colors" title="Salin Nomor">
                <Copy size={20} />
            </button>
        </div>
    </div>
);

// --- ATOM: Empty Cart State ---
export const EmptyCartView = ({ onBack }: { onBack: () => void }) => (
    <div className="flex flex-col items-center justify-center py-20 min-h-[400px] bg-brand-card/50 rounded-3xl border-2 border-dashed border-white/10 animate-fade-in">
        <div className="w-24 h-24 bg-brand-orange/10 rounded-full flex items-center justify-center mb-6 text-brand-orange shadow-neon">
            <ShoppingBag size={48} />
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-3">Wah, Keranjang Kosong!</h3>
        <p className="text-gray-400 mb-8 max-w-md text-center leading-relaxed">
            Sepertinya Anda belum menambahkan produk apapun. Mari temukan mesin kasir terbaik untuk bisnis Anda.
        </p>
        <Button 
            onClick={onBack} 
            className="px-8 py-4 text-base md:text-lg shadow-neon hover:shadow-neon-strong transition-transform hover:-translate-y-1"
        >
            Lihat Katalog Produk
        </Button>
    </div>
);
