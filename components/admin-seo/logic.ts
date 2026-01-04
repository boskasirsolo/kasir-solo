
import { useState, useEffect, useMemo } from 'react';
import { supabase, slugify } from '../../utils';
import { CityTarget, SEOFormState, CityType } from './types';

export const useSEOLogic = () => {
  const [cities, setCities] = useState<CityTarget[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [form, setForm] = useState<SEOFormState>({
    id: null,
    name: '',
    type: 'Ekspansi'
  });

  useEffect(() => {
    fetchCities();
  }, []);

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
        // Edit Mode
        const { error } = await supabase.from('target_cities').update(payload).eq('id', form.id);
        if (error) throw error;
        setCities(prev => prev.map(c => c.id === form.id ? { ...c, ...payload } : c));
      } else {
        // Create Mode
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
  };

  const resetForm = () => {
    setForm({ id: null, name: '', type: 'Ekspansi' });
  };

  const filteredCities = useMemo(() => {
      return cities.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [cities, searchTerm]);

  return {
    state: { cities, filteredCities, loading, searchTerm, form },
    setters: { setSearchTerm, setForm },
    actions: { handleSubmit, handleDelete, handleEdit, resetForm }
  };
};
