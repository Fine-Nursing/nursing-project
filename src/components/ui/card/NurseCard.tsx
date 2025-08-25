'use client';

import type { ReactNode } from 'react';
import React from 'react';
import { m, MotionConfig } from 'framer-motion';
import { MapPin, DollarSign, Activity, Building, Star } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import type { CompensationCard } from 'src/types/dashboard';

// Import from your types file

export interface NurseCardProps {
  card: CompensationCard;
  className?: string;
}

// Soft gradient background (pastel rose/pink)
const cardGradientClasses =
  'bg-gradient-to-br from-pink-50 via-rose-50 to-rose-100 hover:from-pink-100 hover:to-rose-200 dark:bg-zinc-900 dark:hover:bg-zinc-800';

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
    <div className="flex items-center gap-1.5 sm:gap-2 rounded-lg bg-white/60 dark:bg-zinc-800/50 p-1.5 sm:p-2 shadow-sm ring-1 ring-rose-100 dark:ring-zinc-600 backdrop-blur-sm transition-colors">
      <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-rose-100 dark:bg-zinc-700 text-rose-600 dark:text-zinc-300 flex-shrink-0 transition-colors">
        {icon}
      </div>
      {label ? (
        <span className="text-xs sm:text-sm font-medium text-rose-800 dark:text-zinc-200 truncate">
          {label} <span className="font-normal">{text}</span>
        </span>
      ) : (
        <span className="text-xs sm:text-sm font-medium text-rose-800 dark:text-zinc-200 truncate">{text}</span>
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
    <div className="rounded-lg sm:rounded-xl bg-white/80 dark:bg-zinc-800/50 p-2 sm:p-3 shadow-sm ring-1 ring-rose-200/50 dark:ring-zinc-600 backdrop-blur-sm border border-white/60 dark:border-zinc-600 transition-colors">
      {/* Total Pay Header */}
      <div className="mb-2 sm:mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-green-100 dark:from-zinc-700 dark:to-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm transition-colors">
            <DollarSign size={12} className="sm:w-3.5 sm:h-3.5" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-200">Total Pay</span>
        </div>
        <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
          ${card.totalPay.toLocaleString()}/hr
        </span>
      </div>

      {/* 한 줄 비율 바 - 향상된 디자인 */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="relative h-2 sm:h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-950/50 shadow-inner transition-colors">
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
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-gradient-to-r from-rose-300 to-rose-400 shadow-sm ring-1 ring-white" />
              <span className="text-xs font-medium text-gray-600 dark:text-zinc-400">Base</span>
              <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                ${card.basePay.toLocaleString()}
              </span>
            </div>
            {card.differentialPay > 0 && (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-sm ring-1 ring-white" />
                <span className="text-xs font-medium text-gray-600 dark:text-zinc-400">Diff</span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
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
  initial: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
  hovered: { scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" },
};

// A rotating "Available Position" badge in the top-right corner
function RotatingBadge() {
  return (
    <m.svg
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
    </m.svg>
  );
}

// Culture rating bar
function CultureRating({ rating }: { rating: number }) {
  const maxRating = 10;
  const percentage = (rating / maxRating) * 100;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <div className="relative h-1.5 sm:h-2 w-16 sm:w-20 overflow-hidden rounded-full bg-rose-100 dark:bg-zinc-800 transition-colors">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-rose-400 dark:bg-emerald-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium text-rose-700 dark:text-zinc-400">{rating}/10</span>
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
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="text-xl sm:text-2xl">
          {experienceLevelEmoji[card.experienceLevel]}
        </span>
        <h2 className="text-sm sm:text-base font-semibold text-rose-800 dark:text-zinc-200 truncate">
          {experienceLevelText[card.experienceLevel]}
        </h2>
      </div>
      <span className="text-xs text-rose-600 dark:text-zinc-400 whitespace-nowrap">
        {card.yearsOfExperience} yrs
      </span>
    </div>
  );
}

// Info section: enhanced with pay breakdown
function CardInfo({ card }: { card: CompensationCard }) {
  const location = `${card.city}, ${card.state}`;

  return (
    <div className="flex-1 space-y-1.5 sm:space-y-2">
      <InfoItem icon={<Building size={14} className="sm:w-4 sm:h-4" />} text={card.hospital} />
      <InfoItem icon={<MapPin size={14} className="sm:w-4 sm:h-4" />} text={location} />
      <InfoItem icon={<Activity size={14} className="sm:w-4 sm:h-4" />} text={card.specialty} />

      {/* Enhanced Pay Display */}
      <PayBreakdown card={card} />

      {/* Unit Culture - null 체크 추가 */}
      {card.unitCulture != null && (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-rose-100 dark:bg-zinc-700 text-rose-600 dark:text-zinc-300 transition-colors">
            <Star size={14} className="sm:w-4 sm:h-4" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-rose-800 dark:text-zinc-300">
            Culture:
          </span>
          <CultureRating rating={card.unitCulture} />
        </div>
      )}
    </div>
  );
}

// Footer: showing role and shift info
function CardFooter({ card }: { card: CompensationCard }) {
  return (
    <div className="mt-2 sm:mt-3 space-y-1">
      <p className="text-xs text-rose-600 dark:text-zinc-400 truncate">
        {card.nursingRole}
        {card.employmentType && ` • ${card.employmentType}`}
        {card.shiftType && ` • ${card.shiftType}`}
      </p>
      {card.unitFeedback && (
        <p className="text-xs text-rose-500 dark:text-zinc-500 line-clamp-2 italic">
          {card.unitFeedback}
        </p>
      )}
    </div>
  );
}

function NurseCard({ card, className }: NurseCardProps) {
  const experienceLevelColors = {
    beginner: 'bg-gradient-to-br from-yellow-100 to-amber-200 hover:from-yellow-200 hover:to-amber-300 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-amber-900/40 dark:hover:from-zinc-800 dark:hover:to-amber-800/50',
    junior: 'bg-gradient-to-br from-blue-100 to-sky-200 hover:from-blue-200 hover:to-sky-300 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-blue-900/40 dark:hover:from-zinc-800 dark:hover:to-blue-800/50',
    experienced: 'bg-gradient-to-br from-pink-100 to-rose-200 hover:from-pink-200 hover:to-rose-300 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-rose-900/40 dark:hover:from-zinc-800 dark:hover:to-rose-800/50',
    senior: 'bg-gradient-to-br from-emerald-100 to-teal-200 hover:from-emerald-200 hover:to-teal-300 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-emerald-900/40 dark:hover:from-zinc-800 dark:hover:to-emerald-800/50',
  };

  return (
    <MotionConfig transition={{ type: 'spring', bounce: 0.5 }}>
      <m.div
        whileHover="hovered"
        className={twMerge(
          'relative w-full h-full rounded-xl sm:rounded-2xl border border-rose-200 dark:border-zinc-700 shadow-md dark:shadow-xl transition-all',
          className ||
            experienceLevelColors[card.experienceLevel] ||
            cardGradientClasses
        )}
      >
        <m.div
          variants={cardAnimation}
          className={twMerge(
            '-m-0.5 w-full h-full rounded-xl sm:rounded-2xl border border-rose-200 dark:border-zinc-700/50 transition-all',
            className ||
              experienceLevelColors[card.experienceLevel] ||
              cardGradientClasses
          )}
        >
          <m.div
            variants={cardAnimation}
            className={twMerge(
              'relative -m-0.5 flex w-full h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-rose-200 dark:border-zinc-700/30 p-3 sm:p-4 transition-all',
              className ||
                experienceLevelColors[card.experienceLevel] ||
                cardGradientClasses
            )}
          >
            <CardHeader card={card} />
            <CardInfo card={card} />
            <CardFooter card={card} />
            <RotatingBadge />
          </m.div>
        </m.div>
      </m.div>
    </MotionConfig>
  );
}

export default NurseCard;
