import React from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, MapPin, Clock, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import SkillCoinBadge from '@/components/ui/SkillCoinBadge';

export default function BookingCard({ booking, currentUser }) {
  const queryClient = useQueryClient();

  const updateBookingMutation = useMutation({
    mutationFn: async ({ status }) => {
      await base44.entities.Booking.update(booking.id, { status });
      
      if (status === 'completed') {
        // Transfer coins
        await base44.entities.Transaction.create({
          type: 'earned',
          amount: booking.skillcoins,
          description: `Teaching ${booking.skill_title}`,
          skill_title: booking.skill_title,
          other_user: booking.learner_name,
          status: 'completed',
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['booking']);
    },
  });

  const statusColors = {
    pending: 'from-amber-50 to-yellow-50 border-amber-200',
    confirmed: 'from-blue-50 to-cyan-50 border-blue-200',
    in_progress: 'from-purple-50 to-violet-50 border-purple-200',
    completed: 'from-emerald-50 to-teal-50 border-emerald-200',
    cancelled: 'from-gray-50 to-slate-50 border-gray-200',
  };

  const statusLabels = {
    pending: '⏳ Pending',
    confirmed: '✅ Confirmed',
    in_progress: '🎯 In Progress',
    completed: '🎉 Completed',
    cancelled: '❌ Cancelled',
  };

  const isTeacher = booking.teacher_email === currentUser?.email;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${statusColors[booking.status]} border rounded-2xl p-4 my-4`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold">{statusLabels[booking.status]}</span>
        <SkillCoinBadge amount={booking.skillcoins} size="sm" type={isTeacher ? 'earn' : 'spend'} />
      </div>

      <h4 className="font-bold text-gray-800 mb-3">{booking.skill_title}</h4>

      <div className="space-y-2 mb-4">
        {booking.scheduled_time && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            {format(new Date(booking.scheduled_time), 'PPp')}
          </div>
        )}
        {booking.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            {booking.location}
          </div>
        )}
      </div>

      {booking.escrow_held && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 bg-white/50 p-2 rounded-lg">
          <Clock className="w-3 h-3" />
          <span>🔒 SkillCoins held in escrow</span>
        </div>
      )}

      {booking.status === 'pending' && isTeacher && (
        <div className="flex gap-2">
          <Button
            onClick={() => updateBookingMutation.mutate({ status: 'confirmed' })}
            disabled={updateBookingMutation.isPending}
            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500"
            size="sm"
          >
            <Check className="w-4 h-4 mr-1" />
            Accept
          </Button>
          <Button
            onClick={() => updateBookingMutation.mutate({ status: 'cancelled' })}
            disabled={updateBookingMutation.isPending}
            variant="outline"
            className="flex-1 rounded-xl"
            size="sm"
          >
            <X className="w-4 h-4 mr-1" />
            Decline
          </Button>
        </div>
      )}

      {booking.status === 'confirmed' && (
        <Button
          onClick={() => updateBookingMutation.mutate({ status: 'completed' })}
          disabled={updateBookingMutation.isPending}
          className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-violet-500"
          size="sm"
        >
          {updateBookingMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>Mark as Complete</>
          )}
        </Button>
      )}
    </motion.div>
  );
}