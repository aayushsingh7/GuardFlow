import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
dotenv.config();

class AiInstance {
  /**
   * @param {Object} options 
   * @param {string} options.provider - AI provider: 'gemini', 'openai', or 'custom'
   * @param {string} options.apiKey 
   * @param {string} options.model 
   * @param {string} options.prompt 
   * @param {string} options.systemPrompt 
   * @param {number} options.temperature 
   * @param {number} options.maxTokens
   * @param {string} options.customUrl
   * @returns {Promise<string>} 
   */
  async generateContent(options = {}) {
    const {
      provider,
      apiKey,
      model,
      prompt,
      systemPrompt = "",
      temperature = 0.7,
      maxTokens = 5000,
      customUrl = "",
    } = options;

    if (!prompt) {
      throw new Error("Prompt is required");
    }

    try {
      switch (provider) {
        case "gemini":
          return await this._generateWithGemini(
            apiKey,
            model,
            prompt,
            systemPrompt,
            temperature,
            maxTokens
          );

        case "openai":
          return await this._generateWithOpenAI(
            apiKey,
            model,
            prompt,
            systemPrompt,
            temperature,
            maxTokens
          );

        case "custom":
          return await this._generateWithCustomAI(
            customUrl,
            prompt,
            systemPrompt
          );

        default:
          throw new Error(
            `Unsupported provider: ${provider}. Use 'gemini', 'openai', or 'custom'`
          );
      }
    } catch (error) {
      throw new Error(`Generation failed: ${error.message}`);
    }
  }

  /**
   * Generate content with Gemini
   * @private
   */
  async _generateWithGemini(
    apiKey,
    model = "gemini-1.5-pro",
    prompt,
    systemPrompt,
    temperature,
    maxTokens
  ) {
    if (!apiKey) {
      throw new Error("API key is required for Gemini");
    }

    const llm = new ChatGoogleGenerativeAI({
      apiKey,
      modelName: model,
      temperature,
      maxOutputTokens: maxTokens,
    });

    const messages = [];

    if (systemPrompt) {
      const { SystemMessage } = await import("@langchain/core/messages");
      messages.push(new SystemMessage(systemPrompt));
    }

    const { HumanMessage } = await import("@langchain/core/messages");
    messages.push(new HumanMessage(prompt));

    const response = await llm.invoke(messages);
    return response.content;
  }

  /**
   * Generate content with OpenAI
   * @private
   */
  async _generateWithOpenAI(
    apiKey,
    model = "gpt-4o",
    prompt,
    systemPrompt,
    temperature,
    maxTokens
  ) {
    if (!apiKey) {
      throw new Error("API key is required for OpenAI");
    }

    const llm = new ChatOpenAI({
      apiKey,
      modelName: model,
      temperature,
      maxTokens,
    });

    const messages = [];

    if (systemPrompt) {
      const { SystemMessage } = await import("@langchain/core/messages");
      messages.push(new SystemMessage(systemPrompt));
    }

    const { HumanMessage } = await import("@langchain/core/messages");
    messages.push(new HumanMessage(prompt));

    const response = await llm.invoke(messages);
    return response.content;
  }

  /**
   * Generate content with Custom AI (no API key required)
   * @private
   */
  async _generateWithCustomAI(customUrl, prompt, systemPrompt) {
    if (!customUrl) {
      throw new Error("Custom URL is required for custom AI");
    }

    const body = {
      prompt,
      system_prompt: systemPrompt || undefined,
    };

    const response = await fetch(customUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Custom AI service error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || data.generated_text || data.content || "";
  }
}

export default AiInstance;
