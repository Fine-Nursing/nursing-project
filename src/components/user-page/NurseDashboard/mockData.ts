// components/NurseDashboard/mockData.ts

// payDistributionData: BarChart에 사용할 임시 데이터
export const payDistributionData = [
  { label: '$25', wageValue: 25, count: 10, id: 'wage-25' },
  { label: '$26', wageValue: 26, count: 15, id: 'wage-26' },
  { label: '$27', wageValue: 27, count: 25, id: 'wage-27' },
  { label: '$28', wageValue: 28, count: 30, id: 'wage-28' },
  { label: '$29', wageValue: 29, count: 35, id: 'wage-29' },
  { label: '$30', wageValue: 30, count: 40, id: 'wage-30' },
  { label: '$31', wageValue: 31, count: 50, id: 'wage-31' },
  { label: '$32', wageValue: 32, count: 60, id: 'wage-32' },
  { label: '$33', wageValue: 33, count: 72, id: 'wage-33' },
  { label: '$34', wageValue: 34, count: 85, id: 'wage-34' },
  { label: '$35', wageValue: 35, count: 100, highlight: true, id: 'wage-35' },
  {
    label: '$36',
    wageValue: 36,
    count: 115,
    highlight: true,
    isUser: true,
    id: 'wage-36',
  },
  { label: '$37', wageValue: 37, count: 95, id: 'wage-37' },
  { label: '$38', wageValue: 38, count: 80, id: 'wage-38' },
  { label: '$39', wageValue: 39, count: 65, id: 'wage-39' },
  { label: '$40', wageValue: 40, count: 50, id: 'wage-40' },
  { label: '$41', wageValue: 41, count: 40, id: 'wage-41' },
  { label: '$42', wageValue: 42, count: 30, id: 'wage-42' },
  { label: '$43', wageValue: 43, count: 25, id: 'wage-43' },
  { label: '$44', wageValue: 44, count: 20, id: 'wage-44' },
  { label: '$45+', wageValue: 45, count: 30, id: 'wage-45' },
];

// 예: userProfile or regionalAverages 등도 mockData로 분리할 수도 있음
export const userProfileMock = {
  name: 'Sarah Johnson',
  education: "Bachelor's Degree",
  role: 'Registered Nurse (RN)',
  specialty: 'ER',
  organization: 'NYU Langone',
  location: 'New York City, NY',
  experience: '4 years',
  hourlyRate: 36,
  annualSalary: 73840,
  differentials: { night: 2, weekend: 3, other: 1 },
  metrics: {
    basePay: 8.2,
    workStability: 7.5,
    benefits: 6.9,
    professionalGrowth: 7.8,
    workCulture: 6.5,
  },
};

export const regionalAveragesMock = {
  hourlyRate: 33.2,
  annualSalary: 69056,
  metrics: {
    basePay: 7.0,
    workStability: 6.5,
    benefits: 7.2,
    professionalGrowth: 6.8,
    workCulture: 7.0,
  },
};

export const metricAnalysisMock: Record<string, string> = {
  basePay:
    'Your base pay is higher than regional average, indicating strong fundamentals.',
  workStability:
    'Scheduling stability is a bit above average. Good for consistent hours.',
  benefits:
    'Your benefits are slightly below the average. Consider negotiating more coverage or perks.',
  professionalGrowth:
    'Your facility strongly supports advanced certifications. Great for your career path!',
  workCulture:
    'Work-life balance metrics slightly below average. Keep an eye on potential burnout.',
};
