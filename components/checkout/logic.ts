import React, { useState, useRef } from 'react';
import { useCart } from '../../context/cart-context';
import { supabase, normalizePhone } from '../../utils';
import { CheckoutFormData, OrderSuccessState } from './types';

// --- HELPER: ID GENERATOR ---
const generateOrderId = () => {
    const min = 100000000000;
    const max = 999999999999;
    return Math.floor(min + Math.random() * (max - min + 1));
};

// --- HELPER: SAFE INSERT (RECURSIVE) ---
const createOrderSafe = async (payload: any, maxRetries = 5): Promise<any> => {
    for (let i = 0; i < maxRetries; i++) {
        const newId = generateOrderId();
        const { data, error } = await supabase!
            .from('orders')
            .insert([{ ...payload, id: newId }])
            .select()
            .single();

        if (!error) return data;
        if (error.code !== '23505') throw error; // If error is NOT unique violation, throw it
        console.warn(`Order ID Collision ${newId}. Retrying... (${i + 1}/${maxRetries})`);
    }
    throw new Error("Gagal membuat Order ID unik. Silakan coba lagi.");
};

// --- HOOK: SHADOW LEAD CAPTURE ---
export const useShadowLead = () => {
    const lastCapturedPhone = useRef<string>('');

    const capture = async (name: string, phone: string, cartItems: any[]) => {
        if (!name || !phone || phone.length < 9) return;
        
        const cleanPhone = normalizePhone(phone);
        if (!cleanPhone || cleanPhone === lastCapturedPhone.current) return;

        if (!supabase) return;

        try {
            const interestStr = cartItems.map(c => `${c.quantity}x ${c.name}`).join(', ');
            await supabase.from('leads').insert([{
                name: name,
                phone: cleanPhone,
                source: 'checkout_page',
                interest: interestStr || 'Browsing Cart',
                status: 'new'
            }]);
            lastCapturedPhone.current = cleanPhone;
            console.log("Shadow Lead Captured 🥷");
        } catch (e) {
            console.error("Shadow capture failed", e);
        }
    };

    return { capture };
};

// --- MAIN HOOK: CHECKOUT LOGIC ---
export const useCheckoutLogic = (setPage: (p: string) => void) => {
    const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const { capture: captureLead } = useShadowLead();
    
    const [formData, setFormData] = useState<CheckoutFormData>({
        name: '', phone: '', address: '', note: ''
    });
    
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<OrderSuccessState | null>(null);

    const handleFieldChange = (field: keyof CheckoutFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleBlur = () => {
        captureLead(formData.name, formData.phone, cart);
    };

    const submitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;
        
        if (!formData.name || !formData.phone || !formData.address) {
            return alert("Mohon lengkapi Nama, No. HP, dan Alamat.");
        }
        if (!agreedToTerms) {
            return alert("Mohon setujui Syarat & Ketentuan.");
        }

        const cleanPhone = normalizePhone(formData.phone);
        if (!cleanPhone) {
            return alert("Format Nomor WhatsApp tidak valid. Gunakan 08xx atau 628xx.");
        }

        setIsSubmitting(true);

        try {
            if (!supabase) {
                // DEMO MODE
                await new Promise(r => setTimeout(r, 1500));
                setOrderSuccess({ id: generateOrderId(), total: totalPrice });
                clearCart();
                return;
            }

            const orderPayload = {
                customer_name: formData.name,
                customer_phone: cleanPhone,
                customer_address: formData.address,
                customer_note: formData.note,
                total_amount: totalPrice,
                status: 'pending',
                payment_method: 'transfer_bnc'
            };

            const orderData = await createOrderSafe(orderPayload);

            const orderItems = cart.map(item => ({
                order_id: orderData.id,
                product_id: item.id,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

            if (itemsError) {
                // Rollback order head if items fail
                await supabase.from('orders').delete().eq('id', orderData.id);
                throw itemsError;
            }

            setOrderSuccess({ id: orderData.id, total: totalPrice });
            clearCart();

        } catch (error: any) {
            console.error(error);
            if (error.code === '23503') { // Foreign key violation
                alert("Sistem mendeteksi perubahan data produk. Keranjang diperbarui.");
                clearCart();
                setPage('shop');
            } else {
                alert(`Gagal membuat pesanan: ${error.message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        cart, removeFromCart, updateQuantity, totalPrice, clearCart,
        formData, handleFieldChange, handleBlur,
        agreedToTerms, setAgreedToTerms,
        isSubmitting, submitOrder,
        orderSuccess, setOrderSuccess
    };
};