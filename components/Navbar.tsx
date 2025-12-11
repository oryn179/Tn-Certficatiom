import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, Lock, LogOut, Terminal, User as UserIcon, Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-hack-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-red-900/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Shield className="w-8 h-8 text-red-600 group-hover:text-red-500 transition-colors" />
              <div className="absolute inset-0 bg-red-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            </div>
            <span className="font-cyber font-bold text-xl tracking-wider text-gray-900 dark:text-white transition-colors">
              TenaNet<span className="text-red-500">-CTF</span>
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-white transition-colors hover:bg-gray-100 dark:hover:bg-white/5"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                <Link to="/profile" className="flex items-center space-x-3 group cursor-pointer">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-xs text-red-600 dark:text-red-400 font-mono group-hover:text-red-500 dark:group-hover:text-red-300 transition-colors">OPERATOR_ID</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">{user.name}</span>
                  </div>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Profile" className="w-8 h-8 rounded-full border border-red-500/50 group-hover:border-red-500 transition-colors" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-900/20 border border-red-500/50 flex items-center justify-center text-red-500">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </Link>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-800 mx-2 transition-colors"></div>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono animate-pulse">SYSTEM_LOCKED</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
