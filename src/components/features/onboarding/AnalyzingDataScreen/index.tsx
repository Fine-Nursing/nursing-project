import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, BarChart3, Binary, CircuitBoard, Cpu, Database, GitBranch, Network, Server, Zap } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from 'src/contexts/ThemeContext';
import { useGenerateAllInsights } from 'src/api/ai/useAiInsights';
import useOnboardingStore from 'src/store/onboardingStores';

function AnalyzingDataScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { generateAll } = useGenerateAllInsights();
  const resetForm = useOnboardingStore((state) => state.resetForm);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dataPoints, setDataPoints] = useState(0);
  const [aiGenerationStarted, setAiGenerationStarted] = useState(false);

  const analysisSteps = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Initializing Data Pipeline",
      subtitle: "Establishing secure connection to career database",
      metrics: "50K+ data points",
      duration: 2000
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "Neural Network Processing",
      subtitle: "Analyzing patterns across 10,000+ nursing profiles",
      metrics: "98.5% accuracy",
      duration: 2500
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "AI Model Computation",
      subtitle: "Running predictive algorithms on compensation data",
      metrics: "ML confidence: 94%",
      duration: 2000
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: "Career Path Optimization",
      subtitle: "Mapping optimal progression trajectories",
      metrics: "15 pathways identified",
      duration: 2500
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Generating Insights",
      subtitle: "Synthesizing personalized recommendations",
      metrics: "Processing complete",
      duration: 2000
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Deploying Dashboard",
      subtitle: "Initializing your personalized interface",
      metrics: "Ready to launch",
      duration: 1500
    }
  ];

  useEffect(() => {
    let currentIndex = 0;
    let progressTimer: NodeJS.Timeout;
    let stepTimer: NodeJS.Timeout;

    const runAnalysis = async () => {
      if (currentIndex < analysisSteps.length) {
        setCurrentStep(currentIndex);
        
        // Update progress smoothly
        const stepProgress = ((currentIndex + 1) / analysisSteps.length) * 100;
        setProgress(stepProgress);

        // AI 인사이트 생성 (3번째 단계에서 실행)
        if (currentIndex === 2 && !aiGenerationStarted) {
          setAiGenerationStarted(true);
          console.log('Starting AI insights generation...');
          try {
            const result = await generateAll();
            console.log('AI insights generation result:', result);
          } catch (error) {
            console.error('Failed to generate AI insights:', error);
            // 에러가 발생해도 계속 진행
          }
        }

        // Move to next step
        stepTimer = setTimeout(() => {
          currentIndex++;
          runAnalysis();
        }, analysisSteps[currentIndex].duration);
      } else {
        // Analysis complete - redirect to user page or user profile
        setTimeout(() => {
          if (userId) {
            router.push(`/users/${userId}`);
          } else {
            router.push('/user-page');
          }
        }, 500);
      }
    };

    // Start the analysis sequence
    runAnalysis();

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(stepTimer);
    };
  }, [router, userId, generateAll, aiGenerationStarted]);

  // Reset onboarding form when component unmounts or user navigates away
  useEffect(() => {
    return () => {
      // Clean up onboarding data when leaving the analyzing page
      resetForm();
    };
  }, [resetForm]);

  // Counter animation for data points
  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints(prev => {
        const next = prev + Math.floor(Math.random() * 1000) + 500;
        return next > 50000 ? 50000 : next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-black' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    } flex items-center justify-center p-4 overflow-hidden transition-colors duration-300`}>
      {/* Tech Grid Background */}
      <div className={`absolute inset-0 ${isDark ? 'opacity-10' : 'opacity-5'}`}>
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(${isDark ? '#10b981' : '#10b981'} 1px, transparent 1px),
                           linear-gradient(90deg, ${isDark ? '#10b981' : '#10b981'} 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Animated Circuit Lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute h-px bg-gradient-to-r from-transparent ${
              isDark ? 'via-emerald-500' : 'via-emerald-200'
            } to-transparent ${isDark ? '' : 'opacity-50'}`}
            style={{
              top: `${30 + i * 20}%`,
              width: '100%',
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${
            isDark 
              ? 'bg-gray-900/90 backdrop-blur-xl border-emerald-500/20' 
              : 'bg-white/95 backdrop-blur-sm border-gray-200'
          } rounded-2xl border shadow-2xl p-8 md:p-12 transition-colors duration-300`}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-6">
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <CircuitBoard className={`w-12 h-12 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </motion.div>
              
              <h1 className={`text-4xl font-bold bg-gradient-to-r ${isDark ? 'from-emerald-400 to-cyan-400' : 'from-emerald-600 to-teal-600'} bg-clip-text text-transparent`}>
                AI Analysis Engine
              </h1>
              
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Cpu className={`w-12 h-12 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
              </motion.div>
            </div>
            
            <div className="flex justify-center items-center gap-6 text-sm">
              <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} font-mono font-semibold`}>{dataPoints.toLocaleString()}</span> data points processed
              </div>
              <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                <span className={`${isDark ? 'text-cyan-400' : 'text-teal-600'} font-mono font-semibold`}>256-bit</span> encryption
              </div>
            </div>
          </div>

          {/* Progress Bar with Tech Style */}
          <div className="mb-8">
            <div className="relative">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-gray-200'} rounded-sm h-2 overflow-hidden`}>
                <motion.div
                  className={`h-full bg-gradient-to-r ${isDark ? 'from-emerald-400 via-cyan-400 to-emerald-400' : 'from-emerald-500 via-teal-500 to-emerald-500'} relative`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
                </motion.div>
              </div>
              {/* Progress Markers */}
              <div className="absolute -top-1 left-0 right-0 flex justify-between">
                {analysisSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-sm border-2 ${
                      index <= currentStep 
                        ? `${isDark ? 'bg-emerald-400 border-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30'}` 
                        : `${isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-300 border-gray-400'}`
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-mono`}>
                PROGRESS: {Math.round(progress).toString().padStart(3, '0')}%
              </span>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} font-mono`}>
                PHASE {currentStep + 1}/{analysisSteps.length}
              </span>
            </div>
          </div>

          {/* Current Step Display - Terminal Style */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`${isDark ? 'bg-gray-800/50 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'} border rounded-lg p-6 mb-8`}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className={`${isDark ? 'bg-gray-900 text-emerald-400 border-emerald-500/20' : 'bg-white text-emerald-600 border-emerald-200'} rounded-lg p-3 border`}>
                    {analysisSteps[currentStep]?.icon}
                  </div>
                  <motion.div
                    className={`absolute -top-1 -right-1 w-3 h-3 ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'} rounded-full`}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.3, 1]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'} font-mono`}>
                      {analysisSteps[currentStep]?.title}
                    </h3>
                    <motion.div
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} text-xs font-mono`}
                    >
                      ▮
                    </motion.div>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} font-mono`}>
                    {'>'} {analysisSteps[currentStep]?.subtitle}
                  </p>
                  <div className={`mt-2 text-xs ${isDark ? 'text-cyan-400' : 'text-teal-600'} font-mono`}>
                    [{analysisSteps[currentStep]?.metrics}]
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <Activity className={`w-8 h-8 ${isDark ? 'text-emerald-400' : 'text-emerald-600'} mb-1`} />
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-1 h-3 ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'}`}
                        animate={{
                          scaleY: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Steps Grid - Matrix Style */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {analysisSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`relative border rounded-lg p-3 transition-all ${
                  index < currentStep 
                    ? isDark 
                      ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400' 
                      : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : index === currentStep 
                    ? isDark
                      ? 'bg-emerald-500/10 border-emerald-400 shadow-lg shadow-emerald-500/20' 
                      : 'bg-emerald-100 border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : isDark
                      ? 'bg-gray-900/50 border-gray-700 text-gray-600'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${
                    index <= currentStep 
                      ? isDark ? 'bg-gray-800' : 'bg-white' 
                      : isDark ? 'bg-gray-900' : 'bg-gray-200'
                  }`}>
                    {index < currentStep ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} text-xs font-mono`}
                      >
                        ✓
                      </motion.div>
                    ) : index === currentStep ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className={`w-4 h-4 border-2 ${isDark ? 'border-emerald-400' : 'border-emerald-500'} border-t-transparent rounded-full`}
                      />
                    ) : (
                      <span className={`${isDark ? 'text-gray-600' : 'text-gray-400'} text-xs font-mono`}>
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-mono ${
                    index <= currentStep ? 'font-semibold' : ''
                  }`}>
                    {step.title.split(' ').slice(0, 2).join(' ')}
                  </span>
                </div>
                {index === currentStep && (
                  <motion.div
                    className={`absolute top-0 right-0 w-2 h-2 ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'} rounded-full`}
                    animate={{
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* System Status - Terminal Output */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`${isDark ? 'bg-black/50 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-4 font-mono text-xs`}
          >
            <div className={`${isDark ? 'text-gray-500' : 'text-gray-600'} mb-2`}>[SYSTEM STATUS]</div>
            <div className="space-y-1">
              <div className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>
                ▸ Neural Network: <span className={isDark ? 'text-cyan-400' : 'text-teal-600'}>ACTIVE</span>
              </div>
              <div className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>
                ▸ Data Pipeline: <span className={isDark ? 'text-cyan-400' : 'text-teal-600'}>STREAMING</span>
              </div>
              <div className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>
                ▸ ML Models: <span className={isDark ? 'text-cyan-400' : 'text-teal-600'}>OPTIMIZING</span>
              </div>
              <div className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>
                ▸ Security: <span className={isDark ? 'text-green-400' : 'text-green-600'}>ENCRYPTED</span>
              </div>
              {aiGenerationStarted && (
                <div className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>
                  ▸ AI Insights: <span className={isDark ? 'text-yellow-400' : 'text-yellow-600'}>GENERATING</span>
                </div>
              )}
            </div>
            <div className={`mt-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                █
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default AnalyzingDataScreen;