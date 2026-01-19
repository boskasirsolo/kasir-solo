
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../utils';
import { RMATicket, RMAStatus } from './types';

export const useRMALogic = () => {
    const [tickets, setTickets] = useState<RMATicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<RMAStatus | 'all'>('all');
    const [selectedTicket, setSelectedTicket] = useState<RMATicket | null>(null);
    const [adminNote, setAdminNote] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data, error } = await supabase.from('rma_tickets').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setTickets(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: number, status: RMAStatus) => {
        if (!supabase) return;
        if (!confirm(`Ubah status tiket #${id} jadi ${status.toUpperCase()}?`)) return;

        try {
            const { error } = await supabase.from('rma_tickets').update({ status }).eq('id', id);
            if (error) throw error;
            setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
            if (selectedTicket && selectedTicket.id === id) {
                setSelectedTicket(prev => prev ? { ...prev, status } : null);
            }
        } catch (e: any) {
            alert("Gagal update status: " + e.message);
        }
    };

    const saveNote = async () => {
        if (!selectedTicket || !supabase) return;
        try {
            const { error } = await supabase.from('rma_tickets').update({ admin_notes: adminNote }).eq('id', selectedTicket.id);
            if (error) throw error;
            setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, admin_notes: adminNote } : t));
            alert("Catatan teknisi disimpan.");
        } catch (e: any) {
            alert("Gagal simpan catatan.");
        }
    };

    const openDetail = (ticket: RMATicket) => {
        setSelectedTicket(ticket);
        setAdminNote(ticket.admin_notes || '');
    };

    const filteredTickets = useMemo(() => {
        return tickets.filter(t => {
            const matchSearch = t.order_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                t.customer_phone.includes(searchTerm) ||
                                t.serial_number.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = selectedStatus === 'all' || t.status === selectedStatus;
            return matchSearch && matchStatus;
        });
    }, [tickets, searchTerm, selectedStatus]);

    // WA Link Generator
    const getWaLink = (ticket: RMATicket) => {
        const text = `Halo Kak, update untuk Tiket Klaim #${ticket.id} (Order: ${ticket.order_id}). Status saat ini: ${ticket.status.toUpperCase()}.`;
        return `https://wa.me/${ticket.customer_phone}?text=${encodeURIComponent(text)}`;
    };

    return {
        state: { tickets, loading, searchTerm, selectedStatus, selectedTicket, adminNote, filteredTickets },
        actions: { setSearchTerm, setSelectedStatus, openDetail, closeDetail: () => setSelectedTicket(null), updateStatus, setAdminNote, saveNote, getWaLink, refresh: fetchTickets }
    };
};
