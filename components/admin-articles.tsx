
import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Search, FileText, Calendar, User, Clock } from 'lucide-react';
import { Article } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, CONFIG, ensureAPIKey, getEnv } from '../utils';
import { GoogleGenAI } from "@google/genai";

const ITEMS_PER_PAGE = 6;

// --- LOGIC: Custom Hook ---
const useArticleManager = (
    articles: Article[], 
    setArticles: (a: Article[]) => void
) => {
    const [form, setForm] = useState({
        id: null as number | null,
        title: '',
        excerpt: '',
        content: '',
        category: '',
        author: 'Admin',
        readTime: '5 min read',
        imagePreview: '',
        uploadFile: null as File | null
    });

    const [loading, setLoading] = useState({
        uploading: false,
        generatingAI: false
    });
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const resetForm = () => {
        setForm({
            id: null,
            title: '',
            excerpt: '',
            content: '',
            category: '',
            author: 'Admin',
            readTime: '5 min read',
            imagePreview: '',
            uploadFile: null
        });
    };

    const handleEditClick = (item: Article) => {
        setForm({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt,
            content: item.content,
            category: item.category,
            author: item.author,
            readTime: item.readTime,
            imagePreview: item.image,
            uploadFile: null
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generateAIContent = async () => {
        if (!form.title || !form.category) return alert("Mohon isi Judul dan Kategori dulu sebagai konteks AI.");
        
        setLoading(prev => ({ ...prev, generatingAI: true }));
        try {
            await ensureAPIKey();
            const apiKey = process.env.API_KEY || getEnv('VITE_GEMINI_API_KEY') || getEnv('VITE_API_KEY');
            const ai = new GoogleGenAI({ apiKey: apiKey || '' });
            
            const prompt = `
            Role: SEO Specialist & Tech Blogger.
            Task: Write a blog post (Markdown format).
            Topic: ${form.title}
            Category: ${form.category}
            
            Structure:
            1. Title (H1)
            2. Introduction (Hook)
            3. Key Points (H2 & Bullet points)
            4. Conclusion
            
            STRICT: Language Indonesian. Professional yet engaging tone.
            `;
            
            const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            const generatedText = response.text?.trim() || '';
            
            // Auto-fill excerpt based on first paragraph
            const firstPara = generatedText.split('\n').find(line => line.length > 50 && !line.startsWith('#')) || generatedText.substring(0, 150);
            
            setForm(prev => ({ 
                ...prev, 
                content: generatedText,
                excerpt: prev.excerpt || firstPara.substring(0, 160) + "..."
            }));

        } catch (e: any) {
            console.error(e);
            alert("Gagal generate AI: " + (e.message || "Unknown error"));
        } finally {
            setLoading(prev => ({ ...prev, generatingAI: false }));
        }
    };

    const handleSubmit = async () => {
        if (!form.title || !form.content) return alert("Judul dan Konten wajib diisi.");
        if (!CONFIG.CLOUDINARY_CLOUD_NAME) return alert("Config Cloudinary Missing");

        setLoading(prev => ({ ...prev, uploading: true }));
        try {
            let finalImageUrl = form.imagePreview || 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1200';

            if (form.uploadFile) {
                const formData = new FormData();
                formData.append('file', form.uploadFile);
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                if (data.secure_url) finalImageUrl = data.secure_url;
            }

            const dbData = {
                title: form.title,
                excerpt: form.excerpt,
                content: form.content,
                category: form.category,
                author: form.author,
                readTime: form.readTime,
                image: finalImageUrl,
                date: form.id ? undefined : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            };

            // Remove undefined fields
            if (!dbData.date) delete dbData.date;

            if (form.id) {
                // Update Local
                const updatedItem = { ...articles.find(a => a.id === form.id)!, ...dbData, id: form.id } as Article;
                setArticles(articles.map(a => a.id === form.id ? updatedItem : a));
                
                // Update DB
                if (supabase) {
                    const { error } = await supabase.from('articles').update({
                        title: dbData.title,
                        excerpt: dbData.excerpt,
                        content: dbData.content,
                        category: dbData.category,
                        author: dbData.author,
                        read_time: dbData.readTime,
                        image_url: dbData.image
                    }).eq('id', form.id);
                    if (error) throw error;
                }
            } else {
                // Insert Local
                const newId = Date.now();
                const newItem = { ...dbData, id: newId, date: dbData.date || 'Today' } as Article;
                setArticles([newItem, ...articles]);
                
                // Insert DB
                if (supabase) {
                     const { error } = await supabase.from('articles').insert([{
                        title: dbData.title,
                        excerpt: dbData.excerpt,
                        content: dbData.content,
                        category: dbData.category,
                        author: dbData.author,
                        read_time: dbData.readTime,
                        image_url: dbData.image,
                        date: newItem.date
                    }]);
                    if (error) throw error;
                }
            }
            resetForm();
            alert("Artikel berhasil disimpan!");
        } catch (e) { console.error(e); alert("Gagal menyimpan."); }
        finally { setLoading(prev => ({ ...prev, uploading: false })); }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus artikel ini?")) return;
        setArticles(articles.filter(a => a.id !== id));
        if (supabase) await supabase.from('articles').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    const filtered = articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return {
        form, setForm,
        loading,
        handleSubmit,
        handleEditClick,
        resetForm,
        deleteItem,
        generateAIContent,
        listData: { paginated, totalPages, page, setPage, searchTerm, setSearchTerm }
    };
};

const ArticleForm = ({ 
    form, setForm, loading, onSubmit, onReset, onGenerateAI 
}: {
    form: any, setForm: any, loading: any, onSubmit: any, onReset: any, onGenerateAI: any
}) => (
    <div className="bg-brand-dark p-6 rounded-xl border border-white/5 h-fit sticky top-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {form.id ? <Edit size={18} className="text-brand-orange"/> : <FileText size={18} className="text-brand-orange"/>}
                {form.id ? "Edit Artikel" : "Tulis Artikel Baru"}
            </h3>
            {form.id && (
                <button onClick={onReset} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded">
                    <XIcon size={12} /> Batal
                </button>
            )}
        </div>

        {/* Image Upload */}
        <div className="mb-4">
             {form.imagePreview && (
               <div className="mb-3 relative w-full h-40 bg-black/40 rounded-lg overflow-hidden border border-white/10 group">
                  <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-xs font-bold">Ganti Cover</p>
                    </div>
               </div>
             )}
             <div className="border border-dashed border-white/20 rounded-lg p-3 text-center hover:border-brand-orange/50 transition-colors bg-brand-card/30">
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                if (file) setForm((prev:any) => ({ ...prev, uploadFile: file, imagePreview: URL.createObjectURL(file) }));
              }} className="hidden" id="article-upload" />
              <label htmlFor="article-upload" className="cursor-pointer flex flex-col items-center gap-2">
                {!form.imagePreview && <UploadCloud size={20} className="text-gray-400" />}
                <span className="text-gray-400 text-xs font-bold">{form.uploadFile ? form.uploadFile.name : (form.id ? "Klik ganti gambar" : "Upload Cover Artikel")}</span>
              </label>
            </div>
        </div>

        <div className="space-y-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Judul Artikel</label>
              <Input value={form.title} onChange={e => setForm((prev:any) => ({...prev, title: e.target.value}))} placeholder="Judul menarik..." className="py-2 text-sm font-bold"/>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                   <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Kategori</label>
                   <Input value={form.category} onChange={e => setForm((prev:any) => ({...prev, category: e.target.value}))} placeholder="Misal: Tips Bisnis" className="py-2 text-xs"/>
                </div>
                <div>
                   <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Penulis</label>
                   <Input value={form.author} onChange={e => setForm((prev:any) => ({...prev, author: e.target.value}))} placeholder="Admin" className="py-2 text-xs"/>
                </div>
            </div>

            {/* AI Trigger */}
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between">
                <div>
                    <span className="text-xs font-bold text-blue-400 flex items-center gap-1"><Sparkles size={12}/> Butuh Ide?</span>
                    <p className="text-[10px] text-gray-400">AI akan menulis berdasarkan Judul & Kategori.</p>
                </div>
                <button 
                    onClick={onGenerateAI} 
                    disabled={loading.generatingAI}
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-bold transition-colors flex items-center gap-1"
                >
                    {loading.generatingAI ? <LoadingSpinner size={12} /> : <><Sparkles size={12}/> Write for Me</>}
                </button>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Excerpt (Ringkasan)</label>
              <TextArea value={form.excerpt} onChange={e => setForm((prev:any) => ({...prev, excerpt: e.target.value}))} placeholder="Ringkasan singkat untuk preview..." className="h-20 text-xs leading-relaxed" />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Konten (Markdown Support)</label>
              <TextArea value={form.content} onChange={e => setForm((prev:any) => ({...prev, content: e.target.value}))} placeholder="# Heading 1&#10;Isi artikel di sini..." className="h-64 text-sm font-mono leading-relaxed" />
            </div>
            
            <Button onClick={onSubmit} disabled={loading.uploading} className="w-full py-2.5 text-sm">
              {loading.uploading ? <LoadingSpinner /> : (form.id ? <><Save size={16}/> Simpan Perubahan</> : <><Plus size={16}/> Publish Artikel</>)}
            </Button>
        </div>
    </div>
);

const ArticleList = ({ 
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
                    placeholder="Cari artikel..." 
                    className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                />
             </div>
             <span className="text-[10px] font-bold text-gray-500 uppercase">Total: {data.paginated.length}</span>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar min-h-[400px]">
            {data.paginated.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">Belum ada artikel.</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {data.paginated.map((item: Article) => (
                        <div key={item.id} className="relative bg-brand-card border border-white/5 rounded-lg p-3 flex gap-4 hover:border-brand-orange transition-all group">
                            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="px-1.5 py-0.5 rounded bg-brand-orange/10 text-brand-orange text-[9px] font-bold uppercase border border-brand-orange/20">{item.category}</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => onEdit(item)} className="text-blue-400 hover:text-white"><Edit size={14} /></button>
                                        <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-white"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <h5 className="text-sm font-bold text-white leading-tight line-clamp-2 mb-2">{item.title}</h5>
                                <div className="mt-auto flex items-center gap-3 text-[10px] text-gray-500">
                                    <span className="flex items-center gap-1"><Calendar size={10}/> {item.date}</span>
                                    <span className="flex items-center gap-1"><Clock size={10}/> {item.readTime}</span>
                                    <span className="flex items-center gap-1"><User size={10}/> {item.author}</span>
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

export const AdminArticles = ({ 
  articles, 
  setArticles 
}: { 
  articles: Article[], 
  setArticles: (a: Article[]) => void 
}) => {
  const { form, setForm, loading, handleSubmit, handleEditClick, resetForm, deleteItem, generateAIContent, listData } = useArticleManager(articles, setArticles);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7">
        <ArticleList data={listData} onEdit={handleEditClick} onDelete={deleteItem} />
      </div>
      <div className="lg:col-span-5">
        <ArticleForm 
            form={form} 
            setForm={setForm} 
            loading={loading} 
            onSubmit={handleSubmit} 
            onReset={resetForm}
            onGenerateAI={generateAIContent}
        />
      </div>
    </div>
  );
};
