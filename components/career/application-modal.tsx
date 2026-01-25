
import React, { useState, useRef } from 'react';
import { X, UploadCloud, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { Button, Input, TextArea } from '../ui';
import { supabase, uploadToSupabase, renameFile, slugify, normalizePhone } from '../../utils';

export const ApplicationModal = ({ positionTitle, onClose }: { positionTitle: string, onClose: () => void }) => {
    const [form, setForm] = useState({ full_name: '', email: '', phone: '', portfolio_url: '', cover_letter: '' });
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf' && file.size <= 2 * 1024 * 1024) setCvFile(file);
        else alert("Wajib PDF & Maks 2MB!");
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanPhone = normalizePhone(form.phone);
        if (!form.full_name || !cleanPhone || !cvFile) return alert("Lengkapi data bos!");

        setStatus('submitting');
        try {
            const seoName = `${slugify(form.full_name)}-cv-${slugify(positionTitle)}`;
            const { path } = await uploadToSupabase(renameFile(cvFile, seoName), 'resumes', 'careers');
            await supabase!.from('applicants').insert([{ ...form, phone: cleanPhone, cv_url: path, position: positionTitle, status: 'pending' }]);
            setStatus('success');
        } catch (err) { alert("Gagal kirim, coba lagi."); setStatus('idle'); }
    };

    if (status === 'success') return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/95">
            <div className="bg-brand-dark border border-green-500/30 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl animate-fade-in">
                <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Berkas Masuk!</h3>
                <p className="text-gray-400 text-sm mb-6">Data lo udah di meja gue. Kalau profil lo ngeri, gue langsung WA.</p>
                <Button onClick={onClose} className="w-full">SIAP, DITUNGGU</Button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto bg-black/90">
            <div className="relative w-full max-w-lg bg-brand-dark border border-white/10 rounded-2xl shadow-2xl my-8 animate-fade-in">
                <div className="p-5 border-b border-white/10 bg-brand-card rounded-t-2xl flex justify-between items-center">
                    <div><h3 className="text-lg font-bold text-white">Gabung Pasukan</h3><p className="text-xs text-brand-orange font-bold uppercase">Misi: {positionTitle}</p></div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20}/></button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <Input value={form.full_name} onChange={(e:any)=>setForm({...form, full_name:e.target.value})} placeholder="Nama Lengkap" />
                    <div className="grid grid-cols-2 gap-2">
                        <Input value={form.email} onChange={(e:any)=>setForm({...form, email:e.target.value})} placeholder="Email" type="email"/>
                        <Input value={form.phone} onChange={(e:any)=>setForm({...form, phone:e.target.value})} placeholder="WhatsApp" type="tel"/>
                    </div>
                    <Input value={form.portfolio_url} onChange={(e:any)=>setForm({...form, portfolio_url:e.target.value})} placeholder="Portfolio Link (LinkedIn/Web)" />
                    <div onClick={()=>fileRef.current?.click()} className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${cvFile ? 'border-brand-orange bg-brand-orange/5' : 'border-white/10 hover:bg-white/5'}`}>
                        <input type="file" ref={fileRef} className="hidden" accept="application/pdf" onChange={handleFile}/>
                        <UploadCloud size={24} className={`mx-auto mb-2 ${cvFile ? 'text-brand-orange' : 'text-gray-500'}`} />
                        <p className="text-gray-300 text-sm font-bold">{cvFile ? cvFile.name : "Drop PDF CV Disini"}</p>
                    </div>
                    <TextArea value={form.cover_letter} onChange={(e:any)=>setForm({...form, cover_letter:e.target.value})} placeholder="Ceritain kenapa lo partner yang pas..." className="h-24"/>
                    <Button type="submit" disabled={status === 'submitting'} className="w-full py-4 shadow-neon">
                        {status === 'submitting' ? <Loader2 className="animate-spin" /> : <><Mail size={16}/> KIRIM LAMARAN</>}
                    </Button>
                </form>
            </div>
        </div>
    );
};
