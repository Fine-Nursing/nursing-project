# Nurse Journey 온보딩 시스템 구현

> **복잡한 의료진 정보를 효율적으로 수집하는 다단계 온보딩 시스템**

---

## 프로젝트 개요

간호사의 **32개 전문분야**, **15종 차등수당**, **병원 문화 평가** 등 복잡한 정보를 수집하는 5단계 온보딩 시스템을 구현했습니다.

**기술 스택**: React, Next.js 15, TypeScript, Zustand, React Query  
**주요 도전**: 복잡한 상태 관리, 임시 사용자 시스템, 진행상황 복구

---

## 핵심 구현 사항

### 1. 다단계 온보딩 플로우
**5단계 구조**: `welcome` → `basicInfo` → `employment` → `culture` → `account`

```tsx
// 온보딩 단계 관리
export const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Welcome', description: 'Learn about our platform' },
  { id: 'basicInfo', title: 'Basic Information', description: 'Tell us about yourself' },
  { id: 'employment', title: 'Employment Details', description: 'Share your work experience' },
  { id: 'culture', title: 'Workplace Culture', description: 'Help us understand your workplace' },
  { id: 'account', title: 'Create Account', description: 'Set up your login credentials' },
] as const;

// 단계별 라우팅 및 상태 관리
const OnboardingFlow = () => {
  const { currentStep } = useOnboardingStore();
  
  const renderStep = (step: OnboardingStep) => {
    switch (step) {
      case 'welcome': return WelcomePage;
      case 'basicInfo': return BasicInfoForm;
      case 'employment': return EmploymentForm;
      case 'culture': return CultureForm;
      case 'account': return AccountForm;
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div key={currentStep}>
        <Suspense fallback={<FormLoader />}>
          {renderStep(currentStep)}
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};
```

### 2. 상태 관리 아키텍처
**Zustand 기반 중앙 집중식 상태 관리**

```tsx
interface OnboardingStore {
  currentStep: OnboardingStep;
  formData: Partial<OnboardingFormData>;
  tempUserId: string | null;
  sessionId: string | null;
  existingProgress: OnboardingProgress | null;
  
  setStep: (step: OnboardingStep) => void;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  resetForm: () => void;
  continueFromLastStep: () => void;
}

const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  currentStep: 'welcome',
  formData: initialFormData,
  
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
    
  continueFromLastStep: () =>
    set((state) => {
      const { existingProgress } = state;
      let nextStep: OnboardingStep = 'welcome';
      
      if (!existingProgress.basicInfoCompleted) nextStep = 'basicInfo';
      else if (!existingProgress.employmentCompleted) nextStep = 'employment';
      else if (!existingProgress.cultureCompleted) nextStep = 'culture';
      else if (!existingProgress.accountCompleted) nextStep = 'account';
      
      return { currentStep: nextStep };
    }),
}));
```

### 3. 임시 사용자 시스템
**회원가입 없이 온보딩 체험 가능**

```tsx
// 임시 계정 생성 및 관리
const useInitializeOnboarding = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/api/onboarding/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({}),
      });
      
      return response.json();
    },
    onSuccess: (data) => {
      // 임시 세션 정보 저장
      localStorage.setItem('onboarding_session', JSON.stringify({
        tempUserId: data.tempUserId,
        sessionId: data.sessionId,
        startedAt: new Date().toISOString(),
        isLoggedIn: !data.tempUserId.startsWith('temp_'),
      }));
      
      useOnboardingStore.getState().setTempUserId(data.tempUserId);
    }
  });
};

// 최종 계정 생성 시 임시 데이터 마이그레이션
const useCompleteOnboarding = () => {
  return useMutation({
    mutationFn: async () => {
      const { tempUserId } = useOnboardingStore.getState();
      
      const response = await fetch(`${API_URL}/api/onboarding/complete`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ tempUserId }),
      });
      
      return response.json();
    },
    onSuccess: (result) => {
      localStorage.removeItem('onboarding_session');
      router.push(`/onboarding/analyzing?userId=${result.userId}`);
    }
  });
};
```

### 4. 전략적 하이브리드 상태 관리
**비즈니스 가치 극대화를 위한 복합 데이터 수집 아키텍처**

