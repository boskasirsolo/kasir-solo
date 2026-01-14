
import React from 'react';
import { FileText, HardDrive, Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { optimizeImage } from '../../../utils';
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
        <div className="my-10 bg-brand-dark rounded-2xl border border-white/5 overflow-hidden group hover:border-brand-orange/30 transition-all shadow-lg flex flex-col md:flex-row">
            {/* Image Container:
                - Mobile: h-48 fixed.
                - Desktop: w-64 fixed width, height stretches to match text content (flex), min-h-[250px] to ensure size.
                - Image: absolute inset-0 to fill container without forcing aspect ratio.
            */}
            <div className="w-full md:w-64 h-48 md:h-auto md:min-h-[250px] relative bg-black shrink-0 overflow-hidden">
                <img 
                    src={optimizeImage(image, 600)} 
                    alt={title} 
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                    loading="lazy" 
                />
                <div className="absolute top-3 left-3 bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded shadow-neon z-10">STUDI KASUS</div>
                {/* Gradient overlay for text readability if needed, or just aesthetic */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 md:opacity-0 transition-opacity"></div>
            </div>
            
            <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                    <h4 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-brand-orange transition-colors">{title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-4 mb-4">{desc}</p>
                </div>
                <div className="flex justify-end pt-4 border-t border-white/5">
                    <Link to={url} className="inline-flex items-center gap-2 text-brand-orange font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all">
                        Lihat Detail <ArrowRight size={16} />
                    </Link>
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
