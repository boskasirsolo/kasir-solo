
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
        founderImagePreview: config.founder_portrait || ''
    });

    // Sync initial props
    useEffect(() => {
        setState(prev => ({
            ...prev,
            aboutImagePreview: config.about_image || '',
            founderImagePreview: config.founder_portrait || ''
        }));
    }, [config.about_image, config.founder_portrait]);

    const setActiveTab = (id: SettingsTabId) => setState(p => ({ ...p, activeTab: id }));
    const setMagicContext = (val: string) => setState(p => ({ ...p, magicContext: val }));

    // Handle File Upload (New File)
    const handleImageSelect = (target: 'about' | 'founder', file: File) => {
        const preview = URL.createObjectURL(file);
        if (target === 'about') {
            setState(p => ({ ...p, aboutImageFile: file, aboutImagePreview: preview }));
        } else {
            setState(p => ({ ...p, founderImageFile: file, founderImagePreview: preview }));
        }
    };

    // Handle Gallery Selection (Existing URL)
    const handleUrlSelect = (target: 'about' | 'founder', url: string) => {
        if (target === 'about') {
            setState(p => ({ ...p, aboutImageFile: null, aboutImagePreview: url }));
        } else {
            setState(p => ({ ...p, founderImageFile: null, founderImagePreview: url }));
        }
    };

    const generateHeroContent = async () => {
        setState(p => ({ ...p, isGenerating: true }));
        try {
            const prompt = `
            Role: Senior Copywriter. Task: Generate Hero Section for 'PT MESIN KASIR SOLO'.
            Context: "${state.magicContext || "General Promotion"}"
            Output JSON: { "heroTitle": "...", "heroSubtitle": "..." }
            `;
            const result = await callGeminiWithRotation({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            const data = JSON.parse(result.text || "{}");
            if (data.heroTitle) {
                // Keep snake_case keys in state
                setConfig({ ...config, hero_title: data.heroTitle, hero_subtitle: data.heroSubtitle });
            }
        } catch (e: any) {
            alert("Gagal generate: " + e.message);
        } finally {
            setState(p => ({ ...p, isGenerating: false }));
        }
    };

    const saveSettings = async () => {
        if (!supabase) return alert("Koneksi Database bermasalah.");

        if (config.whatsapp_number) {
            const cleanPhone = normalizePhone(config.whatsapp_number);
            if (!cleanPhone) return alert("Format WhatsApp Error. Gunakan 08xx atau 628xx.");
            config.whatsapp_number = cleanPhone;
        }

        setState(p => ({ ...p, isSaving: true }));
        try {
            let finalAboutImage = state.aboutImagePreview;
            let finalFounderImage = state.founderImagePreview;

            // --- 1. UPLOAD ABOUT IMAGE (IF NEW FILE) ---
            if (state.aboutImageFile) {
                const seoName = 'kantor-mesin-kasir-solo-hq';
                const fileToUpload = renameFile(state.aboutImageFile, seoName);

                if (CONFIG.CLOUDINARY_CLOUD_NAME) {
                    const formData = new FormData();
                    formData.append('file', fileToUpload);
                    formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                    const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                    const data = await res.json();
                    if (data.secure_url) finalAboutImage = data.secure_url;
                } else {
                    const { url } = await uploadToSupabase(fileToUpload, 'settings', 'images');
                    finalAboutImage = url;
                }
            }

            // --- 2. UPLOAD FOUNDER IMAGE (IF NEW FILE) ---
            if (state.founderImageFile) {
                const seoName = 'founder-amin-maghfuri-mesin-kasir-solo';
                const fileToUpload = renameFile(state.founderImageFile, seoName);

                if (CONFIG.CLOUDINARY_CLOUD_NAME) {
                    const formData = new FormData();
                    formData.append('file', fileToUpload);
                    formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                    const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                    const data = await res.json();
                    if (data.secure_url) finalFounderImage = data.secure_url;
                } else {
                    const { url } = await uploadToSupabase(fileToUpload, 'settings', 'images');
                    finalFounderImage = url;
                }
            }

            // UPDATE STATE & DB (Raw Flow)
            const finalConfig = { 
                ...config, 
                about_image: finalAboutImage, 
                founder_portrait: finalFounderImage 
            };
            
            setConfig(finalConfig);

            // DIRECT UPSERT (No Mapping needed because interface matches DB)
            const { error } = await supabase.from('site_settings').upsert({
                id: 1,
                ...finalConfig
            });

            if (error) {
                console.error("Supabase Error:", error);
                throw new Error(error.message);
            }
            
            alert("Pengaturan berhasil disimpan!");
            setState(p => ({ ...p, aboutImageFile: null, founderImageFile: null }));
        } catch (e: any) {
            alert("Gagal menyimpan: " + e.message);
        } finally {
            setState(p => ({ ...p, isSaving: false }));
        }
    };

    return { state, actions: { setActiveTab, setMagicContext, handleImageSelect, handleUrlSelect, saveSettings, generateHeroContent } };
};
