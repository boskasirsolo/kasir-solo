
import { useState, useEffect, useMemo } from 'react';
import { supabase, slugify } from '../../utils';
import { CityTarget, SEOFormState, CityType } from './types';

const ITEMS_PER_PAGE = 10;

export const useSEOLogic = () => {
  const [cities, setCities] = useState<CityTarget[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | CityType>('All');
  const [page, setPage] = useState(1);
  
  const [showMobileEditor, setShowMobileEditor] = useState(false);

  const [form, setForm] = useState<SEOFormState>({
    id: null,
    name: '',
    type: 'Ekspansi'
  });

  useEffect(() => {
    fetchCities();
  }, []);

  // Reset pagination when filter changes
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

  // --- FILTERING & PAGINATION LOGIC ---
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
        searchTerm, 
        form, 
        showMobileEditor,
        activeTab,
        page,
        totalPages,
        totalCount: filteredCities.length
    },
    setters: { setSearchTerm, setForm, setShowMobileEditor, setActiveTab, setPage },
    actions: { handleSubmit, handleDelete, handleEdit, resetForm, openNewCity }
  };
};
