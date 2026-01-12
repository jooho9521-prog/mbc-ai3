
import { GoogleGenAI, Type } from "@google/genai";
import { MealTime, Recipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getRecipeSuggestions = async (ingredients: string[], mealTime: MealTime): Promise<Recipe[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `다음 재료들을 활용하여 ${mealTime} 식사에 적합한 요리 레시피 3가지를 추천해줘: ${ingredients.join(', ')}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: '요리의 이름' },
              description: { type: Type.STRING, description: '요리에 대한 짧은 설명' },
              cookingTime: { type: Type.STRING, description: '예상 소요 시간 (예: 20분)' },
              difficulty: { type: Type.STRING, description: '난이도 (쉬움, 보통, 어려움)' },
              ingredients: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: '이 요리에 필요한 구체적인 재료 목록'
              },
              instructions: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: '조리 단계별 설명'
              }
            },
            required: ['title', 'description', 'cookingTime', 'difficulty', 'ingredients', 'instructions']
          }
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("레시피를 가져오는 데 실패했습니다.");
  }
};
