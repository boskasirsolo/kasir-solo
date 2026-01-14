
import { useState, useEffect, useMemo } from 'react';
import { supabase, slugify, callGeminiWithRotation } from '../../utils';
import { CityTarget, SEOFormState, CityType, AITargetSuggestion } from './types';

const ITEMS_PER_PAGE = 10;

export const useSEOLogic = () => {
  const [cities, setCities] = useState<CityTarget[]>([]);
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | CityType>('All');
  const [page, setPage] = useState(1);
  const [showMobileEditor, setShowMobileEditor] = useState(false);
  
  // AI Suggestions State
  const [suggestions, setSuggestions] = useState<AITargetSuggestion[]>([]);
  const [regionInput, setRegionInput] = useState('');

  const [form, setForm] = useState<SEOFormState>({
    id: null,
    name: '',
    type: 'Ekspansi'
  });

  useEffect(() => {
    fetchCities();
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
    } catch (e) {
        console.error("Fetch Error", e);
    } finally {
        setLoading(false);
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
        type: form.type
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
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus target kota ini? Halaman SEO-nya bakal hilang.")) return;
    if (!supabase) return;
    
    try {
        await supabase.from('target_cities').delete().eq('id', id);
        setCities(prev => prev.filter(c => c.id !== id));
        if (form.id === id) resetForm();
    } catch (e) {
        alert("Gagal hapus data");
    }
  };

  const generateAITargets = async () => {
      if (!regionInput) return alert("Ketik wilayahnya dulu, Bos. Misal: 'Jawa Timur' atau 'Soloraya'");
      setGenLoading(true);
      setSuggestions([]);
      
      try {
          const existingNames = cities.map(c => c.name).join(', ');
          const prompt = `
          Role: SEO Specialist PT Mesin Kasir Solo.
          Task: Cari 8 kota/kabupaten di wilayah "${regionInput}" yang potensial untuk jualan Mesin Kasir (POS).
          
          Aturan:
          1. JANGAN pilih kota yang sudah ada di list ini: [${existingNames}].
          2. Strategy 'Kandang' HANYA untuk area Solo Raya (Solo, Sukoharjo, Klaten, Boyolali, Karanganyar, Sragen, Wonogiri).
          3. Selain Solo Raya, wajib strategy 'Ekspansi'.
          4. Output wajib JSON Array of objects: [{"name": "Nama Kota", "slug": "slug-kota", "type": "Kandang/Ekspansi", "reason": "Alasan singkat"}]
          `;

          const res = await callGeminiWithRotation({
              model: 'gemini-3-flash-preview',
              contents: prompt,
              config: { responseMimeType: "application/json" }
          });

          const data = JSON.parse(res.text || '[]');
          setSuggestions(data);
      } catch (e: any) {
          alert("Gagal riset wilayah: " + e.message);
      } finally {
          setGenLoading(false);
      }
  };

  const publishAllSuggestions = async () => {
      if (suggestions.length === 0 || !supabase) return;
      setLoading(true);
      try {
          const payload = suggestions.map(s => ({
              name: s.name,
              slug: s.slug,
              type: s.type
          }));

          const { data, error } = await supabase.from('target_cities').insert(payload).select();
          if (error) throw error;
          
          if (data) setCities(prev => [...data, ...prev]);
          setSuggestions([]);
          setRegionInput('');
          alert(`Beres! ${data.length} halaman SEO baru berhasil diterbitkan.`);
      } catch (e: any) {
          alert("Gagal menerbitkan: " + e.message);
      } finally {
          setLoading(false);
      }
  };

  const handleEdit = (city: CityTarget) => {
      setForm({ id: city.id, name: city.name, type: city.type });
      setShowMobileEditor(true);
  };

  const openNewCity = () => {
      resetForm();
      setShowMobileEditor(true);
  };

  const resetForm = () => {
    setForm({ id: null, name: '', type: 'Ekspansi' });
    setShowMobileEditor(false);
  };

  const filteredCities = useMemo(() => {
      return cities.filter(c => {
          const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchTab = activeTab === 'All' || c.type === activeTab;
          return matchSearch && matchTab;
      });
  }, [cities, searchTerm, activeTab]);

  const totalPages = Math.ceil(filteredCities.length / ITEMS_PER_PAGE);
  const paginatedCities = filteredCities.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return {
    state: { 
        cities, 
        filteredCities: paginatedCities, 
        loading, 
        genLoading,
        searchTerm, 
        form, 
        showMobileEditor,
        activeTab,
        page,
        totalPages,
        totalCount: filteredCities.length,
        suggestions,
        regionInput
    },
    setters: { setSearchTerm, setForm, setShowMobileEditor, setActiveTab, setPage, setRegionInput },
    actions: { handleSubmit, handleDelete, handleEdit, resetForm, openNewCity, generateAITargets, publishAllSuggestions }
  };
};
