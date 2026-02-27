import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Calendar, MapPin, Clock, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ChatList from '@/components/connect/ChatList';
import BookingCard from '@/components/connect/BookingCard';
import SkillCoinBadge from '@/components/ui/SkillCoinBadge';

export default function Connect() {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  // Get chatId from URL if provided
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatId = params.get('chatId');
    if (chatId) setSelectedChatId(chatId);
  }, []);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: chats = [], isLoading: chatsLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const allChats = await base44.entities.Chat.list('-last_message_time');
      return allChats.filter(c => c.participant_emails?.includes(user?.email));
    },
    enabled: !!user,
  });

  const selectedChat = chats.find(c => c.id === selectedChatId);

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', selectedChatId],
    queryFn: () => base44.entities.Message.filter({ chat_id: selectedChatId }, 'created_date', 100),
    enabled: !!selectedChatId,
    refetchInterval: 3000,
  });

  const { data: booking } = useQuery({
    queryKey: ['booking', selectedChat?.skill_id],
    queryFn: async () => {
      if (!selectedChat?.skill_id) return null;
      const bookings = await base44.entities.Booking.filter({ skill_id: selectedChat.skill_id });
      return bookings.find(b => 
        b.teacher_email === user?.email || b.learner_email === user?.email
      );
    },
    enabled: !!selectedChat?.skill_id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content) => {
      await base44.entities.Message.create({
        chat_id: selectedChatId,
        sender_email: user?.email,
        sender_name: user?.full_name,
        content,
        type: 'text',
      });
      
      await base44.entities.Chat.update(selectedChatId, {
        last_message: content,
        last_message_time: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', selectedChatId]);
      queryClient.invalidateQueries(['chats']);
      setMessageText('');
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    sendMessageMutation.mutate(messageText.trim());
  };

  const getOtherParticipant = (chat) => {
    if (!chat || !user) return { name: 'Unknown', email: '' };
    const index = chat.participant_emails?.indexOf(user.email) === 0 ? 1 : 0;
    return {
      name: chat.participant_names?.[index] || 'Unknown',
      email: chat.participant_emails?.[index] || '',
    };
  };

  if (selectedChatId && selectedChat) {
    const other = getOtherParticipant(selectedChat);
    
    return (
      <div className="flex flex-col h-[calc(100vh-6rem)]">
        {/* Chat Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-4 bg-white/80 backdrop-blur-lg border-b border-gray-100"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedChatId(null)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold">
              {other.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{other.name}</h3>
              <p className="text-xs text-gray-500">{selectedChat.skill_title}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* Booking Card if exists */}
          {booking && (
            <BookingCard booking={booking} currentUser={user} />
          )}
          
          <AnimatePresence>
            {messages.map((msg, index) => {
              const isMe = msg.sender_email === user?.email;
              
              if (msg.type === 'booking') {
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <BookingCard booking={msg.booking_data} currentUser={user} />
                  </motion.div>
                );
              }
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                      isMe
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md'
                        : 'bg-white text-gray-800 shadow-sm rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 bg-white/80 backdrop-blur-lg border-t border-gray-100"
        >
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 rounded-2xl border-0 bg-gray-100 py-6"
            />
            <Button
              onClick={handleSend}
              disabled={!messageText.trim() || sendMessageMutation.isPending}
              className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
        <p className="text-sm text-gray-500">Connect with your skill buddies 💬</p>
      </motion.div>

      <ChatList
        chats={chats}
        isLoading={chatsLoading}
        currentUser={user}
        onSelectChat={setSelectedChatId}
      />
    </div>
  );
}