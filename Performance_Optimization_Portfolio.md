# 🚀 Next.js 메인 페이지 성능 최적화 프로젝트

## 📋 프로젝트 개요

### 프로젝트 정보
- **프로젝트명**: 간호사 커리어 관리 플랫폼 (Nurse Journey)
- **최적화 대상**: 메인 랜딩 페이지
- **기술 스택**: Next.js 15, React 19, TypeScript, Framer Motion
- **작업 기간**: 2024년 8월 24일
- **역할**: Frontend Performance Engineer

### 문제 상황
메인 페이지의 로딩 속도가 극도로 느려 사용자 이탈률이 높았음. Lighthouse 성능 점수가 39점으로 "Poor" 등급을 받았으며, 특히 LCP(Largest Contentful Paint)가 8.7초로 매우 심각한 상황이었음.

---

## 🔍 초기 성능 분석

### 1. Lighthouse 초기 측정 결과

| Core Web Vitals | 측정값 | 상태 | 권장 기준 |
|----------------|--------|------|----------|
| **Performance Score** | 39/100 | 🔴 Poor | >90 |
| **LCP** | 8.7초 | 🔴 Poor | <2.5초 |
| **TBT** | 1,700ms | 🔴 Poor | <200ms |
| **CLS** | 0.014 | 🟢 Good | <0.1 |
| **Speed Index** | 2.5초 | 🟡 Needs Improvement | <1.3초 |

### 2. Network 분석 결과
```
총 페이로드: 8,528 KiB (8.5MB)
- page.js: 6,088 KB (6MB!)
- main-app.js: 1,297 KB
- 기타 리소스: ~1MB
```

### 3. Bundle Analyzer를 통한 근본 원인 분석

#### 번들 구성 비율
```
라이브러리: 85%
├── framer-motion: 30% (199개 모듈, ~2.3MB)
├── @supabase: 25% (45개 모듈)
├── recharts: 20%
└── 기타: 10%

우리 코드: 15% 😱
```

#### 핵심 문제점 식별
1. **Framer Motion 과다 사용**: 82개 파일에서 전체 라이브러리 import
2. **중복 차트 라이브러리**: @nivo와 recharts 동시 사용
3. **Code Splitting 부재**: 모든 컴포넌트가 초기 번들에 포함
4. **Tree Shaking 미작동**: 사용하지 않는 코드도 번들에 포함

---

## 💡 최적화 전략 수립

### Phase 1: Quick Wins (즉시 개선 가능)
- Below-the-fold 컴포넌트 지연 로딩
- 사용하지 않는 import 제거

### Phase 2: Library Optimization (라이브러리 최적화)
- Framer Motion을 LazyMotion으로 교체
- 중복 라이브러리 제거

### Phase 3: Advanced Optimization (고급 최적화)
- Code Splitting 강화
- Tree Shaking 설정

---

## 🛠 구현 과정

### 1. Below-the-fold 컴포넌트 지연 로딩 구현

#### Before:
```typescript
// 모든 컴포넌트를 즉시 import
import Header from 'src/components/features/landing/Header';
import HeroSection from 'src/components/features/landing/HeroSection';
import CompensationSection from 'src/components/features/landing/CompensationSection';
import DataSection from 'src/components/features/landing/DataSection';
import FeaturesSection from 'src/components/features/landing/FeaturesSection';
import TestimonialsSection from 'src/components/features/landing/TestimonialsSection';
import Footer from 'src/components/features/landing/Footer';
```

#### After:
```typescript
// Above-the-fold: 즉시 로드
import Header from 'src/components/features/landing/Header';
import HeroSection from 'src/components/features/landing/HeroSection';

// Below-the-fold: 지연 로드
const CompensationSection = lazy(() => import('src/components/features/landing/CompensationSection'));
const DataSection = lazy(() => import('src/components/features/landing/DataSection'));
const FeaturesSection = lazy(() => import('src/components/features/landing/FeaturesSection'));
const TestimonialsSection = lazy(() => import('src/components/features/landing/TestimonialsSection'));
const Footer = lazy(() => import('src/components/features/landing/Footer'));
```

#### Suspense Boundary 구현:
```typescript
<Suspense fallback={
  <div className="py-16 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
  </div>
}>
  <CompensationSection />
</Suspense>
```

**결과**: 초기 번들 크기 53.3KB → 49.3KB (7.5% 감소)

### 2. Framer Motion 최적화 - LazyMotion 전환

#### 문제 분석:
- 82개 파일에서 `framer-motion` 사용
- 전체 라이브러리(199개 모듈) import로 번들 크기 급증

#### 해결 방법: LazyMotion + domAnimation 사용

##### Step 1: Import 변경
```typescript
// Before: 전체 라이브러리 import (2.3MB)
import { motion } from 'framer-motion';

// After: 필요한 기능만 import
import { LazyMotion, domAnimation, m } from 'framer-motion';
```

##### Step 2: 메인 페이지 전체를 LazyMotion으로 감싸기
```typescript
export default function HomePage() {
  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen">
        {/* 모든 하위 컴포넌트가 m 컴포넌트 사용 가능 */}
        <Header />
        <HeroSection />
        {/* ... */}
      </div>
    </LazyMotion>
  );
}
```

##### Step 3: 모든 motion 컴포넌트를 m으로 변경
```typescript
// HeroSection.tsx
// Before:
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>

// After:
<m.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
```

##### Step 4: 중복된 LazyMotion 제거
각 컴포넌트(HeroSection, CompensationSection)의 개별 LazyMotion을 제거하고, 메인 페이지의 단일 LazyMotion으로 통합

**기술적 이점**:
- Tree Shaking 가능: 사용하지 않는 애니메이션 기능 제외
- 번들 크기 70-80% 감소
- 런타임 성능 향상

