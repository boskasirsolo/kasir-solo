
import React from 'react';
import { FileText, HardDrive, Download, ArrowRight, ShoppingCart, MessageCircle, ExternalLink, Layers, Globe, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { optimizeImage, formatRupiah } from '../../../utils';
import { renderFormattedText } from '../utils';

export const FileDownloadCard: React.FC<{ label: string, url: string }> = ({ label, url }) => {
    return (
        <div className="my-6 p-4 rounded-xl border border-blue-500/30 bg-blue-900/10 flex items-center gap-4 hover:bg-blue-900/20 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400 shrink-0"><FileText size={24} /></div>
            <div className="flex-1 min-w-0"><h5 className="font-bold text-white text-sm truncate">{label}</h5><p className="text-xs text-blue-300/70 truncate flex items-center gap-1 mt-0.5"><HardDrive size={10} /> File Attachment</p></div>
            <a href={url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg transition-all"><Download size={14} /> <span className="hidden sm:inline">Download</span></a>
        </div>
    );
};

export const ProjectEmbedCard: React.FC<{ title: string, url: string, image: string, desc: string }> = ({ title, url, image, desc }) => {
    return (
        <div className="my-12 group relative rounded-2xl overflow-hidden bg-brand-dark border border-white/10 hover:border-brand-orange/50 transition-all shadow-2xl">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={optimizeImage(image, 800)} 
                    alt={title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-40 group-hover:opacity-20" 
                    loading="lazy" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/90 to-brand-black/40"></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-6 p-6 md:p-8 items-center">
                {/* Thumbnail */}
                <div className="w-full md:w-48 aspect-video md:aspect-square rounded-xl overflow-hidden border border-white/20 shadow-lg shrink-0 group-hover:border-brand-orange/50 transition-colors">
                    <img 
                        src={optimizeImage(image, 400)} 
                        alt={title} 
                        className="w-full h-full object-cover" 
                    />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-[10px] font-bold uppercase tracking-widest mb-3">
                        <Layers size={12} /> Studi Kasus
                    </div>
                    <h4 className="text-xl md:text-2xl font-display font-bold text-white mb-3 group-hover:text-brand-orange transition-colors leading-tight">
                        {title}
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3">
                        {desc}
                    </p>
                    
                    <Link 
                        to={url} 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-brand-orange text-white rounded-xl text-xs font-bold border border-white/10 hover:border-brand-orange transition-all group/btn shadow-lg hover:shadow-neon"
                    >
                        BEDAH PROJECT <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform"/>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export const ProductEmbedCard = ({ name, price, image, desc }: { name: string, price: string, image: string, desc: string }) => {
    // Handle price if it comes as number string or formatted string
    const rawPrice = parseInt(price.replace(/[^0-9]/g, '')) || 0;
    const displayPrice = rawPrice > 0 ? formatRupiah(rawPrice) : price; // Fallback to original string if NaN

    // Search URL for the product
    const searchUrl = `/shop?search=${encodeURIComponent(name)}`;
    const waUrl = `https://wa.me/6282325103336?text=${encodeURIComponent(`Halo, saya tertarik dengan produk *${name}* yang saya lihat di artikel.`)}`;

    return (
        <div className="my-10 bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-orange/50 transition-all shadow-lg flex flex-col md:flex-row group relative">
            {/* Visual */}
            <div className="w-full md:w-56 h-56 bg-black relative shrink-0 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-white/5">
                <img 
                    src={optimizeImage(image, 400)} 
                    alt={name} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-2xl" 
                    loading="lazy" 
                />
                <div className="absolute top-3 left-3 bg-green-600 text-white text-[9px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider flex items-center gap-1">
                    <ShoppingCart size={10} /> Rekomendasi
                </div>
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col justify-center flex-1">
                <h4 className="text-lg md:text-xl font-bold text-white mb-1 leading-tight group-hover:text-brand-orange transition-colors">{name}</h4>
                <p className="text-2xl font-display font-bold text-brand-orange mb-3 tracking-tight">{displayPrice}</p>
                <p className="text-xs text-gray-400 leading-relaxed mb-6 line-clamp-2">{desc}</p>
                
                <div className="flex flex-wrap gap-3">
                    <a 
                        href={searchUrl} 
                        className="flex-1 md:flex-none px-6 py-2.5 bg-brand-gradient hover:bg-brand-gradient-hover text-white rounded-xl text-xs font-bold shadow-neon hover:shadow-neon-strong transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                    >
                        <ExternalLink size={14} /> Cek Spesifikasi
                    </a>
                    <a 
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer" 
                        className="flex-1 md:flex-none px-6 py-2.5 bg-white/5 hover:bg-green-600/20 text-gray-300 hover:text-green-400 border border-white/10 hover:border-green-500/50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <MessageCircle size={14} /> Tanya Stok
                    </a>
                </div>
            </div>
        </div>
    );
};

export const MarkdownTable: React.FC<{ content: string }> = ({ content }) => {
    const rows = content.trim().split('\n');
    if (rows.length < 2) return <pre className="whitespace-pre-wrap">{content}</pre>;
    const headers = rows[0].split('|').filter(c => c.trim() !== '').map(c => c.trim());
    const bodyRows = rows.slice(2); 
    return (
        <div className="overflow-x-auto my-8 rounded-xl border border-white/10 bg-black/20 shadow-lg">
            <table className="w-full text-sm text-left border-collapse min-w-[600px]">
                <thead className="bg-white/5 text-brand-orange uppercase text-xs font-bold tracking-wider"><tr>{headers.map((h, i) => <th key={i} className="px-6 py-4 border-b border-white/10">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-white/5">{bodyRows.map((row, idx) => {
                        const cells = row.split('|').filter((c, i, arr) => { if (i === 0 && c === '') return false; if (i === arr.length - 1 && c === '') return false; return true; });
                        return (<tr key={idx} className="hover:bg-white/5 transition-colors">{cells.map((c, cIdx) => (<td key={cIdx} className="px-6 py-4 border-r border-white/5 last:border-0 text-gray-300 align-top leading-relaxed">{renderFormattedText(c.trim())}</td>))}</tr>);
                    })}</tbody>
            </table>
        </div>
    );
};
