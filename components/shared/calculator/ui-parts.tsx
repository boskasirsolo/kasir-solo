
import React from 'react';
import { Check, Calculator, ArrowRight, Loader2, User, Phone, Building, MapPin, Tag, ChevronDown, BarChart3 } from 'lucide-react';
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
        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
            isSelected 
            ? 'bg-brand-orange/10 border-brand-orange shadow-neon-text/20' 
            : 'bg-white/5 border-white/5 hover:border-white/20'
        }`}
    >
        <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-3 mb-1">
                <h5 className={`font-bold truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>{option.label}</h5>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDetail(); }}
                    className="text-[10px] font-bold text-brand-orange hover:text-white underline decoration-brand-orange/30 underline-offset-2 transition-colors shrink-0"
                >
                    pelajari detail
                </button>
            </div>
            {option.desc && <p className="text-xs text-gray-500 truncate">{option.desc}</p>}
        </div>
        <div className="text-right shrink-0">
            <span className={`text-sm font-bold ${isSelected ? 'text-brand-orange' : 'text-gray-500'}`}>
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
        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-3 group ${
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
            <div className="flex items-center gap-3">
                <h5 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>{option.label}</h5>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDetail(); }}
                    className="text-[9px] font-bold text-brand-orange hover:text-white underline decoration-brand-orange/30 underline-offset-2 transition-colors shrink-0"
                >
                    detail
                </button>
            </div>
            <p className="text-[10px] text-gray-500">{formatRupiah(option.price)}</p>
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
    // Validasi form identitas lengkap
    const isFormIncomplete = !customerInfo.name || !customerInfo.phone || !customerInfo.company || !customerInfo.address || 
                             !customerInfo.category || (customerInfo.category === 'Lainnya' && !customerInfo.customCategory) ||
                             !customerInfo.scale || (customerInfo.scale === 'Lainnya' && !customerInfo.customScale);

    return (
        <div className="lg:col-span-5 p-6 md:p-10 bg-black/40 flex flex-col h-full">
            <div className="bg-brand-card border border-white/10 rounded-2xl p-6 relative overflow-hidden shadow-2xl flex flex-col h-full">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Calculator size={120} />
                </div>
                
                {/* LEAD FORM SECTION */}
                <div className="relative z-10 mb-8 space-y-4">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                        <User size={14} className="text-brand-orange"/> Identitas Juragan
                    </h4>
                    
                    <div className="grid gap-3">
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
                        
                        {/* SKALA BISNIS */}
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
                    </div>
                </div>

                {/* ESTIMATION SECTION */}
                <div className="relative z-10 border-t border-white/10 pt-6 mt-auto">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">Estimasi Investasi Awal</p>
                    
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
                        </div>
                    ) : (
                        <div className="py-4 text-center opacity-50">
                            <p className="text-xl font-bold text-gray-600">-- IDR --</p>
                            <p className="text-[10px] text-gray-500 mt-2">Pilih paket di kiri dulu</p>
                        </div>
                    )}

                    <div className="mt-8">
                        <Button 
                            onClick={onConsultation}
                            disabled={!hasBaseSelection || isCapturing || isFormIncomplete}
                            className="w-full py-4 text-sm font-bold shadow-neon hover:shadow-neon-strong bg-brand-gradient"
                        >
                            {isCapturing ? <Loader2 className="animate-spin" /> : <><ArrowRight size={16} className="mr-2" /> KONSULTASI SEKARANG</>}
                        </Button>
                        <p className="text-[9px] text-gray-600 text-center mt-3 italic">
                            {isFormIncomplete ? '*Lengkapi identitas untuk membuka tombol.' : '*Harga final ditentukan setelah sesi konsultasi teknis.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
