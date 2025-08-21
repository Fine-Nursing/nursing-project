import React from 'react';
import { motion } from 'framer-motion';
import { User, Check } from 'lucide-react';
import AnimatedProgressBar from 'src/components/features/onboarding/components/AnimatedProgressBar';

interface FormHeaderProps {
  isSignIn: boolean;
}

export function FormHeader({ isSignIn }: FormHeaderProps) {
  if (isSignIn) {
    return (
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <User className="w-8 h-8 text-slate-600" />
        </motion.div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Welcome back!
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Sign in to save your onboarding progress
        </p>
      </div>
    );
  }

  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <Check className="w-8 h-8 text-white" />
      </motion.div>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
        Final Step!
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Create your account to save all your information
      </p>
      <div className="mt-4">
        <AnimatedProgressBar 
          progress={95} 
          showPercentage={false} 
          height="h-1" 
          className="max-w-xs mx-auto" 
        />
      </div>
    </div>
  );
}