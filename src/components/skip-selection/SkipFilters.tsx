import React from 'react';
import Search from '../common/search/Search';
import Filter, { FilterOption } from '../common/filter/Filter';
import './SkipFilters.css';

export type SortOption = 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc';

const sortOptions: FilterOption[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'size-asc', label: 'Size: Small to Large' },
  { value: 'size-desc', label: 'Size: Large to Small' }
];

interface SkipFiltersProps {
  currentSort: SortOption;
  onSortChange: (option: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SkipFilters: React.FC<SkipFiltersProps> = ({
  currentSort,
  onSortChange,
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="skip-filters">
      <Search
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search by size or price..."
        className="filter-section"
      />
      <Filter
        value={currentSort}
        onChange={(value) => onSortChange(value as SortOption)}
        options={sortOptions}
        className="filter-section"
      />
    </div>
  );
};

export default SkipFilters; 