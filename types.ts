export interface User {
  email: string;
  name: string;
}

export interface CaseAnalysis {
  summary: string;
  riskLevel: 'Baixo' | 'Médio' | 'Alto';
  probability: number;
  recommendations: string[];
  rawAnalysis: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
