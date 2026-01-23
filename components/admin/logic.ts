
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils';
import { activateGhostMode } from '../../hooks/use-analytics';
import { AdminTabId } from './types';

// --- HOOK: LOGIN LOGIC ---
export const useAdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            setError("Koneksi Supabase belum dikonfigurasi.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;
            
            // AUTO-ENABLE GHOST MODE FOR ADMIN
            activateGhostMode();

        } catch (err: any) {
            setError(err.message || "Gagal login. Periksa email dan password.");
        } finally {
            setLoading(false);
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        loading,
        error,
        handleLogin
    };
};

// --- HOOK: DASHBOARD LOGIC ---
export const useAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<AdminTabId>('analytics');
    const [storeSubTab, setStoreSubTab] = useState<'orders' | 'catalog' | 'services'>('orders');
    const [showConnectAI, setShowConnectAI] = useState(false);

    useEffect(() => {
        // Detect Google IDX Environment
        // @ts-ignore
        if (typeof window !== 'undefined' && window.aistudio) {
            setShowConnectAI(true);
        }
    }, []);

    const connectAI = async () => {
        // @ts-ignore
        if (window.aistudio) {
            // @ts-ignore
            await window.aistudio.openSelectKey();
            alert("Koneksi API Key diperbarui.");
        }
    };

    return {
        activeTab, setActiveTab,
        storeSubTab, setStoreSubTab,
        showConnectAI, connectAI
    };
};
