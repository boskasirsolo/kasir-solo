
import React from 'react';
import { createPortal } from 'react-dom';
import { Scale, X, XCircle } from 'lucide-react';
import { Product } from '../../types';
import { optimizeImage, formatRupiah } from '../../../utils';
import { Button } from '../../ui';

export const ComparisonModal = ({ products, onClose, onRemove }: { products: Product[], onClose: () => void, onRemove: (id: number) => void }) => {
    const allSpecKeys = Array.from(new Set(products.flatMap(p => p.specs ? Object.keys(p.specs) : [])));
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 animate-fade-in" role="dialog">
            <div className="fixed inset-0 bg-black/95 backdrop-blur-md transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-6xl h-[85vh] bg-brand-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-brand-card shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Scale className="text-brand-orange"/> Arena Adu Mekanik
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Jangan beli kucing dalam karung. Bandingin dulu spek-nya head-to-head.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
                </div>
                <div className="flex-grow overflow-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 bg-black/40 text-gray-500 text-xs font-bold uppercase tracking-wider sticky top-0 left-0 z-20 min-w-[150px] border-b border-r border-white/10 backdrop-blur-sm">Fitur / Spek</th>
                                {products.map(p => (
                                    <th key={p.id} className="p-4 bg-brand-card/90 text-white min-w-[250px] border-b border-r border-white/10 sticky top-0 z-10 backdrop-blur-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="h-16 w-16 bg-black rounded-lg border border-white/10 overflow-hidden shrink-0">
                                                <img src={optimizeImage(p.image, 150)} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                                            </div>
                                            <button onClick={() => onRemove(p.id)} className="text-gray-500 hover:text-red-500 p-1"><XCircle size={16}/></button>
                                        </div>
                                        <h4 className="font-bold text-sm leading-tight mb-1">{p.name}</h4>
                                        <p className="text-brand-orange font-bold text-sm">{formatRupiah(p.price)}</p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-300 divide-y divide-white/5">
                            {allSpecKeys.length === 0 && <tr><td colSpan={products.length + 1} className="p-8 text-center text-gray-500 italic">Belum ada data spek detail di database.</td></tr>}
                            {allSpecKeys.map(key => (
                                <tr key={key} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 border-r border-white/10 font-bold text-gray-400 bg-black/20">{key}</td>
                                    {products.map(p => (
                                        <td key={p.id} className="p-4 border-r border-white/10">{p.specs?.[key] || <span className="text-gray-600">-</span>}</td>
                                    ))}
                                </tr>
                            ))}
                            <tr className="bg-brand-orange/5 font-bold">
                                <td className="p-4 border-r border-white/10 text-brand-orange">Kategori</td>
                                {products.map(p => (
                                    <td key={p.id} className="p-4 border-r border-white/10 text-white">{p.category}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>, document.body
    );
};

export const ComparisonBar = ({ selectedProducts, onRemove, onClear, onCompare }: { selectedProducts: Product[], onRemove: (id: number) => void, onClear: () => void, onCompare: () => void }) => {
    if (selectedProducts.length === 0) return null;
    return createPortal(
        <div className="fixed bottom-0 left-0 right-0 z-[9000] p-4 flex justify-center animate-fade-in">
            <div className="bg-brand-dark/95 backdrop-blur-xl border border-brand-orange/30 rounded-2xl shadow-neon-strong p-4 flex flex-col md:flex-row items-center gap-6 max-w-4xl w-full mx-4">
                <div className="flex items-center gap-3 md:border-r md:border-white/10 md:pr-6 w-full md:w-auto">
                    <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white shadow-neon shrink-0"><Scale size={20} /></div>
                    <div><h4 className="text-white font-bold text-sm uppercase tracking-widest">Versus Mode ({selectedProducts.length}/3)</h4><button onClick={onClear} className="text-[10px] text-red-400 hover:underline">Reset Semua</button></div>
                </div>
                <div className="flex gap-3 overflow-x-auto max-w-full md:flex-1 py-1 custom-scrollbar">
                    {selectedProducts.map(p => (
                        <div key={p.id} className="relative group shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-black border border-white/20 overflow-hidden"><img src={optimizeImage(p.image, 100)} className="w-full h-full object-cover" loading="lazy" /></div>
                            <button onClick={() => onRemove(p.id)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                        </div>
                    ))}
                    {[...Array(3 - selectedProducts.length)].map((_, i) => (
                        <div key={i} className="w-12 h-12 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-gray-600 shrink-0"><span className="text-[10px]">{i + 1 + selectedProducts.length}</span></div>
                    ))}
                </div>
                <Button onClick={onCompare} className="w-full md:w-auto px-6 py-3 whitespace-nowrap shadow-neon" disabled={selectedProducts.length < 2}>{selectedProducts.length < 2 ? 'Pilih min. 2' : 'ADU SEKARANG'}</Button>
            </div>
        </div>, document.body
    );
};
