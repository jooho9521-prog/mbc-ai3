
import React, { useState, KeyboardEvent } from 'react';
import { MealTime, Recipe } from './types';
import { IngredientChip } from './components/IngredientChip';
import { RecipeCard } from './components/RecipeCard';
import { getRecipeSuggestions } from './services/geminiService';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [mealTime, setMealTime] = useState<MealTime>(MealTime.LUNCH);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddIngredient();
    }
  };

  const removeIngredient = (target: string) => {
    setIngredients(ingredients.filter(i => i !== target));
  };

  const generateRecipes = async () => {
    if (ingredients.length === 0) {
      alert('최소 하나 이상의 재료를 입력해주세요!');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const suggestions = await getRecipeSuggestions(ingredients, mealTime);
      setRecipes(suggestions);
      
      // 결과 영역으로 부드럽게 스크롤
      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err: any) {
      console.error("Recipe Generation Error:", err);
      setError('레시피를 생성하는 중 오류가 발생했습니다. 재료를 조금 더 구체적으로 적거나 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      {/* Header */}
      <header className="bg-emerald-600 text-white py-10 px-4 text-center shadow-lg rounded-b-[3rem] mb-8">
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
          <i className="fa-solid fa-refrigerator mr-2"></i>
          냉장고 파먹기 요리사
        </h1>
        <p className="text-emerald-100 font-medium opacity-90">내 냉장고 속 재료로 만드는 마법 같은 레시피</p>
      </header>

      <main className="max-w-2xl mx-auto px-4">
        {/* Step 1: Ingredients */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mr-2 text-sm">1</span>
            냉장고에 있는 재료를 알려주세요
          </h2>
          
          <div className="relative mb-4">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="예: 계란, 양파, 스팸..."
              className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
            <button 
              onClick={handleAddIngredient}
              className="absolute right-2 top-2 bottom-2 px-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {ingredients.length === 0 && (
              <p className="text-slate-400 text-sm italic py-2">아직 추가된 재료가 없습니다.</p>
            )}
            {ingredients.map((ing) => (
              <IngredientChip 
                key={ing} 
                label={ing} 
                onRemove={() => removeIngredient(ing)} 
              />
            ))}
          </div>
        </section>

        {/* Step 2: Meal Time */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mr-2 text-sm">2</span>
            언제 드실 건가요?
          </h2>
          
          <div className="grid grid-cols-3 gap-4">
            {Object.values(MealTime).map((time) => (
              <button
                key={time}
                onClick={() => setMealTime(time)}
                className={`py-3.5 px-2 rounded-2xl font-bold flex flex-col items-center justify-center transition-all border-2 ${
                  mealTime === time 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' 
                  : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-emerald-200'
                }`}
              >
                <i className={`fa-solid ${
                  time === MealTime.BREAKFAST ? 'fa-sun' : 
                  time === MealTime.LUNCH ? 'fa-cloud-sun' : 'fa-moon'
                } mb-1.5 text-lg`}></i>
                {time}
              </button>
            ))}
          </div>
        </section>

        {/* Action Button */}
        <button
          onClick={generateRecipes}
          disabled={isLoading || ingredients.length === 0}
          className={`w-full py-4 rounded-2xl text-lg font-bold shadow-lg transition-all transform active:scale-[0.98] ${
            isLoading || ingredients.length === 0
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-0.5 shadow-emerald-200'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              AI 요리사가 고민 중...
            </span>
          ) : (
            'AI 요리사에게 추천 받기'
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex items-start animate-bounce">
            <i className="fa-solid fa-circle-exclamation mr-2 mt-0.5"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {(recipes.length > 0 || isLoading) && (
          <div id="results" className="mt-12 scroll-mt-10">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center px-1">
              <i className="fa-solid fa-kitchen-set mr-2 text-emerald-600"></i>
              AI 요리사의 추천 레시피
            </h2>
            
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse">
                    <div className="h-6 bg-slate-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded w-2/3 mb-6"></div>
                    <div className="h-10 bg-slate-50 rounded-xl w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {recipes.map((recipe, idx) => (
                  <RecipeCard key={idx} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 text-center text-slate-400 text-xs px-4">
        <p>© 2025 AI Fridge Chef. All rights reserved.</p>
        <p className="mt-1">AI가 제안하는 레시피이므로 실제 조리 시 재료 상태에 유의하세요.</p>
      </footer>
    </div>
  );
};

export default App;
