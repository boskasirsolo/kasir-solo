
import React from 'react';
import { PlayCircle, Edit, Trash2, X } from 'lucide-react';
import { Input, Button, LoadingSpinner } from '../ui';
import { useTutorialLogic } from './logic';

export const TutorialPanel = () => {
    const { tutorials, form, setForm, loading, handleSubmit, deleteItem } = useTutorialLogic();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* LEFT: LIST */}
            <div className="bg-brand-dark rounded-xl border border-white/5 p-4 overflow-y-auto custom-scrollbar">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Daftar Video</h4>
                <div className="space-y-2">
                    {tutorials.map(t => (
                        <div key={t.id} className="p-3 bg-brand-card rounded border border-white/5 flex justify-between items-center group">
                            <div className="flex items-center gap-3">
                                <PlayCircle size={16} className="text-red-500"/>
                                <div>
                                    <p className="text-xs font-bold text-white">{t.title}</p>
                                    <a href={t.video_url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline line-clamp-1 max-w-[200px]">{t.video_url}</a>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setForm(t)} className="text-blue-400 hover:text-white"><Edit size={14}/></button>
                                <button onClick={() => deleteItem(t.id)} className="text-red-400 hover:text-white"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    ))}
                    {tutorials.length === 0 && <div className="text-gray-500 text-xs text-center py-4">Belum ada video.</div>}
                </div>
            </div>

            {/* RIGHT: EDITOR */}
            <div className="bg-brand-dark rounded-xl border border-white/5 p-6 h-fit">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-white">{form.id ? 'Edit Video' : 'Tambah Video'}</h3>
                    {form.id ? <button onClick={() => setForm({id:0, title:'', video_url:''})} className="text-gray-500 hover:text-white"><X size={14}/></button> : null}
                </div>
                <div className="space-y-3">
                    <Input 
                        value={form.title || ''} 
                        onChange={e => setForm(p => ({...p, title: e.target.value}))} 
                        placeholder="Judul Video" 
                        className="text-xs"
                    />
                    <Input 
                        value={form.video_url || ''} 
                        onChange={e => setForm(p => ({...p, video_url: e.target.value}))} 
                        placeholder="https://youtube.com/..." 
                        className="text-xs"
                    />
                    <Button onClick={handleSubmit} disabled={loading} className="w-full text-xs py-2">
                        {loading ? <LoadingSpinner/> : 'Simpan Video'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
