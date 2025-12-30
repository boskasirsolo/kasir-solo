import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Youtube, MoveUp, MoveDown, Trash2, GripVertical, Type, Loader2, UploadCloud, Plus } from 'lucide-react';
import { uploadToSupabase } from '../../utils';

interface Block {
    id: string;
    type: 'text' | 'image' | 'video';
    content: string; // Markdown text or URL
    meta?: any; // Extra data like alt text
}

// Helper: Parse Markdown String to Blocks
const parseMarkdownToBlocks = (md: string): Block[] => {
    if (!md) return [{ id: 'init-' + Date.now(), type: 'text', content: '' }];
    
    // Split by double newline to separate blocks
    const rawBlocks = md.split(/\n\n+/);
    
    return rawBlocks.map((raw, idx) => {
        const id = `block-${idx}-${Date.now()}`;
        const trimmed = raw.trim();

        // 1. Detect Image: ![alt](url)
        const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imgMatch) {
            return { id, type: 'image', content: imgMatch[2], meta: { alt: imgMatch[1] } };
        }

        // 2. Detect Youtube/Iframe
        if (trimmed.startsWith('<iframe') || (trimmed.startsWith('https://') && trimmed.includes('youtube.com/embed'))) {
             // Extract src if iframe tag
             const srcMatch = trimmed.match(/src="([^"]+)"/);
             const content = srcMatch ? srcMatch[1] : trimmed;
             return { id, type: 'video', content };
        }

        // 3. Default: Text
        return { id, type: 'text', content: raw };
    });
};

