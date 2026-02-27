import React from 'react';
import { Star, Clock, User, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SkillCard({ skill, onClick }) {
  const isTeach = skill.type === 'teach';
  
  const gradients = {
    teach: 'from-emerald-50 via-teal-50 to-cyan-50',
    learn: 'from-amber-50 via-yellow-50 to-orange-50',
  };
  
  const badges = {
    teach: 'bg-emerald-100 text-emerald-700',
    learn: 'bg-amber-100 text-amber-700',
  };
  
  const coinColors = {
    teach: 'text-emerald-600',
    learn: 'text-amber-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${gradients[skill.type]} rounded-3xl p-5 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 border border-white/50`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badges[skill.type]}`}>
          {isTeach ? '📚 Teach' : '🎯 Learn'}
        </span>
        <div className={`flex items-center gap-1 ${coinColors[skill.type]} font-bold text-lg`}>
          <span>🪙</span>
          <span>{skill.skillcoins}</span>
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 mb-2">{skill.title}</h3>
      
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-1 bg-white/60 rounded-lg text-xs text-gray-600">
          {skill.category}
        </span>
        <span className="px-2 py-1 bg-white/60 rounded-lg text-xs text-gray-600">
          {skill.level}
        </span>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-white/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
            {skill.user_photo ? (
              <img src={skill.user_photo} alt="" className="w-full h-full object-cover" />
            ) : (
              skill.user_name?.charAt(0) || 'U'
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">{skill.user_name || 'Student'}</p>
            <p className="text-xs text-gray-500">{skill.user_year} • {skill.user_branch}</p>
          </div>
        </div>
        
        {skill.rating > 0 && (
          <div className="flex items-center gap-1 bg-white/70 px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-gray-700">{skill.rating?.toFixed(1)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}