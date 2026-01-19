
import React, { useState } from 'react';
import { Loader2, Sparkles, Plus, Undo, Redo, History } from 'lucide-react';
import { useLiveEditor, Block } from './hooks/use-live-editor';
import { BlockWrapper } from './editor/blocks/block-wrapper';
import { TextBlock } from './editor/blocks/text-block';
import { EmbedBlock } from './editor/blocks/embed-block';

export const LiveEditor = ({ 
    content, 
    onChange,
    onRegenerate,
    isGenerating
}: { 
    content: string, 
    onChange: (val: string) => void,
    onRegenerate?: () => void,
    isGenerating?: boolean
}) => {
    const { blocks, uploading, historyStep, historyLength, actions } = useLiveEditor(content, onChange);

    const isEmpty = blocks.length === 0 || (blocks.length === 1 && blocks[0].content === '');

    return (
        <div className="pb-20 min-h-[400px] relative">
            
            {/* TOOLBAR */}
            <div className="sticky top-0 z-40 flex justify-center mb-4 pointer-events-none">
                <div className="bg-brand-dark/90 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 shadow-neon flex items-center gap-4 pointer-events-auto transform -translate-y-2 hover:translate-y-0 transition-transform">
                    <button onClick={actions.handleUndo} disabled={historyStep <= 0} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"><Undo size={16} /></button>
                    <div className="w-px h-4 bg-white/10"></div>
                    <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1"><History size={10}/> {historyStep > 0 ? `${historyStep} Step` : 'Aman'}</span>
                    <div className="w-px h-4 bg-white/10"></div>
                    <button onClick={actions.handleRedo} disabled={historyStep >= historyLength - 1} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"><Redo size={16} /></button>
                </div>
            </div>

            {/* AI GENERATE BUTTON (IF EMPTY) */}
            {isEmpty && onRegenerate && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onRegenerate(); }}
                        disabled={isGenerating}
                        className="pointer-events-auto bg-brand-gradient hover:bg-brand-gradient-hover text-white px-6 py-3 rounded-full font-bold shadow-neon flex items-center gap-2 transform hover:-translate-y-1 transition-all"
                    >
                        {isGenerating ? <Loader2 size={18} className="animate-spin"/> : <Sparkles size={18} />}
                        {isGenerating ? 'Menulis Artikel...' : 'GENERATE ARTIKEL (AI)'}
                    </button>
                </div>
            )}

            {/* BLOCKS RENDER */}
            {blocks.map((block, index) => (
                <BlockWrapper 
                    key={block.id} 
                    index={index} 
                    onMove={actions.moveBlock}
                    onRemove={actions.removeBlock}
                    onAdd={actions.addBlock}
                    onUpload={actions.handleFileUpload}
                    uploading={uploading}
                >
                    {block.type === 'text' && (
                        <TextBlock content={block.content} onChange={(val) => actions.updateBlockContent(block.id, val)} />
                    )}

                    {block.type === 'image' && (
                        <div className="relative group/media my-2"><img src={block.content} alt="Content" className="w-full rounded-xl border border-white/10" /></div>
                    )}

                    {block.type === 'video' && (
                        <div className="relative my-2 aspect-video bg-black rounded-xl border border-white/10 overflow-hidden">
                            <iframe src={block.content} className="w-full h-full" title="Video" frameBorder="0" allowFullScreen></iframe>
                        </div>
                    )}

                    {['file', 'project', 'product', 'service'].includes(block.type) && (
                        <EmbedBlock 
                            type={block.type} 
                            block={block} 
                            onChange={(newMeta) => { 
                                // Construct full new content string based on meta updates is tricky here
                                // So we rely on metadata for rendering, but update parent content logic needs the serializer
                                // useLiveEditor hook handles `updateBlockContent` which triggers serialization using current blocks state + updates
                                actions.updateBlockContent(block.id, block.content, newMeta); 
                            }} 
                        />
                    )}
                </BlockWrapper>
            ))}

            {/* EMPTY STATE ADDER */}
            {!isEmpty && (
                <div className="text-center py-6 opacity-0 hover:opacity-100 transition-opacity">
                    <button onClick={() => actions.addBlock(blocks.length - 1, 'text')} className="text-gray-500 hover:text-brand-orange flex items-center justify-center gap-2 mx-auto text-xs font-bold uppercase tracking-wider border border-dashed border-gray-700 px-4 py-2 rounded-full hover:border-brand-orange transition-all"><Plus size={14}/> Tambah Paragraf Baru</button>
                </div>
            )}
        </div>
    );
};
