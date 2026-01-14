
import React from 'react';
import { Globe, Search, Plus } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { CityCard } from './city-card';
import { CityTarget } from './types';

export const CityListPanel = ({ 
    cities, 
    loading, 
    searchTerm, 
    setSearchTerm, 
    onEdit, 
    onDelete,
    onAdd // NEW PROP
}: { 
    cities: CityTarget[], 
    loading: boolean, 
    searchTerm: string, 
    setSearchTerm: (s: string) => void,
    onEdit: (c: CityTarget) => void, 
    onDelete: (id: number) => void,
    onAdd: () => void
}) => {
    return (
        <div className="flex flex-col h-full bg-brand-dark border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            {/* List Header */}
            <div className="p-4 md:p-6 border-b border-white/10 bg-black/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center justify-between w-full sm:w-auto">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <Globe size={18} className="text-brand-orange"/> Target Wilayah <span className="text-gray-500 text-[10px] bg-white/5 px-2 py-0.5 rounded ml-1">{cities.length}</span>
                    </div>
                    <button 
                        onClick={onAdd}
                        className="p-2 bg-brand-orange text-white rounded-lg shadow-neon hover:bg-brand-action transition-all lg:hidden"
                        title="Tambah Wilayah"
                    >
                        <Plus size={18} />
                    </button>
                </div>
                
                <div className="relative w-full sm:w-auto">
                    <Search size={14} className="absolute left-3 top-2.5 text-gray-500"/>
                    <input 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari kota / kabupaten..."
                        className="w-full sm:w-64 bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand-orange transition-colors"
                    />
                </div>
            </div>

            {/* List Grid */}
            <div className="flex-grow overflow-y-auto p-4 md:p-6 custom-scrollbar bg-black/10 min-h-[500px] lg:min-h-0">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full py-20">
                        <LoadingSpinner size={32} className="text-brand-orange mb-2" />
                        <p className="text-gray-600 text-xs uppercase tracking-widest font-bold">Scanning Kandang...</p>
                    </div>
                ) : cities.length === 0 ? (
                    <div className="text-center py-20 text-gray-600 text-sm italic">
                        Belum ada target wilayah yang cocok.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {cities.map(city => (
                            <CityCard 
                                key={city.id} 
                                city={city} 
                                onEdit={onEdit} 
                                onDelete={onDelete} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
