
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Tag, DollarSign, Search, Wand2, Image as ImageIcon, RefreshCw, Filter, List, Scale, ThumbsUp } from 'lucide-react';
import { Product } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, CONFIG, formatRupiah, callGeminiWithRotation, formatNumberInput, cleanNumberInput, slugify, renameFile } from '../utils';

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
        specsStr: '', // String representation of specs object
        includesStr: '', // String representation of includes array
        whyBuyStr: '', // NEW: String representation of why_buy array
        imagePreview: '',
        uploadFile: null as File | null
    });

    const [loadingState, setLoadingState] = useState({
        generatingTitle: false,
        generatingDesc: false,
        generatingSpecs: false,
        generatingIncludes: false,
        generatingWhyBuy: false, // NEW
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
            specsStr: '',
            includesStr: '',
            whyBuyStr: '',
            imagePreview: '',
            uploadFile: null
        });
    };

    const handleEditClick = (p: Product) => {
        // Convert Specs Object to String
        const specsString = p.specs 
            ? Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join('\n')
            : '';
        
        // Convert Includes Array to String
        const includesString = p.package_includes 
            ? p.package_includes.join('\n')
            : '';

        // Convert WhyBuy Array to String
        const whyBuyString = p.why_buy
            ? p.why_buy.join('\n')
            : '';

        setForm({
            id: p.id,
            name: p.name,
            category: p.category || PRODUCT_CATEGORIES[0],
            price: formatNumberInput(p.price), 
            desc: p.description,
            shortDesc: '',
            specsStr: specsString,
            includesStr: includesString,
            whyBuyStr: whyBuyString,
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

    const generateAISpecs = async () => {
        if (!form.name) return alert("Isi Nama Produk dulu.");
        setLoadingState(prev => ({ ...prev, generatingSpecs: true }));
        try {
            const prompt = `
            Role: Tech Specialist.
            Task: Generate realistic technical specifications for POS Product: "${form.name}" (${form.category}).
            Context: ${form.shortDesc}.
            Format: Key: Value (one per line).
            Language: Indonesian/English (Mixed standard terms).
            Example:
            OS: Windows 10 IoT
            RAM: 4GB
            Storage: 128GB SSD
            Layar: 15.6 Inch Touchscreen
            Printer: 80mm Auto-Cutter
            
            Output: JUST the list. Max 6-8 items.
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setForm(prev => ({ ...prev, specsStr: res.text?.trim() || '' }));
        } catch (e) { alert("Gagal generate spek."); }
        finally { setLoadingState(prev => ({ ...prev, generatingSpecs: false })); }
    };

    const generateAIIncludes = async () => {
        if (!form.name) return alert("Isi Nama Produk dulu.");
        setLoadingState(prev => ({ ...prev, generatingIncludes: true }));
        try {
            const prompt = `
            Role: Sales Manager.
            Task: Generate a list of "Package Includes" (Apa saja yang didapat) for selling: "${form.name}".
            Context: Include standard bonuses like Training, Warranty, Support.
            Format: One item per line.
            Language: Indonesian.
            Example:
            PC All-in-One Touchscreen
            Printer Kasir Thermal
            Laci Uang (Cash Drawer)
            Software Kasir (Lifetime)
            Garansi Hardware 1 Tahun
            Free Training & Support
            
            Output: JUST the list. Max 5-7 items.
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setForm(prev => ({ ...prev, includesStr: res.text?.trim() || '' }));
        } catch (e) { alert("Gagal generate paket."); }
        finally { setLoadingState(prev => ({ ...prev, generatingIncludes: false })); }
    };

    // NEW: Generate Reasons to Buy
    const generateAIWhyBuy = async () => {
        if (!form.name) return alert("Isi Nama Produk dulu.");
        setLoadingState(prev => ({ ...prev, generatingWhyBuy: true }));
        try {
            const prompt = `
            Role: Senior Sales Consultant.
            Task: Provide 3-5 punchy reasons "Why Buy This Package?" for: "${form.name}" (${form.category}).
            Focus: Return on Investment (ROI), Efficiency, Durability, or Ease of Use.
            Format: One short sentence per line.
            Language: Indonesian.
            Example:
            Investasi sekali untuk pemakaian jangka panjang (Heavy Duty).
            Sistem anti-maling untuk mencegah kebocoran omzet.
            Layanan purna jual prioritas 24/7.
            
            Output: JUST the list.
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setForm(prev => ({ ...prev, whyBuyStr: res.text?.trim() || '' }));
        } catch (e) { alert("Gagal generate alasan."); }
        finally { setLoadingState(prev => ({ ...prev, generatingWhyBuy: false })); }
    };

    const generateAIImage = async () => {
        if (!form.name) return alert("Isi Nama Produk untuk referensi gambar.");
        setLoadingState(p => ({...p, generatingImage: true}));
        try {
            const seed = Math.floor(Math.random() * 999999);
            const cleanName = form.name.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 50);
            const prompt = `${cleanName} ${form.category} modern point of sale hardware machine, sleek, white background, high quality, 8k, realistic product photography`;
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&model=flux&nologo=true&seed=${seed}`;
            
            const res = await fetch(url);
            const blob = await res.blob();
            const fileName = `${slugify(form.name)}-${slugify(form.category)}-pos.jpg`;
            const file = new File([blob], fileName, { type: "image/jpeg" });

            setForm(p => ({...p, imagePreview: url, uploadFile: file}));
            setLoadingState(p => ({...p, generatingImage: false}));
        } catch(e) { 
            console.error(e);
            setLoadingState(p => ({...p, generatingImage: false})); 
        }
    };

    const handleSubmit = async () => {
        if (!form.name || !form.price) return alert("Wajib isi Nama dan Harga");
        
        if (form.uploadFile && !CONFIG.CLOUDINARY_CLOUD_NAME) return alert("Cloudinary Config Missing");

        setLoadingState(prev => ({ ...prev, uploading: true }));
        try {
            let finalImageUrl = form.imagePreview || 'https://via.placeholder.com/400';

            if (form.uploadFile) {
                const seoName = `${slugify(form.name)}-mesin-kasir`;
                const fileToUpload = renameFile(form.uploadFile, seoName);

                const formData = new FormData();
                formData.append('file', fileToUpload);
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                if (data.secure_url) finalImageUrl = data.secure_url;
            }

            // Parse Specs String to Object
            const specsObj: Record<string, string> = {};
            if (form.specsStr) {
                form.specsStr.split('\n').forEach(line => {
                    const [key, ...rest] = line.split(':');
                    if (key && rest.length > 0) {
                        specsObj[key.trim()] = rest.join(':').trim();
                    }
                });
            }

            // Parse Includes String to Array
            const includesArr = form.includesStr 
                ? form.includesStr.split('\n').map(s => s.trim()).filter(Boolean)
                : [];

            // Parse WhyBuy String to Array
            const whyBuyArr = form.whyBuyStr
                ? form.whyBuyStr.split('\n').map(s => s.trim()).filter(Boolean)
                : [];

            const dbData = {
                name: form.name,
                price: cleanNumberInput(form.price),
                category: form.category,
                description: form.desc,
                image_url: finalImageUrl,
                specs: specsObj, 
                package_includes: includesArr,
                why_buy: whyBuyArr // SAVE NEW FIELD
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
        generateAISpecs,
        generateAIIncludes,
        generateAIWhyBuy,
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
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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

// --- MAIN PRODUCT EDITOR WITH 3-COLUMN LAYOUT ---
export const AdminProducts = ({ 
  products, 
  setProducts 
}: { 
  products: Product[], 
  setProducts: (p: Product[]) => void 
}) => {
  const { form, setForm, loadingState, handleSubmit, handleEditClick, resetForm, deleteProduct, generateAITitle, generateAIDesc, generateAIImage, generateAISpecs, generateAIIncludes, generateAIWhyBuy, listData } = useProductManager(products, setProducts);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start h-[85vh]">
      
      {/* COLUMN 1: LIST (40%) */}
      <div className="lg:col-span-4 h-full">
         <ProductList data={listData} onEdit={handleEditClick} onDelete={deleteProduct} />
      </div>
      
      {/* COLUMN 2: BASIC EDITOR (30%) */}
      <div className="lg:col-span-3 h-full flex flex-col bg-brand-dark rounded-xl border border-white/5 shadow-2xl overflow-hidden">
         <div className="p-4 border-b border-white/5 bg-brand-dark shrink-0">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {form.id ? <Edit size={16} className="text-brand-orange"/> : <Tag size={16} className="text-brand-orange"/>}
                INFO DASAR
            </h3>
         </div>
         
         <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-4">
            {/* IMAGE UPLOAD */}
            <div className="relative w-full h-40 bg-black/40 rounded-lg overflow-hidden border border-white/10 group">
                {form.imagePreview ? (
                    <img src={form.imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-1">
                        <ImageIcon size={24} />
                        <span className="text-[10px]">Preview Gambar</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                     <button onClick={generateAIImage} disabled={loadingState.generatingImage} className="w-full py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded flex items-center justify-center gap-2 hover:bg-blue-500">
                        {loadingState.generatingImage ? <LoadingSpinner size={12}/> : <><Wand2 size={12}/> AI Generate</>}
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
                    <button onClick={generateAITitle} disabled={loadingState.generatingTitle} className="text-[9px] text-blue-400 hover:text-white flex items-center gap-1 disabled:opacity-50">
                        {loadingState.generatingTitle ? <LoadingSpinner size={10}/> : <><Wand2 size={10}/> Auto-Name</>}
                    </button>
                </div>
                <Input value={form.name} onChange={e => setForm((prev:any) => ({...prev, name: e.target.value}))} placeholder="Nama Produk..." className="py-2 text-xs" />
            </div>

            {/* CATEGORY & PRICE */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Kategori</label>
                    <div className="relative">
                        <Filter size={12} className="absolute left-2.5 top-2.5 text-gray-500"/>
                        <select 
                            value={form.category} 
                            onChange={e => setForm((prev:any) => ({...prev, category: e.target.value}))}
                            className="w-full bg-brand-card border border-white/10 rounded-lg pl-7 pr-2 py-2 text-[10px] text-white focus:border-brand-orange outline-none appearance-none"
                        >
                            {PRODUCT_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Harga</label>
                    <div className="relative">
                        <DollarSign size={12} className="absolute left-2.5 top-2.5 text-gray-500"/>
                        <Input 
                            value={form.price} 
                            onChange={e => setForm((prev:any) => ({...prev, price: formatNumberInput(e.target.value)}))} 
                            placeholder="0" 
                            type="text" 
                            className="pl-7 py-2 text-[10px]" 
                        />
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* COLUMN 3: DETAIL EDITOR (30%) */}
      <div className="lg:col-span-3 h-full flex flex-col bg-brand-dark rounded-xl border border-white/5 shadow-2xl overflow-hidden relative">
         <div className="p-4 border-b border-white/5 bg-brand-dark shrink-0 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <List size={16} className="text-brand-orange"/>
                DETAIL LENGKAP
            </h3>
            {form.id && (
                <button onClick={resetForm} className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded">
                    <XIcon size={12} /> Batal
                </button>
            )}
         </div>

         <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-4">
            {/* DESCRIPTION */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Deskripsi (Sales Copy)</label>
                    <button onClick={generateAIDesc} disabled={loadingState.generatingDesc} className="text-[9px] text-blue-400 hover:text-white flex items-center gap-1 disabled:opacity-50">
                        {loadingState.generatingDesc ? <LoadingSpinner size={10}/> : <><Wand2 size={10}/> Auto-Desc</>}
                    </button>
                </div>
                <TextArea value={form.desc} onChange={e => setForm((prev:any) => ({...prev, desc: e.target.value}))} placeholder="Deskripsi..." className="h-24 text-[10px] leading-relaxed custom-scrollbar whitespace-pre-line" />
            </div>

            {/* SPECS */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1"><Scale size={10}/> Spesifikasi Utama</label>
                    <button onClick={generateAISpecs} disabled={loadingState.generatingSpecs} className="text-[9px] text-blue-400 hover:text-white flex items-center gap-1 disabled:opacity-50">
                        {loadingState.generatingSpecs ? <LoadingSpinner size={10}/> : <><Wand2 size={10}/> Auto-Spec</>}
                    </button>
                </div>
                <TextArea 
                    value={form.specsStr} 
                    onChange={e => setForm((prev:any) => ({...prev, specsStr: e.target.value}))} 
                    placeholder="Contoh:&#10;RAM: 4GB&#10;OS: Windows 10" 
                    className="h-20 text-[10px] leading-relaxed custom-scrollbar whitespace-pre-line font-mono" 
                />
            </div>

            {/* INCLUDES */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1"><List size={10}/> Paket Termasuk</label>
                    <button onClick={generateAIIncludes} disabled={loadingState.generatingIncludes} className="text-[9px] text-blue-400 hover:text-white flex items-center gap-1 disabled:opacity-50">
                        {loadingState.generatingIncludes ? <LoadingSpinner size={10}/> : <><Wand2 size={10}/> Auto-List</>}
                    </button>
                </div>
                <TextArea 
                    value={form.includesStr} 
                    onChange={e => setForm((prev:any) => ({...prev, includesStr: e.target.value}))} 
                    placeholder="Contoh:&#10;Printer Thermal&#10;Garansi 1 Tahun" 
                    className="h-20 text-[10px] leading-relaxed custom-scrollbar whitespace-pre-line" 
                />
            </div>

            {/* NEW: WHY BUY */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider flex items-center gap-1"><ThumbsUp size={10}/> Alasan Membeli (Selling Points)</label>
                    <button onClick={generateAIWhyBuy} disabled={loadingState.generatingWhyBuy} className="text-[9px] text-blue-400 hover:text-white flex items-center gap-1 disabled:opacity-50">
                        {loadingState.generatingWhyBuy ? <LoadingSpinner size={10}/> : <><Wand2 size={10}/> Auto-Reason</>}
                    </button>
                </div>
                <TextArea 
                    value={form.whyBuyStr} 
                    onChange={e => setForm((prev:any) => ({...prev, whyBuyStr: e.target.value}))} 
                    placeholder="Contoh:&#10;Investasi Jangka Panjang&#10;Anti Maling" 
                    className="h-20 text-[10px] leading-relaxed custom-scrollbar whitespace-pre-line" 
                />
            </div>
         </div>

         {/* SAVE BUTTON (Sticky Footer in Col 3) */}
         <div className="p-4 border-t border-white/5 bg-brand-dark shrink-0">
            <Button onClick={handleSubmit} disabled={loadingState.uploading} className="w-full py-3 text-xs font-bold shadow-neon">
                {loadingState.uploading ? <LoadingSpinner /> : (form.id ? <><Save size={14}/> UPDATE PRODUK</> : <><Plus size={14}/> SIMPAN PRODUK</>)}
            </Button>
         </div>
      </div>

    </div>
  );
};
