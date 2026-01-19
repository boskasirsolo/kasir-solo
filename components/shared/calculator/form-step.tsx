
import React from 'react';
import { ArrowRight, Loader2, User, Phone, Building, MapPin, Tag, ChevronDown, BarChart3, ChevronLeft } from 'lucide-react';
import { Button, Input } from '../../ui';

const CATEGORIES = ["Cafe / Resto", "Retail / Toko", "Fashion / Butik", "Laundry", "Minimarket", "Lainnya"];
const SCALES = ["Mikro (Gerobakan/Rumahan)", "Kecil (Toko Tunggal)", "Menengah (2-5 Cabang)", "Gede (Grosir/Distributor)", "Enterprise (Rantai Nasional)", "Lainnya"];

interface FormStepProps {
    customerInfo: any;
    setCustomerInfo: (info: any) => void;
    onConsultation: () => void;
    onBack: () => void;
    onShadowCapture: () => void;
    isCapturing: boolean;
}

export const FormStep = ({ 
    customerInfo, 
    setCustomerInfo, 
    onConsultation, 
    onBack, 
    onShadowCapture, 
    isCapturing 
}: FormStepProps) => {
    
    const isFormIncomplete = !customerInfo.name || !customerInfo.phone || !customerInfo.company || !customerInfo.address || 
                             !customerInfo.category || (customerInfo.category === 'Lainnya' && !customerInfo.customCategory) ||
                             !customerInfo.scale || (customerInfo.scale === 'Lainnya' && !customerInfo.customScale);

    return (
        <div className="flex flex-col p-6 animate-slide-in-right h-full">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4 shrink-0">
                <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition-colors -ml-2">
                    <ChevronLeft size={20} className="text-gray-400 hover:text-white"/>
                </button>
                <div className="w-8 h-8 rounded-lg bg-white text-brand-dark flex items-center justify-center font-bold text-sm">2</div>
                <h4 className="font-bold text-white text-sm uppercase tracking-widest">Identitas Juragan</h4>
            </div>

            <div className="overflow-y-auto custom-scrollbar pr-2 space-y-3 flex-grow min-h-0">
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
                {customerInfo.category === 'Lainnya' && (
                    <div className="animate-fade-in">
                        <Input 
                            value={customerInfo.customCategory}
                            onChange={e => setCustomerInfo({...customerInfo, customCategory: e.target.value})}
                            onBlur={onShadowCapture}
                            placeholder="Tulis Kategori Bisnis Lo..." 
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
            <div className="mt-4 pt-4 border-t border-white/10 shrink-0">
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
    );
};
