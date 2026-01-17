
import React, { useState, useRef } from 'react';
import { useCart } from '../../context/cart-context';
import { supabase, normalizePhone, formatRupiah } from '../../utils';
import { CheckoutFormData, OrderSuccessState } from './types';

export const useCheckoutLogic = (setPage: (p: string) => void) => {
    const { cart, removeFromCart, updateQuantity, subtotalPrice, totalPrice, clearCart, discount, setDiscount } = useCart();
    const [formData, setFormData] = useState<CheckoutFormData>({ name: '', phone: '', address: '', note: '' });
    const [couponInput, setCouponInput] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<OrderSuccessState | null>(null);

    const lastCapturedPhone = useRef<string>('');
    
    // REFINED: Shadow Lead Capture for Checkout (Hardware)
    const handleBlur = async () => {
        if (!formData.name || !formData.phone || formData.phone.length < 9) return;
        
        const cleanPhone = normalizePhone(formData.phone);
        if (!cleanPhone) return;

        if (!supabase) return;

        const cartItemsList = cart.map(i => `${i.quantity}x ${i.name}`).join(', ');

        // STANDARDIZED INTEL FORMAT (Matching Parser)
        const intelReport = 
            `📦PAKET: ${cartItemsList || 'Isi Keranjang'}\n` +
            `📍ALAMAT: ${formData.address || '-'}\n` +
            `📝CATATAN: ${formData.note || '-'}\n` +
            `💰ESTIMASI: ${formatRupiah(totalPrice)}`;

        try {
            await supabase.from('leads').upsert([{
                name: formData.name,
                phone: cleanPhone,
                source: 'checkout_page',
                interest: 'Hardware Checkout Intent',
                notes: intelReport,
                status: 'new'
            }], { onConflict: 'phone' });
            lastCapturedPhone.current = cleanPhone;
        } catch (e) {
            console.error("Checkout shadow capture failed", e);
        }
    };

    const applyCoupon = async () => {
        if (!couponInput.trim()) return;
        setIsValidatingCoupon(true);
        try {
            if (!supabase) throw new Error("Database offline");
            const { data: coupon, error } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', couponInput.toUpperCase())
                .eq('is_active', true)
                .maybeSingle();

            if (error) throw error;
            if (!coupon) throw new Error("Kode promo ghaib atau sudah hangus.");
            if (subtotalPrice < coupon.min_purchase) {
                throw new Error(`Minimal belanja Rp ${new Intl.NumberFormat('id-ID').format(coupon.min_purchase)} buat pake kode ini.`);
            }

            let amount = coupon.discount_value;
            if (coupon.discount_type === 'percentage') {
                amount = (subtotalPrice * coupon.discount_value) / 100;
                if (coupon.max_discount && amount > coupon.max_discount) amount = coupon.max_discount;
            }

            setDiscount({ code: coupon.code, type: coupon.discount_type, value: coupon.discount_value, amount: amount });
            alert("🔥 PROMO DIAKTIFKAN!");
        } catch (e: any) {
            alert(e.message);
            setDiscount(null);
        } finally { setIsValidatingCoupon(false); }
    };

    const submitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;
        if (!formData.name || !formData.phone || !formData.address) return alert("Lengkapi data pengiriman.");
        if (!agreedToTerms) return alert("Setujui syarat & ketentuan.");

        const cleanPhone = normalizePhone(formData.phone);
        if (!cleanPhone) return alert("Format WA salah.");

        setIsSubmitting(true);
        try {
            const orderPayload = {
                customer_name: formData.name,
                customer_phone: cleanPhone,
                customer_address: formData.address,
                customer_note: formData.note,
                total_amount: totalPrice,
                discount_code: discount?.code || null,
                discount_amount: discount?.amount || 0,
                status: 'pending',
                payment_method: 'transfer_bnc'
            };

            const { data: order, error } = await supabase!.from('orders').insert([orderPayload]).select().single();
            if (error) throw error;

            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_id: item.id,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price
            }));

            await supabase!.from('order_items').insert(orderItems);
            if (discount) await supabase!.rpc('increment_coupon_usage', { coupon_code: discount.code });

            setOrderSuccess({ id: order.id, total: totalPrice });
            clearCart();
        } catch (error: any) {
            alert(`Gagal: ${error.message}`);
        } finally { setIsSubmitting(false); }
    };

    return {
        cart, removeFromCart, updateQuantity, subtotalPrice, totalPrice, discount, setDiscount,
        formData, handleFieldChange: (f: any, v: any) => setFormData(p => ({...p, [f]: v})),
        handleBlur,
        couponInput, setCouponInput, isValidatingCoupon, applyCoupon,
        agreedToTerms, setAgreedToTerms, isSubmitting, submitOrder, 
        orderSuccess, setOrderSuccess, clearCart
    };
};
