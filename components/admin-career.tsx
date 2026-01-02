
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X as XIcon, Briefcase, MapPin, Search, CheckCircle2, Sparkles, Wand2, Users, Download, Eye, FileText, Calendar } from 'lucide-react';
import { JobOpening } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, callGeminiWithRotation, getSignedUrl } from '../utils';

// --- LOGIC: Job Manager Hook ---
const useJobManager = (jobs: JobOpening[], setJobs: any) => {
    // ... (Keep existing logic) ...
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
    const [aiLoading, setAiLoading] = useState({ desc: false, req: false });
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

    const generateJobContent = async (target: 'desc' | 'req') => {
        if (!form.title) return alert("Mohon isi 'Posisi / Judul' terlebih dahulu sebagai konteks AI.");
        setAiLoading(prev => ({ ...prev, [target]: true }));
        try {
            let prompt = "";
            if (target === 'desc') {
                prompt = `Bertindaklah sebagai HRD Manager profesional. Tugas: Buat deskripsi pekerjaan singkat (Job Description) yang menarik untuk posisi: "${form.title}". Divisi: ${form.division || "Umum"}. Tipe: ${form.type}. Bahasa: Indonesia. Tone: Profesional, Mengundang, dan Jelas. Output: HANYA teks deskripsi (maksimal 3 kalimat paragraf). Jangan pakai markdown bold/heading.`;
            } else {
                prompt = `Bertindaklah sebagai HRD Manager profesional. Tugas: Buat daftar Kualifikasi (Requirements) untuk posisi: "${form.title}". Divisi: ${form.division || "Umum"}. Bahasa: Indonesia. Output: Daftar poin-poin (bullet points) menggunakan tanda strip (-). Maksimal 5-7 poin kunci. HANYA listnya saja.`;
            }
            const response = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const text = response.text?.trim() || "";
            if (target === 'desc') setForm(prev => ({ ...prev, description: text }));
            else setForm(prev => ({ ...prev, requirements: text }));
        } catch (e: any) { alert(`Gagal generate AI: ${e.message}`); } 
        finally { setAiLoading(prev => ({ ...prev, [target]: false })); }
    };

    const handleSubmit = async () => {
        if (!form.title || !form.division) return alert("Mohon lengkapi Judul dan Divisi.");
        if (!supabase) return alert("Koneksi Database tidak ditemukan.");
        setLoading(true);
        try {
            const dbData = {
                title: form.title, division: form.division, type: form.type, location: form.location,
                description: form.description, requirements: form.requirements, is_active: form.is_active
            };
            if (form.id) {
                const { error } = await supabase.from('jobs').update(dbData).eq('id', form.id);
                if (error) throw error;
                setJobs((prev: JobOpening[]) => prev.map(j => j.id === form.id ? { ...j, ...dbData } : j));
                alert("Lowongan berhasil diperbarui!");
            } else {
                const { data, error } = await supabase.from('jobs').insert([dbData]).select().single();
                if (error) throw error;
                if (data) { setJobs((prev: JobOpening[]) => [data, ...prev]); alert("Lowongan berhasil diterbitkan!"); }
            }
            resetForm();
        } catch (e: any) { alert(`Gagal menyimpan: ${e.message}`); } 
        finally { setLoading(false); }
    };

    const deleteJob = async (id: number) => {
        if(!confirm("Yakin hapus lowongan ini?")) return;
        const previousJobs = [...jobs];
        setJobs((prev: JobOpening[]) => prev.filter(j => j.id !== id));
        if (supabase) {
            try { await supabase.from('jobs').delete().eq('id', id); } 
            catch (error: any) { console.error(error); alert("Gagal hapus DB"); setJobs(previousJobs); }
        }
        if (form.id === id) resetForm();
    };

    const filtered = jobs.filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return { form, setForm, loading, aiLoading, generateJobContent, handleSubmit, handleEditClick, resetForm, deleteJob, filtered, searchTerm, setSearchTerm };
};

