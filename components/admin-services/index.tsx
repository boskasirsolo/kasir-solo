
import React, { useState, useEffect } from 'react';
import { 
    Globe, Layers, LineChart, ShieldCheck, Save, Plus, 
    Trash2, Calculator, Sparkles, Wand2, Coffee, 
    Edit3, RefreshCw, Box, Zap, LayoutList, ChevronRight,
    Search, CheckSquare, Square
} from 'lucide-react';
import { SiteConfig, ServicePageData } from '../../types';
import { CalcOption } from '../shared/calculator/types';
import { supabase, formatNumberInput, cleanNumberInput, callGeminiWithRotation } from '../../utils';
import { LoadingSpinner, Button, Input, TextArea } from '../ui';

const SERVICE_TARGETS = [
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'webapp', label: 'Custom App', icon: Layers },
    { id: 'seo', label: 'SEO Traffic', icon: LineChart },
    { id: 'maintenance', label: 'Maintenance', icon: ShieldCheck }
];

export const AdminServices = ({ config }: { config: SiteConfig }) => {
    // --- STATE ---
    const [allServices, setAllServices] = useState<ServicePageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [aiGenerating, setAiGenerating] = useState<string | null>(null);
    const [filterSlug, setFilterSlug] = useState('website');

    // Editor Form State
    const [itemForm, setItemForm] = useState<CalcOption & { targets: string[], role: 'base' | 'addon' }>({
        id: '',
        label: '',
        price: 0,
        desc: '',
        longDesc: '',
        founderNote: '',
        targets: ['website'], 
        role: 'addon'
    });

    useEffect(() => { fetchAllServices(); }, []);

    const fetchAllServices = async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data: res } = await supabase.from('services').select('*');
            if (res) {
                setAllServices(res);
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const resetForm = () => {
        setItemForm({
            id: '', label: '', price: 0, desc: '', longDesc: '', founderNote: '',
            targets: [filterSlug], role: 'addon'
        });
    };

    // --- AI LOGIC ---
    const generateAiContent = async (targetField: 'desc' | 'longDesc' | 'founderNote') => {
        if (!itemForm.label) return alert("Isi Label Item dulu Bos.");
        setAiGenerating(targetField);
        try {
            let prompt = "";
            if (targetField === 'desc') {
                prompt = `Role: UX Copywriter. Task: Write ONE very short tooltip (max 10 words) for service: "${itemForm.label}". Use 'Gue/Lo' style. Indonesian. NO INTRO.`;
            } else if (targetField === 'founderNote') {
                prompt = `Role: Founder PT Mesin Kasir Solo. Task: Write a short, personal 'Founder Note' (1-2 sentences) about why "${itemForm.label}" is important for a business. Use 'Gue/Lo'. NO INTRO.`;
            } else {
                prompt = `Role: Persuasive copywriter. Task: Write a detailed benefit (Markdown, 2 paragraphs) for service: "${itemForm.label}". Focus on ROI. Use 'Gue/Lo'. NO INTRO.`;
            }
            
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setItemForm(prev => ({ ...prev, [targetField]: res.text?.trim() || "" }));
        } catch (e) {
            alert("Gemini lagi pusing.");
        } finally { setAiGenerating(null); }
    };

    // --- SAVE LOGIC (BROADCAST SYSTEM) ---
    const handleSyncSave = async () => {
        if (!itemForm.label || itemForm.targets.length === 0) return alert("Lengkapi data dan pilih minimal 1 target layanan.");
        
        setSaving(true);
        try {
            const itemId = itemForm.id || `item_${Date.now()}`;
            
            // Loop semua target layanan (Broadcast)
            const updatePromises = itemForm.targets.map(async (slug) => {
                const service = allServices.find(s => s.slug === slug);
                if (!service) return;

                const calcData = { ...service.calc_data };
                const listKey = itemForm.role === 'base' ? 'baseOptions' : 'addons';
                
                if (!calcData[listKey]) calcData[listKey] = [];

                // Cek apakah item sudah ada di list ini
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
            alert("Item berhasil disinkronkan ke semua target!");
            await fetchAllServices();
            resetForm();
        } catch (e: any) {
            alert("Gagal simpan: " + e.message);
        } finally { setSaving(false); }
    };

    const deleteItem = async (serviceSlug: string, itemId: string, role: 'base' | 'addon') => {
        if (!confirm("Hapus item dari layanan ini?")) return;
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

    if (loading) return <div className="flex justify-center p-20"><LoadingSpinner size={32}/></div>;

    const currentService = allServices.find(s => s.slug === filterSlug);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in pb-20">
            
            {/* COLUMN 1: LIST ARSENAL (LEFT) */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                    <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                        <LayoutList size={18} className="text-brand-orange"/> Inventori Layanan
                    </h4>
                    <div className="flex bg-brand-dark p-1 rounded-xl border border-white/10 overflow-x-auto custom-scrollbar-hide mb-6">
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

                    <div className="space-y-6">
                        {/* PAKET UTAMA */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2"><Box size={14}/> Paket Utama</span>
                                <span className="text-[9px] text-gray-600 font-mono">Count: {currentService?.calc_data?.baseOptions?.length || 0}</span>
                            </div>
                            <div className="space-y-2">
                                {currentService?.calc_data?.baseOptions?.map((item: any) => (
                                    <ItemCard key={item.id} item={item} role="base" onEdit={() => setItemForm({...item, targets: [filterSlug], role: 'base'})} onDelete={() => deleteItem(filterSlug, item.id, 'base')} />
                                ))}
                                {(!currentService?.calc_data?.baseOptions?.length) && <p className="text-[10px] text-gray-700 italic text-center py-4">Data kosong di database.</p>}
                            </div>
                        </div>

                        {/* ADDONS */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2"><Zap size={14}/> Add-ons</span>
                                <span className="text-[9px] text-gray-600 font-mono">Count: {currentService?.calc_data?.addons?.length || 0}</span>
                            </div>
                            <div className="space-y-2">
                                {currentService?.calc_data?.addons?.map((item: any) => (
                                    <ItemCard key={item.id} item={item} role="addon" onEdit={() => setItemForm({...item, targets: [filterSlug], role: 'addon'})} onDelete={() => deleteItem(filterSlug, item.id, 'addon')} />
                                ))}
                                {(!currentService?.calc_data?.addons?.length) && <p className="text-[10px] text-gray-700 italic text-center py-4">Data kosong di database.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* COLUMN 2: EDITOR (RIGHT - STICKY) */}
            <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-6">
                <div className="bg-brand-card border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Edit3 size={100}/></div>
                    
                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            <Sparkles size={20} className="text-brand-orange" /> 
                            {itemForm.id ? 'Mode Edit Item' : 'Tambah Item Baru'}
                        </h3>
                        <button onClick={resetForm} className="text-gray-500 hover:text-white transition-colors"><RefreshCw size={18}/></button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Label Item</label>
                            <Input value={itemForm.label} onChange={e => setItemForm({...itemForm, label: e.target.value})} placeholder="Cth: Starter Pack" className="bg-black/40"/>
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Harga Mahar (IDR)</label>
                            <Input value={formatNumberInput(itemForm.price)} onChange={e => setItemForm({...itemForm, price: cleanNumberInput(e.target.value)})} className="bg-black/40 text-brand-orange font-bold font-mono"/>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] text-gray-500 font-bold uppercase">Tooltip Singkat</label>
                                <button onClick={() => generateAiContent('desc')} disabled={!!aiGenerating} className="text-[9px] text-blue-400 flex items-center gap-1 hover:text-white transition-colors">
                                    {aiGenerating === 'desc' ? <LoadingSpinner size={8}/> : <><Sparkles size={10}/> AI Gen</>}
                                </button>
                            </div>
                            <Input value={itemForm.desc || ''} onChange={e => setItemForm({...itemForm, desc: e.target.value})} placeholder="Teaser 1 kalimat..." className="bg-black/20 text-xs" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase">Detail Strategi (Markdown)</label>
                                    <button onClick={() => generateAiContent('longDesc')} disabled={!!aiGenerating} className="text-[9px] text-blue-400 flex items-center gap-1">
                                        {aiGenerating === 'longDesc' ? <LoadingSpinner size={8}/> : <><Sparkles size={10}/> AI Gen</>}
                                    </button>
                                </div>
                                <TextArea value={itemForm.longDesc || ''} onChange={e => setItemForm({...itemForm, longDesc: e.target.value})} className="h-32 text-[10px] bg-black/40" placeholder="Penerangan detail..." />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] text-brand-orange font-bold uppercase flex items-center gap-1"><Coffee size={10}/> Founder Note</label>
                                    <button onClick={() => generateAiContent('founderNote')} disabled={!!aiGenerating} className="text-[9px] text-brand-orange/70 flex items-center gap-1">
                                        {aiGenerating === 'founderNote' ? <LoadingSpinner size={8}/> : <><Wand2 size={10}/> AI Gen</>}
                                    </button>
                                </div>
                                <TextArea value={itemForm.founderNote || ''} onChange={e => setItemForm({...itemForm, founderNote: e.target.value})} className="h-32 text-[10px] bg-brand-orange/5 border-brand-orange/10 italic" placeholder="Pesan pribadi Mas Amin..." />
                            </div>
                        </div>
                    </div>

                    {/* BROADCAST SECTION */}
                    <div className="mt-8 pt-8 border-t border-white/5">
                        <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                            <Zap size={16} className="text-blue-400" /> Broadcast & Role
                        </h4>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block">Jenis Item:</label>
                                <div className="flex gap-2">
                                    <button onClick={() => setItemForm({...itemForm, role: 'base'})} className={`flex-1 py-2 rounded-xl border text-[10px] font-bold transition-all ${itemForm.role === 'base' ? 'bg-brand-orange border-brand-orange text-white' : 'bg-black/20 border-white/5 text-gray-500'}`}>PAKET UTAMA</button>
                                    <button onClick={() => setItemForm({...itemForm, role: 'addon'})} className={`flex-1 py-2 rounded-xl border text-[10px] font-bold transition-all ${itemForm.role === 'addon' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-black/20 border-white/5 text-gray-500'}`}>ADD-ON</button>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block">Terapkan Ke:</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SERVICE_TARGETS.map(svc => {
                                        const isSelected = itemForm.targets.includes(svc.id);
                                        return (
                                            <button 
                                                key={svc.id} 
                                                onClick={() => {
                                                    const newTargets = isSelected ? itemForm.targets.filter(t => t !== svc.id) : [...itemForm.targets, svc.id];
                                                    setItemForm({...itemForm, targets: newTargets});
                                                }}
                                                className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-[9px] font-bold ${isSelected ? 'bg-brand-orange/20 border-brand-orange text-white' : 'bg-black/40 border-white/5 text-gray-600'}`}
                                            >
                                                {isSelected ? <CheckSquare size={12}/> : <Square size={12}/>}
                                                {svc.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <Button onClick={handleSyncSave} disabled={saving} className="w-full mt-8 py-4 shadow-neon font-bold text-sm bg-brand-gradient">
                            {saving ? <LoadingSpinner /> : <><Save size={18}/> SIMPAN & BROADCAST ITEM</>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ItemCard = ({ item, onEdit, onDelete, role }: any) => (
    <div className="flex items-center justify-between p-3 bg-brand-card/60 border border-white/5 rounded-xl group hover:border-brand-orange/30 transition-all cursor-pointer" onClick={onEdit}>
        <div className="flex-1 min-w-0 pr-4">
            <h6 className="text-xs font-bold text-white truncate group-hover:text-brand-orange">{item.label}</h6>
            <p className={`text-[10px] font-bold font-mono ${role === 'base' ? 'text-brand-orange' : 'text-blue-400'}`}>
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}
            </p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"><Trash2 size={14}/></button>
            <div className="p-1.5 text-gray-600"><ChevronRight size={16}/></div>
        </div>
    </div>
);
