
import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import { ContentItem, CONTENT_TYPES, ContentType, CATEGORIES, ProfileSettings } from '../types';
import { Plus, Trash2, Search, X, Link as LinkIcon, Image as ImageIcon, Edit2, Eye, EyeOff, BarChart2, Calendar, Download, User, Settings, AlertTriangle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'profile'>('content');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete Confirmation State
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, id: string | null}>({
    isOpen: false,
    id: null
  });

  // Content Form State
  const initialFormState = {
    title: '',
    description: '',
    type: 'App' as ContentType,
    category: 'Applications',
    thumbnailUrl: '',
    downloadUrl: '',
    size: '',
    version: '',
    isVisible: true
  };
  const [formData, setFormData] = useState(initialFormState);

  // Profile Settings Form State
  const [profileData, setProfileData] = useState<ProfileSettings>({
    displayName: '',
    bio: '',
    avatarUrl: '',
    coverUrl: '',
    tiktokUrl: '',
    email: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Stats Logic
  const todayStr = new Date().toISOString().split('T')[0];
  
  const stats = {
    totalItems: items.length,
    publicItems: items.filter(i => i.isVisible).length,
    privateItems: items.filter(i => !i.isVisible).length,
    totalViews: items.reduce((acc, curr) => acc + curr.views, 0),
    newItemsToday: items.filter(i => i.uploadDate.startsWith(todayStr)).length,
    downloadsToday: items.reduce((acc, curr) => {
      if (curr.lastDownloadDate === todayStr) {
        return acc + (curr.dayDownloads || 0);
      }
      return acc;
    }, 0)
  };

  // Connect to Real-time Firestore & Fetch Profile
  useEffect(() => {
    const unsubscribe = dataService.subscribeToContent((data) => {
      setItems(data);
    });

    const loadProfile = async () => {
      const settings = await dataService.getProfileSettings();
      if (settings) {
        setProfileData(settings);
      } else {
        // Init with defaults if empty
        setProfileData({
           displayName: "Power Modz",
           bio: "Main apps, files, videos, images aur digital content upload karta hoon.",
           avatarUrl: "https://ik.imagekit.io/nqouorsjov/Gemini_Generated_Image_qnct6qqnct6qqnct.png",
           coverUrl: "",
           tiktokUrl: "https://www.tiktok.com/@powerxtiktok",
           email: "powerxdeveloper@gmail.com"
        });
      }
    };
    loadProfile();

    return () => unsubscribe();
  }, []);

  const initiateDelete = (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (deleteModal.id) {
      try {
        await dataService.deleteItem(deleteModal.id);
        setDeleteModal({ isOpen: false, id: null });
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item.");
      }
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      type: item.type,
      category: item.category,
      thumbnailUrl: item.thumbnailUrl,
      downloadUrl: item.downloadUrl,
      size: item.size || '',
      version: item.version || '',
      isVisible: item.isVisible
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleSubmitContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const finalData = {
          ...formData,
          thumbnailUrl: formData.thumbnailUrl || `https://via.placeholder.com/400x300?text=${formData.title}`,
      };
      
      if (editingId) {
        await dataService.updateItem(editingId, finalData);
      } else {
        await dataService.addItem(finalData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving document: ", error);
      alert("Failed to save content.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await dataService.updateProfileSettings(profileData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const filteredItems = items.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-power-darker py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Manage Content & Settings</p>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'content' ? 'bg-power-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <BarChart2 size={16} /> Content
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-power-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <User size={16} /> Profile Settings
            </button>
          </div>
        </div>

        {activeTab === 'content' ? (
          <>
            <div className="flex justify-end mb-6">
              <button 
                onClick={() => {
                  setEditingId(null);
                  setFormData(initialFormState);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-power-500 hover:bg-power-600 text-white rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-power-500/20"
              >
                <Plus size={20} />
                Add New Content
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-gray-400 text-xs uppercase tracking-wide flex items-center gap-1.5 mb-1"><BarChart2 size={12}/> Total Items</span>
                  <p className="text-2xl font-bold text-white">{stats.totalItems}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-gray-400 text-xs uppercase tracking-wide flex items-center gap-1.5 mb-1"><Eye size={12}/> Public</span>
                  <p className="text-2xl font-bold text-white text-green-400">{stats.publicItems}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-gray-400 text-xs uppercase tracking-wide flex items-center gap-1.5 mb-1"><EyeOff size={12}/> Private</span>
                  <p className="text-2xl font-bold text-white text-red-400">{stats.privateItems}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-gray-400 text-xs uppercase tracking-wide flex items-center gap-1.5 mb-1"><Download size={12}/> Downloads Today</span>
                  <p className="text-2xl font-bold text-white text-power-500">{stats.downloadsToday}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-gray-400 text-xs uppercase tracking-wide flex items-center gap-1.5 mb-1"><Calendar size={12}/> New Today</span>
                  <p className="text-2xl font-bold text-white text-blue-400">{stats.newItemsToday}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <span className="text-gray-400 text-xs uppercase tracking-wide flex items-center gap-1.5 mb-1"><BarChart2 size={12}/> Total Views</span>
                  <p className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
              </div>
            </div>

            {/* Table */}
            <div className="bg-power-dark border border-white/10 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text"
                    placeholder="Search items..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-power-500"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-white/5 text-xs uppercase font-medium text-gray-300">
                    <tr>
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Views</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                          <img 
                            src={item.thumbnailUrl} 
                            alt="" 
                            className="w-8 h-8 rounded object-cover bg-gray-800"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32' }}
                          />
                          {item.title}
                        </td>
                        <td className="px-6 py-4">
                          {item.isVisible ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">
                              <Eye size={12} /> Public
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                              <EyeOff size={12} /> Private
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-white/10 text-xs">{item.type}</span></td>
                        <td className="px-6 py-4">{item.category}</td>
                        <td className="px-6 py-4">{item.views}</td>
                        <td className="px-6 py-4">{new Date(item.uploadDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEdit(item)} className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg"><Edit2 size={18} /></button>
                            <button onClick={() => initiateDelete(item.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto bg-power-dark border border-white/10 rounded-xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings size={20} /> Update Web Profile
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* Avatar Preview */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                   <img 
                      src={profileData.avatarUrl || "https://via.placeholder.com/150"} 
                      alt="Avatar Preview" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white/10"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150' }}
                   />
                   <div className="absolute bottom-0 right-0 bg-power-500 p-1.5 rounded-full border-2 border-power-dark">
                      <ImageIcon size={14} className="text-white" />
                   </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Display Name</label>
                <input 
                  name="displayName"
                  value={profileData.displayName}
                  onChange={handleProfileChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-power-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                <textarea 
                  name="bio"
                  rows={4}
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-power-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Avatar Image URL</label>
                <input 
                  name="avatarUrl"
                  value={profileData.avatarUrl}
                  onChange={handleProfileChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-power-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Cover Image URL (Optional)</label>
                <input 
                  name="coverUrl"
                  value={profileData.coverUrl}
                  onChange={handleProfileChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-power-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">TikTok URL</label>
                    <input 
                      name="tiktokUrl"
                      value={profileData.tiktokUrl}
                      onChange={handleProfileChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-power-500 focus:outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <input 
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-power-500 focus:outline-none"
                    />
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={profileLoading}
                className="w-full bg-power-500 hover:bg-power-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {profileLoading ? 'Updating Profile...' : 'Save Profile Settings'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-power-dark border border-white/10 rounded-2xl w-full max-w-sm p-6 text-center">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="text-red-500" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Content?</h3>
                <p className="text-gray-400 mb-6 text-sm">
                    Are you sure you want to delete this item? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setDeleteModal({ isOpen: false, id: null })}
                        className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmDelete}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Upload/Edit Modal for Content */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-power-dark border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Edit Content' : 'Add New Content'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitContent} className="p-6 space-y-4">
              
               <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/5">
                <div>
                  <label className="text-sm font-medium text-white block">Visibility</label>
                  <span className="text-xs text-gray-400">
                    {formData.isVisible ? 'Content will be visible to everyone.' : 'Content will be hidden from the website.'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="isVisible"
                    checked={formData.isVisible} 
                    onChange={handleInputChange} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-power-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input 
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-power-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                  <select 
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-power-500 focus:outline-none"
                  >
                    {CONTENT_TYPES.map(t => <option key={t} value={t} className="bg-power-dark">{t}</option>)}
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-power-500 focus:outline-none"
                  >
                    {CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c} className="bg-power-dark">{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea 
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-power-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Size (Optional)</label>
                  <input 
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-power-500 focus:outline-none"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Version (Optional)</label>
                  <input 
                    name="version"
                    value={formData.version}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-power-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Thumbnail URL</label>
                <input 
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-power-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Download/File URL</label>
                <input 
                  required
                  name="downloadUrl"
                  value={formData.downloadUrl}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-power-500 focus:outline-none"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-power-500 hover:bg-power-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : (editingId ? 'Update Content' : 'Save to Firestore')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
