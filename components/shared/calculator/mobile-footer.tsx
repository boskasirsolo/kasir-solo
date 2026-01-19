
import React from 'react';
import { ArrowDown } from 'lucide-react';
import { formatRupiah } from '../../../utils';

interface MobileStickyFooterProps {
    total: number;
    onContinue: () => void;
}

export const MobileStickyFooter = ({ total, onContinue }: MobileStickyFooterProps) => {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1000] p-4 bg-brand-dark/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] animate-fade-in">
            <div className="flex justify-between items-center gap-4">
                <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Estimasi Total</p>
                    <p className="text-lg font-display font-bold text-white leading-none mt-1">{formatRupiah(total)}</p>
                </div>
                <button 
                    onClick={onContinue}
                    className="px-6 py-3 bg-brand-orange text-white rounded-xl font-bold shadow-neon flex items-center gap-2 text-sm"
                >
                    LANJUT <ArrowDown size={16} />
                </button>
            </div>
        </div>
    );
};
