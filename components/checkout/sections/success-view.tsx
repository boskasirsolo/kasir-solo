
import React from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { formatRupiah } from '../../../utils';
import { BankTransferCard } from '../ui-parts';
import { OrderSuccessState } from '../types';
import { SiteConfig } from '../../../types';

export const SuccessView = ({ 
    order, 
    onHome,
    config
}: { 
    order: OrderSuccessState, 
    onHome: () => void,
    config?: SiteConfig
}) => {
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Nomor rekening disalin!");
    };

    const waNumber = config?.whatsapp_number || "6282325103336";
    const waLink = `https://wa.me/${waNumber}?text=Halo Admin PT Mesin Kasir Solo, saya sudah transfer untuk Order ID #${order.id} sebesar ${formatRupiah(order.total)}. Berikut bukti transfernya...`;

    return (
        <div className="container mx-auto px-4 py-20 animate-fade-in flex justify-center">
            <div className="max-w-2xl w-full bg-brand-card border border-brand-orange rounded-3xl p-8 md:p-12 text-center shadow-neon">
                
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/20">
                    <CheckCircle2 size={48} className="text-green-500" />
                </div>
                
                <h2 className="text-3xl font-display font-bold text-white mb-2">Pesanan Diterima!</h2>
                <p className="text-gray-400 mb-8">
                    Order ID: <span className="text-brand-orange font-mono text-xl md:text-2xl font-bold tracking-wider">#{order.id}</span>
                </p>

                <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-8 text-left">
                    <p className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Total Pembayaran</p>
                    <div className="text-3xl font-bold text-white mb-6 border-b border-white/10 pb-6">
                        {formatRupiah(order.total)}
                    </div>

                    <BankTransferCard onCopy={handleCopy} />
                </div>

                <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-md mx-auto">
                    Langkah terakhir: Silakan transfer sesuai nominal, lalu konfirmasi bukti pembayaran ke WhatsApp Admin agar pesanan segera diproses.
                </p>

                <div className="flex flex-col gap-4">
                    <a 
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center w-full px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-green-500/20 gap-2"
                    >
                        <MessageCircle size={20} /> Konfirmasi via WhatsApp
                    </a>
                    
                    <button onClick={onHome} className="text-gray-500 hover:text-white text-sm font-bold py-2">
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        </div>
    );
};
