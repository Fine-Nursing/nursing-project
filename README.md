# 🏥 Nurse Journey - Frontend

간호사 커리어 관리 플랫폼의 프론트엔드 애플리케이션입니다.

## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [기술 스택](#-기술-스택)
- [주요 기능](#-주요-기능)
- [프로젝트 구조](#-프로젝트-구조)
- [시작하기](#-시작하기)
- [개발 가이드](#-개발-가이드)
- [배포](#-배포)

## 🎯 프로젝트 개요

**Nurse Journey**는 간호사의 커리어를 체계적으로 관리하고 발전시킬 수 있도록 도와주는 종합 플랫폼입니다.

### 핵심 가치
- 📊 **데이터 기반 인사이트**: 실제 데이터를 바탕으로 한 커리어 분석
- 🎯 **개인화된 경험**: 개별 간호사의 목표와 상황에 맞춘 맞춤형 서비스
- 🚀 **커리어 성장**: 체계적인 발전 경로 제시 및 목표 설정 지원
- 💡 **스마트 추천**: AI 기반 역할 및 기회 추천

## 🛠 기술 스택

### 핵심 프레임워크
- **Next.js 15** - React 기반 풀스택 프레임워크
- **React 18** - 사용자 인터페이스 라이브러리
- **TypeScript** - 정적 타입 검사

### 스타일링 & UI
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **Framer Motion** - 고급 애니메이션 라이브러리
- **Radix UI** - 접근성이 뛰어난 UI 프리미티브
- **Lucide React** - 아이콘 라이브러리

### 상태 관리 & 데이터
- **Zustand** - 경량 상태 관리
- **TanStack Query (React Query)** - 서버 상태 관리 및 캐싱
- **React Hook Form** - 폼 상태 관리

### 차트 & 데이터 시각화
- **Chart.js & React-Chartjs-2** - 차트 라이브러리
- **Recharts** - React 차트 라이브러리
- **Nivo** - 고급 데이터 시각화

### 외부 서비스 통합
- **Supabase** - 백엔드 서비스 (인증, 데이터베이스)
- **Firebase** - 추가 백엔드 서비스
- **Google Maps API** - 지도 및 위치 서비스

### 개발 도구
- **ESLint** - 코드 린팅
- **Prettier** - 코드 포매팅
- **Bundle Analyzer** - 번들 크기 분석

## 🎨 주요 기능

### 🔐 인증 시스템
- 이메일/패스워드 로그인
- 소셜 로그인 (Google, 기타)
- 회원가입 및 사용자 검증

### 📝 온보딩 시스템
- **기본 정보 입력**: 개인 정보, 교육 배경, 경력 사항
- **취업 정보 등록**: 근무지, 급여, 수당 정보
- **문화 평가**: 직장 문화 및 선호도 조사
- **실시간 분석**: 입력 데이터 기반 즉시 인사이트 제공

### 📊 대시보드 시스템
- **개인 프로필**: 아바타, 기본 정보, 경력 요약
- **보상 분석**: 급여 분석, 시장 비교, 예상 성장률
- **커리어 분석**: 발전 경로, 다음 단계 추천
- **레이더 차트**: 다차원 역량 분석

### 📈 커리어 관리
- **타임라인 뷰**: 커리어 진행 과정 시각화
- **목표 설정**: 단기/장기 커리어 목표 관리
- **AI 추천**: 맞춤형 역할 및 기회 추천
- **진행률 추적**: 목표 달성도 모니터링

### 🗓 스케줄 관리
- **근무 스케줄**: 드래그 앤 드롭 스케줄링
- **시프트 관리**: 근무 패턴 최적화
- **달력 통합**: 다양한 뷰 지원

### 📋 데이터 테이블
- **간호사 보상 데이터**: 필터링, 정렬, 검색
- **지역별/전문분야별 정보**: 상세 카테고리 분류
- **실시간 업데이트**: 최신 시장 정보 반영

## 🗂 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── auth/              # 인증 관련 페이지
│   ├── dashboard/         # 메인 대시보드
│   ├── onboarding/        # 온보딩 플로우
│   └── users/[userId]/    # 사용자 개별 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── features/         # 도메인별 기능 컴포넌트
│   │   ├── auth/        # 인증 관련
│   │   ├── career/      # 커리어 관리
│   │   ├── dashboard/   # 대시보드 
│   │   ├── landing/     # 랜딩 페이지
│   │   └── onboarding/  # 온보딩
│   ├── ui/              # 공통 UI 컴포넌트
│   └── user-page/       # 사용자 페이지 컴포넌트
├── api/                  # API 훅 및 요청 로직
├── hooks/               # 커스텀 훅
├── lib/                 # 유틸리티 및 설정
├── store/               # 상태 관리 (Zustand)
├── styles/              # 스타일 관련
├── types/               # TypeScript 타입 정의
└── utils/               # 유틸리티 함수
```

## 🚀 시작하기

### 필수 요구사항
- **Node.js** 18.x 이상
- **Yarn** 또는 **npm**
- **Git**

### 1. 저장소 클론
```bash
git clone https://github.com/Fine-Nursing/nursing-project.git
cd nursing-project/FE
```

### 2. 의존성 설치
```bash
yarn install
# 또는
npm install
```

### 3. 환경 변수 설정
```bash
# .env.local 파일 생성 (예시는 .env.local.example 참고)
cp .env.local.example .env.local
```

**필수 환경 변수:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
# 기타 Firebase 설정 변수들...
```

### 4. 개발 서버 실행
```bash
yarn dev
# 또는
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🔧 개발 가이드

### 주요 스크립트
```bash
yarn dev          # 개발 서버 실행
yarn build        # 프로덕션 빌드
yarn start        # 프로덕션 서버 실행 (PORT=3001)
yarn lint         # ESLint 실행
yarn analyze      # 번들 분석
```

### 코딩 컨벤션
- **컴포넌트명**: PascalCase (`UserProfile.tsx`)
- **함수/변수명**: camelCase (`getUserData`)
- **상수**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **파일/폴더명**: kebab-case (`user-profile/`)

### 컴포넌트 구조
```typescript
// 표준 컴포넌트 구조
interface ComponentProps {
  // props 타입 정의
}

function Component({ prop1, prop2 }: ComponentProps) {
  // 훅 및 상태
  // 이벤트 핸들러
  // 렌더링
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

export default Component;
```

### 상태 관리 가이드
- **로컬 상태**: `useState`, `useReducer`
- **글로벌 상태**: Zustand 스토어
- **서버 상태**: TanStack Query
- **폼 상태**: React Hook Form

### API 통합
```typescript
// API 훅 예시
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
  });
}
```

## 🎨 스타일링 가이드

### Tailwind CSS 사용
```jsx
// 반응형 디자인
<div className="w-full md:w-1/2 lg:w-1/3">
  
// 다크모드 지원
<div className="bg-white dark:bg-gray-800">
  
// 커스텀 컴포넌트
<Button variant="primary" size="lg">
```

### 애니메이션
```jsx
// Framer Motion 사용 예시
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

## 📱 반응형 디자인

### 브레이크포인트
- **Mobile**: < 768px
- **Tablet**: 768px ~ 1024px
- **Desktop**: > 1024px
- **Large**: > 1280px

### 모바일 우선 설계
```jsx
// Mobile First 접근
<div className="text-sm md:text-base lg:text-lg">
```

## 🚢 배포

### 프로덕션 빌드
```bash
yarn build
yarn start  # 로컬에서 프로덕션 테스트
```

### 환경별 배포
- **개발**: `development` 브랜치 → 자동 배포
- **스테이징**: `staging` 브랜치 → 자동 배포  
- **프로덕션**: `main` 브랜치 → 수동 승인 후 배포

### 번들 최적화
```bash
yarn analyze  # 번들 크기 분석
```

## 🔍 성능 최적화

### 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 포맷 지원
- 지연 로딩 적용

### 코드 스플리팅
- React.lazy()를 통한 컴포넌트 분할
- dynamic import 활용
- 라우트별 청크 분리

### 캐싱 전략
- TanStack Query 캐싱
- Static Generation 활용
- ISR (Incremental Static Regeneration)

## 🤝 기여하기

### 브랜치 전략
```bash
# 브랜치명 규칙: [이름]/[타입]/[기능]
git checkout -b ksh/feat/user-dashboard
git checkout -b ymy/fix/auth-validation
```

### 커밋 컨벤션
```bash
[feat] 새로운 기능 추가
[fix] 버그 수정  
[refactor] 코드 리팩토링
[docs] 문서 수정
[test] 테스트 추가
[chore] 설정 변경
```

### Pull Request
1. 기능 브랜치에서 작업
2. 코드 리뷰 요청
3. 테스트 통과 확인
4. main 브랜치로 머지

## 📞 지원

### 문제 해결
- **이슈 트래커**: [GitHub Issues](https://github.com/Fine-Nursing/nursing-project/issues)
- **문서**: [프로젝트 문서](../docs/)

### 팀 연락처
- **개발팀**: [dev@nursejourney.com](mailto:dev@nursejourney.com)
- **프로젝트 관리**: [pm@nursejourney.com](mailto:pm@nursejourney.com)

---

**Made with ❤️ by the Nurse Journey Team**# Vercel Deployment Test Tue Sep 23 22:44:10 KST 2025
