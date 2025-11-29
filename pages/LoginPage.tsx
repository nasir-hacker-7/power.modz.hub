
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, Zap, Mail, ArrowRight, Loader } from 'lucide-react';
import { auth } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Only for signup
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginManual } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/home';

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      // The AuthContext listener in App.tsx will handle the state update and redirect
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in cancelled.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(`Domain (${window.location.hostname}) unauthorized. Add it to Firebase Console > Auth > Settings.`);
      } else {
        setError(err.message || "Google Sign-in failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Legacy Admin Bypass
      if (email === 'powerxtream' && password === 'powerxtream') {
         loginManual(); // Use context to set manual login state
         navigate('/admin');
         return;
      }

      if (isLogin) {
        // Sign In
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: username
        });
      }
      
      // Navigate is handled by the useEffect in the component or AuthProvider usually, 
      // but explicit navigation here is safe after await
      navigate(from, { replace: true });
      
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Email is already registered.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("Sign-in method not enabled in Firebase Console.");
      } else {
        setError(err.message || "Authentication failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-power-darker py-20 transition-colors duration-300">
      <div className="bg-white dark:bg-power-dark border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden transition-colors duration-300">
        
        {/* Background Decorative */}
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-power-200 dark:bg-power-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-indigo-200 dark:bg-power-accent/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-power-500 to-power-600 mb-4 shadow-lg shadow-power-500/20">
              <Zap size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {isLogin ? 'Sign in to access your dashboard' : 'Join Power Modz today for free'}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl mb-6 border border-gray-200 dark:border-white/5">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                isLogin ? 'bg-white text-slate-900 shadow dark:bg-power-500 dark:text-white dark:shadow-lg' : 'text-gray-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                !isLogin ? 'bg-white text-slate-900 shadow dark:bg-power-500 dark:text-white dark:shadow-lg' : 'text-gray-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 p-3 rounded-lg text-sm text-center flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400"></span>
                {error}
              </div>
            )}
            
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-power-600 dark:group-focus-within:text-power-500 transition-colors" size={18} />
                  <input 
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 text-slate-900 focus:border-power-500 focus:outline-none transition-all focus:bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:bg-white/10"
                    placeholder="Choose a username"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">Email or Admin ID</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-power-600 dark:group-focus-within:text-power-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 text-slate-900 focus:border-power-500 focus:outline-none transition-all focus:bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:bg-white/10"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-power-600 dark:group-focus-within:text-power-500 transition-colors" size={18} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 text-slate-900 focus:border-power-500 focus:outline-none transition-all focus:bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:bg-white/10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-power-600 to-power-700 hover:from-power-500 hover:to-power-600 dark:from-power-500 dark:to-power-600 dark:hover:from-power-400 dark:hover:to-power-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-power-500/25 transition-all transform hover:-translate-y-0.5 mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && !error ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Google Login Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-power-dark text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Google Login Button */}
          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-white font-semibold py-3.5 rounded-xl border border-gray-200 dark:border-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
             <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
             Google
          </button>
          
          <div className="mt-8 text-center">
             <p className="text-xs text-gray-500">
               By continuing, you agree to Power Modz's <span className="text-power-600 dark:text-power-500 cursor-pointer hover:underline">Terms</span> and <span className="text-power-600 dark:text-power-500 cursor-pointer hover:underline">Privacy Policy</span>.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
