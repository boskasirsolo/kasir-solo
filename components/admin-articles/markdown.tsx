
import React from 'react';
import { Link } from 'react-router-dom';

// --- HELPER: Parse Links & Inline Styles ---
const parseLinks = (text: string) => {
  const linkRegex = /(\[.*?\]\s*\(.*?\))/g;
  const parts = text.split(linkRegex);

  return parts.map((part, i) => {
    const linkMatch = part.match(/^\[(.*?)\]\s*\((.*?)\)$/);
    if (linkMatch) {
      return (
        <Link key={`link-${i}`} to={linkMatch[2]} className="text-brand-orange hover:text-white underline decoration-brand-orange/50 hover:decoration-white transition-all font-medium">
            {linkMatch[1]}
        </Link>
      );
    }
    
    // Handle Italics
    const italicParts = part.split(/(\*.*?\*)/g);
    return (
        <span key={`text-${i}`}>
            {italicParts.map((sub, j) => {
                if (sub.startsWith('*') && sub.endsWith('*') && sub.length > 2 && !sub.startsWith('**')) {
                    return <em key={`italic-${j}`} className="text-gray-400 italic">{sub.slice(1, -1)}</em>;
                }
                return sub;
            })}
        </span>
    );
  });
};

const renderInline = (text: string) => {
  const boldRegex = /(\*\*.*?\*\*)/g;
  const parts = text.split(boldRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const content = part.slice(2, -2);
          return <strong key={i} className="text-white font-bold">{parseLinks(content)}</strong>;
        }
        return <span key={i}>{parseLinks(part)}</span>;
      })}
    </>
  );
};

const MarkdownTable: React.FC<{ content: string }> = ({ content }) => {
    const rows = content.trim().split('\n');
    if (rows.length < 2) return <pre className="text-xs">{content}</pre>;

    const headers = rows[0].split('|').filter(c => c.trim() !== '').map(c => c.trim());
    const bodyRows = rows.slice(2); 

    return (
        <div className="overflow-x-auto my-4 rounded-lg border border-white/10 bg-black/20">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-white/5 text-brand-orange uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                        {headers.map((h, i) => (
                            <th key={i} className="px-4 py-3 border-b border-white/10">{renderInline(h)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {bodyRows.map((row, idx) => {
                        const cells = row.split('|').filter((c, i, arr) => {
                             if (i === 0 && c === '') return false;
                             if (i === arr.length - 1 && c === '') return false;
                             return true;
                        });
                        return (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                {cells.map((c, cIdx) => (
                                    <td key={cIdx} className="px-4 py-3 border-r border-white/5 last:border-0 text-gray-300 align-top">
                                        {renderInline(c.trim())}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export const SimpleMarkdown = ({ content }: { content: string }) => {
    if (!content) return <div className="text-gray-600 italic text-xs">Preview konten akan muncul di sini...</div>;
    
    const lines = content.split('\n');
    const blocks: { type: string, content: string }[] = [];
    let tableBuffer: string[] = [];

    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('|')) {
            tableBuffer.push(line);
        } else {
            if (tableBuffer.length > 0) {
                blocks.push({ type: 'table', content: tableBuffer.join('\n') });
                tableBuffer = [];
            }
            if (trimmed !== '') {
                blocks.push({ type: 'text', content: line });
            } else {
                blocks.push({ type: 'break', content: '' });
            }
        }
    });
    if (tableBuffer.length > 0) {
        blocks.push({ type: 'table', content: tableBuffer.join('\n') });
    }

    return (
        <div className="prose prose-invert prose-sm max-w-none space-y-2">
            {blocks.map((block, i) => {
                if (block.type === 'table') {
                    return <MarkdownTable key={i} content={block.content} />;
                }
                const line = block.content;
                if (block.type === 'break') return <div key={i} className="h-2"></div>;
                // GRADIENT HEADINGS LOGIC
                if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-600 mt-6 mb-4 border-b border-brand-orange/30 pb-2">{line.replace('# ', '')}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-600 mt-8 mb-3">{line.replace('## ', '')}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500 mt-6 mb-2">{line.replace('### ', '')}</h3>;
                
                if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-gray-300 pl-2">{renderInline(line.replace('- ', ''))}</li>;
                if (line.startsWith('1. ')) return <li key={i} className="ml-4 list-decimal text-gray-300 pl-2">{renderInline(line.replace(/^\d+\.\s/, ''))}</li>;
                if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-brand-orange pl-4 italic text-gray-400 my-4 bg-white/5 py-2 pr-2 rounded-r">{renderInline(line.replace('> ', ''))}</blockquote>;
                return <p key={i} className="text-gray-300 leading-relaxed text-justify">{renderInline(line)}</p>;
            })}
        </div>
    );
};
