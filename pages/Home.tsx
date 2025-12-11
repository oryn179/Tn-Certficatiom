import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Award, Terminal } from 'lucide-react';
import { ADMIN_EMAILS } from '../types';

export const Home = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleGetCertificate = async () => {
    if (!user) {
      try {
        await login();
        navigate('/portal');
      } catch (e) {
        // user cancelled login
      }
    } else {
      navigate('/portal');
    }
  };

  const handleAdminAccess = async () => {
     if (!user) {
        try {
          await login();
          navigate('/admin/dashboard');
        } catch (e) {
          // ignore
        }
     } else {
       navigate('/admin/dashboard');
     }
  };

  // Check if current user is an admin
  const isAuthorizedAdmin = user && ADMIN_EMAILS.includes(user.email);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-red-600/5 dark:bg-red-600/10 rounded-full blur-[120px] top-[-200px] left-[-200px] animate-pulse-slow"></div>
        <div className="absolute w-[600px] h-[600px] bg-purple-900/5 dark:bg-purple-900/10 rounded-full blur-[100px] bottom-[-100px] right-[-100px] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20"></div>
      </div>

      <div className="z-10 text-center px-4 max-w-4xl">
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-full bg-white/50 dark:bg-red-950/30 border border-red-500/30 backdrop-blur-sm shadow-xl dark:shadow-none">
            <Terminal className="w-12 h-12 text-red-600 dark:text-red-500" />
          </div>
        </div>

        <h1 className="font-cyber text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:via-gray-200 dark:to-gray-500 drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,0,60,0.5)] transition-colors">
          TenaNet-CTF<br />
          <span className="text-3xl md:text-5xl text-red-600 dark:text-red-500">Digital Certification</span>
        </h1>

        <p className="font-tech text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto transition-colors">
          Secure your legacy. Verify your skills. Retrieve your authenticated certificate from the Red Team Command database.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={handleGetCertificate}
            className="group relative px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-cyber font-bold tracking-wider rounded transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.3)] dark:shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(255,0,60,0.6)]"
          >
            <span className="flex items-center gap-2 relative z-10">
              <Award className="w-5 h-5" />
              GET YOUR CERTIFICATE
            </span>
            <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>

          {/* Admin Button - Only visible if authorized admin or not logged in (to allow login) */}
          <button
            onClick={handleAdminAccess}
            className={`px-8 py-4 border border-gray-300 dark:border-red-900/50 bg-white dark:bg-transparent hover:border-red-500 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-white font-cyber font-bold tracking-wider rounded transition-all duration-300 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(255,0,0,0.3)] ${user && !isAuthorizedAdmin ? 'hidden' : 'block'}`}
          >
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              ADMIN ACCESS
            </span>
          </button>
        </div>
      </div>

      {/* Footer Decor */}
      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>
    </div>
  );
};
