
import React, { useState, useRef, useEffect } from 'react';
import { useCart } from '../../context/cart-context';
import { supabase, normalizePhone, formatRupiah } from '../../utils';
import { CheckoutFormData, OrderSuccessState } from './types';

export const useCheckoutLogic = (setPage: (p: string) => void) => {
    const { cart, removeFromCart, updateQuantity, subtotalPrice, totalPrice, clearCart, discount, setDiscount } = useCart();
    const [formData, setFormData] = useState<CheckoutFormData>({ name: '', phone: '', address: '', note: '' });
    const [couponInput, setCouponInput] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<OrderSuccessState | null>(null);
    const [step, setStep] = useState(1);

    const captureTimeout = useRef<any>(null);

    // REAL-TIME SHADOW CAPTURE (SINKRON DENGAN CRM RADAR)
    useEffect(() => {
        // VALIDASI KETAT: Cuma kirim kalau nama diisi dan nomor HP sudah mencapai panjang minimal HP Indo
        if (!formData.name || !formData.phone || formData.phone.length < 10 || cart.length === 0) return;

        if (captureTimeout.current) clearTimeout(captureTimeout.current);
        
        captureTimeout.current = setTimeout(async () => {
            const cleanPhone = normalizePhone(formData.phone);
            if (!cleanPhone || !supabase) return;

            const visitorId = localStorage.getItem('mks_visitor_id');
            const itemsList = cart.map(i => `${i.quantity}x ${i.name}`).join(', ');
            
            // Standardized format for the parser
            const report = 
                `📦PAKET: ${itemsList}\n` +
                `📍ALAMAT: ${formData.address || '-'}\n` +
                `📝CATATAN: ${formData.note || '-'}\n` +
                `💰ESTIMASI: ${formatRupiah(totalPrice)}\n` +
                `SOURCE: checkout_shadow`;

            try {
                // Upsert ke crm_profiles dengan Visitor ID biar History Link jalan
                await supabase.from('crm_profiles').upsert([{
                    phone: cleanPhone,
                    name: formData.name,
                    last_notes: report,
                    lead_status: 'new',
                    lead_temperature: 'hot',
                    visitor_id: visitorId, // KRUSIAL: Untuk link ke analytics_logs
                    detected_category: 'hardware', // FIX: Paksa jadi hardware di halaman toko
                    source_origin: 'shadow',
                    updated_at: new Date().toISOString()
                }], { onConflict: 'phone' });
                
                console.log("Intel Captured & Synced:", cleanPhone);
            } catch (e) {
                console.error("Shadow capture sync failed", e);
            }
        }, 1500); // Jedah sedikit lebih cepat biar responsif

        return () => clearTimeout(captureTimeout.current);
    }, [formData, cart, totalPrice]);

    const applyCoupon = async () => {
        if (!couponInput.trim()) return;
        setIsValidatingCoupon(true);
        try {
            if (!supabase) throw new Error("Database offline");
            const { data: coupon, error } = await supabase.from('coupons').select('*').eq('code', couponInput.toUpperCase()).eq('is_active', true).maybeSingle();
            if (error) throw error;
            if (!coupon) throw new Error("Kode promo ghaib.");
            if (subtotalPrice < coupon.min_purchase) throw new Error(`Minimal belanja Rp ${formatRupiah(coupon.min_purchase)}.`);
            let amount = coupon.discount_value;
            if (coupon.discount_type === 'percentage') {
                amount = (subtotalPrice * coupon.discount_value) / 100;
                if (coupon.max_discount && amount > coupon.max_discount) amount = coupon.max_discount;
            }
            setDiscount({ code: coupon.code, type: coupon.discount_type, value: coupon.discount_value, amount: amount });
            alert("🔥 PROMO DIAKTIFKAN!");
        } catch (e: any) { alert(e.message); setDiscount(null); } finally { setIsValidatingCoupon(false); }
    };

    const handleCheckboxToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked && !agreedToTerms) {
            setShowTermsModal(true);
        } else {
            setAgreedToTerms(e.target.checked);
        }
    };

    const confirmAgreement = () => {
        setAgreedToTerms(true);
        setShowTermsModal(false);
    };

    const submitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;
        if (!formData.name || !formData.phone || !formData.address) return alert("Lengkapi data pengiriman.");
        const cleanPhone = normalizePhone(formData.phone);
        if (!cleanPhone) return alert("Format nomor WA salah.");

        setIsSubmitting(true);
        try {
            const orderPayload = {
                customer_name: formData.name,
                customer_phone: cleanPhone,
                customer_address: formData.address,
                customer_note: formData.note,
                total_amount: totalPrice,
                status: 'pending',
                payment_method: 'transfer_bnc'
            };
            const { data: order, error } = await supabase!.from('orders').insert([orderPayload]).select().single();
            if (error) throw error;
            const orderItems = cart.map(item => ({ order_id: order.id, product_id: item.id, product_name: item.name, quantity: item.quantity, price: item.price }));
            await supabase!.from('order_items').insert(orderItems);
            
            // Finalize status in CRM
            await supabase!.from('crm_profiles').update({ lead_status: 'closed' }).eq('phone', cleanPhone);
            
            const cartSnapshot = [...cart];
            setOrderSuccess({ id: order.id, total: totalPrice, items: cartSnapshot });
            
            clearCart();
            setStep(1);
        } catch (error: any) { alert(`Gagal: ${error.message}`); } finally { setIsSubmitting(false); }
    };

    return {
        cart, removeFromCart, updateQuantity, subtotalPrice, totalPrice, discount, setDiscount,
        formData, handleFieldChange: (f: any, v: any) => setFormData(p => ({...p, [f]: v})),
        handleBlur: () => {},
        couponInput, setCouponInput, isValidatingCoupon, applyCoupon,
        agreedToTerms, handleCheckboxToggle, showTermsModal, setShowTermsModal, confirmAgreement,
        isSubmitting, submitOrder, 
        orderSuccess, setOrderSuccess, clearCart,
        step, setStep
    };
};
