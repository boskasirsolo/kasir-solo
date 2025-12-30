
import React, { useState } from 'react';
import { Plus, Trash2, Edit, Save, X as XIcon, Briefcase, MapPin, Search, CheckCircle2 } from 'lucide-react';
import { JobOpening } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase } from '../utils';

const ITEMS_PER_PAGE = 6;

const useJobManager = (jobs: JobOpening[], setJobs: any) => {
    const [form, setForm] = useState({
        id: null as number | null,
        title: '',
        division: '',
        type: 'Full-time' as 'Full-time' | 'Internship' | 'Freelance',
        location: 'Solo (On-site)',
        description: '',
        requirements: '',
        is_active: true
    });

    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const resetForm = () => {
        setForm({
            id: null,
            title: '',
            division: '',
            type: 'Full-time',
            location: 'Solo (On-site)',
            description: '',
            requirements: '',
            is_active: true
        });
    };

    const handleEditClick = (job: JobOpening) => {
        setForm({ ...job, id: job.id });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        if (!form.title || !form.division) return alert("Mohon lengkapi Judul dan Divisi.");
        if (!supabase) return alert("Koneksi Database tidak ditemukan.");

        setLoading(true);
        try {
            const dbData = {
                title: form.title,
                division: form.division,
                type: form.type,
                location: form.location,
                description: form.description,
                requirements: form.requirements,
                is_active: form.is_active
            };

            if (form.id) {
                // --- UPDATE MODE ---
                const { error } = await supabase
                    .from('jobs')
                    .update(dbData)
                    .eq('id', form.id);

                if (error) throw error;

                // Update State Lokal
                setJobs((prev: JobOpening[]) => prev.map(j => j.id === form.id ? { ...j, ...dbData } : j));
                alert("Lowongan berhasil diperbarui! (Langsung live)");
            } else {
                // --- CREATE MODE ---
                const { data, error } = await supabase
                    .from('jobs')
                    .insert([dbData])
                    .select()
                    .single();

                if (error) throw error;

                if (data) {
                    setJobs((prev: JobOpening[]) => [data, ...prev]);
                    alert("Lowongan berhasil diterbitkan! (Langsung live)");
                }
            }
            resetForm();
        } catch (e: any) { 
            console.error("Submit Error:", e); 
            alert(`Gagal menyimpan: ${e.message}`); 
        } finally { 
            setLoading(false); 
        }
    };

    const deleteJob = async (id: number) => {
        if(!confirm("Yakin hapus lowongan ini? Data akan hilang permanen.")) return;
        
        // 1. Backup state
        const previousJobs = [...jobs];

        // 2. Optimistic Update
        setJobs((prev: JobOpening[]) => prev.filter(j => j.id !== id));

        // 3. Hapus dari Database
        if (supabase) {
            try {
                const { error } = await supabase.from('jobs').delete().eq('id', id);
                if (error) throw error;
            } catch (error: any) {
                console.error("Delete Error:", error);
                alert(`Gagal menghapus dari database: ${error.message}`);
                // Rollback jika gagal
                setJobs(previousJobs);
            }
        }

        if (form.id === id) resetForm();
    };

    const filtered = jobs.filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return { form, setForm, loading, handleSubmit, handleEditClick, resetForm, deleteJob, filtered, searchTerm, setSearchTerm };
};

export const AdminCareer = ({ jobs, setJobs }: { jobs: JobOpening[], setJobs: (j: JobOpening[]) => void }) => {
    const { form, setForm, loading, handleSubmit, handleEditClick, resetForm, deleteJob, filtered, searchTerm, setSearchTerm } = useJobManager(jobs, setJobs);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LIST */}
            <div className="lg:col-span-7 bg-brand-dark rounded-xl border border-white/5 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
                    <div className="relative flex-grow">
                        <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari lowongan..." 
                            className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                        />
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Total: {filtered.length}</span>
                </div>

                <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {filtered.length === 0 && <p className="text-center text-gray-500 text-xs py-10">Belum ada lowongan aktif.</p>}
                    {filtered.map(job => (
                        <div key={job.id} className="bg-brand-card p-4 rounded-lg border border-white/5 flex justify-between items-start group hover:border-brand-orange/30 transition-colors">
                            <div>
                                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                    {job.title}
                                    {!job.is_active && <span className="text-[9px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded">CLOSED</span>}
                                </h4>
                                <div className="flex gap-3 text-xs text-gray-400 mt-1">
                                    <span>{job.division}</span>
                                    <span>•</span>
                                    <span>{job.type}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => handleEditClick(job)} className="text-blue-400 hover:text-white p-1"><Edit size={14}/></button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); deleteJob(job.id); }} className="text-red-400 hover:text-white p-1"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FORM */}
            <div className="lg:col-span-5 bg-brand-dark p-6 rounded-xl border border-white/5 sticky top-6">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Briefcase size={18} className="text-brand-orange"/>
                        {form.id ? "Edit Lowongan" : "Buat Lowongan"}
                    </h3>
                    {form.id && (
                        <button type="button" onClick={resetForm} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded">
                            <XIcon size={12} /> Batal
                        </button>
                    )}
                </div>

                <div className="bg-blue-500/5 border border-blue-500/20 p-3 rounded-lg mb-4 flex gap-2 items-start">
                    <CheckCircle2 size={14} className="text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-gray-300">
                        Data lowongan tersimpan <strong>otomatis & langsung</strong> ke database saat tombol simpan ditekan. Tidak perlu menekan tombol 'Simpan Pengaturan' di menu lain.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Posisi / Judul</label>
                        <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Contoh: Social Media Specialist" className="py-2 text-sm"/>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Divisi</label>
                            <Input value={form.division} onChange={e => setForm({...form, division: e.target.value})} placeholder="Marketing" className="py-2 text-sm"/>
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Tipe</label>
                            <select 
                                value={form.type} 
                                onChange={e => setForm({...form, type: e.target.value as any})}
                                className="w-full bg-brand-card border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-orange outline-none"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Lokasi</label>
                        <div className="relative">
                            <MapPin size={14} className="absolute left-3 top-2.5 text-gray-500"/>
                            <Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="pl-9 py-2 text-sm"/>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Deskripsi Singkat</label>
                        <TextArea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="h-20 text-sm" placeholder="Gambaran umum pekerjaan..."/>
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Kualifikasi (Poin-poin)</label>
                        <TextArea value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} className="h-32 text-sm" placeholder="- Poin 1&#10;- Poin 2&#10;- Poin 3"/>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="accent-brand-orange w-4 h-4"/>
                        <span className="text-sm text-gray-300">Status Aktif (Ditampilkan di Website)</span>
                    </div>

                    <Button onClick={handleSubmit} disabled={loading} className="w-full py-2.5 text-sm mt-2">
                        {loading ? <LoadingSpinner /> : (form.id ? <><Save size={16}/> Update & Publish</> : <><Plus size={16}/> Publish Sekarang</>)}
                    </Button>
                </div>
            </div>
        </div>
    );
};
