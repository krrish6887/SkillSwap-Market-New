import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Compass, MessageCircle, PlusCircle, Wallet, User } from 'lucide-react';

const navItems = [
  { name: 'Discover', icon: Compass, page: 'Discover' },
  { name: 'Connect', icon: MessageCircle, page: 'Connect' },
  { name: 'Post', icon: PlusCircle, page: 'PostSkill' },
  { name: 'Wallet', icon: Wallet, page: 'Wallet' },
  { name: 'Profile', icon: User, page: 'Profile' },
];

export default function BottomNav({ currentPage }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 pb-safe">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const isActive = currentPage === item.page;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={createPageUrl(item.page)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon 
                className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-xs font-medium ${isActive ? 'text-emerald-600' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}