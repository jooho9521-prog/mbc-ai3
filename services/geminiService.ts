
import { GoogleGenAI, Type } from "@google/genai";
import { MealTime, Recipe } from "../types";

export const getRecipeSuggestions = async (ingredients: string[], mealTime: MealTime): Promise<Recipe[]> => {
  // 호출 시점에 인스턴스를 생성하여 환경 변수 접근의 안정성을 높입니다.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `다음 재료들을 활용하여 ${mealTime} 식사에 적합한 요리 레시피 3가지를 추천해줘: ${ingredients.join(', ')}`,
      config: {
        systemInstruction: "당신은 냉장고 속 남은 재료를 활용해 최고의 요리를 제안하는 전문 쉐프입니다. 반드시 제공된 JSON 스키마에 맞춰 응답하세요. 한국어로 답변하세요.",
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

    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error("모델로부터 응답을 받지 못했습니다.");
    }

    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini API Error Detail:", error);
    throw error;
  }
};
