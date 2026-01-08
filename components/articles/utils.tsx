
import React from 'react';
import { Link } from 'react-router-dom';

export const cleanId = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

export const extractHeadings = (content: string) => {
  const lines = content.split('\n');
  const headings: { id: string, text: string, level: number, originalIndex: number }[] = [];
  
  // Logic ini harus sinkron dengan useArticleReader parsing
  let validLineIndex = 0;
  let inTocBlock = false;
  let tableBuffer: string[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    
    // 1. Skip TOC Block (Sama seperti Reader)
    if (/^(#+)?\s*(\*\*|__)?(Daftar Isi|Table of Contents)(\*\*|__)?/i.test(trimmed)) { 
        inTocBlock = true; 
        return; 
    }
    if (inTocBlock) {
        if (trimmed.startsWith('#') || trimmed === '---') { 
            inTocBlock = false; 
        } else { 
            return; 
        }
    }

    // 2. Handle Tables (Table counts as 1 block)
    if (trimmed.startsWith('|')) {
        tableBuffer.push(line);
        return; 
    } else {
        if (tableBuffer.length > 0) {
            validLineIndex++; // Table flushed
            tableBuffer = [];
        }
        if (trimmed === '') return; // Skip empty
    }

    // 3. Detect Headings (H1, H2, H3)
    // Support bold inside header e.g. "## **Judul**"
    const match = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (match) {
        const level = match[1].length;
        const rawText = match[2];
        const cleanText = rawText.replace(/\*\*/g, '').replace(/__/g, '').replace(/`/g, '').trim();
        
        headings.push({
            id: cleanId(cleanText),
            text: cleanText,
            level,
            originalIndex: validLineIndex
        });
    }

    validLineIndex++;
  });

  return headings;
};

export const parseLinks = (text: string) => {
  const linkRegex = /(\[.*?\]\s*\(.*?\))/g;
  const parts = text.split(linkRegex);
  return parts.map((part, i) => {
    const linkMatch = part.match(/^\[(.*?)\]\s*\((.*?)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const url = linkMatch[2];
      if (url.startsWith('#') && !label) return null;
      const isInternal = url.startsWith('/') || url.startsWith('#');
      const className = "text-brand-orange hover:text-white underline decoration-brand-orange/50 hover:decoration-white transition-colors font-medium break-words";
      if (isInternal) {
          if (url.startsWith('#')) { return <a key={`link-${i}`} href={url} className={className}>{label}</a>; }
          return <Link key={`link-${i}`} to={url} className={className}>{label}</Link>;
      }
      return <a key={`link-${i}`} href={url} target="_blank" rel="noreferrer" className={className}>{label}</a>;
    }
    const italicParts = part.split(/(\*.*?\*)/g);
    return (<span key={`text-${i}`}>{italicParts.map((sub, j) => {
        if (sub.startsWith('*') && sub.endsWith('*') && sub.length > 2 && !sub.startsWith('**')) { return <em key={`italic-${j}`} className="text-gray-400 italic">{sub.slice(1, -1)}</em>; }
        return sub;
    })}</span>);
  });
};

export const renderFormattedText = (text: string) => {
  const boldRegex = /(\*\*.*?\*\*)/g;
  const parts = text.split(boldRegex);
  return <>{parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) { const content = part.slice(2, -2); return <strong key={i} className="text-white font-bold bg-brand-orange/10 px-1 rounded">{parseLinks(content)}</strong>; }
        return <span key={i}>{parseLinks(part)}</span>;
      })}</>;
};
