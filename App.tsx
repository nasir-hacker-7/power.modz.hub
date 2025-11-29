
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { WelcomePage } from './pages/WelcomePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { WebProfile } from './pages/WebProfile';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { DownloadPage } from './pages/DownloadPage';
import { SearchOverlay } from './components/SearchOverlay';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route for Admin
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Internal Layout component to access AuthContext & Router Context
const AppLayout: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Force Welcome Page on Initial Load
  useEffect(() => {
    // If the user lands on any page other than root '/', redirect them to '/'
    // This ensures the "Welcome Page" is always the entry point.
    if (location.pathname !== '/') {
      navigate('/');
    }
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, []); // Empty dependency array means this runs only once on mount

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-power-darker flex items-center justify-center text-power-500">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-power-darker text-slate-900 dark:text-gray-100 font-sans selection:bg-power-500 selection:text-white transition-colors duration-300">
      <Navbar 
        onSearchOpen={() => setIsSearchOpen(true)} 
        isAuthenticated={isAuthenticated} 
        user={user} 
      />
      
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<WebProfile />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* View/Download Page */}
          <Route path="/view/:id" element={<DownloadPage />} />
          
          {/* Login Route: Redirects to home if already authenticated */}
          <Route 
            path="/login" 
            element={
              isAuthenticated 
                ? <Navigate to="/home" replace /> 
                : <LoginPage />
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          {/* Catch-all route: Redirect unknown paths to Welcome Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
};

export default App;
