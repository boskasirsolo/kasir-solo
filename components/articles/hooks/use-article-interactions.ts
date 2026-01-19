
import { useState, useEffect } from 'react';
import { supabase, generateUtmUrl, slugify } from '../../../utils';

// --- COMMENT HOOK ---
export const useComments = (articleId: number) => {
    const [comments, setComments] = useState<any[]>([]);
    const [form, setForm] = useState({ name: '', website: '', text: '' });
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            if (!supabase) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('article_comments')
                    .select('*')
                    .eq('article_id', articleId)
                    .order('created_at', { ascending: false });
                
                if (!error) setComments(data || []);
            } catch (e) {
                console.error("Fetch error:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [articleId]);

    const submitComment = async () => {
        if (!form.name || !form.text) throw new Error("Isi nama dan komentar dulu bos.");
        
        let websiteUrl = form.website.trim();
        if (websiteUrl && !/^https?:\/\//i.test(websiteUrl)) {
            websiteUrl = 'https://' + websiteUrl;
        }

        if (!supabase) throw new Error("Koneksi database tidak tersedia.");

        setIsSubmitting(true);
        try {
            const { data, error } = await supabase
                .from('article_comments')
                .insert([{
                    article_id: articleId,
                    name: form.name,
                    website: websiteUrl,
                    content: form.text
                }])
                .select()
                .single();

            if (error) throw error;

            setComments([data, ...comments]);
            setForm({ name: '', website: '', text: '' });
            return true;
        } catch(e: any) {
            throw e;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { comments, form, setForm, loading, isSubmitting, submitComment };
};

// --- ADMIN STATS HOOK ---
export const useAdminStats = (articleTitle: string) => {
    const [stats, setStats] = useState<number | null>(null);

    useEffect(() => {
        const checkStats = async () => {
            if (!supabase) return;
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                const slugPath = `/articles/${slugify(articleTitle)}`;
                const { count } = await supabase
                    .from('analytics_logs')
                    .select('*', { count: 'exact', head: true })
                    .ilike('page_path', `%${slugPath}%`)
                    .eq('event_type', 'page_view');
                
                setStats(count || 0);
            }
        };
        checkStats();
    }, [articleTitle]);

    return stats;
};

// --- SOCIAL SHARE HOOK ---
export const useSocialShare = (title: string) => {
    const share = (platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'copy') => {
        const currentUrl = window.location.href;
      
        if (platform === 'copy') {
            navigator.clipboard.writeText(currentUrl);
            alert("Link artikel disalin!");
            return;
        }

        const utmUrl = generateUtmUrl(currentUrl, platform, 'social_share', 'article_viral');

        let shareUrl = "";
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(utmUrl)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(utmUrl)}&text=${encodeURIComponent(title)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(utmUrl)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(title + " " + utmUrl)}`;
                break;
        }
        
        if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    return { share };
};
