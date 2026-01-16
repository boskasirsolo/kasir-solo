
import React, { useState, useEffect } from 'react';
import { 
    Globe, Layers, LineChart, ShieldCheck, Save, Plus, 
    Trash2, Calculator, Sparkles, Wand2, Coffee, 
    CheckSquare, Square, Search, Edit3, RefreshCw,
    Box, Zap, LayoutList
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
        targets: [], // ID Layanan (website, webapp, etc)
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
                prompt = `Role: UX Copywriter. Task: Write a very short, punchy teaser/tooltip (max 12 words) for a service item named: "${itemForm.label}". Focus on the immediate benefit. Use 'Gue/Lo' style if possible but keep it professional. Indonesian language.`;
            } else if (targetField === 'founderNote') {
                prompt = `Role: Founder Amin Maghfuri. Task: Write a short, gritty "Founder Note" (1-2 sentences) using 'Gue/Lo' for item: "${itemForm.label}". Focus on why this avoids pain for the business owner.`;
            } else {
                prompt = `Role: Street-smart copywriter. Task: Write a persuasive detail (Markdown, 2 paragraphs) using 'Gue/Lo' for item: "${itemForm.label}". Use bold for emphasis.`;
            }
            
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setItemForm(prev => ({ ...prev, [targetField]: res.text?.trim() || "" }));
        } catch (e) {
            alert("Gemini lagi pusing. Coba lagi.");
        } finally { setAiGenerating(null); }
    };

    // --- HANDLERS: SAVE (SYNC ENGINE) ---
    const handleBroadcastSave = async () => {
        if (!itemForm.label || itemForm.targets.length === 0) {
            return alert("Nama Item dan Minimal 1 Target Layanan wajib diisi!");
        }

        setSaving(true);
        try {
            const itemId = itemForm.id || `item_${Date.now()}`;

            // Loop through all selected services to inject the item
            const updatePromises = itemForm.targets.map(async (slug) => {
                const service = allServices.find(s => s.slug === slug);
                if (!service) return;

                const calcData = { ...service.calc_data };
                const listKey = itemForm.role === 'base' ? 'baseOptions' : 'addons';
                
                // Ensure array exists
                if (!calcData[listKey]) calcData[listKey] = [];

                // Upsert item into the specific service's JSON
                const existingIdx = calcData[listKey].findIndex((o: any) => o.id === itemId);
                const itemPayload = {
                    id: itemId,
                    label: itemForm.label,
                    price: itemForm.price,
                    desc: itemForm.desc,
                    longDesc: itemForm.longDesc,
                    founderNote: itemForm.founderNote
                };

                if (existingIdx > -1) {
                    calcData[listKey][existingIdx] = itemPayload;
                } else {
                    calcData[listKey].push(itemPayload);
                }

                // Update Supabase
                return supabase!.from('services').update({ calc_data: calcData }).eq('slug', slug);
            });

            await Promise.all(updatePromises);
            alert(`Item "${itemForm.label}" berhasil disebar ke ${itemForm.targets.length} layanan!`);
            await fetchAllServices(); // Refresh list
            resetForm();
        } catch (e: any) {
            alert("Gagal broadcast: " + e.message);
        } finally { setSaving(false); }
    };

    const deleteItemFromService = async (serviceSlug: string, itemId: string, role: 'base' | 'addon') => {
        if (!confirm("Hapus item ini dari layanan ini?")) return;
        
        const service = allServices.find(s => s.slug === slugify(serviceSlug));
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
        setItemForm({
            ...item,
            targets: [serviceSlug],
            role: role
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div className="flex justify-center p-20"><LoadingSpinner size={32}/></div>;

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            
            {/* --- TOP: THE UNIVERSAL EDITOR --- */}
            <div className="bg-brand-dark/80 border border-brand-orange/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 pointer-events-none">
                    <Sparkles size={120} className="text-brand-orange" />
                </div>

                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <div>
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            <Zap size={20} className="text-brand-orange" /> Editor Item Layanan
                        </h3>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Input Sekali, Sebarkan ke Mana Saja</p>
                    </div>
                    {itemForm.id && (
                        <button onClick={resetForm} className="text-[10px] text-red-400 font-bold hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                            BATAL EDIT
                        </button>
                    )}
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    
                    {/* Column A: Core Info */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-1.5 block">Nama Item (Label)</label>
                                <Input 
                                    value={itemForm.label} 
                                    onChange={(e: any) => setItemForm({...itemForm, label: e.target.value})} 
                                    placeholder="Cth: Landing Page Premium / Domain .com"
                                    className="bg-black/40 font-bold"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-1.5 block">Harga (IDR)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-brand-orange font-bold text-xs">RP</span>
                                    <Input 
                                        value={formatNumberInput(itemForm.price)} 
                                        onChange={(e: any) => setItemForm({...itemForm, price: cleanNumberInput(e.target.value)})} 
                                        className="pl-9 bg-black/40 font-bold text-brand-orange"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-[10px] text-gray-500 font-bold uppercase block">Deskripsi Singkat (Tooltip)</label>
                                <button onClick={() => generateAiContent('desc')} disabled={aiGenerating==='desc'} className="text-[9px] text-blue-400 hover:text-white flex items-center gap-1">
                                    {aiGenerating==='desc' ? <LoadingSpinner size={10}/> : <><Sparkles size={10}/> AI Magic</>}
                                </button>
                            </div>
                            <TextArea 
                                value={itemForm.desc || ''} 
                                onChange={(e: any) => setItemForm({...itemForm, desc: e.target.value})} 
                                placeholder="Jelasin dikit pas user hover..."
                                className="h-16 bg-black/20"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase">Hasutan Detail (Markdown)</label>
                                    <button onClick={() => generateAiContent('longDesc')} disabled={aiGenerating==='longDesc'} className="text-[9px] text-blue-400 hover:text-white flex items-center gap-1">
                                        {aiGenerating==='longDesc' ? <LoadingSpinner size={10}/> : <><Sparkles size={10}/> AI Magic</>}
                                    </button>
                                </div>
                                <TextArea 
                                    value={itemForm.longDesc || ''} 
                                    onChange={(e: any) => setItemForm({...itemForm, longDesc: e.target.value})} 
                                    placeholder="Muncul di side-drawer..."
                                    className="h-32 text-xs bg-black/40"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] text-brand-orange font-bold uppercase flex items-center gap-1"><Coffee size={10}/> Founder Note</label>
                                    <button onClick={() => generateAiContent('founderNote')} disabled={aiGenerating==='founderNote'} className="text-[9px] text-brand-orange/70 hover:text-brand-orange flex items-center gap-1">
                                        {aiGenerating==='founderNote' ? <LoadingSpinner size={10}/> : <Wand2 size={10}/>}
                                    </button>
                                </div>
                                <TextArea 
                                    value={itemForm.founderNote || ''} 
                                    onChange={(e: any) => setItemForm({...itemForm, founderNote: e.target.value})} 
                                    placeholder="Pesan pribadi Mas Amin..."
                                    className="h-32 text-xs bg-brand-orange/5 border-brand-orange/10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Column B: SYNC CONTROLS */}
                    <div className="lg:col-span-5 bg-black/30 rounded-2xl p-6 border border-white/5 flex flex-col">
                        <h4 className="text-white font-bold text-sm mb-4 border-b border-white/10 pb-3 flex items-center gap-2">
                            <LayoutList size={16} className="text-brand-orange"/> Target Broadcast
                        </h4>

                        <div className="space-y-6 flex-grow">
                            {/* Type Picker */}
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block">Sebagai Apa?</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => setItemForm({...itemForm, role: 'base'})}
                                        className={`py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${itemForm.role === 'base' ? 'bg-brand-orange border-brand-orange text-white shadow-neon' : 'bg-brand-dark border-white/10 text-gray-500'}`}
                                    >
                                        <Box size={14}/> Paket Utama
                                    </button>
                                    <button 
                                        onClick={() => setItemForm({...itemForm, role: 'addon'})}
                                        className={`py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${itemForm.role === 'addon' ? 'bg-blue-600 border-blue-600 text-white shadow-neon' : 'bg-brand-dark border-white/10 text-gray-500'}`}
                                    >
                                        <Zap size={14}/> Add-on / Modul
                                    </button>
                                </div>
                            </div>

                            {/* Service Selection */}
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Terapkan Ke Layanan (Multi-select):</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SERVICE_TARGETS.map(svc => {
                                        const isSelected = itemForm.targets.includes(svc.id);
                                        return (
                                            <button 
                                                key={svc.id}
                                                onClick={() => {
                                                    const newTargets = isSelected 
                                                        ? itemForm.targets.filter(t => t !== svc.id) 
                                                        : [...itemForm.targets, svc.id];
                                                    setItemForm({...itemForm, targets: newTargets});
                                                }}
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isSelected ? 'bg-brand-orange/20 border-brand-orange text-white shadow-neon-text' : 'bg-black/20 border-white/5 text-gray-500 hover:border-white/20'}`}
                                            >
                                                {isSelected ? <CheckSquare size={18} className="text-brand-orange" /> : <Square size={18} />}
                                                <div>
                                                    <p className="text-xs font-bold">{svc.label}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <Button 
                                onClick={handleBroadcastSave} 
                                disabled={saving} 
                                className="w-full py-4 shadow-neon font-bold text-sm bg-brand-gradient"
                            >
                                {saving ? <LoadingSpinner /> : <><Save size={18}/> SYNC KE SEMUA LAYANAN TERPILIH</>}
                            </Button>
                            <p className="text-[9px] text-gray-600 text-center mt-3 uppercase font-bold tracking-tighter">*Data lama akan di-update jika ID item sama</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM: FILTERED LIST --- */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h4 className="text-white font-bold text-lg flex items-center gap-2">
                        <LayoutList size={20} className="text-brand-orange"/> Inventori Item Per Layanan
                    </h4>
                    
                    <div className="flex bg-brand-dark p-1 rounded-xl border border-white/5 overflow-x-auto custom-scrollbar-hide w-full md:w-auto">
                        {SERVICE_TARGETS.map(svc => (
                            <button
                                key={svc.id}
                                onClick={() => setFilterSlug(svc.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filterSlug === svc.id ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500 hover:text-white'}`}
                            >
                                <svc.icon size={14} /> {svc.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-brand-dark/30 border border-white/5 rounded-3xl overflow-hidden">
                    <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                        
                        {/* PAKET UTAMA LIST */}
                        <div className="p-6 space-y-4">
                            <h5 className="text-[11px] font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2 border-b border-brand-orange/20 pb-2">
                                <Box size={14}/> Paket Utama ({allServices.find(s => s.slug === filterSlug)?.calc_data?.baseOptions?.length || 0})
                            </h5>
                            <div className="space-y-2">
                                {allServices.find(s => s.slug === filterSlug)?.calc_data?.baseOptions?.map((item: any) => (
                                    <ItemRow 
                                        key={item.id} 
                                        item={item} 
                                        role="base" 
                                        onEdit={() => editItemFromList(filterSlug, item, 'base')}
                                        onDelete={() => deleteItemFromService(filterSlug, item.id, 'base')}
                                    />
                                ))}
                                {(!allServices.find(s => s.slug === filterSlug)?.calc_data?.baseOptions?.length) && <p className="text-xs text-gray-600 italic p-4 text-center">Belum ada paket utama.</p>}
                            </div>
                        </div>

                        {/* ADDONS LIST */}
                        <div className="p-6 space-y-4">
                            <h5 className="text-[11px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2 border-b border-blue-500/20 pb-2">
                                <Zap size={14}/> Add-ons ({allServices.find(s => s.slug === filterSlug)?.calc_data?.addons?.length || 0})
                            </h5>
                            <div className="space-y-2">
                                {allServices.find(s => s.slug === filterSlug)?.calc_data?.addons?.map((item: any) => (
                                    <ItemRow 
                                        key={item.id} 
                                        item={item} 
                                        role="addon" 
                                        onEdit={() => editItemFromList(filterSlug, item, 'addon')}
                                        onDelete={() => deleteItemFromService(filterSlug, item.id, 'addon')}
                                    />
                                ))}
                                {(!allServices.find(s => s.slug === filterSlug)?.calc_data?.addons?.length) && <p className="text-xs text-gray-600 italic p-4 text-center">Belum ada add-ons.</p>}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

// --- HELPER COMPONENT: ITEM ROW ---
/**
 * FIX: Added React.FC type definition and updated onDelete type to allow void | Promise<void>.
 * This resolves the TypeScript errors regarding the 'key' prop and async callback assignability.
 */
const ItemRow: React.FC<{ 
    item: any; 
    onEdit: () => void; 
    onDelete: () => void | Promise<void>; 
    role: string; 
}> = ({ item, onEdit, onDelete, role }) => {
    const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price);
    
    return (
        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl group hover:border-brand-orange/30 transition-all">
            <div className="flex-1 min-w-0 pr-4">
                <h6 className="text-sm font-bold text-white truncate">{item.label}</h6>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-brand-orange font-bold font-mono">{formattedPrice}</span>
                    {(item.longDesc || item.founderNote) && (
                        <div className="flex gap-1">
                            {item.longDesc && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Ada Detail Hasutan"></span>}
                            {item.founderNote && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" title="Ada Founder Note"></span>}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-2 shrink-0">
                <button onClick={onEdit} className="p-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all" title="Edit Item"><Edit3 size={14}/></button>
                <button onClick={onDelete} className="p-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all" title="Hapus dari Layanan ini"><Trash2 size={14}/></button>
            </div>
        </div>
    );
};
