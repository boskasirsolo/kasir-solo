
import React from 'react';
import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import { CityTarget } from './types';
import { CityTypeBadge } from './ui-atoms';

export const CityCard = ({ 
    city, 
    onEdit, 
    onDelete 
}: { 
    city: CityTarget, 
    onEdit: (c: CityTarget) => void, 
    onDelete: (id: number) => void 
}) => {
    return (
        <div className="group bg-brand-card border border-white/5 p-4 rounded-xl hover:border-brand-orange/50 transition-all relative flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
                <CityTypeBadge type={city.type} />
                
                {/* Actions (Visible on Hover) */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                        href={`/jual-mesin-kasir-di/${city.slug}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-1.5 bg-white/10 rounded hover:text-brand-orange transition-colors"
                        title="Lihat Halaman"
                    >
                        <ExternalLink size={12}/>
                    </a>
                    <button 
                        onClick={() => onEdit(city)} 
                        className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition-colors"
                        title="Edit Data"
                    >
                        <Edit size={12} />
                    </button>
                    <button 
                        onClick={() => onDelete(city.id)} 
                        className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors"
                        title="Hapus Data"
                    >
                        <Trash2 size={12}/>
                    </button>
                </div>
            </div>
            
            <div className="mt-auto">
                <h4 className="text-white font-bold text-sm truncate">{city.name}</h4>
                <p className="text-gray-500 text-[10px] mt-1 truncate font-mono opacity-70">
                    /{city.slug}
                </p>
            </div>
        </div>
    );
};
