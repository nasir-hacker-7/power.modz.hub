
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Smartphone, Globe, ArrowRight, LayoutGrid } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-power-darker relative overflow-hidden flex flex-col justify-center transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-power-200 dark:bg-power-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200 dark:bg-power-accent/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm dark:bg-white/5 dark:border-white/10 dark:shadow-none text-power-600 dark:text-power-500 text-sm font-medium mb-8 animate-fade-in-up">
              <Zap size={16} fill="currentColor" />
              <span>The Future of Digital Content</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              Power <span className="text-transparent bg-clip-text bg-gradient-to-r from-power-600 to-indigo-600 dark:from-power-500 dark:to-power-accent">Modz</span> <br/>
              <span className="text-3xl md:text-5xl text-gray-500 dark:text-gray-400 font-bold">Hub</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Access premium apps, secure files, and high-quality media. 
              {user ? ' Welcome back! Continue exploring your dashboard.' : ' Sign in to unlock unlimited possibilities.'}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => navigate('/home')}
                className="px-8 py-4 bg-power-600 hover:bg-power-700 dark:bg-power-500 dark:hover:bg-power-600 text-white text-lg font-bold rounded-xl shadow-xl shadow-power-500/20 transition-all transform hover:-translate-y-1 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Browse Content
              </button>
              
              <button 
                onClick={() => navigate(user ? '/home' : '/login')}
                className={`px-8 py-4 text-lg font-bold rounded-xl border transition-all flex items-center gap-2 w-full sm:w-auto justify-center group ${
                  user 
                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-600/20 dark:text-white dark:border-green-500/50 dark:hover:bg-green-600/30' 
                    : 'bg-white text-slate-800 border-gray-200 hover:bg-gray-50 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:border-white/10'
                }`}
              >
                {user ? (
                  <>
                    Open Dashboard
                    <LayoutGrid size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-gray-200 dark:border-white/5 pt-8">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-800 dark:text-white font-bold mb-1">
                  <Shield className="text-power-600 dark:text-power-500" size={18} /> Safe
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500">Verified Content</p>
              </div>
              <div className="text-center lg:text-left">
                 <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-800 dark:text-white font-bold mb-1">
                  <Smartphone className="text-power-600 dark:text-power-500" size={18} /> Apps
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500">Latest Versions</p>
              </div>
              <div className="text-center lg:text-left">
                 <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-800 dark:text-white font-bold mb-1">
                  <Globe className="text-power-600 dark:text-power-500" size={18} /> Fast
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500">Direct Links</p>
              </div>
            </div>
          </div>

          {/* Hero Visual/Card */}
          <div className="flex-1 w-full max-w-md lg:max-w-full relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-power-400 to-indigo-400 dark:from-power-500 dark:to-power-accent rounded-3xl blur-2xl opacity-30 transform rotate-6"></div>
             <div className="relative bg-white dark:bg-power-dark border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden group transition-colors duration-300">
                {/* Abstract UI Elements */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="h-2 w-20 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="h-32 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 w-full animate-pulse"></div>
                  <div className="h-4 rounded bg-gray-100 dark:bg-white/10 w-3/4"></div>
                  <div className="h-4 rounded bg-gray-100 dark:bg-white/10 w-1/2"></div>
                </div>

                <button 
                  onClick={() => navigate(user ? '/home' : '/login')}
                  className="w-full py-3 bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Zap size={18} className="text-power-600 dark:text-power-500" />
                  {user ? 'Access Content' : 'Join Power Modz'}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
