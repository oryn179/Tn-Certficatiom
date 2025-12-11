import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BackendService } from '../services/mockBackend';
import { CertificateData } from '../types';
import { User, LogOut, Shield, Award, Edit3, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myCerts, setMyCerts] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      if (user?.name) {
        setLoading(true);
        // Simulate network
        await new Promise(r => setTimeout(r, 600));
        const certs = await BackendService.findCertificatesByName(user.name);
        setMyCerts(certs);
        setLoading(false);
      }
    };
    fetchCerts();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-[#050505] text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-red-900/30 rounded-2xl p-8 shadow-lg dark:shadow-[0_0_40px_rgba(220,38,38,0.1)] relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-gray-100 dark:border-red-900/50 overflow-hidden shadow-2xl transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                <img 
                  src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=111&color=ef4444`} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-[#0a0a0a]" title="Online"></div>
            </div>

            <div className="flex-grow text-center md:text-left space-y-2">
              <h1 className="font-cyber text-3xl font-bold text-gray-900 dark:text-white tracking-wide">{user.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 dark:text-gray-400 font-mono text-sm">
                <Shield className="w-4 h-4 text-red-600 dark:text-red-500" />
                <span>OPERATOR_ID: {user.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 font-mono text-xs pt-2">
                <span className="bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400">
                  LEVEL 1 OPERATIVE
                </span>
                <span className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded border border-gray-200 dark:border-gray-800">
                  JOINED: 2024
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[140px]">
               <button 
                 onClick={() => alert("Profile update feature coming in v2.0")}
                 className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm font-bold transition-all duration-300 hover:shadow-[0_0_10px_rgba(100,100,100,0.2)] dark:hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
               >
                 <Edit3 className="w-4 h-4" /> Edit Profile
               </button>
               <button 
                 onClick={handleLogout}
                 className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded text-sm font-bold transition-all duration-300 group hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
               >
                 <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Logout
               </button>
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div>
          <h2 className="font-cyber text-2xl text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <Award className="w-6 h-6 text-red-600 dark:text-red-500" /> Achievements
          </h2>

          {loading ? (
            <div className="h-40 flex items-center justify-center text-red-500 animate-pulse font-mono bg-white dark:bg-[#0a0a0a] rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
              SCANNING_DATABASE...
            </div>
          ) : myCerts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myCerts.map((cert) => (
                <div key={cert.id} className="bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-gray-800 hover:border-red-500/50 rounded-xl p-6 transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.1)] group cursor-default">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <Shield className="w-6 h-6 text-red-600 dark:text-red-500" />
                    </div>
                    <span className="text-xs font-mono text-gray-500 border border-gray-200 dark:border-gray-800 rounded px-2 py-1">
                      VERIFIED
                    </span>
                  </div>
                  
                  <h3 className="font-cyber text-lg text-gray-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    TenaNet CTF Completion
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 font-mono">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      Issued: {new Date(cert.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-600 truncate">
                      ID: {cert.id}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-900 flex justify-between items-center">
                    <span className="text-xs text-gray-500">ISSUED BY: {cert.issuedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-[#0a0a0a] border border-dashed border-gray-300 dark:border-gray-800 rounded-xl transition-colors">
              <Award className="w-12 h-12 text-gray-400 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-tech text-lg">No certificates found under the name "{user.name}".</p>
              <p className="text-gray-500 dark:text-gray-600 text-sm mt-2">Visit the Certificate Portal to verify using your password.</p>
              <button 
                onClick={() => navigate('/portal')}
                className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded font-cyber transition-all duration-300 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]"
              >
                GO TO PORTAL
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};