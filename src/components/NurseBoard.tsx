'use client';

import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import type { NurseJobInfo } from './card/NurseCard';
import NurseCard from './card/NurseCard';

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

function NurseBoard() {
  const [rotations, setRotations] = useState<number[]>([]);

  useEffect(() => {
    // 컴포넌트 마운트 시 한 번만 회전값 설정
    setRotations([0.5, -0.3, 0.2, -0.4]);
  }, []);
  interface NursePosition {
    id: string;
    title: string;
    subtitle: string;
    className?: string;
    jobInfo: NurseJobInfo;
  }

  const nurses: NursePosition[] = [
    {
      id: 'senior-icu-nurse',
      title: 'Senior Nurse',
      subtitle: 'Join our ICU team and make a difference in critical care',
      className: 'bg-emerald-300',
      jobInfo: {
        id: 'nurse-icu-1',
        hospitalName: 'City General Hospital',
        location: 'Manhattan, NY',
        specialty: 'Critical Care',
        totalPay: 52.75,
        cultureRating: 8.5,
        differentials: 7.55,
      },
    },
    {
      id: 'specialist-emergency-nurse',
      title: 'Specialist Nurse',
      subtitle: 'Be part of our emergency response team',
      className: 'bg-blue-300',
      jobInfo: {
        id: 'nurse-emergency-1',
        hospitalName: 'Metro Medical Center',
        location: 'Brooklyn, NY',
        specialty: 'Emergency Care',
        totalPay: 58.2,
        cultureRating: 7.8,
        differentials: 9.7,
      },
    },
    {
      id: 'head-pediatrics-nurse',
      title: 'Head Nurse',
      subtitle: 'Lead our pediatrics department with care and compassion',
      className: 'bg-pink-300',
      jobInfo: {
        id: 'nurse-pediatrics-1',
        hospitalName: "Children's Wellness Hospital",
        location: 'Queens, NY',
        specialty: 'Pediatrics',
        totalPay: 62.3,
        cultureRating: 9.2,
        differentials: 9.55,
      },
    },
    {
      id: 'staff-surgery-nurse',
      title: 'Staff Nurse',
      subtitle: 'Join our surgical team and grow your career',
      className: 'bg-yellow-300',
      jobInfo: {
        id: 'nurse-surgery-1',
        hospitalName: 'Riverside Surgical Center',
        location: 'Bronx, NY',
        specialty: 'Surgical Care',
        totalPay: 47.8,
        cultureRating: 7.2,
        differentials: 5.3,
      },
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Board Header with Trust Indicator */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Position Board
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Recently posted positions
              </p>
            </div>
            <div className="flex gap-2">
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

          {/* Trust Indicator Bar */}
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

      {/* Board Content */}
      <div className="p-6">
        <div
          className="relative rounded-lg bg-slate-50 p-8"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.025) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: 'center center',
          }}
        >
          <div
            className="absolute inset-0 rounded-lg opacity-50"
            style={{
              background:
                'linear-gradient(to right, rgba(255,255,255,0.5), transparent)',
            }}
          />

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nurses.map((nurse, index) => (
              <div
                key={nurse.id}
                className="transform transition-all duration-200"
                style={{
                  transform: `rotate(${rotations[index] || 0}deg)`,
                }}
              >
                <NurseCard {...nurse} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Board Footer */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex justify-between items-center text-sm text-slate-600">
          <span>Showing {nurses.length} positions</span>
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

export default NurseBoard;
