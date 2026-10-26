import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AppLanguage } from "../types";

// Removed hardcoded/process.env check here to support dynamic user keys better
let ai: GoogleGenAI | null = null;

const initAI = (key: string) => {
    if (!ai && key) {
        try {
            ai = new GoogleGenAI({ apiKey: key });
        } catch (error) {
            console.error("Failed to initialize AI client", error);
        }
    }
};

export const getGeminiHelp = async (
  code: string,
  question: string,
  lessonContext: string,
  appLanguage: AppLanguage,
  apiKey: string | null
): Promise<string> => {
  if (!apiKey) {
      return "Please enter your API Key in Settings or unlock Developer Mode to use the AI Assistant.";
  }

  // Re-init if needed or if key changed (simple check)
  initAI(apiKey);

  if (!ai) {
      return "Connection error. Invalid API Key configuration.";
  }

  // Model choice based on task type guidelines
  const model = "gemini-3-flash-preview"; 
  
  let langInstruction = "Respond in English.";
  if (appLanguage === 'hi') langInstruction = "Respond in Hindi (Devanagari script).";
  if (appLanguage === 'hinglish') langInstruction = "Respond in Hinglish (Hindi mixed with English using Latin script).";

  const systemPrompt = `
    You are MaXxCode AI, an Expert Senior Developer and patient Coding Mentor.

    CRITICAL IDENTITY INSTRUCTIONS:
    1. You were developed by Sheikh Ali Akbar.
    2. If asked "who made you", "who developed you", or similar, you MUST answer: "I was developed by Sheikh Ali Akbar."
    3. Do NOT mention Google. You are MaXxCode's proprietary AI.
    
    YOUR GOAL:
    To help the user write code, fix bugs, and understand concepts thoroughly.

    RULES FOR RESPONDING:
    1. **WRITE CODE:** If the user asks for code, a solution, or a fix, YOU MUST PROVIDE THE FULL WORKING CODE. Do not hold back. Write clean, commented, and correct code.
    2. **EXPLAIN DOUBTS:** If the user is confused or wants a discussion, explain the concept simply, using analogies if helpful. Be detailed enough to ensure understanding.
    3. **BE CORRECT:** Ensure any code you generate is syntactically correct for the requested language (Python or JavaScript).
    4. **FORMAT:** Use clear spacing. When writing code blocks, keep them distinct.
    
    LANGUAGE INSTRUCTION: ${langInstruction}
    
    CONTEXT:
    Current Lesson/Problem: ${lessonContext}
    
    USER'S CURRENT CODE:
    ${code}
    
    USER QUESTION/REQUEST:
    ${question}
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: [
          {
              role: 'user',
              parts: [{ text: systemPrompt }]
          }
      ],
    });

    // Directly access the text property as per guidelines (not response.text())
    return response.text || "I'm ready to write some code! What do you need?";
  } catch (error) {
    console.error("AI API Error:", error);
    return "Connection error. Please check your internet or API Key.";
  }
};
