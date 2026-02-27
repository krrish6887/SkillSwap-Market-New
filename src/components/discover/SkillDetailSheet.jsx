import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Star, Clock, MapPin, MessageCircle, Calendar, User, Sparkles } from 'lucide-react';
import SkillCoinBadge from '@/components/ui/SkillCoinBadge';

export default function SkillDetailSheet({ skill, onClose, currentUser }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isBooking, setIsBooking] = useState(false);

  const createChatMutation = useMutation({
    mutationFn: async () => {
      // Check if chat already exists
      const existingChats = await base44.entities.Chat.filter({
        skill_id: skill.id,
      });
      
      const myChat = existingChats.find(c => 
        c.participant_emails?.includes(currentUser?.email) &&
        c.participant_emails?.includes(skill.created_by)
      );
      
      if (myChat) return myChat;
      
      // Create new chat
      return base44.entities.Chat.create({
        participant_emails: [currentUser?.email, skill.created_by],
        participant_names: [currentUser?.full_name, skill.user_name],
        skill_id: skill.id,
        skill_title: skill.title,
        last_message: 'Chat started',
        last_message_time: new Date().toISOString(),
        unread_count: 0,
      });
    },
    onSuccess: (chat) => {
      queryClient.invalidateQueries(['chats']);
      navigate(createPageUrl('Connect') + `?chatId=${chat.id}`);
    },
  });

  if (!skill) return null;

  const isTeach = skill.type === 'teach';
  const isOwnSkill = skill.created_by === currentUser?.email;

  return (
    <Sheet open={!!skill} onOpenChange={() => onClose()}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left">
          <div className="flex items-start justify-between">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                isTeach ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {isTeach ? '📚 Learn This' : '🎯 Teach This'}
              </span>
              <SheetTitle className="text-2xl">{skill.title}</SheetTitle>
            </div>
            <SkillCoinBadge 
              amount={skill.skillcoins} 
              size="lg" 
              type={isTeach ? 'spend' : 'earn'}
            />
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Teacher/Learner Profile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {skill.user_photo ? (
                <img src={skill.user_photo} alt="" className="w-full h-full object-cover" />
              ) : (
                skill.user_name?.charAt(0) || 'U'
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{skill.user_name || 'Student'}</h3>
              <p className="text-sm text-gray-500">{skill.user_year} • {skill.user_branch}</p>
              {skill.user_hostel && (
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" /> {skill.user_hostel}
                </p>
              )}
            </div>
            {skill.rating > 0 && (
              <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-xl shadow-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-gray-700">{skill.rating?.toFixed(1)}</span>
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-xs text-gray-500 mb-1">Category</p>
              <p className="font-semibold text-gray-700">{skill.category}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <p className="text-xs text-gray-500 mb-1">Level</p>
              <p className="font-semibold text-gray-700">{skill.level}</p>
            </div>
            {skill.duration && (
              <div className="p-4 bg-gray-50 rounded-2xl col-span-2">
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {skill.duration}
                </p>
              </div>
            )}
          </motion.div>

          {/* Description */}
          {skill.description && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h4 className="font-semibold text-gray-700 mb-2">About this skill</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{skill.description}</p>
            </motion.div>
          )}

          {/* AI Match Indicator */}
          {currentUser?.interests?.some(i => skill.category?.toLowerCase().includes(i.toLowerCase())) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100"
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
              <div>
                <p className="font-semibold text-purple-700 text-sm">Great match for you!</p>
                <p className="text-xs text-purple-500">Based on your interests</p>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          {!isOwnSkill && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex gap-3 pt-2"
            >
              <Button
                onClick={() => createChatMutation.mutate()}
                disabled={createChatMutation.isPending}
                className="flex-1 py-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {createChatMutation.isPending ? 'Connecting...' : 'Start Chat'}
              </Button>
            </motion.div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}