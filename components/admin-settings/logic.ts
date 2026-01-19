
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
        aboutImagePreview: config.aboutImage || '',
        founderImageFile: null,
        founderImagePreview: config.founderPortrait || ''
    });

    // Sync initial props
    useEffect(() => {
        setState(prev => ({
            ...prev,
            aboutImagePreview: config.aboutImage || '',
            founderImagePreview: config.founderPortrait || ''
        }));
    }, [config.aboutImage, config.founderPortrait]);

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
                setConfig({ ...config, heroTitle: data.heroTitle, heroSubtitle: data.heroSubtitle });
            }
        } catch (e: any) {
            alert("Gagal generate: " + e.message);
        } finally {
            setState(p => ({ ...p, isGenerating: false }));
        }
    };

    const saveSettings = async () => {
        if (!supabase) return alert("Koneksi Database bermasalah.");

        if (config.whatsappNumber) {
            const cleanPhone = normalizePhone(config.whatsappNumber);
            if (!cleanPhone) return alert("Format WhatsApp Error. Gunakan 08xx atau 628xx.");
            config.whatsappNumber = cleanPhone;
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

            setConfig({ ...config, aboutImage: finalAboutImage, founderPortrait: finalFounderImage });

            // MAPPING DATA: Frontend (Camel) -> Database (Snake Case)
            // THIS IS THE CRITICAL PART: founder_portrait (Snake) <-> finalFounderImage (Camel)
            const dbData = {
                id: 1,
                hero_title: config.heroTitle,
                hero_subtitle: config.heroSubtitle,
                about_image: finalAboutImage,
                founder_portrait: finalFounderImage, // <--- EXPLICIT MAPPING HERE
                
                // STANDARD: Map camelCase State to snake_case DB
                sibos_url: config.sibosUrl,
                qalam_url: config.qalamUrl,
                dapur_sppg_url: config.dapurSppgUrl,
                
                company_legal_name: config.companyLegalName,
                nib_number: config.nibNumber,
                ahu_number: config.ahuNumber,
                npwp_number: config.npwpNumber,
                whatsapp_number: config.whatsappNumber,
                email_address: config.emailAddress,
                address_solo: config.addressSolo,
                address_blora: config.addressBlora,
                map_solo_link: config.mapSoloLink,
                map_blora_link: config.mapBloraLink,
                map_solo_embed: config.mapSoloEmbed,
                map_blora_embed: config.mapBloraEmbed,
                instagram_url: config.instagramUrl,
                facebook_url: config.facebookUrl,
                youtube_url: config.youtubeUrl,
                tiktok_url: config.tiktokUrl,
                linkedin_url: config.linkedinUrl,
                google_analytics_id: config.googleAnalyticsId,
                google_search_console_code: config.googleSearchConsoleCode,
                google_merchant_id: config.googleMerchantId,
                timezone: config.timezone,
                quota_onsite_max: config.quotaOnsiteMax,
                quota_onsite_used: config.quotaOnsiteUsed,
                quota_digital_max: config.quotaDigitalMax,
                quota_digital_used: config.quotaDigitalUsed
            };

            const { error } = await supabase.from('site_settings').upsert(dbData);

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
