
import React from 'react';
import { Ticket, Loader2, ArrowLeft, Search, MapPin, Truck, Check, Info } from 'lucide-react';
import { Input, TextArea, Button, LoadingSpinner, PhoneInput } from '../../ui';
import { formatRupiah } from '../../../utils';

export const ShippingForm = ({ 
    formData, onChange, onBlur, onSubmit, isSubmitting, subtotalPrice, totalPrice, discount, 
    couponInput, setCouponInput, applyCoupon, isValidatingCoupon, agreed, onToggleTerms, onBack,
    area, shipping
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
                        <p className="text-xs text-gray-500">Kirim dari Solo ke lokasi Juragan.</p>
                    </div>
                </div>
                
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input value={formData.name} onChange={(e: any) => onChange('name', e.target.value)} onBlur={onBlur} placeholder="Nama Lengkap Juragan" />
                        <PhoneInput value={formData.phone} onChange={(e: any) => onChange('phone', e.target.value)} onBlur={onBlur} placeholder="Nomor WhatsApp" />
                    </div>

                    {/* BITESHIP AREA SEARCH */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <MapPin size={12}/> Cari Kecamatan / Kota
                        </label>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-3 text-gray-600" />
                            <Input 
                                value={area.query} 
                                onChange={(e: any) => { area.setQuery(e.target.value); if(area.selected) area.setSelected(null); }} 
                                placeholder="Ketik minimal 3 huruf (Cth: Kartasura)..."
                                className="pl-10 bg-black/40"
                            />
                            {area.isSearching && (
                                <div className="absolute right-3 top-3">
                                    <Loader2 size={16} className="animate-spin text-brand-orange" />
                                </div>
                            )}
                        </div>
                        
                        {/* AUTOCOMPLETE RESULTS */}
                        {area.results.length > 0 && !area.selected && (
                            <div className="bg-brand-card border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-48 overflow-y-auto custom-scrollbar animate-scale-up z-50">
                                {area.results.map((res: any) => (
                                    <button 
                                        key={res.id} 
                                        type="button"
                                        onClick={() => { area.setSelected(res); area.setQuery(res.name); }}
                                        className="w-full text-left p-3 text-xs text-gray-300 hover:bg-brand-orange hover:text-white transition-all border-b border-white/5 last:border-0 flex items-center gap-3"
                                    >
                                        <MapPin size={14} className="opacity-50" /> {res.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {area.selected && (
                            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 p-2.5 rounded-lg text-green-400 text-[10px] font-bold animate-fade-in shadow-inner">
                                <Check size={14}/> TERPILIH: {area.selected.name}
                                <button type="button" onClick={() => { area.setSelected(null); area.setQuery(''); }} className="ml-auto underline decoration-dotted">Ubah</button>
                            </div>
                        )}
                    </div>

                    <TextArea value={formData.address} onChange={(e: any) => onChange('address', e.target.value)} onBlur={onBlur} placeholder="Detail Alamat (Nama Jalan, No Rumah, RT/RW)..." className="h-20" />

                    {/* COURIER SELECTOR */}
                    {area.selected && (
                        <div className="space-y-3 animate-fade-in">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Truck size={12}/> Pilih Ekspedisi
                            </label>
                            
                            {shipping.isLoading ? (
                                <div className="py-8 flex flex-col items-center justify-center bg-black/20 rounded-xl border border-dashed border-white/10">
                                    <LoadingSpinner size={24} />
                                    <p className="text-[10px] text-gray-600 mt-2 font-bold uppercase tracking-widest">Nego Harga ke Kurir...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {shipping.rates.map((rate: any) => (
                                        <button
                                            key={`${rate.courier_code}-${rate.service_code}`}
                                            type="button"
                                            onClick={() => shipping.setSelected(rate)}
                                            className={`p-4 rounded-xl border transition-all text-left flex justify-between items-center group relative overflow-hidden ${
                                                shipping.selected?.courier_code === rate.courier_code && shipping.selected?.service_code === rate.service_code
                                                ? 'bg-brand-orange/10 border-brand-orange shadow-neon-text/5'
                                                : 'bg-black/20 border-white/5 hover:border-white/20'
                                            }`}
                                        >
                                            <div className="min-w-0 z-10">
                                                <p className="text-xs font-black text-white uppercase flex items-center gap-2">
                                                    {rate.courier_name}
                                                    {rate.service_code === 'reg' && <span className="text-[7px] bg-blue-500 text-white px-1 rounded">Reguler</span>}
                                                </p>
                                                <p className="text-[10px] text-gray-500 truncate mt-0.5">Estimasi: {rate.shipment_duration_range} {rate.shipment_duration_unit}</p>
                                            </div>
                                            <p className="text-sm font-bold text-brand-orange z-10">{formatRupiah(rate.price)}</p>
                                            {shipping.selected?.courier_code === rate.courier_code && shipping.selected?.service_code === rate.service_code && (
                                                <div className="absolute -right-2 -bottom-2 opacity-10"><Truck size={40}/></div>
                                            )}
                                        </button>
                                    ))}
                                    {shipping.error && (
                                        <div className="col-span-full p-4 text-center text-xs text-red-400 bg-red-900/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                                            <Info size={16}/> {shipping.error} Hubungi admin via WA.
                                        </div>
                                    )}
                                    {!shipping.error && shipping.rates.length === 0 && (
                                        <div className="col-span-full p-4 text-center text-xs text-red-400 bg-red-900/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                                            <Info size={16}/> Wilayah belum terjangkau kurir otomatis. Hubungi admin via WA.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-4 border-t border-white/5">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Punya Kode Promo?</label>
                        <div className="flex gap-2">
                            <input 
                                value={couponInput} 
                                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                placeholder="KASIRSOLO2025"
                                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-orange outline-none"
                            />
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
                        {shipping.selected && (
                            <div className="flex justify-between text-xs"><span className="text-gray-500">Ongkir ({shipping.selected.courier_name})</span><span className="text-white">{formatRupiah(shipping.selected.price)}</span></div>
                        )}
                        {discount && (
                            <div className="flex justify-between text-xs text-green-400 font-bold">
                                <span>Promo ({discount.code})</span>
                                <span>-{formatRupiah(discount.amount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-end pt-2">
                            <span className="text-white font-bold text-sm">TOTAL TAGIHAN</span>
                            <span className="text-brand-orange font-display font-bold text-2xl">{formatRupiah(shipping.total)}</span>
                        </div>
                        <Button type="submit" className="w-full py-4 shadow-neon mt-4" disabled={isSubmitting || !agreed || !shipping.selected}>
                            {isSubmitting ? <LoadingSpinner /> : "BAYAR SEKARANG"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
