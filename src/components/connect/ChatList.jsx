import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';

export default function ChatList({ chats, isLoading, currentUser, onSelectChat }) {
  const getOtherParticipant = (chat) => {
    if (!chat || !currentUser) return { name: 'Unknown', email: '' };
    const index = chat.participant_emails?.indexOf(currentUser.email) === 0 ? 1 : 0;
    return {
      name: chat.participant_names?.[index] || 'Unknown',
      email: chat.participant_emails?.[index] || '',
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-white/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center">
          <MessageCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="font-semibold text-gray-700 mb-1">No conversations yet</h3>
        <p className="text-sm text-gray-500">Find a skill and start chatting!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {chats.map((chat, index) => {
          const other = getOtherParticipant(chat);
          
          return (
            <motion.button
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectChat(chat.id)}
              className="w-full p-4 bg-white/80 backdrop-blur rounded-2xl flex items-center gap-4 hover:bg-white transition-all shadow-sm hover:shadow-md text-left"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                  {other.name.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800">{other.name}</h3>
                  {chat.last_message_time && (
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(chat.last_message_time), { addSuffix: true })}
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-600 font-medium mb-1">{chat.skill_title}</p>
                <p className="text-sm text-gray-500 truncate">{chat.last_message}</p>
              </div>
              
              {chat.unread_count > 0 && (
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {chat.unread_count}
                </div>
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}