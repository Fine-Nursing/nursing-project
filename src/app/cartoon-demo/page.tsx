'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function CartoonDemoPage() {
  const [isDark, setIsDark] = useState(false);

  // 사우스파크 스타일 간호사 캐릭터들
  const nurses = [
    { name: 'Stan', level: 'Senior', pay: '$85/hr', specialty: 'ICU', emoji: '👨‍⚕️' },
    { name: 'Kyle', level: 'Junior', pay: '$65/hr', specialty: 'ER', emoji: '👨‍⚕️' },
    { name: 'Cartman', level: 'Beginner', pay: '$45/hr', specialty: 'Pediatric', emoji: '👨‍⚕️' },
    { name: 'Kenny', level: 'Experienced', pay: '$75/hr', specialty: 'Oncology', emoji: '👨‍⚕️' },
  ];

  const stats = [
    { label: 'Total Nurses', value: '50,000+', color: 'bg-red-500' },
    { label: 'Avg Salary', value: '$75K', color: 'bg-blue-500' },
    { label: 'Jobs Posted', value: '10K+', color: 'bg-yellow-500' },
    { label: 'Hospitals', value: '500+', color: 'bg-green-500' },
  ];

  return (
    <div className={`min-h-screen transition-all ${isDark ? 'bg-gray-900' : 'bg-sky-200'}`}>
      {/* 헤더 - 사우스파크 스타일 */}
      <header className={`sticky top-0 z-50 ${isDark ? 'bg-black' : 'bg-red-600'} border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-black text-white transform -skew-x-12 text-stroke-black">
                NURSE PARK
              </div>
              <div className="text-yellow-400 text-2xl animate-bounce">⭐</div>
            </div>
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="px-6 py-2 bg-yellow-400 border-4 border-black rounded-none font-black text-xl hover:bg-yellow-300 transform hover:rotate-2 transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 - 카툰 스타일 */}
      <section className={`relative py-20 ${isDark ? 'bg-gradient-to-b from-purple-900 to-black' : 'bg-gradient-to-b from-yellow-300 to-orange-300'} border-b-8 border-black`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.7 }}
            className={`text-6xl md:text-8xl font-black mb-4 ${isDark ? 'text-white' : 'text-black'} transform -rotate-2`}
            style={{ textShadow: '4px 4px 0 #000, 8px 8px 0 rgba(0,0,0,0.5)' }}
          >
            OH MY GOD!
          </motion.h1>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-yellow-400' : 'text-red-600'} mb-8`}
          >
            They&apos;re tracking nurse salaries!
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 bg-green-400 border-4 border-black rounded-none font-black text-2xl hover:bg-green-300 transform hover:-rotate-2 transition-all shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
          >
            JOIN NOW! 🚀
          </motion.button>
        </div>

        {/* 떠다니는 카툰 구름들 */}
        <div className="absolute top-10 left-10 text-6xl animate-float">☁️</div>
        <div className="absolute top-20 right-20 text-8xl animate-float-delay">☁️</div>
        <div className="absolute bottom-10 left-1/3 text-5xl animate-float">☁️</div>
      </section>

      {/* 통계 섹션 - 코믹 스타일 */}
      <section className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b-8 border-black`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-5xl font-black text-center mb-12 ${isDark ? 'text-white' : 'text-black'} transform rotate-1`}>
            SUPER SWEET STATS!
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
                className={`${stat.color} border-4 border-black p-6 text-center transform hover:z-10 relative shadow-[6px_6px_0_0_rgba(0,0,0,1)]`}
              >
                <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-lg font-bold text-black bg-white px-2 py-1 inline-block transform -rotate-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 간호사 카드 섹션 - 사우스파크 캐릭터 스타일 */}
      <section className={`py-16 ${isDark ? 'bg-purple-900' : 'bg-pink-200'} border-b-8 border-black`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-5xl font-black text-center mb-12 ${isDark ? 'text-yellow-400' : 'text-black'} transform -rotate-2`}>
            NURSE CHARACTERS!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {nurses.map((nurse, index) => (
              <motion.div
                key={nurse.name}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, rotate: 2 }}
                className={`${
                  index % 2 === 0 ? 'bg-cyan-400' : 'bg-yellow-400'
                } border-4 border-black p-6 relative shadow-[8px_8px_0_0_rgba(0,0,0,1)] transform hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)]`}
              >
                {/* 캐릭터 얼굴 */}
                <div className="text-8xl text-center mb-4">{nurse.emoji}</div>
                
                {/* 레벨 뱃지 */}
                <div className="absolute -top-3 -right-3 bg-red-500 border-4 border-black px-3 py-1 transform rotate-12">
                  <span className="font-black text-white text-sm">{nurse.level}</span>
                </div>

                {/* 정보 */}
                <h3 className="text-3xl font-black text-black mb-2">{nurse.name}</h3>
                <div className="space-y-2">
                  <div className="bg-white border-2 border-black px-3 py-1">
                    <span className="font-bold">{nurse.specialty}</span>
                  </div>
                  <div className="bg-green-300 border-2 border-black px-3 py-1">
                    <span className="font-black text-xl">{nurse.pay}</span>
                  </div>
                </div>

                {/* 말풍선 */}
                <div className="absolute -bottom-2 right-4 bg-white border-2 border-black px-2 py-1 transform rotate-6">
                  <span className="text-xs font-bold">AWESOME!</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 차트 섹션 - 코믹 스타일 */}
      <section className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-orange-200'} border-b-8 border-black`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-5xl font-black text-center mb-12 ${isDark ? 'text-white' : 'text-black'} transform rotate-1`}>
            CRAZY CHARTS!
          </h2>
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            {/* 가짜 차트 - 막대 그래프 스타일 */}
            <div className="flex items-end justify-around h-64 mb-4">
              {[80, 65, 90, 75, 85].map((height, index) => (
                <motion.div
                  key={`bar-${index}-${height}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  className={`w-16 ${
                    index % 2 === 0 ? 'bg-blue-500' : 'bg-red-500'
                  } border-4 border-black relative group`}
                  style={{ minHeight: '20px' }}
                >
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 font-black text-lg">
                    ${height}K
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <span className="font-black text-2xl">SALARY COMPARISON</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className={`py-20 ${isDark ? 'bg-black' : 'bg-green-400'} text-center`}>
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-6xl font-black text-white mb-8"
            style={{ textShadow: '4px 4px 0 #000, 8px 8px 0 rgba(0,0,0,0.5)' }}
          >
            SCREW YOU GUYS,
            <br />
            I&apos;M GOING HOME!
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="px-16 py-6 bg-yellow-400 border-4 border-black font-black text-3xl hover:bg-yellow-300 transform hover:rotate-3 transition-all shadow-[12px_12px_0_0_rgba(0,0,0,1)]"
          >
            START NOW! 💥
          </motion.button>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-black text-white py-8 text-center">
        <p className="text-2xl font-black">© 2024 NURSE PARK</p>
        <p className="text-lg mt-2">Respect my authoritah!</p>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(0) translateX(20px); }
          75% { transform: translateY(-10px) translateX(10px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }

        .text-stroke-black {
          -webkit-text-stroke: 3px black;
        }
      `}</style>
    </div>
  );
}