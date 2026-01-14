import React from 'react';

interface CategoryNavProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto py-3 -mx-4 px-4">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-4 py-2 whitespace-nowrap rounded-lg transition ${
              activeCategory === 'all'
                ? 'bg-orange-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 whitespace-nowrap rounded-lg transition ${
                activeCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
