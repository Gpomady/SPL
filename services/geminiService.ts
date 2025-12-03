import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeLegalCase = async (caseDescription: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Você é um assistente jurídico sênior especializado no sistema legal brasileiro (SPL - Sistema de Previsão Legal).
      
      Analise o seguinte relato de caso:
      "${caseDescription}"

      Forneça uma resposta estruturada em Markdown com os seguintes pontos:
      1. **Resumo Jurídico**: Uma breve síntese técnica dos fatos.
      2. **Análise de Risco**: Avalie o risco (Baixo, Médio, Alto) e explique o porquê.
      3. **Probabilidade de Êxito**: Uma estimativa percentual baseada em jurisprudência comum para casos similares.
      4. **Estratégia Recomendada**: 3 a 5 passos práticos para o advogado.
      5. **Jurisprudência Relacionada**: Cite conceitos legais ou leis (CF, CC, CPC, CLT) aplicáveis.

      Mantenha o tom profissional, direto e analítico.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    return "Ocorreu um erro ao conectar com o servidor de IA. Por favor, tente novamente.";
  }
};
