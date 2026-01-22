
import React, { useState } from 'react';
import { Search, Database, HardDrive, Filter, Grid, List, Copy, Check, Trash2, X, Info, FileText, Image as ImageIcon, ExternalLink, RefreshCw } from 'lucide-react';
import { useMediaVault, MediaAsset } from './logic';
import { LoadingSpinner, Button } from '../ui';

export const AdminMedia = () => {
    const { state, actions } = useMediaVault();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="flex flex-col h-[800px] bg-brand-black border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
            
            {/* TOOLBAR ATAS */}
            <div className="p-4 md:p-6 bg-brand-dark border-b border-white/10 flex flex-col md:flex-row gap-6 justify-between items-center shrink-0">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search size={16} className="absolute left-4 top-3.5 text-gray-600" />
                        <input 
                            value={state.searchTerm}
                            onChange={(e) => actions.setSearchTerm(e.target.value)}
                            placeholder="Cari nama file atau URL..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:border-brand-orange outline-none transition-all"
                        />
                    </div>
                    <button onClick={actions.refresh} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-500 hover:text-white transition-all">
                        <RefreshCw size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-orange text-white' : 'text-gray-600 hover:text-gray-300'}`}><Grid size={18}/></button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-brand-orange text-white' : 'text-gray-600 hover:text-gray-300'}`}><List size={18}/></button>
                    </div>
                    <div className="flex gap-1">
                        {['all', 'image', 'pdf', 'other'].map(t => (
                            <button 
                                key={t} 
                                onClick={() => actions.setFilterType(t as any)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border ${state.filterType === t ? 'bg-white/10 text-white border-white/20' : 'text-gray-600 border-transparent hover:text-gray-400'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* KONTEN UTAMA */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                
                {/* GRID/LIST AREA */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-black/20">
                    {state.loading ? (
                        <div className="h-full flex items-center justify-center"><LoadingSpinner size={40}/></div>
                    ) : state.filteredAssets.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-30">
                            <Database size={64} className="mb-4" />
                            <p className="font-black uppercase tracking-widest text-lg">Vault Kosong</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {state.filteredAssets.map(asset => (
                                <AssetCard 
                                    key={asset.id} 
                                    asset={asset} 
                                    active={state.selectedAsset?.id === asset.id}
                                    onSelect={() => actions.setSelectedAsset(asset)}
                                    onCopy={() => handleCopy(asset.url, asset.id)}
                                    copied={copiedId === asset.id}
                                />
                            ))}
                        </div>
                    ) : (
                        <AssetListView 
                            assets={state.filteredAssets} 
                            selectedId={state.selectedAsset?.id}
                            onSelect={actions.setSelectedAsset}
                        />
                    )}
                </div>

                {/* SIDEBAR DETAIL */}
                {state.selectedAsset && (
                    <div className="w-full md:w-80 border-l border-white/10 bg-brand-dark flex flex-col animate-slide-in-right shrink-0">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                            <h4 className="text-white font-bold text-xs uppercase tracking-widest">Metadata Aset</h4>
                            <button onClick={() => actions.setSelectedAsset(null)} className="text-gray-500 hover:text-white"><X size={18}/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                            <div className="aspect-square bg-black rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center shadow-inner">
                                {state.selectedAsset.mime_type.startsWith('image/') ? (
                                    <img src={state.selectedAsset.url} className="w-full h-full object-contain" alt="preview" />
                                ) : (
                                    <FileText size={64} className="text-gray-700" />
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-1">Nama File</label>
                                    <p className="text-xs text-white font-bold break-all">{state.selectedAsset.file_name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-1">Ukuran</label>
                                        <p className="text-xs text-brand-orange font-black font-mono">{state.selectedAsset.file_size}</p>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-1">Format</label>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{state.selectedAsset.mime_type.split('/').pop()}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block mb-1">Storage Path</label>
                                    <code className="text-[9px] text-gray-500 block bg-black/40 p-2 rounded border border-white/5 truncate">{state.selectedAsset.storage_path}</code>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                                <p className="text-[10px] text-blue-400 font-bold mb-2 flex items-center gap-1"><Info size={12}/> Info Penggunaan</p>
                                <p className="text-[10px] text-gray-400 leading-relaxed italic">
                                    Aset ini otomatis masuk ke cache CDN Cloudinary untuk performa loading maksimal.
                                </p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/10 bg-black/20 space-y-3">
                             <button onClick={() => handleCopy(state.selectedAsset!.url, state.selectedAsset!.id)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/10">
                                {copiedId === state.selectedAsset!.id ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>} {copiedId === state.selectedAsset!.id ? 'Berhasil Salin' : 'Salin URL Aset'}
                             </button>
                             <button onClick={() => actions.deleteAsset(state.selectedAsset!.id)} className="w-full py-3 bg-red-950/20 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-red-900/20">
                                <Trash2 size={14}/> Hapus Selamanya
                             </button>
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER STATS */}
            <div className="p-4 bg-brand-dark border-t border-white/10 flex justify-between items-center shrink-0 px-8">
                <div className="flex gap-8">
                    <div className="flex items-center gap-2">
                        <HardDrive size={14} className="text-gray-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Inventory: <span className="text-white">{state.stats.totalCount} Files</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ImageIcon size={14} className="text-gray-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visual Assets: <span className="text-brand-orange">{state.stats.imageCount}</span></span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[8px] text-gray-700 font-black uppercase tracking-[0.2em]">Mesin Kasir Solo Cloud Dam v2.0</p>
                </div>
            </div>
        </div>
    );
};

const AssetCard = ({ asset, active, onSelect, onCopy, copied }: any) => {
    const isImg = asset.mime_type.startsWith('image/');
    return (
        <div 
            onClick={onSelect}
            className={`group aspect-square bg-brand-card rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col ${active ? 'border-brand-orange shadow-neon-text/20 ring-1 ring-brand-orange' : 'border-white/5 hover:border-white/20 shadow-lg'}`}
        >
            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
                {isImg ? (
                    <img src={asset.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110" loading="lazy" />
                ) : (
                    <FileText size={40} className="text-gray-800" />
                )}
            </div>
            
            <div className="p-2.5 bg-brand-card/90 backdrop-blur-sm border-t border-white/5 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-white truncate">{asset.file_name}</p>
                    <p className="text-[8px] text-gray-500 font-mono mt-0.5">{asset.file_size}</p>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); onCopy(); }}
                    className={`p-1.5 rounded-lg transition-all ${copied ? 'bg-green-500 text-white shadow-lg' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-brand-orange shadow-inner'}`}
                >
                    {copied ? <Check size={12}/> : <Copy size={12}/>}
                </button>
            </div>

            {/* Quick Actions Hover */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <a href={asset.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white hover:text-brand-orange border border-white/10 transition-colors">
                    <ExternalLink size={12} />
                </a>
            </div>
        </div>
    );
};

const AssetListView = ({ assets, selectedId, onSelect }: any) => (
    <div className="bg-brand-card/30 border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-black/40 text-gray-500 font-black uppercase tracking-widest">
                <tr>
                    <th className="p-4 border-b border-white/5">Preview</th>
                    <th className="p-4 border-b border-white/5">File Name</th>
                    <th className="p-4 border-b border-white/5">Size</th>
                    <th className="p-4 border-b border-white/5">Created</th>
                    <th className="p-4 border-b border-white/5">Type</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {assets.map((asset: MediaAsset) => (
                    <tr 
                        key={asset.id} 
                        onClick={() => onSelect(asset)}
                        className={`hover:bg-white/5 transition-colors cursor-pointer group ${selectedId === asset.id ? 'bg-brand-orange/5' : ''}`}
                    >
                        <td className="p-4">
                            <div className="w-10 h-10 rounded bg-black border border-white/10 overflow-hidden shrink-0">
                                {asset.mime_type.startsWith('image/') ? (
                                    <img src={asset.url} className="w-full h-full object-cover" loading="lazy" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-700"><FileText size={16}/></div>
                                )}
                            </div>
                        </td>
                        <td className="p-4 font-bold text-white max-w-xs truncate">{asset.file_name}</td>
                        <td className="p-4 font-mono text-gray-500">{asset.file_size}</td>
                        <td className="p-4 text-gray-500">{new Date(asset.created_at).toLocaleDateString('id-ID')}</td>
                        <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase text-gray-400">{asset.mime_type.split('/').pop()}</span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