#### 설계 철학: "이탈해도 데이터는 확보한다"

일반적인 온보딩은 완료자만 데이터를 얻지만, 간호사 시장 데이터의 가치를 고려해 **부분 완료자도 데이터를 수집**하는 전략을 구현했습니다.

```tsx
// 🎯 핵심 아이디어: 단계별 즉시 서버 저장
const strategicDataCollection = {
  // Step 2 이탈: 기본 프로필 데이터 확보
  basicInfo: { name, education, role, experience },
  
  // Step 3 이탈: 급여 시장 데이터 확보  
  employment: { specialty, hospital, basePay, location },
  
  // Step 4 이탈: 병원 문화 인사이트 확보
  culture: { workEnvironment, benefits, growth },
  
  // 완료: 개인 맞춤 분석 + 마케팅 타겟
  complete: fullUserProfile
};
```

#### 하이브리드 저장 전략

```tsx
// 1) 클라이언트: 가벼운 세션 관리
localStorage.setItem('onboarding_session', JSON.stringify({
  tempUserId: 'temp_1735123456',
  sessionId: 'session_abc',
  startedAt: new Date().toISOString()
}));

// 2) 서버: 소중한 비즈니스 데이터 즉시 저장
const useBasicInfoMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      // 사용자가 다음 버튼을 누르는 순간 서버에 저장
      const response = await fetch('/api/onboarding/basic-info', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,           // 개인 식별 정보
          education: data.education, // 학력 통계
          nursingRole: data.role,    // 역할 분포
          experienceYears: data.exp, // 경력 데이터
          tempUserId                 // 추적 ID
        }),
      });
      return response.json();
    },
    onSuccess: () => setStep('employment') // 다음 단계로
  });
};
```

#### 비즈니스 임팩트

| 이탈 시점 | 획득 데이터 | 활용 방안 |
|-----------|-------------|-----------|
| **2단계 이탈** | 간호사 기본 프로필 | 시장 규모 파악, 타겟팅 |
| **3단계 이탈** | 급여 + 병원 정보 | 급여 트렌드, 병원 순위 |
| **4단계 이탈** | 문화 평가 | 병원 문화 지표 |
| **완료** | 완전한 프로필 | 개인 맞춤 서비스 |

```tsx
// 🔥 섹시한 부분: 부분 데이터도 가치가 있다
const dataValue = {
  // 완료하지 않아도 이미 우리는...
  marketInsights: "서울 ICU 간호사 평균 급여 트렌드",
  hospitalRanking: "병원별 문화 점수 순위", 
  specialtyTrends: "전문분야별 인기도 변화",
  
  // 그리고 리마케팅까지
  retargeting: "김간호님, 분석 리포트가 기다리고 있어요!"
};
```

### 3가지 저장소를 사용하는 이유

```tsx
// 🎨 각각의 역할이 다르다
const storageStrategy = {
  // 1) Zustand: UI 상태 (빠른 반응)
  zustand: {
    currentStep: 'employment',
    formData: currentFormData, // 실시간 입력
    role: 'UI 반응성'
  },
  
  // 2) localStorage: 세션 추적 (가벼움)  
  localStorage: {
    tempUserId: 'temp_123',
    sessionId: 'session_456',
    role: '브라우저 재시작해도 연결'
  },
  
  // 3) 서버: 비즈니스 데이터 (영구 보존)
  server: {
    userData: realUserData,
    marketData: aggregatedInsights,
    role: '진짜 가치 있는 데이터'
  }
};
```

#### 복합 상태 관리의 전략적 가치

**일반적인 접근법의 한계:**
- **서버만 사용**: 로그인 필수 → 진입장벽 높음
- **클라이언트만 사용**: 데이터 손실 위험 → 사용자 불안감

**하이브리드 전략의 우수성:**
```tsx
// 🎯 사용자 관점: "부담 없는 체험"
const userExperience = {
  entry: "회원가입 없이 바로 시작",
  progress: "언제 나가도 이어서 가능", 
  security: "입력한 정보는 안전하게 보관"
};

// 💼 비즈니스 관점: "데이터 수집 극대화" 
const businessValue = {
  // 완료율 30% + 부분완료 50% = 총 80% 데이터 확보
  dataAcquisition: "이탈자도 부분 데이터 제공",
  marketInsights: "간호사 시장 트렌드 파악",
  retargeting: "tempUserId 기반 재접근 유도"
};
```

