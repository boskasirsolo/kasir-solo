
import React from 'react';
import { Eye } from 'lucide-react';

export const GodModeBadge = ({ views }: { views: number | null }) => {
    if (views === null) return null;
    return (
        <span className="flex items-center gap-2 text-purple-300 text-xs font-bold bg-purple-900/60 px-3 py-1 rounded-full backdrop-blur-md border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-pulse">
            <Eye size={12} className="text-purple-300" /> {views} Views
        </span>
    );
};
