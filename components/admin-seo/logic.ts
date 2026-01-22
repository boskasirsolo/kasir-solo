import { useState, useEffect, useMemo } from 'react';
import { supabase, slugify, callGeminiWithRotation } from '../../utils';
import { CityTarget, SEOFormState, CityType, AITargetSuggestion, SEOTemplate } from './types';
import { Researcher } from '../../services/ai/editor/research';

const ITEMS_PER_PAGE = 10;

export const useSEOLogic = () => {
  const [cities, setCities] = useState<CityTarget[]>([]);
  const [templates, setTemplates] = useState<SEOTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | CityType>('All');
  const [moduleSubTab, setModuleSubTab] = useState<'cities' | 'templates'>('cities');
  const [page, setPage] = useState(1);
  const [showMobileEditor, setShowMobileEditor] = useState(false);
  
  const [suggestions, setSuggestions] = useState<AITargetSuggestion[]>([]);
  const [regionInput, setRegionInput] = useState('');

  const [form, setForm] = useState<SEOFormState>({
    id: null,
    name: '',
    type: 'Ekspansi',
    narrative: '',
    template_id: 0
  });

  const [templateForm, setTemplateForm] = useState<Partial<SEOTemplate>>({
    id: 0,
    title: '',
    prompt_structure: ''
  });

  useEffect(() => {
    fetchCities();
    fetchTemplates();
  }, []);

  const fetchCities = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
        const { data } = await supabase.from('target_cities').select('*').order('created_at', { ascending: false });
        if (data) setCities(data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchTemplates = async () => {
    if (!supabase) return;
    const { data } = await supabase.from('seo_templates').select('*').order('created_at', { ascending: false });
    if (data) setTemplates(data);
  };

  const generateNarrative = async () => {
      if (!form.name) return alert("Isi nama kota dulu.");
      setIsGeneratingNarrative(true);
      
      try {
          // 1. Riset Keyword Lokal Dulu
          const keywords = await Researcher.researchLocalKeywords(form.name);
          
          // 2. Ambil Template
          const selectedTpl = templates.find(t => t.id === form.template_id);
          const basePrompt = selectedTpl?.prompt_structure || "Buat artikel penawaran mesin kasir yang persuasif.";

          const prompt = `
          Role: Senior SEO Copywriter PT Mesin Kasir Solo.
          Context: Target Kota "${form.name}", Tipe Strategi: "${form.type}".
          Keywords Wajib: ${keywords.join(', ')}.
          
          Instruksi Khusus:
          ${basePrompt}
          
          Gaya Bahasa: Street-smart Indonesia (Gue/Lo), jujur, ngebantu, bukan sales kaku.
          Output: Narasi Markdown (tanpa judul H1). Gunakan sub-heading H2/H3 yang menarik.
          `;

          const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
          setForm(prev => ({ ...prev, narrative: res.text || '' }));
      } catch (e: any) {
          alert("Gagal generate narasi: " + e.message);
      } finally {
          setIsGeneratingNarrative(false);
      }
  };

  const handleSubmit = async () => {
    if (!form.name) return alert("Nama Kota wajib diisi.");
    if (!supabase) return alert("Database belum terkoneksi.");

    setLoading(true);
    try {
      const generatedSlug = slugify(form.name);
      const payload = {
        name: form.name,
        slug: generatedSlug,
        type: form.type,
        narrative: form.narrative,
        template_id: form.template_id !== 0 ? form.template_id : null
      };

      if (form.id) {
        const { error } = await supabase.from('target_cities').update(payload).eq('id', form.id);
        if (error) throw error;
        setCities(prev => prev.map(c => c.id === form.id ? { ...c, ...payload } : c));
      } else {
        const { data, error } = await supabase.from('target_cities').insert([payload]).select().single();
        if (error) throw error;
        if (data) setCities(prev => [data, ...prev]);
      }

      resetForm();
    } catch (e: any) {
      alert("Gagal menyimpan: " + e.message);
    } finally { setLoading(false); }
  };

  // FIX: Added handleTemplateSubmit implementation to resolve scope error
  const handleTemplateSubmit = async () => {
    if (!templateForm.title || !templateForm.prompt_structure) return alert("Judul dan Struktur Prompt wajib diisi.");
    if (!supabase) return;

    setLoading(true);
    try {
        const payload = {
            title: templateForm.title,
            prompt_structure: templateForm.prompt_structure
        };

        if (templateForm.id && templateForm.id !== 0) {
            const { error } = await supabase.from('seo_templates').update(payload).eq('id', templateForm.id);
            if (error) throw error;
            setTemplates(prev => prev.map(t => t.id === templateForm.id ? { ...t, ...payload } : t));
            alert("Template berhasil diupdate!");
        } else {
            const { data, error } = await supabase.from('seo_templates').insert([payload]).select().single();
            if (error) throw error;
            if (data) {
                setTemplates(prev => [data, ...prev]);
                alert("Template berhasil ditambahkan!");
            }
        }
        
        setTemplateForm({ id: 0, title: '', prompt_structure: '' });
    } catch (e: any) {
        alert("Gagal simpan template: " + e.message);
    } finally {
        setLoading(false);
    }
  };

  // FIX: Added implementation for generateAITargets stub
  const generateAITargets = async () => {
      if (!regionInput) return alert("Isi wilayah dulu (misal: Jawa Tengah)");
      setGenLoading(true);
      try {
          const prompt = `
          Role: SEO Strategist for PT Mesin Kasir Solo.
          Task: Riset 4 kota/kabupaten paling potensial di wilayah "${regionInput}" untuk ekspansi jualan mesin kasir.
          Output: JSON Array of Objects with keys: "name", "slug", "type", "reason".
          "type" must be either "Kandang" (if very close to Solo) or "Ekspansi".
          `;
          const res = await callGeminiWithRotation({ 
              model: 'gemini-3-flash-preview', 
              contents: prompt,
              config: { responseMimeType: "application/json" }
          });
          setSuggestions(JSON.parse(res.text || '[]'));
      } catch (e: any) {
          alert("Gagal riset AI: " + e.message);
      } finally {
          setGenLoading(false);
      }
  };

  // FIX: Added implementation for publishAllSuggestions stub
  const publishAllSuggestions = async () => {
      if (suggestions.length === 0) return;
      if (!supabase) return;

      setLoading(true);
      try {
          const payloads = suggestions.map(s => ({
              name: s.name,
              slug: s.slug,
              type: s.type,
              narrative: ''
          }));

          const { data, error } = await supabase.from('target_cities').insert(payloads).select();
          if (error) throw error;
          
          if (data) {
              setCities(prev => [...data, ...prev]);
              setSuggestions([]);
              setRegionInput('');
              alert(`${data.length} kota berhasil diterbitkan!`);
          }
      } catch (e: any) {
          alert("Gagal menerbitkan: " + e.message);
      } finally {
          setLoading(false);
      }
  };

  const resetForm = () => {
    setForm({ id: null, name: '', type: 'Ekspansi', narrative: '', template_id: 0 });
    setShowMobileEditor(false);
  };

  const filteredCities = useMemo(() => {
      return cities.filter(c => {
          const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchTab = activeTab === 'All' || c.type === activeTab;
          return matchSearch && matchTab;
      });
  }, [cities, searchTerm, activeTab]);

  return {
    state: { 
        cities, templates, filteredCities: filteredCities.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE),
        loading, genLoading, isGeneratingNarrative, searchTerm, form, templateForm, showMobileEditor, activeTab, moduleSubTab, page,
        totalPages: Math.ceil(filteredCities.length / ITEMS_PER_PAGE), totalCount: filteredCities.length, suggestions, regionInput
    },
    setters: { setSearchTerm, setForm, setTemplateForm, setShowMobileEditor, setActiveTab, setPage, setRegionInput, setModuleSubTab },
    actions: { 
        handleSubmit, 
        generateNarrative, 
        handleTemplateSubmit, 
        handleDelete: async (id: number) => { if(confirm("Hapus?")) { await supabase?.from('target_cities').delete().eq('id', id); setCities(p => p.filter(c => c.id !== id)); } }, 
        handleEdit: (city: CityTarget) => { setForm({ id: city.id, name: city.name, type: city.type, narrative: city.narrative || '', template_id: city.template_id || 0 }); setShowMobileEditor(true); }, 
        resetForm, 
        openNewCity: () => { resetForm(); setShowMobileEditor(true); }, 
        generateAITargets, 
        publishAllSuggestions 
    }
  };
};