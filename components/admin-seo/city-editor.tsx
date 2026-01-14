
import React from 'react';
import { X, Save, Edit3, PlusCircle } from 'lucide-react';
import { Button, Input } from '../ui';
import { TypeSelectorButton } from './ui-atoms';
import { SEOFormState } from './types';

export const CityEditorPanel = ({ 
    form, 
    setForm, 
    onSubmit, 
    onReset,
    loading,
    hideHeader = false // NEW PROP
}: { 
    form: SEOFormState, 
    setForm: (f: React.SetStateAction<SEOFormState>) => void, 
    onSubmit: () => void, 
    onReset: () => void,
    loading: boolean,
    hideHeader?: boolean
}) => {
    return (
        <div className={`h-full bg-brand-dark flex flex-col overflow-hidden ${hideHeader ? '' : 'rounded-2xl border border-white/5 shadow-2xl p-6 sticky top-6'}`}>
            {!hideHeader && (
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                        {form.id ? <Edit3 size={18} className="text-brand-orange"/> : <PlusCircle size={18} className="text-brand-orange"/>}
                        {form.id ? 'EDIT WILAYAH' : 'WILAYAH BARU'}
                    </h3>
                    {form.id && (
                        <button onClick={onReset} className="text-[10px] text-red-400 font-bold hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors border border-red-500/20">
                            <X size={12}/> BATAL
                        </button>
                    )}
                </div>
            )}

            <div className={`space-y-6 flex-grow overflow-y-auto custom-scrollbar ${hideHeader ? 'p-0' : ''}`}>
                {/* Input Name */}
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block tracking-widest">Nama Kota / Kabupaten</label>
                    <Input 
                        value={form.name}
                        onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
                        placeholder="Contoh: Magetan, Sragen, dll..."
                        className="text-sm font-bold bg-black/40 py-3"
                    />
                    <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Preview URL SEO:</p>
                        <p className="text-[10px] text-brand-orange font-mono truncate">
                            /jual-mesin-kasir-di/<span className="text-white">{form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || 'nama-kota'}</span>
                        </p>
                    </div>
                </div>

                {/* Type Selection */}
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block tracking-widest">Tipe Wilayah & Strategi</label>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <TypeSelectorButton 
                            active={form.type === 'Kandang'}
                            onClick={() => setForm(prev => ({...prev, type: 'Kandang'}))}
                            label="Kandang"
                            icon="🦁"
                        />
                        <TypeSelectorButton 
                            active={form.type === 'Ekspansi'}
                            onClick={() => setForm(prev => ({...prev, type: 'Ekspansi'}))}
                            label="Ekspansi"
                            icon="🚀"
                        />
                    </div>
                    <div className="bg-brand-orange/5 p-4 rounded-xl border border-brand-orange/10 text-[11px] leading-relaxed text-gray-400">
                        {form.type === 'Kandang' ? (
                            <>
                                <strong className="text-brand-orange">Strategi Kandang:</strong> Fokus layanan Prioritas. Gratis Ongkir, Teknisi Datang ke Lokasi, dan pendekatan "Tetangga Sendiri" di Solo Raya.
                            </>
                        ) : (
                            <>
                                <strong className="text-blue-400">Strategi Ekspansi:</strong> Fokus pengiriman aman (Cargo/Kayu) & Support Remote (Video Call). Target pasar nasional di luar Solo Raya.
                            </>
                        )}
                    </div>
                </div>

                <div className="pt-4 pb-2">
                    <Button 
                        onClick={onSubmit} 
                        disabled={loading}
                        className="w-full py-4 text-sm font-bold shadow-neon tracking-wider"
                    >
                        {loading ? 'MENYIMPAN...' : (form.id ? 'UPDATE TARGET' : 'TERBITKAN HALAMAN')}
                    </Button>
                </div>
            </div>
        </div>
    );
};
