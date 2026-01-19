
import { useState, useRef, useEffect } from 'react';
import { uploadToSupabase } from '../../../utils';

export interface Block {
    id: string;
    type: 'text' | 'image' | 'video' | 'file' | 'project' | 'product' | 'service';
    content: string;
    meta?: any;
}

// --- PARSERS ---
const parseMarkdownToBlocks = (md: string): Block[] => {
    if (!md) return [{ id: 'init-' + Date.now(), type: 'text', content: '' }];
    
    const rawBlocks = md.split(/\n\n+/);
    
    return rawBlocks.map((raw, idx) => {
        const id = `block-${idx}-${Date.now()}`;
        const trimmed = raw.trim();

        // Regex Matchers
        const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        const fileMatch = trimmed.match(/^\[FILE: (.*?)\]\((.*?)\)$/);
        const projectMatch = trimmed.match(/^\[PROJECT: (.*?) \| (.*?) \| (.*?) \| (.*?)\]$/);
        const productMatch = trimmed.match(/^\[PRODUCT: (.*?) \| (.*?) \| (.*?) \| (.*?)\]$/);
        const serviceMatch = trimmed.match(/^\[SERVICE: (.*?) \| (.*?) \| (.*?)\]$/);
        const videoMatch = trimmed.match(/src="([^"]+)"/) || (trimmed.startsWith('https://') && trimmed.includes('youtube.com') ? { 1: trimmed } : null);

        if (imgMatch) return { id, type: 'image', content: imgMatch[2], meta: { alt: imgMatch[1] } };
        if (fileMatch) return { id, type: 'file', content: fileMatch[2], meta: { label: fileMatch[1] } };
        if (projectMatch) return { id, type: 'project', content: trimmed, meta: { title: projectMatch[1], url: projectMatch[2], image: projectMatch[3], desc: projectMatch[4] } };
        if (productMatch) return { id, type: 'product', content: trimmed, meta: { name: productMatch[1], price: productMatch[2], image: productMatch[3], desc: productMatch[4] } };
        if (serviceMatch) return { id, type: 'service', content: trimmed, meta: { title: serviceMatch[1], url: serviceMatch[2], desc: serviceMatch[3] } };
        if (trimmed.startsWith('<iframe') && videoMatch) return { id, type: 'video', content: videoMatch[1] };

        return { id, type: 'text', content: raw };
    });
};

const serializeBlocksToMarkdown = (blocks: Block[]): string => {
    return blocks.map(b => {
        if (b.type === 'image') return `![${b.meta?.alt || 'image'}](${b.content})`;
        if (b.type === 'file') return `[FILE: ${b.meta?.label || 'Download File'}](${b.content})`;
        if (b.type === 'project') return `[PROJECT: ${b.meta?.title} | ${b.meta?.url} | ${b.meta?.image} | ${b.meta?.desc}]`;
        if (b.type === 'product') return `[PRODUCT: ${b.meta?.name} | ${b.meta?.price} | ${b.meta?.image} | ${b.meta?.desc}]`;
        if (b.type === 'service') return `[SERVICE: ${b.meta?.title} | ${b.meta?.url} | ${b.meta?.desc}]`;
        if (b.type === 'video') return `<iframe width="100%" height="400" src="${b.content}" title="Video" frameborder="0" allowfullscreen></iframe>`;
        return b.content;
    }).join('\n\n');
};

// --- HOOK ---
export const useLiveEditor = (initialContent: string, onChange: (val: string) => void) => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [history, setHistory] = useState<Block[][]>([]);
    const [historyStep, setHistoryStep] = useState(-1);
    const [uploading, setUploading] = useState(false);
    
    const isUndoing = useRef(false);
    const debounceTimeout = useRef<any>(null);
    const isInternalChange = useRef(false);

    // Initial Load
    useEffect(() => {
        if (isInternalChange.current) { isInternalChange.current = false; return; }
        const parsed = parseMarkdownToBlocks(initialContent);
        setBlocks(parsed);
        if (history.length === 0) { setHistory([parsed]); setHistoryStep(0); }
    }, [initialContent]);

    // History Manager
    const updateParent = (newBlocks: Block[], saveToHistory = false) => {
        isInternalChange.current = true;
        setBlocks(newBlocks);
        onChange(serializeBlocksToMarkdown(newBlocks));
        if (saveToHistory) pushToHistory(newBlocks);
    };

    const pushToHistory = (newBlocks: Block[]) => {
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(JSON.parse(JSON.stringify(newBlocks)));
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    };

    // Actions
    const handleUndo = () => {
        if (historyStep > 0) {
            isUndoing.current = true;
            const prev = history[historyStep - 1];
            setHistoryStep(prevStep => prevStep - 1);
            updateParent(prev, false);
            setTimeout(() => { isUndoing.current = false; }, 100);
        }
    };

    const handleRedo = () => {
        if (historyStep < history.length - 1) {
            isUndoing.current = true;
            const next = history[historyStep + 1];
            setHistoryStep(prevStep => prevStep + 1);
            updateParent(next, false);
            setTimeout(() => { isUndoing.current = false; }, 100);
        }
    };

    const updateBlockContent = (id: string, content: string, meta?: any) => {
        const newBlocks = blocks.map(b => b.id === id ? { ...b, content, meta: meta ? { ...b.meta, ...meta } : b.meta } : b);
        updateParent(newBlocks, false);
        
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            if (!isUndoing.current) pushToHistory(newBlocks);
        }, 1000);
    };

    const addBlock = (index: number, type: any, content = '', meta = {}) => {
        const newBlock: Block = { id: `new-${Date.now()}-${Math.random()}`, type, content, meta };
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        updateParent(newBlocks, true);
    };

    const removeBlock = (index: number) => {
        const newBlocks = blocks.filter((_, i) => i !== index);
        updateParent(newBlocks, true);
    };

    const moveBlock = (index: number, direction: -1 | 1) => {
        if (index + direction < 0 || index + direction >= blocks.length) return;
        const newBlocks = [...blocks];
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[index + direction];
        newBlocks[index + direction] = temp;
        updateParent(newBlocks, true);
    };

    const handleFileUpload = async (index: number, file: File, type: 'image' | 'file') => {
        setUploading(true);
        try {
            const { url } = await uploadToSupabase(file, 'articles');
            const meta = type === 'file' ? { label: file.name } : { alt: 'image' };
            addBlock(index, type, url, meta);
        } catch (e) { alert("Gagal upload."); } 
        finally { setUploading(false); }
    };

    return {
        blocks, uploading, historyStep, historyLength: history.length,
        actions: { updateBlockContent, addBlock, removeBlock, moveBlock, handleUndo, handleRedo, handleFileUpload }
    };
};
