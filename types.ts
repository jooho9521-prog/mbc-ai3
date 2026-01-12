
export enum MealTime {
  BREAKFAST = '아침',
  LUNCH = '점심',
  DINNER = '저녁'
}

export interface Recipe {
  title: string;
  description: string;
  cookingTime: string;
  difficulty: '쉬움' | '보통' | '어려움';
  ingredients: string[];
  instructions: string[];
}
