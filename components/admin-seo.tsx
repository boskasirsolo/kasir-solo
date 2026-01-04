
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Globe, Search, Save, X, ExternalLink } from 'lucide-react';
import { supabase, slugify } from '../utils';
import { Button, Input, LoadingSpinner } from './ui';

interface CityTarget {
  id: number;
  name: string;
  slug: string;
  type: 'Kandang' | 'Ekspansi';
}

export const AdminSEO = () => {
  const [cities, setCities] = useState<CityTarget[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [form, setForm] = useState<{ id: number | null, name: string, type: 'Kandang' | 'Ekspansi' }>({
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
    const { data, error } = await supabase.from('target_cities').select('*').order('created_at', { ascending: false });
    if (data) setCities(data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.name) return alert("Nama Kota wajib diisi.");
    
    // Auto Generate Slug
    const generatedSlug = slugify(form.name);

    if (!supabase) return alert("Database belum terkoneksi.");

    try {
      const payload = {
        name: form.name,
        slug: generatedSlug,
        type: form.type
      };

      if (form.id) {
        // Edit Mode
        const { error } = await supabase.from('target_cities').update(payload).eq('id', form.id);
        if (error) throw error;
      } else {
        // Create Mode
        const { error } = await supabase.from('target_cities').insert([payload]);
        if (error) throw error;
      }

      await fetchCities();
      resetForm();
    } catch (e: any) {
      alert("Gagal menyimpan: " + e.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus target kota ini? Halaman SEO-nya bakal hilang.")) return;
    if (!supabase) return;
    await supabase.from('target_cities').delete().eq('id', id);
    setCities(cities.filter(c => c.id !== id));
  };

  const resetForm = () => {
    setForm({ id: null, name: '', type: 'Ekspansi' });
  };

  const filteredCities = cities.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[800px]">
      
      {/* LEFT: LIST KOTA */}
      <div className="lg:col-span-8 flex flex-col h-full bg-brand-dark border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
           <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Globe size={16} className="text-brand-orange"/> Target Wilayah ({cities.length})
           </div>
           <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-500"/>
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari kota..."
                className="bg-brand-card border border-white/10 rounded-full pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange w-48"
              />
           </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
           {loading ? <div className="text-center p-10"><LoadingSpinner/></div> : (
             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               {filteredCities.map(city => (
                 <div key={city.id} className="group bg-brand-card border border-white/5 p-4 rounded-xl hover:border-brand-orange/50 transition-all relative">
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${city.type === 'Kandang' ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                          {city.type.toUpperCase()}
                       </span>
                       <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a href={`/jual-mesin-kasir-di-${city.slug}`} target="_blank" className="p-1.5 bg-white/10 rounded hover:text-brand-orange"><ExternalLink size={12}/></a>
                          <button onClick={() => setForm({ id: city.id, name: city.name, type: city.type })} className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500 hover:text-white"><Plus size={12} className="rotate-45" /></button> {/* Edit Icon Hack */}
                          <button onClick={() => handleDelete(city.id)} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white"><Trash2 size={12}/></button>
                       </div>
                    </div>
                    <h4 className="text-white font-bold text-sm truncate">{city.name}</h4>
                    <p className="text-gray-500 text-[10px] mt-1 truncate">/jual-mesin-kasir-di-{city.slug}</p>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>

      {/* RIGHT: FORM INPUT */}
      <div className="lg:col-span-4 h-fit bg-brand-dark border border-white/5 rounded-xl p-6 sticky top-6">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
               {form.id ? 'Edit Wilayah' : 'Tambah Wilayah Baru'}
            </h3>
            {form.id && <button onClick={resetForm} className="text-xs text-gray-500 hover:text-white flex items-center gap-1"><X size={12}/> Batal</button>}
         </div>

         <div className="space-y-4">
            <div>
               <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Nama Kota / Kabupaten</label>
               <Input 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="Contoh: Magetan"
                  className="text-sm"
               />
               <p className="text-[10px] text-gray-500 mt-1">*Slug URL akan digenerate otomatis.</p>
            </div>

            <div>
               <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Tipe Wilayah</label>
               <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setForm({...form, type: 'Kandang'})}
                    className={`p-3 rounded-lg border text-xs font-bold transition-all ${form.type === 'Kandang' ? 'bg-brand-orange text-white border-brand-orange' : 'bg-black/20 text-gray-500 border-white/10'}`}
                  >
                    🦁 Kandang (Solo Raya)
                  </button>
                  <button 
                    onClick={() => setForm({...form, type: 'Ekspansi'})}
                    className={`p-3 rounded-lg border text-xs font-bold transition-all ${form.type === 'Ekspansi' ? 'bg-blue-600 text-white border-blue-600' : 'bg-black/20 text-gray-500 border-white/10'}`}
                  >
                    🚀 Ekspansi (Luar Kota)
                  </button>
               </div>
               <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                  <strong>Kandang:</strong> Gratis Ongkir & Teknisi Datang.<br/>
                  <strong>Ekspansi:</strong> Kirim Cargo & Remote Support.
               </p>
            </div>

            <Button onClick={handleSubmit} className="w-full py-3 shadow-neon">
               <Save size={16} /> {form.id ? 'UPDATE DATA' : 'TERBITKAN HALAMAN'}
            </Button>
         </div>
      </div>

    </div>
  );
};
