
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Shield, Zap, Info, LogIn, LogOut, LayoutGrid, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onSearchOpen: () => void;
  isAuthenticated: boolean;
  user: any;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchOpen, isAuthenticated, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); // Use logout from context

  useEffect(() => {
    // Check local storage for theme preference
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Optional: Add a small delay or navigation to ensure UI cleans up
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinks = [
    { name: 'Browse', path: '/home', icon: <LayoutGrid size={18} /> },
    { name: 'Web Profile', path: '/profile', icon: <User size={18} /> },
    { name: 'About', path: '/about', icon: <Info size={18} /> },
    { name: 'Privacy', path: '/privacy', icon: <Shield size={18} /> },
  ];

  // Check for admin role
  const isAdmin = user?.role === 'admin' || (user?.username === 'powerxtream');

  if (isAdmin) {
    navLinks.push({ name: 'Admin Panel', path: '/admin', icon: <User size={18} /> });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-power-darker/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-power-500 to-power-accent rounded-xl flex items-center justify-center shadow-lg shadow-power-500/20 group-hover:shadow-power-500/40 transition-all duration-300">
              <Zap className="text-white" fill="white" size={24} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-gray-400">
              Power Modz
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive(link.path)
                    ? 'bg-gray-100 text-power-600 dark:bg-white/10 dark:text-white'
                    : 'text-gray-600 hover:text-power-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-gray-500 hover:text-power-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition-all mx-1"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={onSearchOpen}
              className="p-2.5 rounded-full bg-gray-100 text-gray-500 hover:text-power-600 hover:bg-power-500/10 dark:bg-white/5 dark:text-gray-400 dark:hover:text-white dark:hover:bg-power-500/20 hover:scale-105 transition-all duration-200 border border-transparent dark:border-white/5"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {!isAuthenticated ? (
              <Link
                to="/login"
                className={`ml-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive('/login')
                    ? 'bg-gray-100 text-power-600 dark:bg-white/10 dark:text-white'
                    : 'text-gray-600 hover:text-power-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5'
                }`}
              >
                <LogIn size={18} />
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-all duration-200 flex items-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"
            >
               {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
             <button
              onClick={onSearchOpen}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-power-darker border-b border-gray-200 dark:border-white/10 absolute w-full animate-in slide-in-from-top-2 duration-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 ${
                  isActive(link.path)
                    ? 'bg-power-50 text-power-600 dark:bg-power-500/20 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-black dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-gray-200 dark:border-white/5 my-2 pt-2">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3 ${
                    isActive('/login')
                      ? 'bg-power-50 text-power-600 dark:bg-power-500/20 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white'
                  }`}
                >
                  <LogIn size={18} />
                  Login
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 flex items-center gap-3"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
