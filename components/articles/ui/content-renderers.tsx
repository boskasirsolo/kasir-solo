
import React from 'react';
import { FileText, HardDrive, Download, ArrowRight, ShoppingCart, MessageCircle, ExternalLink, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { optimizeImage, formatRupiah } from '../../../utils';
import { renderFormattedText } from '../utils';

export const FileDownloadCard: React.FC<{ label: string, url: string }> = ({ label, url }) => {
    return (
        <div className="my-6 p-4 rounded-xl border border-blue-500/30 bg-blue-900/10 flex items-center gap-4 hover:bg-blue-900/20 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400 shrink-0"><FileText size={20} /></div>
            <div className="flex-1 min-w-0">
                <h5 className="font-bold text-white text-xs truncate">{label}</h5>
                <p className="text-[10px] text-blue-300/70 truncate flex items-center gap-1 mt-0.5"><HardDrive size={8} /> File Attachment</p>
            </div>
            <a href={url} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[10px] flex items-center gap-2 shadow-lg transition-all"><Download size={12} /> <span className="hidden sm:inline">Download</span></a>
        </div>
    );
};

export const ProjectEmbedCard: React.FC<{ title: string, url: string, image: string, desc: string }> = ({ title, url, image, desc }) => {
    const isInternal = url.startsWith('/') || url.startsWith(window.location.origin);
    const LinkComponent = isInternal ? Link : 'a';
    const linkProps = isInternal ? { to: url } : { href: url, target: '_blank', rel: 'noreferrer' };

    const showDesc = desc && desc !== title;

    return (
        <div className="my-8 group relative rounded-xl overflow-hidden bg-brand-dark border border-white/5 hover:border-brand-orange/50 transition-all shadow-lg">
            <div className="flex flex-col md:flex-row min-h-[180px] md:min-h-[220px]">
                {/* Image Section - Compact Ratio */}
                <div className="w-full md:w-1/3 relative h-48 md:h-auto overflow-hidden bg-black shrink-0 border-b md:border-b-0 md:border-r border-white/5">
                    <img 
                        src={optimizeImage(image, 500)} 
                        alt={title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                        loading="lazy" 
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                        <span className="bg-black/80 backdrop-blur-md text-brand-orange border border-brand-orange/30 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                            <Layers size={8} /> Project
                        </span>
                    </div>
                </div>

                {/* Content Section - Tighter Padding */}
                <div className="p-4 md:p-5 flex flex-col justify-center w-full md:w-2/3 relative z-10">
                    <h4 className="text-base md:text-lg font-display font-bold text-white mb-2 group-hover:text-brand-orange transition-colors leading-tight">
                        {title}
                    </h4>
                    {showDesc && (
                        <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
                            {desc}
                        </p>
                    )}
                    
                    <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[8px] text-gray-600 font-mono uppercase">
                            MKS ASSET
                        </span>
                        {/* @ts-ignore */}
                        <LinkComponent 
                            {...linkProps} 
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/5 hover:bg-brand-orange text-white rounded-lg text-[10px] font-bold border border-white/10 transition-all group/btn"
                        >
                            BEDAH PROJECT <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform"/>
                        </LinkComponent>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProductEmbedCard = ({ name, price, image, desc, waNumber }: { name: string, price: string, image: string, desc: string, waNumber?: string }) => {
    const rawPrice = parseInt(price.replace(/[^0-9]/g, '')) || 0;
    const displayPrice = rawPrice > 0 ? formatRupiah(rawPrice) : price;
    
    const targetWa = waNumber || "6282325103336";
    const showDesc = desc && desc !== name;

    const searchUrl = `/shop?search=${encodeURIComponent(name)}`;
    const waUrl = `https://wa.me/${targetWa}?text=${encodeURIComponent(`Halo, saya tertarik dengan produk *${name}* yang saya lihat di artikel.`)}`;

    return (
        <div className="my-8 bg-black/40 border border-white/5 rounded-xl overflow-hidden hover:border-brand-orange/50 transition-all shadow-lg flex flex-col md:flex-row group relative min-h-[160px]">
            {/* Visual - Small square on desktop */}
            <div className="w-full md:w-40 h-40 md:h-auto bg-black relative shrink-0 flex items-center justify-center p-3 border-b md:border-b-0 md:border-r border-white/5">
                <img 
                    src={optimizeImage(image, 300)} 
                    alt={name} 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-xl" 
                    loading="lazy" 
                />
                <div className="absolute top-2 left-2 bg-green-600 text-white text-[7px] font-bold px-1.5 py-0.5 rounded shadow-md uppercase tracking-wider flex items-center gap-1">
                    <ShoppingCart size={8} /> Rekomendasi
                </div>
            </div>

            {/* Info - Tight spacing */}
            <div className="p-4 md:p-5 flex flex-col justify-center flex-1">
                <h4 className="text-sm md:text-base font-bold text-white mb-0.5 leading-tight group-hover:text-brand-orange transition-colors">{name}</h4>
                <p className="text-xl font-display font-bold text-brand-orange mb-2 tracking-tight">{displayPrice}</p>
                {showDesc && (
                    <p className="text-[10px] text-gray-500 leading-relaxed mb-4 line-clamp-2">{desc}</p>
                )}
                
                <div className="flex gap-2">
                    <a 
                        href={searchUrl} 
                        className="flex-1 px-4 py-2 bg-brand-gradient hover:bg-brand-gradient-hover text-white rounded-lg text-[10px] font-bold shadow-neon transition-all flex items-center justify-center gap-1.5"
                    >
                        <ExternalLink size={12} /> Cek Spek
                    </a>
                    <a 
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer" 
                        className="flex-1 px-4 py-2 bg-white/5 hover:bg-green-600/20 text-gray-300 hover:text-green-400 border border-white/10 hover:border-green-500/50 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                        <MessageCircle size={12} /> Tanya Stok
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
        <div className="overflow-x-auto my-6 rounded-xl border border-white/5 bg-black/20">
            <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                <thead className="bg-white/5 text-brand-orange uppercase text-[10px] font-bold tracking-wider"><tr>{headers.map((h, i) => <th key={i} className="px-5 py-3 border-b border-white/10">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-white/5">{bodyRows.map((row, idx) => {
                        const cells = row.split('|').filter((c, i, arr) => { if (i === 0 && c === '') return false; if (i === arr.length - 1 && c === '') return false; return true; });
                        return (<tr key={idx} className="hover:bg-white/5 transition-colors">{cells.map((c, cIdx) => (<td key={cIdx} className="px-5 py-3 border-r border-white/5 last:border-0 text-gray-400 align-top leading-relaxed">{renderFormattedText(c.trim())}</td>))}</tr>);
                    })}</tbody>
            </table>
        </div>
    );
};
