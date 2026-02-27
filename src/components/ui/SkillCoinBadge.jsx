import React from 'react';
import { motion } from 'framer-motion';

export default function SkillCoinBadge({ amount, size = 'md', type = 'neutral' }) {
  const sizes = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-1.5',
    lg: 'text-xl px-4 py-2',
    xl: 'text-3xl px-6 py-3',
  };
  
  const types = {
    neutral: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700',
    earn: 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700',
    spend: 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700',
  };

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-2xl font-bold ${sizes[size]} ${types[type]}`}
    >
      <span className={size === 'xl' ? 'text-2xl' : size === 'lg' ? 'text-lg' : 'text-base'}>🪙</span>
      <span>{typeof amount === 'number' ? amount.toLocaleString() : amount}</span>
    </motion.div>
  );
}