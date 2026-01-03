
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X as XIcon, Search, UploadCloud, FileText, Link as LinkIcon, HardDrive, PlayCircle, HelpCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { DownloadItem, Tutorial, FAQ } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, uploadToSupabase, renameFile, slugify } from '../utils';

// --- LOGIC: Custom Hook for DOWNLOADS ---
const useDownloadManager = () => {
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    const [form, setForm] = useState<Partial<DownloadItem>>({
        id: '', title: '', category: 'driver', description: '', file_url: '', version: '', file_size: '', os_support: 'Windows'
    });
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => { fetchDownloads(); }, []);

    const fetchDownloads = async () => {
        if (!supabase) return;
        const { data } = await supabase.from('downloads').select('*').order('created_at', { ascending: false });
        if (data) setDownloads(data);
    };

    const resetForm = () => {
        setForm({ id: '', title: '', category: 'driver', description: '', file_url: '', version: '', file_size: '', os_support: 'Windows' });
        setUploadFile(null);
    };

    const handleEditClick = (item: DownloadItem) => { setForm(item); };

    const handleSubmit = async () => {
        if (!form.title || !form.category) return alert("Judul dan Kategori wajib diisi.");
        setLoading(true);
        try {
            let finalFileUrl = form.file_url;
            if (uploadFile && supabase) {
                const seoName = `${slugify(form.title || 'dl')}-${slugify(form.version || 'v1')}`;
                const { url } = await uploadToSupabase(renameFile(uploadFile, seoName), 'files', 'downloads');
                finalFileUrl = url;
                if (!form.file_size) form.file_size = `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`;
            }
            const dbData = { ...form, file_url: finalFileUrl, updated_at: new Date().toISOString() };
            if (form.id) {
                if (supabase) await supabase.from('downloads').update(dbData).eq('id', form.id);
                setDownloads(prev => prev.map(item => item.id === form.id ? { ...item, ...dbData } as DownloadItem : item));
            } else {
                if (supabase) {
                    const { data } = await supabase.from('downloads').insert([dbData]).select().single();
                    if (data) setDownloads(prev => [data, ...prev]);
                }
            }
            resetForm();
        } catch (e: any) { alert(`Error: ${e.message}`); } finally { setLoading(false); }
    };

    const deleteItem = async (id: string) => {
        if(!confirm("Hapus file?")) return;
        if (supabase) await supabase.from('downloads').delete().eq('id', id);
        setDownloads(prev => prev.filter(item => item.id !== id));
        if (form.id === id) resetForm();
    };

    const filtered = downloads.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return { form, setForm, uploadFile, setUploadFile, loading, handleSubmit, handleEditClick, resetForm, deleteItem, listData: { paginated, totalPages, page, setPage, searchTerm, setSearchTerm, totalItems: filtered.length } };
};

// --- LOGIC: Custom Hook for TUTORIALS ---
const useTutorialManager = () => {
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [form, setForm] = useState<Partial<Tutorial>>({ id: 0, title: '', video_url: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchTutorials(); }, []);

    const fetchTutorials = async () => {
        if (!supabase) return;
        const { data } = await supabase.from('tutorials').select('*').order('created_at', { ascending: false });
        if (data) setTutorials(data);
    };

    const handleSubmit = async () => {
        if (!form.title || !form.video_url) return alert("Isi Judul dan Link Video.");
        setLoading(true);
        try {
            if (form.id) {
                if (supabase) await supabase.from('tutorials').update(form).eq('id', form.id);
                setTutorials(prev => prev.map(t => t.id === form.id ? { ...t, ...form } as Tutorial : t));
            } else {
                if (supabase) {
                    const { data } = await supabase.from('tutorials').insert([{ title: form.title, video_url: form.video_url }]).select().single();
                    if (data) setTutorials(prev => [data, ...prev]);
                }
            }
            setForm({ id: 0, title: '', video_url: '' });
        } catch (e: any) { alert(`Error: ${e.message}`); } finally { setLoading(false); }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus video?")) return;
        if (supabase) await supabase.from('tutorials').delete().eq('id', id);
        setTutorials(prev => prev.filter(t => t.id !== id));
    };

    return { tutorials, form, setForm, loading, handleSubmit, deleteItem };
};

