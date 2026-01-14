
import React from 'react';
import { Save, X, Sparkles, MessageSquare } from 'lucide-react';
import { Input, TextArea, Button } from '../ui';
import { SEOTemplate } from './types';

export const TemplateEditorPanel = ({ 
    form, 
    setForm, 
    onSubmit, 
    onReset 
}: { 
    form: Partial<SEOTemplate>, 
    setForm: any, 
    onSubmit: () => void, 
    onReset: () => void 
}) => {
    return (
        <div className="bg-brand-dark border border-white/5 rounded-2xl p-6 shadow-2xl sticky top-6">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <Sparkles size={18} className="text-brand-orange"/>
                    {form.id ? 'Edit Template' : 'Template Baru'}
                </h3>
                {form.id !== 0 && (
                    <button onClick={onReset} className="text-gray-500 hover:text-white"><X size={18}/></button>
                )}
            </div>

            <div className="space-y-5">
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Nama Template (Internal)</label>
                    <Input 
                        value={form.title || ''} 
                        onChange={e => setForm({...form, title: e.target.value})} 
                        placeholder="Cth: Gaya Agresif / Gaya Edukasi"
                        className="text-xs"
                    />
                </div>

                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block flex items-center gap-2">
                        <MessageSquare size={12}/> Instruksi Narasi (AI Recipe)
                    </label>
                    <TextArea 
                        value={form.prompt_structure || ''} 
                        onChange={e => setForm({...form, prompt_structure: e.target.value})} 
                        placeholder="Jelaskan struktur narasi yang lo mau... Pake {{city}} sebagai placeholder nama kota."
                        className="h-40 text-xs leading-relaxed"
                    />
                    <div className="mt-2 p-3 bg-white/5 rounded border border-white/5 text-[9px] text-gray-500 italic">
                        {/* FIX: Membungkus teks dengan tanda kutip agar {{city}} tidak dianggap sebagai shorthand property object oleh React */}
                        {'Tips: "Fokus ke pengiriman aman ke {{city}}, sebutkan kita punya teknisi standby, gaya bahasa anak motor."'}
                    </div>
                </div>

                <Button onClick={onSubmit} className="w-full py-3 shadow-neon">
                    <Save size={16}/> SIMPAN MASTER TEMPLATE
                </Button>
            </div>
        </div>
    );
};
