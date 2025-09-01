'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// 무거운 컴포넌트들을 동적으로 로드
const CareerDashboard = dynamic(
  () => import('./CareerDashboard'),
  { 
    loading: () => <CareerSkeleton />,
    ssr: false // 서버사이드 렌더링 비활성화
  }
);

interface LazyCareerDashboardProps {
  theme?: 'light' | 'dark';
}

function CareerSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 h-64">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-4" />
        <div className="h-32 bg-gray-100 dark:bg-slate-600 rounded" />
      </div>
    </div>
  );
}

export default function LazyCareerDashboard({ theme }: LazyCareerDashboardProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // 메인 스레드가 idle 상태일 때 로드
    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(
        () => setShouldLoad(true),
        { timeout: 1000 } // 최대 1초 대기
      );
      return () => cancelIdleCallback(handle);
    } 
      // fallback: 500ms 후 로드
      const timer = setTimeout(() => setShouldLoad(true), 500);
      return () => clearTimeout(timer);
    
  }, []);

  if (!shouldLoad) {
    return <CareerSkeleton />;
  }

  return <CareerDashboard theme={theme} />;
}