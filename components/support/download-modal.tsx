
import React from 'react';
import { X, Monitor, AlertTriangle, Download } from 'lucide-react';
import { DownloadItem } from '../../types';
import { getCategoryColor } from './ui-cards';

export const DownloadDetailModal = ({ item, onClose }: { item: DownloadItem, onClose: () => void }) => {
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
                    <a 
                        href={item.file_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-action text-white py-3 rounded-xl font-bold transition-all shadow-neon hover:shadow-neon-strong"
                    >
                        <Download size={18} /> SEDOT FILE
                    </a>
                </div>
            </div>
        </div>
    );
};
