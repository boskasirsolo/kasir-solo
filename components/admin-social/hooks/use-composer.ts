
import { useState } from 'react';
import { PlatformState, CaptionState, ActiveTab, SocialContentItem } from '../types';
import { SocialAI } from '../../../services/ai/social';

export const useComposer = () => {
    const [platforms, setPlatforms] = useState<PlatformState>({ 
        instagram: true, facebook: true, linkedin: false, tiktok: false, twitter: false, 
        gmb: false, pinterest: false, telegram: false, youtube: false, threads: false 
    });
    
    const [captions, setCaptions] = useState<CaptionState>({ 
        master: '', instagram: '', facebook: '', linkedin: '', tiktok: '', 
        twitter: '', gmb: '', pinterest: '', telegram: '', youtube: '', threads: '' 
    });

    const [activeTab, setActiveTab] = useState<ActiveTab>('master');
    const [selectedTones, setSelectedTones] = useState<string[]>(['gritty']);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const initCaptions = (item: SocialContentItem) => {
        const base = `${item.title}\n\n${item.description}\n\nInfo selengkapnya: ${item.url}`;
        const newCaptions: any = { master: base };
        Object.keys(platforms).forEach(k => newCaptions[k] = base);
        setCaptions(newCaptions);
    };

    const generateAI = async (platform: ActiveTab, item: SocialContentItem) => {
        setIsAiLoading(true);
        try {
            const res = await SocialAI.generateCaption(platform, item.title, item.description, item.url, selectedTones);
            setCaptions(prev => ({ ...prev, [platform]: res }));
        } catch (e) { alert("AI Gagal: " + e); }
        finally { setIsAiLoading(false); }
    };

    const toggleTone = (id: string) => {
        setSelectedTones(prev => prev.includes(id) ? (prev.length > 1 ? prev.filter(t => t !== id) : prev) : [...prev, id].slice(-3));
    };

    return { 
        platforms, setPlatforms, captions, setCaptions, activeTab, setActiveTab, 
        selectedTones, toggleTone, isAiLoading, initCaptions, generateAI 
    };
};
