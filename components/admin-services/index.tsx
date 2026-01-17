
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
    Globe, Layers, LineChart, ShieldCheck, Save, Plus, 
    Trash2, Calculator, Sparkles, Wand2, Coffee, 
    Edit3, RefreshCw, Box, Zap, LayoutList, ChevronRight,
    Search, CheckSquare, Square, ListChecks, ArrowLeft
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

// --- SUB-COMPONENTS (Defined Outside to Prevent Flickering) ---

const EditorContent = ({ 
    itemForm, setItemForm, hideHeader, resetForm, generateAiContent, aiGenerating, handleSyncSave, saving 
}: any) => (
    <div className={`bg-brand-card border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden ${hideHeader ? 'border-none shadow-none bg-transparent h-auto' : 'p-6 h-full flex flex-col'}`}>
        {!hideHeader && <div className="absolute top-0 right-0 p-4 opacity-5"><Edit3 size={100}/></div>}
        
        {!hideHeader && (
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg leading-none">{itemForm.id ? 'Mode Edit Item' : 'Tambah Item Baru'}</h3>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Kalkulator Editor</p>
                    </div>
                </div>
                <button onClick={resetForm} className="text-gray-500 hover:text-white transition-colors" title="Bersihkan Form"><RefreshCw size={18}/></button>
            </div>
        )}

        <div className={`${hideHeader ? 'h-auto' : 'flex-1 overflow-y-auto custom-scrollbar'} space-y-6`}>
            <div className="mb-6 pb-6 border-b border-white/5">
                <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-blue-400" /> Broadcast & Tier Settings
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block">Jenis Item:</label>
                        <div className="flex gap-2">
                            <button onClick={() => setItemForm({...itemForm, role: 'base'})} className={`flex-1 py-2 rounded-xl border text-[10px] font-bold transition-all ${itemForm.role === 'base' ? 'bg-brand-orange border-brand-orange text-white' : 'bg-black/20 border-white/5 text-gray-500'}`}>PAKET UTAMA</button>
                            <button onClick={() => setItemForm({...itemForm, role: 'addon'})} className={`flex-1 py-2 rounded-xl border text-[10px] font-bold transition-all ${itemForm.role === 'addon' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-black/20 border-white/5 text-gray-500'}`}>ADD-ON</button>
                        </div>
                    </div>
                    {itemForm.role === 'addon' && (
                        <div className="animate-fade-in">
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block">Kategori Addon (Tier):</label>
                            <div className="flex gap-2">
                                <button onClick={() => setItemForm({...itemForm, tier: 'basic'})} className={`flex-1 py-2 rounded-xl border text-[10px] font-bold transition-all ${itemForm.tier === 'basic' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-black/20 border-white/5 text-gray-500'}`}>STANDAR (BASIC)</button>
                                <button onClick={() => setItemForm({...itemForm, tier: 'advanced'})} className={`flex-1 py-2 rounded-xl border text-[10px] font-bold transition-all ${itemForm.tier === 'advanced' ? 'bg-brand-orange/20 border-brand-orange text-brand-orange' : 'bg-black/20 border-white/5 text-gray-500'}`}>BOOSTER (PRO)</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block">Terapkan Ke Layanan:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {SERVICE_TARGETS.map(svc => {
                        const isSelected = itemForm.targets.includes(svc.id);
                        return (
                            <button 
                                key={svc.id} 
                                onClick={() => {
                                    const newTargets = isSelected ? itemForm.targets.filter((t:string) => t !== svc.id) : [...itemForm.targets, svc.id];
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

            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Label Item</label>
                    <Input value={itemForm.label} onChange={(e:any) => setItemForm({...itemForm, label: e.target.value})} placeholder="Cth: Starter Pack" className="bg-black/40"/>
                </div>
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Harga Mahar (IDR)</label>
                    <Input value={formatNumberInput(itemForm.price)} onChange={(e:any) => setItemForm({...itemForm, price: cleanNumberInput(e.target.value)})} className="bg-black/40 text-brand-orange font-bold font-mono"/>
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
                    <Input value={itemForm.desc || ''} onChange={(e:any) => setItemForm({...itemForm, desc: e.target.value})} placeholder="Teaser 1 kalimat untuk tooltip..." className="bg-black/20 text-xs" />
                </div>

                {itemForm.role === 'base' && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] text-brand-orange font-bold uppercase flex items-center gap-1"><ListChecks size={12}/> Standar Inclusions (Apa yang didapat?)</label>
                            <button onClick={() => generateAiContent('includes')} disabled={!!aiGenerating} className="text-[9px] text-blue-400 flex items-center gap-1">
                                {aiGenerating === 'includes' ? <LoadingSpinner size={8}/> : <><Wand2 size={10}/> AI List</>}
                            </button>
                        </div>
                        <TextArea 
                            value={itemForm.includesStr || ''} 
                            onChange={(e:any) => setItemForm({...itemForm, includesStr: e.target.value})} 
                            className="h-24 text-[10px] bg-black/40 leading-relaxed font-mono" 
                            placeholder="Satu item per baris..." 
                        />
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] text-gray-500 font-bold uppercase">Detail Strategi (Markdown)</label>
                                <button onClick={() => generateAiContent('longDesc')} disabled={!!aiGenerating} className="text-[9px] text-blue-400 flex items-center gap-1">
                                    {aiGenerating === 'longDesc' ? <LoadingSpinner size={8}/> : <><Sparkles size={10}/> AI Gen</>}
                                </button>
                            </div>
                            <TextArea value={itemForm.longDesc || ''} onChange={(e:any) => setItemForm({...itemForm, longDesc: e.target.value})} className="h-40 text-[10px] bg-black/40 leading-relaxed" placeholder="Penjelasan mendalam..." />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-[10px] text-brand-orange font-bold uppercase flex items-center gap-1"><Coffee size={10}/> Founder Note</label>
                                <button onClick={() => generateAiContent('founderNote')} disabled={!!aiGenerating} className="text-[9px] text-brand-orange/70 flex items-center gap-1">
                                    {aiGenerating === 'founderNote' ? <LoadingSpinner size={8}/> : <><Wand2 size={10}/> AI Gen</>}
                                </button>
                            </div>
                            <TextArea value={itemForm.founderNote || ''} onChange={(e:any) => setItemForm({...itemForm, founderNote: e.target.value})} className="h-40 text-[10px] bg-brand-orange/5 border-brand-orange/10 italic leading-relaxed" placeholder="Pesan pribadi Mas Amin..." />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 pb-12">
                <Button onClick={handleSyncSave} disabled={saving} className="w-full py-4 shadow-neon font-bold text-sm bg-brand-gradient">
                    {saving ? <LoadingSpinner /> : <><Save size={18}/> SIMPAN & BROADCAST</>}
                </Button>
            </div>
        </div>
    </div>
);

const MobileEditorOverlay = ({ itemForm, resetForm, children }: any) => (
    <div className="fixed inset-0 z-[9999] bg-brand-black flex flex-col animate-fade-in overflow-hidden lg:hidden overscroll-behavior-contain h-[100dvh]">
        <div className="p-4 bg-brand-card border-b border-white/10 flex items-center justify-between shrink-0 shadow-lg relative z-20">
            <button onClick={resetForm} className="flex items-center gap-2 text-brand-orange font-bold text-sm">
                <ArrowLeft size={20} /> Kembali
            </button>
            <h3 className="text-white font-bold text-sm truncate max-w-[200px]">
                {itemForm.id ? 'Edit Item' : 'Item Baru'}
            </h3>
            <div className="w-10"></div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar pb-32">
            {children}
        </div>
    </div>
);

// --- MAIN COMPONENT ---

export const AdminServices = ({ config }: { config: SiteConfig }) => {
    const [allServices, setAllServices] = useState<ServicePageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [aiGenerating, setAiGenerating] = useState<string | null>(null);
    const [filterSlug, setFilterSlug] = useState('website');
    const [itemSearchTerm, setItemSearchTerm] = useState('');
    const [showMobileEditor, setShowMobileEditor] = useState(false);

    const [itemForm, setItemForm] = useState<CalcOption & { targets: string[], role: 'base' | 'addon', includesStr: string }>({
        id: '',
        label: '',
        price: 0,
        desc: '',
        longDesc: '',
        founderNote: '',
        includesStr: '',
        targets: ['website'], 
        role: 'addon',
        tier: 'basic'
    });

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
            id: '', label: '', price: 0, desc: '', longDesc: '', founderNote: '', includesStr: '',
            targets: [filterSlug], role: 'addon', tier: 'basic'
        });
        setShowMobileEditor(false);
    };

    const startEditing = (item: any, role: 'base' | 'addon') => {
        const activeTargets = allServices.filter(svc => {
            const list = role === 'base' ? svc.calc_data?.baseOptions : svc.calc_data?.addons;
            return list?.some((it: any) => it.id === item.id);
        }).map(svc => svc.slug);

        setItemForm({
            ...item,
            includesStr: item.includes ? item.includes.join('\n') : '',
            targets: activeTargets.length > 0 ? activeTargets : [filterSlug],
            role: role,
            tier: item.tier || 'basic'
        });
        
        setShowMobileEditor(true);
    };

    const generateAiContent = async (targetField: 'desc' | 'longDesc' | 'founderNote' | 'includes') => {
        if (!itemForm.label) return alert("Isi Label Item dulu Bos.");
        setAiGenerating(targetField);
        try {
            let prompt = "";
            if (targetField === 'desc') {
                prompt = `Role: UX Copywriter. Task: Write ONE very short tooltip (max 10 words) for service: "${itemForm.label}". Use 'Gue/Lo' style. Indonesian. NO INTRO.`;
            } else if (targetField === 'founderNote') {
                prompt = `Role: Founder PT Mesin Kasir Solo. Task: Write a short, personal 'Founder Note' (1-2 sentences) about Kenapa item "${itemForm.label}" itu krusial buat bisnis UMKM. Use 'Gue/Lo'. NO INTRO.`;
            } else if (targetField === 'includes') {
                prompt = `Role: Product Specialist. Task: List 5 essential items/features included in service package: "${itemForm.label}". Format: One item per line. Tone: Professional. NO INTRO.`;
            } else {
                prompt = `Role: Persuasive copywriter. Task: Write a detailed value proposition (Markdown, 2 paragraphs) for service: "${itemForm.label}". Focus on ROI and solving problems. Use 'Gue/Lo'. NO INTRO.`;
            }
            
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            if (targetField === 'includes') {
                setItemForm(prev => ({ ...prev, includesStr: res.text?.trim() || "" }));
            } else {
                setItemForm(prev => ({ ...prev, [targetField]: res.text?.trim() || "" }));
            }
        } catch (e) {
            alert("Gemini lagi pusing.");
        } finally { setAiGenerating(null); }
    };

    const handleSyncSave = async () => {
        if (!itemForm.label || itemForm.targets.length === 0) return alert("Lengkapi data dan pilih minimal 1 target layanan.");
        
        setSaving(true);
        try {
            const itemId = itemForm.id || `item_${Date.now()}`;
            const includesArr = itemForm.includesStr ? itemForm.includesStr.split('\n').map(s => s.trim()).filter(Boolean) : [];
            
            await Promise.all(itemForm.targets.map(async (slug) => {
                const service = allServices.find(s => s.slug === slug);
                if (!service) return { success: false, slug };

                const calcData = JSON.parse(JSON.stringify(service.calc_data || { baseOptions: [], addons: [] }));
                const listKey = itemForm.role === 'base' ? 'baseOptions' : 'addons';
                
                if (!calcData[listKey]) calcData[listKey] = [];

                const existingIdx = calcData[listKey].findIndex((o: any) => o.id === itemId);
                const itemPayload = {
                    id: itemId, 
                    label: itemForm.label, 
                    price: itemForm.price,
                    desc: itemForm.desc, 
                    longDesc: itemForm.longDesc, 
                    founderNote: itemForm.founderNote,
                    includes: includesArr,
                    tier: itemForm.role === 'addon' ? itemForm.tier : undefined
                };

                if (existingIdx > -1) {
                    calcData[listKey][existingIdx] = itemPayload;
                } else {
                    calcData[listKey].push(itemPayload);
                }

                const { error } = await supabase!
                    .from('services')
                    .update({ calc_data: calcData })
                    .eq('slug', slug);

                if (error) throw error;
                return { success: true, slug };
            }));

            alert("Item berhasil disinkronkan ke semua target!");
            await fetchAllServices();
            resetForm();
        } catch (e: any) {
            alert("Gagal simpan: " + (e.message || "Server Error"));
        } finally { setSaving(false); }
    };

    const deleteItem = async (serviceSlug: string, itemId: string, role: 'base' | 'addon') => {
        if (!confirm("Hapus item dari layanan ini?")) return;
        const service = allServices.find(s => s.slug === serviceSlug);
        if (!service) return;
        
        const calcData = JSON.parse(JSON.stringify(service.calc_data));
        const listKey = role === 'base' ? 'baseOptions' : 'addons';
        calcData[listKey] = calcData[listKey].filter((o: any) => o.id !== itemId);
        
        try {
            const { error } = await supabase!.from('services').update({ calc_data: calcData }).eq('slug', serviceSlug);
            if (error) throw error;
            await fetchAllServices();
        } catch (e) { alert("Gagal hapus."); }
    };

    const currentService = allServices.find(s => s.slug === filterSlug);
    
    const filteredBase = useMemo(() => {
        return (currentService?.calc_data?.baseOptions || []).filter((it: any) => 
            it.label.toLowerCase().includes(itemSearchTerm.toLowerCase())
        );
    }, [currentService, itemSearchTerm]);

    const filteredAddons = useMemo(() => {
        return (currentService?.calc_data?.addons || []).filter((it: any) => 
            it.label.toLowerCase().includes(itemSearchTerm.toLowerCase())
        );
    }, [currentService, itemSearchTerm]);

    if (loading) return <div className="flex justify-center p-20"><LoadingSpinner size={32}/></div>;

    const commonEditorProps = {
        itemForm, setItemForm, resetForm, generateAiContent, aiGenerating, handleSyncSave, saving
    };

    return (
        <div className="relative">
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in pb-20 ${showMobileEditor ? 'hidden lg:grid' : 'grid'}`}>
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-white font-bold text-sm flex items-center gap-2">
                                <LayoutList size={18} className="text-brand-orange"/> Inventori Layanan
                            </h4>
                            <button 
                                onClick={resetForm} 
                                className="p-2 bg-brand-orange text-white rounded-lg shadow-neon lg:hidden"
                                title="Tambah Item Baru"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        
                        <div className="flex bg-brand-dark p-1 rounded-xl border border-white/10 overflow-x-auto custom-scrollbar-hide mb-4">
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

                        <div className="relative mb-6">
                            <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                            <input 
                                value={itemSearchTerm}
                                onChange={(e) => setItemSearchTerm(e.target.value)}
                                placeholder="Cari item di layanan ini..."
                                className="w-full bg-brand-card border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-brand-orange outline-none"
                            />
                        </div>

                        <div className="space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2"><Box size={14}/> Paket Utama</span>
                                    <span className="text-[9px] text-gray-600 font-mono">Hits: {filteredBase.length}</span>
                                </div>
                                <div className="space-y-2">
                                    {filteredBase.map((item: any) => (
                                        <ItemCard key={item.id} item={item} role="base" onEdit={() => startEditing(item, 'base')} onDelete={() => deleteItem(filterSlug, item.id, 'base')} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2"><Zap size={14}/> Add-ons</span>
                                    <span className="text-[9px] text-gray-600 font-mono">Hits: {filteredAddons.length}</span>
                                </div>
                                <div className="space-y-2">
                                    {filteredAddons.map((item: any) => (
                                        <ItemCard key={item.id} item={item} role="addon" onEdit={() => startEditing(item, 'addon')} onDelete={() => deleteItem(filterSlug, item.id, 'addon')} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:block lg:col-span-7 space-y-6 lg:sticky lg:top-6">
                    <EditorContent {...commonEditorProps} hideHeader={false} />
                </div>
            </div>

            {showMobileEditor && createPortal(
                <MobileEditorOverlay itemForm={itemForm} resetForm={resetForm}>
                    <EditorContent {...commonEditorProps} hideHeader={true} />
                </MobileEditorOverlay>, 
                document.body
            )}
        </div>
    );
};

const ItemCard = ({ item, onEdit, onDelete, role }: any) => (
    <div className="flex items-center justify-between p-3 bg-brand-card/60 border border-white/5 rounded-xl group hover:border-brand-orange/30 transition-all cursor-pointer" onClick={onEdit}>
        <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-0.5">
                <h6 className="text-xs font-bold text-white truncate group-hover:text-brand-orange">{item.label}</h6>
                {item.tier === 'advanced' && <Zap size={10} className="text-brand-orange animate-pulse" />}
            </div>
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
