
import { useState, useEffect } from 'react';
import { JobOpening } from '../../types';
import { supabase, getSignedUrl } from '../../utils';
import { JobFormState, JobAiLoading, Applicant } from './types';
import { HRAI } from '../../services/ai/hr'; // UPDATED

// --- JOB LOGIC ---
export const useJobLogic = (jobs: JobOpening[], setJobs: (j: JobOpening[]) => void) => {
    const [form, setForm] = useState<JobFormState>({
        id: null,
        title: '',
        division: '',
        type: 'Full-time',
        location: 'Solo (On-site)',
        description: '',
        requirements: '',
        is_active: true
    });

    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState<JobAiLoading>({ desc: false, req: false });
    const [searchTerm, setSearchTerm] = useState('');

    const resetForm = () => {
        setForm({
            id: null, title: '', division: '', type: 'Full-time', location: 'Solo (On-site)',
            description: '', requirements: '', is_active: true
        });
    };

    const handleEditClick = (job: JobOpening) => {
        setForm({ ...job, id: job.id });
    };

    // REFACTORED: Use HRAI
    const generateJobContent = async (target: 'desc' | 'req') => {
        if (!form.title) return alert("Mohon isi 'Posisi / Judul' terlebih dahulu sebagai konteks AI.");
        setAiLoading(prev => ({ ...prev, [target]: true }));
        try {
            let text = "";
            if (target === 'desc') {
                text = await HRAI.generateJobDesc(form.title, form.division || "Umum", form.type);
                setForm(prev => ({ ...prev, description: text }));
            } else {
                text = await HRAI.generateRequirements(form.title, form.division || "Umum");
                setForm(prev => ({ ...prev, requirements: text }));
            }
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
                setJobs(jobs.map(j => j.id === form.id ? { ...j, ...dbData } : j));
                alert("Lowongan berhasil diperbarui!");
            } else {
                const { data, error } = await supabase.from('jobs').insert([dbData]).select().single();
                if (error) throw error;
                if (data) { setJobs([data, ...jobs]); alert("Lowongan berhasil diterbitkan!"); }
            }
            resetForm();
        } catch (e: any) { alert(`Gagal menyimpan: ${e.message}`); } 
        finally { setLoading(false); }
    };

    const deleteJob = async (id: number) => {
        if(!confirm("Yakin hapus lowongan ini?")) return;
        setJobs(jobs.filter(j => j.id !== id));
        if (supabase) await supabase.from('jobs').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    const filteredJobs = jobs.filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return { 
        form, setForm, 
        loading, aiLoading, 
        listState: { filteredJobs, searchTerm, setSearchTerm },
        actions: { generateJobContent, handleSubmit, handleEditClick, resetForm, deleteJob } 
    };
};

// --- APPLICANT LOGIC ---
export const useApplicantLogic = () => {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(false);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    useEffect(() => { fetchApplicants(); }, []);

    const fetchApplicants = async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data, error } = await supabase.from('applicants').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setApplicants(data || []);
        } catch (e) { console.error(e); } 
        finally { setLoading(false); }
    };

    const downloadCV = async (applicant: Applicant) => {
        if (!supabase) return alert("Database not connected");
        setDownloadingId(applicant.id);
        
        try {
            const signedUrl = await getSignedUrl('careers', applicant.cv_url, 60);
            if (signedUrl) window.open(signedUrl, '_blank');
            else alert("Gagal membuat link download. File mungkin sudah dihapus.");
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
            setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: status as any } : a));
        } catch (e) { alert("Gagal update status"); }
    };

    return { applicants, loading, downloadCV, downloadingId, updateStatus, fetchApplicants };
};
