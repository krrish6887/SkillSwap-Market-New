import React from 'react';
import BottomNav from '@/components/ui/BottomNav';

export default function Layout({ children, currentPageName }) {
  const hideNav = ['Login', 'Onboarding'].includes(currentPageName);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <style>{`
        :root {
          --color-primary: #10b981;
          --color-secondary: #f59e0b;
          --color-accent: #06b6d4;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
      
      <main className={`max-w-lg mx-auto min-h-screen ${!hideNav ? 'pb-24' : ''}`}>
        {children}
      </main>
      
      {!hideNav && <BottomNav currentPage={currentPageName} />}
    </div>
  );
}