// --- LOGIC: Applicant Manager Hook ---
const useApplicantManager = () => {
    const [applicants, setApplicants] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            // Fetch applicants sorted by newest
            const { data, error } = await supabase.from('applicants').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setApplicants(data || []);
        } catch (e) { console.error(e); } 
        finally { setLoading(false); }
    };

    const downloadCV = async (applicant: any) => {
        if (!supabase) return alert("Database not connected");
        setDownloadingId(applicant.id);
        
        try {
            // Get secure signed URL for the CV path
            // The cv_url column actually stores the PATH (e.g. "resumes/filename.pdf")
            const signedUrl = await getSignedUrl('careers', applicant.cv_url, 60); // 60s validity
            
            if (signedUrl) {
                window.open(signedUrl, '_blank');
            } else {
                alert("Gagal membuat link download. File mungkin sudah dihapus.");
            }
        } catch (e: any) {
            alert(`Error: ${e.message}`);
        } finally {
            setDownloadingId(null);
        }
    };

    const updateStatus = async (id: number, status: string) => {
        if (!supabase) return;
        try {
            await supabase.from('applicants').update({ status }).eq('id', id);
            setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
        } catch (e) { alert("Gagal update status"); }
    };

    return { applicants, loading, downloadCV, downloadingId, updateStatus, fetchApplicants };
};

