
import React from 'react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  return (
    <nav className="h-16 glass px-6 flex items-center justify-between border-b border-white/5 z-[60]">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-lime-400 transition-all active:scale-95"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-lime-500 rounded flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.4)]">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Truth<span className="text-lime-400 font-normal">Seeker</span></h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden sm:block px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/20">
          <span className="text-[10px] font-bold text-lime-400 uppercase tracking-widest">Enterprise Mode</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
