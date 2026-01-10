
import React, { useState, useEffect } from 'react';
import { X, Monitor, AlertTriangle, Download, Lock, Key, FileText, Image as ImageIcon, Box, Eye } from 'lucide-react';
import { DownloadItem } from '../../types';
import { getCategoryColor } from './ui-cards';
import { supabase } from '../../utils';
import { Button, LoadingSpinner } from '../ui';

// --- HELPER: File Type Detector ---
const getFileType = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension || '')) return 'image';
    if (['pdf'].includes(extension || '')) return 'pdf';
    return 'other';
};

// --- COMPONENT: File Previewer ---
const FilePreview = ({ url, type }: { url: string, type: 'image' | 'pdf' | 'other' }) => {
    if (type === 'image') {
        return (
            <div className="w-full h-[60vh] md:h-full bg-black/50 overflow-hidden flex items-start justify-center">
                <img src={url} alt="Preview" className="w-full h-auto object-contain object-top" />
            </div>
        );
    }
    if (type === 'pdf') {
        return (
            <div className="w-full h-[60vh] md:h-full bg-white overflow-hidden">
                <iframe src={`${url}#toolbar=0&view=FitH`} className="w-full h-full" title="PDF Preview"></iframe>
            </div>
        );
    }
    return (
        <div className="w-full h-[60vh] md:h-full bg-brand-dark/50 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500">
            <Box size={64} className="mb-4 opacity-50" />
            <p className="text-sm">Preview tidak tersedia untuk format ini.</p>
            <p className="text-xs mt-1">Silakan download untuk membuka.</p>
        </div>
    );
};

