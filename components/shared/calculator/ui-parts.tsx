
import React, { useState } from 'react';
import { Check, Calculator, ArrowRight, Loader2, User, Phone, Building, MapPin, Tag, ChevronDown, BarChart3, ShoppingBag, ListChecks, ChevronLeft } from 'lucide-react';
import { formatRupiah } from '../../../utils';
import { Button, Input } from '../../ui';
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

const CATEGORIES = ["Cafe / Resto", "Retail / Toko", "Fashion / Butik", "Laundry", "Minimarket", "Lainnya"];
const SCALES = ["Mikro (Gerobakan/Rumahan)", "Kecil (Toko Tunggal)", "Menengah (2-5 Cabang)", "Gede (Grosir/Distributor)", "Enterprise (Rantai Nasional)", "Lainnya"];

export const ResultCard = ({ 
    calculation, 
    customerInfo,
    setCustomerInfo,
    onConsultation,
    onShadowCapture,
    hasBaseSelection,
    isCapturing = false
}: { 
    calculation: any, 
    customerInfo: any,
    setCustomerInfo: any,
    onConsultation: () => void,
    onShadowCapture: () => void,
    hasBaseSelection: boolean,
    isCapturing?: boolean
}) => {
    // Wizard State
    const [step, setStep] = useState(1);

    // Validasi form identitas lengkap (For Step 2)
    const isFormIncomplete = !customerInfo.name || !customerInfo.phone || !customerInfo.company || !customerInfo.address || 
                             !customerInfo.category || (customerInfo.category === 'Lainnya' && !customerInfo.customCategory) ||
                             !customerInfo.scale || (customerInfo.scale === 'Lainnya' && !customerInfo.customScale);

    // Go to step 2 check
    const handleNextStep = () => {
        if (!hasBaseSelection) return;
        setStep(2);
    };

    return (
        <div className="lg:col-span-5 p-4 md:p-10 bg-black/40 flex flex-col h-full" id="result-card-anchor">
            <div className="bg-brand-card border border-white/10 rounded-2xl relative overflow-hidden shadow-2xl flex flex-col transition-all duration-500 h-fit">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Calculator size={120} />
                </div>
                
                {/* STEP 1: SUMMARY / CART VIEW */}
                {step === 1 && (
                    <div className="flex flex-col p-6 animate-fade-in">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <div className="w-8 h-8 rounded-lg bg-brand-orange text-white flex items-center justify-center font-bold text-sm shadow-neon">1</div>
                            <h4 className="font-bold text-white text-sm uppercase tracking-widest">Rincian Investasi</h4>
                        </div>

                        <div className="overflow-y-auto custom-scrollbar pr-2 space-y-3 max-h-[50vh]">
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
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex justify-between items-end mb-4">
                                <span className="text-xs text-gray-400">Estimasi Total</span>
                                <div className="text-right">
                                    <span className="text-2xl font-display font-bold text-white block leading-none">{formatRupiah(calculation.total.min)}</span>
                                    <span className="text-[10px] text-gray-500">s/d {formatRupiah(calculation.total.max)}</span>
                                </div>
                            </div>
                            <Button 
                                onClick={handleNextStep} 
                                disabled={!hasBaseSelection} 
                                className="w-full py-4 text-sm font-bold shadow-neon bg-brand-gradient hover:bg-brand-gradient-hover"
                            >
                                Konsultasi <ArrowRight size={16} className="ml-2"/>
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 2: IDENTITY FORM */}
                {step === 2 && (
                    <div className="flex flex-col p-6 animate-slide-in-right">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <button onClick={() => setStep(1)} className="p-1 hover:bg-white/10 rounded-full transition-colors -ml-2">
                                <ChevronLeft size={20} className="text-gray-400 hover:text-white"/>
                            </button>
                            <div className="w-8 h-8 rounded-lg bg-white text-brand-dark flex items-center justify-center font-bold text-sm">2</div>
                            <h4 className="font-bold text-white text-sm uppercase tracking-widest">Identitas Juragan</h4>
                        </div>

                        <div className="overflow-y-auto custom-scrollbar pr-2 space-y-3 max-h-[50vh]">
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-600" size={14} />
                                <Input 
                                    value={customerInfo.name}
                                    onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                                    onBlur={onShadowCapture}
                                    placeholder="Nama Lengkap" 
                                    className="pl-10 py-2.5 text-xs bg-black/40 border-white/5 focus:border-brand-orange"
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-gray-600" size={14} />
                                <Input 
                                    value={customerInfo.phone}
                                    onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                                    onBlur={onShadowCapture}
                                    placeholder="Nomor WhatsApp" 
                                    className="pl-10 py-2.5 text-xs bg-black/40 border-white/5 focus:border-brand-orange"
                                />
                            </div>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 text-gray-600" size={14} />
                                <Input 
                                    value={customerInfo.company}
                                    onChange={e => setCustomerInfo({...customerInfo, company: e.target.value})}
                                    onBlur={onShadowCapture}
                                    placeholder="Nama Usaha / Perusahaan" 
                                    className="pl-10 py-2.5 text-xs bg-black/40 border-white/5 focus:border-brand-orange"
                                />
                            </div>
                            
                            <div className="relative">
                                <Tag className="absolute left-3 top-3 text-gray-600" size={14} />
                                <select 
                                    value={customerInfo.category}
                                    onChange={e => setCustomerInfo({...customerInfo, category: e.target.value})}
                                    onBlur={onShadowCapture}
                                    className="w-full bg-black/40 border border-white/5 rounded-lg pl-10 pr-10 py-2.5 text-xs text-white outline-none focus:border-brand-orange transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">-- Pilih Kategori Bisnis --</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 text-gray-600 pointer-events-none" size={14} />
                            </div>

                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-600" size={14} />
                                <Input 
                                    value={customerInfo.address}
                                    onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                                    onBlur={onShadowCapture}
                                    placeholder="Alamat / Kota" 
                                    className="pl-10 py-2.5 text-xs bg-black/40 border-white/5 focus:border-brand-orange"
                                />
                            </div>

                            <div className="relative">
                                <BarChart3 className="absolute left-3 top-3 text-gray-600" size={14} />
                                <select 
                                    value={customerInfo.scale}
                                    onChange={e => setCustomerInfo({...customerInfo, scale: e.target.value})}
                                    onBlur={onShadowCapture}
                                    className="w-full bg-black/40 border border-white/5 rounded-lg pl-10 pr-10 py-2.5 text-xs text-white outline-none focus:border-brand-orange transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">-- Pilih Skala Bisnis --</option>
                                    {SCALES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-3 text-gray-600 pointer-events-none" size={14} />
                            </div>
                            {customerInfo.scale === 'Lainnya' && (
                                <div className="animate-fade-in">
                                    <Input 
                                        value={customerInfo.customScale}
                                        onChange={e => setCustomerInfo({...customerInfo, customScale: e.target.value})}
                                        onBlur={onShadowCapture}
                                        placeholder="Tulis Skala Bisnis Lo (Cth: Pabrik)..." 
                                        className="py-2.5 text-xs bg-black/40 border-brand-orange/30"
                                    />
                                </div>
                            )}
                        </div>

                        {/* FINAL CTA */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <Button 
                                onClick={onConsultation}
                                disabled={isCapturing || isFormIncomplete}
                                className="w-full py-4 text-sm font-bold shadow-neon hover:shadow-neon-strong bg-green-600 hover:bg-green-500"
                            >
                                {isCapturing ? <Loader2 className="animate-spin" /> : <><ArrowRight size={16} className="mr-2" /> KONSULTASI SEKARANG</>}
                            </Button>
                            <p className="text-[9px] text-gray-600 text-center mt-3 italic">
                                *Harga final ditentukan setelah sesi konsultasi teknis.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
