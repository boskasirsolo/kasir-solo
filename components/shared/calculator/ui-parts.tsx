
import React from 'react';
import { Check, Calculator, ArrowRight } from 'lucide-react';
import { formatRupiah } from '../../../utils';
import { Button } from '../../ui';
import { CalcOption } from './types';

export const CalcHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="p-6 md:p-10 border-b border-white/5 bg-black/20 text-center">
     <div className="inline-flex items-center justify-center p-3 bg-brand-orange/10 rounded-full text-brand-orange mb-4 shadow-neon">
        <Calculator size={32} />
     </div>
     <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{title}</h2>
     <p className="text-gray-400">{subtitle}</p>
  </div>
);

export const BaseOptionItem = ({ 
    option, 
    isSelected, 
    onSelect 
}: { 
    option: CalcOption, 
    isSelected: boolean, 
    onSelect: () => void 
}) => (
    <div 
        onClick={onSelect}
        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
            isSelected 
            ? 'bg-brand-orange/10 border-brand-orange shadow-neon-text/20' 
            : 'bg-white/5 border-white/5 hover:border-white/20'
        }`}
    >
        <div>
            <h5 className={`font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{option.label}</h5>
            {option.desc && <p className="text-xs text-gray-500 mt-1">{option.desc}</p>}
        </div>
        <div className="text-right">
            <span className={`text-sm font-bold ${isSelected ? 'text-brand-orange' : 'text-gray-500'}`}>
                {formatRupiah(option.price)}
            </span>
        </div>
    </div>
);

export const AddonOptionItem = ({ 
    option, 
    isSelected, 
    onToggle 
}: { 
    option: CalcOption, 
    isSelected: boolean, 
    onToggle: () => void 
}) => (
    <div 
        onClick={onToggle}
        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 group ${
            isSelected
            ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
            : 'bg-white/5 border-white/5 hover:border-white/20'
        }`}
    >
        <div className={`w-5 h-5 rounded flex items-center justify-center border ${
            isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-600 bg-black'
        }`}>
            {isSelected && <Check size={12} />}
        </div>
        <div className="flex-1">
            <h5 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{option.label}</h5>
            <p className="text-[10px] text-gray-500">{formatRupiah(option.price)}</p>
        </div>
    </div>
);

export const ResultCard = ({ 
    calculation, 
    onConsultation, 
    hasBaseSelection 
}: { 
    calculation: any, 
    onConsultation: () => void, 
    hasBaseSelection: boolean 
}) => (
    <div className="lg:col-span-5 p-6 md:p-10 bg-black/40 flex flex-col justify-center">
        <div className="bg-brand-card border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Calculator size={120} />
            </div>
            
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Estimasi Investasi Awal</p>
            
            {hasBaseSelection ? (
                <div className="space-y-6 animate-fade-in">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total Estimasi</p>
                        <p className="text-4xl font-display font-bold text-white tracking-tight">
                            {formatRupiah(calculation.total.min)}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                            s/d {formatRupiah(calculation.total.max)}
                        </p>
                    </div>

                    <div className="mt-4 h-px bg-white/10"></div>
                    <p className="text-[10px] text-gray-400 italic leading-relaxed">
                        *Angka ini adalah estimasi kasar setup awal berdasarkan pilihan Anda. Harga final & detail maintenance (jika ada) ditentukan setelah sesi konsultasi teknis.
                    </p>
                </div>
            ) : (
                <div className="py-12 text-center opacity-50">
                    <p className="text-xl font-bold text-gray-600">-- IDR --</p>
                    <p className="text-xs text-gray-500 mt-2">Pilih paket di kiri dulu</p>
                </div>
            )}

            <div className="mt-8">
                <Button 
                    onClick={onConsultation}
                    disabled={!hasBaseSelection}
                    className="w-full py-4 text-sm font-bold shadow-neon hover:shadow-neon-strong"
                >
                    KIRIM HASIL KE WHATSAPP <ArrowRight size={16} />
                </Button>
            </div>
        </div>
    </div>
);
