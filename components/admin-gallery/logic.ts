
import { useState } from 'react';
import { GalleryItem, Testimonial } from '../../types';
import { supabase, CONFIG, callGeminiWithRotation, slugify, renameFile, addWatermarkToFile, uploadToCloudinary } from '../../utils';
import { GalleryFormState, TestimonialFormState, LoadingState } from './types';

const ITEMS_PER_PAGE = 8;

export const useGalleryLogic = (
    gallery: GalleryItem[], 
    setGallery: (g: GalleryItem[]) => void,
    testimonials: Testimonial[],
    setTestimonials: (t: Testimonial[]) => void
) => {
    // --- STATE ---
    const [form, setForm] = useState<GalleryFormState>({
        id: null,
        title: '',
        category_type: 'physical',
        platform: 'web',
        client_url: '',
        tech_stack_str: '',
        shortDesc: '',
        longDesc: '',
        cs_challenge: '',
        cs_solution: '',
        cs_result: '',
        imagePreview: '',
        uploadFile: null,
        galleryImages: [],
        newGalleryFiles: []
    });

    const [testiForm, setTestiForm] = useState<TestimonialFormState>({
        id: null,
        client_name: '',
        content: '',
        rating: 5,
        imagePreview: '',
        uploadFile: null,
        hasTestimonial: false
    });

    const [loading, setLoading] = useState<LoadingState>({
        generatingAI: false,
        uploading: false,
        generatingSpecific: null,
        processingImage: false
    });

    const [useWatermark, setUseWatermark] = useState(true);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showMobileEditor, setShowMobileEditor] = useState(false);

    // --- ACTIONS ---

    const resetForm = () => {
        setForm({
            id: null, title: '', category_type: 'physical', platform: 'web', client_url: '',
            tech_stack_str: '', shortDesc: '', longDesc: '', cs_challenge: '', cs_solution: '', cs_result: '',
            imagePreview: '', uploadFile: null, galleryImages: [], newGalleryFiles: []
        });
        setTestiForm({
            id: null, client_name: '', content: '', rating: 5, imagePreview: '', uploadFile: null, hasTestimonial: false
        });
        setUseWatermark(true);
        setShowMobileEditor(false);
    };

    const handleEditClick = (item: GalleryItem) => {
        setForm({
            id: item.id,
            title: item.title,
            category_type: item.category_type || 'physical',
            platform: item.platform || 'web',
            client_url: item.client_url || '',
            tech_stack_str: item.tech_stack ? item.tech_stack.join(', ') : '',
            shortDesc: '',
            longDesc: item.description || '',
            cs_challenge: item.case_study?.challenge || '',
            cs_solution: item.case_study?.solution || '',
            cs_result: item.case_study?.result || '',
            imagePreview: item.image_url,
            uploadFile: null,
            galleryImages: item.gallery_images || [],
            newGalleryFiles: []
        });

        // Find linked testimonial
        const linkedTestimonial = testimonials.find(t => 
            t.business_name.toLowerCase() === item.title.toLowerCase() ||
            item.title.toLowerCase().includes(t.business_name.toLowerCase())
        );

        if (linkedTestimonial) {
            setTestiForm({
                id: linkedTestimonial.id,
                client_name: linkedTestimonial.client_name,
                content: linkedTestimonial.content,
                rating: linkedTestimonial.rating,
                imagePreview: linkedTestimonial.image_url || '',
                uploadFile: null,
                hasTestimonial: true
            });
        } else {
            setTestiForm({
                id: null, client_name: '', content: '', rating: 5, imagePreview: '', uploadFile: null, hasTestimonial: false
            });
        }
        setShowMobileEditor(true);
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus project ini?")) return;
        setGallery(gallery.filter(g => g.id !== id));
        if (supabase) await supabase.from('gallery').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    // --- AI GENERATORS ---

    const generateSpecificPoint = async (target: 'challenge' | 'solution' | 'result') => {
        if (!form.title) return alert("Isi Judul Proyek dulu sebagai konteks.");
        setLoading(prev => ({ ...prev, generatingSpecific: target }));
        try {
            let contextData = `Project: "${form.title}" (${form.category_type})`;
            if (form.cs_challenge) contextData += `\nProblem: "${form.cs_challenge}"`;
            if (form.cs_solution) contextData += `\nSolution: "${form.cs_solution}"`;

            let prompt = "";
            if (target === 'challenge') prompt = `Context:\n${contextData}\nTask: Write 1-2 sentences in Indonesian about the business pain point/challenge. Tone: Realistic, Gritty. NO INTRO.`;
            else if (target === 'solution') prompt = `Context:\n${contextData}\nTask: Write 1-2 sentences in Indonesian about the technical solution implemented. Tone: Professional. NO INTRO.`;
            else if (target === 'result') prompt = `Context:\n${contextData}\nTask: Write 1 sentence in Indonesian about the business outcome/success. Tone: Positive. NO INTRO.`;

            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const text = res.text?.trim().replace(/^"|"$/g, '') || "";

            if (target === 'challenge') setForm(p => ({...p, cs_challenge: text}));
            if (target === 'solution') setForm(p => ({...p, cs_solution: text}));
            if (target === 'result') setForm(p => ({...p, cs_result: text}));
        } catch (e) { console.error(e); } 
        finally { setLoading(prev => ({ ...prev, generatingSpecific: null })); }
    };

    const generateAINarrative = async () => {
        if (!form.title) return alert("Isi Judul Proyek dulu.");
        setLoading(prev => ({ ...prev, generatingAI: true }));
        try {
            const context = `Project: ${form.title}\nType: ${form.category_type}\nChallenge: ${form.cs_challenge}\nSolution: ${form.cs_solution}\nResult: ${form.cs_result}`;
            const prompt = `Role: Portfolio Writer. Task: Write a project description (2 paragraphs) in Indonesian based on: ${context}. Tone: Professional but engaging. NO INTRO.`;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setForm(prev => ({ ...prev, longDesc: res.text?.trim() || '' }));

            if (testiForm.hasTestimonial) {
                 const testiPrompt = `Role: Happy Client. Task: Write a short testimonial (1 sentence) about "${form.title}". Context: ${form.cs_result}. Lang: Indonesian. NO INTRO.`;
                 const testiRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: testiPrompt });
                 setTestiForm(prev => ({ ...prev, content: testiRes.text?.trim() || '', client_name: prev.client_name || "Nama Klien (Edit)" }));
            }
        } catch (e: any) { alert(`AI Error: ${e.message}`); } 
        finally { setLoading(prev => ({ ...prev, generatingAI: false })); }
    };

    // --- SUBMIT HANDLER ---

    const handleSubmit = async () => {
        if (!CONFIG.CLOUDINARY_CLOUD_NAME) return alert("Config Cloudinary Missing");
        if (!form.title) return alert("Judul Project wajib diisi");

        setLoading(prev => ({ ...prev, uploading: true }));
        try {
            // 1. Upload Cover Image
            let finalCoverUrl = form.imagePreview;
            if (form.uploadFile) {
                let file = form.uploadFile;
                if (useWatermark) {
                    setLoading(prev => ({ ...prev, processingImage: true }));
                    file = await addWatermarkToFile(file);
                    setLoading(prev => ({ ...prev, processingImage: false }));
                }
                // SEO INJECTION
                const seoName = `${slugify(form.title)}-mesin-kasir-solo-project-cover`;
                const renamed = renameFile(file, seoName);
                finalCoverUrl = await uploadToCloudinary(renamed);
            }

            // 2. Upload Gallery Images
            const newUploadedUrls: string[] = [];
            if (form.newGalleryFiles.length > 0) {
                if (useWatermark) setLoading(prev => ({ ...prev, processingImage: true }));
                const uploadPromises = form.newGalleryFiles.map(async (file, idx) => {
                    let f = file;
                    if (useWatermark) f = await addWatermarkToFile(f);
                    // SEO INJECTION
                    const seoName = `${slugify(form.title)}-mesin-kasir-solo-gallery-${idx+1}`;
                    const renamed = renameFile(f, seoName);
                    return uploadToCloudinary(renamed);
                });
                const results = await Promise.all(uploadPromises);
                if (useWatermark) setLoading(prev => ({ ...prev, processingImage: false }));
                results.forEach(url => { if(url) newUploadedUrls.push(url); });
            }
            const finalGalleryImages = [...form.galleryImages, ...newUploadedUrls];

            // 3. Save Gallery
            const dbData: Partial<GalleryItem> = {
                title: form.title,
                image_url: finalCoverUrl || 'https://via.placeholder.com/800x600',
                gallery_images: finalGalleryImages,
                category_type: form.category_type,
                description: form.longDesc || form.cs_solution,
                platform: form.platform,
                client_url: form.client_url,
                tech_stack: form.tech_stack_str ? form.tech_stack_str.split(',').map(s => s.trim()) : ['Solusi Bisnis'],
                case_study: { challenge: form.cs_challenge, solution: form.cs_solution, result: form.cs_result }
            };

            if (form.id) {
                setGallery(gallery.map(g => g.id === form.id ? { ...g, ...dbData } as GalleryItem : g));
                if (supabase) await supabase.from('gallery').update(dbData).eq('id', form.id);
            } else {
                const newId = Date.now();
                setGallery([{ ...dbData, id: newId } as GalleryItem, ...gallery]);
                if (supabase) await supabase.from('gallery').insert([dbData]);
            }

            // 4. Save Testimonial
            if (testiForm.hasTestimonial) {
                let finalTestiImage = testiForm.imagePreview;
                if (testiForm.uploadFile) {
                    // SEO INJECTION
                    const seoName = `${slugify(testiForm.client_name || 'klien')}-avatar-mesin-kasir-solo`;
                    const renamed = renameFile(testiForm.uploadFile, seoName);
                    finalTestiImage = await uploadToCloudinary(renamed);
                }
                const testiData = {
                    client_name: testiForm.client_name || "Pelanggan Puas",
                    business_name: form.title,
                    content: testiForm.content,
                    rating: testiForm.rating,
                    image_url: finalTestiImage,
                    is_featured: true
                };
                if (testiForm.id) {
                    setTestimonials(testimonials.map(t => t.id === testiForm.id ? { ...t, ...testiData } : t));
                    if (supabase) await supabase.from('testimonials').update(testiData).eq('id', testiForm.id);
                } else {
                    const newTestiId = Date.now() + 1;
                    setTestimonials([{ ...testiData, id: newTestiId } as Testimonial, ...testimonials]);
                    if (supabase) await supabase.from('testimonials').insert([testiData]);
                }
            }

            resetForm();
            alert("Project berhasil disimpan!");
        } catch (e: any) {
            alert(`Gagal simpan: ${e.message}`);
        } finally {
            setLoading(prev => ({ ...prev, uploading: false }));
        }
    };

    // --- UTILS ---
    const handleTypeChange = (val: string) => {
        if (val === 'hardware') setForm(p => ({ ...p, category_type: 'physical', platform: 'desktop' })); 
        else setForm(p => ({ ...p, category_type: 'digital', platform: val as any }));
    };

    const getCurrentType = () => {
        if (form.category_type === 'physical') return 'hardware';
        return form.platform;
    };

    const filtered = gallery.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return {
        form, setForm,
        testiForm, setTestiForm,
        loading,
        useWatermark, setUseWatermark,
        showMobileEditor, setShowMobileEditor,
        listState: { paginated, totalPages, page, setPage, searchTerm, setSearchTerm },
        actions: { resetForm, handleEditClick, deleteItem, handleSubmit, generateAINarrative, generateSpecificPoint, handleTypeChange, getCurrentType }
    };
};
