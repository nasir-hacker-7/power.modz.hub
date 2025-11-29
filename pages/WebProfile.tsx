
import React, { useEffect, useState } from 'react';
import { User, Globe, Mail, Shield, CheckCircle, Loader } from 'lucide-react';
import { dataService } from '../services/dataService';
import { ProfileSettings } from '../types';

// The specific image URL requested
const DEFAULT_AVATAR = "https://ik.imagekit.io/nqouorsjov/Gemini_Generated_Image_qnct6qqnct6qqnct.png";
const DEFAULT_COVER = "https://www.transparenttextures.com/patterns/carbon-fibre.png";

export const WebProfile: React.FC = () => {
  const [settings, setSettings] = useState<ProfileSettings>({
    displayName: "Power Modz",
    bio: "Main apps, files, videos, images aur digital content upload karta hoon. Power Modz fast aur safe downloads provide karta hai. We are dedicated to providing the highest quality mods and utility software.",
    avatarUrl: DEFAULT_AVATAR,
    coverUrl: "",
    tiktokUrl: "https://www.tiktok.com/@powerxtiktok",
    email: "powerxdeveloper@gmail.com"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await dataService.getProfileSettings();
      if (data) {
        setSettings(prev => ({
          ...prev,
          ...data,
          // If the DB has an empty avatar string for some reason, fallback to default
          avatarUrl: data.avatarUrl || DEFAULT_AVATAR
        }));
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleFollow = () => {
    if (settings.tiktokUrl) {
      window.open(settings.tiktokUrl, '_blank');
    }
  };

  const handleMail = () => {
    if (settings.email) {
      window.location.href = `mailto:${settings.email}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-power-darker">
        <Loader className="animate-spin text-power-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-gray-50 dark:bg-power-darker transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-power-dark border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl transition-colors duration-300">
          
          {/* Cover */}
          <div className="h-48 bg-gradient-to-r from-power-500 to-power-600 dark:from-power-900 dark:to-power-darker relative overflow-hidden">
            {settings.coverUrl ? (
              <img src={settings.coverUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
            )}
          </div>

          <div className="px-8 pb-10 relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-8 p-1.5 bg-white dark:bg-power-dark rounded-2xl transition-colors duration-300 shadow-md">
              <img 
                src={settings.avatarUrl} 
                alt="Profile" 
                className="w-32 h-32 rounded-xl object-cover bg-gray-200 dark:bg-gray-800"
                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR }}
              />
            </div>

            <div className="pt-20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    {settings.displayName} <CheckCircle size={24} className="text-power-500" fill="currentColor" stroke="white" />
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">@powerxtream • Admin</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleFollow}
                    className="px-6 py-2 bg-black hover:bg-gray-800 dark:bg-power-500 dark:hover:bg-power-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-black/20 dark:shadow-power-500/20"
                  >
                    Follow on TikTok
                  </button>
                  <button 
                    onClick={handleMail}
                    className="p-2 border border-gray-200 dark:border-white/10 rounded-lg text-gray-500 hover:text-black hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
                    title="Send Email"
                  >
                    <Mail size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-200 dark:border-white/5 transition-colors duration-300">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">About</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {settings.bio}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-200 dark:border-white/5 transition-colors duration-300">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <Globe size={18} className="text-power-500" />
                      Website Stats
                    </h3>
                    <ul className="space-y-3 text-gray-500 dark:text-gray-400">
                      <li className="flex justify-between">
                        <span>Total Uploads</span>
                        <span className="text-slate-900 dark:text-white font-medium">1,204</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Total Downloads</span>
                        <span className="text-slate-900 dark:text-white font-medium">85.2K</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Active Since</span>
                        <span className="text-slate-900 dark:text-white font-medium">2023</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-gray-200 dark:border-white/5 transition-colors duration-300">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                      <Shield size={18} className="text-power-500" />
                      Safety Guarantee
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All content on Power Modz is verified for safety. We ensure no malware or harmful scripts are included in our downloads.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
