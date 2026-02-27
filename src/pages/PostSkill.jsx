import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, GraduationCap, Clock, Coins, Check, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SkillCoinBadge from '@/components/ui/SkillCoinBadge';

const categories = [
  { value: 'Tech', label: 'Tech', icon: '💻' },
  { value: 'Creative', label: 'Creative', icon: '🎨' },
  { value: 'Academic', label: 'Academic', icon: '📚' },
  { value: 'Sports', label: 'Sports', icon: '⚽' },
  { value: 'Music', label: 'Music', icon: '🎵' },
  { value: 'Languages', label: 'Languages', icon: '🌍' },
];

const levels = [
  { value: 'Beginner', label: 'Beginner', description: 'Just starting out' },
  { value: 'Intermediate', label: 'Intermediate', description: 'Some experience' },
  { value: 'Advanced', label: 'Advanced', description: 'Expert level' },
];

const durations = [
  '30 minutes',
  '1 hour',
  '1.5 hours',
  '2 hours',
  'Flexible',
];

export default function PostSkill() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [type, setType] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    duration: '',
    skillcoins: 10,
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const createSkillMutation = useMutation({
    mutationFn: async () => {
      return base44.entities.Skill.create({
        ...formData,
        type,
        user_name: user?.full_name,
        user_year: user?.year,
        user_branch: user?.branch,
        user_hostel: user?.hostel,
        user_photo: user?.photo,
        rating: 0,
        sessions_completed: 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['skills']);
      navigate(createPageUrl('Discover'));
    },
  });

  const getSuggestedCoins = (category, level) => {
    const baseCoins = {
      Tech: 15,
      Creative: 12,
      Academic: 10,
      Sports: 8,
      Music: 12,
      Languages: 10,
    };
    const levelMultiplier = {
      Beginner: 0.8,
      Intermediate: 1,
      Advanced: 1.3,
    };
    return Math.round((baseCoins[category] || 10) * (levelMultiplier[level] || 1));
  };

  const handleCategoryChange = (category) => {
    const suggested = getSuggestedCoins(category, formData.level);
    setFormData({ ...formData, category, skillcoins: suggested });
  };

  const handleLevelChange = (level) => {
    const suggested = getSuggestedCoins(formData.category, level);
    setFormData({ ...formData, level, skillcoins: suggested });
  };

  const isFormValid = formData.title && formData.category && formData.level;

  return (
    <div className="px-4 pt-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">Post a Skill</h1>
        <p className="text-sm text-gray-500">Share what you know or want to learn ✨</p>
      </motion.div>

      {/* Step 1: Choose Type */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="font-semibold text-gray-700 mb-4">What would you like to do?</h2>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setType('teach'); setStep(2); }}
              className="w-full p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl border-2 border-transparent hover:border-emerald-200 transition-all text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">I want to Teach</h3>
                  <p className="text-sm text-gray-600">Share your expertise and earn SkillCoins</p>
                  <div className="mt-3">
                    <SkillCoinBadge amount="+10-20" type="earn" size="sm" />
                  </div>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setType('learn'); setStep(2); }}
              className="w-full p-6 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl border-2 border-transparent hover:border-amber-200 transition-all text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">I want to Learn</h3>
                  <p className="text-sm text-gray-600">Find someone to teach you a new skill</p>
                  <div className="mt-3">
                    <SkillCoinBadge amount="-10-20" type="spend" size="sm" />
                  </div>
                </div>
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Fill Details */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <button
              onClick={() => setStep(1)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              ← Back
            </button>

            <div className={`p-4 rounded-2xl ${type === 'teach' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
              <div className="flex items-center gap-2">
                {type === 'teach' ? (
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                ) : (
                  <BookOpen className="w-5 h-5 text-amber-600" />
                )}
                <span className={`font-semibold ${type === 'teach' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {type === 'teach' ? 'Teaching a Skill' : 'Looking to Learn'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-700 font-medium">Skill Name *</Label>
                <Input
                  placeholder="e.g., Python Basics, Guitar Chords, Essay Writing"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2 rounded-2xl py-6 bg-white border-gray-100"
                />
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Category *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`p-3 rounded-2xl text-center transition-all ${
                        formData.category === cat.value
                          ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl block mb-1">{cat.icon}</span>
                      <span className="text-xs font-medium">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Level *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {levels.map(level => (
                    <button
                      key={level.value}
                      onClick={() => handleLevelChange(level.value)}
                      className={`p-3 rounded-2xl text-center transition-all ${
                        formData.level === level.value
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-sm font-medium block">{level.label}</span>
                      <span className="text-xs opacity-70">{level.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Duration</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger className="mt-2 rounded-2xl py-6 bg-white">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Description</Label>
                <Textarea
                  placeholder="Describe what you'll teach or want to learn..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2 rounded-2xl bg-white border-gray-100 min-h-[100px]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-700 font-medium">SkillCoins</Label>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-xs text-purple-600">AI Suggested</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl">
                  <button
                    onClick={() => setFormData({ ...formData, skillcoins: Math.max(5, formData.skillcoins - 5) })}
                    className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center">
                    <SkillCoinBadge amount={formData.skillcoins} size="xl" type={type === 'teach' ? 'earn' : 'spend'} />
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, skillcoins: formData.skillcoins + 5 })}
                    className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <Button
              onClick={() => createSkillMutation.mutate()}
              disabled={!isFormValid || createSkillMutation.isPending}
              className={`w-full py-6 rounded-2xl text-lg font-semibold shadow-lg ${
                type === 'teach'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
              }`}
            >
              {createSkillMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Post Skill
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}