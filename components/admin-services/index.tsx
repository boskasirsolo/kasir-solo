
import React, { useState, useEffect } from 'react';
import { Globe, Layers, LineChart, ShieldCheck, Save, Plus, Trash2, List, Calculator } from 'lucide-react';
import { ServicePageData, SiteConfig } from '../../types';
import { supabase } from '../../utils';
import { LoadingSpinner, Button, Input, TextArea } from '../ui';

// Import existing data for initialization from public constants
import { 
    WEBSITE_DATA, WEBSITE_CALC, 
    WEBAPP_DATA, WEBAPP_CALC, 
    SEO_DATA, SEO_CALC, 
    MAINTENANCE_DATA, MAINTENANCE_CALC 
} from '../services/data';

const SERVICE_OPTIONS = [
    { id: 'website', label: 'Website', icon: Globe, defaultData: WEBSITE_DATA, defaultCalc: WEBSITE_CALC },
    { id: 'webapp', label: 'Custom App', icon: Layers, defaultData: WEBAPP_DATA, defaultCalc: WEBAPP_CALC },
    { id: 'seo', label: 'SEO Traffic', icon: LineChart, defaultData: SEO_DATA, defaultCalc: SEO_CALC },
    { id: 'maintenance', label: 'Maintenance', icon: ShieldCheck, defaultData: MAINTENANCE_DATA, defaultCalc: MAINTENANCE_CALC }
];

