
import React from 'react';
import { X, Briefcase } from 'lucide-react';
import { JobOpening } from '../../types';
import { Button } from '../ui';

export const JobDetailModal = ({ job, onClose, onApply }: { job: JobOpening, onClose: () => void, onApply: () => void }) => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative w-full max-w-2xl bg-brand-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-fade-in">
            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-brand-card rounded-t-2xl">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{job.title}</h2>
                    <p className="text-sm text-gray-400">{job.division} • {job.type} • {job.location}</p>
                </div>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white"><X size={24}/></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Misi Harian</h4>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
                </div>
                <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-2 border-b border-white/5 pb-2">Syarat Masuk</h4>
                    <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line bg-black/20 p-4 rounded-lg">{job.requirements}</div>
                </div>
            </div>
            <div className="p-6 border-t border-white/10 bg-brand-card rounded-b-2xl flex justify-end gap-3">
                <Button variant="outline" onClick={onClose}>Tutup</Button>
                <button onClick={onApply} className="px-6 py-2 bg-brand-orange text-white rounded-lg font-bold shadow-neon flex items-center gap-2"><Briefcase size={18}/> AMBIL TANTANGAN</button>
            </div>
        </div>
    </div>
);
