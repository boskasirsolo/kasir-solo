
import React from 'react';
import { Edit, Trash2, X, Sparkles } from 'lucide-react';
import { Input, TextArea, Button, LoadingSpinner } from '../ui';
import { useFaqLogic } from './logic';

export const FaqPanel = () => {
    const { faqs, form, setForm, loading, handleSubmit, deleteItem, generateAnswer, isGenerating } = useFaqLogic();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* LEFT: LIST */}
            <div className="bg-brand-dark rounded-xl border border-white/5 p-4 overflow-y-auto custom-scrollbar">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Daftar FAQ</h4>
                <div className="space-y-2">
                    {faqs.map(f => (
                        <div key={f.id} className="p-3 bg-brand-card rounded border border-white/5 group">
                            <div className="flex justify-between items-start mb-1">
                                <p className="text-xs font-bold text-white w-full">{f.question}</p>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                                    <button onClick={() => setForm(f)} className="text-blue-400 hover:text-white"><Edit size={14}/></button>
                                    <button onClick={() => deleteItem(f.id)} className="text-red-400 hover:text-white"><Trash2 size={14}/></button>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 line-clamp-2">{f.answer}</p>
                        </div>
                    ))}
                    {faqs.length === 0 && <div className="text-gray-500 text-xs text-center py-4">Belum ada FAQ.</div>}
                </div>
            </div>

            {/* RIGHT: EDITOR */}
            <div className="bg-brand-dark rounded-xl border border-white/5 p-6 h-fit">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-white">{form.id ? 'Edit FAQ' : 'Tambah FAQ'}</h3>
                    {form.id ? <button onClick={() => setForm({id:0, question:'', answer:''})} className="text-gray-500 hover:text-white"><X size={14}/></button> : null}
                </div>
                <div className="space-y-3">
                    <Input 
                        value={form.question || ''} 
                        onChange={e => setForm(p => ({...p, question: e.target.value}))} 
                        placeholder="Pertanyaan (Q)" 
                        className="text-xs"
                    />
                    
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] text-gray-500 font-bold uppercase">Jawaban (A)</label>
                            <button 
                                onClick={generateAnswer} 
                                disabled={isGenerating} 
                                className="text-[10px] text-blue-400 hover:text-white flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                                {isGenerating ? <LoadingSpinner size={10}/> : <><Sparkles size={10}/> AI Answer</>}
                            </button>
                        </div>
                        <TextArea 
                            value={form.answer || ''} 
                            onChange={e => setForm(p => ({...p, answer: e.target.value}))} 
                            placeholder="Jawaban (A)" 
                            className="h-24 text-xs"
                        />
                    </div>

                    <Button onClick={handleSubmit} disabled={loading} className="w-full text-xs py-2">
                        {loading ? <LoadingSpinner/> : 'Simpan FAQ'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
