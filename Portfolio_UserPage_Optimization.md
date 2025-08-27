# 🚀 User 페이지 성능 최적화 프로젝트

## 📊 프로젝트 개요

### 프로젝트 정보
- **최적화 대상**: User Dashboard 페이지 (/users/[userId])
- **기술 스택**: Next.js 15, React 19, TypeScript, Recharts, React Query
- **최적화 일자**: 2025년 1월
- **담당 역할**: Frontend Performance Engineer

### 초기 문제 상황
User 페이지의 성능 점수가 48/100으로 매우 낮았으며, 특히 LCP가 5.7초, 네트워크 페이로드가 4.5MB에 달하는 심각한 성능 문제 발생. API 응답 시간이 최대 15초까지 걸리는 치명적인 병목 현상 확인.

## 📈 초기 성능 지표

### Lighthouse 성능 점수
```
Performance Score: 48/100 🚨
├── FCP: 0.3s (양호)
├── LCP: 5.7s (목표 <2.5s, 실패 ❌)
├── TBT: 580ms (목표 <200ms, 실패 ❌)
├── CLS: 0.117 (목표 <0.1, 약간 초과 ⚠️)
└── Speed Index: 1.4s

기타 점수:
- Accessibility: 86/100
- Best Practices: 78/100
- SEO: 100/100
```

### Bundle Size Analysis
```
Route (app)                              Size     First Load JS
├ ○ /                                    27.2 kB         196 kB
└ ƒ /users/[userId]                      174 kB          343 kB  ⚠️

문제점:
- User 페이지: 174 kB (메인 페이지의 640% 크기)
- First Load JS: 343 kB (메인 페이지 대비 147 kB 증가)
```

### Network Waterfall 분석
```
주요 리소스 로딩 시간:
├── main-app.js: 1,297 kB (185ms) 🚨
├── CareerDashboard.js: 796 kB (208ms) 🚨
├── layout.js: 124 kB (44ms)
├── not-found.js: 93.1 kB (31ms)
└── 총 네트워크 페이로드: 4,512 kB (4.5MB!)

API 응답 시간 (재앙적):
├── wage-distribution: 15.40초 🔥🔥🔥
├── user-metrics: 4.30초 🔥
├── me (profile): 2.36초
├── compensation: 2.01초
├── career-history: 1.89초
├── me (auth): 1.52초
└── differentials-summary: 1.34초
```

## 🔍 문제 분석

### 1. API 병목 현상 (최우선 문제)

#### 문제점
- **wage-distribution API가 15.4초** 소요
- 모든 API를 동시에 호출하여 waterfall 효과 없음
- 캐싱 전략 부재
- 불필요한 데이터 over-fetching

#### 영향
- LCP 5.7초의 주요 원인
- 사용자가 15초 이상 기다려야 전체 데이터 표시
- 이탈률 증가 (3초 이상 로딩 시 53% 이탈 - Google 연구)

### 2. 번들 크기 문제

#### 주요 원인
```tsx
// 현재 코드 분석
1. CareerDashboard: 796 kB
   - lazy loading 적용했지만 여전히 자동 로드
   - 차트 라이브러리 포함 추정

2. main-app.js: 1.3 MB
   - 모든 컴포넌트가 초기 번들에 포함
   - Tree shaking 미적용

3. 정적 import 과다
   - UserProfileCard
   - CompensationAnalysis
   - RadarAnalytics (차트)
   - PredictiveCompChart (차트)
   - AiCareerInsights
   - NextSteps
```

### 3. 렌더링 차단 요소

#### JavaScript 실행 시간
- Reduce JavaScript execution time: 1.9초
- Minimize main-thread work: 6.3초
- 3개의 long tasks 발견

#### Unused Resources
- Unused CSS: 15 KiB
- Unused JavaScript: 152 KiB
- Legacy JavaScript: 10 KiB

### 4. DOM 크기 문제
- 1,085 elements (권장: <1,500)
- 과도한 DOM 노드로 인한 렌더링 성능 저하

## 💡 최적화 전략

### Phase 1: API 최적화 (즉시 실행)

#### 1-1. 데이터 로딩 우선순위 설정
```tsx
// Before: 모든 API 동시 호출
const { data: profileData } = useMyProfile();
const { data: compensationData } = useMyCompensation();
const { data: wageDistributionData } = useWageDistribution();
const { data: metricsData } = useUserMetrics();
const { data: differentialsData } = useDifferentialsSummary();

// After: 우선순위 기반 순차 로딩
// Step 1: Critical Data (화면 표시 필수)
const { data: profileData } = useMyProfile();
const { data: compensationData } = useMyCompensation({
  enabled: !!profileData // profile 로드 후 실행
});

// Step 2: Chart Data (스크롤 후 필요)
const { data: metricsData } = useUserMetrics({
  enabled: !!compensationData,
  staleTime: 5 * 60 * 1000 // 5분 캐싱
});

// Step 3: Heavy Data (선택적)
const { data: wageDistributionData } = useWageDistribution({
  enabled: isChartVisible, // IntersectionObserver로 제어
  staleTime: 30 * 60 * 1000 // 30분 캐싱
});
```