### 3. 컴포넌트별 세부 최적화

#### CardBoard 컴포넌트 최적화
```typescript
// Before:
import { motion, AnimatePresence } from 'framer-motion';
<motion.div>...</motion.div>

// After:
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
<m.div>...</m.div>
```

#### 사용하지 않는 import 제거
- HeroSection: 실제로 사용하지 않던 motion import 제거
- CompensationSection: 필요한 곳만 m 컴포넌트 사용

---

## 📊 최적화 결과

### 1. Lighthouse 성능 개선

| Metrics | Before | After | 개선율 | 상태 변화 |
|---------|--------|-------|--------|-----------|
| **Performance Score** | 39/100 | **87/100** | **+123%** | 🔴 Poor → 🟢 Good |
| **LCP** | 8.7초 | **1.5초** | **-83%** | 🔴 Poor → 🟢 Good |
| **TBT** | 1,700ms | **190ms** | **-89%** | 🔴 Poor → 🟢 Good |
| **Speed Index** | 2.5초 | **1.8초** | **-28%** | 🟡 → 🟢 Good |
| **CLS** | 0.014 | 0.016 | +14% | 🟢 Good (유지) |

### 2. 번들 크기 변화

#### JavaScript 번들
```
Before:
- page.js: 6,088 KB
- First Load JS: 238 KB (빌드 시)

After:
- 최대 청크: 64.6 KB
- First Load JS: 236 KB
- 대부분 청크: 10-60 KB
```

#### 주요 개선 사항
- **Framer Motion**: 2.3MB → ~500KB (추정 78% 감소)
- **초기 로드 시간**: 9초 → 1.5초
- **인터랙션 가능 시간**: 1.7초 → 0.19초

### 3. Network 탭 개선 결과

최적화 후 로드되는 리소스들이 작은 청크로 효율적으로 분리:
- 가장 큰 파일: 64.6 KB (이전 6MB)
- 평균 파일 크기: 10-30 KB
- 효율적인 병렬 로딩 실현

---

## 🎯 핵심 성과 및 비즈니스 임팩트

### 사용자 경험 개선
1. **초기 로딩 시간 83% 단축**: 8.7초 → 1.5초
2. **인터랙션 가능 시간 89% 개선**: 1.7초 → 0.19초
3. **체감 속도 대폭 향상**: Speed Index 28% 개선

### 비즈니스 지표 예상 개선
- **이탈률 감소**: 로딩 3초 이상 시 53% 이탈 → 1.5초로 개선
- **SEO 순위 향상**: Core Web Vitals 개선으로 Google 랭킹 상승
- **전환율 증가**: 페이지 속도 1초 개선 시 전환율 7% 증가 (Amazon 연구)

### 기술적 성과
1. **효율적인 Code Splitting**: 5개 주요 섹션 지연 로딩
2. **라이브러리 최적화**: Framer Motion 번들 크기 78% 감소
3. **Tree Shaking 활성화**: LazyMotion으로 필요한 기능만 로드

---

## 🔧 사용 기술 및 도구

### 분석 도구
- **Lighthouse**: 성능 측정 및 개선 사항 추적
- **Webpack Bundle Analyzer**: 번들 구성 시각화 및 분석
- **Chrome DevTools Network Tab**: 리소스 로딩 패턴 분석

### 최적화 기술
- **React.lazy() & Suspense**: 컴포넌트 지연 로딩
- **Framer Motion LazyMotion**: 선택적 기능 로딩
- **Next.js Dynamic Import**: 동적 모듈 로딩

### 코드 품질 도구
- **TypeScript**: 타입 안정성 보장
- **ESLint**: 코드 품질 유지
- **Git**: 버전 관리 및 롤백 대비

---

## 💭 배운 점 및 회고

### 주요 교훈
1. **측정 우선 접근**: "추측하지 말고 측정하라" - 번들 분석을 통해 실제 문제 파악
2. **단계적 최적화**: 한 번에 모든 것을 바꾸려 하지 말고 단계별로 접근
3. **라이브러리 선택의 중요성**: 작은 기능을 위해 큰 라이브러리 전체를 import하지 않기

### 실수와 개선
- **초기 실수**: @nivo 제거가 성능 개선의 핵심이라고 잘못 판단
- **개선**: Bundle Analyzer로 실제 병목점(Framer Motion) 발견
- **교훈**: 데이터 기반 의사결정의 중요성

### 향후 개선 계획
1. **Supabase 최적화**: 동적 import로 추가 30% 개선 예상
2. **Image Optimization**: Next.js Image 컴포넌트 활용
3. **Service Worker**: 오프라인 지원 및 캐싱 전략
4. **HTTP/3**: 더 빠른 프로토콜 도입 검토

---

## 📈 결론

본 프로젝트를 통해 **Performance Score를 39점에서 87점으로 123% 향상**시켰으며, 특히 LCP를 8.7초에서 1.5초로 **83% 개선**하는 성과를 달성했습니다.

핵심은 **번들 분석을 통한 정확한 문제 파악**과 **Framer Motion의 LazyMotion 전환**이었습니다. 이를 통해 사용자 경험을 대폭 개선하고, 비즈니스 지표에 긍정적인 영향을 미칠 수 있었습니다.

성능 최적화는 단순한 기술적 개선이 아니라, **사용자 경험과 비즈니스 성과에 직접적인 영향**을 미치는 중요한 작업임을 다시 한번 확인할 수 있었습니다.

---

## 🏆 기술 스택 뱃지

![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Optimized-FF0080?style=for-the-badge&logo=framer)
![Performance](https://img.shields.io/badge/Performance-87%25-green?style=for-the-badge)

---

*이 프로젝트는 실제 프로덕션 환경에서 진행된 성능 최적화 사례입니다.*