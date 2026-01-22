
import { useState, useEffect } from 'react';
import { SiteConfig } from '../../types';
import { supabase, callGeminiWithRotation, CONFIG, renameFile, normalizePhone, uploadToSupabase } from '../../utils';
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

    // --- HELPER: CLEAN JSON FROM AI ---
    const cleanJsonResponse = (text: string) => {
        try {
            // Hilangkan blok markdown ```json ... ``` atau ``` ... ```
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (e) {
            console.error("[Settings] JSON Parse Error. Raw Text:", text);
            return null;
        }
    };

    const toggleMaintenanceInstant = async () => {
        if (!supabase) return;
        setState(p => ({ ...p, isTogglingMaintenance: true }));
        const nextState = !config.is_maintenance_mode;
        
        try {
            const { error } = await supabase
                .from('site_settings')
                .update({ is_maintenance_mode: nextState })
                .eq('id', 1);

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
            const prompt = `Role: Senior High-Conversion Copywriter. 
            Company: 'PT MESIN KASIR SOLO'. 
            Task: Generate Hero Header (H1) and Subtitle for the homepage.
            Context for current promo: "${state.magicContext || "General Branding"}". 
            Tone: Aggressive, Professional, Street-smart.
            
            STRICT STYLE GUIDE:
            - Use {word} to highlight words in ORANGE.
            - Use [word] to highlight words in GRADIENT.
            Example: "AKHIRI ERA {BONCOS}" or "Pusat [Mesin Kasir] Terpercaya".
            
            Output: STIRCT JSON format { "heroTitle": "string", "heroSubtitle": "string" }. No other text.`;

            const result = await callGeminiWithRotation({
                model: 'gemini-3-flash-preview',
                contents: [{ parts: [{ text: prompt }] }],
                config: { responseMimeType: "application/json" }
            });

            const rawText = result.text || "";
            const data = cleanJsonResponse(rawText);

            if (data && data.heroTitle) {
                setConfig({ 
                    ...config, 
                    hero_title: data.heroTitle, 
                    hero_subtitle: data.heroSubtitle || config.hero_subtitle 
                });
            } else {
                throw new Error("AI ngasih format rusak, coba lagi Bos.");
            }
        } catch (e: any) {
            alert("Gagal generate: " + e.message);
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
            setConfig(finalConfig);

            const { error } = await supabase.from('site_settings').upsert({ id: 1, ...finalConfig });
            if (error) throw error;
            
            alert("Pengaturan berhasil disimpan!");
            setState(p => ({ ...p, aboutImageFile: null, founderImageFile: null }));
        } catch (e: any) {
            alert("Gagal menyimpan: " + e.message);
        } finally {
            setState(p => ({ ...p, isSaving: false }));
        }
    };

    return { 
        state, 
        actions: { setActiveTab, setMagicContext, handleImageSelect, handleUrlSelect, saveSettings, generateHeroContent, toggleMaintenanceInstant } 
    };
};