#### 1-2. wage-distribution API 개선 방안
```tsx
// Option 1: 백엔드 최적화 (권장)
// - 데이터베이스 쿼리 최적화
// - 인덱싱 추가
// - 페이지네이션 적용
// - 캐싱 레이어 추가 (Redis)

// Option 2: 프론트엔드 우회 전략
// - 기본 데이터만 먼저 로드
// - 상세 데이터는 사용자 인터랙션 시 로드
// - Service Worker로 백그라운드 프리페칭

// Option 3: 데이터 분할
const { data: basicWageData } = useBasicWageDistribution(); // 간단한 데이터
const { data: detailedWageData } = useDetailedWageDistribution({
  enabled: userRequestedDetails // 사용자 요청 시
});
```

#### 1-3. React Query 최적화
```tsx
// 캐싱 전략 강화
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      cacheTime: 10 * 60 * 1000, // 10분
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      retry: 2,
    },
  },
});

// Prefetching 전략
useEffect(() => {
  // 다음 가능한 액션 미리 로드
  queryClient.prefetchQuery(['nextSteps'], fetchNextSteps);
}, []);
```

### Phase 2: 번들 최적화

#### 2-1. Dynamic Import 전면 적용
```tsx
// Before
import UserProfileCard from 'src/components/features/dashboard/UserProfileCard';
import CompensationAnalysis from 'src/components/features/dashboard/CompensationAnalysis';
import RadarAnalytics from 'src/components/features/dashboard/RadarAnalytics';
import PredictiveCompChart from 'src/components/features/dashboard/PredictiveCompChart';
import AiCareerInsights from 'src/components/features/dashboard/AiCareerInsights';
import NextSteps from 'src/components/features/dashboard/NextSteps';

// After
const UserProfileCard = lazy(() => import('src/components/features/dashboard/UserProfileCard'));
const CompensationAnalysis = lazy(() => import('src/components/features/dashboard/CompensationAnalysis'));
const RadarAnalytics = lazy(() => import('src/components/features/dashboard/RadarAnalytics'));
const PredictiveCompChart = lazy(() => import('src/components/features/dashboard/PredictiveCompChart'));
const AiCareerInsights = lazy(() => import('src/components/features/dashboard/AiCareerInsights'));
const NextSteps = lazy(() => import('src/components/features/dashboard/NextSteps'));
```

#### 2-2. CareerDashboard 최적화
```tsx
// 현재: 796 KB 자동 로드
const CareerDashboard = lazy(() => import('src/components/features/career/CareerDashboard'));

// 개선: Intersection Observer로 뷰포트 진입 시 로드
const [shouldLoadCareer, setShouldLoadCareer] = useState(false);
const careerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoadCareer(true);
        observer.disconnect();
      }
    },
    { 
      rootMargin: '100px', // 100px 전에 미리 로드 시작
      threshold: 0.01
    }
  );

  if (careerRef.current) {
    observer.observe(careerRef.current);
  }

  return () => observer.disconnect();
}, []);

// 렌더링
<div ref={careerRef} className="mb-4 sm:mb-6">
  {shouldLoadCareer ? (
    <Suspense fallback={<CareerDashboardSkeleton />}>
      <CareerDashboard theme={theme} />
    </Suspense>
  ) : (
    <CareerDashboardSkeleton />
  )}
</div>
```

#### 2-3. 차트 라이브러리 최적화
```tsx
// Recharts 동적 import
const RadarChart = lazy(() => 
  import('recharts').then(module => ({ 
    default: module.RadarChart 
  }))
);

const PolarGrid = lazy(() => 
  import('recharts').then(module => ({ 
    default: module.PolarGrid 
  }))
);

// 또는 차트 컴포넌트 전체를 lazy load
const ChartSection = lazy(() => import('./ChartSection'));
```

### Phase 3: 렌더링 최적화

#### 3-1. Progressive Enhancement
```tsx
// Step 1: 텍스트 콘텐츠 먼저 표시
// Step 2: 인터랙티브 요소 추가
// Step 3: 차트와 비주얼 요소 로드

const [enhancementLevel, setEnhancementLevel] = useState<'basic' | 'interactive' | 'full'>('basic');

useEffect(() => {
  // 기본 콘텐츠 로드 후
  setEnhancementLevel('interactive');
  
  // 모든 필수 데이터 로드 후
  if (profileData && compensationData) {
    setEnhancementLevel('full');
  }
}, [profileData, compensationData]);
```

