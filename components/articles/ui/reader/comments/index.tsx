
import React from 'react';
import { MessageCircle, Send, Globe, Loader2 } from 'lucide-react';
import { useComments } from '../../../hooks/use-article-interactions';
import { Button, Input, TextArea } from '../../../../../ui';

export const CommentSection = ({ articleId }: { articleId: number }) => {
    const { comments, form, setForm, loading, isSubmitting, submitComment } = useComments(articleId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await submitComment();
        } catch(e: any) {
            alert(e.message);
        }
    };

    // Helper: Simple Time Ago
    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " tahun lalu";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " bulan lalu";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " hari lalu";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " jam lalu";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " menit lalu";
        return "Baru saja";
    };

    return (
        <div className="mt-16 pt-10 border-t border-white/10 animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                <MessageCircle size={20} className="text-brand-orange"/> Diskusi Juragan ({comments.length})
            </h3>

            <div className="space-y-6 mb-10 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {loading && <div className="text-center text-gray-500 py-4"><Loader2 className="animate-spin mx-auto"/> Loading komentar...</div>}
                
                {!loading && comments.length === 0 && (
                    <div className="text-center py-8 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-gray-500 text-sm">Belum ada komentar. Jadilah yang pertama!</p>
                    </div>
                )}

                {comments.map(c => (
                    <div key={c.id} className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-gray-500 font-bold shrink-0 group-hover:border-brand-orange/50 group-hover:text-brand-orange transition-colors">
                            {c.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                {c.website ? (
                                    <a 
                                        href={c.website} 
                                        target="_blank" 
                                        rel="nofollow noreferrer" 
                                        className="text-sm font-bold text-brand-orange hover:underline hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        {c.name} <Globe size={10} />
                                    </a>
                                ) : (
                                    <h5 className="text-sm font-bold text-white">{c.name}</h5>
                                )}
                                <span className="text-[10px] text-gray-500">• {timeAgo(c.created_at)}</span>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">{c.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Send size={14} className="text-gray-500"/> Tinggalkan Jejak
                </h4>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            value={form.name} 
                            onChange={(e: any) => setForm({...form, name: e.target.value})} 
                            placeholder="Nama Panggilan" 
                            className="bg-black/40 text-sm"
                        />
                        <Input 
                            value={form.website} 
                            onChange={(e: any) => setForm({...form, website: e.target.value})} 
                            placeholder="Website (Opsional - Backlink)" 
                            className="bg-black/40 text-sm"
                        />
                    </div>
                    <TextArea 
                        value={form.text} 
                        onChange={(e: any) => setForm({...form, text: e.target.value})} 
                        placeholder="Tulis pendapat lo..." 
                        className="bg-black/40 text-sm h-24"
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full py-3 text-sm font-bold shadow-neon hover:shadow-neon-strong">
                        {isSubmitting ? <Loader2 className="animate-spin"/> : 'KIRIM KOMENTAR'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
