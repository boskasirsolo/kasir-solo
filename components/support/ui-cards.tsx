
import React from 'react';
import { HardDrive, FileText, Smartphone, Wrench, Package, Monitor, PlayCircle, Lock, Eye } from 'lucide-react';
import { DownloadItem, Tutorial } from '../../types';

// --- HELPER: Category Colors ---
export const getCategoryColor = (category: string) => {
    switch (category) {
      case 'driver': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'manual': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'software': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'tools': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-white/5 text-gray-400 border-white/10';
    }
};

export const DownloadCard: React.FC<{ item: DownloadItem, onClick: () => void }> = ({ item, onClick }) => {
  const getIcon = () => {
    switch (item.category) {
      case 'driver': return <HardDrive size={20} className="text-blue-400" />;
      case 'manual': return <FileText size={20} className="text-yellow-400" />;
      case 'software': return <Smartphone size={20} className="text-green-400" />;
      case 'tools': return <Wrench size={20} className="text-red-400" />;
      default: return <Package size={20} className="text-gray-400" />;
    }
  };

  const isLocked = item.access_key && item.access_key.length > 0;

  return (
    <div onClick={onClick} className="bg-brand-card border border-white/5 rounded-xl p-4 hover:border-brand-orange/50 transition-all group flex flex-col h-full shadow-lg cursor-pointer hover:-translate-y-1 relative overflow-hidden">
      {isLocked && (
          <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded-bl-lg shadow-md z-10 flex items-center gap-1">
              <Lock size={10} /> VIP
          </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/10 bg-black/40 group-hover:bg-white/5 transition-colors">
          {getIcon()}
        </div>
        <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${getCategoryColor(item.category)}`}>
          {item.category}
        </span>
      </div>
      
      <h3 className="text-white font-bold text-xs mb-2 line-clamp-2 min-h-[2rem] group-hover:text-brand-orange transition-colors">
        {item.title}
      </h3>
      
      <div className="mt-auto pt-3 border-t border-white/5">
        <div className="flex justify-between items-center text-[9px] text-gray-500 mb-3">
           <span className="flex items-center gap-1"><Monitor size={8}/> {item.os_support}</span>
           <span>{item.file_size}</span>
        </div>
        <button className={`w-full flex items-center justify-center gap-2 border py-2 rounded text-[10px] font-bold transition-all shadow-[0_0_10px_rgba(255,95,31,0.15)] ${isLocked ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white' : 'border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white'}`}>
          {isLocked ? <Lock size={12}/> : <Eye size={12}/>}
          {isLocked ? 'Buka Kunci' : 'Preview & Download'}
        </button>
      </div>
    </div>
  );
};

export const VideoCard: React.FC<{ item: Tutorial }> = ({ item }) => (
    <a 
        href={item.video_url} 
        target="_blank" 
        rel="noreferrer"
        className="flex items-center gap-3 p-3 rounded-lg bg-black/20 hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5"
    >
        <div className="w-8 h-8 rounded-full bg-red-900/20 text-red-500 flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <PlayCircle size={14} />
        </div>
        <span className="text-[11px] text-gray-300 font-bold group-hover:text-white line-clamp-2">{item.title}</span>
    </a>
);
