import React, { useState, useEffect } from 'react';
import { BackendService } from '../services/mockBackend';
import { CertificateData } from '../types';
import { Trash2, Plus, RefreshCw, Eye, EyeOff, Shield } from 'lucide-react';

export const AdminDashboard = () => {
  const [certs, setCerts] = useState<CertificateData[]>([]);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const refreshList = async () => {
    const data = await BackendService.getAllCertificates();
    setCerts(data.reverse()); // Show newest first
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPassword) return;

    setLoading(true);
    await BackendService.addCertificate(newName, newPassword);
    setNewName('');
    setNewPassword('');
    setSuccess('Certificate issued successfully.');
    setTimeout(() => setSuccess(''), 3000);
    await refreshList();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to revoke this certificate?')) {
      await BackendService.deleteCertificate(id);
      refreshList();
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ADD CERTIFICATE PANEL */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-red-900/30 rounded-xl p-6 shadow-lg sticky top-24 transition-colors">
            <h2 className="font-cyber text-xl text-red-600 dark:text-red-500 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5" /> Issue Certificate
            </h2>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">CANDIDATE NAME</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-800 rounded p-2 text-gray-900 dark:text-white focus:border-red-500 outline-none transition-colors"
                  placeholder="e.g. Jane Hacker"
                />
              </div>
              
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">ASSIGN PASSWORD</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-800 rounded p-2 text-gray-900 dark:text-white focus:border-red-500 outline-none transition-colors"
                  placeholder="SecurePass123"
                />
              </div>

              {success && (
                <div className="p-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-mono border border-green-200 dark:border-green-900/50 rounded">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-800 hover:bg-red-700 text-white font-cyber font-bold py-2 rounded transition-all hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] flex justify-center items-center"
              >
                {loading ? 'PROCESSING...' : 'ISSUE CERTIFICATE'}
              </button>
            </form>
          </div>
        </div>

        {/* LIST PANEL */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-900 rounded-xl overflow-hidden shadow-lg transition-colors">
            <div className="p-6 border-b border-gray-200 dark:border-gray-900 flex justify-between items-center">
              <h2 className="font-cyber text-xl text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gray-500" /> Registry
              </h2>
              <button onClick={refreshList} className="text-gray-500 hover:text-red-600 dark:hover:text-white transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-black/50 text-xs font-mono text-gray-500">
                  <tr>
                    <th className="px-6 py-3">NAME</th>
                    <th className="px-6 py-3">ISSUED</th>
                    <th className="px-6 py-3">HASH STATUS</th>
                    <th className="px-6 py-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-900">
                  {certs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-600 font-mono text-sm">
                        No certificates issued.
                      </td>
                    </tr>
                  ) : (
                    certs.map((cert) => (
                      <tr key={cert.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white font-tech">{cert.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {new Date(cert.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-900 text-xs font-mono text-gray-500">
                            SECURE <Shield className="w-3 h-3" />
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(cert.id)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors p-2"
                            title="Revoke Certificate"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};