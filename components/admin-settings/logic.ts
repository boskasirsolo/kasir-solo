
import { useState, useEffect } from 'react';
import { SiteConfig } from '../../types';
import { supabase, callGeminiWithRotation, CONFIG, renameFile, normalizePhone } from '../../utils';
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

    const handleImageSelect = (target: 'about' | 'founder', file: File) => {
        const preview = URL.createObjectURL(file);
        if (target === 'about') {
            setState(p => ({ ...p, aboutImageFile: file, aboutImagePreview: preview }));
        } else {
            setState(p => ({ ...p, founderImageFile: file, founderImagePreview: preview }));
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

            // Upload About Image
            if (state.aboutImageFile && CONFIG.CLOUDINARY_CLOUD_NAME) {
                const formData = new FormData();
                formData.append('file', renameFile(state.aboutImageFile, 'kantor-mesin-kasir-solo-hq'));
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                if (data.secure_url) finalAboutImage = data.secure_url;
            }

            // Upload Founder Image
            if (state.founderImageFile && CONFIG.CLOUDINARY_CLOUD_NAME) {
                const formData = new FormData();
                formData.append('file', renameFile(state.founderImageFile, 'founder-amin-maghfuri'));
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                if (data.secure_url) finalFounderImage = data.secure_url;
            }

            setConfig({ ...config, aboutImage: finalAboutImage, founderPortrait: finalFounderImage });

            // 1. STRATEGI UTAMA: Format Snake Case (Standar DB Baru)
            const dbDataSnake = {
                id: 1,
                hero_title: config.heroTitle,
                hero_subtitle: config.heroSubtitle,
                about_image: finalAboutImage,
                founder_portrait: finalFounderImage,
                sibos_url: config.sibosUrl,
                qalam_url: config.qalamUrl,
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
                timezone: config.timezone,
                quota_onsite_max: config.quotaOnsiteMax,
                quota_onsite_used: config.quotaOnsiteUsed,
                quota_digital_max: config.quotaDigitalMax,
                quota_digital_used: config.quotaDigitalUsed
            };

            // Coba simpan pakai format baru
            const { error: errorSnake } = await supabase.from('site_settings').upsert(dbDataSnake);

            if (errorSnake) {
                console.warn("Penyimpanan format baru gagal, mencoba fallback ke format lama...", errorSnake.message);
                
                // 2. STRATEGI CADANGAN: Format Camel Case (Untuk DB Lama)
                // Jika errornya karena kolom tidak ditemukan, kita coba kirim dengan nama kolom lama.
                const dbDataCamel = {
                    id: 1,
                    heroTitle: config.heroTitle,
                    heroSubtitle: config.heroSubtitle,
                    aboutImage: finalAboutImage,
                    founderPortrait: finalFounderImage,
                    sibosUrl: config.sibosUrl,
                    qalamUrl: config.qalamUrl,
                    companyLegalName: config.companyLegalName,
                    nibNumber: config.nibNumber,
                    ahuNumber: config.ahuNumber,
                    npwpNumber: config.npwpNumber,
                    whatsappNumber: config.whatsappNumber,
                    emailAddress: config.emailAddress,
                    addressSolo: config.addressSolo,
                    addressBlora: config.addressBlora,
                    mapSoloLink: config.mapSoloLink,
                    mapBloraLink: config.mapBloraLink,
                    mapSoloEmbed: config.mapSoloEmbed,
                    mapBloraEmbed: config.mapBloraEmbed,
                    instagramUrl: config.instagramUrl,
                    facebookUrl: config.facebookUrl,
                    youtubeUrl: config.youtubeUrl,
                    tiktokUrl: config.tiktokUrl,
                    linkedinUrl: config.linkedinUrl,
                    googleAnalyticsId: config.googleAnalyticsId,
                    googleSearchConsoleCode: config.googleSearchConsoleCode,
                    timezone: config.timezone,
                    quotaOnsiteMax: config.quotaOnsiteMax,
                    quotaOnsiteUsed: config.quotaOnsiteUsed,
                    quotaDigitalMax: config.quotaDigitalMax,
                    quotaDigitalUsed: config.quotaDigitalUsed
                };

                const { error: errorCamel } = await supabase.from('site_settings').upsert(dbDataCamel);
                
                if (errorCamel) {
                    // Jika dua-duanya gagal, baru kita lempar error ke user
                    throw new Error(`Gagal menyimpan ke Database. Error Teknis: ${errorSnake.message}`);
                }
            }
            
            alert("Pengaturan berhasil disimpan!");
            setState(p => ({ ...p, aboutImageFile: null, founderImageFile: null }));
        } catch (e: any) {
            alert("Gagal menyimpan: " + e.message);
        } finally {
            setState(p => ({ ...p, isSaving: false }));
        }
    };

    return { state, actions: { setActiveTab, setMagicContext, handleImageSelect, saveSettings, generateHeroContent } };
};
