
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X as XIcon, Search, UploadCloud, FileText, Link as LinkIcon, HardDrive } from 'lucide-react';
import { DownloadItem } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, uploadToSupabase, renameFile, slugify } from '../utils';

const ITEMS_PER_PAGE = 6;

// --- LOGIC: Custom Hook ---
const useDownloadManager = () => {
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    const [form, setForm] = useState<Partial<DownloadItem>>({
        id: '',
        title: '',
        category: 'driver',
        description: '',
        file_url: '',
        version: '',
        file_size: '',
        os_support: 'Windows'
    });
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchDownloads();
    }, []);

    const fetchDownloads = async () => {
        if (!supabase) return;
        const { data, error } = await supabase
            .from('downloads')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (data) setDownloads(data);
    };

    const resetForm = () => {
        setForm({
            id: '',
            title: '',
            category: 'driver',
            description: '',
            file_url: '',
            version: '',
            file_size: '',
            os_support: 'Windows'
        });
        setUploadFile(null);
    };

    const handleEditClick = (item: DownloadItem) => {
        setForm(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        if (!form.title || !form.category) return alert("Judul dan Kategori wajib diisi.");
        
        setLoading(true);
        try {
            let finalFileUrl = form.file_url;

            // Handle File Upload if exists
            if (uploadFile) {
                // Determine bucket based on file type roughly, or just use a generic 'downloads' or 'public' folder
                const seoName = `${slugify(form.title || 'download')}-${slugify(form.version || 'v1')}`;
                const fileToUpload = renameFile(uploadFile, seoName);
                
                // Upload to 'files' folder in 'downloads' bucket (Specific Bucket created by User)
                if (supabase) {
                    // Param 1: File, Param 2: Folder, Param 3: Bucket Name
                    const { url } = await uploadToSupabase(fileToUpload, 'files', 'downloads');
                    finalFileUrl = url;
                    
                    // Auto-set size if empty
                    if (!form.file_size) {
                        const sizeInMB = (uploadFile.size / (1024 * 1024)).toFixed(1);
                        form.file_size = `${sizeInMB} MB`;
                    }
                }
            }

            const dbData = {
                title: form.title,
                category: form.category,
                description: form.description,
                file_url: finalFileUrl,
                version: form.version,
                file_size: form.file_size,
                os_support: form.os_support,
                updated_at: new Date().toISOString()
            };

            if (form.id) {
                if (supabase) await supabase.from('downloads').update(dbData).eq('id', form.id);
                setDownloads(prev => prev.map(item => item.id === form.id ? { ...item, ...dbData } as DownloadItem : item));
            } else {
                if (supabase) {
                    const { data } = await supabase.from('downloads').insert([dbData]).select().single();
                    if (data) setDownloads(prev => [data, ...prev]);
                } else {
                    // Demo mode fallback
                    const newId = Date.now().toString();
                    setDownloads(prev => [{ ...dbData, id: newId } as DownloadItem, ...prev]);
                }
            }
            resetForm();
            alert("Data berhasil disimpan!");
        } catch (e: any) {
            console.error(e);
            alert(`Gagal menyimpan: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id: string) => {
        if(!confirm("Hapus file ini?")) return;
        if (supabase) await supabase.from('downloads').delete().eq('id', id);
        setDownloads(prev => prev.filter(item => item.id !== id));
        if (form.id === id) resetForm();
    };

    const filtered = downloads.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return {
        form, setForm, uploadFile, setUploadFile,
        loading, handleSubmit, handleEditClick, resetForm, deleteItem,
        listData: { paginated, totalPages, page, setPage, searchTerm, setSearchTerm, totalItems: filtered.length }
    };
};

export const AdminDownloads = () => {
    const { form, setForm, uploadFile, setUploadFile, loading, handleSubmit, handleEditClick, resetForm, deleteItem, listData } = useDownloadManager();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: LIST VIEW (7 Col) */}
            <div className="lg:col-span-7 bg-brand-dark rounded-xl border border-white/5 flex flex-col overflow-hidden h-[600px]">
                <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
                    <div className="relative flex-grow">
                        <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                        <input 
                            type="text" 
                            value={listData.searchTerm}
                            onChange={(e) => listData.setSearchTerm(e.target.value)}
                            placeholder="Cari file..." 
                            className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                        />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Total: {listData.totalItems}</span>
                </div>

                <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-3">
                    {listData.paginated.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 text-xs">Belum ada file download.</div>
                    ) : (
                        listData.paginated.map((item) => (
                            <div key={item.id} className="bg-brand-card border border-white/5 rounded-lg p-3 flex gap-3 hover:border-brand-orange/50 transition-all group">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-white/10 ${
                                    item.category === 'driver' ? 'bg-blue-500/10 text-blue-400' : 
                                    item.category === 'manual' ? 'bg-yellow-500/10 text-yellow-400' : 
                                    'bg-green-500/10 text-green-400'
                                }`}>
                                    <HardDrive size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                                    <div className="flex gap-2 text-[10px] text-gray-500 mt-1">
                                        <span className="bg-white/5 px-1.5 rounded">{item.category}</span>
                                        <span>v{item.version}</span>
                                        <span>{item.file_size}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEditClick(item)} className="p-1 hover:bg-white/10 rounded text-blue-400"><Edit size={14}/></button>
                                    <button onClick={() => deleteItem(item.id)} className="p-1 hover:bg-white/10 rounded text-red-400"><Trash2 size={14}/></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT: EDITOR FORM (5 Col) */}
            <div className="lg:col-span-5 bg-brand-dark p-6 rounded-xl border border-white/5 sticky top-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {form.id ? <Edit size={18} className="text-brand-orange"/> : <Plus size={18} className="text-brand-orange"/>}
                        {form.id ? "Edit File" : "Upload File Baru"}
                    </h3>
                    {form.id && (
                        <button onClick={resetForm} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded">
                            <XIcon size={12} /> Batal
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Judul File</label>
                        <Input value={form.title || ''} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Contoh: Driver Printer XPrinter XP-58" className="py-2 text-sm"/>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Kategori</label>
                            <select 
                                value={form.category} 
                                onChange={e => setForm(p => ({...p, category: e.target.value as any}))}
                                className="w-full bg-brand-card border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-orange outline-none"
                            >
                                <option value="driver">Driver</option>
                                <option value="manual">Manual Book</option>
                                <option value="software">Software / App</option>
                                <option value="tools">Tools</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">OS Support</label>
                            <select 
                                value={form.os_support} 
                                onChange={e => setForm(p => ({...p, os_support: e.target.value as any}))}
                                className="w-full bg-brand-card border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-orange outline-none"
                            >
                                <option value="Windows">Windows</option>
                                <option value="Android">Android</option>
                                <option value="iOS">iOS</option>
                                <option value="All">All OS</option>
                            </select>
                        </div>
                    </div>

                    {/* FILE SOURCE SELECTION */}
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-2 block">Source File</label>
                        
                        {/* Tab-like Toggle */}
                        <div className="flex gap-2 mb-2">
                            <label className={`flex-1 cursor-pointer p-3 rounded-lg border text-center transition-all ${uploadFile ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'}`}>
                                <input type="file" className="hidden" onChange={e => {
                                    if(e.target.files?.[0]) {
                                        setUploadFile(e.target.files[0]);
                                        setForm(p => ({...p, file_url: ''})); // Clear external URL if upload selected
                                    }
                                }} />
                                <div className="flex flex-col items-center gap-1">
                                    <UploadCloud size={16} />
                                    <span className="text-[10px] font-bold">{uploadFile ? uploadFile.name : "Upload File"}</span>
                                </div>
                            </label>
                            
                            <div className="flex items-center justify-center text-gray-600 font-bold text-xs">OR</div>

                            <div className={`flex-1 p-2 rounded-lg border transition-all ${form.file_url && !uploadFile ? 'bg-blue-500/10 border-blue-500' : 'bg-black/20 border-white/10'}`}>
                                <div className="flex items-center gap-2 mb-1 text-gray-400 px-1">
                                    <LinkIcon size={12} /> <span className="text-[10px] font-bold">Link Eksternal</span>
                                </div>
                                <input 
                                    value={form.file_url || ''} 
                                    onChange={e => {
                                        setForm(p => ({...p, file_url: e.target.value}));
                                        setUploadFile(null); // Clear upload if URL typed
                                    }}
                                    placeholder="https://drive.google.com/..." 
                                    className="w-full bg-transparent text-xs text-white outline-none placeholder-gray-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Versi</label>
                            <Input value={form.version || ''} onChange={e => setForm(p => ({...p, version: e.target.value}))} placeholder="v1.0" className="py-2 text-sm"/>
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Ukuran (Optional)</label>
                            <Input value={form.file_size || ''} onChange={e => setForm(p => ({...p, file_size: e.target.value}))} placeholder="15 MB" className="py-2 text-sm"/>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Deskripsi Singkat</label>
                        <TextArea value={form.description || ''} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder="Keterangan file..." className="h-20 text-sm"/>
                    </div>

                    <Button onClick={handleSubmit} disabled={loading} className="w-full py-3 text-sm shadow-neon">
                        {loading ? <LoadingSpinner /> : (form.id ? <><Save size={16}/> Simpan Perubahan</> : <><Plus size={16}/> Upload File</>)}
                    </Button>
                </div>
            </div>

        </div>
    );
};
