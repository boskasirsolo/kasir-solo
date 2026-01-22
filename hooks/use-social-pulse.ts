
import { useState, useEffect } from 'react';
import { supabase } from '../utils';

export interface PulseEvent {
    id: string;
    type: 'order' | 'lead' | 'simulation';
    name: string;
    location: string;
    item: string;
    time: string;
}

export const useSocialPulse = () => {
    const [events, setEvents] = useState<PulseEvent[]>([]);
    const [currentEvent, setCurrentEvent] = useState<PulseEvent | null>(null);

    useEffect(() => {
        const fetchRecentActivity = async () => {
            if (!supabase) return;

            try {
                // Tarik data gabungan dari 3 sumber
                const [orders, leads, sims] = await Promise.all([
                    supabase.from('orders').select('id, customer_name, customer_address, created_at').order('created_at', { ascending: false }).limit(3),
                    supabase.from('leads').select('id, name, notes, created_at').ilike('source', '%shadow%').order('created_at', { ascending: false }).limit(3),
                    supabase.from('service_simulations').select('id, customer_name, address, service_name, created_at').order('created_at', { ascending: false }).limit(3)
                ]);

                const combined: PulseEvent[] = [];

                orders.data?.forEach(o => combined.push({
                    id: `ord-${o.id}`, type: 'order', name: o.customer_name,
                    location: o.customer_address?.split(',').pop()?.trim() || 'Indonesia',
                    item: 'Paket Mesin Kasir', time: o.created_at
                }));

                leads.data?.forEach(l => combined.push({
                    id: `lead-${l.id}`, type: 'lead', name: l.name,
                    location: 'Area Terdekat', item: 'Lirik-lirik Produk', time: l.created_at
                }));

                sims.data?.forEach(s => combined.push({
                    id: `sim-${s.id}`, type: 'simulation', name: s.customer_name,
                    location: s.address || 'Indonesia', item: s.service_name, time: s.created_at
                }));

                // Sort by time & set
                setEvents(combined.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()));
            } catch (e) { console.warn("Pulse fetch failed", e); }
        };

        fetchRecentActivity();
        const interval = setInterval(fetchRecentActivity, 300000); // Refresh tiap 5 menit
        return () => clearInterval(interval);
    }, []);

    // Logic buat munculin toast bergantian
    useEffect(() => {
        if (events.length === 0) return;

        let index = 0;
        const trigger = () => {
            setCurrentEvent(events[index]);
            setTimeout(() => setCurrentEvent(null), 5000); // Tampil 5 detik
            index = (index + 1) % events.length;
        };

        const timer = setInterval(trigger, 15000); // Muncul tiap 15 detik
        setTimeout(trigger, 3000); // Start pertama

        return () => clearInterval(timer);
    }, [events]);

    return { currentEvent, allEvents: events };
};
