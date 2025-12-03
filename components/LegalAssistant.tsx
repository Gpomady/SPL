import React, { useState } from 'react';
import { Button } from './Button';
import { Sparkles, Send, Scale, BookOpen } from 'lucide-react';
import { analyzeLegalCase } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

export const LegalAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleAnalysis = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeLegalCase(input);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Input Section */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Assistente Jurídico IA</h2>
              <p className="text-xs text-slate-500">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>

          <div className="flex-1 relative">
            <textarea
              className="w-full h-full p-4 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-slate-700 text-sm leading-relaxed outline-none"
              placeholder="Descreva o caso, incidente ou normativa para análise de risco e conformidade..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1"><BookOpen size={12}/> Jurisprudência</span>
                <span className="flex items-center gap-1"><Scale size={12}/> Análise de Risco</span>
            </div>
            <Button 
              onClick={handleAnalysis} 
              disabled={!input.trim() || isAnalyzing}
              isLoading={isAnalyzing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
            >
              {isAnalyzing ? 'Analisando...' : 'Processar Consulta'} <Send size={14} className="ml-2"/>
            </Button>
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className={`flex-[1.2] transition-all duration-500 ${analysis ? 'opacity-100 translate-x-0' : 'opacity-50 translate-x-4 lg:opacity-100 lg:translate-x-0'}`}>
         {analysis ? (
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 h-full overflow-hidden flex flex-col animate-fade-in">
               <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between shrink-0">
                  <h3 className="text-white font-semibold text-sm tracking-wide">Relatório de Inteligência</h3>
                  <span className="text-[10px] bg-white/20 text-white px-2 py-1 rounded">SPL • AI</span>
               </div>
               <div className="p-8 overflow-y-auto custom-scrollbar prose prose-sm prose-slate prose-indigo max-w-none">
                  <ReactMarkdown>{analysis}</ReactMarkdown>
               </div>
            </div>
         ) : (
            <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-12 text-center bg-slate-50/50">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                    <Scale className="text-slate-300" size={32} />
                </div>
                <h3 className="text-slate-600 font-medium mb-2">Aguardando Solicitação</h3>
                <p className="text-sm text-slate-400 max-w-xs">Utilize o campo ao lado para submeter consultas à inteligência artificial do sistema.</p>
            </div>
         )}
      </div>
    </div>
  );
};