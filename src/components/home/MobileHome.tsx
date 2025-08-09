'use client';

import React, { useState, lazy, Suspense } from 'react';
import { Home, Search, TrendingUp, User, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load components
const MobileCardBoardV2 = lazy(() => import('src/components/CardBoard/MobileCardBoardV2'));
const MobileNursingGraphV2 = lazy(() => import('src/components/graph/MobileNursingGraphV2'));

interface MobileHomeProps {
  user: any;
  onSignOut: () => void;
  onShowLogin: () => void;
  onShowSignUp: () => void;
  onOnboardingClick: () => void;
}

export default function MobileHome({
  user,
  onSignOut,
  onShowLogin,
  onShowSignUp,
  onOnboardingClick,
}: MobileHomeProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'trends' | 'profile'>('home');
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  // Tab content renderer
  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return (
          <div className="min-h-screen pb-16">
            {/* Quick Stats Header */}
            <div className="bg-gradient-to-b from-emerald-500 to-emerald-600 text-white px-4 py-6">
              <h1 className="text-2xl font-bold mb-2">
                {user ? `Welcome back!` : 'Nurse Salaries'}
              </h1>
              <p className="text-sm opacity-90">Real data from 50,000+ nurses</p>
              
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
                  <div className="text-xl font-bold">$85</div>
                  <div className="text-xs opacity-90">Avg/hr</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
                  <div className="text-xl font-bold">$125</div>
                  <div className="text-xs opacity-90">Top/hr</div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
                  <div className="text-xl font-bold">Live</div>
                  <div className="text-xs opacity-90">Data</div>
                </div>
              </div>
              
              {!user && (
                <button
                  onClick={onOnboardingClick}
                  className="w-full mt-4 py-3 bg-white text-emerald-600 rounded-full font-semibold"
                >
                  See Your Worth →
                </button>
              )}
            </div>

            {/* Salary Cards */}
            <div className="px-4 py-4">
              <h2 className="text-lg font-semibold mb-3">Latest Salaries</h2>
              <Suspense fallback={
                <div className="space-y-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              }>
                <MobileCardBoardV2 
                  filters={{}}
                  onFiltersChange={() => {}}
                />
              </Suspense>
            </div>
          </div>
        );
        
      case 'search':
        return (
          <div className="min-h-screen pb-16">
            <div className="sticky top-0 bg-white dark:bg-black border-b p-4 z-10">
              <h2 className="text-lg font-semibold mb-2">Search Positions</h2>
              <input
                type="search"
                placeholder="Search by specialty, location..."
                className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-900 rounded-full text-sm"
              />
            </div>
            <div className="px-4 py-4">
              <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
                <MobileCardBoardV2 
                  filters={{}}
                  onFiltersChange={() => {}}
                />
              </Suspense>
            </div>
          </div>
        );
        
      case 'trends':
        return (
          <div className="min-h-screen pb-16">
            <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
              <MobileNursingGraphV2 />
            </Suspense>
          </div>
        );
        
      case 'profile':
        return (
          <div className="min-h-screen pb-16 px-4 py-6">
            {user ? (
              <div className="space-y-4">
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-4">
                  <h3 className="font-semibold mb-2">Your Account</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">{user.email}</p>
                  <button
                    onClick={onOnboardingClick}
                    className="w-full py-2 bg-emerald-500 text-white rounded-lg font-medium mb-2"
                  >
                    View My Profile
                  </button>
                  <button
                    onClick={onSignOut}
                    className="w-full py-2 bg-red-500 text-white rounded-lg font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-semibold mb-2">Join 50,000+ Nurses</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4">
                    Share your salary anonymously and see how you compare
                  </p>
                  <button
                    onClick={onShowSignUp}
                    className="w-full py-3 bg-emerald-500 text-white rounded-lg font-semibold mb-2"
                  >
                    Sign Up Free
                  </button>
                  <button
                    onClick={onShowLogin}
                    className="w-full py-3 border border-gray-300 dark:border-zinc-700 rounded-lg font-medium"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'home' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'home' ? 'text-emerald-500' : 'text-gray-500'
            }`}
          >
            <Home size={20} />
            <span className="text-xs">Home</span>
          </button>
          
          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'search' ? 'text-emerald-500' : 'text-gray-500'
            }`}
          >
            <Search size={20} />
            <span className="text-xs">Search</span>
          </button>
          
          <button
            onClick={() => setActiveTab('trends')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'trends' ? 'text-emerald-500' : 'text-gray-500'
            }`}
          >
            <TrendingUp size={20} />
            <span className="text-xs">Trends</span>
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'profile' ? 'text-emerald-500' : 'text-gray-500'
            }`}
          >
            <User size={20} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}