// --- MAIN COMPONENT ---
export const AdminCareer = ({ jobs, setJobs }: { jobs: JobOpening[], setJobs: (j: JobOpening[]) => void }) => {
    const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');
    const jobManager = useJobManager(jobs, setJobs);
    const appManager = useApplicantManager();

    return (
        <div>
            {/* SUB-NAV */}
            <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-1">
                <button 
                    onClick={() => setActiveTab('jobs')}
                    className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'jobs' ? 'text-brand-orange border-brand-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                >
                    <div className="flex items-center gap-2"><Briefcase size={16}/> Lowongan Kerja</div>
                </button>
                <button 
                    onClick={() => setActiveTab('applicants')}
                    className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'applicants' ? 'text-brand-orange border-brand-orange' : 'text-gray-500 border-transparent hover:text-white'}`}
                >
                    <div className="flex items-center gap-2"><Users size={16}/> Data Pelamar</div>
                </button>
            </div>

            {/* CONTENT */}
            {activeTab === 'jobs' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LIST */}
                    <div className="lg:col-span-7 bg-brand-dark rounded-xl border border-white/5 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
                            <div className="relative flex-grow">
                                <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                                <input 
                                    type="text" 
                                    value={jobManager.searchTerm}
                                    onChange={(e) => jobManager.setSearchTerm(e.target.value)}
                                    placeholder="Cari lowongan..." 
                                    className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                                />
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Total: {jobManager.filtered.length}</span>
                        </div>

                        <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                            {jobManager.filtered.length === 0 && <p className="text-center text-gray-500 text-xs py-10">Belum ada lowongan aktif.</p>}
                            {jobManager.filtered.map(job => (
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
                                        <button type="button" onClick={() => jobManager.handleEditClick(job)} className="text-blue-400 hover:text-white p-1"><Edit size={14}/></button>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); jobManager.deleteJob(job.id); }} className="text-red-400 hover:text-white p-1"><Trash2 size={14}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FORM */}
                    <div className="lg:col-span-5 bg-brand-dark p-6 rounded-xl border border-white/5 sticky top-6">
                        {/* ... (Form Header) ... */}
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Briefcase size={18} className="text-brand-orange"/>
                                {jobManager.form.id ? "Edit Lowongan" : "Buat Lowongan"}
                            </h3>
                            {jobManager.form.id && (
                                <button type="button" onClick={jobManager.resetForm} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded"><XIcon size={12} /> Batal</button>
                            )}
                        </div>
                        {/* ... (Form Inputs - Simplified for brevity since it's same as before) ... */}
                        <div className="space-y-4">
                            <div><label className="text-xs text-gray-500 font-bold mb-1 block">Posisi</label><Input value={jobManager.form.title} onChange={e => jobManager.setForm({...jobManager.form, title: e.target.value})} className="py-2 text-sm"/></div>
                            <div className="grid grid-cols-2 gap-2">
                                <div><label className="text-xs text-gray-500 font-bold mb-1 block">Divisi</label><Input value={jobManager.form.division} onChange={e => jobManager.setForm({...jobManager.form, division: e.target.value})} className="py-2 text-sm"/></div>
                                <div>
                                    <label className="text-xs text-gray-500 font-bold mb-1 block">Tipe</label>
                                    <select value={jobManager.form.type} onChange={e => jobManager.setForm({...jobManager.form, type: e.target.value as any})} className="w-full bg-brand-card border border-white/10 rounded-lg px-3 py-2 text-sm text-white"><option>Full-time</option><option>Internship</option><option>Freelance</option></select>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1"><label className="text-xs text-gray-500 font-bold">Deskripsi</label><button onClick={() => jobManager.generateJobContent('desc')} disabled={jobManager.aiLoading.desc} className="text-[9px] text-blue-400 flex gap-1">{jobManager.aiLoading.desc ? <LoadingSpinner size={10}/> : <><Sparkles size={10}/> AI Generate</>}</button></div>
                                <TextArea value={jobManager.form.description} onChange={e => jobManager.setForm({...jobManager.form, description: e.target.value})} className="h-20 text-sm"/>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1"><label className="text-xs text-gray-500 font-bold">Requirement</label><button onClick={() => jobManager.generateJobContent('req')} disabled={jobManager.aiLoading.req} className="text-[9px] text-blue-400 flex gap-1">{jobManager.aiLoading.req ? <LoadingSpinner size={10}/> : <><Wand2 size={10}/> AI List</>}</button></div>
                                <TextArea value={jobManager.form.requirements} onChange={e => jobManager.setForm({...jobManager.form, requirements: e.target.value})} className="h-20 text-sm"/>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" checked={jobManager.form.is_active} onChange={e => jobManager.setForm({...jobManager.form, is_active: e.target.checked})} className="accent-brand-orange w-4 h-4"/>
                                <span className="text-sm text-gray-300">Status Aktif</span>
                            </div>
                            <Button onClick={jobManager.handleSubmit} disabled={jobManager.loading} className="w-full py-2.5 text-sm mt-2">{jobManager.loading ? <LoadingSpinner /> : <><Save size={16}/> Simpan</>}</Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-brand-dark border border-white/5 rounded-xl overflow-hidden">
                    {/* APPLICANT LIST HEADER */}
                    <div className="p-4 bg-black/20 border-b border-white/5 flex justify-between items-center">
                        <div>
                            <h4 className="text-white font-bold text-sm">Database Pelamar</h4>
                            <p className="text-xs text-gray-500">Privasi Terjamin: CV hanya bisa diakses oleh Admin.</p>
                        </div>
                        <button onClick={appManager.fetchApplicants} className="text-xs text-brand-orange hover:underline">Refresh Data</button>
                    </div>

                    {/* APPLICANT TABLE */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-white/5 text-gray-500 font-bold uppercase text-[10px]">
                                <tr>
                                    <th className="p-4">Tanggal</th>
                                    <th className="p-4">Nama Pelamar</th>
                                    <th className="p-4">Posisi</th>
                                    <th className="p-4">Kontak</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-right">CV / Resume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {appManager.loading ? (
                                    <tr><td colSpan={6} className="p-8 text-center"><LoadingSpinner /></td></tr>
                                ) : appManager.applicants.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-500 italic">Belum ada pelamar masuk.</td></tr>
                                ) : (
                                    appManager.applicants.map((app) => (
                                        <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4 whitespace-nowrap text-xs text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={12}/>
                                                    {new Date(app.created_at).toLocaleDateString('id-ID')}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-white">{app.full_name}</div>
                                                {app.portfolio_url && <a href={app.portfolio_url} target="_blank" className="text-[10px] text-blue-400 hover:underline truncate max-w-[150px] block">Link Portfolio</a>}
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-brand-orange/10 text-brand-orange px-2 py-1 rounded text-[10px] font-bold border border-brand-orange/20">
                                                    {app.position}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs">
                                                <div className="mb-1">{app.email}</div>
                                                <div className="text-gray-500">{app.phone}</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <select 
                                                    value={app.status || 'pending'}
                                                    onChange={(e) => appManager.updateStatus(app.id, e.target.value)}
                                                    className={`bg-black border border-white/10 text-[10px] rounded px-2 py-1 outline-none cursor-pointer ${
                                                        app.status === 'interview' ? 'text-blue-400 border-blue-500/30' :
                                                        app.status === 'rejected' ? 'text-red-400 border-red-500/30' :
                                                        'text-yellow-500 border-yellow-500/30'
                                                    }`}
                                                >
                                                    <option value="pending">Reviewing</option>
                                                    <option value="interview">Interview</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button 
                                                    onClick={() => appManager.downloadCV(app)}
                                                    disabled={appManager.downloadingId === app.id}
                                                    className="inline-flex items-center gap-2 bg-white/5 hover:bg-brand-orange hover:text-white text-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-white/10"
                                                >
                                                    {appManager.downloadingId === app.id ? <LoadingSpinner size={12}/> : <Download size={14} />}
                                                    Download CV
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
