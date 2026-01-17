
import { useState, useEffect } from 'react';
import { supabase } from '../../../utils';
import { AIKnowledge, KnowledgeCategory } from './types';
import { SibosAI } from '../../../services/ai/sibos';

export const useTrainerLogic = () => {
    const [knowledge, setKnowledge] = useState<AIKnowledge[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Editor State
    const [form, setForm] = useState<Partial<AIKnowledge>>({
        category: 'pricing',
        title: '',
        content: '',
        is_active: true
    });

    // Sandbox State
    const [sandboxMessages, setSandboxMessages] = useState<any[]>([]);
    const [sandboxInput, setSandboxInput] = useState('');
    const [sandboxTyping, setSandboxTyping] = useState(false);

    useEffect(() => {
        fetchKnowledge();
    }, []);

    const fetchKnowledge = async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data } = await supabase.from('ai_knowledge').select('*').order('created_at', { ascending: false });
            if (data) setKnowledge(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSave = async () => {
        if (!form.title || !form.content) return alert("Lengkapi judul dan isi memorinya Bos.");
        if (!supabase) return;

        setSaving(true);
        try {
            if (form.id) {
                await supabase.from('ai_knowledge').update(form).eq('id', form.id);
                setKnowledge(prev => prev.map(k => k.id === form.id ? { ...k, ...form } as AIKnowledge : k));
            } else {
                const { data } = await supabase.from('ai_knowledge').insert([form]).select().single();
                if (data) setKnowledge([data, ...knowledge]);
            }
            alert("Memori berhasil disuntikkan ke otak Siboy!");
            setForm({ category: 'pricing', title: '', content: '', is_active: true });
        } catch (e: any) { alert("Gagal suntik memori: " + e.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus memori ini dari otak Siboy selamanya?")) return;
        if (!supabase) return;
        try {
            await supabase.from('ai_knowledge').delete().eq('id', id);
            setKnowledge(prev => prev.filter(k => k.id !== id));
            if (form.id === id) setForm({ category: 'pricing', title: '', content: '', is_active: true });
        } catch (e) { alert("Gagal hapus."); }
    };

    const testInSandbox = async () => {
        if (!sandboxInput.trim() || sandboxTyping) return;
        const msg = sandboxInput;
        setSandboxInput('');
        setSandboxMessages(prev => [...prev, { role: 'user', text: msg }]);
        setSandboxTyping(true);

        try {
            // Kita pake logic SibosAI asli buat ngetes
            // Sandbox selalu pake mode admin biar fiturnya lengkap
            const response = await SibosAI.chat([], msg, true);
            setSandboxMessages(prev => [...prev, { role: 'assistant', text: response }]);
        } catch (e: any) {
            setSandboxMessages(prev => [...prev, { role: 'assistant', text: "ERROR: " + e.message }]);
        } finally {
            setSandboxTyping(false);
        }
    };

    return {
        state: { knowledge, loading, saving, form, sandboxMessages, sandboxInput, sandboxTyping },
        actions: { setForm, handleSave, handleDelete, setSandboxInput, testInSandbox, clearSandbox: () => setSandboxMessages([]) }
    };
};
