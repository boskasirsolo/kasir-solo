
import React, { useState, useEffect } from 'react';
import { Globe, Layers, LineChart, ShieldCheck, Save, Plus, Trash2, List, Calculator, Sparkles, Wand2 } from 'lucide-react';
import { ServicePageData, SiteConfig } from '../../types';
import { supabase, formatNumberInput, cleanNumberInput, callGeminiWithRotation } from '../../utils';
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
    const [aiGenerating, setAiGenerating] = useState<string | null>(null);

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

    const generateHasutan = async (type: 'base' | 'addon', index: number) => {
        if (!data) return;
        const item = type === 'base' ? data.calc_data.baseOptions[index] : data.calc_data.addons[index];
        const id = `${type}-${index}`;
        
        setAiGenerating(id);
        try {
            const prompt = `
            Role: Street-smart copywriter for PT Mesin Kasir Solo.
            Task: Write a "Persuasive Secret Detail" for service item: "${item.label}".
            Context Service: ${activeSlug.toUpperCase()} Service.
            Format: Markdown (2-3 paragraphs).
            Tone: Honest, Gritty, using 'Gue/Lo', explaining why this is crucial for the owner. 
            Rules: Be punchy. No long intros. Use bold for emphasis. NO corporate speak.
            `;
            
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const result = res.text?.trim() || "";

            const newData = { ...data };
            if (type === 'base') newData.calc_data.baseOptions[index].longDesc = result;
            else newData.calc_data.addons[index].longDesc = result;
            
            setData(newData);
        } catch (e) {
            alert("AI capek, Bos. Coba lagi nanti.");
        } finally {
            setAiGenerating(null);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><LoadingSpinner size={32}/></div>;

    return (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 h-full">
            <div className="w-full lg:w-64 shrink-0 flex flex-col">
                <div className="p-3 bg-brand-orange/10 border border-brand-orange/20 rounded-xl mb-3 hidden lg:block">
                    <h3 className="text-white font-bold text-xs uppercase tracking-widest text-center">Pilih Layanan</h3>
                </div>
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 custom-scrollbar-hide -mx-1 px-1">
                    {SERVICE_OPTIONS.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setActiveSlug(opt.id)}
                            className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2 px-4 py-3 lg:py-3.5 rounded-xl text-[11px] lg:text-xs font-bold transition-all border whitespace-nowrap ${
                                activeSlug === opt.id 
                                ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text' 
                                : 'bg-brand-dark text-gray-500 border-white/5 hover:border-white/20'
                            }`}
                        >
                            <opt.icon size={16} /> {opt.label.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-brand-dark/50 border border-white/5 rounded-2xl p-4 md:p-8 space-y-8 lg:space-y-12 max-h-[70vh] lg:max-h-[800px] overflow-y-auto custom-scrollbar">
                
                {/* 1. FITUR */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                        <h4 className="text-white font-bold text-sm lg:text-base flex items-center gap-2 uppercase tracking-widest">
                            <List size={16} className="text-brand-orange"/> Fitur & Keunggulan
                        </h4>
                        <button 
                            onClick={() => setData({...data!, features: [...data!.features, { title: '', desc: '', icon: 'Zap' }]})} 
                            className="text-[9px] bg-brand-orange/20 text-brand-orange px-3 py-1.5 rounded border border-brand-orange/30 font-bold"
                        >
                            + TAMBAH
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                        {data?.features.map((f, i) => (
                            <div key={i} className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3 relative group">
                                <button onClick={() => setData({...data!, features: data!.features.filter((_, idx) => idx !== i)})} className="absolute top-3 right-3 text-red-500 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                <Input value={f.title} onChange={(e: any) => {
                                    const newF = [...data!.features];
                                    newF[i].title = e.target.value;
                                    setData({...data!, features: newF});
                                }} placeholder="Judul Fitur" className="text-xs font-bold bg-brand-dark/50" />
                                <TextArea value={f.desc} onChange={(e: any) => {
                                    const newF = [...data!.features];
                                    newF[i].desc = e.target.value;
                                    setData({...data!, features: newF});
                                }} placeholder="Deskripsi singkat..." className="text-[10px] h-20 bg-brand-dark/50" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. HARGA & HASUTAN */}
                <div className="space-y-6">
                    <h4 className="text-white font-bold text-sm lg:text-base flex items-center gap-2 border-b border-white/10 pb-3 uppercase tracking-widest">
                        <Calculator size={16} className="text-brand-orange"/> Harga & Detail Hasutan
                    </h4>
                    
                    <div className="bg-brand-orange/5 p-4 lg:p-6 rounded-2xl border border-brand-orange/20 space-y-8">
                        
                        {/* PAKET UTAMA */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">📦 PAKET UTAMA</span>
                                <button onClick={() => setData({...data!, calc_data: {...data!.calc_data, baseOptions: [...data!.calc_data.baseOptions, { id: Date.now().toString(), label: '', price: 0, desc: '', longDesc: '' }]}})} className="text-[9px] bg-brand-orange/20 text-brand-orange px-2 py-1.5 rounded border border-brand-orange/30 font-bold">+ PAKET</button>
                            </div>
                            <div className="space-y-6">
                                {data?.calc_data?.baseOptions?.map((opt: any, i: number) => (
                                    <div key={opt.id} className="bg-black/40 p-5 rounded-xl border border-white/5 space-y-4 relative group">
                                        <button onClick={() => setData({...data!, calc_data: {...data!.calc_data, baseOptions: data!.calc_data.baseOptions.filter((_:any, idx:number) => idx !== i)}})} className="absolute top-4 right-4 text-red-500 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"><Trash2 size={16}/></button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <Input value={opt.label} onChange={(e: any) => {
                                                    const newOpts = [...data!.calc_data.baseOptions];
                                                    newOpts[i].label = e.target.value;
                                                    setData({...data!, calc_data: {...data!.calc_data, baseOptions: newOpts}});
                                                }} placeholder="Nama Paket" className="text-xs font-bold" />
                                                <div className="relative">
                                                    <span className="absolute left-3 top-2.5 text-[10px] text-brand-orange font-bold">RP</span>
                                                    <Input type="text" value={formatNumberInput(opt.price)} onChange={(e: any) => {
                                                        const numericValue = cleanNumberInput(e.target.value);
                                                        const newOpts = [...data!.calc_data.baseOptions];
                                                        newOpts[i].price = numericValue;
                                                        setData({ ...data!, calc_data: { ...data!.calc_data, baseOptions: newOpts } });
                                                    }} className="pl-8 text-xs font-bold text-brand-orange" />
                                                </div>
                                                <TextArea value={opt.desc} onChange={(e: any) => {
                                                    const newOpts = [...data!.calc_data.baseOptions];
                                                    newOpts[i].desc = e.target.value;
                                                    setData({...data!, calc_data: {...data!.calc_data, baseOptions: newOpts}});
                                                }} placeholder="Tooltip singkat..." className="text-[10px] h-16" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-[9px] text-gray-500 font-bold uppercase">Hasutan Detail (Markdown)</label>
                                                    <button 
                                                        onClick={() => generateHasutan('base', i)}
                                                        disabled={aiGenerating === `base-${i}`}
                                                        className="text-[9px] text-blue-400 hover:text-white flex items-center gap-1"
                                                    >
                                                        {aiGenerating === `base-${i}` ? <LoadingSpinner size={10}/> : <><Sparkles size={10}/> AI MAGIC</>}
                                                    </button>
                                                </div>
                                                <TextArea 
                                                    value={opt.longDesc || ''} 
                                                    onChange={(e: any) => {
                                                        const newOpts = [...data!.calc_data.baseOptions];
                                                        newOpts[i].longDesc = e.target.value;
                                                        setData({...data!, calc_data: {...data!.calc_data, baseOptions: newOpts}});
                                                    }} 
                                                    placeholder="Jelasin kenapa paket ini paling 'worth it'..." 
                                                    className="text-[10px] h-32 bg-brand-dark/50" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ADDONS */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">🚀 ADD-ONS</span>
                                <button onClick={() => setData({...data!, calc_data: {...data!.calc_data, addons: [...data!.calc_data.addons, { id: Date.now().toString(), label: '', price: 0, longDesc: '' }]}})} className="text-[9px] bg-brand-orange/20 text-brand-orange px-2 py-1.5 rounded border border-brand-orange/30 font-bold">+ ADD-ON</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data?.calc_data?.addons?.map((opt: any, i: number) => (
                                    <div key={opt.id} className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3 relative group">
                                        <button onClick={() => setData({...data!, calc_data: {...data!.calc_data, addons: data!.calc_data.addons.filter((_:any, idx:number) => idx !== i)}})} className="absolute top-2 right-2 text-red-500 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"><Trash2 size={12}/></button>
                                        <Input value={opt.label} onChange={(e: any) => {
                                            const newOpts = [...data!.calc_data.addons];
                                            newOpts[i].label = e.target.value;
                                            setData({...data!, calc_data: {...data!.calc_data, addons: newOpts}});
                                        }} placeholder="Nama Add-on" className="text-[11px] font-bold" />
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] text-gray-500 font-bold">RP</span>
                                            <Input type="text" value={formatNumberInput(opt.price)} onChange={(e: any) => {
                                                const numericValue = cleanNumberInput(e.target.value);
                                                const newOpts = [...data!.calc_data.addons];
                                                newOpts[i].price = numericValue;
                                                setData({ ...data!, calc_data: { ...data!.calc_data, addons: newOpts } });
                                            }} className="h-8 text-xs font-bold text-brand-orange" />
                                        </div>
                                        <div className="pt-2 border-t border-white/5">
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-[8px] text-gray-500 font-bold uppercase">Detail Hasutan</label>
                                                <button 
                                                    onClick={() => generateHasutan('addon', i)}
                                                    disabled={aiGenerating === `addon-${i}`}
                                                    className="text-[8px] text-blue-400 hover:text-white flex items-center gap-1"
                                                >
                                                    {aiGenerating === `addon-${i}` ? <LoadingSpinner size={8}/> : <Wand2 size={8}/>}
                                                </button>
                                            </div>
                                            <TextArea 
                                                value={opt.longDesc || ''} 
                                                onChange={(e: any) => {
                                                    const newOpts = [...data!.calc_data.addons];
                                                    newOpts[i].longDesc = e.target.value;
                                                    setData({...data!, calc_data: {...data!.calc_data, addons: newOpts}});
                                                }} 
                                                placeholder="Hasutan add-on..." 
                                                className="text-[9px] h-20" 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-brand-dark py-4 border-t border-white/10 z-20">
                    <Button onClick={handleSave} disabled={saving} className="w-full py-4 shadow-neon font-bold text-xs lg:text-sm">
                        {saving ? <LoadingSpinner /> : <><Save size={18}/> UPDATE DATA {activeSlug.toUpperCase()}</>}
                    </Button>
                </div>
            </div>
        </div>
    );
};