// --- LOGIC: Custom Hook for FAQS ---
const useFaqManager = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [form, setForm] = useState<Partial<FAQ>>({ id: 0, question: '', answer: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchFaqs(); }, []);

    const fetchFaqs = async () => {
        if (!supabase) return;
        const { data } = await supabase.from('faqs').select('*').order('created_at', { ascending: false });
        if (data) setFaqs(data);
    };

    const handleSubmit = async () => {
        if (!form.question || !form.answer) return alert("Isi Pertanyaan dan Jawaban.");
        setLoading(true);
        try {
            if (form.id) {
                if (supabase) await supabase.from('faqs').update(form).eq('id', form.id);
                setFaqs(prev => prev.map(f => f.id === form.id ? { ...f, ...form } as FAQ : f));
            } else {
                if (supabase) {
                    const { data } = await supabase.from('faqs').insert([{ question: form.question, answer: form.answer }]).select().single();
                    if (data) setFaqs(prev => [data, ...prev]);
                }
            }
            setForm({ id: 0, question: '', answer: '' });
        } catch (e: any) { alert(`Error: ${e.message}`); } finally { setLoading(false); }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus FAQ?")) return;
        if (supabase) await supabase.from('faqs').delete().eq('id', id);
        setFaqs(prev => prev.filter(f => f.id !== id));
    };

    return { faqs, form, setForm, loading, handleSubmit, deleteItem };
};

