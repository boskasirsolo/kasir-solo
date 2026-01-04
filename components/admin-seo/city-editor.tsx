
import React from 'react';
import { X, Save } from 'lucide-react';
import { Button, Input } from '../ui';
import { TypeSelectorButton } from './ui-atoms';
import { SEOFormState } from './types';

export const CityEditorPanel = ({ 
    form, 
    setForm, 
    onSubmit, 
    onReset,
    loading
}: { 
    form: SEOFormState, 
    setForm: (f: React.SetStateAction<SEOFormState>) => void, 
    onSubmit: () => void, 
    onReset: () => void,
    loading: boolean
}) => {
    return (
        <div className="h-fit bg-brand-dark border border-white/5 rounded-xl p-6 sticky top-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    {form.id ? 'Edit Wilayah' : 'Tambah Wilayah Baru'}
                </h3>
                {form.id && (
                    <button onClick={onReset} className="text-xs text-gray-500 hover:text-white flex items-center gap-1 bg-white/5 px-2 py-1 rounded transition-colors">
                        <X size={12}/> Batal
                    </button>
                )}
            </div>

            <div className="space-y-5">
                {/* Input Name */}
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-1.5 block">Nama Kota / Kabupaten</label>
                    <Input 
                        value={form.name}
                        onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
                        placeholder="Contoh: Magetan"
                        className="text-sm"
                    />
                    <p className="text-[10px] text-gray-500 mt-1.5 flex items-center gap-1">
                        *URL Slug otomatis: <span className="font-mono text-gray-400">/jual-mesin-kasir-di/nama-kota</span>
                    </p>
                </div>

                {/* Type Selection */}
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Tipe Wilayah & Strategi</label>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <TypeSelectorButton 
                            active={form.type === 'Kandang'}
                            onClick={() => setForm(prev => ({...prev, type: 'Kandang'}))}
                            label="Kandang (Solo Raya)"
                            icon="🦁"
                        />
                        <TypeSelectorButton 
                            active={form.type === 'Ekspansi'}
                            onClick={() => setForm(prev => ({...prev, type: 'Ekspansi'}))}
                            label="Ekspansi (Luar Kota)"
                            icon="🚀"
                        />
                    </div>
                    <div className="bg-black/20 p-3 rounded-lg border border-white/5 text-[10px] leading-relaxed text-gray-400">
                        {form.type === 'Kandang' ? (
                            <>
                                <strong className="text-brand-orange">Strategi Kandang:</strong> Fokus layanan Prioritas. Gratis Ongkir, Teknisi Datang ke Lokasi, dan pendekatan "Tetangga Sendiri".
                            </>
                        ) : (
                            <>
                                <strong className="text-blue-400">Strategi Ekspansi:</strong> Fokus pengiriman aman (Cargo/Kayu) & Support Remote (Video Call). Target pasar nasional.
                            </>
                        )}
                    </div>
                </div>

                <Button 
                    onClick={onSubmit} 
                    disabled={loading}
                    className="w-full py-3 shadow-neon"
                >
                    <Save size={16} /> {form.id ? 'UPDATE DATA' : 'TERBITKAN HALAMAN'}
                </Button>
            </div>
        </div>
    );
};
