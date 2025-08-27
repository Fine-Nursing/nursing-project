import React, { useState, useEffect } from 'react';

interface LazyPredictiveCompChartProps {
  payDistributionData: any[];
  userHourlyRate: number;
  regionalAvgWage: number;
  theme: 'light' | 'dark';
}

// 실제 차트 컴포넌트는 사용자 상호작용 후에만 로드
export default function LazyPredictiveCompChart({
  payDistributionData,
  userHourlyRate,
  regionalAvgWage,
  theme
}: LazyPredictiveCompChartProps) {
  const [ChartComponent, setChartComponent] = useState<React.ComponentType<any> | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Intersection Observer로 뷰포트에 들어왔을 때만 로드
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('predictive-chart-container');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && !ChartComponent) {
      // 차트가 뷰포트에 보이면 동적으로 로드
      import('./PredictiveCompChart').then(module => {
        setChartComponent(() => module.default);
      });
    }
  }, [isVisible, ChartComponent]);

  return (
    <div id="predictive-chart-container" className="min-h-[400px]">
      {ChartComponent ? (
        <ChartComponent 
          payDistributionData={payDistributionData}
          userHourlyRate={userHourlyRate}
          regionalAvgWage={regionalAvgWage}
          theme={theme}
        />
      ) : (
        <div className={`h-[400px] ${
          theme === 'light' ? 'bg-gray-100' : 'bg-slate-800'
        } rounded-xl animate-pulse flex items-center justify-center`}>
          <p className="text-gray-500">Chart will load when visible...</p>
        </div>
      )}
    </div>
  );
}