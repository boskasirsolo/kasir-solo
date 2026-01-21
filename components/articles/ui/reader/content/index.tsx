
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../../ui';
import { ImageBlock, VideoBlock, CustomEmbedBlock } from './media-blocks';
import { ArticleExcerpt, HeadingBlock, StandardTextBlock } from './text-blocks';

interface ReaderContentProps {
    blocks: string[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    article: {
        excerpt?: string;
    };
    waNumber?: string;
}

export const ReaderContent = ({ blocks, currentPage, totalPages, onPageChange, article, waNumber }: ReaderContentProps) => {
    return (
      <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-6">
          {/* Excerpt on first page */}
          {currentPage === 1 && article.excerpt && (
              <ArticleExcerpt text={article.excerpt} />
          )}

          {/* Block Mapping */}
          {blocks.map((paragraph: string, idx: number) => {
              const p = paragraph.trim();
              if (!p) return null;

              // 1. Custom Embeds ([FILE:], [PROJECT:], [PRODUCT:])
              if (p.includes('[FILE:') || p.includes('[PROJECT:') || p.includes('[PRODUCT:')) {
                  return <CustomEmbedBlock key={`custom-${idx}`} content={p} waNumber={waNumber} />;
              }
              
              // 2. Images
              const imgMatch = p.match(/^!\[(.*?)\]\((.*?)\)$/);
              if (imgMatch) {
                  return <ImageBlock key={`img-${idx}`} alt={imgMatch[1]} src={imgMatch[2]} />;
              }

              // 3. Videos
              if (p.startsWith('<iframe') && p.endsWith('></iframe>')) {
                  return <VideoBlock key={`vid-${idx}`} content={p} />;
              }

              // 4. Headings
              if (p.startsWith('#')) {
                  return <HeadingBlock key={`heading-${idx}`} content={p} />;
              }

              // 5. Standard Text (Tables, Lists, Quotes, Paragraphs)
              return <StandardTextBlock key={`text-${idx}`} content={p} />;
          })}

          {/* Pagination */}
          {totalPages > 1 && (
              <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
                    disabled={currentPage === 1} 
                    className="px-4 py-2"
                  >
                    <ChevronLeft size={16} /> Sebelumnya
                  </Button>
                  
                  <span className="text-sm font-bold text-gray-400">
                    Halaman <span className="text-brand-orange">{currentPage}</span> dari {totalPages}
                  </span>
                  
                  <Button 
                    variant="primary" 
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
                    disabled={currentPage === totalPages} 
                    className="px-4 py-2"
                  >
                    Selanjutnya <ChevronRight size={16} />
                  </Button>
              </div>
          )}
      </div>
    );
};
