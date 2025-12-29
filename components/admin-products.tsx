
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Tag, DollarSign, Search, Wand2, Image as ImageIcon, RefreshCw, Filter } from 'lucide-react';
import { Product } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, CONFIG, formatRupiah, callGeminiWithRotation, formatNumberInput, cleanNumberInput } from '../utils';

const ITEMS_PER_PAGE = 8; 

// Preset Categories
const PRODUCT_CATEGORIES = [
    "Android POS",
    "Windows POS",
    "Smart Kiosk",
    "Retail POS",
    "Hardware",
    "Software",
    "Accessories"
];

const useProductManager = (
    products: Product[], 
    setProducts: (p: Product[]) => void
) => {
    const [form, setForm] = useState({
        id: null as number | null,
        name: '',
        category: PRODUCT_CATEGORIES[0], // Default category
        price: '',
        desc: '',
        shortDesc: '', 
        imagePreview: '',
        uploadFile: null as File | null
    });

    const [loadingState, setLoadingState] = useState({
        generatingTitle: false,
        generatingDesc: false,
        generatingImage: false,
        uploading: false
    });

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All'); // Filter state

    // Reset pagination when filter changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm, selectedCategory]);

    const resetForm = () => {
        setForm({
            id: null,
            name: '',
            category: PRODUCT_CATEGORIES[0],
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
            category: p.category || PRODUCT_CATEGORIES[0],
            price: formatNumberInput(p.price), 
            desc: p.description,
            shortDesc: '',
            imagePreview: p.image,
            uploadFile: null
        });
    };

    // --- AI GENERATORS ---

    const generateAITitle = async () => {
        if (!form.shortDesc) return alert("Isi 'Keywords / Fitur' terlebih dahulu sebagai ide.");
        setLoadingState(p => ({...p, generatingTitle: true}));
        try {
            const prompt = `Create a short, professional, and catchy product name (Title) for a POS/Cashier System.
            Context/Features: ${form.shortDesc}.
            Category: ${form.category}.
            Language: Indonesian.
            Output: JUST the product name (max 5 words). No quotes.`;
            
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setForm(p => ({...p, name: res.text?.trim() || p.name}));
        } catch(e) { alert("Gagal generate judul."); }
        finally { setLoadingState(p => ({...p, generatingTitle: false})); }
    };

    const generateAIDesc = async () => {
        if (!form.name && !form.shortDesc) return alert("Isi Nama Produk atau Keywords dulu.");
        setLoadingState(prev => ({ ...prev, generatingDesc: true }));

        try {
            const prompt = `
            Role: Expert E-commerce Copywriter.
            Task: Write a persuasive product description for: "${form.name}".
            Category: ${form.category}.
            Features: ${form.shortDesc}.
            Format: Indonesian.
            
            STRICT OUTPUT RULES:
            1. Output PLAIN TEXT only. 
            2. Do NOT use Markdown formatting (NO **bold**, NO ## headers).
            3. Use actual newlines for paragraphs.
            4. Use dashes (-) for bullet points.
            5. Start directly with the Hook. No "Here is the description".
            `;
            const response = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const cleanText = (response.text?.trim() || '').replace(/\*\*/g, '');
            setForm(prev => ({ ...prev, desc: cleanText }));
        } catch (e: any) { alert(`AI Error: ${e.message}`); } 
        finally { setLoadingState(prev => ({ ...prev, generatingDesc: false })); }
    };

    const generateAIImage = async () => {
        if (!form.name) return alert("Isi Nama Produk untuk referensi gambar.");
        setLoadingState(p => ({...p, generatingImage: true}));
        try {
            const seed = Math.floor(Math.random() * 999999);
            const cleanName = form.name.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 50);
            const prompt = `${cleanName} ${form.category} modern point of sale hardware machine, sleek, white background, high quality, 8k, realistic product photography`;
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&model=flux&nologo=true&seed=${seed}`;
            
            const img = new Image();
            img.src = url;
            img.onload = () => {
                setForm(p => ({...p, imagePreview: url, uploadFile: null}));
                setLoadingState(p => ({...p, generatingImage: false}));
            };
            img.onerror = () => {
                alert("Gagal generate gambar. Coba lagi.");
                setLoadingState(p => ({...p, generatingImage: false}));
            }
        } catch(e) { setLoadingState(p => ({...p, generatingImage: false})); }
    };

    const handleSubmit = async () => {
        if (!form.name || !form.price) return alert("Wajib isi Nama dan Harga");
        
        if (form.uploadFile && !CONFIG.CLOUDINARY_CLOUD_NAME) return alert("Cloudinary Config Missing");

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
                price: cleanNumberInput(form.price),
                category: form.category,
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

    // Filter Logic
    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return {
        form, setForm,
        loadingState,
        handleSubmit,
        handleEditClick,
        resetForm,
        deleteProduct,
        generateAITitle,
        generateAIDesc,
        generateAIImage,
        listData: { 
            paginated, 
            totalPages, 
            page, 
            setPage, 
            searchTerm, 
            setSearchTerm,
            selectedCategory,
            setSelectedCategory,
            totalItems: filtered.length
        }
    };
};

const ProductForm = ({ 
    form, setForm, loading, onSubmit, onReset, onGenTitle, onGenDesc, onGenImage 
}: {
    form: any, setForm: any, loading: any, onSubmit: any, onReset: any, onGenTitle: any, onGenDesc: any, onGenImage: any
}) => (
    <div className="bg-brand-dark rounded-xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col h-[85vh] sticky top-6">
        
        {/* 1. STICKY HEADER */}
        <div className="p-5 border-b border-white/5 shrink-0 bg-brand-dark z-20">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {form.id ? <Edit size={16} className="text-brand-orange"/> : <Tag size={16} className="text-brand-orange"/>}
                    {form.id ? "EDIT PRODUK" : "PRODUK BARU"}
                </h3>
                {form.id && (
                    <button onClick={onReset} className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded">
                        <XIcon size={12} /> Batal
                    </button>
                )}
            </div>
        </div>

        {/* 2. STICKY IMAGE SECTION (Compact) */}
        <div className="p-4 border-b border-white/5 shrink-0 bg-brand-dark/50 z-10">
            <div className="relative w-full h-32 bg-black/40 rounded-lg overflow-hidden border border-white/10 group">
                {form.imagePreview ? (
                    <img src={form.imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-1">
                        <ImageIcon size={20} />
                        <span className="text-[9px]">Preview Gambar</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                     <button onClick={onGenImage} disabled={loading.generatingImage} className="w-full py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded flex items-center justify-center gap-2 hover:bg-blue-500">
                        {loading.generatingImage ? <LoadingSpinner size={12}/> : <><Wand2 size={12}/> AI Generate</>}
                     </button>
                     <label className="w-full py-1.5 bg-white/10 text-white text-[10px] font-bold rounded flex items-center justify-center gap-2 hover:bg-white/20 cursor-pointer border border-white/20">
                        <UploadCloud size={12}/> Upload
                        <input type="file" accept="image/*" onChange={(e) => {
                            const file = e.target.files ? e.target.files[0] : null;
                            if (file) setForm((prev: any) => ({ ...prev, uploadFile: file, imagePreview: URL.createObjectURL(file) }));
                        }} className="hidden" />
                     </label>
                </div>
            </div>
        </div>

        {/* 3. SCROLLABLE CONTENT */}
        <div className="flex-grow overflow-y-auto p-5 custom-scrollbar space-y-4">
            {/* KEYWORDS */}
            <div className="bg-brand-orange/5 p-3 rounded-lg border border-brand-orange/20">
                <label className="text-[9px] text-brand-orange uppercase font-bold tracking-wider mb-1 block flex items-center gap-1">
                    <Sparkles size={10} /> Keywords (AI Trigger)
                </label>
                <input 
                    value={form.shortDesc} 
                    onChange={e => setForm((prev:any) => ({...prev, shortDesc: e.target.value}))} 
                    placeholder="Fitur, spek, keunggulan..." 
                    className="w-full bg-black/40 border border-brand-orange/30 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange placeholder-gray-600"
                />
            </div>

            {/* NAME */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Nama Produk</label>
                    <button onClick={onGenTitle} disabled={loading.generatingTitle} className="text-[9px] text-blue-400 hover:text-white flex items-center gap-1 disabled:opacity-50">
                        {loading.generatingTitle ? <LoadingSpinner size={10}/> : <><Wand2 size={10}/> Auto-Name</>}
                    </button>
                </div>
                <Input value={form.name} onChange={e => setForm((prev:any) => ({...prev, name: e.target.value}))} placeholder="Nama Produk..." className="py-2 text-xs" />
            </div>

            {/* CATEGORY (NEW) */}
            <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Kategori</label>
                <div className="relative">
                    <Filter size={12} className="absolute left-3 top-3 text-gray-500"/>
                    <select 
                        value={form.category} 
                        onChange={e => setForm((prev:any) => ({...prev, category: e.target.value}))}
                        className="w-full bg-brand-card border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:border-brand-orange outline-none appearance-none"
                    >
                        {PRODUCT_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* PRICE */}
            <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Harga (IDR)</label>
                <div className="relative">
                    <DollarSign size={12} className="absolute left-3 top-3 text-gray-500"/>
                    <Input 
                        value={form.price} 
                        onChange={e => setForm((prev:any) => ({...prev, price: formatNumberInput(e.target.value)}))} 
                        placeholder="0" 
                        type="text" 
                        className="pl-8 py-2 text-xs" 
                    />
                </div>
            </div>

            {/* DESCRIPTION */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Deskripsi</label>
                    <button onClick={onGenDesc} disabled={loading.generatingDesc} className="text-[9px] text-blue-400 hover:text-white flex items-center gap-1 disabled:opacity-50">
                        {loading.generatingDesc ? <LoadingSpinner size={10}/> : <><Wand2 size={10}/> Auto-Desc</>}
                    </button>
                </div>
                <TextArea value={form.desc} onChange={e => setForm((prev:any) => ({...prev, desc: e.target.value}))} placeholder="Deskripsi..." className="h-32 text-xs leading-relaxed custom-scrollbar whitespace-pre-line" />
            </div>
        </div>

        {/* 4. STICKY FOOTER */}
        <div className="p-5 border-t border-white/5 shrink-0 bg-brand-dark">
            <Button onClick={onSubmit} disabled={loading.uploading} className="w-full py-3 text-xs font-bold shadow-neon">
                {loading.uploading ? <LoadingSpinner /> : (form.id ? <><Save size={14}/> UPDATE</> : <><Plus size={14}/> SIMPAN</>)}
            </Button>
        </div>
    </div>
);

// --- REUSABLE PAGINATION COMPONENT ---
const Pagination = ({ page, totalPages, setPage, className = "" }: { page: number, totalPages: number, setPage: (p: any) => void, className?: string }) => {
    if (totalPages <= 1) return null;
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button onClick={() => setPage((p: number) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"><ChevronLeft size={14} /></button>
            <span className="text-[10px] font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded border border-brand-orange/20">{page} / {totalPages}</span>
            <button onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"><ChevronRight size={14} /></button>
        </div>
    );
};

const ProductList = ({ 
    data, onEdit, onDelete 
}: { 
    data: any, onEdit: any, onDelete: any 
}) => (
    <div className="bg-brand-dark rounded-xl border border-white/5 flex flex-col h-full overflow-hidden shadow-xl">
        {/* HEADER: Search & Total */}
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
             <span className="text-[10px] font-bold text-gray-500 uppercase bg-white/5 px-2 py-1 rounded">Total: {data.totalItems}</span>
        </div>
        
        {/* TOOLBAR: Categories & Pagination */}
        <div className="p-2 border-b border-white/5 flex justify-between items-center bg-black/10 overflow-x-auto gap-4 custom-scrollbar">
            {/* Category Pills - Left */}
            <div className="flex gap-2 shrink-0">
                <button 
                    onClick={() => data.setSelectedCategory('All')}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
                        data.selectedCategory === 'All' 
                        ? 'bg-brand-orange text-white border-brand-orange' 
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                    }`}
                >
                    Semua
                </button>
                {PRODUCT_CATEGORIES.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => data.setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border whitespace-nowrap ${
                            data.selectedCategory === cat 
                            ? 'bg-brand-orange text-white border-brand-orange' 
                            : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Pagination - Right */}
            <Pagination page={data.page} totalPages={data.totalPages} setPage={data.setPage} className="shrink-0 justify-end" />
        </div>

        {/* GRID */}
        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar min-h-[500px]">
            {data.paginated.length === 0 ? (
                <div className="text-center py-20 text-gray-500 text-xs">
                    <Search size={32} className="mx-auto mb-2 opacity-20"/>
                    Produk tidak ditemukan.
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {data.paginated.map((p: Product) => (
                        <div key={p.id} className="group relative bg-brand-card border border-white/5 rounded-lg overflow-hidden hover:border-brand-orange transition-all hover:shadow-neon-text/20 flex flex-col h-full">
                            <div className="relative aspect-square bg-black overflow-hidden border-b border-white/5">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button onClick={() => onEdit(p)} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 shadow-lg"><Edit size={14} /></button>
                                    <button onClick={() => onDelete(p.id)} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-500 shadow-lg"><Trash2 size={14} /></button>
                                </div>
                                <div className="absolute top-2 right-2">
                                     <span className="bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-brand-orange font-bold border border-brand-orange/30 shadow-black shadow-lg">
                                        {formatRupiah(p.price)}
                                     </span>
                                </div>
                                <div className="absolute bottom-2 left-2">
                                     <span className="bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] text-white font-bold border border-white/10">
                                        {p.category}
                                     </span>
                                </div>
                            </div>
                            <div className="p-3 flex-grow flex flex-col">
                                <h5 className="text-xs font-bold text-white line-clamp-2 mb-1 leading-snug" title={p.name}>{p.name}</h5>
                                <p className="text-[9px] text-gray-500 line-clamp-2 leading-relaxed flex-grow whitespace-pre-line">
                                    {p.description || "Belum ada deskripsi."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* BOTTOM PAGINATION: Right Aligned */}
        <div className="p-2 border-t border-white/10 flex justify-end">
            <Pagination page={data.page} totalPages={data.totalPages} setPage={data.setPage} />
        </div>
    </div>
);

export const AdminProducts = ({ 
  products, 
  setProducts 
}: { 
  products: Product[], 
  setProducts: (p: Product[]) => void 
}) => {
  const { form, setForm, loadingState, handleSubmit, handleEditClick, resetForm, deleteProduct, generateAITitle, generateAIDesc, generateAIImage, listData } = useProductManager(products, setProducts);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      {/* List Column (75%) */}
      <div className="lg:col-span-3 order-2 lg:order-1">
         <ProductList data={listData} onEdit={handleEditClick} onDelete={deleteProduct} />
      </div>
      
      {/* Editor Column (25%) */}
      <div className="lg:col-span-1 order-1 lg:order-2">
         <ProductForm 
            form={form} 
            setForm={setForm} 
            loading={loadingState} 
            onSubmit={handleSubmit} 
            onReset={resetForm} 
            onGenTitle={generateAITitle}
            onGenDesc={generateAIDesc}
            onGenImage={generateAIImage}
         />
      </div>
    </div>
  );
};
