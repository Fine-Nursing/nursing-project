'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';

import NurseCard from './card/NurseCard';
import type { CompensationCard } from './card/NurseCard';

// -----------------------------------------
// 1) AnimatedCounter
// -----------------------------------------
function AnimatedCounter({ baseValue }: { baseValue: number }) {
  const [count, setCount] = useState<number>(baseValue);

  useEffect(() => {
    const randomIncrease = (): number => Math.floor(Math.random() * 3) + 1;
    const getRandomInterval = (): number =>
      Math.floor(Math.random() * 3000) + 2000;

    let timeout: NodeJS.Timeout;
    const updateCount = () => {
      setCount((prev) => prev + randomIncrease());
      timeout = setTimeout(updateCount, getRandomInterval());
    };
    timeout = setTimeout(updateCount, getRandomInterval());
    return () => clearTimeout(timeout);
  }, []);

  return <span>{count.toLocaleString()}+</span>;
}

// -----------------------------------------
// 3) 전체 Nurse 데이터
// -----------------------------------------
// CompensationCard 타입에 맞춘 데이터
const allNurseData: CompensationCard[] = [
  // Senior Nurses (10+ years)
  {
    id: 'senior-1',
    hospital: 'City General Hospital',
    state: 'NY',
    city: 'Manhattan',
    specialty: 'Critical Care',
    totalPay: 52.75,
    basePay: 45.2,
    differentialPay: 7.55,
    unitCulture: 8.5,
    unitFeedback: 'Join our ICU team - excellent mentorship program',
    experienceLevel: 'senior',
    nursingRole: 'Senior Nurse',
    shiftType: 'Night',
    employmentType: 'Full-time',
    yearsOfExperience: 12.5,
  },
  {
    id: 'senior-2',
    hospital: 'Green Valley Nursing Home',
    state: 'NY',
    city: 'Brooklyn',
    specialty: 'Geriatrics',
    totalPay: 49.8,
    basePay: 44.8,
    differentialPay: 5.0,
    unitCulture: 8.1,
    unitFeedback: 'Leadership opportunities in long-term care',
    experienceLevel: 'senior',
    nursingRole: 'Senior Nurse',
    shiftType: 'Day',
    employmentType: 'Full-time',
    yearsOfExperience: 15.0,
  },

  // Experienced Nurses (5-10 years)
  {
    id: 'experienced-1',
    hospital: 'Metro Medical Center',
    state: 'NY',
    city: 'Brooklyn',
    specialty: 'Emergency Care',
    totalPay: 58.2,
    basePay: 48.5,
    differentialPay: 9.7,
    unitCulture: 7.8,
    unitFeedback: 'Fast-paced ER environment with great team support',
    experienceLevel: 'experienced',
    nursingRole: 'ER Specialist',
    shiftType: 'Rotating',
    employmentType: 'Full-time',
    yearsOfExperience: 7.5,
  },
  {
    id: 'experienced-2',
    hospital: 'Riverside Surgical Center',
    state: 'NY',
    city: 'Bronx',
    specialty: 'Surgical Care',
    totalPay: 54.6,
    basePay: 49.3,
    differentialPay: 5.3,
    unitCulture: 7.9,
    unitFeedback: 'Advanced surgical procedures with cutting-edge technology',
    experienceLevel: 'experienced',
    nursingRole: 'OR Specialist',
    shiftType: 'Day',
    employmentType: 'Full-time',
    yearsOfExperience: 8.0,
  },
  {
    id: 'experienced-3',
    hospital: "Children's Wellness Hospital",
    state: 'NY',
    city: 'Queens',
    specialty: 'Pediatrics',
    totalPay: 62.3,
    basePay: 52.75,
    differentialPay: 9.55,
    unitCulture: 9.2,
    unitFeedback: 'Lead our caring pediatrics department',
    experienceLevel: 'experienced',
    nursingRole: 'Head Nurse',
    shiftType: 'Day',
    employmentType: 'Full-time',
    yearsOfExperience: 9.5,
  },

  // Junior Nurses (2-5 years)
  {
    id: 'junior-1',
    hospital: 'General Healthcare Center',
    state: 'NY',
    city: 'Bronx',
    specialty: 'Medical-Surgical',
    totalPay: 45.6,
    basePay: 45.6,
    differentialPay: 0,
    unitCulture: 7.3,
    unitFeedback: 'Great learning environment for Med-Surg experience',
    experienceLevel: 'junior',
    nursingRole: 'Staff Nurse',
    shiftType: 'Day',
    employmentType: 'Full-time',
    yearsOfExperience: 3.5,
  },

  // Beginner Nurses (< 2 years)
  {
    id: 'beginner-1',
    hospital: 'Riverside Surgical Center',
    state: 'NY',
    city: 'Bronx',
    specialty: 'Surgical Care',
    totalPay: 47.8,
    basePay: 42.5,
    differentialPay: 5.3,
    unitCulture: 7.2,
    unitFeedback: 'Join our surgical team and grow your career',
    experienceLevel: 'beginner',
    nursingRole: 'Staff Nurse',
    shiftType: 'Night',
    employmentType: 'Full-time',
    yearsOfExperience: 1.5,
  },
];

