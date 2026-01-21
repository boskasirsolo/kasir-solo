
import React from 'react';
import { Quote } from 'lucide-react';
import { cleanId, renderFormattedText } from '../../../utils';
import { MarkdownTable } from '../../content-renderers';

// FIX: Typed as React.FC to correctly handle internal React props like 'key'
export const ArticleExcerpt: React.FC<{ text: string }> = ({ text }) => (
    <div className="mb-10 relative">
        <div className="absolute -top-4 -left-2 text-brand-orange opacity-20">
            <Quote size={40} fill="currentColor" />
        </div>
        <blockquote className="relative z-10 border-l-4 border-brand-orange bg-gradient-to-r from-brand-orange/10 to-transparent p-6 rounded-r-xl shadow-lg my-8">
            <p className="text-xl text-white font-medium italic leading-relaxed m-0">"{text}"</p>
        </blockquote>
    </div>
);

// FIX: Typed as React.FC to correctly handle internal React props like 'key'
export const HeadingBlock: React.FC<{ content: string }> = ({ content }) => {
    const getDetails = (prefix: string) => {
        const text = content.replace(new RegExp(`^${prefix}\\s+`), '');
        return { text, id: cleanId(text.replace(/\*\*/g, '')) };
    };

    if (content.startsWith('########## ')) {
        const { text, id } = getDetails('##########');
        return <div id={id} className="deep-heading scroll-mt-32 text-xs font-mono font-bold text-gray-600 bg-black/20 p-2 rounded border border-white/5 mt-4 mb-2 heading-observer">{renderFormattedText(text)}</div>;
    }
    if (content.startsWith('######### ')) {
        const { text, id } = getDetails('#########');
        return <div id={id} className="deep-heading scroll-mt-32 text-xs font-bold text-gray-500 underline decoration-dotted underline-offset-4 mt-4 mb-2 heading-observer">{renderFormattedText(text)}</div>;
    }
    if (content.startsWith('######## ')) {
        const { text, id } = getDetails('########');
        return <div id={id} className="deep-heading scroll-mt-32 text-sm font-bold text-gray-400 border-l-2 border-gray-700 pl-3 italic mt-5 mb-2 heading-observer">{renderFormattedText(text)}</div>;
    }
    if (content.startsWith('####### ')) {
        const { text, id } = getDetails('#######');
        return <div id={id} className="deep-heading scroll-mt-32 text-[10px] font-bold text-brand-orange uppercase tracking-[0.2em] border border-brand-orange/30 px-2 py-1 rounded-md w-fit mt-6 mb-2 heading-observer">{renderFormattedText(text)}</div>;
    }
    if (content.startsWith('###### ')) {
        const { text, id } = getDetails('######');
        return <h6 id={id} className="scroll-mt-32 text-sm font-bold text-gray-500 italic border-b border-white/5 pb-1 inline-block mt-6 mb-2 heading-observer">{renderFormattedText(text)}</h6>;
    }
    if (content.startsWith('##### ')) {
        const { text, id } = getDetails('#####');
        return <h5 id={id} className="scroll-mt-32 text-sm font-bold text-brand-orange uppercase tracking-widest mt-8 mb-3 heading-observer flex items-center gap-2"><span className="w-1 h-3 bg-brand-orange rounded-full"></span>{renderFormattedText(text)}</h5>;
    }
    if (content.startsWith('#### ')) {
        const { text, id } = getDetails('####');
        return <h4 id={id} className="scroll-mt-32 text-lg font-bold text-gray-200 mt-8 mb-2 heading-observer">{renderFormattedText(text)}</h4>;
    }
    if (content.startsWith('### ')) { 
        const { text, id } = getDetails('###');
        return <h3 id={id} className="scroll-mt-32 text-xl font-bold text-white mt-10 mb-3 heading-observer flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-brand-orange shrink-0"></span>{renderFormattedText(text)}</h3>; 
    }
    if (content.startsWith('## ')) { 
        const { text, id } = getDetails('##');
        return <h2 id={id} className="scroll-mt-32 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-600 mt-12 mb-6 border-l-4 border-brand-orange pl-4 heading-observer">{renderFormattedText(text)}</h2>; 
    }
    if (content.startsWith('# ')) { 
        const { text, id } = getDetails('#');
        return <h1 id={id} className="scroll-mt-32 text-3xl md:text-4xl font-display font-bold text-white mt-16 mb-8 pb-4 border-b border-white/10 heading-observer">{renderFormattedText(text)}</h1>; 
    }
    
    return null;
};

// FIX: Typed as React.FC to correctly handle internal React props like 'key'
export const StandardTextBlock: React.FC<{ content: string }> = ({ content }) => {
    if (content.startsWith('> ')) {
        return <blockquote className="border-l-4 border-gray-600 bg-white/5 p-6 italic text-gray-300 my-8 rounded-r-xl">{renderFormattedText(content.replace('> ', ''))}</blockquote>;
    }
    if (content.startsWith('* ') || content.startsWith('- ')) {
        return <div className="flex gap-3 ml-2 mb-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-2.5 shrink-0"></div><span>{renderFormattedText(content.substring(2))}</span></div>;
    }
    if (/^\d+\.\s/.test(content)) { 
        const number = content.split('.')[0]; 
        return <div className="flex gap-3 ml-2 mb-3"><span className="text-brand-orange font-bold font-mono text-lg">{number}.</span><span className="mt-1">{renderFormattedText(content.substring(content.indexOf('.') + 1).trim())}</span></div>; 
    }
    if (content === '---') {
        return <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-12" />;
    }
    if (content.startsWith('|') && content.includes('|')) { 
        return <MarkdownTable content={content} />; 
    }
    
    return <p className="text-lg leading-8 text-gray-300">{renderFormattedText(content)}</p>;
};
