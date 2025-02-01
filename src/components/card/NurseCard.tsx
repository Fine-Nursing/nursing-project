'use client';

import type { ReactNode } from 'react';
import React from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { MapPin, DollarSign, Activity, Calendar, Clock } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import type { BaseNurseInfo, NurseCardProps } from 'src/types/nurse';

const colorStyles = {
  icu: 'bg-slate-50 hover:bg-slate-100',
  emergency: 'bg-purple-50 hover:bg-purple-100',
  pediatrics: 'bg-blue-50 hover:bg-blue-100',
  surgery: 'bg-gray-50 hover:bg-gray-100',
} as const;

function InfoItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm text-slate-600">{text}</span>
    </div>
  );
}

// 애니메이션 설정

const cardAnimation = {
  initial: { x: 0, y: 0 },
  hovered: { x: -8, y: -8 },
};

// SVG Component

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
        scale: 0.4,
      }}
      width="200"
      height="200"
      className="pointer-events-none absolute z-10 rounded-full opacity-0 group-hover:opacity-20"
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
          className="fill-slate-400 font-medium uppercase"
        >
          Available Position • Available Position •
        </textPath>
      </text>
    </motion.svg>
  );
}

// Card Header

function CardHeader({ avatar, title }: { avatar: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">{avatar}</span>
      <p className="flex items-center text-lg font-medium uppercase text-slate-800">
        <span className="-ml-6 mr-1 opacity-0 transition-all duration-300 ease-in-out group-hover:ml-0 group-hover:opacity-100">
          →
        </span>
        {title}
      </p>
    </div>
  );
}

// Card Infomation

function CardInfo({ nurseInfo }: { nurseInfo: BaseNurseInfo }) {
  const infoItems = [
    { id: 'location', icon: <MapPin size={16} />, text: nurseInfo.location },
    { id: 'salary', icon: <DollarSign size={16} />, text: nurseInfo.salary },
    {
      id: 'specialty',
      icon: <Activity size={16} />,
      text: nurseInfo.specialty,
    },
    { id: 'workDays', icon: <Calendar size={16} />, text: nurseInfo.workDays },
    { id: 'experience', icon: <Clock size={16} />, text: nurseInfo.experience },
  ] as const;

  return (
    <div className="mt-4 space-y-2 flex-1">
      {infoItems.map(({ id, icon, text }) => (
        <InfoItem
          key={id}
          icon={<span className="text-slate-600">{icon}</span>}
          text={text}
        />
      ))}
    </div>
  );
}

// Card Footer

function CardFooter({ subtitle }: { subtitle: string }) {
  return (
    <div>
      <p className="text-xs text-slate-600 line-clamp-2 transition-[margin] duration-300 ease-in-out group-hover:mb-8">
        {subtitle}
      </p>
      <button
        type="button"
        className="absolute bottom-2 left-2 right-2 translate-y-full border-[1px] border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100"
      >
        APPLY NOW
      </button>
    </div>
  );
}

function NurseCard({ title, subtitle, className, nurseInfo }: NurseCardProps) {
  return (
    <MotionConfig transition={{ type: 'spring', bounce: 0.5 }}>
      <motion.div
        whileHover="hovered"
        className={twMerge(
          'group w-full border-[1px] border-slate-200',
          className || colorStyles.icu
        )}
      >
        <motion.div
          variants={cardAnimation}
          className={twMerge(
            '-m-0.5 border-[1px] border-slate-200',
            className || colorStyles.icu
          )}
        >
          <motion.div
            variants={cardAnimation}
            className={twMerge(
              'relative -m-0.5 flex h-[300px] flex-col overflow-hidden border-[1px] border-slate-200 p-4',
              className || colorStyles.icu
            )}
          >
            <CardHeader avatar={nurseInfo.avatar} title={title} />
            <CardInfo nurseInfo={nurseInfo} />
            <CardFooter subtitle={subtitle} />
            <RotatingBadge />
          </motion.div>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}

export default NurseCard;
