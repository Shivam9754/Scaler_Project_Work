
import React, { useState, useCallback } from 'react';
import { AppConnection, AppSource, FileItem, AnalysisResult } from './types';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MiniWindow from './components/MiniWindow';
import AnalyzerZone from './components/AnalyzerZone';
import { fetchFiles } from './services/mockData';
import { analyzeFileContent } from './services/geminiService';

const INITIAL_CONNECTIONS: AppConnection[] = [
  { id: 'gmail', name: 'Gmail', connected: false, loading: false },
  { id: 'gdrive', name: 'Google Drive', connected: false, loading: false },
  { id: 'dropbox', name: 'Dropbox', connected: false, loading: false },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [connections, setConnections] = useState<AppConnection[]>(INITIAL_CONNECTIONS);
  const [activeBrowser, setActiveBrowser] = useState<{ source: AppSource; files: FileItem[]; loading: boolean } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);

  const handleLogin = (username: string) => {
    setUser(username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser('');
    setIsSidebarOpen(false);
    setConnections(INITIAL_CONNECTIONS);
    setActiveBrowser(null);
    setAnalysisResult(null);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleConnect = (id: AppSource) => {
    setConnections(prev => prev.map(conn => 
      conn.id === id ? { ...conn, loading: true } : conn
    ));

    // Simulate OAuth flow
    setTimeout(() => {
      setConnections(prev => prev.map(conn => 
        conn.id === id ? { ...conn, loading: false, connected: true } : conn
      ));
    }, 1200);
  };

  const handleBrowse = async (id: AppSource) => {
    setActiveBrowser({ source: id, files: [], loading: true });
    try {
      const files = await fetchFiles(id);
      setActiveBrowser({ source: id, files, loading: false });
    } catch (err) {
      console.error("Failed to fetch files", err);
      setActiveBrowser(null);
    }
  };

  const handleFileDrop = useCallback(async (file: FileItem) => {
    if (!file) {
      setAnalysisResult(null);
      setCurrentFile(null);
      return;
    }

    setCurrentFile(file);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const result = await analyzeFileContent(file.name, file.contentSnippet);
      setAnalysisResult(result);
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden selection:bg-lime-500/30">
      <Navbar onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          username={user}
          isOpen={isSidebarOpen}
          connections={connections} 
          onConnect={handleConnect} 
          onBrowse={handleBrowse} 
          onLogout={handleLogout}
        />
        
        <main className="flex-1 relative bg-black transition-all duration-300">
          <AnalyzerZone 
            onFileDrop={handleFileDrop} 
            isAnalyzing={isAnalyzing} 
            result={analysisResult}
            currentFile={currentFile}
          />

          {activeBrowser && (
            <MiniWindow 
              source={activeBrowser.source}
              files={activeBrowser.files}
              loading={activeBrowser.loading}
              onClose={() => setActiveBrowser(null)}
            />
          )}
        </main>
      </div>

      {/* Subtle Lime Ambience */}
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vh] bg-lime-500/5 blur-[120px] rounded-full -z-10"></div>
    </div>
  );
};

export default App;