// -----------------------------------------
// 대표 카드(Title별 1장) 필터
// -----------------------------------------
function getRepresentativeCards(data: CompensationCard[]): CompensationCard[] {
  const uniqueExperienceLevels = [
    'beginner',
    'junior',
    'experienced',
    'senior',
  ] as const;

  return uniqueExperienceLevels
    .map((level) => data.find((card) => card.experienceLevel === level))
    .filter(Boolean) as CompensationCard[];
}

// -----------------------------------------
// NurseBoard
// -----------------------------------------
export default function NurseBoard() {
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  // 대표 vs 상세 목록
  const representativeCards = useMemo(
    () => getRepresentativeCards(allNurseData),
    []
  );
  const currentList = useMemo(() => {
    if (!selectedTitle) return representativeCards;
    return allNurseData.filter(
      (item) => item.experienceLevel === selectedTitle
    );
  }, [selectedTitle, representativeCards]);

  // 열, 행 간격 (카드 폭+여백 고려)
  const colWidth = 280; // 카드 실제 폭보다 조금 넉넉히
  const rowHeight = 460; // 카드 높이+여백 고려

  // (x,y) 위치 계산
  function getGridPosition(index: number) {
    const col = index % 4;
    const row = Math.floor(index / 4);
    return {
      x: col * colWidth,
      y: row * rowHeight,
    };
  }

  // 클릭 (대표 -> 상세)
  const handleCardClick = (title: string) => {
    if (!selectedTitle) {
      setSelectedTitle(title);
    }
  };
  // 뒤로가기
  const handleBack = () => {
    setSelectedTitle(null);
  };

  // ▼ 현재 표시되는 카드 수에 따라 "행 개수"를 구해 보드 높이 동적 계산
  const rowCount = Math.ceil(currentList.length / 4);
  const boardHeight = rowCount * rowHeight;

  // 컨테이너 variants (페이드/슬라이드)
  const containerVariants: Variants = {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        when: 'beforeChildren',
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  // 카드 variants
  const cardVariants: Variants = {
    initial: () => ({
      opacity: 0,
      scale: 0.8,
      rotateZ: -10,
      x: 0,
      y: 0, // 딜러(0,0)
    }),
    animate: (index: number) => {
      const { x, y } = getGridPosition(index);
      return {
        opacity: 1,
        scale: 1,
        rotateZ: 0,
        x,
        y,
        transition: { type: 'spring', stiffness: 300, damping: 25 },
      };
    },
    exit: (index: number) => ({
      opacity: 0,
      scale: 0.8,
      rotateZ: 10 + index * 3,
      x: 0,
      y: 0, // 수거
      transition: { duration: 0.3 },
    }),
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex flex-col space-y-4">
          {/* 상단 바 */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Compensation Board
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Recently posted compensations
              </p>
            </div>
            <div className="flex gap-2">
              {selectedTitle && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-3 py-1.5 text-sm font-medium rounded bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                >
                  ← Back
                </button>
              )}
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Filter
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                View All
              </button>
            </div>
          </div>

          {/* 지표 */}
          <div className="flex items-center justify-start space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex items-center space-x-2 text-purple-600">
              <Users size={20} className="animate-pulse" />
              <span className="text-lg font-semibold">
                <AnimatedCounter baseValue={10000} />
              </span>
            </div>
            <span className="text-sm text-slate-600">
              verified nurses have shared their data
            </span>
            <div className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600" />
              </span>
              <span className="text-xs text-purple-600 font-medium ml-1 bg-purple-50 px-2 py-0.5 rounded-full">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="p-6">
        {/*
          겉보기엔 "grid grid-cols-4 gap-6"로 유지
          실제 카드들은 absolute (0,0) -> (x,y)
        */}
        <div
          className="relative rounded-lg bg-slate-50 p-8 overflow-hidden grid grid-cols-4 gap-6"
          style={{
            position: 'relative',
            // 동적 높이: 행개수 * rowHeight
            minHeight: boardHeight,
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.025) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: 'center center',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none rounded-lg"
            style={{
              background:
                'linear-gradient(to right, rgba(255,255,255,0.5), transparent)',
              opacity: 0.5,
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTitle ? 'detail' : 'rep'}
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative w-full h-full"
            >
              {currentList.map((nurse, index) => (
                <motion.button
                  key={nurse.id}
                  type="button"
                  onClick={() => handleCardClick(nurse.experienceLevel)}
                  variants={cardVariants}
                  custom={index}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                  }}
                  className="cursor-pointer focus:outline-none"
                >
                  <NurseCard card={nurse} />
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex justify-between items-center text-sm text-slate-600">
          <span>
            Showing {currentList.length}{' '}
            {selectedTitle ? 'positions' : 'titles'}
          </span>
          <button
            type="button"
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}