#### 3-2. Skeleton Loading
```tsx
const UserProfileSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-32 bg-gray-200 rounded-lg mb-4" />
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-6 bg-gray-200 rounded w-1/2" />
  </div>
);

// 사용
{isProfileLoading ? <UserProfileSkeleton /> : <UserProfileCard />}
```

### Phase 4: 네트워크 최적화

#### 4-1. Resource Hints
```tsx
// pages/_document.tsx
<Head>
  {/* API 서버 미리 연결 */}
  <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} />
  <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL} />
  
  {/* 중요 리소스 프리로드 */}
  <link rel="preload" as="fetch" href="/api/users/me" />
</Head>
```

#### 4-2. Service Worker 캐싱
```tsx
// 정적 리소스와 API 응답 캐싱
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## 🎉 실제 구현 결과

### wage-distribution API 최적화 구현

#### 백엔드 최적화 (완료)
```typescript
// Before: findMany() + JavaScript 처리 (15초)
const jobs = await this.prisma.jobs.findMany({...});
jobs.forEach((job) => { /* 수동 집계 */ });

// After: DB 집계 쿼리 (0.5초)
const wageDistribution = await this.prisma.$queryRaw`
  SELECT 
    FLOOR((jd.base_pay + COALESCE(ds.total_differential, 0)) / 5) * 5 as wage_range,
    COUNT(*)::bigint as count
  FROM jobs j
  INNER JOIN job_details jd ON jd.job_id = j.id
  LEFT JOIN differentials_summary ds ON ds.job_id = j.id
  WHERE jd.base_pay IS NOT NULL
    AND jd.base_pay >= 15 AND jd.base_pay <= 100
  GROUP BY wage_range
  ORDER BY wage_range
`;
```

#### 프론트엔드 수정 (완료)
```typescript
// 문제: 범위 중간값과 정확한 값 비교
isUser: Math.round(hourlyRate) === item.wageValue // 37 !== 37.5

// 해결: 범위 확인으로 변경
const rangeStart = item.wageValue - 2.5;
const rangeEnd = item.wageValue + 2.5;
isUser: userRate >= rangeStart && userRate < rangeEnd;
```

### 실제 성능 개선 결과

| 지표 | 최적화 전 | 최적화 후 | 개선율 |
|-----|----------|----------|--------|
| **API 응답 시간** | 15.4초 | 0.53초 | **96.6%↓** ✅ |
| **응답 데이터 크기** | ~5MB | 3.5KB | **99.9%↓** ✅ |
| **반환 레코드 수** | 수백 개 | 42개 | **적정화** ✅ |

## 📊 예상 개선 효과

### 성능 지표 개선 목표
| 지표 | 현재 | 목표 | 예상 개선율 |
|-----|------|------|-----------|
| **Performance Score** | 48/100 | 85+/100 | +77% |
| **LCP** | 5.7s | <2.5s | -56% |
| **TBT** | 580ms | <200ms | -66% |
| **FCP** | 0.3s | 0.3s | - |
| **CLS** | 0.117 | <0.1 | -15% |

### 번들 크기 개선 목표
| 항목 | 현재 | 목표 | 감소율 |
|------|------|------|--------|
| **Page Bundle** | 174 kB | <50 kB | -71% |
| **CareerDashboard** | 796 kB (자동) | 796 kB (지연) | - |
| **Total Network** | 4.5 MB | <2 MB | -56% |

### API 응답 시간 개선 목표
| API | 현재 | 목표 | 개선 |
|-----|------|------|------|
| **wage-distribution** | 15.4s | <2s | -87% |
| **user-metrics** | 4.3s | <1s | -77% |
| **기타 API** | 1.3-2.4s | <0.5s | -70% |

## 🎯 구현 우선순위

1. **[긴급] API 최적화**
   - wage-distribution 백엔드 최적화 또는 우회 전략
   - React Query 캐싱 전략 구현
   - 우선순위 기반 데이터 로딩

2. **[높음] CareerDashboard Lazy Loading**
   - Intersection Observer 구현
   - 796 kB 초기 로드 제거

3. **[중간] Dynamic Import 전면 적용**
   - 모든 대시보드 컴포넌트 lazy loading
   - 차트 라이브러리 분할

4. **[낮음] 추가 최적화**
   - Service Worker 구현
   - Resource Hints 추가
   - Skeleton Loading UI

## 💼 비즈니스 임팩트

### 예상 효과
- **이탈률 감소**: 5.7초 → 2.5초 개선으로 이탈률 40% 감소 예상
- **사용자 만족도**: 페이지 로딩 시간 56% 개선
- **서버 비용**: API 캐싱으로 서버 부하 50% 감소

### 기술적 성과
- 모던 웹 성능 최적화 기법 적용
- 측정 가능한 성능 개선 달성
- 확장 가능한 최적화 아키텍처 구축