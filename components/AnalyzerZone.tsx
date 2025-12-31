
import React, { useState } from 'react';
import { FileItem, AnalysisResult } from '../types';

interface AnalyzerZoneProps {
  onFileDrop: (file: FileItem) => void;
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  currentFile: FileItem | null;
}

const AnalyzerZone: React.FC<AnalyzerZoneProps> = ({ onFileDrop, isAnalyzing, result, currentFile }) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const data = e.dataTransfer.getData('application/json');
    if (data) {
      try {
        const file = JSON.parse(data) as FileItem;
        onFileDrop(file);
      } catch (err) {
        console.error("Failed to parse dropped file", err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'conflict': return 'text-red-400 border-red-500/30 bg-red-500/5';
      case 'warning': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5';
      case 'success': return 'text-lime-400 border-lime-500/30 bg-lime-500/5';
      default: return 'text-zinc-400 border-zinc-500/30 bg-zinc-500/5';
    }
  };

  return (
    <div className="flex-grow p-8 flex flex-col h-full overflow-hidden bg-black">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-grow border-2 border-dashed rounded-3xl transition-all flex flex-col relative overflow-hidden ${
          isOver ? 'drag-over border-lime-400' : 'border-white/5 bg-zinc-900/5'
        }`}
      >
        {!currentFile && !isAnalyzing ? (
          <div className="flex-grow flex flex-col items-center justify-center p-12">
            <h2 className="text-2xl font-bold text-white mb-12 tracking-tight">Select Intelligence Source</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
              {/* Document Icon */}
              <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center group hover:border-lime-500/40 transition-all cursor-default">
                <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/5 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Documents</h3>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded">PDF</span>
                  <span className="text-[10px] font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded">DOCX</span>
                  <span className="text-[10px] font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded">TXT</span>
                </div>
              </div>

              {/* Audio Icon */}
              <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center group hover:border-lime-500/40 transition-all cursor-default">
                <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/5 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Audio</h3>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded">MP3</span>
                  <span className="text-[10px] font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded">WAV</span>
                  <span className="text-[10px] font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded">PCM</span>
                </div>
              </div>

              {/* Video Icon */}
              <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center group hover:border-lime-500/40 transition-all cursor-default">
                <div className="w-20 h-20 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/5 group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-lime-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">Video</h3>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded">MP4</span>
                  <span className="text-[10px] font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded">MOV</span>
                  <span className="text-[10px] font-bold text-zinc-600 bg-white/5 px-2 py-0.5 rounded">AVI</span>
                </div>
              </div>
            </div>
            <p className="mt-12 text-zinc-500 text-sm animate-pulse">Drag intelligence assets into this zone to initialize processing</p>
          </div>
        ) : isAnalyzing ? (
          <div className="flex-grow flex flex-col items-center justify-center p-12">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-lime-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-lime-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <svg className="w-8 h-8 text-lime-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Deep Scanning Protocol</h3>
            <p className="text-zinc-500 text-sm tracking-widest uppercase">Extracting truths from {currentFile?.name}...</p>
          </div>
        ) : result ? (
          <div className="flex-grow flex flex-col animate-in fade-in duration-500 h-full overflow-hidden">
             {/* Header Section */}
             <div className="p-8 pb-4 flex items-start justify-between">
                <div>
                  <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest mb-4 border ${getStatusColor(result.status)}`}>
                    {result.status}
                  </div>
                  <h2 className="text-4xl font-bold text-white tracking-tight">{result.title}</h2>
                  <p className="text-zinc-500 mt-2 text-sm">{currentFile?.name} • Source: <span className="text-lime-400 font-bold uppercase">{currentFile?.source}</span></p>
                </div>
                <button 
                  onClick={() => onFileDrop(null as any)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-all shadow-lg"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
             </div>

             {/* Bottom Result Box */}
             <div className="mt-auto p-4 px-8 pb-8">
               <div className="glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[50vh]">
                 <div className="h-12 bg-zinc-900/80 px-6 flex items-center border-b border-white/5">
                   <div className="w-2 h-2 rounded-full bg-lime-500 mr-3 animate-pulse"></div>
                   <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Intelligence Report Output</h3>
                 </div>
                 
                 <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
                    <section>
                      <h4 className="text-[10px] font-bold text-lime-400 uppercase tracking-[0.2em] mb-3">Executive Intelligence</h4>
                      <p className="text-zinc-300 leading-relaxed text-sm bg-white/5 p-4 rounded-2xl border border-white/5">
                        {result.summary}
                      </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <section>
                        <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] mb-4">Critical Vulnerabilities</h4>
                        <ul className="space-y-3">
                          {result.risks.map((risk, i) => (
                            <li key={i} className="flex items-start space-x-3 text-sm text-zinc-400">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </section>

                      <section>
                        <h4 className="text-[10px] font-bold text-lime-400 uppercase tracking-[0.2em] mb-4">Tactical Countermeasures</h4>
                        <div className="space-y-3">
                          {result.recommendations.map((rec, i) => (
                            <div key={i} className="flex items-center space-x-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                               <div className="w-1.5 h-1.5 rounded-full bg-lime-500"></div>
                               <span className="text-sm text-zinc-300">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                 </div>
               </div>
             </div>
          </div>
        ) : null}

        {/* Grid Ambience Overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>
    </div>
  );
};

export default AnalyzerZone;
