'use client';

import type { ReactNode } from 'react';
import React from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { MapPin, DollarSign, Activity, Building, Star } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

// Import from your types file
// import type { CompensationCard } from '@/types/dashboard';

// For this component, defining the type directly
export interface CompensationCard {
  id: string;
  hospital: string;
  state: string;
  city: string;
  specialty: string;
  totalPay: number;
  basePay: number;
  differentialPay: number;
  unitCulture: number;
  unitFeedback: string;
  experienceLevel: 'beginner' | 'junior' | 'experienced' | 'senior';
  nursingRole: string;
  shiftType: string;
  employmentType: string;
  yearsOfExperience: number;
}

export interface NurseCardProps {
  card: CompensationCard;
  className?: string;
}

// Soft gradient background (pastel rose/pink)
const cardGradientClasses =
  'bg-gradient-to-br from-pink-50 via-rose-50 to-rose-100 hover:from-pink-100 hover:to-rose-200';

// "Bubble" style info item
function InfoItem({
  icon,
  label,
  text,
}: {
  icon: ReactNode;
  label?: string;
  text: string | number;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white/60 p-2 shadow-sm ring-1 ring-rose-100 backdrop-blur-sm">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        {icon}
      </div>
      {label ? (
        <span className="text-sm font-medium text-rose-800">
          {label} <span className="font-normal">{text}</span>
        </span>
      ) : (
        <span className="text-sm font-medium text-rose-800">{text}</span>
      )}
    </div>
  );
}

