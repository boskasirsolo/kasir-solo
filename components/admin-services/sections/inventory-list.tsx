
import React from 'react';
import { Search, Plus, Box, Zap, ChevronRight, LayoutList } from 'lucide-react';

export const InventoryList = ({ filterSlug, setFilterSlug, searchTerm, setSearchTerm, filteredBase, filteredAddons, onEdit, onDelete, onReset, targets }: any) => {
    return (
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-bold text-sm flex items-center gap-2">
                    <LayoutList size={18} className="text-brand-orange"/> Inventori Layanan
                </h4>
                <button onClick={onReset} className="p-2 bg-brand-orange text-white rounded-lg shadow-neon lg:hidden"><Plus size={18} /></button>
            </div>
            
            <div className="flex bg-brand-dark p-1 rounded-xl border border-white/10 overflow-x-auto custom-scrollbar-hide mb-4">
                {targets.map((svc: any) => (
                    <button key={svc.id} onClick={() => setFilterSlug(svc.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap ${filterSlug === svc.id ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500 hover:text-white'}`}>
                        <svc.icon size={14} /> {svc.label}
                    </button>
                ))}
            </div>

            <div className="relative mb-6">
                <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari item di layanan ini..." className="w-full bg-brand-card border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-brand-orange outline-none" />
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest flex items-center gap-2"><Box size={14}/> Paket Utama</span>
                        <span className="text-[9px] text-gray-600 font-mono">Hits: {filteredBase.length}</span>
                    </div>
                    {filteredBase.map((item: any) => <ItemCard key={item.id} item={item} role="base" onEdit={() => onEdit(item, 'base')} onDelete={() => onDelete(filterSlug, item.id, 'base')} />)}
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2"><Zap size={14}/> Add-ons</span>
                        <span className="text-[9px] text-gray-600 font-mono">Hits: {filteredAddons.length}</span>
                    </div>
                    {filteredAddons.map((item: any) => <ItemCard key={item.id} item={item} role="addon" onEdit={() => onEdit(item, 'addon')} onDelete={() => onDelete(filterSlug, item.id, 'addon')} />)}
                </div>
            </div>
        </div>
    );
};

const ItemCard = ({ item, onEdit, onDelete, role }: any) => (
    <div className="flex items-center justify-between p-3 bg-brand-card/60 border border-white/5 rounded-xl group hover:border-brand-orange/30 transition-all cursor-pointer" onClick={onEdit}>
        <div className="flex-1 min-w-0 pr-4 text-left">
            <h6 className="text-xs font-bold text-white truncate group-hover:text-brand-orange">{item.label}</h6>
            <p className={`text-[10px] font-bold font-mono ${role === 'base' ? 'text-brand-orange' : 'text-blue-400'}`}>
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}
            </p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={16} className="text-gray-600"/></div>
    </div>
);