// --- MAIN COMPONENT ---
export const AdminDownloads = () => {
    const [activeTab, setActiveTab] = useState<'files' | 'tutorials' | 'faq'>('files');
    const dlManager = useDownloadManager();
    const tutManager = useTutorialManager();
    const faqManager = useFaqManager();

    return (
        <div className="h-[600px] flex flex-col">
            {/* TAB NAV */}
            <div className="flex gap-2 mb-6 border-b border-white/10 pb-1">
                {[
                    { id: 'files', label: 'File Download', icon: HardDrive },
                    { id: 'tutorials', label: 'Video Tutorial', icon: PlayCircle },
                    { id: 'faq', label: 'FAQ Manager', icon: HelpCircle }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg transition-colors ${activeTab === tab.id ? 'bg-brand-orange text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <tab.icon size={14} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT */}
            <div className="flex-grow overflow-hidden">
                
                {/* 1. FILE MANAGER */}
                {activeTab === 'files' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                        <div className="lg:col-span-7 bg-brand-dark rounded-xl border border-white/5 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
                                <div className="relative flex-grow">
                                    <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                                    <input type="text" value={dlManager.listData.searchTerm} onChange={(e) => dlManager.listData.setSearchTerm(e.target.value)} placeholder="Cari file..." className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange" />
                                </div>
                            </div>
                            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-2">
                                {dlManager.listData.paginated.map((item) => (
                                    <div key={item.id} className="bg-brand-card border border-white/5 rounded-lg p-3 flex gap-3 items-center group hover:border-brand-orange/30">
                                        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0"><HardDrive size={16} className="text-gray-400"/></div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                                            <p className="text-[10px] text-gray-500">{item.category} • {item.file_size}</p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => dlManager.handleEditClick(item)} className="p-1 hover:bg-blue-500/20 text-blue-400 rounded"><Edit size={14}/></button>
                                            <button onClick={() => dlManager.deleteItem(item.id)} className="p-1 hover:bg-red-500/20 text-red-400 rounded"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {dlManager.listData.totalPages > 1 && <div className="p-2 border-t border-white/10 flex justify-center gap-2"><button onClick={() => dlManager.listData.setPage(p => Math.max(1, p-1))}><ChevronLeft size={16}/></button><span className="text-xs">{dlManager.listData.page}</span><button onClick={() => dlManager.listData.setPage(p => Math.min(dlManager.listData.totalPages, p+1))}><ChevronRight size={16}/></button></div>}
                        </div>
                        <div className="lg:col-span-5 bg-brand-dark p-6 rounded-xl border border-white/5 overflow-y-auto custom-scrollbar">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">{dlManager.form.id ? <Edit size={16}/> : <Plus size={16}/>} {dlManager.form.id ? 'Edit File' : 'Upload File'}</h3>
                            <div className="space-y-3">
                                <Input value={dlManager.form.title || ''} onChange={e => dlManager.setForm(p => ({...p, title: e.target.value}))} placeholder="Judul File" className="text-xs"/>
                                <select value={dlManager.form.category} onChange={e => dlManager.setForm(p => ({...p, category: e.target.value as any}))} className="w-full bg-brand-card border border-white/10 rounded px-3 py-2 text-xs text-white"><option value="driver">Driver</option><option value="manual">Manual</option><option value="software">Software</option></select>
                                <div className="border border-dashed border-white/20 p-3 rounded text-center"><input type="file" onChange={e => e.target.files?.[0] && dlManager.setUploadFile(e.target.files[0])} className="text-[10px] text-gray-400"/></div>
                                <Input value={dlManager.form.file_url || ''} onChange={e => dlManager.setForm(p => ({...p, file_url: e.target.value}))} placeholder="URL Eksternal (Opsional)" className="text-xs"/>
                                <TextArea value={dlManager.form.description || ''} onChange={e => dlManager.setForm(p => ({...p, description: e.target.value}))} placeholder="Deskripsi..." className="h-16 text-xs"/>
                                <Button onClick={dlManager.handleSubmit} disabled={dlManager.loading} className="w-full text-xs py-2">{dlManager.loading ? <LoadingSpinner/> : 'Simpan'}</Button>
                                {dlManager.form.id && <button onClick={dlManager.resetForm} className="w-full text-xs text-gray-500 mt-2">Batal</button>}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. TUTORIAL MANAGER */}
                {activeTab === 'tutorials' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                        <div className="bg-brand-dark rounded-xl border border-white/5 p-4 overflow-y-auto custom-scrollbar">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Daftar Video</h4>
                            <div className="space-y-2">
                                {tutManager.tutorials.map(t => (
                                    <div key={t.id} className="p-3 bg-brand-card rounded border border-white/5 flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            <PlayCircle size={16} className="text-red-500"/>
                                            <div>
                                                <p className="text-xs font-bold text-white">{t.title}</p>
                                                <a href={t.video_url} target="_blank" className="text-[10px] text-blue-400 hover:underline">{t.video_url}</a>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => tutManager.setForm(t)} className="text-blue-400"><Edit size={14}/></button>
                                            <button onClick={() => tutManager.deleteItem(t.id)} className="text-red-400"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-brand-dark rounded-xl border border-white/5 p-6 h-fit">
                            <h3 className="text-sm font-bold text-white mb-4">{tutManager.form.id ? 'Edit Video' : 'Tambah Video'}</h3>
                            <div className="space-y-3">
                                <Input value={tutManager.form.title || ''} onChange={e => tutManager.setForm(p => ({...p, title: e.target.value}))} placeholder="Judul Video" className="text-xs"/>
                                <Input value={tutManager.form.video_url || ''} onChange={e => tutManager.setForm(p => ({...p, video_url: e.target.value}))} placeholder="https://youtube.com/..." className="text-xs"/>
                                <Button onClick={tutManager.handleSubmit} disabled={tutManager.loading} className="w-full text-xs py-2">{tutManager.loading ? <LoadingSpinner/> : 'Simpan Video'}</Button>
                                {tutManager.form.id ? <button onClick={() => tutManager.setForm({id:0, title:'', video_url:''})} className="w-full text-xs text-gray-500">Batal</button> : null}
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. FAQ MANAGER */}
                {activeTab === 'faq' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                        <div className="bg-brand-dark rounded-xl border border-white/5 p-4 overflow-y-auto custom-scrollbar">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Daftar FAQ</h4>
                            <div className="space-y-2">
                                {faqManager.faqs.map(f => (
                                    <div key={f.id} className="p-3 bg-brand-card rounded border border-white/5 group">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-xs font-bold text-white w-full">{f.question}</p>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                <button onClick={() => faqManager.setForm(f)} className="text-blue-400"><Edit size={14}/></button>
                                                <button onClick={() => faqManager.deleteItem(f.id)} className="text-red-400"><Trash2 size={14}/></button>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 line-clamp-2">{f.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-brand-dark rounded-xl border border-white/5 p-6 h-fit">
                            <h3 className="text-sm font-bold text-white mb-4">{faqManager.form.id ? 'Edit FAQ' : 'Tambah FAQ'}</h3>
                            <div className="space-y-3">
                                <Input value={faqManager.form.question || ''} onChange={e => faqManager.setForm(p => ({...p, question: e.target.value}))} placeholder="Pertanyaan (Q)" className="text-xs"/>
                                <TextArea value={faqManager.form.answer || ''} onChange={e => faqManager.setForm(p => ({...p, answer: e.target.value}))} placeholder="Jawaban (A)" className="h-24 text-xs"/>
                                <Button onClick={faqManager.handleSubmit} disabled={faqManager.loading} className="w-full text-xs py-2">{faqManager.loading ? <LoadingSpinner/> : 'Simpan FAQ'}</Button>
                                {faqManager.form.id ? <button onClick={() => faqManager.setForm({id:0, question:'', answer:''})} className="w-full text-xs text-gray-500">Batal</button> : null}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
