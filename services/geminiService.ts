
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize the API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Retry Helper
async function retryOperation<T>(operation: () => Promise<T>, retries = 2, delay = 2000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (retries <= 0) throw error;
    
    // Check if it's an XHR error, Fetch error, or 503 Service Unavailable
    const isNetworkError = error.message?.includes('xhr error') || 
                           error.message?.includes('fetch failed') || 
                           error.message?.includes('Rpc failed') || 
                           error.status === 503;
    
    if (isNetworkError) {
      console.warn(`[WorkLens] Network hiccup detected. Retrying intelligence link... Attempts left: ${retries}`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryOperation(operation, retries - 1, delay * 2); // Exponential backoff
    }
    
    throw error;
  }
}

/**
 * Perform a deep intelligence scan on the provided file using the WorkLens persona.
 */
export const analyzeFileContent = async (
  fileName: string, 
  contentSnippet: string, 
  type: string,
  base64Data?: string,
  mimeType?: string
): Promise<AnalysisResult> => {
  
  const isMedia = type.includes('audio') || type.includes('video') || type.includes('mp4') || type.includes('mp3');
  
  // Use Gemini 3 Pro for deep reasoning.
  const modelName = isMedia 
    ? 'gemini-2.5-flash-native-audio-preview-09-2025' 
    : 'gemini-3-pro-preview';

  const parts: any[] = [];

  // If we have real file data (dragged from desktop), send it inline.
  // NOTE: Browser XHR limits usually around 20MB. Larger files handled via contentSnippet/Backend.
  if (base64Data && mimeType) {
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: base64Data
      }
    });
  }

  // WorkLens Universal Analysis Prompt
  const prompt = `
    You are WorkLens, an elite Universal Analyst. 
    Target File: "${fileName}"
    ${!base64Data ? `Context Preview (Full analysis pending on backend): "${contentSnippet}"` : ''}

    **YOUR MISSION:** 
    1. **DETECT** the domain immediately (Is this a Legal Contract? Engineering Spec? Investment Deck? Fiction Manuscript? Academic Paper?).
    2. **ADOPT** the persona of the harshest, most expensive consultant in that field.
    3. **CRITIQUE** the content. Do not just summarize. Tear it apart. Find the holes.

    **STRICT OUTPUT FORMAT (Markdown):**
    Render your response in clean Markdown. Follow this structure exactly, adapting the bracketed terms to the detected domain:

    # 1. The Verdict (Big Picture)
    *   **Document Type:** [e.g., Series A Term Sheet / MRI Report / Screenplay]
    *   **Intended Audience:** [Who is this for?]
    *   **Quality Score:** [Rate 1-10 based on clarity and completeness]
    *   **Bottom Line:** [One brutal sentence summary. e.g., "Standard agreement, but Clause 4 is a trap." or "Great plot concept, but dialogue is weak."]

    ---

    # 2. Deep Dive Analysis (Section by Section)
    (Identify the top 3 critical themes/clauses/chapters and analyze them with high intensity:)

    ## 🔍 [Theme/Section Name]
    **✅ The Strong Points:**
    *   [What is accurate, well-written, or advantageous?]
    *   [Specific quote or data point that is solid]

    **⚠️ The Gaps & Weaknesses (CRITICAL):**
    *   [What is missing? What is vague?]
    *   [Where is the logic flawed?]
    *   [Legal/Business/Logic Risk: e.g., "No indemnity clause found" or "ROI calculation ignores inflation"]

    **💡 The "Pro" Insight:**
    *   [The secret sauce. A strategic tip, a negotiation counter-move, or an exam tip depending on context.]

    ---
    (Repeat for 2-3 more key sections)

    ---

    # 3. Final Action Plan
    *   **Immediate Action:** [The very next thing the user must do]
    *   **Hidden Risk:** [The biggest "Gotcha" in the file]
  `;
  parts.push({ text: prompt });

  const config: any = {};

  // Enable Thinking Config for Gemini 3 Pro (Text/Docs) to allow for deep reasoning.
  if (!isMedia) {
    config.thinkingConfig = { thinkingBudget: 2048 }; 
  }

  try {
    const response = await retryOperation(async () => {
      return await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: config
      });
    });

    return { markdown: response.text || "Analysis failed to generate output." };

  } catch (e: any) {
    console.error("Gemini Analysis Error:", e);
    
    // Provide a user-friendly error if it's explicitly the RPC/XHR error
    if (e.message?.includes('Rpc failed') || e.message?.includes('xhr error')) {
      return {
        markdown: `# Connection Limit Reached\n\nThe file is too large for the browser's live intelligence link (RPC Error).\n\n**Action Required:**\n* The file has been queued for backend analysis (Deep Search). \n* Try dragging a smaller snippet or wait for the backend indexer to finish.`
      };
    }

    return {
      markdown: `# Analysis Error\nThe intelligence engine encountered an unexpected error while processing ${fileName}.\n\nError details: ${String(e)}`
    };
  }
};

/**
 * Handles the GPT-style chat interaction for a specific file context.
 */
export const queryFileIntelligence = async (query: string, fileContext: string): Promise<string> => {
  try {
    const response = await retryOperation(async () => {
      return await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
          System: You are WorkLens, a ruthless and precise Deal Intelligence Analyst.
          Document Context: ${fileContext}
          User Query: ${query}
          
          Response Protocol: Be concise. Focus on financial impact and legal risk. Use bullet points if listing items.
        `,
      });
    });
    return response.text || "I was unable to retrieve a specific answer from the intelligence pool.";
  } catch (error) {
    console.error("Chat Query Error", error);
    return "Connection to intelligence core failed. Please retry.";
  }
};
