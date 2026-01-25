
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Globe, Layers, LineChart, ShieldCheck, ArrowLeft } from 'lucide-react';
import { SiteConfig, ServicePageData } from '../../types';
import { supabase, callGeminiWithRotation } from '../../utils';
import { LoadingSpinner } from '../ui';
import { InventoryList } from './sections/inventory-list';
import { ItemEditor } from './sections/item-editor';

const TARGETS = [
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'webapp', label: 'Custom App', icon: Layers },
    { id: 'seo', label: 'SEO Traffic', icon: LineChart }
];

export const AdminServices = ({ config }: { config: SiteConfig }) => {
    const [allServices, setAllServices] = useState<ServicePageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [aiGenerating, setAiGenerating] = useState<string | null>(null);
    const [filterSlug, setFilterSlug] = useState('website');
    const [itemSearchTerm, setItemSearchTerm] = useState('');
    const [showMobileEditor, setShowMobileEditor] = useState(false);

    const [itemForm, setItemForm] = useState<any>({ id: '', label: '', price: 0, desc: '', longDesc: '', founderNote: '', includesStr: '', targets: ['website'], role: 'addon', tier: 'basic' });

    useEffect(() => { fetchAllServices(); }, []);

    const fetchAllServices = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data } = await supabase.from('services').select('*');
        if (data) setAllServices(data);
        setLoading(false);
    };

    const handleSyncSave = async () => {
        if (!itemForm.label || itemForm.targets.length === 0) return alert("Lengkapi data Bos.");
        setSaving(true);
        try {
            const itemId = itemForm.id || `item_${Date.now()}`;
            const includesArr = itemForm.includesStr ? itemForm.includesStr.split('\n').map((s:string) => s.trim()).filter(Boolean) : [];
            await Promise.all(itemForm.targets.map(async (slug: string) => {
                const svc = allServices.find(s => s.slug === slug);
                if (!svc) return;
                const calcData = JSON.parse(JSON.stringify(svc.calc_data || { baseOptions: [], addons: [] }));
                const listKey = itemForm.role === 'base' ? 'baseOptions' : 'addons';
                const itemPayload = { id: itemId, label: itemForm.label, price: itemForm.price, desc: itemForm.desc, longDesc: itemForm.longDesc, founderNote: itemForm.founderNote, includes: includesArr, tier: itemForm.role === 'addon' ? itemForm.tier : undefined };
                const existingIdx = calcData[listKey].findIndex((o: any) => o.id === itemId);
                if (existingIdx > -1) calcData[listKey][existingIdx] = itemPayload; else calcData[listKey].push(itemPayload);
                await supabase!.from('services').update({ calc_data: calcData }).eq('slug', slug);
            }));
            alert("Terbroadcast!"); await fetchAllServices(); resetForm();
        } catch (e) { alert("Gagal."); } finally { setSaving(false); }
    };

    const resetForm = () => { setItemForm({ id: '', label: '', price: 0, desc: '', longDesc: '', founderNote: '', includesStr: '', targets: [filterSlug], role: 'addon', tier: 'basic' }); setShowMobileEditor(false); };
    const currentSvc = allServices.find(s => s.slug === filterSlug);
    const fb = (currentSvc?.calc_data?.baseOptions || []).filter((it: any) => it.label.toLowerCase().includes(itemSearchTerm.toLowerCase()));
    const fa = (currentSvc?.calc_data?.addons || []).filter((it: any) => it.label.toLowerCase().includes(itemSearchTerm.toLowerCase()));

    if (loading) return <div className="flex justify-center p-24"><LoadingSpinner size={32}/></div>;

    const editor = <ItemEditor form={itemForm} setForm={setItemForm} onSave={handleSyncSave} onAi={async (t:string) => { setAiGenerating(t); const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: `Write ${t} for ${itemForm.label} in street-smart Indonesian.` }); setItemForm((p:any) => ({...p, [t === 'includes' ? 'includesStr' : t]: res.text})); setAiGenerating(null); }} aiLoading={aiGenerating} saving={saving} targets={TARGETS} onReset={resetForm} />;

    return (
        <div className="grid lg:grid-cols-12 gap-8 h-full animate-fade-in relative pb-20">
            <div className="lg:col-span-5 h-[750px]"><InventoryList filterSlug={filterSlug} setFilterSlug={setFilterSlug} searchTerm={itemSearchTerm} setSearchTerm={setItemSearchTerm} filteredBase={fb} filteredAddons={fa} onEdit={(item:any, role:any) => { setItemForm({...item, includesStr: item.includes?.join('\n') || '', targets: [filterSlug], role}); setShowMobileEditor(true); }} onDelete={async (s:any, i:any, r:any) => { if(confirm("Hapus?")) { const svc = allServices.find(x => x.slug === s); const cd = JSON.parse(JSON.stringify(svc?.calc_data)); const lk = r === 'base' ? 'baseOptions' : 'addons'; cd[lk] = cd[lk].filter((o:any) => o.id !== i); await supabase!.from('services').update({ calc_data: cd }).eq('slug', s); fetchAllServices(); } }} onReset={resetForm} targets={TARGETS} /></div>
            <div className="hidden lg:block lg:col-span-7 h-[750px]">{editor}</div>
            {showMobileEditor && createPortal(<div className="fixed inset-0 z-[9999] bg-brand-black flex flex-col lg:hidden"><div className="p-4 bg-brand-card border-b border-white/10 flex items-center justify-between"><button onClick={resetForm} className="flex items-center gap-2 text-brand-orange font-bold text-sm"><ArrowLeft size={20} /> Kembali</button><h3 className="text-white font-bold text-sm">Editor Layanan</h3><div className="w-10"></div></div><div className="flex-1 overflow-y-auto p-5 custom-scrollbar">{editor}</div></div>, document.body)}
        </div>
    );
};
