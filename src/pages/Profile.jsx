import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Camera, LogOut, Star, BookOpen, GraduationCap, MapPin, Settings, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import SkillCoinBadge from '@/components/ui/SkillCoinBadge';
import SkillCard from '@/components/ui/SkillCard';

const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'PhD'];
const branches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemical', 'Biotechnology', 'Mathematics', 'Physics', 'Other'];
const hostels = ['Hostel A', 'Hostel B', 'Hostel C', 'Hostel D', 'Day Scholar'];

export default function Profile() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: mySkills = [], isLoading: skillsLoading } = useQuery({
    queryKey: ['mySkills', user?.email],
    queryFn: () => base44.entities.Skill.filter({ created_by: user?.email }),
    enabled: !!user?.email,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['currentUser']);
      setIsEditing(false);
    },
  });

  const handleEditStart = () => {
    setEditData({
      branch: user?.branch || '',
      year: user?.year || '',
      hostel: user?.hostel || '',
      bio: user?.bio || '',
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(editData);
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  const teachingSkills = mySkills.filter(s => s.type === 'teach');
  const learningSkills = mySkills.filter(s => s.type === 'learn');

  if (userLoading) {
    return (
      <div className="px-4 pt-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 animate-pulse mx-auto mb-4" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="rounded-xl text-gray-500 hover:text-rose-500"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-3xl p-6 mb-6 text-white relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold overflow-hidden">
                  {user?.photo ? (
                    <img src={user.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    user?.full_name?.charAt(0) || 'U'
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Camera className="w-4 h-4 text-purple-600" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold">{user?.full_name || 'Student'}</h2>
                <p className="text-white/70 text-sm">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleEditStart}
              className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {user?.year && (
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                📚 {user.year}
              </span>
            )}
            {user?.branch && (
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                🎓 {user.branch}
              </span>
            )}
            {user?.hostel && (
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                🏠 {user.hostel}
              </span>
            )}
          </div>

          {user?.bio && (
            <p className="mt-4 text-white/80 text-sm">{user.bio}</p>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl mb-1">🪙</div>
          <p className="text-xl font-bold text-gray-800">{user?.skillcoins || 100}</p>
          <p className="text-xs text-gray-500">SkillCoins</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl mb-1">📚</div>
          <p className="text-xl font-bold text-gray-800">{user?.skills_taught_count || 0}</p>
          <p className="text-xs text-gray-500">Taught</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
          <div className="text-2xl mb-1">🎯</div>
          <p className="text-xl font-bold text-gray-800">{user?.skills_learned_count || 0}</p>
          <p className="text-xs text-gray-500">Learned</p>
        </div>
      </motion.div>

      {/* My Teaching Skills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-5 h-5 text-emerald-500" />
          <h3 className="font-semibold text-gray-800">Skills I Teach</h3>
          <span className="text-gray-400 text-sm">({teachingSkills.length})</span>
        </div>
        
        {teachingSkills.length === 0 ? (
          <div className="bg-emerald-50 rounded-2xl p-6 text-center">
            <p className="text-emerald-600 text-sm">No teaching skills posted yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {teachingSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </motion.div>

      {/* My Learning Skills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-gray-800">Skills I Want to Learn</h3>
          <span className="text-gray-400 text-sm">({learningSkills.length})</span>
        </div>
        
        {learningSkills.length === 0 ? (
          <div className="bg-amber-50 rounded-2xl p-6 text-center">
            <p className="text-amber-600 text-sm">No learning goals posted yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {learningSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Edit Profile Sheet */}
      <Sheet open={isEditing} onOpenChange={setIsEditing}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Edit Profile</SheetTitle>
          </SheetHeader>
          
          <div className="py-6 space-y-4">
            <div>
              <Label>Year</Label>
              <Select
                value={editData.year}
                onValueChange={(value) => setEditData({ ...editData, year: value })}
              >
                <SelectTrigger className="mt-2 rounded-2xl">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(y => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Branch</Label>
              <Select
                value={editData.branch}
                onValueChange={(value) => setEditData({ ...editData, branch: value })}
              >
                <SelectTrigger className="mt-2 rounded-2xl">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Hostel</Label>
              <Select
                value={editData.hostel}
                onValueChange={(value) => setEditData({ ...editData, hostel: value })}
              >
                <SelectTrigger className="mt-2 rounded-2xl">
                  <SelectValue placeholder="Select hostel" />
                </SelectTrigger>
                <SelectContent>
                  {hostels.map(h => (
                    <SelectItem key={h} value={h}>{h}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Bio</Label>
              <Input
                placeholder="Tell us about yourself..."
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                className="mt-2 rounded-2xl"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-2xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                className="flex-1 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500"
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}