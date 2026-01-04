
import React from 'react';
import { Link } from 'react-router-dom';

export const cleanId = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

export const extractHeadings = (content: string) => {
  const allLines = content.split('\n');
  const nonEmptyLines = allLines.filter(line => line.trim() !== '');
  return nonEmptyLines.reduce((acc, line, index) => {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().includes('daftar isi')) return acc;
    if (trimmed.startsWith('# ')) { acc.push({ id: cleanId(trimmed.replace('# ', '')), text: trimmed.replace('# ', ''), level: 1, originalIndex: index }); } 
    else if (trimmed.startsWith('## ')) { acc.push({ id: cleanId(trimmed.replace('## ', '')), text: trimmed.replace('## ', ''), level: 2, originalIndex: index }); }
    return acc;
  }, [] as { id: string, text: string, level: number, originalIndex: number }[]);
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
