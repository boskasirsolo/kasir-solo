
import React from 'react';
import { optimizeImage, sanitizeHtml } from '../../../../../utils';
import { FileDownloadCard, ProjectEmbedCard, ProductEmbedCard } from '../../content-renderers';
import { StandardTextBlock } from './text-blocks';

// FIX: Typed as React.FC to correctly handle internal React props like 'key'
export const ImageBlock: React.FC<{ alt: string, src: string }> = ({ alt, src }) => (
    <div className="my-8 rounded-xl overflow-hidden border border-white/10 bg-black flex flex-col items-center">
        <img 
            src={optimizeImage(src, 1200)} 
            alt={alt} 
            className="w-full h-auto max-h-[600px] object-contain"
            loading="lazy" 
        />
        {alt && alt !== 'image' && (
            <p className="text-center text-sm text-gray-500 py-2 italic w-full bg-brand-card/50 border-t border-white/5 m-0">{alt}</p>
        )}
    </div>
);

// FIX: Typed as React.FC to correctly handle internal React props like 'key'
export const VideoBlock: React.FC<{ content: string }> = ({ content }) => (
    <div 
        className="my-8 aspect-video rounded-xl overflow-hidden border border-white/10 bg-black" 
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} 
    />
);

// FIX: Typed as React.FC to correctly handle internal React props like 'key'
export const CustomEmbedBlock: React.FC<{ content: string, waNumber?: string }> = ({ content, waNumber }) => {
    // REGEX: Tangkap teks sebelum tag, isi tag, dan teks sesudah tag
    const embedRegex = /^(.*?)\[(FILE|PROJECT|PRODUCT|SERVICE):\s*(.*?)\s*\](.*)$/s;
    const match = content.match(embedRegex);

    if (!match) return null;

    const preText = match[1].trim();
    const type = match[2];
    const innerContent = match[3];
    const postText = match[4].trim();

    const renderCard = () => {
        // 1. FILE DOWNLOAD
        if (type === 'FILE') {
            const fileParts = innerContent.match(/^(.*?)\]\((.*?)$/);
            if (fileParts) return <FileDownloadCard label={fileParts[1]} url={fileParts[2]} />;
            // Fallback for direct [FILE: label | url]
            const [label, url] = innerContent.split('|').map(s => s.trim());
            return <FileDownloadCard label={label} url={url} />;
        }

        // 2. PROJECT CARD
        if (type === 'PROJECT') {
            const parts = innerContent.split('|').map((s: string) => s.trim());
            if (parts.length >= 3) {
                return (
                    <ProjectEmbedCard 
                        title={parts[0]} 
                        url={parts[1]} 
                        image={parts[2]} 
                        desc={parts.slice(3).join('|') || parts[0]} 
                    />
                );
            }
        }

        // 3. PRODUCT CARD
        if (type === 'PRODUCT') {
            const parts = innerContent.split('|').map((s: string) => s.trim());
            if (parts.length >= 3) {
                return (
                    <ProductEmbedCard 
                        name={parts[0]} 
                        price={parts[1]} 
                        image={parts[2]} 
                        desc={parts.slice(3).join('|') || parts[0]} 
                        waNumber={waNumber} 
                    />
                );
            }
        }

        return null;
    };

    return (
        <>
            {preText && <StandardTextBlock content={preText} />}
            {renderCard()}
            {postText && <StandardTextBlock content={postText} />}
        </>
    );
};
