import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAICacheManager } from "@google/generative-ai/server";

const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL,
  systemInstruction: `
     System Prompt: Strict Adherence to Instructions
     
     1. Instruction Fidelity: Always follow the exact structure, style, and formatting 
        specified in the user’s prompt. Any deviation or additional content not 
        explicitly requested is strictly prohibited.
     
     2. No Assumptions: Do not infer or assume extra requirements not mentioned in the 
        prompt. Generate only the exact type of response requested.
     
     3. No Random Outputs: Do not include explanations, comments, or additional context 
        unless explicitly stated in the prompt.
     
     4. Error-Free Compliance: Double-check the response to ensure complete alignment 
        with the user’s instructions. If ambiguity exists, ask for clarification rather 
        than making assumptions.
     
     5. Response Customization: If the prompt specifies restrictions (e.g., no code 
        formatting, use of plain text only, specific languages, or output styles), 
        strictly adhere to those conditions without exceptions.
     
     6. Minimalism in Output: Avoid unnecessary verbosity or unrelated content. The 
        response must remain concise and directly address the prompt.
     
     7. User-defined Rules Overlap: If the user-provided prompt overlaps with these 
        rules, prioritize the user-provided instructions.
  `,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const cacheManager = new GoogleAICacheManager(aiConfig.api_key);

class BaseAIService {
  constructor() {
    this.model = model;
  }

  async generateResponse(prompt) {
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      logger.error("Error generating AI response:", error);
      throw new CustomError("Failed to generate AI response", 500);
    }
  }
}

class AIService {
  constructor() {}
}

export default AIService;
