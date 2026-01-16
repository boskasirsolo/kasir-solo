
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
                prompt = `Role: UX Copywriter. Task: Write ONE very short, punchy teaser/tooltip (max 12 words) for a service item named: "${itemForm.label}". Focus on the immediate benefit. Use 'Gue/Lo' style if possible but keep it professional. Indonesian language. STRICT RULES: NO INTRO, NO OPTIONS, NO QUOTES, NO EXPLANATION, JUST THE FINAL TEXT.`;
            } else if (targetField === 'founderNote') {
                prompt = `Role: Founder Amin Maghfuri. Task: Write a short, gritty "Founder Note" (1-2 sentences) using 'Gue/Lo' for item: "${itemForm.label}". Focus on why this avoids pain for the business owner. NO INTRO, NO QUOTES, JUST THE TEXT.`;
            } else {
                prompt = `Role: Street-smart copywriter. Task: Write a persuasive detail (Markdown, 2 paragraphs) using 'Gue/Lo' for item: "${itemForm.label}". Use bold for emphasis. NO INTRO, NO TITLE, JUST THE CONTENT.`;
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
                                <label className="text