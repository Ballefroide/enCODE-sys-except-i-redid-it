
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

/**
 * Initializes the API client using the environment variable.
 * Note: Following guidelines to use process.env.API_KEY directly.
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.INTEGER,
      description: "Functional correctness score (Integrity) from 0 to 100.",
    },
    optimality: {
      type: Type.INTEGER,
      description: "Efficiency and conciseness score from 0 to 100.",
    },
    clarity: {
      type: Type.INTEGER,
      description: "Code style, naming, and indentation score from 0 to 100.",
    },
    feedback: {
      type: Type.STRING,
      description: "Constructive feedback on what is wrong or right. Keep it brief and witty.",
    },
    isCorrect: {
      type: Type.BOOLEAN,
      description: "True if the code functionally achieves the goal, even if not perfect.",
    },
  },
  required: ["score", "optimality", "clarity", "feedback", "isCorrect"],
};

export interface EvaluationResult {
  score: number;
  optimality: number;
  clarity: number;
  feedback: string;
  isCorrect: boolean;
}

export const evaluateCodeSubmission = async (
  objective: string,
  userCode: string,
  language: Language
): Promise<EvaluationResult> => {
  try {
    // Construct the prompt. 
    const prompt = `
      Act as a strict technical lead and code reviewer for a programming game.
      Context: ${language === Language.GENERAL ? 'Orientation (Plain Text Input)' : 'Programming Challenge'}
      Language/Mode: ${language}
      Objective: ${objective}
      
      User's Input:
      \`\`\`
      ${userCode}
      \`\`\`
      
      Evaluation Rules:
      1. INTEGRITY (score): Functional correctness relative to the objective. 
         - For ORIENTATION: Match specific phrases or choices exactly.
         - For CODE: Does it run and solve the problem?
      2. OPTIMALITY: Reward idiomatic usage and brevity. Penalize unnecessary boilerplate or overly complex logic for simple tasks.
      3. CLARITY: Reward clean indentation, appropriate spacing, and (if applicable) naming.
      
      Your goal is to be fair but firm. If the user solves it but with "messy" code, Integrity might be high but Clarity/Optimality will be low.
    `;

    // Using gemini-3-pro-preview for complex coding evaluation tasks.
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }
    
    // Parse the JSON string from the model response.
    const result = JSON.parse(text.trim());
    return result as EvaluationResult;

  } catch (error) {
    console.error("Gemini evaluation failed:", error);
    return {
      score: 0,
      optimality: 0,
      clarity: 0,
      feedback: "Failed to connect to the grading server (AI Error). Please check your connection.",
      isCorrect: false,
    };
  }
};
