
import React from 'react';
import { Brain, Sparkles, Send, Trash2, Edit, Save, Plus, MessageSquare, Zap, Bot } from 'lucide-react';
import { useTrainerLogic } from './logic';
import { KNOWLEDGE_CATEGORIES, AIKnowledge } from './types';
import { Button, Input, TextArea, LoadingSpinner } from '../../ui';

export const SibosTrainer = () => {
    const { state, actions } = useTrainerLogic();

    return (
        <div className="grid lg:grid-cols-12 gap-6 h-full min-h-[700px] overflow-hidden">
            
            {/* PANEL 1: LIST MEMORY (25%) */}
            <div className="lg:col-span-3 bg-brand-dark border border-white/5 rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 bg-black/40 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <Brain size={16} className="text-brand-orange" /> Memory Vault
                    </h3>
                    <button onClick={() => actions.setForm({ category: 'pricing', title: '', content: '', is_active: true })} className="p-1.5 bg-brand-orange text-white rounded hover:bg-brand-action transition-all">
                        <Plus size={14}/>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {state.loading ? <div className="text-center py-10"><LoadingSpinner size={24}/></div> : 
                     state.knowledge.length === 0 ? <p className="text-gray-600 text-[10px] text-center py-10 italic">Otak Siboy masih kosong...</p> :
                     state.knowledge.map(k => (
                        <div 
                            key={k.id} 
                            onClick={() => actions.setForm(k)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all group ${state.form.id === k.id ? 'bg-brand-orange/10 border-brand-orange shadow-neon-text/10' : 'bg-brand-card/50 border-white/5 hover:border-white/20'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[14px]">{KNOWLEDGE_CATEGORIES.find(c => c.id === k.category)?.icon}</span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); actions.handleDelete(k.id); }} className="p-1 text-red-500 hover:bg-red-500/10 rounded"><Trash2 size={12}/></button>
                                </div>
                            </div>
                            <h5 className={`text-xs font-bold truncate ${state.form.id === k.id ? 'text-brand-orange' : 'text-white'}`}>{k.title}</h5>
                            <p className="text-[10px] text-gray-500 line-clamp-2 mt-1">{k.content}</p>
                            {!k.is_active && <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 rounded mt-2 inline-block font-bold">INACTIVE</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* PANEL 2: EDITOR (40%) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="bg-brand-card border border-white/10 rounded-2xl p-6 flex-grow flex flex-col shadow-xl">
                    <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                        <Edit size={20} className="text-brand-orange" /> {state.form.id ? 'Edit Memori' : 'Suntik Memori Baru'}
                    </h3>
                    
                    <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Kategori Pengetahuan</label>
                            <div className="grid grid-cols-3 gap-2">
                                {KNOWLEDGE_CATEGORIES.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => actions.setForm({...state.form, category: cat.id})}
                                        className={`p-2 rounded-lg border text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${state.form.category === cat.id ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text/20' : 'bg-black/20 text-gray-500 border-white/5 hover:border-white/20'}`}
                                    >
                                        <span className="text-lg">{cat.icon}</span>
                                        {cat.label.split(' ')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Konteks / Judul</label>
                            <Input 
                                value={state.form.title || ''} 
                                onChange={(e:any) => actions.setForm({...state.form, title: e.target.value})} 
                                placeholder="Misal: 'Promo Ramadhan' atau 'Aturan Retur'"
                                className="bg-black/40"
                            />
                        </div>

                        <div className="flex-1 flex flex-col">
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Isi Hafalan (Fakta/Data)</label>
                            <TextArea 
                                value={state.form.content || ''} 
                                onChange={(e:any) => actions.setForm({...state.form, content: e.target.value})} 
                                placeholder="Jelasin detailnya di sini biar Siboy paham..."
                                className="flex-grow bg-black/40 min-h-[200px] text-sm leading-relaxed"
                            />
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                            <input 
                                type="checkbox" 
                                checked={state.form.is_active} 
                                onChange={(e) => actions.setForm({...state.form, is_active: e.target.checked})}
                                className="accent-brand-orange w-4 h-4"
                            />
                            <span className="text-xs font-bold text-gray-400">Aktifkan memori ini? (Siboy bakal pake data ini buat jawab chat)</span>
                        </div>
                    </div>

                    <div className="pt-6 mt-auto">
                        <Button onClick={actions.handleSave} disabled={state.saving} className="w-full py-4 shadow-neon">
                            {state.saving ? <LoadingSpinner /> : <><Save size={18}/> SIMPAN KE OTAK AI</>}
                        </Button>
                    </div>
                </div>
            </div>

            {/* PANEL 3: SANDBOX (35%) */}
            <div className="lg:col-span-4 bg-brand-dark border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500"></div>
                
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                    <h3 className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <Zap size={16} className="text-teal-400" /> AI Sandbox Simulator
                    </h3>
                    <button onClick={actions.clearSandbox} className="text-[9px] text-gray-500 hover:text-white uppercase font-bold">Clear Chat</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/40">
                    {state.sandboxMessages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 opacity-30">
                            <Bot size={48} className="text-teal-400" />
                            <p className="text-xs text-gray-500">Gunakan area ini buat ngetes apakah Siboy udah paham hafalan baru lo.</p>
                        </div>
                    ) : (
                        state.sandboxMessages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-brand-orange text-white rounded-tr-none' : 'bg-white/10 text-gray-300 rounded-tl-none border border-white/5'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))
                    )}
                    {state.sandboxTyping && <div className="flex justify-start animate-pulse"><div className="bg-white/5 px-3 py-2 rounded-full text-[10px] text-gray-500">Siboy lagi mikir...</div></div>}
                </div>

                <div className="p-3 bg-brand-card border-t border-white/10">
                    <div className="flex gap-2">
                        <input 
                            value={state.sandboxInput}
                            onChange={(e) => actions.setSandboxInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && actions.testInSandbox()}
                            placeholder="Tes tanya Siboy..."
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-teal-500 transition-all"
                        />
                        <button onClick={actions.testInSandbox} className="p-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-lg transition-all">
                            <Send size={18}/>
                        </button>
                    </div>
                    <p className="text-[8px] text-gray-600 text-center mt-2 uppercase font-bold tracking-widest">Simulator Only • Gak Ngaruh ke Chat User</p>
                </div>
            </div>

        </div>
    );
};
