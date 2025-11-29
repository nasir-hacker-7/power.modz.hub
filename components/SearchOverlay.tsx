
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search, ArrowRight, Loader } from 'lucide-react';
import { ContentItem } from '../types';
import { dataService } from '../services/dataService';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [allItems, setAllItems] = useState<ContentItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const navigate = useNavigate();

  // Fetch data when overlay opens to ensure we search through all items
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
      
      const loadData = async () => {
        const items = await dataService.getAllItemsOnce();
        // Filter out private items for public search
        const publicItems = items.filter(item => item.isVisible);
        setAllItems(publicItems);
        setIsDataLoaded(true);
      };
      loadData();
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
    } else if (isDataLoaded) {
      const lowerQuery = query.toLowerCase();
      const filtered = allItems.filter(item => 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.description.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
    }
  }, [query, isDataLoaded, allItems]);

  const handleItemClick = (id: string) => {
    onClose();
    // Navigate to the view page
    navigate(`/view/${id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-power-darker/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto w-full px-4 pt-8">
        <div className="flex items-center justify-end mb-8">
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <X size={28} />
          </button>
        </div>

        <div className="relative mb-12">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500" size={32} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isDataLoaded ? "Search for apps, files, videos..." : "Loading database..."}
            className="w-full bg-transparent border-b-2 border-white/10 text-3xl md:text-5xl font-bold text-white py-4 pl-12 pr-4 focus:outline-none focus:border-power-500 placeholder:text-gray-700 transition-colors"
          />
          {!isDataLoaded && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Loader className="animate-spin text-power-500" />
            </div>
          )}
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[60vh] pb-10">
          {query && results.length === 0 && (
             <div className="text-center text-gray-500 py-10">
               <p className="text-xl">No results found for "{query}"</p>
             </div>
          )}

          {results.map((item) => (
            <div key={item.id} className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer" onClick={() => handleItemClick(item.id)}>
              <img src={item.thumbnailUrl} alt={item.title} className="w-16 h-16 rounded-lg object-cover bg-gray-800" />
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white">{item.title}</h4>
                <p className="text-sm text-gray-400">{item.type} • {item.category}</p>
              </div>
              <button 
                className="p-2 bg-power-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-200"
              >
                <ArrowRight size={20} color="white" />
              </button>
            </div>
          ))}

          {!query && (
            <div className="text-center">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-widest mb-6">Suggested Categories</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['Apps', 'Games', 'Wallpapers', 'Mods', 'Scripts'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-4 py-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-power-500 hover:bg-power-500/10 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
