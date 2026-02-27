import React from 'react';
import { motion } from 'framer-motion';

export default function FilterChips({ filters, activeFilters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter.value);
        
        return (
          <motion.button
            key={filter.value}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(filter.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                : 'bg-white/80 text-gray-600 hover:bg-gray-100 border border-gray-100'
            }`}
          >
            {filter.icon && <span className="mr-1">{filter.icon}</span>}
            {filter.label}
          </motion.button>
        );
      })}
    </div>
  );
}