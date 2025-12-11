import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldAlert, XCircle, ChevronRight, AlertTriangle } from 'lucide-react';
import { ADMIN_EMAILS } from '../types';

export const AdminLogin = () => {
  const { user, login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Small delay to prevent flicker if auth state restores quickly
      await new Promise(r => setTimeout(r, 100));
      setChecking(false);
      
      if (user) {
        if (isAdmin) {
          navigate('/admin/dashboard');
        } else {
          setError('Access Denied: You are not authorized to view this page.');
        }
      }
    };
    checkAuth();
  }, [user, isAdmin, navigate]);

  const handleLogin = async () => {
    setError('');
    try {
      await login(); 
      // The useEffect will handle redirection after user state updates
    } catch (e) {
      setError('Authentication failed or was cancelled.');
    }
  };

  if (checking) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-red-900/20 p-8 rounded-2xl shadow-xl dark:shadow-[0_0_50px_rgba(220,38,38,0.1)] text-center relative overflow-hidden group">
        
        {/* Animated Background Glow */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900 via-transparent to-transparent group-hover:opacity-20 transition-opacity duration-1000"></div>

        <div className="relative z-10">
          <div className="mx-auto bg-red-100 dark:bg-red-900/20 w-20 h-20 rounded-full flex items-center justify-center mb-6 border border-red-200 dark:border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <Lock className="w-10 h-10 text-red-600 dark:text-red-500" />
          </div>
          
          <h2 className="font-cyber text-3xl text-gray-900 dark:text-white mb-2 font-bold tracking-wide">RESTRICTED AREA</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-tech text-lg">Red Team Command Access Only</p>
          
          {error ? (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 rounded-lg animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex flex-col items-center gap-2">
                <AlertTriangle className="text-red-600 dark:text-red-500 w-8 h-8 mb-1" />
                <p className="text-red-800 dark:text-red-200 text-sm font-mono font-bold">{error}</p>
                
                {user && (
                  <div className="mt-2 text-xs bg-black/10 dark:bg-black/50 px-3 py-1 rounded font-mono text-gray-600 dark:text-gray-400">
                    User: {user.email}
                  </div>
                )}
                
                <button 
                  onClick={handleLogin}
                  className="mt-3 text-xs flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-black dark:hover:text-white transition-colors uppercase font-bold tracking-wider"
                >
                  <ChevronRight className="w-3 h-3" /> Try Different Account
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] flex justify-center items-center gap-3 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5 filter grayscale group-hover:grayscale-0 transition-all" />
              <span className="tracking-wide">AUTHENTICATE IDENTITY</span>
              <ShieldAlert className="w-5 h-5 ml-1 text-red-500 animate-pulse" />
            </button>
          )}

          <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800/50">
             <div className="flex justify-between text-[10px] text-gray-400 font-mono uppercase tracking-widest opacity-60">
               <span>Secure Connection</span>
               <span>TenaNet-v1.0.4</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
