import { GoogleGenerativeAI } from "@google/generative-ai";
import ApiTrafficService from "./apiTraffic.service.js";
import ReportService from "./report.service.js";
import dotenv from "dotenv";
import AiInstance from "../config/aiConfig.js";
dotenv.config();

const SUMMARY_PROMPT = `
You are an AI security analyst. Your task is to analyze and summarize the given traffic data and scan results concisely, **strictly based on the provided data**.

### **Objective:**  
- Identify **anomalies** in API traffic (e.g., unusual spikes, unauthorized access attempts, high failure rates).  
- Highlight **security risks** from scan results (e.g., critical vulnerabilities, outdated dependencies, common exploits).  
- Ensure the response is **well-structured, professional, and visually clear**.  
- Use \`README.md\`-style formatting for **important points, highlights, and dependencies**.  
- **Do not generate assumptions or extra recommendations** beyond the provided data.

### **Response Format:**  
\`\`\`md
## 🚀 Traffic Insights
- **Overall Pattern:** (Describe general traffic trends.)
- **Anomalies Detected:** (Mention any spikes, sudden drops, or irregularities.)
- **Hourly/Regional Trends:** (If any significant hourly or geographic variations exist.)

## 🔍 Security Findings
- **Total Vulnerabilities:** \`X\` vulnerabilities found.
- **Critical Dependencies:** (List key dependencies with security issues.)
- **Severity Breakdown:** (Mention types of vulnerabilities, e.g., SSRF, XSS, Code Injection.)
- **Outdated Packages:** (List outdated versions that require updating.)

## 🛠 Recommended Actions (Only if Critical Issues Exist)
> **Note:** If no vulnerabilities or major anomalies are detected, state:  
> \`"No critical security issues detected based on the provided data."\`
\`\`\`
`;

const AI_CHAT_PROMPT = `
You are an **AI Security Agent** responsible for analyzing, comparing, and summarizing data based on user requirements. Your primary objective is to monitor for **anomalies, security threats, and vulnerabilities** while providing actionable threat intelligence.

## **Responsibilities**
### **1. Data Analysis & Comparison**
- Compare and analyze the given data as per user requirements.
- Summarize key insights efficiently while ensuring accuracy.

### **2. Anomaly Detection & Threat Intelligence**
- Monitor for **anomalies or irregular patterns** in the provided data.
- Identify **potential security threats**, including:
  - **DDoS attacks**
  - **Brute-force attacks**
  - **Package expiration**
  - **Project dependency expiration**
  - **Unsafe dependencies**

### **3. Vulnerability Reporting & Recommendations**
- Cross-check detected vulnerabilities with known **security databases**.
- Provide **threat intelligence insights** regarding potential risks.
- Suggest **correct and secure versions** of software/packages if outdated or unsafe versions are detected.

---

## **Response Expectations**
- **Only provide analysis based on the given data.** Do **not** request additional details or speculate about missing information.
- Keep responses **clear, precise, and structured**.
- Prioritize **critical security risks** first.
- Provide **actionable recommendations** to mitigate identified threats.
- Use structured formatting (**lists, tables, bullet points**) for improved readability.
- **Do not** include disclaimers like *"This analysis is limited"* or *"More data is needed for a full assessment."*

---
## **Response Format (Use This Template)**
### **Analysis of [Data Context]**
**Summary:**  
[Brief security summary]

### **Detailed Analysis [example format] **
| Route          | GET Requests | POST Requests | PUT Requests | DELETE Requests | Total Requests | 2XX Success | 4XX Client Errors | 5XX Server Errors | Avg. Response Time (ms) |
|--------------|-------------|--------------|-------------|---------------|---------------|------------|----------------|----------------|---------------------|
| \`/api/users\`  | 120         | 80           | 30          | 10            | 240           | 220        | 15             | 5              | 120                 |
| \`/api/orders\` | 300         | 150          | 60          | 20            | 530           | 500        | 25             | 5              | 200                 |
| \`/api/products\` | 200      | 100          | 40          | 15            | 355           | 340        | 10             | 5              | 180                 |
| \`/api/payments\` | 50       | 300          | 20          | 5             | 375           | 360        | 10             | 5              | 250                 |

### **Anomalies & Threats Identified**
[List any security risks, or state *None detected*]

### **Recommendations**
- **[Key Action 1]**: [Solution]
- **[Key Action 2]**: [Solution]

### **Further Considerations**
[Optional: Additional insights]

*Ensure the response is formatted exactly as above.*
`;

class BaseAIService {
  constructor() {
    this.ai = new AiInstance();
  }

  async generateResponse(prompt) {
    try {
      const result = await this.ai.generateContent({
        provider: process.env.AI_PROVIDER,
        apiKey: process.env.AI_API_KEY,
        model: process.env.AI_MODEL,
        prompt: prompt,
        systemPrompt: SUMMARY_PROMPT,
        temperature: 0.7,
      });
      return result;
    } catch (error) {
      logger.error("Error generating AI response:", error);
      throw new CustomError("Failed to generate AI response", 500);
    }
  }

  async generateChatResponse(message) {
    try {
      const result = await this.ai.generateContent({
        provider: process.env.AI_PROVIDER,
        apiKey: process.env.AI_API_KEY,
        model: process.env.AI_MODEL,
        prompt: message,
        systemPrompt: AI_CHAT_PROMPT,
        temperature: 0.7,
        maxTokens: 7000,
      });
      return result;
    } catch (error) {
      logger.error("Error generating AI response:", error);
      throw new CustomError("Failed to generate AI response", 500);
    }
  }
}

class AIService {
  constructor() {
    this.apiTrafficService = new ApiTrafficService();
    this.reportService = new ReportService();
    this.ai = new BaseAIService();
    this.SUMMARY_PROMPT = `

  ## Traffic Data
  {trafficData}

  ## Scan Results
  {scanData}
  `;
  }

  async getSummary(data) {
    try {
      let trafficData = await this.apiTrafficService.getTrafficOverview({
        organizationID: data.organizationID,
        startTime: data.startTime,
        endTime: data.endTime,
      });
      let scanData = await this.reportService.getScanReport({
        organizationID: data.organizationID,
        startTime: data.startTime,
        endTime: data.endTime,
      });
      let response = await this.ai.generateResponse(
        this.SUMMARY_PROMPT.replace(
          "{trafficData}",
          JSON.stringify(trafficData)
        ).replace("{scanData}", JSON.stringify(scanData))
      );

      return response;
    } catch (err) {
      throw err;
    }
  }

  async chatWithAI(prompt) {
    try {
      const response = await this.ai.generateChatResponse(prompt);
      return response;
    } catch (err) {
      throw err;
    }
  }
}

export default AIService;
