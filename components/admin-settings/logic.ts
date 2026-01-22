
import { useState, useEffect } from 'react';
import { SiteConfig } from '../../types';
import { supabase, callGeminiWithRotation, uploadToSupabase } from '../../utils';
import { SettingsState, SettingsTabId } from './types';

export const useSettingsLogic = (config: SiteConfig, setConfig: (c: SiteConfig) => void) => {
    const [state, setState] = useState<SettingsState>({
        activeTab: 'general',
        isSaving: false,
        isGenerating: false,
        magicContext: '',
        aboutImageFile: null,
        aboutImagePreview: config.about_image || '',
        founderImageFile: null,
        founderImagePreview: config.founder_portrait || '',
        isTogglingMaintenance: false
    });

    // Sinkronisasi preview saat config luar berubah
    useEffect(() => {
        setState(prev => ({
            ...prev,
            aboutImagePreview: config.about_image || '',
            founderImagePreview: config.founder_portrait || ''
        }));
    }, [config.about_image, config.founder_portrait]);

    const setActiveTab = (id: SettingsTabId) => setState(p => ({ ...p, activeTab: id }));
    const setMagicContext = (val: string) => setState(p => ({ ...p, magicContext: val }));

    const handleImageSelect = (target: 'about' | 'founder', file: File) => {
        const preview = URL.createObjectURL(file);
        if (target === 'about') {
            setState(p => ({ ...p, aboutImageFile: file, aboutImagePreview: preview }));
        } else {
            setState(p => ({ ...p, founderImageFile: file, founderImagePreview: preview }));
        }
    };

    const handleUrlSelect = (target: 'about' | 'founder', url: string) => {
        if (target === 'about') {
            setState(p => ({ ...p, aboutImageFile: null, aboutImagePreview: url }));
        } else {
            setState(p => ({ ...p, founderImageFile: null, founderImagePreview: url }));
        }
    };

    const toggleMaintenanceInstant = async () => {
        if (!supabase) return;
        setState(p => ({ ...p, isTogglingMaintenance: true }));
        const nextState = !config.is_maintenance_mode;
        
        try {
            const { error } = await supabase.from('site_settings').update({ is_maintenance_mode: nextState }).eq('id', 1);
            if (error) throw error;
            setConfig({ ...config, is_maintenance_mode: nextState });
        } catch (e: any) {
            alert("Gagal gembok ruko: " + e.message);
        } finally {
            setState(p => ({ ...p, isTogglingMaintenance: false }));
        }
    };

    const generateHeroContent = async () => {
        setState(p => ({ ...p, isGenerating: true }));
        try {
            const prompt = `Role: Senior Copywriter. Company: 'PT MESIN KASIR SOLO'. Task: Generate Hero Header (H1) and Subtitle. Context: "${state.magicContext}". Format: JSON { "heroTitle": "string", "heroSubtitle": "string" }. Rules: Use {word} for orange accent, [word] for gradient, \\n for breaks.`;
            const result = await callGeminiWithRotation({
                model: 'gemini-3-flash-preview',
                contents: [{ parts: [{ text: prompt }] }],
                config: { responseMimeType: "application/json" }
            });

            const data = JSON.parse(result.text.replace(/```json/g, '').replace(/```/g, '').trim());
            if (data && data.heroTitle) {
                setConfig({ 
                    ...config, 
                    hero_title: data.heroTitle.replace(/\\n/g, '\n'), 
                    hero_subtitle: (data.heroSubtitle || config.hero_subtitle).replace(/\\n/g, '\n')
                });
            }
        } catch (e: any) {
            alert("Gagal racik mantera: " + e.message);
        } finally {
            setState(p => ({ ...p, isGenerating: false }));
        }
    };

    const saveSettings = async () => {
        if (!supabase) return alert("Koneksi Database bermasalah.");
        setState(p => ({ ...p, isSaving: true }));
        try {
            let finalAboutImage = state.aboutImagePreview;
            let finalFounderImage = state.founderImagePreview;

            if (state.aboutImageFile) {
                const { url } = await uploadToSupabase(state.aboutImageFile, 'settings', 'images');
                finalAboutImage = url;
            }
            if (state.founderImageFile) {
                const { url } = await uploadToSupabase(state.founderImageFile, 'settings', 'images');
                finalFounderImage = url;
            }

            const finalConfig = { ...config, about_image: finalAboutImage, founder_portrait: finalFounderImage };
            const { error } = await supabase.from('site_settings').upsert({ id: 1, ...finalConfig });
            if (error) throw error;
            
            setConfig(finalConfig);
            alert("Pengaturan berhasil dicairkan!");
            setState(p => ({ ...p, aboutImageFile: null, founderImageFile: null }));
        } catch (e: any) {
            alert("Gagal simpan: " + e.message);
        } finally {
            setState(p => ({ ...p, isSaving: false }));
        }
    };

    return { 
        state, 
        actions: { setActiveTab, setMagicContext, handleImageSelect, handleUrlSelect, saveSettings, generateHeroContent, toggleMaintenanceInstant } 
    };
};
