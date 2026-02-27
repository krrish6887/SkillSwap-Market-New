import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import SkillCard from '@/components/ui/SkillCard';
import FilterChips from '@/components/ui/FilterChips';
import SkillCoinBadge from '@/components/ui/SkillCoinBadge';
import SkillDetailSheet from '@/components/discover/SkillDetailSheet';

const categories = [
  { label: 'All', value: 'all', icon: '✨' },
  { label: 'Tech', value: 'Tech', icon: '💻' },
  { label: 'Creative', value: 'Creative', icon: '🎨' },
  { label: 'Academic', value: 'Academic', icon: '📚' },
  { label: 'Sports', value: 'Sports', icon: '⚽' },
  { label: 'Music', value: 'Music', icon: '🎵' },
  { label: 'Languages', value: 'Languages', icon: '🌍' },
];

const typeFilters = [
  { label: 'All', value: 'all' },
  { label: 'Learn from', value: 'teach' },
  { label: 'Teach to', value: 'learn' },
];

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [yearFilter, setYearFilter] = useState('all');
  const [hostelFilter, setHostelFilter] = useState('all');

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => base44.entities.Skill.list('-created_date', 50),
  });

  const { data: recommendations = [] } = useQuery({
    queryKey: ['recommendations', user?.interests],
    queryFn: async () => {
      if (!user?.interests?.length) return [];
      const allSkills = await base44.entities.Skill.list('-created_date', 20);
      return allSkills.filter(s => 
        user.interests.some(i => s.category?.toLowerCase().includes(i.toLowerCase()))
      ).slice(0, 5);
    },
    enabled: !!user?.interests?.length,
  });

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || skill.category === activeCategory;
    const matchesType = activeType === 'all' || skill.type === activeType;
    const matchesYear = yearFilter === 'all' || skill.user_year === yearFilter;
    const matchesHostel = hostelFilter === 'all' || skill.user_hostel === hostelFilter;
    
    return matchesSearch && matchesCategory && matchesType && matchesYear && matchesHostel;
  });

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Discover Skills</h1>
            <p className="text-sm text-gray-500">Find your next learning adventure ✨</p>
          </div>
          {user?.skillcoins !== undefined && (
            <SkillCoinBadge amount={user.skillcoins || 100} size="md" />
          )}
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-4"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search skills, categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-12 py-6 rounded-2xl bg-white/80 backdrop-blur border-0 shadow-sm text-base"
        />
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
            >
              <Filter className="w-5 h-5 text-gray-500" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Year</h4>
                <div className="flex flex-wrap gap-2">
                  {['all', '1st Year', '2nd Year', '3rd Year', '4th Year'].map(year => (
                    <button
                      key={year}
                      onClick={() => setYearFilter(year)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        yearFilter === year
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {year === 'all' ? 'All Years' : year}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => setShowFilters(false)}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500"
              >
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>

      {/* Type Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 mb-4"
      >
        {typeFilters.map(filter => (
          <button
            key={filter.value}
            onClick={() => setActiveType(filter.value)}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
              activeType === filter.value
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                : 'bg-white/80 text-gray-600'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </motion.div>

      {/* Category Chips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="overflow-x-auto pb-2 mb-4 -mx-4 px-4"
      >
        <div className="flex gap-2 w-max">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.value
                  ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md'
                  : 'bg-white/80 text-gray-600 border border-gray-100'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-gray-800">Recommended for you</h3>
          </div>
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex gap-3 w-max">
              {recommendations.map(skill => (
                <div key={skill.id} className="w-64 flex-shrink-0">
                  <SkillCard skill={skill} onClick={() => setSelectedSkill(skill)} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Skills Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-semibold text-gray-800 mb-3">
          {activeType === 'teach' ? 'Learn From' : activeType === 'learn' ? 'Teach Someone' : 'All Skills'} 
          <span className="text-gray-400 font-normal ml-2">({filteredSkills.length})</span>
        </h3>
        
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filteredSkills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-semibold text-gray-700 mb-1">No skills found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters</p>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SkillCard skill={skill} onClick={() => setSelectedSkill(skill)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Skill Detail Sheet */}
      <SkillDetailSheet
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        currentUser={user}
      />
    </div>
  );
}