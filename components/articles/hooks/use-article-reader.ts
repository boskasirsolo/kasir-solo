
import { useState, useRef, useEffect, useMemo } from 'react';
import { Article } from '../../types';

export const useArticleReader = (content: string) => {
  const [progress, setProgress] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll Progress Tracking (OPTIMIZED with requestAnimationFrame)
  useEffect(() => {
    let ticking = false;
    const container = containerRef.current;

    const handleScroll = () => {
      if (!ticking && container) {
        window.requestAnimationFrame(() => {
          const currentScroll = container.scrollTop;
          const scrollHeight = container.scrollHeight;
          const clientHeight = container.clientHeight;
          const height = scrollHeight - clientHeight;
          
          setScrollPos(currentScroll);
          setProgress(height > 0 ? (currentScroll / height) * 100 : 100);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    if (container) {
        container.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
        if (container) {
            container.removeEventListener('scroll', handleScroll);
        }
    };
  }, []);

  // Content Block Parsing (Pagination inside reader)
  const READER_ITEMS_PER_PAGE = 30;
  const [currentReaderPage, setCurrentReaderPage] = useState(1);

  const allBlocks = useMemo(() => {
    const lines = content.split('\n');
    const grouped: string[] = [];
    let tableBuffer: string[] = [];
    let inTocBlock = false;

    lines.forEach((line) => {
      const trimmed = line.trim();
      // Skip hardcoded TOC if exists
      if (/^(#+)?\s*(\*\*|__)?(Daftar Isi|Table of Contents)(\*\*|__)?/i.test(trimmed)) { inTocBlock = true; return; }
      if (inTocBlock) {
        if (trimmed.startsWith('#') || trimmed === '---') { inTocBlock = false; } 
        else { return; }
      }
      
      // Detect Tables
      if (trimmed.startsWith('|')) { 
          tableBuffer.push(line); 
      } else {
        if (tableBuffer.length > 0) { grouped.push(tableBuffer.join('\n')); tableBuffer = []; }
        if (trimmed !== '') { grouped.push(line); }
      }
    });
    if (tableBuffer.length > 0) { grouped.push(tableBuffer.join('\n')); }
    return grouped;
  }, [content]);

  const totalReaderPages = Math.ceil(allBlocks.length / READER_ITEMS_PER_PAGE);
  const currentBlocks = allBlocks.slice((currentReaderPage - 1) * READER_ITEMS_PER_PAGE, currentReaderPage * READER_ITEMS_PER_PAGE);

  // Intersection Observer for Active Heading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const timeout = setTimeout(() => {
      const headings = container.querySelectorAll('h1, h2');
      const observer = new IntersectionObserver((entries) => { 
          entries.forEach((entry) => { 
              if (entry.isIntersecting) { setActiveHeadingId(entry.target.id); } 
          }); 
      }, { root: container, rootMargin: '-120px 0px -80% 0px', threshold: 0 });
      
      headings.forEach((h) => observer.observe(h));
      return () => observer.disconnect();
    }, 500);
    return () => clearTimeout(timeout);
  }, [currentBlocks, currentReaderPage]);

  // Handlers
  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element && containerRef.current) {
        const headerOffset = 120; 
        const containerRect = containerRef.current.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const relativeTop = containerRef.current.scrollTop + (elementRect.top - containerRect.top);
        const offsetPosition = relativeTop - headerOffset;
        containerRef.current.scrollTo({ top: offsetPosition, behavior: "smooth" });
        setActiveHeadingId(id);
    }
  };

  const handleToCClick = (heading: { id: string, originalIndex: number }) => {
    const targetPage = Math.floor(heading.originalIndex / READER_ITEMS_PER_PAGE) + 1;
    if (targetPage !== currentReaderPage) { 
        setCurrentReaderPage(targetPage); 
        setTimeout(() => { scrollToId(heading.id); }, 300); 
    } else { 
        scrollToId(heading.id); 
    }
  };

  const handlePageChange = (page: number) => { 
      setCurrentReaderPage(page); 
      if(containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return {
    progress,
    scrollPos,
    containerRef,
    currentBlocks,
    currentReaderPage,
    totalReaderPages,
    handlePageChange,
    activeHeadingId,
    handleToCClick
  };
};
