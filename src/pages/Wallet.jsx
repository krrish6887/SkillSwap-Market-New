import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Sparkles, Gift } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, subDays } from 'date-fns';
import SkillCoinBadge from '@/components/ui/SkillCoinBadge';

export default function Wallet() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 50),
  });

  const myTransactions = transactions.filter(t => t.created_by === user?.email);

  // Generate chart data from transactions
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayTransactions = myTransactions.filter(t => {
      const tDate = new Date(t.created_date);
      return tDate.toDateString() === date.toDateString();
    });
    
    const earned = dayTransactions
      .filter(t => t.type === 'earned' || t.type === 'bonus')
      .reduce((sum, t) => sum + t.amount, 0);
    const spent = dayTransactions
      .filter(t => t.type === 'spent')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      day: format(date, 'EEE'),
      earned,
      spent,
      net: earned - spent,
    };
  });

  const totalEarned = myTransactions
    .filter(t => t.type === 'earned' || t.type === 'bonus')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = myTransactions
    .filter(t => t.type === 'spent')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = user?.skillcoins || 100;

  return (
    <div className="px-4 pt-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">Wallet</h1>
        <p className="text-sm text-gray-500">Your SkillCoin balance 💰</p>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-3xl p-6 mb-6 shadow-xl relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <p className="text-white/70 text-sm mb-2">Total Balance</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">🪙</span>
            <span className="text-5xl font-bold text-white">{balance.toLocaleString()}</span>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2">
              <ArrowUpRight className="w-4 h-4 text-emerald-300" />
              <span className="text-white text-sm font-medium">+{totalEarned}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2">
              <ArrowDownRight className="w-4 h-4 text-rose-300" />
              <span className="text-white text-sm font-medium">-{totalSpent}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-gray-600">Earned</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">+{totalEarned}</p>
        </div>
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-rose-500" />
            <span className="text-sm text-gray-600">Spent</span>
          </div>
          <p className="text-2xl font-bold text-rose-600">-{totalSpent}</p>
        </div>
      </motion.div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-4 mb-6 shadow-sm"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Weekly Activity</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorEarned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  background: 'white', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="earned" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorEarned)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-semibold text-gray-800 mb-3">Recent Activity</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : myTransactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-white rounded-3xl"
          >
            <div className="text-5xl mb-3">💫</div>
            <h4 className="font-semibold text-gray-700 mb-1">No transactions yet</h4>
            <p className="text-sm text-gray-500">Start learning or teaching to earn SkillCoins!</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {myTransactions.slice(0, 10).map((tx, index) => {
                const isEarn = tx.type === 'earned' || tx.type === 'bonus';
                
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isEarn ? 'bg-emerald-100' : 'bg-rose-100'
                    }`}>
                      {tx.type === 'bonus' ? (
                        <Gift className={`w-6 h-6 text-emerald-600`} />
                      ) : isEarn ? (
                        <ArrowUpRight className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="w-6 h-6 text-rose-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{tx.description}</p>
                      {tx.other_user && (
                        <p className="text-xs text-gray-500">with {tx.other_user}</p>
                      )}
                    </div>
                    
                    <div className={`font-bold ${isEarn ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isEarn ? '+' : '-'}{tx.amount}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}