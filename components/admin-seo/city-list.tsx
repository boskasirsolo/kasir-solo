
import React from 'react';
import { Globe, Search } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { CityCard } from './city-card';
import { CityTarget } from './types';

export const CityListPanel = ({ 
    cities, 
    loading, 
    searchTerm, 
    setSearchTerm, 
    onEdit, 
    onDelete 
}: { 
    cities: CityTarget[], 
    loading: boolean, 
    searchTerm: string, 
    setSearchTerm: (s: string) => void,
    onEdit: (c: CityTarget) => void, 
    onDelete: (id: number) => void 
}) => {
    return (
        <div className="flex flex-col h-full bg-brand-dark border border-white/5 rounded-xl overflow-hidden">
            {/* List Header */}
            <div className="p-4 border-b border-white/10 bg-black/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Globe size={16} className="text-brand-orange"/> Target Wilayah <span className="text-gray-500 text-xs">({cities.length})</span>
                </div>
                <div className="relative w-full sm:w-auto">
                    <Search size={14} className="absolute left-3 top-2.5 text-gray-500"/>
                    <input 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari kota..."
                        className="w-full sm:w-48 bg-brand-card border border-white/10 rounded-full pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange transition-colors"
                    />
                </div>
            </div>

            {/* List Grid */}
            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                {loading ? (
                    <div className="text-center p-10"><LoadingSpinner/></div>
                ) : cities.length === 0 ? (
                    <div className="text-center p-10 text-gray-500 text-xs">Tidak ada data kota ditemukan.</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
