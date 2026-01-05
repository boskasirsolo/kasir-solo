
import { slugify } from '../../lib/formatters';

export const VisionAI = {
    /**
     * Membuat prompt visual detail berdasarkan judul & kategori
     */
    craftPrompt: (title: string, category: string, style: 'cinematic' | 'corporate' | 'minimalist' | 'cyberpunk') => {
        const lowerTitle = title.toLowerCase();
        
        // 1. Determine Subject & Scene (Context Awareness)
        let subject = "modern abstract business concept";
        let setting = "minimalist studio";
        let lighting = "soft professional lighting";
        let camera = "eye level";

        // Logic Cascade for Context
        if (lowerTitle.includes('hardware') || lowerTitle.includes('pos') || lowerTitle.includes('mesin kasir') || lowerTitle.includes('printer')) {
            subject = "sleek black modern POS system terminal with a thermal receipt printer";
            setting = "busy coffee shop counter with blurred background customers";
            lighting = "warm ambient cafe lighting with neon accents";
            camera = "macro close-up with depth of field";
        } 
        else if (lowerTitle.includes('fraud') || lowerTitle.includes('maling') || lowerTitle.includes('curang') || lowerTitle.includes('rugi')) {
            subject = "security camera CCTV view looking down at a cash register, mysterious atmosphere";
            setting = "dimly lit retail store at night";
            lighting = "dramatic moody lighting with red warning hues";
            camera = "high angle CCTV perspective";
        }
        else if (lowerTitle.includes('keuangan') || lowerTitle.includes('profit') || lowerTitle.includes('laporan') || lowerTitle.includes('omzet')) {
            subject = "digital tablet displaying complex colorful financial growth charts and data visualization";
            setting = "modern glass office desk with a cup of coffee";
            lighting = "bright natural window light";
            camera = "over-the-shoulder POV shot";
        }
        else if (lowerTitle.includes('karyawan') || lowerTitle.includes('hr') || lowerTitle.includes('tim')) {
            subject = "diverse group of indonesian retail staff wearing uniforms having a briefing";
            setting = "modern retail store floor";
            lighting = "bright evenly lit commercial lighting";
            camera = "waist-level medium shot";
        }
        else if (lowerTitle.includes('promo') || lowerTitle.includes('diskon') || lowerTitle.includes('ramadhan') || lowerTitle.includes('lebaran')) {
            subject = "festive shopping bags and sale tags with percentage signs";
            setting = "bustling shopping mall interior";
            lighting = "vibrant colorful dynamic lighting";
            camera = "dynamic tilted angle";
        }
        else if (lowerTitle.includes('stok') || lowerTitle.includes('gudang') || lowerTitle.includes('inventory')) {
            subject = "organized warehouse shelves with boxes and a digital barcode scanner";
            setting = "industrial warehouse aisle";
            lighting = "cool industrial fluorescent lighting";
            camera = "symmetrical wide shot";
        }
        else if (lowerTitle.includes('software') || lowerTitle.includes('aplikasi') || lowerTitle.includes('digital') || lowerTitle.includes('coding')) {
            subject = "futuristic holographic user interface dashboard floating in air";
            setting = "dark server room with blinking lights";
            lighting = "cyan and magenta cyberpunk lighting";
            camera = "cinematic close up";
        }
        else if (lowerTitle.includes('strategi') || lowerTitle.includes('tips') || lowerTitle.includes('bisnis')) {
            subject = "confident indonesian business owner smiling with crossed arms";
            setting = "successful modern restaurant background";
            lighting = "cinematic rim lighting";
            camera = "low angle hero shot";
        }

        // 2. Refine Style
        let artStyle = "";
        if (style === 'cinematic') artStyle = "cinematic photography, 8k, ultra realistic, masterpiece, unreal engine 5 render style";
        else if (style === 'cyberpunk') artStyle = "cyberpunk aesthetics, neon lights, high contrast, futuristic, blade runner style";
        else if (style === 'minimalist') artStyle = "minimalist vector art style, flat design, clean lines, pastel colors";
        else if (style === 'corporate') artStyle = "professional corporate stock photography, clean, trustworthy, shutterstock style";
        else artStyle = "highly detailed professional photography, sharp focus, award winning";

        // 3. Construct Final Prompt
        return `${subject}, in ${setting}, ${lighting}, ${camera}, ${artStyle}, --no text, --no watermark`;
    },

    /**
     * Generate URL dan File Object dari Flux/Pollinations
     */
    generate: async (title: string, category: string, style: 'cinematic' | 'corporate' = 'cinematic') => {
        const seed = Math.floor(Math.random() * 9999999);
        const prompt = VisionAI.craftPrompt(title, category, style);
        
        const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&model=flux&nologo=true&seed=${seed}&enhance=true`;
        
        try {
            const res = await fetch(pollUrl);
            const blob = await res.blob();
            const cleanFileName = `${slugify(title)}-${slugify(category)}-${seed}.jpg`;
            const file = new File([blob], cleanFileName, { type: "image/jpeg" });
            const localUrl = URL.createObjectURL(blob);
            return { url: localUrl, file: file };
        } catch(e) { 
            console.error("AI Image Gen Error", e);
            return { url: pollUrl, file: null }; 
        }
    }
};
