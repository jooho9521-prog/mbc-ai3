
import React from 'react';

interface IngredientChipProps {
  label: string;
  onRemove: () => void;
}

export const IngredientChip: React.FC<IngredientChipProps> = ({ label, onRemove }) => {
  return (
    <div className="flex items-center bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-200 transition-all hover:bg-emerald-200">
      <span>{label}</span>
      <button 
        onClick={onRemove}
        className="ml-2 focus:outline-none hover:text-emerald-600 transition-colors"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
};
