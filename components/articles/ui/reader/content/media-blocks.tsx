
import React from 'react';
import { optimizeImage, sanitizeHtml } from '../../../../../utils';
import { FileDownloadCard, ProjectEmbedCard, ProductEmbedCard } from '../../content-renderers';

export const ImageBlock = ({ alt, src }: { alt: string, src: string }) => (
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

export const VideoBlock = ({ content }: { content: string }) => (
    <div 
        className="my-8 aspect-video rounded-xl overflow-hidden border border-white/10 bg-black" 
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} 
    />
);

export const CustomEmbedBlock = ({ content }: { content: string }) => {
    // 1. FILE DOWNLOAD
    if (content.includes('[FILE:')) {
        const match = content.match(/\[FILE:\s*(.*?)\]\((.*?)\)/);
        if (match) return <FileDownloadCard label={match[1]} url={match[2]} />;
    }

    // 2. PROJECT CARD
    if (content.includes('[PROJECT:')) {
        const rawContent = content.replace('[PROJECT:', '').replace(/\]$/, '').trim();
        const parts = rawContent.split('|').map((s: string) => s.trim());
        
        if (parts.length >= 3) {
            const title = parts[0];
            const url = parts[1];
            const image = parts[2];
            const desc = parts.slice(3).join('|');
            
            return <ProjectEmbedCard title={title} url={url} image={image} desc={desc} />;
        }
    }

    // 3. PRODUCT CARD
    if (content.includes('[PRODUCT:')) {
        const rawContent = content.replace('[PRODUCT:', '').replace(/\]$/, '').trim();
        const parts = rawContent.split('|').map((s: string) => s.trim());
        
        if (parts.length >= 3) {
            const name = parts[0];
            const price = parts[1];
            const image = parts[2];
            const desc = parts.slice(3).join('|');
            
            return <ProductEmbedCard name={name} price={price} image={image} desc={desc} />;
        }
    }

    return null;
};