export const DownloadDetailModal = ({ item, onClose }: { item: DownloadItem, onClose: () => void }) => {
    const isLocked = item.access_key && item.access_key.length > 0;
    
    // State
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [secureUrl, setSecureUrl] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(!isLocked); // Default true if not locked

    // Determine Preview Type
    // Use secureUrl if available, otherwise item.file_url (but only if unlocked)
    const targetUrl = secureUrl || item.file_url;
    const fileType = getFileType(targetUrl);

    const handleUnlock = async () => {
        if (!pin) { setError("Masukkan PIN dulu."); return; }
        if (!supabase) return;

        setLoading(true);
        setError('');

        try {
            const { data, error: rpcError } = await supabase.rpc('get_secure_download', { 
                file_id: item.id, 
                input_pin: pin 
            });

            if (rpcError) throw rpcError;

            if (data) {
                setSecureUrl(data);
                setIsUnlocked(true); // UNLOCK THE PREVIEW
            } else {
                setError("PIN Salah! Akses ditolak.");
            }
        } catch (e: any) {
            console.error("Unlock error:", e);
            const msg = e.message || "PIN Salah atau Server Error.";
            setError(msg.includes("PIN Salah") ? "PIN Salah, Juragan!" : msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity" onClick={onClose}></div>
            
            <div className="relative w-full max-w-5xl bg-brand-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in max-h-[90vh]">
                
                {/* LEFT COLUMN: PREVIEW AREA */}
                <div className="w-full md:w-8/12 bg-black/40 relative border-b md:border-b-0 md:border-r border-white/5 flex flex-col h-[400px] md:h-auto">
                    {/* Header Mobile Only */}
                    <div className="md:hidden absolute top-4 right-4 z-50">
                        <button onClick={onClose} className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"><X size={20}/></button>
                    </div>

                    {/* Preview Container */}
                    <div className="relative w-full h-full overflow-hidden">
                        {/* THE PREVIEW */}
                        <FilePreview url={targetUrl} type={fileType} />

                        {/* LOCKED OVERLAY (The Blur & Gate) */}
                        {!isUnlocked && (
                            <div className="absolute inset-0 z-20 select-none">
                                {/* Interaction Blocker (Transparent) - Prevents scrolling the iframe/image */}
                                <div className="absolute inset-0 bg-transparent" />
                                
                                {/* Visual Gradient Mask */}
                                <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-brand-dark via-brand-dark/95 to-transparent backdrop-blur-[1px] flex flex-col items-center justify-end pb-20 md:pb-32 text-center p-6">
                                    <div className="transform translate-y-4">
                                        <div className="w-16 h-16 bg-red-600/20 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-pulse">
                                            <Lock size={32} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2 font-display">Preview Terbatas</h3>
                                        <p className="text-sm text-gray-400 max-w-[250px] mx-auto leading-relaxed">
                                            Halaman selanjutnya dikunci. Masukkan PIN Akses di panel samping untuk melihat dokumen utuh.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* File Meta overlay on preview (Only visible if unlocked) */}
                        {isUnlocked && (
                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/50 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 pointer-events-none">
                                <span className="flex items-center gap-2"><Eye size={14}/> Full Preview Mode</span>
                                <span className="uppercase font-mono tracking-wider">{fileType}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: DETAILS & ACTION */}
                <div className="w-full md:w-4/12 bg-brand-card flex flex-col h-full">
                    {/* Header Desktop */}
                    <div className="hidden md:flex p-6 border-b border-white/10 justify-between items-start shrink-0">
                        <div>
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border mb-2 inline-block ${getCategoryColor(item.category)}`}>
                                {item.category}
                            </span>
                            <h3 className="text-xl font-bold text-white leading-tight">{item.title}</h3>
                        </div>
                        <button onClick={onClose} className="p-1 text-gray-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
                        {/* Mobile Title (Since header is hidden) */}
                        <div className="md:hidden mb-6">
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border mb-2 inline-block ${getCategoryColor(item.category)}`}>
                                {item.category}
                            </span>
                            <h3 className="text-xl font-bold text-white leading-tight">{item.title}</h3>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 text-[10px] text-gray-300 flex items-center gap-2">
                                <Monitor size={12} className="text-blue-400"/> {item.os_support}
                            </div>
                            <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 text-[10px] text-gray-300 flex items-center gap-2">
                                <FileText size={12} className="text-brand-orange"/> {item.file_size}
                            </div>
                            <div className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 text-[10px] text-gray-300 font-mono">
                                v{item.version}
                            </div>
                        </div>

                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Keterangan File</h4>
                        <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-6 bg-black/20 p-3 rounded-lg border border-white/5">
                            {item.description || "Tidak ada deskripsi detail."}
                        </div>

                        <div className="p-3 bg-yellow-500/5 border-l-2 border-yellow-500 rounded-r-lg text-[10px] text-gray-400 leading-relaxed">
                            <strong className="text-yellow-500 flex items-center gap-1 mb-1"><AlertTriangle size={10}/> Disclaimer:</strong>
                            Gunakan file ini sesuai peruntukannya. Kerusakan akibat salah install bukan tanggung jawab kami.
                        </div>
                    </div>

                    {/* Footer / Action Area */}
                    <div className="p-6 border-t border-white/10 bg-brand-dark/50 mt-auto shrink-0">
                        {!isUnlocked ? (
                            // LOCKED STATE
                            <div className="space-y-3">
                                <div className="relative">
                                    <Key size={16} className={`absolute left-3 top-3 ${error ? 'text-red-500' : 'text-gray-500'}`} />
                                    <input 
                                        type="password" 
                                        value={pin}
                                        onChange={(e) => { setPin(e.target.value); setError(''); }}
                                        placeholder="Masukkan PIN Akses..."
                                        className={`w-full bg-black/40 border rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-all ${error ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-brand-orange'}`}
                                        onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                                    />
                                </div>
                                {error && <p className="text-red-400 text-xs font-bold animate-pulse text-center">{error}</p>}
                                <Button 
                                    onClick={handleUnlock} 
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-500 border-none text-white py-3 shadow-lg"
                                >
                                    {loading ? <LoadingSpinner size={16}/> : <><Lock size={16}/> BUKA KUNCI FULL</>}
                                </Button>
                            </div>
                        ) : (
                            // UNLOCKED STATE
                            <a 
                                href={targetUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white py-4 rounded-xl font-bold transition-all shadow-neon hover:shadow-neon-strong transform hover:-translate-y-1"
                            >
                                <Download size={20} /> DOWNLOAD FILE SEKARANG
                            </a>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
