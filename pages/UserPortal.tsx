import React, { useState, useRef } from 'react';
import { BackendService } from '../services/mockBackend';
import { CertificateData } from '../types';
import { CertificateTemplate } from '../components/CertificateTemplate';
import { Search, Download, AlertCircle, Loader } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const UserPortal = () => {
  const [password, setPassword] = useState('');
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setCertificate(null);

    try {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 1000));
      
      const found = await BackendService.findCertificateByPassword(password);
      if (found) {
        setCertificate(found);
      } else {
        setError('Password incorrect. Please verify your credentials or contact support.');
      }
    } catch (err) {
      setError('System error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPNG = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true });
    const link = document.createElement('a');
    link.download = `TenaNet_Certificate_${certificate?.name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const downloadPDF = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    
    // A4 Landscape dimensions roughly
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`TenaNet_Certificate_${certificate?.name.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 flex flex-col items-center bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
      
      {!certificate ? (
        <div className="w-full max-w-md mt-10">
          <div className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-red-900/30 rounded-xl p-8 shadow-xl dark:shadow-[0_0_30px_rgba(255,0,0,0.05)] transition-colors">
            <h2 className="font-cyber text-2xl text-gray-900 dark:text-white mb-6 text-center border-b border-gray-200 dark:border-gray-800 pb-4">
              Certificate Access
            </h2>
            
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-red-600 dark:text-red-400 mb-2 uppercase">Certificate Password</label>
                <div className="relative">
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded focus:outline-none focus:border-red-500 transition-colors font-mono"
                    placeholder="Enter the password provided to you"
                  />
                  <Search className="absolute right-3 top-3 text-gray-400 dark:text-gray-500 w-5 h-5" />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 p-3 rounded flex items-center gap-3">
                  <AlertCircle className="text-red-600 dark:text-red-500 w-5 h-5 flex-shrink-0" />
                  <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-cyber font-bold py-3 rounded transition-all shadow-lg shadow-red-500/20 dark:shadow-red-900/20 disabled:opacity-50 flex justify-center items-center hover:shadow-[0_0_20px_rgba(255,0,60,0.4)] transform hover:scale-[1.02]"
              >
                {loading ? <Loader className="animate-spin w-5 h-5" /> : 'VIEW CERTIFICATE'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-6xl animate-in fade-in duration-700">
          
          <div className="flex gap-4 mb-8">
            <button onClick={downloadPNG} className="flex items-center gap-2 px-6 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded font-tech font-bold transition-all hover:shadow-[0_0_10px_rgba(100,100,100,0.2)]">
              <Download className="w-4 h-4" /> Download PNG (HD)
            </button>
            <button onClick={downloadPDF} className="flex items-center gap-2 px-6 py-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900 text-red-900 dark:text-white rounded font-tech font-bold transition-all hover:shadow-[0_0_10px_rgba(220,38,38,0.3)]">
              <Download className="w-4 h-4" /> Download PDF (A4)
            </button>
            <button onClick={() => setCertificate(null)} className="px-6 py-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              Close
            </button>
          </div>

          <div className="overflow-auto w-full flex justify-center p-4 border border-gray-300 dark:border-gray-900 rounded-lg bg-gray-100 dark:bg-[#080808]">
             {/* Render Certificate but scale it down with CSS transform for preview if needed, or just scroll */}
             <div className="scale-75 md:scale-100 origin-top shadow-2xl">
                <CertificateTemplate ref={certRef} data={certificate} />
             </div>
          </div>
        </div>
      )}
    </div>
  );
};