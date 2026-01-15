
import React, { useState, useEffect } from 'react';
import { Globe, Layers, LineChart, ShieldCheck, Save, RefreshCw, Plus, Trash2, Cpu, Settings, List, Calculator } from 'lucide-react';
import { ServicePageData, SiteConfig } from '../../types';
import { supabase } from '../../utils';
import { LoadingSpinner, Button, Input, TextArea } from '../ui';

const SERVICE_OPTIONS = [
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'webapp', label: 'Custom App', icon: Layers },
    { id: 'seo', label: 'SEO Traffic', icon: LineChart },
    { id: 'maintenance', label: 'Maintenance', icon: ShieldCheck }
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
            if (res) {
                setData(res);
            } else {
                // Initialize if empty
                setData({
                    id: 0,
                    slug: activeSlug,
                    title: '',
                    highlight: '',
                    subtitle: '',
                    icon_name: 'Globe',
                    features: [],
                    steps: [],
                    calc_data: { title: '', subtitle: '', baseLabel: '', baseOptions: [], addonLabel: '', addons: [] }
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
                title: data.title,
                highlight: data.highlight,
                subtitle: data.subtitle,
                icon_name: data.icon_name,
                features: data.features,
                steps: data.steps,
                calc_data: data.calc_data
            });
            if (error) throw error;
            alert("Konten layanan berhasil diupdate!");
        } catch (e) { alert("Gagal simpan"); } finally { setSaving(false); }
    };

    if (loading) return <div className="flex justify-center p-20"><LoadingSpinner size={32}/></div>;

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* SIDEBAR SELECTOR */}
            <div className="w-full lg:w-64 space-y-2 shrink-0">
                <div className="p-4 bg-brand-orange/10 border border-brand-orange/20 rounded-xl mb-4">
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest">Pilih Layanan</h3>
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
                {/* 1. HERO SECTION */}
                <div className="space-y-6">
                    <h4 className="text-white font-bold text-base flex items-center gap-2 border-b border-white/10 pb-2 uppercase tracking-widest">
                        <Cpu size={16} className="text-brand-orange"/> Hero Header
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Judul (White)</label>
                            <Input value={data?.title} onChange={(e: any) => setData({...data!, title: e.target.value})} placeholder="Web Itu" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Highlight (Orange)</label>
                            <Input value={data?.highlight} onChange={(e: any) => setData({...data!, highlight: e.target.value})} placeholder="Ruko Digital" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Subtitle / Tagline</label>
                        <TextArea value={data?.subtitle} onChange={(e: any) => setData({...data!, subtitle: e.target.value})} className="h-20" placeholder="Jangan cuma sewa lapak..." />
                    </div>
                </div>

                {/* 2. FEATURES */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <h4 className="text-white font-bold text-base flex items-center gap-2 uppercase tracking-widest">
                            <List size={16} className="text-brand-orange"/> Fitur & Keunggulan
                        </h4>
                        <button onClick={() => setData({...data!, features: [...data!.features, { title: '', desc: '', icon: 'Zap' }]})} className="text-[10px] bg-brand-orange/20 text-brand-orange px-3 py-1 rounded border border-brand-orange/30 font-bold">+ TAMBAH</button>
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

                {/* 3. CALCULATOR DATA */}
                <div className="space-y-6">
                    <h4 className="text-white font-bold text-base flex items-center gap-2 border-b border-white/10 pb-2 uppercase tracking-widest">
                        <Calculator size={16} className="text-brand-orange"/> Kalkulator Investasi
                    </h4>
                    <div className="bg-brand-orange/5 p-6 rounded-2xl border border-brand-orange/20 space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Judul Kalkulator</label>
                                <Input value={data?.calc_data?.title} onChange={(e: any) => setData({...data!, calc_data: {...data!.calc_data, title: e.target.value}})} className="bg-black/40" />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Label Paket Dasar</label>
                                <Input value={data?.calc_data?.baseLabel} onChange={(e: any) => setData({...data!, calc_data: {...data!.calc_data, baseLabel: e.target.value}})} className="bg-black/40" />
                            </div>
                        </div>

                        {/* BASE OPTIONS */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-gray-400">PILIHAN PAKET DASAR</span><button onClick={() => setData({...data!, calc_data: {...data!.calc_data, baseOptions: [...data!.calc_data.baseOptions, { id: Date.now().toString(), label: '', price: 0, desc: '' }]}})} className="text-[9px] text-brand-orange">+ PAKET</button></div>
                            {data?.calc_data?.baseOptions?.map((opt: any, i: number) => (
                                <div key={opt.id} className="grid grid-cols-12 gap-2 items-center bg-black/20 p-2 rounded-lg border border-white/5">
                                    <div className="col-span-5"><Input value={opt.label} onChange={(e: any) => {
                                        const newOpts = [...data!.calc_data.baseOptions];
                                        newOpts[i].label = e.target.value;
                                        setData({...data!, calc_data: {...data!.calc_data, baseOptions: newOpts}});
                                    }} placeholder="Nama Paket" className="text-[10px] h-8" /></div>
                                    <div className="col-span-4"><Input type="number" value={opt.price} onChange={(e: any) => {
                                        const newOpts = [...data!.calc_data.baseOptions];
                                        newOpts[i].price = parseInt(e.target.value);
                                        setData({...data!, calc_data: {...data!.calc_data, baseOptions: newOpts}});
                                    }} placeholder="Harga" className="text-[10px] h-8" /></div>
                                    <div className="col-span-3 text-right"><button onClick={() => setData({...data!, calc_data: {...data!.calc_data, baseOptions: data!.calc_data.baseOptions.filter((_:any, idx:number) => idx !== i)}})} className="text-red-500 p-1"><Trash2 size={14}/></button></div>
                                </div>
                            ))}
                        </div>

                        {/* ADDONS */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-gray-400">PILIHAN ADD-ONS</span><button onClick={() => setData({...data!, calc_data: {...data!.calc_data, addons: [...data!.calc_data.addons, { id: Date.now().toString(), label: '', price: 0 }]}})} className="text-[9px] text-brand-orange">+ ADDON</button></div>
                            {data?.calc_data?.addons?.map((opt: any, i: number) => (
                                <div key={opt.id} className="grid grid-cols-12 gap-2 items-center bg-black/20 p-2 rounded-lg border border-white/5">
                                    <div className="col-span-5"><Input value={opt.label} onChange={(e: any) => {
                                        const newOpts = [...data!.calc_data.addons];
                                        newOpts[i].label = e.target.value;
                                        setData({...data!, calc_data: {...data!.calc_data, addons: newOpts}});
                                    }} placeholder="Nama Addon" className="text-[10px] h-8" /></div>
                                    <div className="col-span-4"><Input type="number" value={opt.price} onChange={(e: any) => {
                                        const newOpts = [...data!.calc_data.addons];
                                        newOpts[i].price = parseInt(e.target.value);
                                        setData({...data!, calc_data: {...data!.calc_data, addons: newOpts}});
                                    }} placeholder="Harga" className="text-[10px] h-8" /></div>
                                    <div className="col-span-3 text-right"><button onClick={() => setData({...data!, calc_data: {...data!.calc_data, addons: data!.calc_data.addons.filter((_:any, idx:number) => idx !== i)}})} className="text-red-500 p-1"><Trash2 size={14}/></button></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* STICKY BOTTOM SAVE */}
                <div className="sticky bottom-0 bg-brand-dark py-4 border-t border-white/10 z-20">
                    <Button onClick={handleSave} disabled={saving} className="w-full py-4 shadow-neon font-bold">
                        {saving ? <LoadingSpinner /> : <><Save size={18}/> UPDATE KONTEN {activeSlug.toUpperCase()}</>}
                    </Button>
                </div>
            </div>
        </div>
    );
};
