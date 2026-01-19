
import React, { useRef, useEffect } from 'react';

const getTextStyle = (text: string) => {
    if (text.startsWith('# ')) return 'text-3xl font-display font-bold text-brand-orange border-b border-brand-orange/30 pb-2 mb-4 mt-6';
    if (text.startsWith('## ')) return 'text-2xl font-display font-bold text-white border-l-4 border-brand-orange pl-4 mb-3 mt-5 bg-white/5 py-1';
    if (text.startsWith('### ')) return 'text-xl font-bold text-brand-orange mb-2 mt-4';
    if (text.startsWith('> ')) return 'italic text-gray-400 border-l-4 border-white/20 pl-4 py-2 my-4 bg-white/5 rounded-r';
    if (text.startsWith('- ') || text.startsWith('* ')) return 'list-item list-inside ml-4';
    return 'text-base text-gray-300 leading-relaxed';
};

export const TextBlock = ({ content, onChange }: { content: string, onChange: (val: string) => void }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [content]);

    return (
        <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Mulai menulis..."
            className={`w-full bg-transparent outline-none resize-none transition-all ${getTextStyle(content)}`}
            rows={1}
        />
    );
};
