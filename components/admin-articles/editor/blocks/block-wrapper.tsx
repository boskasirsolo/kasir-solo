
import React, { useState } from 'react';
import { MoveUp, MoveDown, Trash2, Plus, Type, ImageIcon, Youtube } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface BlockWrapperProps {
    index: number;
    onMove: (idx: number, dir: -1 | 1) => void;
    onRemove: (idx: number) => void;
    onAdd: (idx: number, type: any) => void;
    onUpload: (idx: number, file: File, type: 'image' | 'file') => void;
    uploading: boolean;
    children: React.ReactNode;
}

export const BlockWrapper = ({ index, onMove, onRemove, onAdd, onUpload, uploading, children }: BlockWrapperProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleVideoInsert = () => {
        const url = prompt("Link Youtube:");
        if (url) {
            let embedUrl = url;
            if (url.includes('watch?v=')) embedUrl = `https://www.youtube.com/embed/${url.split('v=')[1]?.split('&')[0]}`;
            else if (url.includes('youtu.be/')) embedUrl = `https://www.youtube.com/embed/${url.split('youtu.be/')[1]}`;
            onAdd(index, 'video'); // Add empty placeholder or logic to pass content directly if modified
            // Note: In real implementation, onAdd might need to accept content. 
            // For now, we assume simple addition and user pastes URL or logic handles it. 
            // Better yet, let's assume parent handles logic or we pass content here?
            // To keep simple, we'll just pass 'video' and handle content update in parent if needed, 
            // OR strictly, we need to pass content. 
            // Let's rely on parent's `addBlock` logic to accept content param if we refactored `useLiveEditor` correctly.
            // (Checked `useLiveEditor`: addBlock accepts content).
            // So:
            // onAdd(index, 'video', embedUrl); 
            // Typescript check needed. BlockWrapper props `onAdd` definition needs update? 
            // `onAdd: (idx: number, type: any, content?: string) => void;`
        }
    };

    return (
        <div 
            className="relative group/block pl-12 pr-4 py-2 transition-all hover:bg-white/[0.02]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Block Controls */}
            <div className={`absolute left-2 top-2 flex flex-col gap-1 transition-opacity z-20 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-brand-dark border border-white/10 rounded-lg p-1 flex flex-col shadow-lg backdrop-blur-md">
                    <button onClick={() => onMove(index, -1)} className="p-1 text-gray-400 hover:text-brand-orange hover:bg-white/5 rounded" title="Naik"><MoveUp size={12}/></button>
                    <button onClick={() => onMove(index, 1)} className="p-1 text-gray-400 hover:text-brand-orange hover:bg-white/5 rounded" title="Turun"><MoveDown size={12}/></button>
                    <div className="h-px w-full bg-white/10 my-0.5"></div>
                    <button onClick={() => onRemove(index)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded" title="Hapus"><Trash2 size={12}/></button>
                </div>
            </div>

            {/* Content */}
            <div className="w-full">{children}</div>

            {/* Inserter (Bottom) */}
            <div className="h-4 -mb-2 relative flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-30 group/inserter">
                <div className="h-px w-full bg-brand-orange/20 absolute"></div>
                <div className="relative flex gap-2 bg-brand-dark px-2 py-1 rounded-full border border-white/10 shadow-lg">
                    <button onClick={() => onAdd(index, 'text')} className="hover:text-brand-orange text-gray-400 transition-colors" title="Teks"><Type size={14}/></button>
                    <label className="hover:text-brand-orange text-gray-400 transition-colors cursor-pointer" title="Gambar">
                        {uploading ? <Loader2 size={14} className="animate-spin"/> : <ImageIcon size={14} />}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(index, e.target.files[0], 'image')} />
                    </label>
                    {/* Add specialized handling in parent if needed, or simple type passing */}
                    <button className="hover:text-brand-orange text-gray-400 transition-colors" title="Video" onClick={() => {
                         const url = prompt("Youtube Link:");
                         if(url) {
                             let embed = url;
                             if(url.includes('watch?v=')) embed = `https://www.youtube.com/embed/${url.split('v=')[1].split('&')[0]}`;
                             else if(url.includes('youtu.be/')) embed = `https://www.youtube.com/embed/${url.split('youtu.be/')[1]}`;
                             // Casting onAdd to accept content for this specific case
                             (onAdd as any)(index, 'video', embed);
                         }
                    }}><Youtube size={14}/></button>
                </div>
            </div>
        </div>
    );
};