// Enhanced Pay Breakdown Component - 크기 최적화
function PayBreakdown({ card }: { card: CompensationCard }) {
  const basePercentage = (card.basePay / card.totalPay) * 100;
  const diffPercentage =
    card.differentialPay > 0 ? (card.differentialPay / card.totalPay) * 100 : 0;

  return (
    <div className="rounded-xl bg-white/80 p-3 shadow-sm ring-1 ring-rose-200/50 backdrop-blur-sm border border-white/60">
      {/* Total Pay Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600 shadow-sm">
            <DollarSign size={14} />
          </div>
          <span className="text-sm font-semibold text-gray-700">Total Pay</span>
        </div>
        <span className="text-lg font-bold text-emerald-600 tracking-tight">
          ${card.totalPay.toLocaleString()}/hr
        </span>
      </div>

      {/* 한 줄 비율 바 - 향상된 디자인 */}
      <div className="space-y-2">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100 shadow-inner">
          {/* Base Pay 부분 - 그라데이션 */}
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-rose-300 to-rose-400 transition-all duration-300 ease-out shadow-sm"
            style={{ width: `${basePercentage}%` }}
          />
          {/* Differential Pay 부분 - 그라데이션 */}
          {card.differentialPay > 0 && (
            <div
              className="absolute top-0 h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300 ease-out shadow-sm"
              style={{
                left: `${basePercentage}%`,
                width: `${diffPercentage}%`,
              }}
            />
          )}
          {/* 하이라이트 효과 */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-full" />
        </div>

        {/* 레이블과 금액 - 향상된 스타일 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-rose-300 to-rose-400 shadow-sm ring-1 ring-white" />
              <span className="text-xs font-medium text-gray-600">Base</span>
              <span className="text-xs font-bold text-gray-800">
                ${card.basePay.toLocaleString()}
              </span>
            </div>
            {card.differentialPay > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-sm ring-1 ring-white" />
                <span className="text-xs font-medium text-gray-600">Diff</span>
                <span className="text-xs font-bold text-blue-600">
                  +${card.differentialPay.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Animation settings
const cardAnimation = {
  initial: { x: 0, y: 0 },
  hovered: { x: -8, y: -8 },
};

// A rotating "Available Position" badge in the top-right corner
function RotatingBadge() {
  return (
    <motion.svg
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 30,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear',
      }}
      style={{
        top: '0',
        right: '0',
        x: '50%',
        y: '-50%',
        scale: 0.45,
      }}
      width="200"
      height="200"
      className="pointer-events-none absolute z-10 rounded-full opacity-0 hover:opacity-20"
    >
      <defs>
        <path
          id="circlePath"
          d="M100,100 m-75,0 a75,75 0 1,0 150,0 a75,75 0 1,0 -150,0"
          fill="none"
        />
      </defs>
      <text className="text-xs tracking-wider">
        <textPath
          href="#circlePath"
          className="fill-rose-400 font-medium uppercase"
        >
          Available Position • Available Position •
        </textPath>
      </text>
    </motion.svg>
  );
}

// Culture rating bar
function CultureRating({ rating }: { rating: number }) {
  const maxRating = 10;
  const percentage = (rating / maxRating) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-2 w-20 overflow-hidden rounded-full bg-rose-100">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-rose-400 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium text-rose-700">{rating}/10</span>
    </div>
  );
}

// Header with experience level badge
function CardHeader({ card }: { card: CompensationCard }) {
  const experienceLevelEmoji = {
    beginner: '🌱',
    junior: '🌿',
    experienced: '🌸',
    senior: '🌲',
  };

  const experienceLevelText = {
    beginner: 'Beginner Nurse',
    junior: 'Junior Nurse',
    experienced: 'Experienced Nurse',
    senior: 'Senior Nurse',
  };

  return (
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl">
          {experienceLevelEmoji[card.experienceLevel]}
        </span>
        <h2 className="text-base font-semibold text-rose-800">
          {experienceLevelText[card.experienceLevel]}
        </h2>
      </div>
      <span className="text-xs text-rose-600">
        {card.yearsOfExperience} years
      </span>
    </div>
  );
}

// Info section: enhanced with pay breakdown
function CardInfo({ card }: { card: CompensationCard }) {
  const location = `${card.city}, ${card.state}`;

  return (
    <div className="flex-1 space-y-2">
      <InfoItem icon={<Building size={16} />} text={card.hospital} />
      <InfoItem icon={<MapPin size={16} />} text={location} />
      <InfoItem icon={<Activity size={16} />} text={card.specialty} />

      {/* Enhanced Pay Display */}
      <PayBreakdown card={card} />

      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <Star size={16} />
        </div>
        <span className="text-sm font-medium text-rose-800">Unit Culture:</span>
        <CultureRating rating={card.unitCulture} />
      </div>
    </div>
  );
}

// Footer: showing role and shift info
function CardFooter({ card }: { card: CompensationCard }) {
  return (
    <div className="mt-3 space-y-1">
      <p className="text-xs text-rose-600">
        {card.nursingRole} • {card.employmentType} • {card.shiftType} Shift
      </p>
      {card.unitFeedback && (
        <p className="text-xs text-rose-500 line-clamp-2 italic">
          {card.unitFeedback}
        </p>
      )}
    </div>
  );
}

function NurseCard({ card, className }: NurseCardProps) {
  const experienceLevelColors = {
    beginner: 'bg-yellow-300 hover:bg-yellow-400',
    junior: 'bg-blue-300 hover:bg-blue-400',
    experienced: 'bg-pink-300 hover:bg-pink-400',
    senior: 'bg-emerald-300 hover:bg-emerald-400',
  };

  return (
    <MotionConfig transition={{ type: 'spring', bounce: 0.5 }}>
      <motion.div
        whileHover="hovered"
        className={twMerge(
          'relative w-full rounded-2xl border border-rose-200 shadow-md',
          className ||
            experienceLevelColors[card.experienceLevel] ||
            cardGradientClasses
        )}
      >
        <motion.div
          variants={cardAnimation}
          className={twMerge(
            '-m-0.5 rounded-2xl border border-rose-200',
            className ||
              experienceLevelColors[card.experienceLevel] ||
              cardGradientClasses
          )}
        >
          <motion.div
            variants={cardAnimation}
            className={twMerge(
              'relative -m-0.5 flex min-h-[340px] flex-col overflow-hidden rounded-2xl border border-rose-200 p-4',
              className ||
                experienceLevelColors[card.experienceLevel] ||
                cardGradientClasses
            )}
          >
            <CardHeader card={card} />
            <CardInfo card={card} />
            <CardFooter card={card} />
            <RotatingBadge />
          </motion.div>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}

export default NurseCard;
