
import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import { supabase, formatNumberInput, cleanNumberInput, slugify, renameFile, addWatermarkToFile, uploadToSupabase, processBackgroundMigration } from '../../utils';
import { ProductFormState, LoadingState, PRODUCT_CATEGORIES } from './types';
import { MerchantAI } from '../../services/ai/merchant';
import { VisionAI } from '../../services/ai/vision';

const ITEMS_PER_PAGE = 8;

export const useProductLogic = (products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>>) => {
    const [form, setForm] = useState<ProductFormState>({
        id: null,
        name: '',
        category: PRODUCT_CATEGORIES[0],
        price: '',
        weight_grams: '2000', 
        length_cm: '20',
        width_cm: '20',
        height_cm: '20',
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
    const [showMobileEditor, setShowMobileEditor] = useState(false);

    useEffect(() => { setPage(1); }, [searchTerm, selectedCategory]);

    const resetForm = () => {
        setForm({
            id: null, name: '', category: PRODUCT_CATEGORIES[0], price: '', weight_grams: '2000', 
            length_cm: '20', width_cm: '20', height_cm: '20',
            desc: '', shortDesc: '',
            specsStr: '', includesStr: '', whyBuyStr: '', imagePreview: '', uploadFile: null,
            galleryImages: [], newGalleryFiles: [], videoUrl: '',
            affiliateLink: '', ctaText: 'Beli Sekarang'
        });
        setUseWatermark(true);
        setShowMobileEditor(false);
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
            weight_grams: String(p.weight_grams || 2000),
            length_cm: String(p.length_cm || 20),
            width_cm: String(p.width_cm || 20),
            height_cm: String(p.height_cm || 20),
            desc: p.description,
            shortDesc: '', 
            specsStr: specsString,
            includesStr: includesString,
            whyBuyStr: whyBuyString,
            imagePreview: p.image,
            uploadFile: null,
            galleryImages: p.gallery_images || [],
            newGalleryFiles: [],
            videoUrl: p.video_url || '',
            affiliateLink: p.affiliate_link || '',
            cta_text: p.cta_text || 'Beli Sekarang'
        } as any);
        setShowMobileEditor(true);
    };

    const openNewProduct = () => {
        resetForm();
        setShowMobileEditor(true);
    };

    const deleteProduct = async (id: number) => {
        if(!confirm("Hapus produk ini?")) return;
        try {
            if (supabase) {
                const { error } = await supabase.from('products').delete().eq('id', id);
                if (error) throw error;
            }
            setProducts(prev => prev.filter(p => p.id !== id));
            if (form.id === id) resetForm();
        } catch (e: any) {
            alert("Gagal hapus: " + e.message);
        }
    };

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

    const handleSubmit = async () => {
        if (!form.name || !form.price) return alert("Nama dan Harga wajib diisi Bos.");
        if (!supabase) return alert("Koneksi Database tidak ditemukan.");

        setLoading(p => ({ ...p, uploading: true }));

        try {
            let finalImageUrl = form.imagePreview || 'https://via.placeholder.com/400';
            let supabasePath = '';
            let fileToMigrate = form.uploadFile;

            // 1. Image Processing
            if (form.uploadFile) {
                if (useWatermark) {
                    setLoading(p => ({ ...p, processingImage: true }));
                    fileToMigrate = await addWatermarkToFile(form.uploadFile);
                    setLoading(p => ({ ...p, processingImage: false }));
                }

                const seoName = `${slugify(form.name)}-mesin-kasir-solo`;
                const renamedFile = renameFile(fileToMigrate!, seoName);
                const { url, path } = await uploadToSupabase(renamedFile, 'products');
                finalImageUrl = url;
                supabasePath = path;
            }

            // 2. Gallery Processing
            const newGalleryUrls: string[] = [];
            if (form.newGalleryFiles.length > 0) {
                if (useWatermark) setLoading(p => ({ ...p, processingImage: true }));
                
                const uploadPromises = form.newGalleryFiles.map(async (file, idx) => {
                    let f = file;
                    if (useWatermark) f = await addWatermarkToFile(f);
                    const seoName = `${slugify(form.name)}-mesin-kasir-solo-gallery-${idx+1}`;
                    const renamed = renameFile(f, seoName);
                    const { url } = await uploadToSupabase(renamed, 'products');
                    return url;
                });

                const results = await Promise.all(uploadPromises);
                if (useWatermark) setLoading(p => ({ ...p, processingImage: false }));
                results.forEach(url => { if (url) newGalleryUrls.push(url); });
            }
            const finalGallery = [...form.galleryImages, ...newGalleryUrls];

            // 3. Data Parsing
            const specsObj: Record<string, string> = {};
            if (form.specsStr) {
                form.specsStr.split('\n').forEach(line => {
                    const [key, ...rest] = line.split(':');
                    if (key && rest.length > 0) specsObj[key.trim()] = rest.join(':').trim();
                });
            }
            const includesArr = form.includesStr ? form.includesStr.split('\n').map(s => s.trim()).filter(Boolean) : [];
            const whyBuyArr = form.whyBuyStr ? form.whyBuyStr.split('\n').map(s => s.trim()).filter(Boolean) : [];

            // DB MAPPING
            const dbData = {
                name: form.name,
                price: cleanNumberInput(form.price),
                weight_grams: parseInt(form.weight_grams) || 2000, 
                length_cm: parseInt(form.length_cm) || 20,
                width_cm: parseInt(form.width_cm) || 20,
                height_cm: parseInt(form.height_cm) || 20,
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

            let savedProduct: any = null;

            if (form.id) {
                const { data, error } = await supabase
                    .from('products')
                    .update(dbData)
                    .eq('id', form.id)
                    .select()
                    .single();
                
                if (error) throw error;
                savedProduct = data;
                
                setProducts(prev => prev.map(p => p.id === form.id ? { ...p, ...data, image: data.image_url } : p));
            } else {
                const { data, error } = await supabase
                    .from('products')
                    .insert([dbData])
                    .select()
                    .single();
                
                if (error) throw error;
                savedProduct = data;
                
                setProducts(prev => [{ ...data, image: data.image_url }, ...prev]);
            }

            if (supabasePath && fileToMigrate && savedProduct) {
                processBackgroundMigration(fileToMigrate, supabasePath, 'products', savedProduct.id, 'image_url')
                    .then((cloudUrl) => {
                        if (cloudUrl) {
                            setProducts(prev => prev.map(p => p.id === savedProduct.id ? { ...p, image: cloudUrl } : p));
                        }
                    });
            }

            alert("Produk Berhasil Disimpan!");
            resetForm();
        } catch (e: any) {
            alert("Gagal simpan: " + e.message);
        } finally {
            setLoading(p => ({ ...p, uploading: false }));
        }
    };

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
        showMobileEditor, setShowMobileEditor,
        listState: { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, page, setPage, totalPages, paginatedProducts, totalItems: filteredProducts.length },
        actions: { resetForm, handleEditClick, openNewProduct, deleteProduct, handleSubmit },
        aiActions: { generateTitle, generateDesc, generateSpecs, generateIncludes, generateWhyBuy, generateImage }
    };
};