export const AdminServices = ({ config }: { config: SiteConfig }) => {
    const [activeSlug, setActiveSlug] = useState('website');
    const [data, setData] = useState<ServicePageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchService(); }, [activeSlug]);

    const fetchService = async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data: res } = await supabase.from('services').select('*').eq('slug', activeSlug).maybeSingle();
            
            const selectedOpt = SERVICE_OPTIONS.find(o => o.id === activeSlug);

            if (res) {
                setData(res);
            } else {
                // Initialize with EXISTING public data if not in DB yet
                setData({
                    id: 0,
                    slug: activeSlug,
                    title: selectedOpt?.id === 'website' ? 'Web Itu' : selectedOpt?.id === 'webapp' ? 'Stop Jadi' : selectedOpt?.id === 'seo' ? 'Berhenti Membakar' : 'Punya Toko,',
                    highlight: selectedOpt?.id === 'website' ? 'Ruko Digital.' : selectedOpt?.id === 'webapp' ? 'Budak Excel.' : selectedOpt?.id === 'seo' ? 'Uang Iklan.' : 'Gak Ada Satpam?',
                    subtitle: '', 
                    icon_name: activeSlug === 'website' ? 'Globe' : activeSlug === 'webapp' ? 'Layers' : activeSlug === 'seo' ? 'LineChart' : 'ShieldCheck',
                    features: selectedOpt?.defaultData.features.map((f: any) => ({ 
                        title: f.title, 
                        desc: f.desc, 
                        icon: 'Zap' 
                    })) || [],
                    steps: selectedOpt?.defaultData.steps || [],
                    calc_data: selectedOpt?.defaultCalc || { baseLabel: '', baseOptions: [], addonLabel: '', addons: [] }
                });
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleSave = async () => {
        if (!supabase || !data) return;
        setSaving(true);
        try {
            const { error } = await supabase.from('services').upsert({
                slug: data.slug,
                features: data.features,
                steps: data.steps,
                calc_data: data.calc_data,
                // Fixed properties (not edited in this simplified view)
                title: data.title,
                highlight: data.highlight,
                subtitle: data.subtitle,
                icon_name: data.icon_name
            }, { onConflict: 'slug' });
            
            if (error) throw error;
            alert("Data Layanan & Harga berhasil diupdate!");
        } catch (e: any) { 
            alert("Gagal simpan: " + e.message); 
        } finally { setSaving(false); }
    };

    if (loading) return <div className="flex justify-center p-20"><LoadingSpinner size={32}/></div>;

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* SIDEBAR SELECTOR */}
            <div className="w-full lg:w-64 space-y-2 shrink-0">
                <div className="p-4 bg-brand-orange/10 border border-brand-orange/20 rounded-xl mb-4">
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest text-center">Pilih Layanan</h3>
                </div>
                {SERVICE_OPTIONS.map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => setActiveSlug(opt.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border ${
                            activeSlug === opt.id 
                            ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text' 
                            : 'bg-brand-dark text-gray-500 border-white/5 hover:border-white/20'
                        }`}
                    >
                        <opt.icon size={18} /> {opt.label}
                    </button>
                ))}
            </div>

            {/* EDITOR AREA */}
            <div className="flex-1 bg-brand-dark/50 border border-white/5 rounded-2xl p-6 md:p-8 space-y-10 max-h-[800px] overflow-y-auto custom-scrollbar">
                
                {/* 1. FEATURES */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <h4 className="text-white font-bold text-base flex items-center gap-2 uppercase tracking-widest">
                            <List size={16} className="text-brand-orange"/> Fitur & Keunggulan
                        </h4>
                        <button onClick={() => setData({...data!, features: [...data!.features, { title: '', desc: '', icon: 'Zap' }]})} className="text-[10px] bg-brand-orange/20 text-brand-orange px-3 py-1 rounded border border-brand-orange/30 font-bold">+ TAMBAH FITUR</button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {data?.features.map((f, i) => (
                            <div key={i} className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-2 relative group">
                                <button onClick={() => setData({...data!, features: data!.features.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                <Input value={f.title} onChange={(e: any) => {
                                    const newF = [...data!.features];
                                    newF[i].title = e.target.value;
                                    setData({...data!, features: newF});
                                }} placeholder="Judul Fitur" className="text-xs font-bold" />
                                <TextArea value={f.desc} onChange={(e: any) => {
                                    const newF = [...data!.features];
                                    newF[i].desc = e.target.value;
                                    setData({...data!, features: newF});
                                }} placeholder="Deskripsi singkat..." className="text-[10px] h-16" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. CALCULATOR DATA (PRICING) */}
                <div className="space-y-6">
                    <h4 className="text-white font-bold text-base flex items-center gap-2 border-b border-white/10 pb-2 uppercase tracking-widest">
                        <Calculator size={16} className="text-brand-orange"/> Harga Paket & Add-ons
                    </h4>
                    
                    <div className="bg-brand-orange/5 p-6 rounded-2xl border border-brand-orange/20 space-y-8">
                        
                        {/* BASE OPTIONS */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs font-bold text-white uppercase tracking-wider">📦 PILIHAN PAKET UTAMA</span>
                                <button onClick={() => setData({...data!, calc_data: {...data!.calc_data, baseOptions: [...data!.calc_data.baseOptions, { id: Date.now().toString(), label: '', price: 0, desc: '' }]}})} className="text-[9px] bg-brand-orange/20 text-brand-orange px-2 py-1 rounded border border-brand-orange/30 font-bold">+ PAKET</button>
                            </div>
                            {data?.calc_data?.baseOptions?.map((opt: any, i: number) => (
                                <div key={opt.id} className="grid grid-cols-12 gap-3 items-start bg-black/40 p-3 rounded-lg border border-white/5 relative group">
                                    <div className="col-span-12 md:col-span-5 space-y-2">
                                        <Input value={opt.label} onChange={(e: any) => {
                                            const newOpts = [...data!.calc_data.baseOptions];
                                            newOpts[i].label = e.target.value;
                                            setData({...data!, calc_data: {...data!.calc_data, baseOptions: newOpts}});
                                        }} placeholder="Nama Paket (Misal: Lite)" className="text-[10px] h-9 bg-black/20 font-bold" />
                                        <TextArea value={opt.desc} onChange={(e: any) => {
                                            const newOpts = [...data!.calc_data.baseOptions];
                                            newOpts[i].desc = e.target.value;
                                            setData({...data!, calc_data: {...data!.calc_data, baseOptions: newOpts}});
                                        }} placeholder="Deskripsi singkat..." className="text-[9px] h-14 bg-black/20" />
                                    </div>
                                    <div className="col-span-10 md:col-span-6">
                                        <label className="text-[8px] text-gray-500 font-bold uppercase mb-1 block">Harga Jual (IDR)</label>
                                        <Input type="number" value={opt.price} onChange={(e: any) => {
                                            const newOpts = [...data!.calc_data.baseOptions];
                                            newOpts[i].price = parseInt(e.target.value) || 0;
                                            setData({...data!, calc_data: {...data!.calc_data, baseOptions: newOpts}});
                                        }} placeholder="Harga" className="text-sm font-bold text-brand-orange bg-black/20 h-9" />
                                    </div>
                                    <div className="col-span-2 md:col-span-1 text-right pt-6">
                                        <button onClick={() => setData({...data!, calc_data: {...data!.calc_data, baseOptions: data!.calc_data.baseOptions.filter((_:any, idx:number) => idx !== i)}})} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ADDONS */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs font-bold text-white uppercase tracking-wider">🚀 MODUL TAMBAHAN (ADD-ONS)</span>
                                <button onClick={() => setData({...data!, calc_data: {...data!.calc_data, addons: [...data!.calc_data.addons, { id: Date.now().toString(), label: '', price: 0 }]}})} className="text-[9px] bg-brand-orange/20 text-brand-orange px-2 py-1 rounded border border-brand-orange/30 font-bold">+ ADD-ON</button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                                {data?.calc_data?.addons?.map((opt: any, i: number) => (
                                    <div key={opt.id} className="bg-black/40 p-3 rounded-lg border border-white/5 space-y-2 relative group">
                                        <button onClick={() => setData({...data!, calc_data: {...data!.calc_data, addons: data!.calc_data.addons.filter((_:any, idx:number) => idx !== i)}})} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 p-1"><Trash2 size={12}/></button>
                                        <Input value={opt.label} onChange={(e: any) => {
                                            const newOpts = [...data!.calc_data.addons];
                                            newOpts[i].label = e.target.value;
                                            setData({...data!, calc_data: {...data!.calc_data, addons: newOpts}});
                                        }} placeholder="Nama Add-on" className="text-[10px] h-8 bg-black/20" />
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] text-gray-500 font-bold">RP</span>
                                            <Input type="number" value={opt.price} onChange={(e: any) => {
                                                const newOpts = [...data!.calc_data.addons];
                                                newOpts[i].price = parseInt(e.target.value) || 0;
                                                setData({...data!, calc_data: {...data!.calc_data, addons: newOpts}});
                                            }} placeholder="Harga" className="text-[10px] h-8 bg-black/20 font-bold text-brand-orange" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* STICKY BOTTOM SAVE */}
                <div className="sticky bottom-0 bg-brand-dark py-4 border-t border-white/10 z-20">
                    <Button onClick={handleSave} disabled={saving} className="w-full py-4 shadow-neon font-bold">
                        {saving ? <LoadingSpinner /> : <><Save size={18}/> UPDATE HARGA & FITUR {activeSlug.toUpperCase()}</>}
                    </Button>
                    <p className="text-[9px] text-gray-500 mt-2 text-center italic">*Data ini disinkronkan langsung dari template publik agar Juragan tidak perlu input manual.</p>
                </div>
            </div>
        </div>
    );
};
