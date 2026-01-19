
import React from 'react';
import { ArrowRight, ShoppingBag, ListChecks } from 'lucide-react';
import { formatRupiah } from '../../../utils';
import { Button } from '../../ui';

interface SummaryStepProps {
    calculation: any;
    hasBaseSelection: boolean;
    onNext: () => void;
}

export const SummaryStep = ({ calculation, hasBaseSelection, onNext }: SummaryStepProps) => {
    return (
        <div className="flex flex-col p-6 animate-fade-in h-full">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-brand-orange text-white flex items-center justify-center font-bold text-sm shadow-neon">1</div>
                <h4 className="font-bold text-white text-sm uppercase tracking-widest">Rincian Investasi</h4>
            </div>

            <div className="overflow-y-auto custom-scrollbar pr-2 space-y-3 flex-grow min-h-0">
                {!hasBaseSelection ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-50">
                        <ShoppingBag size={40} className="mb-2"/>
                        <p className="text-sm font-bold">Keranjang Kosong</p>
                        <p className="text-xs">Pilih paket di sebelah kiri dulu.</p>
                    </div>
                ) : (
                    <>
                        {/* BASE ITEM */}
                        <div className="bg-brand-orange/10 border border-brand-orange/30 p-3 rounded-xl">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] text-brand-orange font-bold uppercase tracking-widest mb-1">Paket Utama</p>
                                    <p className="text-sm font-bold text-white">{calculation.baseLabel}</p>
                                </div>
                                <p className="text-sm font-bold text-brand-orange font-mono">{formatRupiah(calculation.basePrice)}</p>
                            </div>
                        </div>

                        {/* ADDONS LIST */}
                        {calculation.activeAddons.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2 flex items-center gap-1">
                                    <ListChecks size={12}/> Item Tambahan
                                </p>
                                {calculation.activeAddons.map((addon: any) => (
                                    <div key={addon.id} className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-lg flex justify-between items-center">
                                        <span className="text-xs text-blue-200 font-medium">{addon.label}</span>
                                        <span className="text-xs text-blue-400 font-bold font-mono">{formatRupiah(addon.price)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* TOTAL & ACTION */}
            <div className="mt-4 pt-4 border-t border-white/10 shrink-0">
                <div className="flex justify-between items-end mb-4">
                    <span className="text-xs text-gray-400">Estimasi Total</span>
                    <div className="text-right">
                        <span className="text-2xl font-display font-bold text-white block leading-none">{formatRupiah(calculation.total.min)}</span>
                        <span className="text-[10px] text-gray-500">s/d {formatRupiah(calculation.total.max)}</span>
                    </div>
                </div>
                <Button 
                    onClick={onNext} 
                    disabled={!hasBaseSelection} 
                    className="w-full py-4 text-sm font-bold shadow-neon bg-brand-gradient hover:bg-brand-gradient-hover"
                >
                    Konsultasi <ArrowRight size={16} className="ml-2"/>
                </Button>
            </div>
        </div>
    );
};
