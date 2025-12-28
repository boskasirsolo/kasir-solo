
import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Tag, DollarSign, Search } from 'lucide-react';
import { Product } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, CONFIG, formatRupiah, ensureAPIKey, getSmartApiKey, markKeyAsExhausted } from '../utils';
import { GoogleGenAI } from "@google/genai";

const ITEMS_PER_PAGE = 6; 

const useProductManager = (
    products: Product[], 
    setProducts: (p: Product[]) => void
) => {
    const [form, setForm] = useState({
        id: null as number | null,
        name: '',
        price: '',
        desc: '',
        shortDesc: '',
        imagePreview: '',
        uploadFile: null as File | null
    });

    const [loadingState, setLoadingState] = useState({
        generatingAI: false,
        uploading: false
    });

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const resetForm = () => {
        setForm({
            id: null,
            name: '',
            price: '',
            desc: '',
            shortDesc: '',
            imagePreview: '',
            uploadFile: null
        });
    };

    const handleEditClick = (p: Product) => {
        setForm({
            id: p.id,
            name: p.name,
            price: p.price.toString(),
            desc: p.description,
            shortDesc: '',
            imagePreview: p.image,
            uploadFile: null
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generateAIDesc = async () => {
        if (!form.name || !form.shortDesc) return alert("Isi Nama dan Keyword Fitur dulu.");
        
        setLoadingState(prev => ({ ...prev, generatingAI: true }));
        const apiKey = getSmartApiKey();

        try {
            await ensureAPIKey(); // Ensure key in IDX
            
            if (!apiKey) {
                console.warn("No API Key detected.");
                alert("API Key tidak ditemukan.");
                return;
            }

            const ai = new GoogleGenAI({ apiKey });
            
            const prompt = `
            Role: Expert E-commerce Copywriter & SEO Specialist.
            Task: Write a high-converting product description (Sales Copy).
            Product: ${form.name}
            Features/Context: ${form.shortDesc}
            
            STRICT RULES:
            1. DIRECT OUTPUT ONLY: Do NOT use "Tentu", "Berikut draf", "Ini deskripsinya". Start directly with the hook.
            2. Language: Indonesian (Persuasive, Benefit-driven).
            3. Structure: 
               - Hook (Problem/Solution)
               - Key Benefits (Bulleted or short sentences)
               - Closing/Call to Action
            4. SEO: Include transactional keywords relevant to POS/Kasir.
            5. Length: Max 3 paragraphs.
            `;
            
            const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            setForm(prev => ({ ...prev, desc: response.text?.trim() || '' }));
        } catch (e: any) { 
            console.error(e);
            if (e.message?.includes('429') || e.message?.includes('400') || e.message?.toLowerCase().includes('quota') || e.message?.toLowerCase().includes('resource')) {
                markKeyAsExhausted(apiKey);
                alert("API Key limit tercapai. Silakan coba tekan tombol lagi.");
            } else {
                alert(`AI Error: ${e.message}`); 
            }
        } 
        finally { setLoadingState(prev => ({ ...prev, generatingAI: false })); }
    };

    const handleSubmit = async () => {
        if (!form.name || !form.price) return alert("Wajib isi Nama dan Harga");
        if (!CONFIG.CLOUDINARY_CLOUD_NAME) return alert("Cloudinary Config Missing");

        setLoadingState(prev => ({ ...prev, uploading: true }));
        try {
            let finalImageUrl = form.imagePreview || 'https://via.placeholder.com/400';

            if (form.uploadFile) {
                const formData = new FormData();
                formData.append('file', form.uploadFile);
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                if (data.secure_url) finalImageUrl = data.secure_url;
            }

            const dbData = {
                name: form.name,
                price: parseInt(form.price),
                category: 'POS System',
                description: form.desc,
                image_url: finalImageUrl
            };

            if (form.id) {
                setProducts(products.map(p => p.id === form.id ? { ...p, ...dbData, image: finalImageUrl } : p));
                if (supabase) await supabase.from('products').update(dbData).eq('id', form.id);
            } else {
                const newId = Date.now();
                setProducts([{ ...dbData, id: newId, image: finalImageUrl }, ...products]);
                if (supabase) await supabase.from('products').insert([dbData]);
            }
            resetForm();
            alert("Berhasil disimpan!");
        } catch (e) { console.error(e); alert("Gagal menyimpan."); }
        finally { setLoadingState(prev => ({ ...prev, uploading: false })); }
    };

    const deleteProduct = async (id: number) => {
        if(!confirm("Hapus produk ini?")) return;
        setProducts(products.filter(p => p.id !== id));
        if (supabase) await supabase.from('products').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return {
        form, setForm,
        loadingState,
        handleSubmit,
        handleEditClick,
        resetForm,
        deleteProduct,
        generateAIDesc,
        listData: { paginated, totalPages, page, setPage, searchTerm, setSearchTerm }
    };
};

const ProductForm = ({ 
    form, setForm, loading, onSubmit, onReset, onGenerateAI 
}: {
    form: any, setForm: any, loading: any, onSubmit: any, onReset: any, onGenerateAI: any
}) => (
    <div className="bg-brand-dark p-6 rounded-xl border border-white/5 h-fit sticky top-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {form.id ? <Edit size={18} className="text-brand-orange"/> : <Tag size={18} className="text-brand-orange"/>}
                {form.id ? "Edit Produk" : "Tambah Baru"}
            </h3>
            {form.id && (
                <button onClick={onReset} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded">
                    <XIcon size={12} /> Batal
                </button>
            )}
        </div>

        <div className="mb-4">
            {form.imagePreview && (
                <div className="mb-3 relative w-full h-40 bg-black/40 rounded-lg overflow-hidden border border-white/10 group">
                    <img src={form.imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-xs font-bold">Ganti Gambar</p>
                    </div>
                </div>
            )}
            <div className="border border-dashed border-white/20 rounded-lg p-4 text-center hover:border-brand-orange/50 transition-colors bg-brand-card/30">
                <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (file) setForm((prev: any) => ({ ...prev, uploadFile: file, imagePreview: URL.createObjectURL(file) }));
                }} className="hidden" id="prod-upload" />
                <label htmlFor="prod-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    {!form.imagePreview && <UploadCloud size={24} className="text-gray-400" />}
                    <span className="text-gray-400 text-xs font-bold">{form.uploadFile ? form.uploadFile.name : (form.id ? "Klik untuk ganti foto" : "Upload Foto Produk")}</span>
                </label>
            </div>
        </div>

        <div className="space-y-4">
            <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Nama Produk</label>
                <Input value={form.name} onChange={e => setForm((prev:any) => ({...prev, name: e.target.value}))} placeholder="Nama Produk..." className="py-2 text-sm" />
            </div>
            <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Harga (IDR)</label>
                <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-3 text-gray-500"/>
                    <Input value={form.price} onChange={e => setForm((prev:any) => ({...prev, price: e.target.value}))} placeholder="0" type="number" className="pl-9 py-2 text-sm" />
                </div>
            </div>

            <div className="p-3 bg-brand-orange/5 rounded-lg border border-brand-orange/20">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] text-brand-orange uppercase font-bold tracking-wider flex items-center gap-1"><Sparkles size={12} /> AI Copywriter</label>
                </div>
                <div className="flex gap-2">
                    <input 
                        value={form.shortDesc} 
                        onChange={e => setForm((prev:any) => ({...prev, shortDesc: e.target.value}))} 
                        placeholder="Keyword: canggih, murah..." 
                        className="bg-brand-card border border-white/10 rounded px-3 text-xs w-full focus:outline-none focus:border-brand-orange"
                    />
                    <button 
                        onClick={onGenerateAI} 
                        disabled={loading.generatingAI} 
                        // UPDATED: Use brand-action (Orange) for manual AI button
                        className="bg-brand-action text-white rounded px-3 py-1 flex items-center justify-center hover:bg-brand-actionGlow disabled:opacity-50"
                    >
                        {loading.generatingAI ? <LoadingSpinner /> : <Sparkles size={16} />}
                    </button>
                </div>
            </div>

            <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Deskripsi</label>
                <TextArea value={form.desc} onChange={e => setForm((prev:any) => ({...prev, desc: e.target.value}))} placeholder="Deskripsi..." className="h-32 text-sm leading-relaxed" />
            </div>

            <Button onClick={onSubmit} disabled={loading.uploading} className="w-full py-2.5 text-sm">
                {loading.uploading ? <LoadingSpinner /> : (form.id ? <><Save size={16}/> Simpan Perubahan</> : <><Plus size={16}/> Tambah Produk</>)}
            </Button>
        </div>
    </div>
);

const ProductList = ({ 
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
                    placeholder="Cari produk..." 
                    className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                />
             </div>
             <span className="text-[10px] font-bold text-gray-500 uppercase">Total: {data.paginated.length}</span>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar min-h-[400px]">
            {data.paginated.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">Produk tidak ditemukan.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.paginated.map((p: Product) => (
                        <div key={p.id} className="group relative bg-brand-card border border-white/5 rounded-lg overflow-hidden hover:border-brand-orange transition-all hover:shadow-neon-text/20">
                            <div className="relative h-32 bg-black overflow-hidden border-b border-white/5">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button onClick={() => onEdit(p)} className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-colors"><Edit size={16} /></button>
                                    <button onClick={() => onDelete(p.id)} className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16} /></button>
                                </div>
                                <div className="absolute top-2 right-2">
                                     <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white border border-white/10">{formatRupiah(p.price)}</span>
                                </div>
                            </div>
                            <div className="p-3">
                                <h5 className="text-sm font-bold text-white truncate mb-1" title={p.name}>{p.name}</h5>
                                <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed h-8">
                                    {p.description || "Belum ada deskripsi."}
                                </p>
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

export const AdminProducts = ({ 
  products, 
  setProducts 
}: { 
  products: Product[], 
  setProducts: (p: Product[]) => void 
}) => {
  const { form, setForm, loadingState, handleSubmit, handleEditClick, resetForm, deleteProduct, generateAIDesc, listData } = useProductManager(products, setProducts);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7">
         <ProductList data={listData} onEdit={handleEditClick} onDelete={deleteProduct} />
      </div>
      <div className="lg:col-span-5">
         <ProductForm 
            form={form} 
            setForm={setForm} 
            loading={loadingState} 
            onSubmit={handleSubmit} 
            onReset={resetForm} 
            onGenerateAI={generateAIDesc}
         />
      </div>
    </div>
  );
};
