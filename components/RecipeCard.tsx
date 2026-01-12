
import React, { useState } from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md mb-6">
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-800">{recipe.title}</h3>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            recipe.difficulty === '쉬움' ? 'bg-green-100 text-green-700' :
            recipe.difficulty === '보통' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
          }`}>
            {recipe.difficulty}
          </span>
        </div>
        
        <p className="text-slate-600 text-sm mb-4 leading-relaxed">
          {recipe.description}
        </p>

        <div className="flex items-center space-x-4 mb-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center">
            <i className="fa-solid fa-clock mr-1.5 text-emerald-500"></i>
            {recipe.cookingTime}
          </span>
          <span className="flex items-center">
            <i className="fa-solid fa-utensils mr-1.5 text-emerald-500"></i>
            {recipe.ingredients.length}개 재료
          </span>
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-emerald-500 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-colors"
        >
          <span>{isOpen ? '닫기' : '상세 레시피 보기'}</span>
          <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} text-xs`}></i>
        </button>

        {isOpen && (
          <div className="mt-6 border-t pt-6 space-y-6 animate-fadeIn">
            <div>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                <i className="fa-solid fa-list-check mr-2 text-emerald-600"></i>
                필요한 재료
              </h4>
              <div className="flex flex-wrap gap-2">
                {recipe.ingredients.map((ing, idx) => (
                  <span key={idx} className="bg-slate-50 text-slate-600 text-xs px-3 py-1 rounded-md border border-slate-100">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 mb-3 flex items-center">
                <i className="fa-solid fa-fire-burner mr-2 text-emerald-600"></i>
                조리 순서
              </h4>
              <ol className="space-y-4">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex space-x-3 group">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mt-0.5 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
