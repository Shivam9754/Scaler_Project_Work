
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (user: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin(username);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-lime-500/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md glass p-10 rounded-2xl border border-white/10 shadow-2xl z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-lime-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(163,230,53,0.3)]">
            <svg className="w-10 h-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Truth<span className="text-lime-400 font-normal">Seeker</span></h1>
          <p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest font-medium">Deal Intelligence Protocol</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Terminal ID</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-900 border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-lime-500/50 transition-all placeholder:text-zinc-700"
              placeholder="Username"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Access Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-lime-500/50 transition-all placeholder:text-zinc-700"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(163,230,53,0.2)] hover:shadow-[0_0_30px_rgba(163,230,53,0.4)] disabled:opacity-50"
          >
            {loading ? 'Initializing...' : 'Authorize Access'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
