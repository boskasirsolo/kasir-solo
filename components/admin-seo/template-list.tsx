
import React from 'react';
import { FileText, Edit, Trash2, Plus, Sparkles } from 'lucide-react';
import { SEOTemplate } from './types';
import { supabase } from '../../utils';

export const TemplateListPanel = ({ 
    templates, 
    onEdit, 
    onAdd 
}: { 
    templates: SEOTemplate[], 
    onEdit: (t: SEOTemplate) => void,
    onAdd: () => void
}) => {
    const handleDelete = async (id: number) => {
        if (!confirm("Hapus master template ini?")) return;
        await supabase?.from('seo_templates').delete().eq('id', id);
        window.location.reload(); // Refresh simple way
    };

    return (
        <div className="bg-brand-dark border border-white/5 rounded-2xl flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <Sparkles size={16} className="text-brand-orange"/> Master Template Narasi
                </h3>
                <button onClick={onAdd} className="bg-brand-orange text-white p-2 rounded-lg"><Plus size={16}/></button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {templates.length === 0 && <p className="text-center text-gray-500 py-10 text-xs italic">Belum ada template. Buat satu untuk mempercepat kerja AI.</p>}
                {templates.map(tpl => (
                    <div key={tpl.id} className="bg-brand-card border border-white/5 p-4 rounded-xl group hover:border-brand-orange/30 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-white font-bold text-sm">{tpl.title}</h4>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onEdit(tpl)} className="text-blue-400 hover:text-white"><Edit size={14}/></button>
                                <button onClick={() => handleDelete(tpl.id)} className="text-red-400 hover:text-white"><Trash2 size={14}/></button>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                            {tpl.prompt_structure}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};
