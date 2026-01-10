
import React, { useState } from 'react';
import { X, Monitor, AlertTriangle, Download, Lock, Loader2, Key, CheckCircle2 } from 'lucide-react';
import { DownloadItem } from '../../types';
import { getCategoryColor } from './ui-cards';
import { supabase } from '../../utils';
import { Input, Button, LoadingSpinner } from '../ui';

export const DownloadDetailModal = ({ item, onClose }: { item: DownloadItem, onClose: () => void }) => {
    const isLocked = item.access_key && item.access_key.length > 0;
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [secureUrl, setSecureUrl] = useState('');
    const [success, setSuccess] = useState(false);

    const handleUnlock = async () => {
        if (!pin) { setError("Masukkan PIN dulu."); return; }
        if (!supabase) return;

        setLoading(true);
        setError('');

        try {
            // Call RPC Function "get_secure_download"
            const { data, error: rpcError } = await supabase.rpc('get_secure_download', { 
                file_id: item.id, 
                input_pin: pin 
            });

            if (rpcError) throw rpcError;

            if (data) {
                setSecureUrl(data);
                setSuccess(true);
                // Optional: Auto open in new tab
                window.open(data, '_blank'); 
            } else {
                setError("PIN Salah! Akses ditolak.");
            }
        } catch (e: any) {
            console.error("Unlock error:", e);
            // Handle specific RPC error messages
            const msg = e.message || "PIN Salah atau Server Error.";
            setError(msg.includes("PIN Salah") ? "PIN Salah, Juragan!" : msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-lg bg-brand-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col animate-fade-in overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-brand-card flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${getCategoryColor(item.category)}`}>
                                {item.category}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500">{item.version}</span>
                            {isLocked && !success && <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded font-bold flex items-center gap-1"><Lock size={8}/> LOCKED</span>}
                            {success && <span className="text-[9px] bg-green-600 text-white px-2 py-0.5 rounded font-bold flex items-center gap-1"><CheckCircle2 size={8}/> UNLOCKED</span>}
                        </div>
                        <h3 className="text-xl font-bold text-white leading-tight">{item.title}</h3>
                    </div>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    <div className="flex justify-between items-center mb-6 bg-black/20 p-3 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2 text-xs text-gray-300 w-full">
                            <Monitor size={14} className="text-blue-400" /> 
                            <span>Support: <strong>{item.os_support}</strong></span>
                        </div>
                    </div>

                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Deskripsi File</h4>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-6">
                        {item.description || "Tidak ada deskripsi detail."}
                    </p>

                    <div className="p-4 bg-yellow-500/5 border-l-4 border-yellow-500 rounded-r-lg text-xs text-gray-400 leading-relaxed">
                        <strong className="text-yellow-500 block mb-1 flex items-center gap-1"><AlertTriangle size={12}/> Warning:</strong>
                        Jangan asal install kalau ragu. Salah driver bisa bikin printer lo mogok. Kalau bingung, mending chat admin dulu.
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-white/10 bg-brand-card">
                    {/* LOGIC BRANCHING */}
                    {!isLocked || secureUrl ? (
                        // PUBLIC / UNLOCKED STATE
                        <a 
                            href={secureUrl || item.file_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-action text-white py-3 rounded-xl font-bold transition-all shadow-neon hover:shadow-neon-strong"
                        >
                            <Download size={18} /> {secureUrl ? "DOWNLOAD FILE (UNLOCKED)" : "SEDOT FILE"}
                        </a>
                    ) : (
                        // LOCKED STATE
                        <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl">
                            <div className="text-center mb-4">
                                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-red-500 border border-red-500/30">
                                    <Lock size={24} />
                                </div>
                                <h4 className="text-white font-bold text-sm">File Ini Terkunci (Premium)</h4>
                                <p className="text-gray-400 text-xs mt-1">Masukkan PIN Akses untuk mendownload.</p>
                            </div>
                            
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Key size={16} className={`absolute left-3 top-3 ${error ? 'text-red-500' : 'text-gray-500'}`} />
                                    <input 
                                        type="password" 
                                        value={pin}
                                        onChange={(e) => { setPin(e.target.value); setError(''); }}
                                        placeholder="Masukkan PIN..."
                                        className={`w-full bg-black/40 border rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-red-500'}`}
                                        onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                                    />
                                </div>
                                <Button 
                                    onClick={handleUnlock} 
                                    disabled={loading}
                                    className="bg-red-600 hover:bg-red-500 border-none text-white px-6 shadow-lg"
                                >
                                    {loading ? <LoadingSpinner size={16}/> : "BUKA"}
                                </Button>
                            </div>
                            {error && (
                                <p className="text-red-400 text-xs mt-3 text-center font-bold animate-pulse bg-red-500/10 p-1 rounded border border-red-500/20">{error}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
