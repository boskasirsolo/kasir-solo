
import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import { Article, Product, SiteConfig } from '../../types';
import { ArticleDetailProps } from '../types';
import { useArticleReader } from '../hooks/use-article-reader';
import { useAdminStats, useSocialShare } from '../hooks/use-article-interactions';
import { extractHeadings } from '../utils';
import { ReaderHeader } from '../ui/reader/header';
import { ReaderContent } from '../ui/reader/content';
import { CommentSection } from '../ui/reader/comments';
import { LeftSidebar } from '../ui/reader/sidebars/left-sidebar';
import { RightSidebar } from '../ui/reader/sidebars/right-sidebar';
import { SEOHelmet } from '../../seo';

interface ExtendedDetailProps extends ArticleDetailProps {
    config?: SiteConfig;
}

export const ArticleReaderView = ({ article, onClose, products, allArticles, config }: ExtendedDetailProps) => {
  const { progress, scrollPos, containerRef, currentBlocks, currentReaderPage, totalReaderPages, handlePageChange, activeHeadingId, handleToCClick } = useArticleReader(article.content);
  const waNumber = config?.whatsappNumber || "6282325103336";
  
  // Hooks
  const adminStats = useAdminStats(article.title);
  const { share: handleShare } = useSocialShare(article.title);

  // Constants
  const MAX_HEIGHT = 500; 
  const MIN_HEIGHT = 80; 
  const currentHeaderHeight = Math.max(MIN_HEIGHT, MAX_HEIGHT - scrollPos);
  
  const headings = React.useMemo(() => extractHeadings(article.content), [article.content]);

  // Sidebar Logic
  let recommendedProducts = products.filter((p: Product) => article.category && p.category.toLowerCase().includes(article.category.split(' ')[0].toLowerCase()));
  let recTitle = "Alat Tempur Relevan"; 
  let RecIcon = Target;
  
  if (recommendedProducts.length === 0) { 
      recommendedProducts = products.slice(0, 3); 
      recTitle = "Senjata Andalan"; 
      RecIcon = TrendingUp; 
  } else { 
      recommendedProducts = recommendedProducts.slice(0, 3); 
  }

  let relatedArticles: Article[] = []; 
  let relatedTitle = "Baca Juga";
  if (article.type === 'pillar' && article.related_pillars && article.related_pillars.length > 0) { 
      relatedArticles = allArticles.filter(a => article.related_pillars?.includes(a.id)); 
      relatedTitle = "Topik Utama Terkait"; 
  } else { 
      relatedArticles = allArticles.filter(a => a.id !== article.id).slice(0, 4); 
  }

  return (
    <>
      <SEOHelmet 
        title={article.title}
        description={article.excerpt || article.content.substring(0, 150)}
        image={article.image}
        type="article"
      />
      <div className="fixed inset-0 z-[9999] bg-brand-black" aria-modal="true" role="dialog">
        <ReaderHeader 
            article={article} 
            progress={progress} 
            currentHeight={currentHeaderHeight} 
            maxHeight={MAX_HEIGHT} 
            minHeight={MIN_HEIGHT} 
            onClose={onClose} 
            onWheelProxy={(e:any) => { if(containerRef.current) containerRef.current.scrollTop += e.deltaY; }} 
            adminStats={adminStats}
        />
        
        <div ref={containerRef} className="h-full w-full overflow-y-auto custom-scrollbar relative bg-brand-black">
          {/* Spacer for Fixed Header */}
          <div style={{ height: `${MAX_HEIGHT}px` }} className="w-full bg-transparent pointer-events-none"></div>
          
          <div className="bg-brand-black relative z-10 border-t border-white/5 min-h-[100vh]">
              <div className="container mx-auto px-4 pb-20 max-w-7xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-12 relative">
                      
                      {/* LEFT SIDEBAR */}
                      <div className="hidden lg:block lg:col-span-3">
                          <LeftSidebar 
                              headings={headings}
                              activeHeadingId={activeHeadingId}
                              onHeadingClick={handleToCClick}
                              onShare={handleShare}
                          />
                      </div>

                      {/* MAIN CONTENT */}
                      <div className="lg:col-span-6 min-h-screen">
                          <ReaderContent 
                            blocks={currentBlocks} 
                            currentPage={currentReaderPage} 
                            totalPages={totalReaderPages} 
                            onPageChange={handlePageChange} 
                            article={article} 
                          />
                          <CommentSection articleId={article.id} />
                      </div>

                      {/* RIGHT SIDEBAR */}
                      <div className="hidden lg:block lg:col-span-3">
                          <RightSidebar 
                              relatedArticles={relatedArticles}
                              relatedTitle={relatedTitle}
                              recommendedProducts={recommendedProducts}
                              recTitle={recTitle}
                              RecIcon={RecIcon}
                              waNumber={waNumber}
                          />
                      </div>

                  </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};
