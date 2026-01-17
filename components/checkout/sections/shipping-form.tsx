
import React from 'react';
import { Zap, ShieldCheck, Check, Ticket, Loader2 } from 'lucide-react';
import { Input, TextArea, Button, LoadingSpinner } from '../../ui';
import { CheckoutFormData } from '../types';
import { formatRupiah } from '../../../utils';

export const ShippingForm = ({ 
    formData, onChange, onBlur, onSubmit, isSubmitting, subtotalPrice, totalPrice, discount, 
    couponInput, setCouponInput, applyCoupon, isValidatingCoupon, agreed, setAgreed 
}: any) => {
    return (
        <div className="lg:col-span-5">
            <div className="bg-brand-dark border border-white/10 rounded-2xl p-6 md:p-8 sticky top-24 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Info Pengiriman</h3>
                
                <form onSubmit={onSubmit} className="space-y-4">
                    <Input value={formData.name} onChange={e => onChange('name', e.target.value)} onBlur={onBlur} placeholder="Nama Penerima" />
                    <Input value={formData.phone} onChange={e => onChange('phone', e.target.value)} onBlur={onBlur} placeholder="WA: 0812..." type="tel" />
                    <TextArea value={formData.address} onChange={e => onChange('address', e.target.value)} onBlur={onBlur} placeholder="Alamat Lengkap..." className="h-20" />

                    {/* KUPON SECTION */}
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

                    <div className="mt-6 p-4 bg-brand-orange/5 border border-brand-orange/20 rounded-xl">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                            <input type="checkbox" className="mt-1" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}/>
                            <p className="text-[10px] text-gray-400">Saya menyetujui S&K. Data sudah benar.</p>
                        </label>
                    </div>

                    <div className="pt-6 border-t border-white/10 space-y-2">
                        <div className="flex justify-between text-xs"><span className="text-gray-500">Subtotal</span><span className="text-white">{formatRupiah(subtotalPrice)}</span></div>
                        {discount && (
                            <div className="flex justify-between text-xs text-green-400 font-bold">
                                <span>Promo ({discount.code})</span>
                                <span>-{formatRupiah(discount.amount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2">
                            <span className="text-white">TOTAL</span>
                            <span className="text-brand-orange font-display">{formatRupiah(totalPrice)}</span>
                        </div>
                        <Button type="submit" className="w-full py-4 shadow-neon" disabled={isSubmitting || !agreed}>
                            {isSubmitting ? <LoadingSpinner /> : "BAYAR SEKARANG"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
