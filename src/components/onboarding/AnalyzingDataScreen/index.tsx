import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from 'src/contexts/ThemeContext';
import { ANALYSIS_STEP_DATA, TECH_KEYWORDS } from './constants';
import { ProgressRing } from './components/ProgressRing';
import { AnalysisStep } from './components/AnalysisStep';
import { FloatingParticles } from './components/FloatingParticles';

export default function AnalyzingDataScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dataPoints, setDataPoints] = useState(0);
  const [currentKeyword, setCurrentKeyword] = useState(0);

  useEffect(() => {
    let currentIndex = 0;
    let stepTimer: NodeJS.Timeout;
    let dataTimer: NodeJS.Timeout;
    let keywordTimer: NodeJS.Timeout;

    // Data points counter animation
    const animateDataPoints = () => {
      setDataPoints(prev => {
        if (prev < 50000) {
          return prev + Math.floor(Math.random() * 1000) + 500;
        }
        return 50000;
      });
      dataTimer = setTimeout(animateDataPoints, 100);
    };

    // Rotating tech keywords
    const rotateKeywords = () => {
      setCurrentKeyword(prev => (prev + 1) % TECH_KEYWORDS.length);
      keywordTimer = setTimeout(rotateKeywords, 800);
    };

    const runAnalysis = () => {
      if (currentIndex < ANALYSIS_STEP_DATA.length) {
        setCurrentStep(currentIndex);
        
        // Update progress smoothly
        const stepProgress = ((currentIndex + 1) / ANALYSIS_STEP_DATA.length) * 100;
        setProgress(stepProgress);

        // Move to next step
        stepTimer = setTimeout(() => {
          currentIndex++;
          runAnalysis();
        }, ANALYSIS_STEP_DATA[currentIndex].duration);
      } else {
        // Analysis complete - redirect to user page
        setTimeout(() => {
          if (userId) {
            router.push(`/users/${userId}`);
          } else {
            router.push('/user-page');
          }
        }, 500);
      }
    };

    // Start all animations
    runAnalysis();
    animateDataPoints();
    rotateKeywords();

    return () => {
      clearTimeout(stepTimer);
      clearTimeout(dataTimer);
      clearTimeout(keywordTimer);
    };
  }, [userId]); // router를 dependency에서 제거

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-black dark:via-slate-900 dark:to-black overflow-hidden relative">
      {/* Floating Particles Background */}
      <FloatingParticles isDark={isDark} />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Analyzing Your Data
            </h1>
            <p className="text-xl text-blue-200 dark:text-slate-400 mb-2">
              Building your personalized nursing career insights
            </p>
            
            {/* Dynamic keyword */}
            <motion.p
              key={currentKeyword}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-emerald-400 font-medium"
            >
              {TECH_KEYWORDS[currentKeyword]}
            </motion.p>

            {/* Data Points Counter */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 inline-block px-4 py-2 bg-blue-800/30 dark:bg-slate-800/50 rounded-full border border-blue-600/30 dark:border-slate-600"
            >
              <span className="text-blue-200 dark:text-slate-300 text-sm">
                Processing: <span className="font-bold text-white">{dataPoints.toLocaleString()}</span> data points
              </span>
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Progress Ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="relative">
                <ProgressRing progress={progress} size={280} strokeWidth={12} />
                
                {/* Glowing effect */}
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 animate-pulse" />
              </div>
            </motion.div>

            {/* Analysis Steps */}
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold text-white mb-6"
              >
                Analysis Pipeline
              </motion.h2>
              
              {ANALYSIS_STEP_DATA.map((stepData, index) => {
                const IconComponent = stepData.icon;
                const step = {
                  ...stepData,
                  icon: <IconComponent className="w-6 h-6" />
                };
                return (
                  <AnalysisStep
                    key={index}
                    step={step}
                    isActive={index === currentStep}
                    isCompleted={index < currentStep}
                    index={index}
                  />
                );
              })}
            </div>
          </div>

          {/* Bottom Status */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 dark:bg-slate-900/50 rounded-full border border-slate-600/30">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-slate-200 dark:text-slate-300">
                AI processing in progress...
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}