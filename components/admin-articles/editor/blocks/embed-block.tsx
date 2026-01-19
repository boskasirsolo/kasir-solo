
import React from 'react';
import { Layers, Download, FileText, ShoppingBag, Zap, ArrowLeft } from 'lucide-react';
import { formatRupiah } from '../../../../utils';

export const EmbedBlock = ({ type, block, onChange }: { type: string, block: any, onChange: (meta: any) => void }) => {
    
    if (type === 'file') {
        return (
            <div className="my-4 bg-brand-card border border-white/10 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30 text-blue-400"><FileText size={24} /></div>
                <div className="flex-1 min-w-0">
                    <input value={block.meta?.label} onChange={(e) => onChange({ ...block.meta, label: e.target.value })} className="bg-transparent text-sm font-bold text-white w-full outline-none focus:border-b focus:border-brand-orange" placeholder="Label File" />
                    <p className="text-xs text-gray-500 truncate">{block.content}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg text-gray-400"><Download size={18} /></div>
            </div>
        );
    }

    if (type === 'project') {
        return (
            <div className="my-4 bg-brand-dark border border-brand-orange/30 rounded-xl p-4 flex gap-4">
                <div className="w-24 h-24 bg-black rounded-lg border border-white/10 overflow-hidden shrink-0">
                    {block.meta?.image ? <img src={block.meta.image} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-gray-500"><Layers size={24}/></div>}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2"><span className="text-[10px] bg-brand-orange text-white px-2 py-0.5 rounded font-bold">PROJECT CARD</span></div>
                    <h5 className="text-lg font-bold text-white truncate">{block.meta?.title}</h5>
                    <p className="text-xs text-gray-400 line-clamp-2">{block.meta?.desc}</p>
                </div>
            </div>
        );
    }

    if (type === 'product') {
        return (
            <div className="my-4 bg-brand-dark border border-blue-500/30 rounded-xl p-4 flex gap-4">
                <div className="w-24 h-24 bg-black rounded-lg border border-white/10 overflow-hidden shrink-0">
                    <img src={block.meta?.image} className="w-full h-full object-contain p-2"/>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2"><span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">PRODUCT CARD</span></div>
                    <h5 className="text-lg font-bold text-white truncate">{block.meta?.name}</h5>
                    <p className="text-sm font-bold text-brand-orange">{formatRupiah(parseInt(block.meta?.price || '0'))}</p>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-1">{block.meta?.desc}</p>
                </div>
            </div>
        );
    }

    if (type === 'service') {
        return (
            <div className="my-4 bg-brand-dark border border-green-500/30 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-400 border border-green-500/30"><Zap size={24} /></div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1"><span className="text-[9px] bg-green-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">Service</span></div>
                    <h5 className="font-bold text-white text-base truncate">{block.meta?.title}</h5>
                    <p className="text-[10px] text-gray-400 truncate">{block.meta?.desc}</p>
                </div>
                <ArrowLeft className="rotate-180 text-gray-500" size={18} />
            </div>
        );
    }

    return null;
};
