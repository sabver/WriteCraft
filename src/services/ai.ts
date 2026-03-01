import { GoogleGenAI, Type } from "@google/genai";
import { ReviewIssue } from "@/lib/types";

// Initialize AI client lazily to avoid crashing if API key is missing
let aiClient: GoogleGenAI | null = null;

function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function getAIReview(
  source: string, 
  translation: string, 
  scene: string, 
  context: Record<string, string>
): Promise<ReviewIssue[]> {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        As an expert English teacher, review this translation.
        Scene: ${scene}
        Context: ${JSON.stringify(context)}
        Source Text: ${source}
        User Translation: ${translation}
        
        Provide a list of issues in JSON format. Each issue should have:
        - type: "grammar", "word-choice", or "structure"
        - title: short title
        - original: the specific part of the user's translation with the issue
        - revised: the corrected version
        - reason: clear explanation of why the change is needed
        - severity: "high", "medium", or "low"
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              title: { type: Type.STRING },
              original: { type: Type.STRING },
              revised: { type: Type.STRING },
              reason: { type: Type.STRING },
              severity: { type: Type.STRING },
            },
            required: ["id", "type", "title", "original", "revised", "reason", "severity"]
          }
        }
      }
    });

    const text = response.text?.trim();
    if (!text) return [];
    
    return JSON.parse(text);
  } catch (e) {
    console.error("AI Review Error:", e);
    throw new Error("Failed to get AI review. Please try again later.");
  }
}

export async function getAIReference(
  source: string, 
  scene: string, 
  context: Record<string, string>
): Promise<string> {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Provide a high-quality natural English translation for the following text.
        Scene: ${scene}
        Context: ${JSON.stringify(context)}
        Source Text: ${source}
        
        Return ONLY the translation.
      `,
    });
    return response.text?.trim() || "";
  } catch (e) {
    console.error("AI Reference Error:", e);
    return "Failed to generate reference translation.";
  }
}
