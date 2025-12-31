
export type AppSource = 'gmail' | 'gdrive' | 'dropbox';

export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  source: AppSource;
  contentSnippet: string;
}

export interface AppConnection {
  id: AppSource;
  name: string;
  connected: boolean;
  loading: boolean;
}

export interface AnalysisResult {
  status: 'conflict' | 'success' | 'warning' | 'neutral';
  title: string;
  summary: string;
  risks: string[];
  recommendations: string[];
}
