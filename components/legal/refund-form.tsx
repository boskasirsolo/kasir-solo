
import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, CheckSquare, Square, ChevronDown, UploadCloud, Send, Loader2, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input, TextArea, Button } from '../ui';
import { supabase } from '../../utils';

export const RefundForm = () => {
    // STATE: GATEKEEPER
    const [isAgreed, setIsAgreed] = useState(false);
    const [isLiabilityAgreed, setIsLiabilityAgreed] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // STATE: FORM
    const [form, setForm] = useState({
        order_id: '',
        customer_phone: '',
        serial_number: '',
        issue_type: 'Mati Total',
        chronology: '',
        video_unboxing: '',
        video_damage: '',
        solution: 'Servis'
    });
    const [loading, setLoading] = useState(false);
    const [ticketId, setTicketId] = useState<string | null>(null);

    // ROUTER HOOKS
    const location = useLocation();
    const navigate = useNavigate();
    const sectionRef = useRef<HTMLDivElement>(null);

    // EFFECT: Auto-Scroll if triggered from Shop
    useEffect(() => {
        if (location.state?.autoOpen && sectionRef.current) {
            // Slight delay to ensure layout is ready
            setTimeout(() => {
                sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }, [location.state]);

    const handleOpenForm = () => {
        if (isAgreed && isLiabilityAgreed) {
            setIsFormOpen(true);
            setTimeout(() => {
                document.getElementById('rma-form-start')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) return alert("Database offline.");
        
        if (!form.video_unboxing) return alert("LINK VIDEO UNBOXING WAJIB DIISI! Cek aturan main.");
        if (!form.serial_number) return alert("Serial Number (SN) wajib diisi. Cek belakang mesin.");

        setLoading(true);
        try {
            const { data, error } = await supabase.from('rma_tickets').insert([{
                order_id: form.order_id,
                customer_phone: form.customer_phone,
                serial_number: form.serial_number,
                issue_type: form.issue_type,
                chronology: form.chronology,
                evidence_urls: { unboxing: form.video_unboxing, damage: form.video_damage },
                solution_preference: form.solution,
                status: 'pending'
            }]).select().single();

            if (error) throw error;

            setTicketId(data.id);
            // Auto WA Notif Logic Here (Optional Client Side)
            const text = `*TIKET KLAIM BARU #${data.id}*\n\nOrder ID: ${form.order_id}\nSN: ${form.serial_number}\nMasalah: ${form.issue_type}\n\nMohon segera diproses admin.`;
            window.open(`https://wa.me/6282325103336?text=${encodeURIComponent(text)}`, '_blank');

        } catch (e: any) {
            alert("Gagal kirim tiket: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    if (ticketId) {
        return (
            <div className="bg-green-500/10 border border-green-500/30 p-8 rounded-2xl text-center animate-fade-in my-10">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 border border-green-500/30">
                    <Send size={40} />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">Tiket #{ticketId} Dibuat!</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                    Laporan lo udah masuk sistem. Tim teknis gue bakal cek link video lo dalam 1x24 jam. <br/>
                    Pantau WhatsApp, gue bakal kabarin statusnya disitu.
                </p>
                <Button onClick={() => window.location.reload()} variant="outline">Buat Tiket Baru</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 my-12" ref={sectionRef}>
            
            {/* Back Button Logic */}
            {location.state?.from === 'shop' && (
                <div className="mb-4">
                    <button 
                        onClick={() => navigate('/shop')}
                        className="flex items-center gap-2 text-gray-500 hover:text-brand-orange transition-colors text-xs font-bold uppercase tracking-widest group"
                    >
                        <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-brand-orange/10 border border-white/10 group-hover:border-brand-orange/30 transition-all">
                            <ArrowLeft size={14} />
                        </div>
                        Kembali ke Katalog
                    </button>
                </div>
            )}

            {/* GATEKEEPER CARD */}
            <div className={`transition-all duration-500 ${isFormOpen ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
                <div className="bg-red-950/20 border-l-4 border-red-600 p-6 rounded-r-xl relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 text-red-500/10">
                        <ShieldAlert size={150} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4 relative z-10">Persetujuan Mutlak</h3>
                    <p className="text-sm text-gray-400 mb-6 relative z-10">
                        Sebelum form terbuka, lo wajib setuju sama aturan main gue. Ini buat nyaring oknum nakal yang suka ngaku-ngaku barang rusak padahal dijatuhin sendiri.
                    </p>

                    <div className="space-y-4 relative z-10">
                        <label className="flex gap-4 cursor-pointer group">
                            <div onClick={() => setIsAgreed(!isAgreed)} className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 transition-all ${isAgreed ? 'bg-red-600 border-red-600 text-white' : 'border-gray-500 group-hover:border-red-500'}`}>
                                {isAgreed && <CheckSquare size={16} />}
                            </div>
                            <span className={`text-sm select-none ${isAgreed ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                Saya menyatakan punya <strong>VIDEO UNBOXING UTUH</strong> (No Cut) dan segel garansi di unit masih utuh.
                            </span>
                        </label>

                        <label className="flex gap-4 cursor-pointer group">
                            <div onClick={() => setIsLiabilityAgreed(!isLiabilityAgreed)} className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 transition-all ${isLiabilityAgreed ? 'bg-red-600 border-red-600 text-white' : 'border-gray-500 group-hover:border-red-500'}`}>
                                {isLiabilityAgreed && <CheckSquare size={16} />}
                            </div>
                            <span className={`text-sm select-none ${isLiabilityAgreed ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                Jika saat dicek teknisi ditemukan indikasi <strong>HUMAN ERROR</strong> (Air/Jatuh/Listrik), saya siap menanggung ongkir & biaya pengecekan.
                            </span>
                        </label>
                    </div>

                    <div className="mt-8 relative z-10">
                        <Button 
                            onClick={handleOpenForm} 
                            disabled={!isAgreed || !isLiabilityAgreed || isFormOpen}
                            className={`w-full md:w-auto py-3 px-8 font-bold ${isFormOpen ? 'hidden' : ''}`}
                            variant={isAgreed && isLiabilityAgreed ? 'primary' : 'ghost'}
                        >
                            BUKA FORMULIR KLAIM
                        </Button>
                    </div>
                </div>
            </div>

            {/* THE FORM */}
            {isFormOpen && (
                <div id="rma-form-start" className="bg-brand-card border border-white/10 rounded-2xl p-6 md:p-8 animate-fade-in shadow-2xl">
                    <div className="mb-8 border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-display font-bold text-white">Formulir RMA (Return Merchandise)</h2>
                        <p className="text-sm text-gray-500">Isi data dengan jujur. Kebohongan akan membatalkan garansi otomatis.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* IDENTITAS */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Order ID / No. Invoice</label>
                                <Input 
                                    value={form.order_id} 
                                    onChange={e => setForm({...form, order_id: e.target.value})} 
                                    placeholder="Cth: MKS-1024"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Nomor WhatsApp Aktif</label>
                                <Input 
                                    value={form.customer_phone} 
                                    onChange={e => setForm({...form, customer_phone: e.target.value})} 
                                    placeholder="08xxxxxxxx"
                                />
                            </div>
                        </div>

                        {/* MASALAH */}
                        <div className="bg-black/20 p-6 rounded-xl border border-white/5 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block text-brand-orange">Serial Number (SN)</label>
                                    <Input 
                                        value={form.serial_number} 
                                        onChange={e => setForm({...form, serial_number: e.target.value})} 
                                        placeholder="Cek stiker belakang mesin..."
                                        className="border-brand-orange/30 focus:border-brand-orange"
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1 italic">*SN Fisik wajib sama dengan SN di Kardus.</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Jenis Kendala</label>
                                    <div className="relative">
                                        <select 
                                            value={form.issue_type}
                                            onChange={e => setForm({...form, issue_type: e.target.value})}
                                            className="w-full bg-brand-dark border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:border-brand-orange outline-none"
                                        >
                                            <option>Mati Total</option>
                                            <option>Layar Blank / Garis</option>
                                            <option>Touchscreen Error</option>
                                            <option>Printer Macet / Error</option>
                                            <option>Software / Login Gagal</option>
                                            <option>Lainnya</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-3.5 text-gray-500 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Kronologi (Jujur Aja)</label>
                                <TextArea 
                                    value={form.chronology} 
                                    onChange={e => setForm({...form, chronology: e.target.value})} 
                                    placeholder="Ceritain pas kejadian lagi dipake ngapain? Tiba-tiba mati atau gimana?"
                                    className="h-24"
                                />
                            </div>
                        </div>

                        {/* BUKTI */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2"><UploadCloud size={16}/> Bukti Digital (Link Google Drive / YouTube)</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Input 
                                        value={form.video_unboxing} 
                                        onChange={e => setForm({...form, video_unboxing: e.target.value})} 
                                        placeholder="Link Video Unboxing (Wajib)"
                                        className="bg-red-900/10 border-red-500/20 focus:border-red-500 placeholder-red-300/30"
                                    />
                                    <p className="text-[10px] text-red-400 mt-1">*Wajib ada. Gak ada = Ditolak.</p>
                                </div>
                                <div>
                                    <Input 
                                        value={form.video_damage} 
                                        onChange={e => setForm({...form, video_damage: e.target.value})} 
                                        placeholder="Link Video Kendala/Kerusakan"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SOLUSI */}
                        <div className="pt-4 border-t border-white/10">
                            <label className="text-xs font-bold text-gray-500 uppercase mb-3 block">Solusi Yang Diharapkan</label>
                            <div className="flex gap-4">
                                {['Servis', 'Tukar Unit', 'Refund'].map((opt) => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="solution" 
                                            value={opt}
                                            checked={form.solution === opt}
                                            onChange={() => setForm({...form, solution: opt})}
                                            className="accent-brand-orange"
                                        />
                                        <span className="text-sm text-gray-300">{opt}</span>
                                    </label>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 italic">*Keputusan final tetap ada di tangan teknisi setelah cek unit.</p>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full py-4 text-sm font-bold shadow-neon">
                            {loading ? <Loader2 className="animate-spin" /> : 'KIRIM TIKET KLAIM'}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
};
