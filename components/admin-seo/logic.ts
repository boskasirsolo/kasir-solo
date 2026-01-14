
import { useState, useEffect, useMemo } from 'react';
import { supabase, slugify, callGeminiWithRotation } from '../../utils';
import { CityTarget, SEOFormState, CityType, AITargetSuggestion, SEOTemplate } from './types';

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
  
  // AI Suggestions State
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

  useEffect(() => {
    setPage(1);
  }, [searchTerm, activeTab]);

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

  const handleTemplateSubmit = async () => {
      if (!templateForm.title || !templateForm.prompt_structure) return alert("Lengkapi data template.");
      if (!supabase) return;
      setLoading(true);
      try {
          if (templateForm.id) {
              await supabase.from('seo_templates').update(templateForm).eq('id', templateForm.id);
              setTemplates(prev => prev.map(t => t.id === templateForm.id ? { ...t, ...templateForm } as SEOTemplate : t));
          } else {
              const { data } = await supabase.from('seo_templates').insert([{ title: templateForm.title, prompt_structure: templateForm.prompt_structure }]).select().single();
              if (data) setTemplates(prev => [data, ...prev]);
          }
          setTemplateForm({ id: 0, title: '', prompt_structure: '' });
      } catch (e) { alert("Gagal simpan template"); } finally { setLoading(false); }
  };

  const generateAITargets = async () => {
      if (!regionInput) return alert("Ketik wilayahnya dulu, Bos.");
      setGenLoading(true);
      setSuggestions([]);
      try {
          const existingNames = cities.map(c => c.name).join(', ');
          const prompt = `Role: SEO Specialist. Task: Cari 8 kota di "${regionInput}" selain [${existingNames}]. Output JSON Array: [{"name": "Kota", "slug": "slug", "type": "Kandang/Ekspansi", "reason": "..."}]`;
          const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
          setSuggestions(JSON.parse(res.text || '[]'));
      } catch (e: any) { alert(e.message); } finally { setGenLoading(false); }
  };

  const generateNarrative = async () => {
      if (!form.name) return alert("Isi nama kota dulu.");
      const selectedTpl = templates.find(t => t.id === form.template_id);
      if (!selectedTpl) return alert("Pilih Master Template dulu.");

      setIsGeneratingNarrative(true);
      try {
          const prompt = `
          Role: SEO Copywriter Mesin Kasir Solo. 
          Context: City: ${form.name}, Type: ${form.type}.
          Structure: ${selectedTpl.prompt_structure}
          Rules: Pake 'Gue/Lo', sebut 'PT Mesin Kasir Solo', sebut keunggulan di ${form.name}.
          Output: Narasi Markdown (max 3 paragraf). NO INTRO.
          `;
          const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
          setForm(prev => ({ ...prev, narrative: res.text || '' }));
      } catch (e) { alert("Gagal generate narasi."); } finally { setIsGeneratingNarrative(false); }
  };

  const publishAllSuggestions = async () => {
      if (suggestions.length === 0 || !supabase) return;
      setLoading(true);
      try {
          const payload = suggestions.map(s => ({ name: s.name, slug: s.slug, type: s.type }));
          const { data } = await supabase.from('target_cities').insert(payload).select();
          if (data) setCities(prev => [...data, ...prev]);
          setSuggestions([]); setRegionInput('');
          alert("Beres!");
      } catch (e: any) { alert(e.message); } finally { setLoading(false); }
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
    actions: { handleSubmit, handleTemplateSubmit, handleDelete: async (id: number) => { if(confirm("Hapus?")) { await supabase?.from('target_cities').delete().eq('id', id); setCities(p => p.filter(c => c.id !== id)); } }, handleEdit: (city: CityTarget) => { setForm({ id: city.id, name: city.name, type: city.type, narrative: city.narrative || '', template_id: city.template_id || 0 }); setShowMobileEditor(true); }, resetForm, openNewCity: () => { resetForm(); setShowMobileEditor(true); }, generateAITargets, publishAllSuggestions, generateNarrative }
  };
};
