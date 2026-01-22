
import React, { useState } from 'react';
import { Quote, Search, Plus, Trash2, Edit, Star, UploadCloud, Save, X, RefreshCw } from 'lucide-react';
import { Testimonial } from '../../../types';
import { supabase, CONFIG, slugify, renameFile } from '../../../utils';
import { Button, Input, TextArea, LoadingSpinner } from '../../ui';

export const AdminTestimonials = ({ 
    testimonials, 
    setTestimonials 
}: { 
    testimonials: Testimonial[], 
    setTestimonials: (t: Testimonial[]) => void 
}) => {
    const [form, setForm] = useState<Partial<Testimonial>>({
        client_name: '',
        business_name: '',
        content: '',
        rating: 5,
        image_url: '',
        is_featured: true
    });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const resetForm = () => {
        setForm({ client_name: '', business_name: '', content: '', rating: 5, image_url: '', is_featured: true });
        setUploadFile(null);
    };

    const handleSave = async () => {
        if (!form.client_name || !form.content) return alert("Isi nama klien sama komentarnya dulu Bos.");
        setLoading(true);
        try {
            let finalImg = form.image_url;
            if (uploadFile && CONFIG.CLOUDINARY_CLOUD_NAME) {
                const formData = new FormData();
                formData.append('file', renameFile(uploadFile, `testi-${slugify(form.client_name!)}`));
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                finalImg = data.secure_url;
            }

            const dbData = { ...form, image_url: finalImg };
            if (form.id) {
                await supabase?.from('testimonials').update(dbData).eq('id', form.id);
                setTestimonials(testimonials.map(t => t.id === form.id ? { ...t, ...dbData } : t));
            } else {
                const { data } = await supabase?.from('testimonials').insert([dbData]).select().single();
                if (data) setTestimonials([data, ...testimonials]);
            }
            resetForm();
        } catch (e) { alert("Gagal simpan."); }
        finally { setLoading(false); }
    };

    const filtered = testimonials.filter(t => 
        t.client_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.business_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="grid lg:grid-cols-12 gap-8 h-full">
            {/* LIST (7 COL) */}
            <div className="lg:col-span-7 bg-brand-dark border border-white/5 rounded-2xl flex flex-col overflow-hidden h-[700px]">
                <div className="p-4 bg-black/20 border-b border-white/10 flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Cari testimoni..." className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-3 py-2 text-xs text-white focus:border-brand-orange outline-none"/>
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 uppercase whitespace-nowrap">Total: {testimonials.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {filtered.map(t => (
                        <div key={t.id} onClick={() => setForm(t)} className={`p-4 bg-brand-card/40 border rounded-xl flex gap-4 cursor-pointer transition-all hover:border-brand-orange/50 group ${form.id === t.id ? 'border-brand-orange' : 'border-white/5'}`}>
                            <div className="w-12 h-12 rounded-full bg-black border border-white/10 overflow-hidden shrink-0">
                                <img src={t.image_url || 'https://via.placeholder.com/100'} className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h5 className="text-sm font-bold text-white truncate">{t.client_name}</h5>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={8} className={i < t.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}/>)}
                                    </div>
                                </div>
                                <p className="text-[10px] text-brand-orange font-bold uppercase">{t.business_name}</p>
                                <p className="text-xs text-gray-500 italic mt-2 line-clamp-2">"{t.content}"</p>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); if(confirm("Hapus?")) { supabase?.from('testimonials').delete().eq('id', t.id); setTestimonials(testimonials.filter(x => x.id !== t.id)); if(form.id === t.id) resetForm(); } }} className="p-2 text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* EDITOR (5 COL) */}
            <div className="lg:col-span-5 h-fit sticky top-0">
                <div className="bg-brand-card border border-white/10 rounded-2xl p-6 space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <h4 className="text-white font-bold flex items-center gap-2 uppercase tracking-widest text-xs"><Quote size={16} className="text-brand-orange"/> {form.id ? 'Edit Testimoni' : 'Sapaan Baru'}</h4>
                        <button onClick={resetForm} className="text-gray-500 hover:text-white"><RefreshCw size={16}/></button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4 items-center">
                            <label className="relative w-16 h-16 rounded-full bg-black border border-brand-orange/30 overflow-hidden cursor-pointer group">
                                <img src={uploadFile ? URL.createObjectURL(uploadFile) : (form.image_url || 'https://via.placeholder.com/100')} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"><UploadCloud size={20} className="text-white"/></div>
                                <input type="file" className="hidden" onChange={e => e.target.files?.[0] && setUploadFile(e.target.files[0])} />
                            </label>
                            <div className="flex-1 space-y-2">
                                <Input value={form.client_name} onChange={(e:any) => setForm({...form, client_name: e.target.value})} placeholder="Nama Klien..." className="text-xs py-1.5"/>
                                <Input value={form.business_name} onChange={(e:any) => setForm({...form, business_name: e.target.value})} placeholder="Nama Toko / Usaha..." className="text-xs py-1.5"/>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Rating</label>
                            <div className="flex gap-2">
                                {[1,2,3,4,5].map(s => <button key={s} onClick={() => setForm({...form, rating: s})} className={`p-1 ${s <= (form.rating || 0) ? 'text-yellow-500' : 'text-gray-700'}`}><Star size={20} fill={s <= (form.rating || 0) ? 'currentColor' : 'none'}/></button>)}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Isi Komentar</label>
                            <TextArea value={form.content} onChange={(e:any) => setForm({...form, content: e.target.value})} placeholder="Apa kata mereka?" className="h-32 text-xs" />
                        </div>

                        <Button onClick={handleSave} disabled={loading} className="w-full py-4 shadow-neon">
                            {loading ? <LoadingSpinner/> : <><Save size={18}/> SIMPAN REVIEW</>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
