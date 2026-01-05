
import { HardDrive, FileText, Smartphone, Wrench } from 'lucide-react';

export const parseVolume = (volStr: string): number => {
    if (!volStr) return 0; // Guard clause
    try {
        const clean = volStr.toLowerCase().replace('/mo', '').trim();
        if (clean.includes('k')) {
            return parseFloat(clean.replace('k', '')) * 1000;
        }
        return parseInt(clean.replace(/[^0-9]/g, '')) || 0;
    } catch (e) {
        return 0;
    }
};

export const getFileIcon = (cat: string) => {
    switch(cat) {
        case 'driver': return HardDrive;
        case 'manual': return FileText;
        case 'software': return Smartphone;
        case 'tools': return Wrench;
        default: return FileText;
    }
};

export const getCategoryColor = (cat: string, isActive: boolean) => {
    const baseClass = "flex items-center gap-2 px-3 py-2 rounded-lg border text-[10px] font-bold transition-all";
    
    const colors: Record<string, string> = {
        'driver': isActive ? 'bg-blue-600 text-white border-blue-500' : 'text-blue-400 border-white/10 hover:bg-blue-500/10',
        'manual': isActive ? 'bg-yellow-600 text-white border-yellow-500' : 'text-yellow-400 border-white/10 hover:bg-yellow-500/10',
        'software': isActive ? 'bg-green-600 text-white border-green-500' : 'text-green-400 border-white/10 hover:bg-green-500/10',
        'tools': isActive ? 'bg-purple-600 text-white border-purple-500' : 'text-purple-400 border-white/10 hover:bg-purple-500/10',
    };

    const activeStyle = colors[cat] || (isActive ? 'bg-brand-orange text-white border-brand-orange' : 'text-gray-400 border-white/10 hover:bg-white/5');
    const shadow = isActive ? 'shadow-neon-text' : '';

    return `${baseClass} ${activeStyle} ${shadow}`;
};
