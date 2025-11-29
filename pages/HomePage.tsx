
import React, { useState, useEffect } from 'react';
import { ContentItem, CATEGORIES } from '../types';
import { dataService } from '../services/dataService';
import { ContentCard } from '../components/ContentCard';
import { Zap, Filter, Loader } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Real-time subscription
    const unsubscribe = dataService.subscribeToContent((data) => {
      // Filter out private items for public view
      const publicItems = data.filter(item => item.isVisible);
      setItems(publicItems);
      setIsLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const filteredItems = selectedCategory === "All" 
    ? items 
    : items.filter(item => item.category === selectedCategory || item.type === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-white dark:bg-transparent transition-colors duration-300">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-power-100 dark:bg-power-500/20 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100 dark:bg-power-accent/20 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-power-50 dark:bg-power-500/10 border border-power-200 dark:border-power-500/20 text-power-600 dark:text-power-500 text-sm font-medium mb-6">
            <Zap size={14} />
            <span>Power Up Your Digital Experience</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-power-600 to-indigo-600 dark:from-power-500 dark:to-power-accent">Power Modz</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            The ultimate hub for premium apps, game mods, high-quality media, and essential utilities. Secure, fast, and always online.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => document.getElementById('content-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 bg-power-600 hover:bg-power-700 dark:bg-power-500 dark:hover:bg-power-600 text-white font-bold rounded-xl shadow-lg shadow-power-500/25 transition-all transform hover:-translate-y-1"
            >
              Explore Content
            </button>
            <button className="px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white font-bold rounded-xl border border-gray-200 dark:border-white/10 transition-all">
              Latest Updates
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section id="content-grid" className="py-12 bg-gray-50 dark:bg-power-darker/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 self-start md:self-auto">
              <Filter size={24} className="text-power-600 dark:text-power-500" />
              Recent Uploads
            </h2>
            
            <div className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0 gap-2 scrollbar-hide no-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-power-600 text-white dark:bg-power-500 shadow-lg shadow-power-500/20' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white border border-gray-200 dark:border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid - Standard Responsive (1 Col Mobile, 2 Col Tablet, 4 Col Desktop) */}
          {isLoading ? (
             <div className="flex justify-center items-center py-20">
               <Loader className="animate-spin text-power-600 dark:text-power-500" size={40} />
             </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-gray-300 dark:border-white/10">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No content found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <ContentCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