#### 3-Layer 상태 관리 아키텍처

```tsx
// Layer 1: Zustand (UI 반응성)
const uiState = {
  purpose: "즉각적인 사용자 피드백",
  data: { currentStep, formValidation, loadingStates },
  characteristics: "빠름, 일시적, 사용자 중심"
};

// Layer 2: localStorage (세션 연속성)  
const sessionState = {
  purpose: "브라우저 재시작 후에도 연결",
  data: { tempUserId, sessionId, timestamp },
  characteristics: "가벼움, 추적용, 메타데이터"
};

// Layer 3: Server API (비즈니스 데이터)
const serverState = {
  purpose: "영구 저장 및 분석용 데이터",
  data: { userProfiles, marketData, analytics },
  characteristics: "안전함, 영구적, 가치 있음"
};
```

---

## 기술적 특징

### 1. 타입 안전성
**TypeScript를 활용한 엄격한 타입 정의**

```tsx
export interface OnboardingFormData {
  // Basic Info
  name: string;
  education: EducationLevel;
  nursingRole: NursingRole;
  experienceYears: number;
  
  // Employment
  specialty: string;
  organizationName: string;
  employmentType: EmploymentType;
  basePay: number;
  individualDifferentials: DifferentialPay[];
  
  // Culture
  unitCulture: number; // 1-5 scale
  benefits: number;
  growthOpportunities: number;
  hospitalQuality: number;
  
  // Account
  email: string;
  password: string;
}
```

### 2. 에러 처리 및 복구
**견고한 에러 처리와 사용자 친화적 복구 메커니즘**

```tsx
// 전역 에러 바운더리
class OnboardingErrorBoundary extends React.Component {
  handleError = (error: Error) => {
    // 온보딩 진행상황 보존
    const currentProgress = useOnboardingStore.getState();
    this.setState({ 
      hasError: true, 
      canRecover: currentProgress.tempUserId !== null 
    });
  };
  
  render() {
    if (this.state.hasError) {
      return (
        <ErrorRecoveryUI 
          onRetry={() => this.setState({ hasError: false })}
          onRestart={() => useOnboardingStore.getState().resetForm()}
          canRecover={this.state.canRecover}
        />
      );
    }
    return this.props.children;
  }
}
```

### 3. 성능 최적화
**코드 분할과 지연 로딩**

```tsx
// 각 단계별 동적 임포트
const WelcomePage = lazy(() => import('./WelcomePage'));
const BasicInfoForm = lazy(() => import('./BasicInfoForm'));
const EmploymentForm = lazy(() => import('./EmploymentForm'));
const CultureForm = lazy(() => import('./CultureForm'));
const AccountForm = lazy(() => import('./AccountForm'));

// Suspense를 통한 로딩 상태 관리
<Suspense fallback={<FormLoader />}>
  {renderStep(currentStep)}
</Suspense>
```

---

## 주요 성과

### 기술적 성과
- **완전한 타입 안전성**: TypeScript 기반 런타임 에러 방지
- **모듈화된 구조**: 각 단계별 독립적인 컴포넌트 설계
- **효율적인 상태 관리**: Zustand를 활용한 예측 가능한 상태 흐름
- **견고한 에러 처리**: 사용자 데이터 손실 방지 메커니즘

### 사용자 경험
- **진입 장벽 제거**: 회원가입 없는 즉시 체험
- **진행상황 보존**: 중간 이탈 후 정확한 지점에서 재시작
- **직관적인 UI**: 복잡한 정보를 단계별로 간소화
- **실시간 피드백**: 입력 즉시 데이터 검증 및 안내

---

**핵심 가치**: 복잡한 도메인 지식(간호사 급여 체계)을 사용자 친화적인 인터페이스로 추상화하여, 기술적 복잡성을 사용자에게 노출시키지 않는 설계 철학을 구현했습니다.