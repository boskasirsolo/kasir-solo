
import React from 'react';
import { Check } from 'lucide-react';
import { formatRupiah } from '../../../utils';
import { CalcOption } from './types';

export const BaseOptionItem: React.FC<{ 
    option: CalcOption, 
    isSelected: boolean, 
    onSelect: () => void,
    onDetail: () => void 
}> = ({ 
    option, 
    isSelected, 
    onSelect,
    onDetail
}) => (
    <div 
        onClick={onSelect}
        className={`p-3 md:p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group active:scale-[0.98] ${
            isSelected 
            ? 'bg-brand-orange/10 border-brand-orange shadow-neon-text/20' 
            : 'bg-white/5 border-white/5 hover:border-white/20'
        }`}
    >
        <div className="flex-1 min-w-0 pr-4">
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mb-1">
                <h5 className={`font-bold text-sm md:text-base truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>{option.label}</h5>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDetail(); }}
                    className="text-[10px] font-bold text-brand-orange hover:text-white underline decoration-brand-orange/30 underline-offset-2 transition-colors shrink-0 w-fit"
                >
                    pelajari detail
                </button>
            </div>
            {option.desc && <p className="text-[10px] md:text-xs text-gray-500 truncate">{option.desc}</p>}
        </div>
        <div className="text-right shrink-0">
            <span className={`text-xs md:text-sm font-bold ${isSelected ? 'text-brand-orange' : 'text-gray-500'}`}>
                {formatRupiah(option.price)}
            </span>
        </div>
    </div>
);

export const AddonOptionItem: React.FC<{ 
    option: CalcOption, 
    isSelected: boolean, 
    onToggle: () => void,
    onDetail: () => void 
}> = ({ 
    option, 
    isSelected, 
    onToggle,
    onDetail
}) => (
    <div 
        onClick={onToggle}
        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 group active:scale-[0.98] ${
            isSelected
            ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
            : 'bg-white/5 border-white/5 hover:border-white/20'
        }`}
    >
        <div className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
            isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-600 bg-black'
        }`}>
            {isSelected && <Check size={12} />}
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
                <h5 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>{option.label}</h5>
            </div>
            <div className="flex items-center justify-between mt-1">
                <p className="text-[10px] text-gray-500">{formatRupiah(option.price)}</p>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDetail(); }}
                    className="text-[9px] font-bold text-brand-orange hover:text-white underline decoration-brand-orange/30 underline-offset-2 transition-colors shrink-0"
                >
                    detail
                </button>
            </div>
        </div>
    </div>
);
