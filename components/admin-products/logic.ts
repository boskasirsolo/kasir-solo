
import { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import { supabase, formatNumberInput, cleanNumberInput, slugify, renameFile, addWatermarkToFile, uploadToSupabase, processBackgroundMigration } from '../../utils';
import { ProductFormState, LoadingState, PRODUCT_CATEGORIES } from './types';
import { MerchantAI } from '../../services/ai/merchant';
import { VisionAI } from '../../services/ai/vision';

const ITEMS_PER_PAGE = 8;

export const useProductLogic = (products: Product[], setProducts: (p: Product[]) => void) => {
    const [form, setForm] = useState<ProductFormState>({
        id: null,
        name: '',
        category: PRODUCT_CATEGORIES[0],
        price: '',
        desc: '',
        shortDesc: '',
        specsStr: '',
        includesStr: '',
        whyBuyStr: '',
        imagePreview: '',
        uploadFile: null,
        galleryImages: [],
        newGalleryFiles: [],
        videoUrl: '',
        affiliateLink: '',
        ctaText: 'Beli Sekarang'
    });

    const [loading, setLoading] = useState<LoadingState>({
        generatingTitle: false,
        generatingDesc: false,
        generatingSpecs: false,
        generatingIncludes: false,
        generatingWhyBuy: false,
        generatingImage: false,
        uploading: false,
        processingImage: false
    });

    const [useWatermark, setUseWatermark] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [page, setPage] = useState(1);

    // Reset pagination when filter changes
    useEffect(() => { setPage(1); }, [searchTerm, selectedCategory]);

    // --- ACTIONS ---

    const resetForm = () => {
        setForm({
            id: null, name: '', category: PRODUCT_CATEGORIES[0], price: '', desc: '', shortDesc: '',
            specsStr: '', includesStr: '', whyBuyStr: '', imagePreview: '', uploadFile: null,
            galleryImages: [], newGalleryFiles: [], videoUrl: '',
            affiliateLink: '', ctaText: 'Beli Sekarang'
        });
        setUseWatermark(true);
    };

    const handleEditClick = (p: Product) => {
        const specsString = p.specs ? Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join('\n') : '';
        const includesString = p.package_includes ? p.package_includes.join('\n') : '';
        const whyBuyString = p.why_buy ? p.why_buy.join('\n') : '';

        setForm({
            id: p.id,
            name: p.name,
            category: p.category || PRODUCT_CATEGORIES[0],
            price: formatNumberInput(p.price),
            desc: p.description,
            shortDesc: '', // Reset keyword on edit
            specsStr: specsString,
            includesStr: includesString,
            whyBuyStr: whyBuyString,
            imagePreview: p.image,
            uploadFile: null,
            galleryImages: p.gallery_images || [],
            newGalleryFiles: [],
            videoUrl: p.video_url || '',
            affiliateLink: p.affiliate_link || '',
            ctaText: p.cta_text || 'Beli Sekarang'
        });
    };

    const deleteProduct = async (id: number) => {
        if(!confirm("Hapus produk ini?")) return;
        setProducts(products.filter(p => p.id !== id));
        if (supabase) await supabase.from('products').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    // --- AI GENERATORS (REFACTORED TO USE MERCHANT AI) ---

    const generateAI = async (target: keyof LoadingState, generator: () => Promise<string>, onSuccess: (text: string) => void) => {
        setLoading(p => ({ ...p, [target]: true }));
        try {
            const text = await generator();
            onSuccess(text);
        } catch (e: any) {
            alert(`AI Error: ${e.message}`);
        } finally {
            setLoading(p => ({ ...p, [target]: false }));
        }
    };

    const generateTitle = () => {
        if (!form.shortDesc) return alert("Isi 'Keywords' dulu.");
        generateAI('generatingTitle', 
            () => MerchantAI.generateProductName(form.shortDesc, form.category),
            (text) => setForm(p => ({ ...p, name: text }))
        );
    };

    const generateDesc = () => {
        if (!form.name) return alert("Isi Nama Produk dulu.");
        generateAI('generatingDesc',
            () => MerchantAI.generateSalesCopy(form.name, form.shortDesc),
            (text) => setForm(p => ({ ...p, desc: text }))
        );
    };

    const generateSpecs = () => {
        if (!form.name) return alert("Isi Nama Produk dulu.");
        generateAI('generatingSpecs',
            () => MerchantAI.generateSpecs(form.name),
            (text) => setForm(p => ({ ...p, specsStr: text }))
        );
    };

    const generateIncludes = () => {
        if (!form.name) return alert("Isi Nama Produk dulu.");
        generateAI('generatingIncludes',
            () => MerchantAI.generateIncludes(form.name),
            (text) => setForm(p => ({ ...p, includesStr: text }))
        );
    };

    const generateWhyBuy = () => {
        if (!form.name) return alert("Isi Nama Produk dulu.");
        generateAI('generatingWhyBuy',
            () => MerchantAI.generateWhyBuy(form.name),
            (text) => setForm(p => ({ ...p, whyBuyStr: text }))
        );
    };

    // Uses VisionAI now
    const generateImage = async () => {
        if (!form.name) return alert("Isi Nama Produk dulu.");
        setLoading(p => ({ ...p, generatingImage: true }));
        try {
            const { url, file } = await VisionAI.generate(form.name, form.category, 'corporate');
            setForm(p => ({ ...p, imagePreview: url, uploadFile: file }));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(p => ({ ...p, generatingImage: false }));
        }
    };

    // --- SUBMIT HANDLER ---

    const handleSubmit = async () => {
        if (!form.name || !form.price) return alert("Nama dan Harga wajib diisi");
        setLoading(p => ({ ...p, uploading: true }));

        try {
            // 1. Handle Main Image
            let finalImageUrl = form.imagePreview || 'https://via.placeholder.com/400';
            let supabasePath = '';
            let fileToMigrate = form.uploadFile;

            if (form.uploadFile) {
                if (useWatermark) {
                    setLoading(p => ({ ...p, processingImage: true }));
                    fileToMigrate = await addWatermarkToFile(form.uploadFile);
                    setLoading(p => ({ ...p, processingImage: false }));
                }

                if (supabase && fileToMigrate) {
                    const seoName = `${slugify(form.name)}-mesin-kasir`;
                    const renamedFile = renameFile(fileToMigrate, seoName);
                    const { url, path } = await uploadToSupabase(renamedFile, 'products');
                    finalImageUrl = url;
                    supabasePath = path;
                }
            }

            // 2. Handle Gallery Images (Multiple)
            const newGalleryUrls: string[] = [];
            if (form.newGalleryFiles.length > 0) {
                if (useWatermark) setLoading(p => ({ ...p, processingImage: true }));
                
                const uploadPromises = form.newGalleryFiles.map(async (file, idx) => {
                    let f = file;
                    if (useWatermark) f = await addWatermarkToFile(f);
                    const seoName = `${slugify(form.name)}-gallery-${idx+1}`;
                    const renamed = renameFile(f, seoName);
                    if (supabase) {
                        const { url } = await uploadToSupabase(renamed, 'products');
                        return url;
                    }
                    return null;
                });

                const results = await Promise.all(uploadPromises);
                if (useWatermark) setLoading(p => ({ ...p, processingImage: false }));
                results.forEach(url => { if (url) newGalleryUrls.push(url); });
            }
            const finalGallery = [...form.galleryImages, ...newGalleryUrls];

            // 3. Parse text areas
            const specsObj: Record<string, string> = {};
            if (form.specsStr) {
                form.specsStr.split('\n').forEach(line => {
                    const [key, ...rest] = line.split(':');
                    if (key && rest.length > 0) specsObj[key.trim()] = rest.join(':').trim();
                });
            }
            const includesArr = form.includesStr ? form.includesStr.split('\n').map(s => s.trim()).filter(Boolean) : [];
            const whyBuyArr = form.whyBuyStr ? form.whyBuyStr.split('\n').map(s => s.trim()).filter(Boolean) : [];

            // 4. Construct DB Data
            const dbData = {
                name: form.name,
                price: cleanNumberInput(form.price),
                category: form.category,
                description: form.desc,
                image_url: finalImageUrl,
                gallery_images: finalGallery,
                video_url: form.videoUrl,
                specs: specsObj,
                package_includes: includesArr,
                why_buy: whyBuyArr,
                affiliate_link: form.affiliateLink,
                cta_text: form.ctaText
            };

            let savedId = form.id;

            if (form.id) {
                setProducts(products.map(p => p.id === form.id ? { ...p, ...dbData, image: finalImageUrl } : p));
                if (supabase) await supabase.from('products').update(dbData).eq('id', form.id);
            } else {
                const newId = Date.now();
                setProducts([{ ...dbData, id: newId, image: finalImageUrl }, ...products]);
                if (supabase) {
                    const { data } = await supabase.from('products').insert([dbData]).select().single();
                    if(data) savedId = data.id;
                }
            }

            // Background Migration to Cloudinary (Cover Only for now to save bandwidth)
            if (supabasePath && fileToMigrate && savedId) {
                processBackgroundMigration(fileToMigrate, supabasePath, 'products', savedId, 'image_url');
            }

            alert("Produk berhasil disimpan!");
            // Optional: resetForm();
        } catch (e: any) {
            alert("Gagal simpan: " + e.message);
        } finally {
            setLoading(p => ({ ...p, uploading: false }));
        }
    };

    // --- FILTERING ---
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
            return matchSearch && matchCat;
        });
    }, [products, searchTerm, selectedCategory]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return {
        form, setForm,
        loading,
        useWatermark, setUseWatermark,
        listState: { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, page, setPage, totalPages, paginatedProducts, totalItems: filteredProducts.length },
        actions: { resetForm, handleEditClick, deleteProduct, handleSubmit },
        aiActions: { generateTitle, generateDesc, generateSpecs, generateIncludes, generateWhyBuy, generateImage }
    };
};
