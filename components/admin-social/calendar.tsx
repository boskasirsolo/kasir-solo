
import React, { useState } from 'react';
import { Calendar, Sparkles, Loader2, Copy, Check, Clock, CloudLightning } from 'lucide-react';
import { ScheduledPost } from '../../types';
import { Button, Input, LoadingSpinner } from '../ui';
import { SocialAI } from '../../services/ai/social'; // UPDATED

export const ContentCalendar = () => {
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [posts, setPosts] = useState<ScheduledPost[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // REFACTORED: Use SocialAI
    const generateWeeklyPlan = async () => {
        if (!topic) return alert("Isi topik dulu bos, misal: 'Promo Lebaran' atau 'Tips Kasir'.");
        setIsGenerating(true);
        setPosts([]);

        try {
            const data = await SocialAI.generateWeeklyPlan(topic);
            setPosts(data.map((p: any) => ({ ...p, status: 'pending' })));
        } catch (e: any) {
            alert("Gagal generate: " + e.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="h-full flex flex-col bg-brand-dark rounded-xl border border-white/5 overflow-hidden">
            {/* Header / Input */}
            <div className="p-6 border-b border-white/5 bg-black/20">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Calendar size={14} className="text-brand-orange"/> Topik Mingguan
                        </label>
                        <div className="relative">
                            <Input 
                                value={topic} 
                                onChange={(e) => setTopic(e.target.value)} 
                                placeholder="Contoh: Promo Akhir Tahun, Tips Anti Maling, Kisah Sukses Klien..." 
                                className="pl-10"
                            />
                            <CloudLightning size={18} className="absolute left-3 top-3.5 text-gray-500"/>
                        </div>
                    </div>
                    <Button 
                        onClick={generateWeeklyPlan} 
                        disabled={isGenerating}
                        className="w-full md:w-auto h-[46px] px-8 shadow-neon"
                    >
                        {isGenerating ? <LoadingSpinner size={18}/> : <><Sparkles size={18}/> BUAT KALENDER (7 HARI)</>}
                    </Button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                    *AI akan membuat 7 ide konten lengkap dengan caption dan visual brief.
                </p>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {posts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                        <Calendar size={64} className="mb-4 stroke-1"/>
                        <p className="text-sm">Belum ada jadwal konten. Masukkan topik di atas.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {posts.map((post, idx) => (
                            <div key={idx} className="bg-brand-card border border-white/5 rounded-xl p-4 hover:border-brand-orange/30 transition-all group flex flex-col">
                                <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                                    <span className="text-brand-orange font-bold text-sm uppercase">{post.day}</span>
                                    <span className="text-[9px] text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">{post.theme}</span>
                                </div>
                                
                                <div className="flex-1 space-y-3">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Hook / Judul</p>
                                        <p className="text-sm font-bold text-white leading-snug">{post.hook}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Caption</p>
                                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-4">{post.caption}</p>
                                    </div>
                                    <div className="bg-black/20 p-2 rounded border border-white/5">
                                        <p className="text-[9px] text-blue-400 font-bold mb-1 flex items-center gap-1"><Sparkles size={8}/> Visual Idea</p>
                                        <p className="text-[10px] text-gray-500 italic">{post.image_idea}</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                                    <button 
                                        onClick={() => copyToClipboard(post.caption, idx)}
                                        className="flex-1 py-2 bg-white/5 hover:bg-brand-orange hover:text-white rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        {copiedIndex === idx ? <Check size={12}/> : <Copy size={12}/>}
                                        {copiedIndex === idx ? "Copied" : "Copy Caption"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
