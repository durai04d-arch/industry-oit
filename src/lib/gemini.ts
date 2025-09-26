import { GoogleGenerativeAI } from "@google/generative-ai";

// Get your API key from https://makersuite.google.com/app/apikey
// It's recommended to use environment variables for your API key
const apiKey =
  // webpack / CRA: process.env injected at build time
  (typeof process !== "undefined" && (process as any)?.env?.REACT_APP_GEMINI_API_KEY) ||
  // Vite: import.meta.env
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
  // runtime fallback: set window.__REACT_APP_GEMINI_API_KEY in index.html if needed
  (typeof window !== "undefined" && (window as any).__REACT_APP_GEMINI_API_KEY) ||
  // last-resort placeholder (do not ship a real key)
  "AIzaSyDPYjLKfXmWWGa2rMekI_UjjPTIj3FlUFQ";
if (!apiKey || apiKey === "AIzaSyDPYjLKfXmWWGa2rMekI_UjjPTIj3FlUFQ") {
  console.warn(
    "Gemini API key is not set. Please provide it in your environment variables (REACT_APP_GEMINI_API_KEY) or directly in the code."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const chatModel = genAI.getGenerativeModel({
  model: "gemini-pro",
});

export const generateEnhancedMessage = async (
  sensorType: string,
  value: number,
  unit: string,
  location: string
): Promise<string> => {
  if (!apiKey || apiKey === "AIzaSyDPYjLKfXmWWGa2rMekI_UjjPTIj3FlUFQ") {
    return "AI analysis unavailable. API key not configured.";
  }

  const prompt = `
    You are an expert AI assistant for an industrial IoT monitoring system.
    A sensor of type "${sensorType}" at location "${location}" is reporting a value of ${value} ${unit}.
    Based on this data, provide a concise, actionable insight and a potential root cause.
    The message should be no more than 2-3 short sentences.
    Example: "Elevated temperature suggests potential equipment stress. Check for ventilation blockages or coolant leaks."
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return "Could not retrieve AI-powered insight.";
  }
};

export const generateChatResponse = async (userInput: string, history: string): Promise<string> => {
  if (!apiKey || apiKey === "AIzaSyDPYjLKfXmWWGa2rMekI_UjjPTIj3FlUFQ") {
    return "AI chat unavailable. API key not configured.";
  }

  const prompt = `
    You are a helpful AI assistant for an IoT dashboard.
    The user is asking for help with their sensor data.
    Current conversation history:
    ${history}
    User's new message: "${userInput}"
    
    Based on this, provide a helpful and concise response.
    If you need more information, ask clarifying questions.
    You can also suggest actions the user can take.
  `;

  try {
    const result = await chatModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating chat response with Gemini:", error);
    return "Sorry, I couldn't process that. Please try again.";
  }
};
