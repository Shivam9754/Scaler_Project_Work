
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="h-16 glass px-6 flex items-center justify-between border-b border-white/10 z-[60] bg-black/50">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-1">
          <h1 className="text-2xl font-bold tracking-tighter text-white">WorkLens<span className="text-lime-500">.</span></h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
           <div className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse"></div>
           <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Protocol Active</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
