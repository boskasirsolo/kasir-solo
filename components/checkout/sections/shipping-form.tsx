
import React from 'react';
import { Zap, ShieldCheck, Check } from 'lucide-react';
import { Input, TextArea, Button, LoadingSpinner } from '../../ui';
import { CheckoutFormData } from '../types';
import { formatRupiah } from '../../../utils';

interface ShippingFormProps {
    formData: CheckoutFormData;
    onChange: (field: keyof CheckoutFormData, val: string) => void;
    onBlur: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    totalPrice: number;
    agreed: boolean;
    setAgreed: (v: boolean) => void;
}

export const ShippingForm = ({ 
    formData, onChange, onBlur, onSubmit, isSubmitting, totalPrice, agreed, setAgreed 
}: ShippingFormProps) => {
    return (
        <div className="lg:col-span-5">
            <div className="bg-brand-dark border border-white/10 rounded-2xl p-6 md:p-8 sticky top-24 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                    Info Pengiriman
                </h3>
                
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Lengkap</label>
                        <Input 
                            value={formData.name} 
                            onChange={e => onChange('name', e.target.value)} 
                            onBlur={onBlur}
                            placeholder="Nama Penerima" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex justify-between">
                            <span>WhatsApp (Wajib)</span>
                            <span className="text-[9px] text-brand-orange flex items-center gap-1 bg-brand-orange/10 px-1.5 rounded"><Zap size={8}/> Auto-Save</span>
                        </label>
                        <Input 
                            value={formData.phone} 
                            onChange={e => onChange('phone', e.target.value)} 
                            onBlur={onBlur}
                            placeholder="Contoh: 081234567890" 
                            type="tel" 
                        />
                        <p className="text-[10px] text-gray-500 mt-1">Format: 08xx atau 628xx (Min 10 digit)</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alamat Lengkap</label>
                        <TextArea 
                            value={formData.address} 
                            onChange={e => onChange('address', e.target.value)} 
                            placeholder="Jalan, No Rumah, Kelurahan, Kecamatan..." 
                            className="h-24" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Catatan (Opsional)</label>
                        <Input 
                            value={formData.note} 
                            onChange={e => onChange('note', e.target.value)} 
                            placeholder="Patokan lokasi, warna, dll" 
                        />
                    </div>

                    {/* TERMS CHECKBOX */}
                    <div className="mt-6 p-4 bg-brand-orange/5 border border-brand-orange/20 rounded-xl">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                            <div className="relative flex items-center mt-0.5 shrink-0">
                                <input 
                                    type="checkbox" 
                                    className="peer sr-only"
                                    checked={agreed} 
                                    onChange={(e) => setAgreed(e.target.checked)}
                                />
                                <div className={`w-5 h-5 border-2 rounded transition-all flex items-center justify-center ${agreed ? 'bg-brand-orange border-brand-orange' : 'border-gray-500 bg-transparent hover:border-gray-300'}`}>
                                    {agreed && <Check size={14} className="text-white" />}
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Saya menyetujui <button type="button" onClick={() => window.open('/legal/terms', '_blank')} className="text-brand-orange font-bold hover:underline">Syarat & Ketentuan</button>. Data pengiriman sudah benar.
                            </p>
                        </label>
                    </div>

                    {/* SUMMARY & SUBMIT */}
                    <div className="pt-6 border-t border-white/10 mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-sm">Subtotal Produk</span>
                            <span className="text-white font-bold">{formatRupiah(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-400 text-sm">Ongkos Kirim</span>
                            <span className="text-green-400 text-xs font-bold italic bg-green-500/10 px-2 py-1 rounded">Cek via WA Admin</span>
                        </div>
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-lg text-white font-bold">Total Estimasi</span>
                            <span className="text-2xl text-brand-orange font-bold font-display">{formatRupiah(totalPrice)}</span>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full py-4 text-lg shadow-neon" 
                            disabled={isSubmitting || !agreed}
                        >
                            {isSubmitting ? <LoadingSpinner /> : "BUAT PESANAN SEKARANG"}
                        </Button>
                        <p className="text-center text-xs text-gray-600 mt-4 flex items-center justify-center gap-1">
                            <ShieldCheck size={12} /> Transaksi aman & terdata di sistem kami.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
