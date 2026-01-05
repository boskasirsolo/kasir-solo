
import React, { useState } from 'react';
import { Plus, Trash2, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Search, Quote, Star, UploadCloud } from 'lucide-react';
import { Testimonial } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, CONFIG, slugify, renameFile } from '../utils';

const ITEMS_PER_PAGE = 6;

// --- LOGIC: Custom Hook ---
const useTestimonialManager = (
    testimonials: Testimonial[], 
    setTestimonials: (t: Testimonial[]) => void
) => {
    const [form, setForm] = useState({
        id: null as number | null,
        client_name: '',
        business_name: '',
        content: '',
        rating: 5,
        imagePreview: '',
        uploadFile: null as File | null,
        is_featured: true
    });

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const resetForm = () => {
        setForm({
            id: null,
            client_name: '',
            business_name: '',
            content: '',
            rating: 5,
            imagePreview: '',
            uploadFile: null,
            is_featured: true
        });
    };

    const handleEditClick = (item: Testimonial) => {
        setForm({
            id: item.id,
            client_name: item.client_name,
            business_name: item.business_name,
            content: item.content,
            rating: item.rating,
            imagePreview: item.image_url || '',
            uploadFile: null,
            is_featured: item.is_featured
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        if (!form.client_name || !form.content) return alert("Mohon lengkapi Nama Klien dan Isi Testimoni.");
        if (!CONFIG.CLOUDINARY_CLOUD_NAME) return alert("Config Cloudinary Missing");

        setLoading(true);
        try {
            let finalImageUrl = form.imagePreview;

            if (form.uploadFile) {
                // SEO OPTIMIZATION: Rename file with 'mesin-kasir-solo'
                const seoName = `${slugify(form.client_name)}-review-klien-mesin-kasir-solo`;
                const fileToUpload = renameFile(form.uploadFile, seoName);

                const formData = new FormData();
                formData.append('file', fileToUpload);
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                if (data.secure_url) finalImageUrl = data.secure_url;
            }

            const dbData = {
                client_name: form.client_name,
                business_name: form.business_name,
                content: form.content,
                rating: form.rating,
                image_url: finalImageUrl,
                is_featured: form.is_featured
            };

            if (form.id) {
                const updatedItem = { ...testimonials.find(t => t.id === form.id)!, ...dbData, id: form.id };
                setTestimonials(testimonials.map(t => t.id === form.id ? updatedItem : t));
                if (supabase) await supabase.from('testimonials').update(dbData).eq('id', form.id);
            } else {
                const newId = Date.now();
                const newItem = { ...dbData, id: newId };
                setTestimonials([newItem, ...testimonials]);
                if (supabase) await supabase.from('testimonials').insert([dbData]);
            }
            resetForm();
            alert("Testimoni berhasil disimpan!");
        } catch (e) { console.error(e); alert("Gagal menyimpan."); }
        finally { setLoading(false); }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus testimoni ini?")) return;
        setTestimonials(testimonials.filter(t => t.id !== id));
        if (supabase) await supabase.from('testimonials').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    const filtered = testimonials.filter(t => 
        t.client_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.business_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return {
        form, setForm,
        loading,
        handleSubmit,
        handleEditClick,
        resetForm,
        deleteItem,
        listData: { paginated, totalPages, page, setPage, searchTerm, setSearchTerm }
    };
};

const TestimonialForm = ({ 
    form, setForm, loading, onSubmit, onReset 
}: {
    form: any, setForm: any, loading: any, onSubmit: any, onReset: any
}) => (
    <div className="bg-brand-dark p-6 rounded-xl border border-white/5 h-fit sticky top-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {form.id ? <Edit size={18} className="text-brand-orange"/> : <Quote size={18} className="text-brand-orange"/>}
                {form.id ? "Edit Testimoni" : "Tambah Baru"}
            </h3>
            {form.id && (
                <button onClick={onReset} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded">
                    <XIcon size={12} /> Batal
                </button>
            )}
        </div>

        <div className="mb-4">
             {form.imagePreview && (
               <div className="mb-3 relative w-20 h-20 bg-black/40 rounded-full overflow-hidden border border-white/10 group mx-auto">
                  <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-[9px] font-bold">Ubah</p>
                    </div>
               </div>
             )}
             <div className="border border-dashed border-white/20 rounded-lg p-3 text-center hover:border-brand-orange/50 transition-colors bg-brand-card/30">
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                if (file) setForm((prev:any) => ({ ...prev, uploadFile: file, imagePreview: URL.createObjectURL(file) }));
              }} className="hidden" id="testi-upload" />
              <label htmlFor="testi-upload" className="cursor-pointer flex flex-col items-center gap-2">
                {!form.imagePreview && <UploadCloud size={20} className="text-gray-400" />}
                <span className="text-gray-400 text-xs font-bold">{form.uploadFile ? form.uploadFile.name : (form.id ? "Ganti Foto Profil" : "Foto Profil (Opsional)")}</span>
              </label>
            </div>
        </div>

        <div className="space-y-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Nama Klien</label>
              <Input value={form.client_name} onChange={e => setForm((prev:any) => ({...prev, client_name: e.target.value}))} placeholder="Nama..." className="py-2 text-sm"/>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Nama Bisnis / Toko</label>
              <Input value={form.business_name} onChange={e => setForm((prev:any) => ({...prev, business_name: e.target.value}))} placeholder="Contoh: Kopi Senja" className="py-2 text-sm"/>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Rating</label>
              <div className="flex gap-2">
                 {[1,2,3,4,5].map(star => (
                    <button 
                        key={star} 
                        onClick={() => setForm((prev:any) => ({...prev, rating: star}))}
                        className={`p-1 ${form.rating >= star ? 'text-yellow-500' : 'text-gray-600'}`}
                    >
                        <Star size={20} fill={form.rating >= star ? "currentColor" : "none"} />
                    </button>
                 ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Isi Testimoni</label>
              <TextArea value={form.content} onChange={e => setForm((prev:any) => ({...prev, content: e.target.value}))} placeholder="Komentar klien..." className="h-24 text-sm leading-relaxed" />
            </div>
            
            <Button onClick={onSubmit} disabled={loading} className="w-full py-2.5 text-sm">
              {loading ? <LoadingSpinner /> : (form.id ? <><Save size={16}/> Simpan</> : <><Plus size={16}/> Tambah</>)}
            </Button>
        </div>
    </div>
);

const TestimonialList = ({ 
    data, onEdit, onDelete 
}: { 
    data: any, onEdit: any, onDelete: any 
}) => (
    <div className="bg-brand-dark rounded-xl border border-white/5 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
            <div className="relative flex-grow">
                <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                <input 
                    type="text" 
                    value={data.searchTerm}
                    onChange={(e) => data.setSearchTerm(e.target.value)}
                    placeholder="Cari klien..." 
                    className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                />
             </div>
             <span className="text-[10px] font-bold text-gray-500 uppercase">Total: {data.paginated.length}</span>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar min-h-[400px]">
            {data.paginated.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">Belum ada testimoni.</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {data.paginated.map((item: Testimonial) => (
                        <div key={item.id} className="relative bg-brand-card border border-white/5 rounded-lg p-4 flex gap-4 hover:border-brand-orange transition-all">
                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10">
                                <img src={item.image_url || "https://via.placeholder.com/150"} alt={item.client_name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h5 className="text-sm font-bold text-white truncate">{item.client_name}</h5>
                                    <div className="flex gap-2">
                                        <button onClick={() => onEdit(item)} className="text-blue-400 hover:text-white"><Edit size={14} /></button>
                                        <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-white"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-brand-orange font-bold uppercase">{item.business_name}</p>
                                <p className="text-xs text-gray-400 mt-1 italic line-clamp-2">"{item.content}"</p>
                                <div className="flex mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={10} className={`${i < item.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {data.totalPages > 1 && (
            <div className="p-3 border-t border-white/10 bg-black/20 flex justify-center items-center gap-4">
                <button onClick={() => data.setPage((p:number) => Math.max(1, p - 1))} disabled={data.page === 1} className="text-gray-400 hover:text-white disabled:opacity-30"><ChevronLeft size={16} /></button>
                <span className="text-xs font-bold text-brand-orange">{data.page} / {data.totalPages}</span>
                <button onClick={() => data.setPage((p:number) => Math.min(data.totalPages, p + 1))} disabled={data.page === data.totalPages} className="text-gray-400 hover:text-white disabled:opacity-30"><ChevronRight size={16} /></button>
            </div>
        )}
    </div>
);

export const AdminTestimonials = ({ 
  testimonials, 
  setTestimonials 
}: { 
  testimonials: Testimonial[], 
  setTestimonials: (t: Testimonial[]) => void 
}) => {
  const { form, setForm, loading, handleSubmit, handleEditClick, resetForm, deleteItem, listData } = useTestimonialManager(testimonials, setTestimonials);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7">
        <TestimonialList data={listData} onEdit={handleEditClick} onDelete={deleteItem} />
      </div>
      <div className="lg:col-span-5">
        <TestimonialForm 
            form={form} 
            setForm={setForm} 
            loading={loading} 
            onSubmit={handleSubmit} 
            onReset={resetForm} 
        />
      </div>
    </div>
  );
};
