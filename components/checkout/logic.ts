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

    // --- BITESHIP & FALLBACK STATES ---
    const [areaQuery, setAreaQuery] = useState('');
    const [areaResults, setAreaResults] = useState<any[]>([]);
    const [selectedArea, setSelectedArea] = useState<any>(null);
    const [isSearchingArea, setIsSearchingArea] = useState(false);
    const [shippingRates, setShippingRates] = useState<any[]>([]);
    const [selectedRate, setSelectedRate] = useState<any>(null);
    const [isLoadingRates, setIsLoadingRates] = useState(false);
    const [shippingError, setShippingError] = useState<string | null>(null);
    const [isManualShipping, setIsManualShipping] = useState(false);

    const searchTimeout = useRef<any>(null);

    // 1. Search Area Autocomplete
    useEffect(() => {
        if (areaQuery.length < 3) {
            setAreaResults([]);
            return;
        }
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(async () => {
            setIsSearchingArea(true);
            try {
                const res = await fetch(`/api/biteship/maps?input=${encodeURIComponent(areaQuery)}`);
                const data = await res.json();
                if (data.areas) setAreaResults(data.areas);
            } catch (e) {
                console.error("Biteship Maps Error", e);
            } finally {
                setIsSearchingArea(false);
            }
        }, 800);
        return () => clearTimeout(searchTimeout.current);
    }, [areaQuery]);

    // 2. Fetch Shipping Rates on Area Select
    useEffect(() => {
        const fetchRates = async () => {
            if (!selectedArea || cart.length === 0) return;
            
            setIsLoadingRates(true);
            setShippingError(null);
            setShippingRates([]);
            setSelectedRate(null);
            setIsManualShipping(false); // Reset manual flag
            
            try {
                const items = cart.map(item => ({
                    name: item.name,
                    description: item.category,
                    value: item.price,
                    weight: item.weight_grams || 2000,
                    length: item.length_cm || 20, 
                    width: item.width_cm || 20,  
                    height: item.height_cm || 20, 
                    quantity: item.quantity
                }));

                const res = await fetch('/api/biteship/rates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ destination_area_id: selectedArea.id, items })
                });

                const data = await res.json();
                
                // Jika API Biteship ngasih error "Route Not Found"
                if (!res.ok) {
                    setIsManualShipping(true);
                    setShippingError("Rute otomatis tidak tersedia untuk wilayah ini.");
                    return;
                }

                if (data.pricing && data.pricing.length > 0) {
                    const activeCouriers = ['jne', 'jnt', 'sicepat', 'tiki', 'pos', 'anteraja', 'ninja', 'lion'];
                    const filtered = data.pricing.filter((p: any) => {
                        const code = p.courier_code.toLowerCase();
                        return activeCouriers.some(c => code.includes(c));
                    });

                    if (filtered.length > 0) {
                        setShippingRates(filtered);
                        setSelectedRate(filtered[0]);
                    } else {
                        // Jika ada rute tapi kurir yang kita mau gak ada
                        setIsManualShipping(true);
                        setShippingError("Ekspedisi pilihan tidak cover area ini.");
                    }
                } else {
                    setIsManualShipping(true);
                    setShippingError("Tidak ada layanan pengiriman otomatis.");
                }
            } catch (e: any) {
                console.error("Biteship Rates Error", e);
                setIsManualShipping(true);
                setShippingError("Sistem kurir lagi limit, gunakan pengiriman manual.");
            } finally {
                setIsLoadingRates(false);
            }
        };
        fetchRates();
    }, [selectedArea, cart]);

    // --- COUPON & TERMS ACTIONS ---

    // FIX: Added missing applyCoupon function
    const applyCoupon = () => {
        if (!couponInput) return;
        setIsValidatingCoupon(true);
        // Simulasi validasi kupon
        setTimeout(() => {
            if (couponInput === 'KASIRSOLO2025') {
                const discValue = 100000; // Contoh potongan flat 100rb
                setDiscount({
                    code: couponInput,
                    type: 'fixed',
                    value: discValue,
                    amount: discValue
                });
                alert("Mantap Bos, kupon 'KASIRSOLO2025' aktif! Potongan Rp 100.000.");
            } else {
                alert("Kupon ghaib, gak terdaftar di sistem.");
            }
            setIsValidatingCoupon(false);
        }, 1000);
    };

    // FIX: Added missing handleCheckboxToggle function
    const handleCheckboxToggle = () => {
        if (!agreedToTerms) {
            setShowTermsModal(true);
        } else {
            setAgreedToTerms(false);
        }
    };

    // Total harga dinamis: Jika manual, ongkir dianggap 0 di sistem (nego di WA)
    const finalTotal = isManualShipping ? totalPrice : (totalPrice + (selectedRate?.price || 0));

    const submitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;
        
        // Validasi identitas dasar
        if (!formData.name || !formData.phone || !formData.address || !selectedArea) {
            return alert("Lengkapi data pengiriman Juragan.");
        }
        
        // Harus pilih kurir ATAU sedang dalam mode manual
        if (!selectedRate && !isManualShipping) {
            return alert("Tunggu sebentar, sedang mengecek rute...");
        }
        
        const cleanPhone = normalizePhone(formData.phone);
        if (!cleanPhone) return alert("Nomor WA gak valid Bos.");

        setIsSubmitting(true);
        try {
            const orderPayload = {
                customer_name: formData.name,
                customer_phone: cleanPhone,
                customer_address: `${formData.address}, ${selectedArea.name}`,
                customer_note: formData.note,
                total_amount: finalTotal,
                status: 'pending',
                payment_method: 'transfer_bnc',
                shipping_cost: selectedRate?.price || 0,
                shipping_courier: selectedRate?.courier_name || 'MANUAL/CARGO',
                shipping_service: selectedRate?.service_display || 'Nego via WhatsApp',
                destination_area_id: selectedArea.id
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
            
            setOrderSuccess({ id: order.id, total: finalTotal, items: [...cart] });
            clearCart();
        } catch (error: any) {
            alert(`Gagal Bos: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        cart, removeFromCart, updateQuantity, subtotalPrice, totalPrice, discount, setDiscount,
        formData, handleFieldChange: (f: any, v: any) => setFormData(p => ({...p, [f]: v})),
        handleBlur: () => {},
        couponInput, setCouponInput, isValidatingCoupon, applyCoupon,
        agreedToTerms, handleCheckboxToggle, showTermsModal, setShowTermsModal, confirmAgreement: () => { setAgreedToTerms(true); setShowTermsModal(false); },
        isSubmitting, submitOrder, 
        orderSuccess, setOrderSuccess, clearCart,
        step, setStep,
        area: { query: areaQuery, setQuery: setAreaQuery, results: areaResults, isSearching: isSearchingArea, selected: selectedArea, setSelected: setSelectedArea },
        shipping: { rates: shippingRates, selected: selectedRate, setSelected: setSelectedRate, isLoading: isLoadingRates, total: finalTotal, error: shippingError, isManual: isManualShipping, setIsManual: setIsManualShipping }
    };
};