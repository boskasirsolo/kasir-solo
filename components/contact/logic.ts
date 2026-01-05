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
        if (!form.name || !form.phone || form.phone.length < 9) return;
        
        const cleanPhone = normalizePhone(form.phone);
        if (!cleanPhone || cleanPhone === lastCapturedPhone.current) return;

        if (!supabase) return;

        try {
            await supabase.from('leads').insert([{
                name: form.name,
                phone: cleanPhone,
                source: 'contact_form',
                interest: form.category,
                notes: form.message.substring(0, 100) + '...',
                status: 'new'
            }]);
            lastCapturedPhone.current = cleanPhone;
        } catch (e) {
            console.error("Shadow capture failed", e);
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
        const url = `https://wa.me/${config.whatsappNumber}?text=${text}`;
        window.open(url, '_blank');
    };

    return {
        form, setForm,
        handleShadowCapture,
        handleSubmit
    };
};