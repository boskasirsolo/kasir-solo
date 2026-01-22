
import React from 'react';
import { Ticket, Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Input, TextArea, Button, LoadingSpinner, PhoneInput } from '../../ui';
import { formatRupiah } from '../../../utils';

export const ShippingForm = ({ 
    formData, onChange, onBlur, onSubmit, isSubmitting, subtotalPrice, totalPrice, discount, 
    couponInput, setCouponInput, applyCoupon, isValidatingCoupon, agreed, onToggleTerms, onBack 
}: any) => {
    return (
        <div className="p-4 md:p-2">
            <div className="bg-brand-dark border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                    <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h3 className="text-lg md:text-xl font-bold text-white">Data Pengiriman</h3>
                        <p className="text-xs text-gray-500">Pastikan alamat lo bener biar kurir gak pusing.</p>
                    </div>
                </div>
                
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input value={formData.name} onChange={(e: any) => onChange('name', e.target.value)} onBlur={onBlur} placeholder="Nama Lengkap" />
                        <PhoneInput value={formData.phone} onChange={(e: any) => onChange('phone', e.target.value)} onBlur={onBlur} placeholder="Nomor WhatsApp" />
                    </div>
                    <TextArea value={formData.address} onChange={(e: any) => onChange('address', e.target.value)} onBlur={onBlur} placeholder="Alamat Lengkap (Jl, RT/RW, Kota, Kode Pos)..." className="h-24" />

                    {/* PROMO SECTION */}
                    <div className="pt-4 border-t border-white/5">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Punya Kode Promo?</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Ticket className="absolute left-3 top-2.5 text-gray-600" size={14} />
                                <input 
                                    value={couponInput} 
                                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                    placeholder="KASIRSOLO2025"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-brand-orange outline-none"
                                />
                            </div>
                            <button 
                                type="button"
                                onClick={applyCoupon}
                                disabled={isValidatingCoupon || !couponInput}
                                className="px-4 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange rounded-lg text-xs font-bold hover:bg-brand-orange hover:text-white transition-all disabled:opacity-30"
                            >
                                {isValidatingCoupon ? <Loader2 size={14} className="animate-spin"/> : "CEK"}
                            </button>
                        </div>
                    </div>

                    {/* COMPLIANCE CHECKBOX */}
                    <div className={`mt-6 p-4 rounded-xl border transition-all duration-300 ${agreed ? 'bg-green-500/10 border-green-500/30' : 'bg-brand-orange/5 border-brand-orange/20'}`}>
                        <label className="flex items-start gap-4 cursor-pointer select-none group">
                            <input 
                                type="checkbox" 
                                className="mt-1 w-5 h-5 accent-brand-orange cursor-pointer" 
                                checked={agreed} 
                                onChange={onToggleTerms}
                            />
                            <div className="flex-1">
                                <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${agreed ? 'text-green-400' : 'text-brand-orange'}`}>
                                    {agreed ? 'SAYA SETUJU & SIAP TRANSAKSI' : 'BACA DULU ATURAN MAINNYA'}
                                </p>
                                <p className="text-[10px] text-gray-400 leading-relaxed group-hover:text-gray-300">
                                    Centang untuk menyetujui syarat layanan. Pesanan tidak dapat dibatalkan setelah pembayaran dikonfirmasi.
                                </p>
                            </div>
                        </label>
                    </div>

                    <div className="pt-6 border-t border-white/10 space-y-2">
                        <div className="flex justify-between text-xs"><span className="text-gray-500">Subtotal Barang</span><span className="text-white">{formatRupiah(subtotalPrice)}</span></div>
                        {discount && (
                            <div className="flex justify-between text-xs text-green-400 font-bold">
                                <span>Promo ({discount.code})</span>
                                <span>-{formatRupiah(discount.amount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-end pt-2">
                            <span className="text-white font-bold text-sm">TOTAL TAGIHAN</span>
                            <span className="text-brand-orange font-display font-bold text-2xl">{formatRupiah(totalPrice)}</span>
                        </div>
                        <Button type="submit" className="w-full py-4 shadow-neon mt-4" disabled={isSubmitting || !agreed}>
                            {isSubmitting ? <LoadingSpinner /> : "BAYAR SEKARANG"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
