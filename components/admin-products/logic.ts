
import { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import { supabase, CONFIG, formatNumberInput, cleanNumberInput, callGeminiWithRotation, slugify, renameFile, addWatermarkToFile, uploadToSupabase, processBackgroundMigration } from '../../utils';
import { ProductFormState, LoadingState, PRODUCT_CATEGORIES } from './types';

const ITEMS_PER_PAGE = 6;

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
        uploadFile: null
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
            specsStr: '', includesStr: '', whyBuyStr: '', imagePreview: '', uploadFile: null
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
            uploadFile: null
        });
    };

    const deleteProduct = async (id: number) => {
        if(!confirm("Hapus produk ini?")) return;
        setProducts(products.filter(p => p.id !== id));
        if (supabase) await supabase.from('products').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    // --- AI GENERATORS ---

    const generateAI = async (target: keyof LoadingState, prompt: string, onSuccess: (text: string) => void) => {
        setLoading(p => ({ ...p, [target]: true }));
        try {
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            onSuccess(res.text?.trim() || '');
        } catch (e: any) {
            alert(`AI Error: ${e.message}`);
        } finally {
            setLoading(p => ({ ...p, [target]: false }));
        }
    };

    const generateTitle = () => {
        if (!form.shortDesc) return alert("Isi 'Keywords' dulu.");
        generateAI('generatingTitle', 
            `Create a short, catchy POS product name based on: ${form.shortDesc}. Category: ${form.category}. Lang: ID. Output: JUST Name.`,
            (text) => setForm(p => ({ ...p, name: text }))
        );
    };

    const generateDesc = () => {
        if (!form.name) return alert("Isi Nama Produk dulu.");
        generateAI('generatingDesc',
            `Write persuasive product description for "${form.name}" (${form.category}). Features: ${form.shortDesc}. Lang: ID. No markdown formatting.`,
            (text) => setForm(p => ({ ...p, desc: text.replace(/\*\*/g, '') }))
        );
    };

    const generateSpecs = () => {
        if (!form.name) return alert("Isi Nama Produk dulu.");
        generateAI('generatingSpecs',
            `Generate tech specs for POS "${form.name}". Format: Key: Value (one per line). Max 6 lines.`,
            (text) => setForm(p => ({ ...p, specsStr: text }))
        );
    };

    const generateIncludes = () => {
        if (!form.name) return alert("Isi Nama Produk dulu.");
        generateAI('generatingIncludes',
            `List "Package Includes" for "${form.name}". One item per line. Lang: ID.`,
            (text) => setForm(p => ({ ...p, includesStr: text }))
        );
    };

    const generateWhyBuy = () => {
        if (!form.name) return alert("Isi Nama Produk dulu.");
        generateAI('generatingWhyBuy',
            `3-5 reasons to buy "${form.name}". Short sentences. One per line. Lang: ID. Focus on ROI/Durability.`,
            (text) => setForm(p => ({ ...p, whyBuyStr: text }))
        );
    };

    const generateImage = async () => {
        if (!form.name) return alert("Isi Nama Produk dulu.");
        setLoading(p => ({ ...p, generatingImage: true }));
        try {
            const seed = Math.floor(Math.random() * 999999);
            const prompt = `${form.name} ${form.category} modern point of sale hardware, white background, high quality, realistic`;
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&model=flux&nologo=true&seed=${seed}`;
            
            const res = await fetch(url);
            const blob = await res.blob();
            const file = new File([blob], "ai-gen.jpg", { type: "image/jpeg" });
            
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
            let finalImageUrl = form.imagePreview || 'https://via.placeholder.com/400';
            let supabasePath = '';
            let fileToMigrate = form.uploadFile;

            if (form.uploadFile) {
                // 1. Watermark
                if (useWatermark) {
                    setLoading(p => ({ ...p, processingImage: true }));
                    fileToMigrate = await addWatermarkToFile(form.uploadFile);
                    setLoading(p => ({ ...p, processingImage: false }));
                }

                // 2. Upload to Supabase (Temp)
                if (supabase && fileToMigrate) {
                    const seoName = `${slugify(form.name)}-mesin-kasir`;
                    const renamedFile = renameFile(fileToMigrate, seoName);
                    const { url, path } = await uploadToSupabase(renamedFile, 'products');
                    finalImageUrl = url;
                    supabasePath = path;
                }
            }

            // Parse text areas
            const specsObj: Record<string, string> = {};
            if (form.specsStr) {
                form.specsStr.split('\n').forEach(line => {
                    const [key, ...rest] = line.split(':');
                    if (key && rest.length > 0) specsObj[key.trim()] = rest.join(':').trim();
                });
            }
            const includesArr = form.includesStr ? form.includesStr.split('\n').map(s => s.trim()).filter(Boolean) : [];
            const whyBuyArr = form.whyBuyStr ? form.whyBuyStr.split('\n').map(s => s.trim()).filter(Boolean) : [];

            const dbData = {
                name: form.name,
                price: cleanNumberInput(form.price),
                category: form.category,
                description: form.desc,
                image_url: finalImageUrl,
                specs: specsObj,
                package_includes: includesArr,
                why_buy: whyBuyArr
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

            // Background Migration to Cloudinary
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
