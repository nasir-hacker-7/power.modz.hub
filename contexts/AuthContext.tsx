
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { User, AuthState } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  loginManual: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for manual admin session in localStorage on load
    const manualSession = localStorage.getItem('adminSession');
    if (manualSession === 'true') {
      setAuthState({
        isAuthenticated: true,
        user: { username: 'powerxtream', role: 'admin' },
      });
    }

    // Subscribe to Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // If manual admin is active, ignore firebase null updates (keep admin logged in)
      // If firebase user logs in, they override manual session (or coexist)
      
      const isManualAdmin = localStorage.getItem('adminSession') === 'true';

      if (firebaseUser) {
        // Check if user is the admin via email (optional security layer)
        const isAdmin = firebaseUser.email === 'powerxdeveloper@gmail.com' || isManualAdmin;
        
        setAuthState({
          isAuthenticated: true,
          user: {
            username: firebaseUser.displayName || firebaseUser.email || 'User',
            role: isAdmin ? 'admin' : 'user',
          },
        });
      } else if (isManualAdmin) {
        // Keep manual admin logged in even if firebase is null
        setAuthState({
            isAuthenticated: true,
            user: { username: 'powerxtream', role: 'admin' },
        });
      } else {
        // No firebase user, no manual admin
        setAuthState({ isAuthenticated: false, user: null });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginManual = () => {
    localStorage.setItem('adminSession', 'true');
    setAuthState({
      isAuthenticated: true,
      user: { username: 'powerxtream', role: 'admin' },
    });
  };

  const logout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
    } catch (e) {
      console.error("Firebase logout error", e);
    }
    localStorage.removeItem('adminSession'); // Clear manual session
    setAuthState({ isAuthenticated: false, user: null }); // Reset state
  };

  return (
    <AuthContext.Provider value={{ ...authState, loading, loginManual, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
