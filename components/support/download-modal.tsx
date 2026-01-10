
import React, { useState, useEffect } from 'react';
import { X, Monitor, AlertTriangle, Download, Lock, Key, FileText, Image as ImageIcon, Box, Eye, CheckCircle2 } from 'lucide-react';
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
            <div className="w-full h-full bg-black/50 overflow-hidden flex items-center justify-center">
                <img src={url} alt="Preview" className="w-full h-auto max-h-full object-contain" />
            </div>
        );
    }
    if (type === 'pdf') {
        return (
            <div className="w-full h-full bg-white overflow-hidden">
                <iframe src={`${url}#toolbar=0&view=FitH`} className="w-full h-full" title="PDF Preview"></iframe>
            </div>
        );
    }
    return (
        <div className="w-full h-full bg-brand-dark/50 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500">
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
            
            <div className="relative w-full max-w-5xl h-[85vh] bg-brand-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fade-in">
                
                {/* LEFT COLUMN: PREVIEW AREA & TITLE */}
                <div className="w-full md:w-8/12 bg-black/40 relative border-b md:border-b-0 md:border-r border-white/5 flex flex-col h-[40vh] md:h-full group">
                    {/* Header Mobile Only (Close Btn) */}
                    <div className="md:hidden absolute top-4 right-4 z-50">
                        <button onClick={onClose} className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"><X size={20}/></button>
                    </div>

                    {/* Preview Content */}
                    <div className="relative w-full h-full overflow-hidden">
                        <FilePreview url={targetUrl} type={fileType} />

                        {/* LOCKED OVERLAY */}
                        {!isUnlocked && (
                            <div className="absolute inset-0 z-20 select-none">
                                <div className="absolute inset-0 bg-transparent" />
                                <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-brand-dark via-brand-dark/95 to-transparent backdrop-blur-[2px] flex flex-col items-center justify-end pb-32 text-center p-6">
                                    <div className="transform translate-y-4">
                                        <div className="w-16 h-16 bg-red-600/20 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-pulse">
                                            <Lock size={32} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2 font-display">Preview Terbatas</h3>
                                        <p className="text-sm text-gray-400 max-w-[250px] mx-auto leading-relaxed">
                                            Dokumen ini dikunci. Masukkan PIN di panel samping untuk membuka full preview & download.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* TITLE OVERLAY (MOVED TO LEFT) */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent pt-20 z-30 pointer-events-none">
                            <div className="pointer-events-auto">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${getCategoryColor(item.category)}`}>
                                        {item.category}
                                    </span>
                                    {isLocked && !isUnlocked && <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded font-bold flex items-center gap-1 border border-red-400"><Lock size={8}/> LOCKED</span>}
                                    {isUnlocked && isLocked && <span className="text-[9px] bg-green-600 text-white px-2 py-0.5 rounded font-bold flex items-center gap-1 border border-green-400"><CheckCircle2 size={8}/> UNLOCKED</span>}
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-white leading-tight drop-shadow-md">{item.title}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: DETAILS & ACTION (FIXED LAYOUT) */}
                <div className="w-full md:w-4/12 bg-brand-card flex flex-col h-[60vh] md:h-full relative z-40 overflow-hidden">
                    {/* 1. Header (Updated: Download Button on Left, Close on Right) */}
                    <div className="flex p-4 border-b border-white/10 justify-between items-center shrink-0 bg-brand-card z-10">
                        {isUnlocked ? (
                             <a 
                                href={targetUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-2 bg-brand-orange hover:bg-brand-action text-white px-4 py-2 rounded-lg font-bold text-xs shadow-neon transition-all"
                            >
                                <Download size={16} /> DOWNLOAD FILE
                            </a>
                        ) : (
                             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Detail File</span>
                        )}
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-red-500">
                            <X size={20} />
                        </button>
                    </div>

                    {/* 2. Scrollable Content (Description) */}
                    <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-brand-card min-h-0">
                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                                <span className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Versi</span>
                                <span className="text-xs text-white font-mono">{item.version}</span>
                            </div>
                            <div className="bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                                <span className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Ukuran</span>
                                <span className="text-xs text-brand-orange font-bold">{item.file_size}</span>
                            </div>
                            <div className="col-span-2 bg-black/40 px-3 py-2 rounded-lg border border-white/5 flex items-center gap-2">
                                <Monitor size={14} className="text-blue-400" />
                                <div>
                                    <span className="text-[9px] text-gray-500 uppercase font-bold block">Support OS</span>
                                    <span className="text-xs text-white">{item.os_support}</span>
                                </div>
                            </div>
                        </div>

                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Keterangan File</h4>
                        <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line mb-6">
                            {item.description || "Tidak ada deskripsi detail."}
                        </div>

                        <div className="p-3 bg-yellow-500/5 border-l-2 border-yellow-500 rounded-r-lg text-[10px] text-gray-400 leading-relaxed">
                            <strong className="text-yellow-500 flex items-center gap-1 mb-1"><AlertTriangle size={10}/> Disclaimer:</strong>
                            Gunakan file ini sesuai peruntukannya. Kerusakan akibat salah install bukan tanggung jawab kami.
                        </div>
                    </div>

                    {/* 3. Sticky Footer (Only for Locked State) */}
                    {!isUnlocked && (
                        <div className="p-6 border-t border-white/10 bg-brand-dark shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50">
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
                                {error && <p className="text-red-400 text-xs font-bold animate-pulse text-center bg-red-500/10 p-1 rounded border border-red-500/20">{error}</p>}
                                <Button 
                                    onClick={handleUnlock} 
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-500 border-none text-white py-3 shadow-lg font-bold"
                                >
                                    {loading ? <LoadingSpinner size={16}/> : <><Lock size={16}/> BUKA KUNCI</>}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
