
import React, { useState, useRef } from 'react';
import { supabase, normalizePhone } from '../../utils';
import { ContactFormState } from './types';
import { SiteConfig } from '../../types';

export const useContactLogic = (config: SiteConfig) => {
    const [form, setForm] = useState<ContactFormState>({
        name: '',
        phone: '',
        category: 'Konsultasi Sistem',
        message: ''
    });

    const lastCapturedPhone = useRef<string>('');

    const handleShadowCapture = async () => {
        // Filter input tidak lengkap atau nomor kependekan
        if (!form.name || !form.phone || form.phone.length < 10) return;
        
        const cleanPhone = normalizePhone(form.phone);
        if (!cleanPhone || cleanPhone === lastCapturedPhone.current) return;

        if (!supabase) return;

        const visitorId = localStorage.getItem('mks_visitor_id');

        try {
            // Audit: Tembak ke crm_profiles agar data terpusat
            await supabase.from('crm_profiles').upsert([{
                name: form.name,
                phone: cleanPhone,
                last_notes: `Topik: ${form.category}. Pesan Awal: ${form.message.substring(0, 100)}...`,
                lead_status: 'new',
                lead_temperature: 'cold',
                visitor_id: visitorId,
                source_origin: 'kontak',
                detected_category: 'web',
                updated_at: new Date().toISOString()
            }], { onConflict: 'phone' });
            
            lastCapturedPhone.current = cleanPhone;
        } catch (e) {
            console.error("Contact shadow capture sync failed", e);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!form.name || !form.message) return alert("Mohon lengkapi pesan Anda");
        
        const cleanPhone = normalizePhone(form.phone);
        if (!cleanPhone && form.phone) { 
           return alert("Format nomor HP tidak valid. Gunakan 08xx atau 628xx.");
        }
    
        const text = `*HALO MAS AMIN (VIA WEB)*%0A%0ANama: ${form.name}%0ANo HP: ${cleanPhone || form.phone}%0ATopik: ${form.category}%0A%0APesan:%0A${form.message}`;
        const url = `https://wa.me/${config.whatsapp_number}?text=${text}`;
        window.open(url, '_blank');
    };

    return {
        form, setForm,
        handleShadowCapture,
        handleSubmit
    };
};
