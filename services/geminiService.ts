
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFileContent = async (fileName: string, content: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this deal document fragment for risks, conflicts, or important clauses. 
    File Name: ${fileName}
    Content: ${content}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { 
            type: Type.STRING, 
            description: "The risk status of the document: conflict, success, warning, or neutral" 
          },
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          risks: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          recommendations: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
        },
        required: ["status", "title", "summary", "risks", "recommendations"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as AnalysisResult;
  } catch (e) {
    return {
      status: 'neutral',
      title: 'Analysis Unavailable',
      summary: 'The system could not parse the intelligence report.',
      risks: ['Unknown processing error'],
      recommendations: ['Try analyzing the file again.']
    };
  }
};
