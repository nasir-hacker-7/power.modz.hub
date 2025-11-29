
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ContentItem } from '../types';
import { Download, Eye, HardDrive, Image as ImageIcon, Video, Box, Archive, Smartphone, FileText, Lock } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';

interface ContentCardProps {
  item: ContentItem;
}

const getTypeIcon = (type: string) => {
  switch(type) {
    case 'App': return <Smartphone size={16} />;
    case 'Video': return <Video size={16} />;
    case 'Image': return <ImageIcon size={16} />;
    case 'PDF': return <FileText size={16} />;
    case 'Zip': return <Archive size={16} />;
    default: return <Box size={16} />;
  }
};

export const ContentCard: React.FC<ContentCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // Use auth from context

  const handleAction = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
        await dataService.incrementViews(item.id);
    } catch (e) {
        console.error("Failed to increment views", e);
    }
    navigate(`/view/${item.id}`);
  };

  return (
    <div className="group bg-white dark:bg-power-dark border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-power-500/50 hover:shadow-2xl hover:shadow-power-500/10 transition-all duration-300 flex flex-col h-full relative active:scale-95 md:active:scale-100">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer" onClick={handleAction}>
        <img 
          src={item.thumbnailUrl} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Preview' }}
        />
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-xs font-semibold px-2 py-1 rounded-md text-white border border-white/10 flex items-center gap-1">
          {getTypeIcon(item.type)}
          {item.type}
        </div>
        
        {/* Only show Lock overlay if user is NOT logged in */}
        {!user && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] transition-opacity duration-300">
             <div className="bg-black/80 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-white border border-white/20 shadow-lg">
                <Lock size={12} /> Sign in to view
             </div>
          </div>
        )}
      </div>
      
      {/* Content Info */}
      <div className="p-3 md:p-5 flex-1 flex flex-col">
        <div className="mb-1 md:mb-2">
           <span className="text-[10px] md:text-xs font-medium text-power-600 dark:text-power-500 uppercase tracking-wider">{item.category}</span>
        </div>
        
        <h3 className="text-sm md:text-lg font-bold text-slate-900 dark:text-white mb-1 md:mb-2 line-clamp-1 group-hover:text-power-600 dark:group-hover:text-power-400 transition-colors cursor-pointer" onClick={handleAction}>
          {item.title}
        </h3>
        
        <p className="hidden md:block text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
          {item.description}
        </p>
        
        {/* Stats Row */}
        <div className="flex items-center gap-4 text-[10px] md:text-xs text-gray-500 dark:text-gray-500 mb-2 md:mb-4 border-b border-gray-100 dark:border-white/5 pb-2 md:pb-4">
          <div className="flex items-center gap-1">
            <Eye size={12} className="md:w-[14px] md:h-[14px]" />
            {item.views > 999 ? `${(item.views/1000).toFixed(1)}k` : item.views}
          </div>
          {item.size && (
            <div className="flex items-center gap-1">
              <HardDrive size={12} className="md:w-[14px] md:h-[14px]" />
              {item.size}
            </div>
          )}
        </div>
        
        {/* Button */}
        <button 
          onClick={handleAction}
          className={`w-full py-2 md:py-2.5 font-medium rounded-lg text-xs md:text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-auto
            ${user 
              ? 'bg-gray-100 hover:bg-power-600 hover:text-white text-power-600 dark:bg-white/5 dark:hover:bg-power-600 dark:text-power-500 dark:hover:text-white' 
              : 'bg-gray-50 hover:bg-power-50 text-gray-400 hover:text-power-600 border border-dashed border-gray-300 hover:border-power-500/50 dark:bg-white/5 dark:hover:bg-power-500/20 dark:text-gray-400 dark:hover:text-white dark:border-white/10'
            }`}
        >
          {user ? (
            <>
              <Download size={16} className="md:w-[18px] md:h-[18px]" />
              Download
            </>
          ) : (
            <>
              <Lock size={14} className="md:w-[16px] md:h-[16px]" />
              <span className="md:hidden">Sign in</span>
              <span className="hidden md:inline">Sign in to Download</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
