import { useState, useEffect } from 'react';
import { supabase } from '../../utils';
import { Order, OrderItem, Lead } from '../../types';
import { OrderState, LeadState } from './types';

// --- ORDER LOGIC ---
export const useOrderLogic = () => {
    const [state, setState] = useState<OrderState>({
        orders: [],
        loading: true,
        expandedOrderId: null,
        orderItems: {}
    });

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        if (!supabase) { setState(p => ({ ...p, loading: false })); return; }
        try {
            const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setState(p => ({ ...p, orders: data || [], loading: false }));
        } catch (e) {
            alert("Gagal mengambil data pesanan.");
            setState(p => ({ ...p, loading: false }));
        }
    };

    const fetchOrderItems = async (orderId: number) => {
        if (state.orderItems[orderId]) {
            setState(p => ({ ...p, expandedOrderId: p.expandedOrderId === orderId ? null : orderId }));
            return;
        }
        if (!supabase) return;
        try {
            const { data: items, error } = await supabase.from('order_items').select('*').eq('order_id', orderId);
            if (error) throw error;
            if (items && items.length > 0) {
                const productIds = items.map((i: any) => i.product_id).filter(Boolean);
                if (productIds.length > 0) {
                    const { data: products } = await supabase.from('products').select('id, specs').in('id', productIds);
                    if (products) {
                        items.forEach((item: any) => {
                            const p = products.find((prod: any) => prod.id === item.product_id);
                            if (p) item.products = { specs: p.specs }; 
                        });
                    }
                }
            }
            setState(p => ({
                ...p,
                orderItems: { ...p.orderItems, [orderId]: items || [] },
                expandedOrderId: orderId
            }));
        } catch (e) { console.error(e); }
    };

    const updateStatus = async (orderId: number, newStatus: string) => {
        if (!supabase) return;
        try {
            const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
            if (error) throw error;
            setState(p => ({
                ...p,
                orders: p.orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o)
            }));
        } catch(e) { alert("Gagal update status"); }
    };

    const updateShipping = async (orderId: number, courier: string, trackingNumber: string) => {
        if (!supabase) return;
        try {
            const status = trackingNumber ? 'completed' : 'processed';
            const { error } = await supabase.from('orders').update({ courier, tracking_number: trackingNumber, status }).eq('id', orderId);
            if(error) throw error;
            setState(p => ({
                ...p,
                orders: p.orders.map(o => o.id === orderId ? { ...o, courier, tracking_number: trackingNumber, status: status as any } : o)
            }));
            alert("Data pengiriman disimpan!");
        } catch(e) { alert("Gagal simpan resi"); }
    };

    const toggleExpand = (orderId: number) => fetchOrderItems(orderId);
    return { state, fetchOrders, fetchOrderItems, updateStatus, updateShipping, toggleExpand };
};

// --- LEAD LOGIC (SYNCED TO CRM) ---
export const useLeadLogic = () => {
    const [state, setState] = useState<LeadState>({ leads: [], loading: true });

    useEffect(() => { fetchLeads(); }, []);

    const fetchLeads = async () => {
        if (!supabase) { setState(p => ({...p, loading: false})); return; }
        
        // Audit: Ambil data dari crm_profiles
        const { data } = await supabase
            .from('crm_profiles')
            .select('phone, name, lead_status, last_notes, created_at, detected_category, source_origin')
            .order('updated_at', { ascending: false });
        
        const mappedData = (data || []).map((p: any) => ({
            id: p.phone, 
            name: p.name,
            phone: p.phone,
            notes: p.last_notes || '',
            status: p.lead_status, // Pastikan lead_status
            source: p.detected_category || p.source_origin || 'direct',
            created_at: p.created_at
        }));

        setState({ leads: mappedData as any, loading: false });
    };

    const updateLeadStatus = async (id: any, status: string) => {
        if (!supabase) return;
        await supabase.from('crm_profiles').update({ lead_status: status }).eq('phone', id);
        setState(p => ({
            ...p,
            leads: p.leads.map(l => l.id === id ? { ...l, status: status as any } : l)
        }));
    };

    const deleteLead = async (id: any) => {
        if (!confirm("Hapus juragan ini dari CRM?")) return;
        if (!supabase) return;
        try {
            await supabase.from('crm_profiles').delete().eq('phone', id);
            setState(p => ({ ...p, leads: p.leads.filter(l => l.id !== id) }));
        } catch (e) {
            alert("Gagal hapus data.");
        }
    };

    return { state, fetchLeads, updateLeadStatus, deleteLead };
};