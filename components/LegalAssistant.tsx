import React, { useState } from 'react';
import { Button } from './Button';
import { 
  Sparkles, 
  Send, 
  Scale, 
  BookOpen, 
  Lightbulb, 
  FileText, 
  Shield, 
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  RefreshCw,
  MessageSquare,
  Zap,
  Brain,
  ArrowRight,
  Info
} from 'lucide-react';
import { analyzeLegalCase } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const EXAMPLE_PROMPTS = [
  {
    icon: Shield,
    title: "Licenciamento Ambiental",
    prompt: "Quais são os requisitos para renovação de Licença de Operação (LO) no estado do Amazonas?",
    category: "Meio Ambiente"
  },
  {
    icon: AlertTriangle,
    title: "Análise de Risco",
    prompt: "Analise os riscos legais de uma empresa que opera sem o AVCB atualizado.",
    category: "Segurança"
  },
  {
    icon: FileText,
    title: "Normas Trabalhistas",
    prompt: "Quais são as obrigações da NR-10 para empresas com instalações elétricas?",
    category: "Trabalhista"
  },
  {
    icon: Scale,
    title: "Compliance ESG",
    prompt: "Como implementar um programa de compliance ESG alinhado com a legislação brasileira?",
    category: "ESG"
  }
];

export const LegalAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalysis = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    const result = await analyzeLegalCase(input);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleExampleClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleCopy = () => {
    if (analysis) {
      navigator.clipboard.writeText(analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNewAnalysis = () => {
    setInput('');
    setAnalysis(null);
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Brain size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Assistente Jurídico IA</h1>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              Powered by Gemini 2.5 Flash
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={16} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-600">Sua Consulta</span>
              </div>
              
              <div className="flex-1 relative">
                <textarea
                  className="w-full h-full p-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none text-slate-700 text-sm leading-relaxed outline-none"
                  placeholder="Descreva o caso, situação jurídica ou dúvida sobre conformidade legal...

Exemplo: 'Quais são os requisitos legais para uma empresa do setor industrial operar na Zona Franca de Manaus?'"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isAnalyzing}
                ></textarea>
              </div>
            </div>
            
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full">
                    <BookOpen size={12}/> Jurisprudência
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full">
                    <Scale size={12}/> Análise de Risco
                  </span>
                  <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full">
                    <Shield size={12}/> Conformidade
                  </span>
                </div>
                <Button 
                  onClick={handleAnalysis} 
                  disabled={!input.trim() || isAnalyzing}
                  isLoading={isAnalyzing}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 px-6"
                >
                  {isAnalyzing ? 'Analisando...' : 'Processar Consulta'} 
                  {!isAnalyzing && <Send size={14} className="ml-2"/>}
                </Button>
              </div>
            </div>
          </div>

          {!analysis && !isAnalyzing && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={16} className="text-amber-500" />
                <span className="text-sm font-medium text-slate-600">Sugestões de Consulta</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EXAMPLE_PROMPTS.map((example, index) => {
                  const Icon = example.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(example.prompt)}
                      className="group text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                          <Icon size={16} className="text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">
                              {example.title}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                              {example.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{example.prompt}</p>
                        </div>
                        <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className={`flex-[1.2] transition-all duration-500 ${analysis || isAnalyzing ? 'opacity-100' : 'lg:opacity-60'}`}>
          {isAnalyzing ? (
            <div className="h-full bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-12">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center animate-pulse">
                  <Brain size={32} className="text-indigo-600" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-2">Processando Análise</h3>
              <p className="text-sm text-slate-500 text-center max-w-xs">
                A IA está analisando sua consulta e preparando um relatório detalhado...
              </p>
              <div className="mt-6 flex gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          ) : analysis ? (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 h-full overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Zap size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">Relatório de Análise</h3>
                    <span className="text-[10px] text-indigo-200">Gerado por SPL AI</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleCopy}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Copiar"
                  >
                    {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  </button>
                  <button 
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Baixar"
                  >
                    <Download size={16} />
                  </button>
                  <button 
                    onClick={handleNewAnalysis}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Nova Análise"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="prose prose-sm prose-slate prose-headings:text-slate-800 prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-slate-600 prose-strong:text-slate-700 prose-li:text-slate-600 max-w-none">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Info size={12} />
                    <span>Esta análise é gerada por IA e não substitui aconselhamento jurídico profissional.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 bg-gradient-to-br from-slate-50 to-white">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
                <Scale className="text-slate-300" size={36} />
              </div>
              <h3 className="text-xl font-semibold text-slate-600 mb-2">Aguardando Consulta</h3>
              <p className="text-sm text-slate-400 max-w-xs text-center leading-relaxed">
                Digite sua dúvida jurídica ou selecione uma das sugestões ao lado para começar a análise.
              </p>
              <div className="mt-8 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-500" /> Análise em segundos
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-500" /> Referências legais
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
