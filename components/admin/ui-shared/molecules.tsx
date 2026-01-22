
import React from 'react';
import { Ghost, Search, Plus } from 'lucide-react';
import { CmdButton } from './atoms';

// --- MINI DASHBOARD HEADER ---
export const ModuleHeader = ({ 
  title, 
  subtitle, 
  icon: Icon,
  onAdd,
  addLabel = "TAMBAH"
}: { 
  title: string, 
  subtitle?: string, 
  icon: any,
  onAdd?: () => void,
  addLabel?: string
}) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-white/5 pb-4">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-brand-orange/10 rounded-xl text-brand-orange border border-brand-orange/20 shadow-neon-text/5">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="text-white font-black text-sm uppercase tracking-widest leading-none">{title}</h3>
        {subtitle && <p className="text-[10px] text-gray-500 mt-1 font-bold">{subtitle}</p>}
      </div>
    </div>
    {onAdd && (
      <CmdButton onClick={onAdd} variant="primary" icon={Plus} label={addLabel} />
    )}
  </div>
);

// --- DASHBOARD EMPTY STATE ---
export const CmdEmptyState = ({ 
  message = "Data belum mendarat, Bos.", 
  icon: Icon = Ghost 
}: { 
  message?: string, 
  icon?: any 
}) => (
  <div className="flex flex-col items-center justify-center py-20 bg-black/20 rounded-3xl border-2 border-dashed border-white/5">
    <Icon size={48} className="text-gray-700 mb-4 opacity-30" />
    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">{message}</p>
  </div>
);

// --- COMMAND SEARCH BAR ---
export const CmdSearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Cari data..." 
}: { 
  value: string, 
  onChange: (val: string) => void, 
  placeholder?: string 
}) => (
  <div className="relative group w-full">
    <Search size={14} className="absolute left-3 top-3 text-gray-500 group-focus-within:text-brand-orange transition-colors" />
    <input 
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-brand-dark border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-brand-orange transition-all placeholder:text-gray-700"
    />
  </div>
);
