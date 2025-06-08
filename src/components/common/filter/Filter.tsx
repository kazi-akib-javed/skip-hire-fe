import React from 'react';
import './Filter.css';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  className?: string;
}

const Filter: React.FC<FilterProps> = ({
  value,
  onChange,
  options,
  className = ''
}) => {
  return (
    <div className={`filter-container ${className}`}>
      <select
        className="filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter; 