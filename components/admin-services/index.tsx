
import React, { useState, useEffect } from 'react';
import { 
    Globe, Layers, LineChart, ShieldCheck, Save, Plus, 
    Trash2, Calculator, Sparkles, Wand2, Coffee, 
    CheckSquare, Square, Search, Edit3, RefreshCw,
    Box, Zap, LayoutList, ChevronRight
} from 'lucide-react';
import { SiteConfig, ServicePageData } from '../../types';
import { CalcOption } from '../shared/calculator/types';
import { supabase, formatNumberInput, cleanNumberInput, callGeminiWithRotation, slugify } from '../../utils';
import { LoadingSpinner, Button, Input, TextArea } from '../ui';

const SERVICE_TARGETS = [
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'webapp', label: 'Custom App', icon: Layers },
    { id: 'seo', label: 'SEO Traffic', icon: LineChart },
    { id: 'maintenance', label: 'Maintenance', icon: ShieldCheck }
];

export const AdminServices = ({ config }: { config: SiteConfig }) => {
    // --- STATE: EDITOR ---
    const [itemForm, setItemForm] = useState<CalcOption & { targets: string[], role: 'base' | 'addon' }>({
        id: '',
        label: '',
        price: 0,
        desc: '',
        longDesc: '',
        founderNote: '',
        targets: [], 
        role: 'addon'
    });

    // --- STATE: DATA MANAGEMENT ---
    const [allServices, setAllServices] = useState<ServicePageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [aiGenerating, setAiGenerating] = useState<string | null>(null);
    
    // --- STATE: LIST FILTER ---
    const [filterSlug, setFilterSlug] = useState('website');

    useEffect(() => { fetchAllServices(); }, []);

    const fetchAllServices = async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data: res } = await supabase.from('services').select('*');
            if (res) setAllServices(res);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const resetForm = () => {
        setItemForm({
            id: '', label: '', price: 0, desc: '', longDesc: '', founderNote: '',
            targets: [], role: 'addon'
        });
    };

    // --- HANDLERS: AI ---
    const generateAiContent = async (targetField: 'desc' | 'longDesc' | 'founderNote') => {
        if (!itemForm.label) return alert("Isi Label Item dulu Bos.");
        setAiGenerating(targetField);
        try {
            let prompt = "";
            if (targetField === 'desc') {
                prompt = `Role: UX Copywriter. Task: Write ONE very short, punchy teaser/tooltip (max 12 words) for a service item named: "${itemForm.label}". Focus on the immediate benefit. Use 'Gue/Lo' style if possible. Indonesian. NO INTRO, JUST THE FINAL TEXT.`;
            } else if (targetField === 'founderNote') {
                prompt = `Role: Founder Amin Maghfuri. Task: Write a short, gritty "Founder Note" (1-2 sentences) using 'Gue/Lo' for item: "${itemForm.label}". NO INTRO, JUST THE TEXT.`;
            } else {
                prompt = `Role: Street-smart copywriter. Task: Write a persuasive detail (Markdown, 2 paragraphs) using 'Gue/Lo' for item: "${itemForm.label}". Use bold for emphasis. NO INTRO, JUST THE CONTENT.`;
            }
            
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setItemForm(prev => ({ ...prev, [targetField]: res.text?.trim() || "" }));
        } catch (e) {
            alert("Gemini lagi pusing.");
        } finally { setAiGenerating(null); }
    };

    // --- HANDLERS: SAVE ---
    const handleBroadcastSave = async () => {
        if (!itemForm.label || itemForm.targets.length === 0) {
            return alert("Nama Item dan Minimal 1 Target Layanan wajib diisi!");
        }

        setSaving(true);
        try {
            const itemId = itemForm.id || `item_${Date.now()}`;

            const updatePromises = itemForm.targets.map(async (slug) => {
                const service = allServices.find(s => s.slug === slug);
                if (!service) return;

                const calcData = { ...service.calc_data };
                const listKey = itemForm.role === 'base' ? 'baseOptions' : 'addons';
                
                if (!calcData[listKey]) calcData[listKey] = [];

                const existingIdx = calcData[listKey].findIndex((o: any) => o.id === itemId);
                const itemPayload = {
                    id: itemId, label: itemForm.label, price: itemForm.price,
                    desc: itemForm.desc, longDesc: itemForm.longDesc, founderNote: itemForm.founderNote
                };

                if (existingIdx > -1) calcData[listKey][existingIdx] = itemPayload;
                else calcData[listKey].push(itemPayload);

                return supabase!.from('services').update({ calc_data: calcData }).eq('slug', slug);
            });

            await Promise.all(updatePromises);
            alert(`Item "${itemForm.label}" Berhasil Disimpan!`);
            await fetchAllServices();
            resetForm();
        } catch (e: any) {
            alert("Gagal broadcast: " + e.message);
        } finally { setSaving(false); }
    };

    const deleteItemFromService = async (serviceSlug: string, itemId: string, role: 'base' | 'addon') => {
        if (!confirm("Hapus item ini dari layanan ini?")) return;
        const service = allServices.find(s => s.slug === serviceSlug);
        if (!service) return;
        const calcData = { ...service.calc_data };
        const listKey = role === 'base' ? 'baseOptions' : 'addons';
        calcData[listKey] = calcData[listKey].filter((o: any) => o.id !== itemId);
        try {
            await supabase!.from('services').update({ calc_data: calcData }).eq('slug', serviceSlug);
            await fetchAllServices();
        } catch (e) { alert("Gagal hapus."); }
    };

    const editItemFromList = (serviceSlug: string, item: any, role: 'base' | 'addon') => {
        setItemForm({ ...item, targets: [serviceSlug], role: role });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div className="flex justify-center p-20"><LoadingSpinner size={32}/></div>;

    const currentService = allServices.find(s => s.slug === filterSlug);

    return (
        <div className="animate-fade-in pb-20">
            
            {/* --- HEADER NAVIGATION --- */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-black/20 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange"><LayoutList size={20}/></div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Dashboard Item Layanan</h4>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Atur Kalkulator & Simulasi</p>
                    </div>
                </div>
                
                <div className="flex bg-brand-dark p-1 rounded-xl border border-white/10 overflow-x-auto custom-scrollbar-hide w-full md:w-auto">
                    {SERVICE_TARGETS.map(svc => (
                        <button
                            key={svc.id}
                            onClick={() => setFilterSlug(svc.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${filterSlug === svc.id ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500 hover:text-white'}`}
                        >
                            <svc.icon size={14} /> {svc.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- MAIN GRID LAYOUT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* COLUMN 1: LIST ARSENAL (LEFT) */}
                <div className="lg:col-span-5 space-y-6">
                    
                    {/* PAKET UTAMA LIST */}
                    <div className="bg-brand-dark/50 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-4 bg-brand-orange/10 border-b border-brand-orange/20 flex justify-between items-center">
                            <h5 className="text-[11px] font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2">
                                <Box size={14}/> 1. Daftar Paket Utama
                            </h5>
                            <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded text-gray-400 font-mono">{currentService?.calc_data?.baseOptions?.length || 0}</span>
                        </div>
                        <div className="p-4 space-y-2 min-h-[150px]">
                            {currentService?.calc_data?.baseOptions?.map((item: any) => (
                                <ItemRow key={item.id} item={item} role="base" onEdit={() => editItemFromList(filterSlug, item, 'base')} onDelete={() => deleteItemFromService(filterSlug, item.id, 'base')} />
                            ))}
                            {(!currentService?.calc_data?.baseOptions?.length) && <p className="text-xs text-gray-700 italic p-10 text-center">Belum ada paket utama di {filterSlug}.</p>}
                        </div>
                    </div>

                    {/* ADDONS LIST */}
                    <div className="bg-brand-dark/50 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-4 bg-blue-500/10 border-b border-blue-500/20 flex justify-between items-center">
                            <h5 className="text-[11px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                <Zap size={14}/> 2. Daftar Add-ons
                            </h5>
                            <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded text-gray-400 font-mono">{currentService?.calc_data?.addons?.length || 0}</span>
                        </div>
                        <div className="p-4 space-y-2 min-h-[150px]">
                            {currentService?.calc_data?.addons?.map((item: any) => (
                                <ItemRow key={item.id} item={item} role="addon" onEdit={() => editItemFromList(filterSlug, item, 'addon')} onDelete={() => deleteItemFromService(filterSlug, item.id, 'addon')} />
                            ))}
                            {(!currentService?.calc_data?.addons?.length) && <p className="text-xs text-gray-700 italic p-10 text-center">Belum ada add-ons di {filterSlug}.</p>}
                        </div>
                    </div>
                </div>

                {/* COLUMN 2: EDITOR & BROADCAST (RIGHT - STICKY) */}
                <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-6">
                    
                    {/* EDITOR FORM */}
                    <div className="bg-brand-card border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                            <h3 className="text-white font-bold text-base flex items-center gap-2">
                                <Edit3 size={18} className="text-brand-orange" /> 
                                {itemForm.id ? `Edit: ${itemForm.label}` : 'Buat Item Baru'}
                            </h3>
                            <button onClick={resetForm} className="text-gray-500 hover:text-white"><RefreshCw size={16}/></button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-1.5 block">Label Item</label>
                                    <Input value={itemForm.label} onChange={(e: any) => setItemForm({...itemForm, label: e.target.value})} placeholder="Cth: Starter Pack" className="bg-black/40"/>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-1.5 block">Harga (IDR)</label>
                                    <Input value={formatNumberInput(itemForm.price)} onChange={(e: any) => setItemForm({...itemForm, price: cleanNumberInput(e.target.value)})} className="bg-black/40 text-brand-orange font-bold"/>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase">Tooltip Singkat</label>
                                    <button onClick={() => generateAiContent('desc')} disabled={aiGenerating==='desc'} className="text-[9px] text-blue-400 flex items-center gap-1 hover:text-white">{aiGenerating==='desc' ? <LoadingSpinner size={8}/> : <><Sparkles size={10}/> AI Gen</>}</button>
                                </div>
                                <TextArea value={itemForm.desc || ''} onChange={(e: any) => setItemForm({...itemForm, desc: e.target.value})} placeholder="Teaser singkat..." className="h-14 text-xs bg-black/20" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="text-[10px] text-gray-500 font-bold uppercase">Detail Persuasif</label>
                                        <button onClick={() => generateAiContent('longDesc')} disabled={aiGenerating==='longDesc'} className="text-[9px] text-blue-400 flex items-center gap-1">{aiGenerating==='longDesc' ? <LoadingSpinner size={8}/> : <><Sparkles size={10}/> AI Gen</>}</button>
                                    </div>
                                    <TextArea value={itemForm.longDesc || ''} onChange={(e: any) => setItemForm({...itemForm, longDesc: e.target.value})} placeholder="Hasutan detail..." className="h-24 text-[10px] bg-black/40" />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="text-[10px] text-brand-orange font-bold uppercase flex items-center gap-1"><Coffee size={10}/> Founder Note</label>
                                        <button onClick={() => generateAiContent('founderNote')} disabled={aiGenerating==='founderNote'} className="text-[9px] text-brand-orange/70 flex items-center gap-1">{aiGenerating==='founderNote' ? <LoadingSpinner size={8}/> : <><Wand2 size={10}/> AI Gen</>}</button>
                                    </div>
                                    <TextArea value={itemForm.founderNote || ''} onChange={(e: any) => setItemForm({...itemForm, founderNote: e.target.value})} placeholder="Pesan Mas Amin..." className="h-24 text-[10px] bg-brand-orange/5 border-brand-orange/10" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BROADCAST & SYNC */}
                    <div className="bg-brand-dark border border-blue-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-45"><Zap size={100} className="text-blue-500"/></div>
                        <h4 className="text-white font-bold text-sm mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
                            <Zap size={16} className="text-blue-400" /> Target & Broadcast
                        </h4>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block">Jenis Item:</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => setItemForm({...itemForm, role: 'base'})} className={`py-2 rounded-xl border text-[10px] font-bold transition-all flex items-center justify-center gap-2 ${itemForm.role === 'base' ? 'bg-brand-orange border-brand-orange text-white' : 'bg-black/20 border-white/5 text-gray-500'}`}><Box size={14}/> Paket Utama</button>
                                    <button onClick={() => setItemForm({...itemForm, role: 'addon'})} className={`py-2 rounded-xl border text-[10px] font-bold transition-all flex items-center justify-center gap-2 ${itemForm.role === 'addon' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-black/20 border-white/5 text-gray-500'}`}><Zap size={14}/> Add-on</button>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Terapkan Ke (Multi-select):</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {SERVICE_TARGETS.map(svc => {
                                        const isSelected = itemForm.targets.includes(svc.id);
                                        return (
                                            <button key={svc.id} onClick={() => { const newTargets = isSelected ? itemForm.targets.filter(t => t !== svc.id) : [...itemForm.targets, svc.id]; setItemForm({...itemForm, targets: newTargets}); }} className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all text-center ${isSelected ? 'bg-brand-orange/20 border-brand-orange text-white shadow-neon-text' : 'bg-black/40 border-white/5 text-gray-600 hover:border-white/20'}`}>
                                                <svc.icon size={16} />
                                                <span className="text-[9px] font-bold uppercase">{svc.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            <Button onClick={handleBroadcastSave} disabled={saving} className="w-full py-4 shadow-neon font-bold text-sm bg-brand-gradient">
                                {saving ? <LoadingSpinner /> : <><Save size={18}/> SYNC ITEM KE LAYANAN</>}
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- HELPER COMPONENT: ITEM ROW ---
const ItemRow: React.FC<{ 
    item: any; onEdit: () => void; onDelete: () => void; role: string; 
}> = ({ item, onEdit, onDelete, role }) => (
    <div className="flex items-center justify-between p-3 bg-brand-card/40 border border-white/5 rounded-xl group hover:border-brand-orange/30 transition-all cursor-pointer" onClick={onEdit}>
        <div className="flex-1 min-w-0 pr-4">
            <h6 className="text-xs font-bold text-white truncate group-hover:text-brand-orange">{item.label}</h6>
            <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold font-mono ${role === 'base' ? 'text-brand-orange' : 'text-blue-400'}`}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}
                </span>
                {(item.longDesc || item.founderNote) && <div className="flex gap-1"><div className="w-1 h-1 rounded-full bg-blue-500" /></div>}
            </div>
        </div>
        <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"><Trash2 size={12}/></button>
            <div className="p-1.5 text-gray-600"><ChevronRight size={14}/></div>
        </div>
    </div>
);
