import React, { forwardRef } from 'react';
import { CertificateData } from '../types';
import { Trophy, ShieldCheck, Terminal } from 'lucide-react';

interface Props {
  data: CertificateData;
}

export const CertificateTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  return (
    <div 
      ref={ref}
      className="relative w-[1123px] h-[794px] bg-black overflow-hidden flex flex-col text-white shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #050505 0%, #2a0a0a 50%, #000000 100%)'
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ff003c 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-700 rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      {/* Border Frame */}
      <div className="absolute inset-8 border-2 border-red-500/30 rounded-lg pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-500"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-500"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-500"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-16 px-20 flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <ShieldCheck className="w-16 h-16 text-red-500" />
          <div className="flex flex-col">
            <h2 className="font-cyber text-3xl font-bold tracking-widest text-red-500 uppercase">TenaNet-CTF</h2>
            <span className="font-tech text-xl tracking-widest text-gray-400">CYBERSECURITY OPERATIONS</span>
          </div>
        </div>
        <div className="text-right">
           <div className="font-mono text-xs text-red-400 opacity-70">CERTIFICATE_ID: {data.id.split('-')[0].toUpperCase()}</div>
           <div className="font-mono text-xs text-red-400 opacity-70">DATE: {new Date(data.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-grow flex flex-col justify-center items-center text-center space-y-6 -mt-8">
        <h1 className="font-cyber text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 uppercase tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Certificate of Completion
        </h1>
        
        <p className="font-tech text-2xl text-gray-300 max-w-2xl">
          This certifies that the operator known as
        </p>

        <div className="py-4 px-12 bg-black/40 border border-red-900/50 rounded-lg backdrop-blur-sm">
          <span className="font-cyber text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            {data.name}
          </span>
        </div>

        <p className="font-tech text-xl text-gray-400 max-w-3xl leading-relaxed">
          Has successfully demonstrated exceptional skill in network penetration, 
          cryptographic analysis, and system exploitation within the TenaNet-CTF environment.
          Their skills have been verified by the Red Team Command.
        </p>
      </div>

      {/* Footer / Signature */}
      <div className="relative z-10 pb-20 px-20 flex justify-between items-end">
        
        {/* Cute Mascot Left */}
        <div className="w-32 h-32 flex items-end opacity-90">
             {/* Using standard ASCII/Emoji as fallback for reliable rendering without external image deps, styled to look cool */}
             <div className="text-6xl filter drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] transform -scale-x-100">
                👩‍💻
             </div>
        </div>

        <div className="flex flex-col items-center">
            <div className="h-16 w-64 border-b-2 border-dashed border-red-600/50 flex items-end justify-center pb-2 mb-2">
                <span className="font-handwriting font-bold text-3xl text-white font-cyber tracking-tighter italic">ORYN</span>
            </div>
            <p className="font-cyber text-sm text-red-500 font-bold tracking-widest">ORYN - COMPANY CEO</p>
        </div>

        {/* Cute Mascot Right */}
        <div className="w-32 h-32 flex items-end justify-end opacity-90">
            <div className="text-6xl filter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                🕵️‍♂️
             </div>
        </div>
      </div>
    </div>
  );
});

CertificateTemplate.displayName = 'CertificateTemplate';
