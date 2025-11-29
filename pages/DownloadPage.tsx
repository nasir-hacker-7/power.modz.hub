
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';
import { ContentItem } from '../types';
import { Download, Clock, AlertTriangle, FileText, ArrowLeft, Shield, CheckCircle } from 'lucide-react';

export const DownloadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);
  const [canDownload, setCanDownload] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      const data = await dataService.getItemById(id);
      setItem(data);
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  useEffect(() => {
    if (!loading && item && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanDownload(true);
    }
  }, [loading, item, timeLeft]);

  const handleDownload = () => {
    if (item?.downloadUrl) {
      window.open(item.downloadUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-power-darker flex items-center justify-center text-power-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-power-500"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-power-darker flex flex-col items-center justify-center text-slate-900 dark:text-white">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Content Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The item you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/home')} className="px-6 py-2 bg-gray-200 dark:bg-white/10 rounded-lg hover:bg-gray-300 dark:hover:bg-white/20 transition">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-power-darker py-10 md:py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-power-dark border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden p-6 md:p-8 transition-colors duration-300">
              <div className="flex flex-col md:flex-row gap-6">
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.title} 
                  className="w-full md:w-48 h-48 rounded-xl object-cover bg-gray-100 dark:bg-gray-800 shrink-0 shadow-lg"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200' }}
                />
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 bg-power-50 text-power-600 border-power-200 dark:bg-power-500/10 dark:text-power-500 dark:border-power-500/20 text-xs font-bold rounded-full mb-3 uppercase tracking-wider border">
                    {item.type}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                     <span className="flex items-center gap-1"><Clock size={16} /> {new Date(item.uploadDate).toLocaleDateString()}</span>
                     <span className="flex items-center gap-1"><FileText size={16} /> {item.size || 'Unknown Size'}</span>
                     {item.version && <span className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">v{item.version}</span>}
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-100 dark:border-white/5 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">{item.description}</p>
              </div>
            </div>

            {/* Ad Placeholder */}
            <div className="w-full h-32 bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 rounded-xl flex items-center justify-center flex-col gap-2 text-gray-500">
              <span className="text-xs uppercase tracking-widest font-semibold">Advertisement</span>
              <div className="text-xs opacity-50">Support Power Modz by disabling AdBlock</div>
            </div>
            
            {/* Mobile View Download Block (Visible only on small screens if you want, but default is inline) */}
            <div className="lg:hidden bg-white dark:bg-power-dark border border-gray-200 dark:border-white/10 rounded-2xl p-6 transition-colors duration-300">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Download</h3>
               {!canDownload ? (
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 text-center border border-gray-100 dark:border-white/5">
                   <Clock size={24} className="mx-auto text-power-600 dark:text-power-500 mb-2" />
                   <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">Please wait...</p>
                   <p className="text-xl font-bold text-slate-900 dark:text-white">{timeLeft}s</p>
                </div>
              ) : (
                <button 
                  onClick={handleDownload}
                  className="w-full py-3 bg-power-600 hover:bg-power-700 dark:bg-power-500 dark:hover:bg-power-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Now
                </button>
              )}
            </div>
          </div>

          {/* Download Sidebar - Desktop & Tablet */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white dark:bg-power-dark border border-gray-200 dark:border-white/10 rounded-2xl p-6 sticky top-24 transition-colors duration-300">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Download className="text-power-600 dark:text-power-500" /> Download Center
              </h3>

              {!canDownload ? (
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 text-center border border-gray-100 dark:border-white/5 animate-pulse">
                   <Clock size={32} className="mx-auto text-power-600 dark:text-power-500 mb-3" />
                   <p className="text-gray-600 dark:text-gray-300 font-medium mb-1">Generating Secure Link...</p>
                   <p className="text-2xl font-bold text-slate-900 dark:text-white">{timeLeft} seconds</p>
                </div>
              ) : (
                <button 
                  onClick={handleDownload}
                  className="w-full py-4 bg-power-600 hover:bg-power-700 dark:bg-power-500 dark:hover:bg-power-600 text-white font-bold rounded-xl shadow-lg shadow-power-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 animate-bounce-subtle"
                >
                  <Download size={20} />
                  Download File
                </button>
              )}

              <div className="mt-6 space-y-3">
                 <div className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <Shield size={16} className="text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                    <span>Scanned with Anti-Virus. 100% Safe.</span>
                 </div>
                 <div className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle size={16} className="text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                    <span>Verified by Admin</span>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