// Helper: Serialize Blocks back to Markdown
const serializeBlocksToMarkdown = (blocks: Block[]): string => {
    return blocks.map(b => {
        if (b.type === 'image') return `![${b.meta?.alt || 'image'}](${b.content})`;
        if (b.type === 'video') return `<iframe width="100%" height="400" src="${b.content}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        return b.content;
    }).join('\n\n');
};

const AutoResizeTextArea = ({ value, onChange, placeholder, className, style }: any) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            style={{ ...style, resize: 'none', overflow: 'hidden' }}
            rows={1}
        />
    );
};

export const LiveEditor = ({ 
    content, 
    onChange 
}: { 
    content: string, 
    onChange: (val: string) => void 
}) => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
    
    // Track source of update to prevent loops
    const isInternalChange = useRef(false);

    // Sync from Prop (External Source: AI or DB Load)
    useEffect(() => {
        // If this update was triggered by our own typing, ignore it to prevent cursor jumps/re-renders
        if (isInternalChange.current) {
            isInternalChange.current = false;
            return;
        }

        // Check if content actually changed significantly (avoid minor formatting loops)
        const currentSerialized = serializeBlocksToMarkdown(blocks);
        if (content !== currentSerialized) {
            // External update detected (AI Generation or Article Switch)
            setBlocks(parseMarkdownToBlocks(content));
        }
    }, [content]);

    // Update Parent on Change
    const updateParent = (newBlocks: Block[]) => {
        isInternalChange.current = true; // Mark as internal
        setBlocks(newBlocks);
        const md = serializeBlocksToMarkdown(newBlocks);
        onChange(md);
    };

    const updateBlockContent = (id: string, newContent: string) => {
        const newBlocks = blocks.map(b => b.id === id ? { ...b, content: newContent } : b);
        updateParent(newBlocks);
    };

    const addBlock = (index: number, type: 'text' | 'image' | 'video', content: string = '') => {
        const newBlock: Block = { id: `new-${Date.now()}-${Math.random()}`, type, content };
        const newBlocks = [...blocks];
        newBlocks.splice(index + 1, 0, newBlock);
        updateParent(newBlocks);
    };

    const removeBlock = (index: number) => {
        const newBlocks = blocks.filter((_, i) => i !== index);
        updateParent(newBlocks);
    };

    const moveBlock = (index: number, direction: -1 | 1) => {
        if (index + direction < 0 || index + direction >= blocks.length) return;
        const newBlocks = [...blocks];
        const temp = newBlocks[index];
        newBlocks[index] = newBlocks[index + direction];
        newBlocks[index + direction] = temp;
        updateParent(newBlocks);
    };

    const handleImageUpload = async (index: number, file: File) => {
        setUploading(true);
        try {
            const { url } = await uploadToSupabase(file, 'articles');
            addBlock(index, 'image', url);
        } catch (e) {
            alert("Gagal upload gambar.");
        } finally {
            setUploading(false);
        }
    };

    const handleVideoInsert = (index: number) => {
        const url = prompt("Masukkan Link Embed Youtube (atau URL Youtube biasa):");
        if (url) {
            let embedUrl = url;
            if (url.includes('watch?v=')) {
                const videoId = url.split('v=')[1]?.split('&')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            } else if (url.includes('youtu.be/')) {
                const videoId = url.split('youtu.be/')[1];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
            addBlock(index, 'video', embedUrl);
        }
    };

    // Style Helper based on Markdown Content
    const getTextStyle = (text: string) => {
        if (text.startsWith('# ')) return 'text-3xl font-display font-bold text-brand-orange mt-6 mb-2';
        if (text.startsWith('## ')) return 'text-2xl font-display font-bold text-white mt-5 mb-2';
        if (text.startsWith('### ')) return 'text-xl font-bold text-brand-orange mt-4 mb-2';
        if (text.startsWith('> ')) return 'italic text-gray-400 border-l-4 border-white/20 pl-4 py-2 my-4 bg-white/5 rounded-r';
        if (text.startsWith('- ') || text.startsWith('* ')) return 'list-item list-inside ml-4';
        return 'text-base text-gray-300 leading-relaxed';
    };

    return (
        <div className="pb-20">
            {blocks.map((block, index) => (
                <div 
                    key={block.id} 
                    className="relative group/block"
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    {/* Controls (Appear on Hover) */}
                    <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity z-20">
                        <button onClick={() => moveBlock(index, -1)} className="p-1 hover:text-brand-orange text-gray-600"><MoveUp size={12}/></button>
                        <div className="cursor-grab active:cursor-grabbing text-gray-700"><GripVertical size={12}/></div>
                        <button onClick={() => moveBlock(index, 1)} className="p-1 hover:text-brand-orange text-gray-600"><MoveDown size={12}/></button>
                        <button onClick={() => removeBlock(index)} className="p-1 hover:text-red-500 text-gray-600 mt-2"><Trash2 size={12}/></button>
                    </div>

                    {/* Block Content */}
                    <div className="px-2 py-1">
                        {block.type === 'text' && (
                            <AutoResizeTextArea
                                value={block.content}
                                onChange={(e: any) => updateBlockContent(block.id, e.target.value)}
                                placeholder="Ketik '/' untuk perintah atau mulai menulis..."
                                className={`w-full bg-transparent outline-none resize-none transition-all ${getTextStyle(block.content)}`}
                            />
                        )}

                        {block.type === 'image' && (
                            <div className="relative group/media my-4">
                                <img src={block.content} alt="Content" className="w-full rounded-xl border border-white/10" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/media:opacity-100 flex items-center justify-center transition-opacity">
                                    <p className="text-xs text-white font-bold">Image Block</p>
                                </div>
                            </div>
                        )}

                        {block.type === 'video' && (
                            <div className="relative my-4 aspect-video bg-black rounded-xl border border-white/10 overflow-hidden">
                                <iframe src={block.content} className="w-full h-full" title="Video" frameBorder="0" allowFullScreen></iframe>
                                <div className="absolute inset-0 bg-transparent pointer-events-none border-2 border-transparent group-hover/block:border-brand-orange/30 rounded-xl transition-colors"></div>
                            </div>
                        )}
                    </div>

                    {/* INSERTER (Appears between blocks) */}
                    <div className="h-4 -mb-2 relative flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-30 group/inserter">
                        <div className="h-px w-full bg-brand-orange/20 absolute"></div>
                        <div className="relative flex gap-2">
                            <button 
                                onClick={() => addBlock(index, 'text')}
                                className="bg-brand-dark border border-white/10 hover:border-brand-orange text-gray-400 hover:text-brand-orange p-1.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                                title="Add Text"
                            >
                                <Type size={14} />
                            </button>
                            <label className="bg-brand-dark border border-white/10 hover:border-brand-orange text-gray-400 hover:text-brand-orange p-1.5 rounded-full shadow-lg transition-all transform hover:scale-110 cursor-pointer" title="Add Image">
                                {uploading ? <Loader2 size={14} className="animate-spin"/> : <ImageIcon size={14} />}
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(index, e.target.files[0])} />
                            </label>
                            <button 
                                onClick={() => handleVideoInsert(index)}
                                className="bg-brand-dark border border-white/10 hover:border-brand-orange text-gray-400 hover:text-brand-orange p-1.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                                title="Add Video"
                            >
                                <Youtube size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Empty State / Start */}
            {blocks.length === 0 && (
                <div className="text-center py-10">
                    <button onClick={() => addBlock(-1, 'text')} className="text-gray-500 hover:text-brand-orange flex items-center justify-center gap-2 mx-auto">
                        <Plus size={20}/> Mulai Menulis
                    </button>
                </div>
            )}
        </div>
    );
};