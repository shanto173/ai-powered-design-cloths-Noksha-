import { GoogleGenAI } from "@google/genai";
import { UserPreferences, GeneratedDesign } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFashionDesign = async (prefs: UserPreferences): Promise<GeneratedDesign> => {
  if (!prefs.selectedStyle) throw new Error("No style selected");

  const sentiments = Object.values(prefs.quizAnswers).join(", ");
  
  // Construct a rich prompt for the Bangladeshi 3-piece context
  const prompt = `
    Fashion Design Request: Create a photorealistic, high-fashion image of a Bangladeshi "Three-Piece" suit (Salwar Kameez, Dupatta).
    
    Base Style: ${prefs.selectedStyle.name} - ${prefs.selectedStyle.description}.
    
    Target Audience: Modern Bangladeshi woman (Age 24-35).
    
    Psychological Profile/Vibe: ${sentiments}.
    
    Design Details:
    - The Kamiz (top) should feature intricate details matching the vibe.
    - The Dupatta (scarf) should be draped elegantly.
    - Visual Style: High resolution, editorial fashion photography, cinematic lighting. 
    - Include specific fabric textures (e.g., Jamdani weave, Silk sheen, Cotton texture) based on the profile.
    - If the vibe is 'vibrant', use bright colors. If 'calm', use pastels.
    
    Return the result as if it is a fashion magazine cover.
  `;

  try {
    // 1. Generate the Image using Nano Banana (gemini-2.5-flash-image)
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
            aspectRatio: "3:4", // Portrait for fashion
        }
      }
    });

    let imageUrl = '';
    
    // Parse the image from the response parts
    if (imageResponse.candidates && imageResponse.candidates[0].content.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                break;
            }
        }
    }

    if (!imageUrl) {
        throw new Error("Failed to generate image data.");
    }

    // 2. Generate a text description/analysis explaining WHY this was designed
    // We use a lighter text model for this quick explanation
    const textResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `
            Based on these personality traits: "${sentiments}" and the base style "${prefs.selectedStyle.name}", 
            write a short, alluring 2-sentence description of a fashion design created for a Bangladeshi woman.
            Explain how the design reflects her inner self.
        `,
    });

    return {
      imageUrl,
      description: prefs.selectedStyle.description,
      sentimentAnalysis: textResponse.text || "A design that perfectly captures your unique essence.",
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};