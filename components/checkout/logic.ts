
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

    // --- BITESHIP STATES ---
    const [areaQuery, setAreaQuery] = useState('');
    const [areaResults, setAreaResults] = useState<any[]>([]);
    const [selectedArea, setSelectedArea] = useState<any>(null);
    const [isSearchingArea, setIsSearchingArea] = useState(false);
    const [shippingRates, setShippingRates] = useState<any[]>([]);
    const [selectedRate, setSelectedRate] = useState<any>(null);
    const [isLoadingRates, setIsLoadingRates] = useState(false);
    const [shippingError, setShippingError] = useState<string | null>(null);

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
            
            try {
                // Siapkan payload barang dengan DATA ASLI DARI DATABASE
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
                    body: JSON.stringify({
                        destination_area_id: selectedArea.id,
                        items
                    })
                });

                const data = await res.json();
                
                if (!res.ok) {
                    throw new Error(data.error || "Gagal menarik ongkir.");
                }

                if (data.pricing && data.pricing.length > 0) {
                    // Lock kurir sesuai instruksi juragan: jne, tiki, ninja, lion, sicepat, jnt, pos, anteraja
                    const activeCouriers = ['jne', 'tiki', 'ninja', 'lion', 'sicepat', 'jnt', 'pos', 'anteraja'];
                    const filtered = data.pricing.filter((p: any) => 
                        activeCouriers.includes(p.courier_code)
                    );
                    setShippingRates(filtered);
                    if (filtered.length > 0) setSelectedRate(filtered[0]);
                    else setShippingError("Kurir terpilih tidak tersedia di wilayah ini.");
                } else {
                    setShippingError("Tidak ada layanan pengiriman tersedia.");
                }
            } catch (e: any) {
                console.error("Biteship Rates Error", e);
                setShippingError(e.message || "Gagal menghubungkan ke server kurir.");
            } finally {
                setIsLoadingRates(false);
            }
        };

        fetchRates();
    }, [selectedArea, cart]);

    const finalTotal = totalPrice + (selectedRate?.price || 0);

    const submitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;
        if (!formData.name || !formData.phone || !formData.address || !selectedArea || !selectedRate) {
            return alert("Lengkapi data pengiriman dan pilih kurir.");
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
                shipping_cost: selectedRate.price,
                shipping_courier: selectedRate.courier_name,
                shipping_service: selectedRate.service_display,
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
            
            const cartSnapshot = [...cart];
            setOrderSuccess({ id: order.id, total: finalTotal, items: cartSnapshot });
            clearCart();
        } catch (error: any) {
            alert(`Gagal Bos: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCheckboxToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked && !agreedToTerms) setShowTermsModal(true);
        else setAgreedToTerms(e.target.checked);
    };

    const confirmAgreement = () => {
        setAgreedToTerms(true);
        setShowTermsModal(false);
    };

    const applyCoupon = async () => {
        if (!couponInput) return;
        setIsValidatingCoupon(true);
        
        setTimeout(() => {
            const code = couponInput.toUpperCase();
            if (code === 'KASIRSOLO2025' || code === 'MKSDEAL') {
                const discountVal = 50000;
                setDiscount({
                    code,
                    type: 'fixed',
                    value: discountVal,
                    amount: discountVal
                });
                alert("MANTAP! Kupon sakti berhasil dipasang.");
            } else {
                alert("KODE ZONK! Coba kode lain atau tanya Mas Amin.");
                setDiscount(null);
            }
            setIsValidatingCoupon(false);
            setCouponInput('');
        }, 1000);
    };

    return {
        cart, removeFromCart, updateQuantity, subtotalPrice, totalPrice, discount, setDiscount,
        formData, handleFieldChange: (f: any, v: any) => setFormData(p => ({...p, [f]: v})),
        handleBlur: () => {},
        couponInput, setCouponInput, isValidatingCoupon, applyCoupon,
        agreedToTerms, handleCheckboxToggle, showTermsModal, setShowTermsModal, confirmAgreement,
        isSubmitting, submitOrder, 
        orderSuccess, setOrderSuccess, clearCart,
        step, setStep,
        area: { query: areaQuery, setQuery: setAreaQuery, results: areaResults, isSearching: isSearchingArea, selected: selectedArea, setSelected: setSelectedArea },
        shipping: { rates: shippingRates, selected: selectedRate, setSelected: setSelectedRate, isLoading: isLoadingRates, total: finalTotal, error: shippingError }
    };
};
