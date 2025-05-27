import { useEffect, useState } from 'react';
import { SlidersHorizontal, Check } from 'lucide-react';
import { SORT_OPTIONS, COMMON_TAGS } from '../../utils/constants';

function FilterBar({ onFilterChange, initialFilters = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSort, setActiveSort] = useState(initialFilters.sort || 'popular');
  const [activeTag, setActiveTag] = useState(initialFilters.tag || null);
  
  // Toggle filter panel
  const toggleFilters = () => setIsOpen(!isOpen);
  
  // Handle sort change
  const handleSortChange = (sort) => {
    setActiveSort(sort);
    onFilterChange({ sort, tag: activeTag });
  };
  
  // Handle tag change
  const handleTagChange = (tag) => {
    const newTag = activeTag === tag ? null : tag;
    setActiveTag(newTag);
    onFilterChange({ sort: activeSort, tag: newTag });
  };
  
  // Apply initial filters
  useEffect(() => {
    if (initialFilters.sort) setActiveSort(initialFilters.sort);
    if (initialFilters.tag) setActiveTag(initialFilters.tag);
  }, [initialFilters]);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <button
          onClick={toggleFilters}
          className="flex items-center text-xs font-small text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 px-2 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm transition-colors"
        >
          <SlidersHorizontal className="h-3 w-3 mr-1.5" />
          Filter & Sort
        </button>
      </div>
      
      {isOpen && (
        <div className="mt-2 bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-4 border border-neutral-200 dark:border-neutral-700 transition-all">
          <div className="mb-4">
            <h3 className="text-sm font-small text-neutral-900 dark:text-white mb-2">
              Sort by
            </h3>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium transition-colors
                    ${activeSort === option.value
                      ? 'bg-primary-50 text-primary-600 border border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800'
                      : 'bg-neutral-50 text-neutral-700 border border-neutral-200 hover:bg-neutral-100 dark:bg-neutral-800/50 dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-800'}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
              Filter by Tag
            </h3>
            <div className="flex flex-wrap gap-2">
              {COMMON_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagChange(tag)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-colors
                    ${activeTag === tag
                      ? 'bg-secondary-50 text-secondary-600 border border-secondary-200 dark:bg-secondary-900/20 dark:text-secondary-400 dark:border-secondary-800'
                      : 'bg-neutral-50 text-neutral-700 border border-neutral-200 hover:bg-neutral-100 dark:bg-neutral-800/50 dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-800'}
                  `}
                >
                  {activeTag === tag && <Check className="h-3 w-3" />}
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterBar;