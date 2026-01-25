
import { useState } from 'react';
import { useSourcePicker } from './hooks/use-source-picker';
import { useComposer } from './hooks/use-composer';
import { Product, Article, GalleryItem } from '../../types';
import { uploadToCloudinary, generateUtmUrl, slugify } from '../../utils';
import { ActiveTab, CaptionState } from './types';

export const useSocialStudio = (products: Product[], articles: Article[], gallery: GalleryItem[]) => {
    const source = useSourcePicker(products, articles, gallery);
    const composer = useComposer();
    
    const [isPosting, setIsPosting] = useState(false);
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const handleSelectItem = (item: any) => {
        source.setSelectedItem(item);
        setCustomImage(null);
        setUploadFile(null);
        composer.initCaptions(item);
        composer.setActiveTab('master');
    };

    const broadcastPost = async () => {
        if (!source.selectedItem || isPosting) return;
        setIsPosting(true);
        try {
            let img = customImage || source.selectedItem.image;
            if (uploadFile) img = await uploadToCloudinary(uploadFile);

            const activePlats = Object.entries(composer.platforms).filter(([_, v]) => v).map(([k]) => k);
            if (activePlats.length === 0) throw new Error("Pilih platform dulu.");

            await Promise.all(activePlats.map(plat => {
                let cap = composer.captions[plat as keyof CaptionState] || composer.captions.master;
                const utm = generateUtmUrl(source.selectedItem!.url, plat, 'social_studio', `broadcast_${slugify(source.selectedItem!.title)}`);
                if (cap.includes(source.selectedItem!.url)) cap = cap.replace(source.selectedItem!.url, utm);
                
                return fetch('/api/ayrshare', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ caption: cap, image_url: img, platforms: [plat], title: source.selectedItem!.title })
                });
            }));
            alert("Broadcast Meluncur, Bos!");
        } catch (e: any) { alert("Gagal: " + e.message); }
        finally { setIsPosting(false); }
    };

    return {
        source, composer,
        state: { isPosting, customImage, uploadFile },
        actions: { 
            handleSelectItem, 
            broadcastPost,
            handleImageUpload: (f: File) => { setUploadFile(f); setCustomImage(URL.createObjectURL(f)); }
        }
    };
};
