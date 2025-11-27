import { GoogleGenAI } from "@google/genai";
import { UserPreferences, GeneratedDesign } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to strip data URI scheme
const stripBase64 = (dataUri: string) => {
  return dataUri.split(',')[1] || dataUri;
};

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
  let prompt = `
    Fashion Design Request: Create a photorealistic, high-fashion image of a ${garmentType}.
    
    Base Style: ${prefs.selectedStyle.name} - ${prefs.selectedStyle.description}.
    
    Target Audience: ${targetAudience}.
    
    Psychological Profile/Vibe: ${sentiments}.
    
    Design Details:
    ${designDetails}
    
    If the vibe is 'vibrant', use bold colors. If 'calm', use muted tones.
    Return the result as if it is a fashion magazine cover.
  `;

  const parts: any[] = [];
  
  // If user uploaded an image for inspiration
  if (prefs.uploadedImage) {
    prompt += `\n\nIMPORTANT: I have attached a reference image. Use this image as inspiration for the fabric patterns, color palette, or texture of the generated outfit. Incorporate elements from this inspiration image into the ${prefs.selectedStyle.name} style.`;
    
    parts.push({
        inlineData: {
            mimeType: 'image/png', // Assuming png/jpeg, gemini handles standard types
            data: stripBase64(prefs.uploadedImage)
        }
    });
  }

  parts.push({ text: prompt });

  try {
    // 1. Generate the Image
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
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

export const editFashionDesign = async (
  originalImageBase64: string, 
  maskImageBase64: string, 
  targetColor: string
): Promise<string> => {
  const prompt = `
    I have provided two images. 
    1. The first image is a fashion design.
    2. The second image is a black and white mask.
    
    Task: Change the color of the garment area in the first image that corresponds to the WHITE area in the second image (mask) to the color "${targetColor}".
    
    - Maintain the original texture, folds, shadows, and lighting of the fabric.
    - Only change the color of the masked region.
    - Do not change the background or the person's skin/face.
    - Return the modified image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { 
            text: prompt 
          },
          { 
            inlineData: {
              mimeType: 'image/png',
              data: stripBase64(originalImageBase64)
            }
          },
          { 
            inlineData: {
              mimeType: 'image/png',
              data: stripBase64(maskImageBase64)
            }
          }
        ],
      },
    });

    let newImageUrl = '';
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                newImageUrl = `data:image/png;base64,${part.inlineData.data}`;
                break;
            }
        }
    }
    
    if (!newImageUrl) throw new Error("Failed to generate edited image");
    return newImageUrl;

  } catch (error) {
    console.error("Gemini Edit Error:", error);
    throw error;
  }
};