
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, Scroll, ArrowDown, Check } from 'lucide-react';
import { Button } from '../ui';

export const TermsModal = ({ onAgree, onClose }: { onAgree: () => void, onClose: () => void }) => {
    const [hasReadToBottom, setHasReadToBottom] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        // Jika sisa scroll kurang dari 50px, anggap sudah sampe bawah
        if (scrollHeight - scrollTop - clientHeight < 50) {
            setHasReadToBottom(true);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-10 animate-fade-in">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
            
            <div className="relative w-full max-w-2xl bg-brand-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-brand-card flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg leading-none">Syarat & Aturan Main</h3>
                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Baca sampai bawah Bos!</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 text-gray-500 hover:text-white rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar space-y-8 text-gray-300 leading-relaxed text-sm"
                >
                    <section>
                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
                            1. SOAL DUIT & PESANAN
                        </h4>
                        <p className="pl-4 border-l border-white/10">
                            Setiap invoice yang keluar adalah kontrak sah. Harga yang tertera adalah <strong>HARGA MATI</strong>. 
                            Gak ada sistem <em>Keep</em> barang tanpa DP atau pelunasan. Siapa cepat dia dapat senjata.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
                            2. VIDEO UNBOXING: WAJIB!
                        </h4>
                        <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl">
                            <p className="text-red-400 font-bold mb-2">KOMPLAIN TANPA VIDEO = DITOLAK AUTO.</p>
                            <p className="text-xs">Video harus utuh dari paket masih segel lakban gue, gak boleh dipotong-potong atau diedit. Gue udah hafal trik oknum nakal.</p>
                        </div>
                    </section>

                    <section>
                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
                            3. GARANSI & SERVIS
                        </h4>
                        <p className="pl-4 border-l border-white/10">
                            Hardware garansi resmi 1 tahun (cacat pabrik). Kalau rusak gara-gara kesiram kopi, kebanting, atau lo iseng bongkar sendiri, garansi <strong>VOID</strong>. 
                            Jujur aja sama teknisi gue, biar solusinya enak.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
                            4. KEAMANAN DATA
                        </h4>
                        <p className="pl-4 border-l border-white/10">
                            Data omzet lo adalah rahasia dapur lo. Gue cuma nyediain brankas digitalnya. Gue gak bakal jual data lo ke kompetitor. Privasi harga mati buat gue.
                        </p>
                    </section>

                    <section className="pb-10">
                        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
                            5. TRANSFER RESMI
                        </h4>
                        <p className="pl-4 border-l border-white/10">
                            Hanya transfer ke rekening <strong>BNC a.n PT MESIN KASIR SOLO</strong>. Gue gak pernah minta transfer ke rekening pribadi orang. Kalau lo tertipu, jangan nyalahin gue.
                        </p>
                    </section>

                    {!hasReadToBottom && (
                        <div className="sticky bottom-0 left-0 right-0 py-4 bg-gradient-to-t from-brand-dark to-transparent flex justify-center pointer-events-none">
                            <div className="bg-brand-orange text-white px-4 py-2 rounded-full text-[10px] font-bold animate-bounce flex items-center gap-2">
                                <ArrowDown size={12}/> SCROLL KE BAWAH BUAT SETUJU
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-white/10 bg-brand-card shrink-0">
                    <Button 
                        onClick={onAgree} 
                        disabled={!hasReadToBottom}
                        className={`w-full py-4 text-sm font-bold shadow-neon transition-all ${hasReadToBottom ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-800 grayscale'}`}
                    >
                        {hasReadToBottom ? (
                            <><Check size={18}/> SAYA SUDAH BACA & SETUJU</>
                        ) : (
                            'BACA DULU SAMPAI BAWAH'
                        )}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};
