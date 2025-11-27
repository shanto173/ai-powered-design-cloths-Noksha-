import { GoogleGenAI } from "@google/genai";
import { UserPreferences, GeneratedDesign } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFashionDesign = async (prefs: UserPreferences): Promise<GeneratedDesign> => {
  if (!prefs.selectedStyle) throw new Error("No style selected");
  if (!prefs.gender) throw new Error("No gender selected");

  const sentiments = Object.values(prefs.quizAnswers).join(", ");
  
  const isFemale = prefs.gender === 'Female';
  const garmentType = isFemale 
    ? 'Bangladeshi "Three-Piece" suit (Salwar Kameez, Dupatta)'
    : 'Bangladeshi Men\'s Ethnic Wear (Panjabi, Pajama, optionally with Waistcoat/Vest)';

  const targetAudience = `Modern Bangladeshi ${prefs.gender} (Age 24-35)`;

  const designDetails = isFemale
    ? `- The Kamiz (top) should feature intricate details matching the vibe.
       - The Dupatta (scarf) should be draped elegantly.
       - Visual Style: High resolution, editorial fashion photography, cinematic lighting.
       - Include specific fabric textures (e.g., Jamdani weave, Silk sheen, Cotton texture) based on the profile.`
    : `- The Panjabi (top) should have a modern yet traditional cut.
       - If the style implies it, include a stylish waistcoat (Mujib coat style or modern vest).
       - Focus on collar details, button placements, and fabric quality.
       - Visual Style: High resolution, editorial fashion photography, cinematic lighting.
       - Fabrics: Cotton, Linen, Silk, or Khadi based on vibe.`;

  // Construct a rich prompt
  const prompt = `
    Fashion Design Request: Create a photorealistic, high-fashion image of a ${garmentType}.
    
    Base Style: ${prefs.selectedStyle.name} - ${prefs.selectedStyle.description}.
    
    Target Audience: ${targetAudience}.
    
    Psychological Profile/Vibe: ${sentiments}.
    
    Design Details:
    ${designDetails}
    
    If the vibe is 'vibrant', use bold colors. If 'calm', use muted tones.
    Return the result as if it is a fashion magazine cover.
  `;

  try {
    // 1. Generate the Image
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
    const textResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `
            Based on these personality traits: "${sentiments}" and the base style "${prefs.selectedStyle.name}", 
            write a short, alluring 2-sentence description of a fashion design created for a Bangladeshi ${prefs.gender}.
            Explain how the design reflects their inner self.
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