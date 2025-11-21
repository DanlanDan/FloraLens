import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { PlantInfo } from "../types";

// Initialize Gemini Client
// Note: Using process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-pro-preview';

/**
 * Analyzes a plant image to extract structured data.
 */
export const analyzePlantImage = async (base64Image: string): Promise<PlantInfo> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: "Identify this plant. Provide the common name, scientific name, a brief description, detailed care instructions (light, water, soil, toxicity), and a fun fact."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            commonName: { type: Type.STRING },
            scientificName: { type: Type.STRING },
            description: { type: Type.STRING },
            care: {
              type: Type.OBJECT,
              properties: {
                light: { type: Type.STRING },
                water: { type: Type.STRING },
                soil: { type: Type.STRING },
                toxicity: { type: Type.STRING }
              },
              required: ["light", "water", "soil", "toxicity"]
            },
            funFact: { type: Type.STRING }
          },
          required: ["commonName", "scientificName", "description", "care", "funFact"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from Gemini");
    return JSON.parse(text) as PlantInfo;

  } catch (error) {
    console.error("Error analyzing plant:", error);
    throw error;
  }
};

/**
 * Creates a chat session initialized with the plant context.
 */
export const createPlantChat = (plantInfo: PlantInfo): Chat => {
  const systemInstruction = `You are an expert botanist and gardening assistant. 
  The user is asking about a specific plant they just identified: 
  Name: ${plantInfo.commonName} (${plantInfo.scientificName}).
  Description: ${plantInfo.description}.
  Care Info: Light - ${plantInfo.care.light}, Water - ${plantInfo.care.water}, Soil - ${plantInfo.care.soil}.
  
  Answer questions helpfully, concisely, and with a friendly, encouraging tone. 
  Focus on practical advice for keeping the plant healthy.`;

  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: systemInstruction,
    }
  });
};

/**
 * Sends a message to the active chat session.
 */
export const sendMessageToChat = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({
      message: message
    });
    
    if (response.text) {
      return response.text;
    }
    return "I'm sorry, I didn't catch that. Could you try asking again?";
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting to my botanical database right now.";
  }
};