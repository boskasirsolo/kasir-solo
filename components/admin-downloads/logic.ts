
import { useState, useEffect } from 'react';
import { supabase, uploadToSupabase, renameFile, slugify, callGeminiWithRotation } from '../../utils';
import { DownloadItem, Tutorial, FAQ } from '../../types';
import { DownloadFormState, ResearchResult } from './types';
import { parseVolume } from './utils';

// --- DOWNLOAD LOGIC ---
export const useDownloadLogic = () => {
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    
    const [form, setForm] = useState<DownloadFormState>({
        id: '', title: '', category: 'driver', description: '', file_url: '', version: '', file_size: '', os_support: 'Windows'
    });
    
    const [contextInput, setContextInput] = useState('');
    const [generatedTitles, setGeneratedTitles] = useState<ResearchResult[]>([]);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState({ research: false, desc: false });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 8; 

    useEffect(() => { fetchDownloads(); }, []);

    const fetchDownloads = async () => {
        if (!supabase) return;
        const { data } = await supabase.from('downloads').select('*').order('created_at', { ascending: false });
        if (data) setDownloads(data);
    };

    const resetForm = () => {
        setForm({ id: '', title: '', category: 'driver', description: '', file_url: '', version: '', file_size: '', os_support: 'Windows' });
        setUploadFile(null);
        setContextInput('');
        setGeneratedTitles([]);
    };

    const handleEditClick = (item: DownloadItem) => { 
        setForm(item as unknown as DownloadFormState); 
        setContextInput(item.title);
        setGeneratedTitles([]);
        if (window.innerWidth < 1024) window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const researchTitles = async () => {
        if (!contextInput) return alert("Isi 'Konteks Produk' dulu.");
        setAiLoading(p => ({...p, research: true}));
        setGeneratedTitles([]);

        try {
            const prompt = `
            Role: SEO Specialist for Technical Support (Drivers, Manuals, Software).
            Context: User wants to upload a file regarding "${contextInput}".
            Category: ${form.category}.
            Task: Generate 5 High-Potential Long-tail Keyword Titles.
            Metrics Requirement: Estimate Monthly Search Volume (Indonesia) & Competition.
            Format: JSON Array of Objects. Example: [{"title": "Driver Epson L3210 Windows 10", "volume": "1.2k/mo", "competition": "Low"}].
            Output: JUST the JSON Array.
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
            const rawTitles: ResearchResult[] = JSON.parse(res.text || '[]');
            const sortedTitles = rawTitles.sort((a, b) => parseVolume(b.volume) - parseVolume(a.volume));
            setGeneratedTitles(sortedTitles);
        } catch (e) { alert("Gagal riset judul."); } 
        finally { setAiLoading(p => ({...p, research: false})); }
    };

    const generateDescription = async () => {
        const trigger = form.title || contextInput;
        if (!trigger) return alert("Pilih Judul atau isi Konteks dulu.");
        setAiLoading(p => ({...p, desc: true}));
        try {
            const prompt = `
            Role: UX Writer. Task: Write a file description for: "${trigger}". Category: ${form.category}.
            Guidelines: Focus on User Intent. Mention OS compatibility. No intro/outro. 2-3 sentences. Indonesian.
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setForm(prev => ({ ...prev, description: res.text?.trim() || '' }));
        } catch (e) { alert("Gagal generate deskripsi."); } 
        finally { setAiLoading(p => ({...p, desc: false})); }
    };

    const handleSubmit = async () => {
        if (!form.title || !form.category) return alert("Judul dan Kategori wajib diisi.");
        setLoading(true);
        try {
            let finalFileUrl = form.file_url;
            let finalFileSize = form.file_size;

            if (uploadFile && supabase) {
                const safeName = slugify(form.title || 'download-file').substring(0, 50);
                const fileToUpload = renameFile(uploadFile, safeName);
                const { url } = await uploadToSupabase(fileToUpload, 'files', 'downloads');
                finalFileUrl = url;
                const sizeInMB = (uploadFile.size / (1024 * 1024)).toFixed(1);
                finalFileSize = `${sizeInMB} MB`;
            }

            const dbData: any = {
                title: form.title,
                category: form.category,
                description: form.description,
                file_url: finalFileUrl,
                file_size: finalFileSize || 'Unknown',
                version: form.version || 'Latest',
                os_support: form.os_support || 'Windows',
                updated_at: new Date().toISOString()
            };

            if (form.id) {
                if (supabase) await supabase.from('downloads').update(dbData).eq('id', form.id);
                setDownloads(prev => prev.map(item => item.id === form.id ? { ...item, ...dbData, id: form.id } as DownloadItem : item));
            } else {
                if (supabase) {
                    const { data, error } = await supabase.from('downloads').insert([dbData]).select().single();
                    if (error) throw error;
                    if (data) setDownloads(prev => [data, ...prev]);
                }
            }
            resetForm();
            alert("File berhasil disimpan!");
        } catch (e: any) { alert(`Error: ${e.message}`); } 
        finally { setLoading(false); }
    };

    const deleteItem = async (id: string) => {
        if(!confirm("Hapus file?")) return;
        if (supabase) await supabase.from('downloads').delete().eq('id', id);
        setDownloads(prev => prev.filter(item => item.id !== id));
        if (form.id === id) resetForm();
    };

    // CRASH FIX: Ensure title exists before toLowerCase()
    const filtered = downloads.filter(item => (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return { 
        form, setForm, 
        contextInput, setContextInput, 
        generatedTitles, setGeneratedTitles, 
        uploadFile, setUploadFile, 
        loading, aiLoading, 
        
        // Grouped Actions for UI compatibility
        actions: {
            researchTitles, 
            generateDescription, 
            handleSubmit, 
            handleEditClick, 
            resetForm, 
            deleteItem,
            setGeneratedTitles
        },
        
        // Grouped State for List UI
        listState: { 
            paginated, 
            totalPages, 
            page, 
            setPage, 
            searchTerm, 
            setSearchTerm, 
            totalItems: filtered.length 
        } 
    };
};

// --- TUTORIAL LOGIC ---
export const useTutorialLogic = () => {
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [form, setForm] = useState<Partial<Tutorial>>({ id: 0, title: '', video_url: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => { 
        if(supabase) supabase.from('tutorials').select('*').order('created_at', {ascending: false}).then(({data}) => { if(data) setTutorials(data); });
    }, []);

    const handleSubmit = async () => {
        if(!form.title) return alert("Isi Judul");
        setLoading(true);
        if(form.id) {
            if(supabase) await supabase.from('tutorials').update(form).eq('id', form.id);
            setTutorials(p => p.map(x => x.id === form.id ? {...x, ...form} as Tutorial : x));
        } else {
            if(supabase) {
                const {data} = await supabase.from('tutorials').insert([form]).select().single();
                if(data) setTutorials(p => [data, ...p]);
            }
        }
        setLoading(false); setForm({id:0, title:'', video_url:''});
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus?")) return;
        if(supabase) await supabase.from('tutorials').delete().eq('id', id);
        setTutorials(p => p.filter(x => x.id !== id));
    };

    return { tutorials, form, setForm, loading, handleSubmit, deleteItem };
};

// --- FAQ LOGIC ---
export const useFaqLogic = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [form, setForm] = useState<Partial<FAQ>>({ id: 0, question: '', answer: '' });
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => { 
        if(supabase) supabase.from('faqs').select('*').order('created_at', {ascending: false}).then(({data}) => { if(data) setFaqs(data); });
    }, []);

    const handleSubmit = async () => {
        if(!form.question) return alert("Isi Pertanyaan");
        setLoading(true);
        try {
            if(form.id) {
                if(supabase) await supabase.from('faqs').update(form).eq('id', form.id);
                setFaqs(p => p.map(x => x.id === form.id ? {...x, ...form} as FAQ : x));
            } else {
                if(supabase) {
                    const {data} = await supabase.from('faqs').insert([form]).select().single();
                    if(data) setFaqs(p => [data, ...p]);
                }
            }
            setForm({id:0, question:'', answer:''});
        } catch (e) { alert("Error saving FAQ"); } 
        finally { setLoading(false); }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus?")) return;
        if(supabase) await supabase.from('faqs').delete().eq('id', id);
        setFaqs(p => p.filter(x => x.id !== id));
    };

    const generateAnswer = async () => {
        if (!form.question) return alert("Isi Pertanyaan (Q) dulu.");
        setIsGenerating(true);
        try {
            const prompt = `Role: Support Agent. Task: Answer FAQ "${form.question}". Product: POS System (Hardware/Software). Lang: ID. Tone: Helpful. Length: 2-3 sentences.`;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setForm(prev => ({ ...prev, answer: res.text?.trim() || '' }));
        } catch (e) { alert("Gagal generate."); } 
        finally { setIsGenerating(false); }
    };

    return { faqs, form, setForm, loading, handleSubmit, deleteItem, generateAnswer, isGenerating };
};
