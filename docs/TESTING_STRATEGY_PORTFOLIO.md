# Nurse Journey 통합 테스트 시스템 구축

> **Mock 기반에서 실제 백엔드 연동까지, 의미있는 테스트 시스템 설계 과정**

---

## 프로젝트 개요

복잡한 5단계 온보딩 시스템에서 **"진짜 의미있는 테스트는 무엇인가?"**라는 근본적 질문에서 시작된 프로젝트입니다. Mock API 기반 테스트의 한계를 인식하고, 실제 백엔드와 연동하는 통합 테스트 시스템을 구축했습니다.

**핵심 도전과제:**
- Mock vs 실제 API: 어떤 방식이 더 의미있는가?
- 프론트엔드 테스트의 범위: DB 저장까지 검증해야 하는가?
- 두 가지 사용자 플로우: 비로그인 vs 로그인 온보딩 차이점 검증
- 복잡한 비즈니스 로직: Google Maps, 차등수당 계산, 실시간 상태 관리

---

## 테스트 전략 설계

### 1. 테스트 우선순위 결정

단위 테스트와 통합 테스트의 투자 대비 효과를 분석한 결과, **사용자 중심의 통합 테스트**가 더 높은 가치를 제공한다고 판단했습니다.

```javascript
// 기존 접근법: 개별 함수 검증
test('validateEmail 함수 테스트', () => {
  expect(validateEmail('test@test.com')).toBe(true);
});

// 채택한 접근법: 사용자 플로우 검증  
test('사용자 로그인 플로우 테스트', async () => {
  render(<LoginForm />);
  
  await userEvent.type(screen.getByLabelText('이메일'), 'test@test.com');
  await userEvent.type(screen.getByLabelText('비밀번호'), 'password123');
  await userEvent.click(screen.getByText('로그인'));
  
  await waitFor(() => {
    expect(screen.getByText('환영합니다')).toBeInTheDocument();
  });
});
```

### 2. 20/80 원칙 적용

개발 리소스 최적화를 위해 핵심 기능에 집중하는 테스트 전략을 수립했습니다.

#### Nurse Journey 테스트 우선순위 분석

**핵심 비즈니스 로직 (우선순위 높음)**
```tsx
const criticalTests = {
  // 1. 사용자 플로우 완성도: 온보딩 완료율이 서비스 성공의 핵심 지표
  onboardingCompletion: "사용자가 5단계 온보딩을 완료할 수 있는가",
  
  // 2. 데이터 무결성: 임시 데이터에서 영구 계정으로의 안전한 전환
  userMigration: "임시 사용자가 실계정으로 전환되는가",
  
  // 3. 부분 데이터 수집: 이탈 사용자로부터의 시장 데이터 확보 전략
  partialDataCollection: "중단된 온보딩에서도 입력 데이터가 서버에 저장되는가"
};
```

**부가 기능 (우선순위 낮음)**
```tsx
const nonCriticalTests = {
  // UI 렌더링
  componentRendering: "컴포넌트가 화면에 정상 표시되는가",
  
  // 시각적 효과
  visualEffects: "애니메이션과 전환 효과가 정상 동작하는가",
  
  // 부가 기능
  themeToggle: "테마 토글 등 부가 기능이 정상 동작하는가"
};
```

---

## 테스트 아키텍처 설계

### 고민 과정: 통합 vs 분리

#### Option A: 전체를 한 테스트로
```tsx
test('비로그인 사용자 온보딩 전체 플로우', async () => {
  // Welcome → BasicInfo → Employment → Culture → Account → Analyzing → UserPage
});
```

**장점:**
- ✅ 실제 사용자 여정과 동일
- ✅ 단계 간 연결 문제 발견 가능
- ✅ 비즈니스 가치 직접 검증

**단점:**
- ❌ 실패 시 원인 파악 어려움
- ❌ 긴 테스트 시간
- ❌ 복잡한 디버깅

#### Option B: 단계별 분리
```tsx
describe('온보딩 시스템', () => {
  test('BasicInfo 완료', async () => {});
  test('Employment 완료', async () => {});
  test('전체 연결', async () => {});
});
```

**장점:**
- ✅ 명확한 실패 지점 파악
- ✅ 빠른 디버깅
- ✅ 점진적 개발 가능

**단점:**  
- ❌ 단계 간 통합 오류 놓칠 가능성
- ❌ 실제 사용자 여정과 차이

### 최종 결정: 계층적 하이브리드 구조

**핵심 아이디어:** Option B + 통합 테스트를 조합해서 **"둘다 얻기"**

```tsx
describe('비로그인 온보딩 시스템', () => {
  // 🔍 Layer 1: 개별 단계 검증 (디버깅 최적화)
  describe('개별 단계 테스트', () => {
    test('BasicInfo Q&A 완료', async () => {
      // 문제 발생시 정확한 위치 파악
    });
    
    test('Employment 3섹션 완료', async () => {
      // 가장 복잡한 로직 집중 테스트  
    });
    
    test('Culture 감정 평가 완료', async () => {
      // 이모지 UI 인터랙션
    });
    
    test('Account 회원가입 완료', async () => {
      // 폼 유효성 검사 + API 연동
    });
  });
  
  // 🔗 Layer 2: 단계 간 연결 검증
  describe('단계 전환 테스트', () => {
    test('API 성공 후 다음 단계로 이동', async () => {
      // React Query mutation → setStep() 연동
    });
    
    test('Analyzing → UserPage 리다이렉션', async () => {
      // 타이머 기반 자동 이동
    });
  });
  
  // 🎯 Layer 3: E2E 통합 테스트 (카카오/토스 스타일)
  describe('전체 사용자 여정', () => {
    test('비로그인 사용자가 온보딩을 완료하고 유저페이지에 도달한다', async () => {
      // 실제 사용자 행동 그대로 시뮬레이션
      // 개별 테스트들이 모든 통과한 상태에서 최종 검증
    });
  });
});
```

---

## 전략적 가치

### 1. 개발 효율성
**계층별 테스트로 개발 속도 최적화**

```tsx
const developmentStrategy = {
  // Phase 1: 개별 컴포넌트 안정화
  individualComponents: "각 단계별 로직 완성도 확보",
  
  // Phase 2: 통합점 검증  
  integrationPoints: "단계 간 데이터 흐름 검증",
  
  // Phase 3: 사용자 경험 보장
  endToEndValidation: "실제 사용자 여정 완전 검증"
};
```

### 2. 디버깅 최적화
**실패 지점 즉시 파악으로 개발 생산성 향상**

```tsx
// 실패시 로그 분석 예시
const debuggingEfficiency = {
  // 🎯 개별 테스트 실패 → 정확한 문제 지점
  specificFailure: "Employment > Compensation 섹션 > 차등수당 계산 로직 오류",
  
  // vs 통합 테스트만 있을 경우  
  vagueFailing: "온보딩 어딘가에서 실패... 🤷‍♂️"
};
```

### 3. 비즈니스 가치 보장
**통합 테스트로 실제 사용자 경험 검증**

```tsx
const businessValue = {
  // 개별 테스트: 기술적 정확성
  technicalCorrectness: "각 함수/컴포넌트가 명세대로 동작",
  
  // 통합 테스트: 비즈니스 가치  
  businessValue: "실제 사용자가 서비스를 성공적으로 이용 가능"
};
```

---

## 핵심 학습

### 1. 실용적 테스트 접근법

복잡한 온보딩 시스템에서 모든 함수를 개별적으로 테스트하는 것보다, 실제 사용자 여정을 검증하는 것이 더 효과적임을 확인했습니다.

### 2. 리소스 최적화 전략

제한된 개발 시간에서 최대 효과를 얻기 위해 핵심 비즈니스 로직에 집중하는 선택적 테스트 전략을 적용했습니다.

### 3. 계층적 테스트 아키텍처

단일 접근법의 한계를 극복하기 위해 개별 단계 검증과 통합 플로우 검증을 결합한 다층 구조를 설계했습니다.

---

**결론**: 테스트 전략은 기술적 완성도와 개발 효율성 사이의 균형을 고려한 엔지니어링 의사결정이 핵심이며, 비즈니스 요구사항에 맞는 적절한 테스트 범위 설정이 중요합니다.

---

## 실제 구현: Mock에서 실제 백엔드 연동으로

### Phase 1: Mock 기반 테스트 시스템 (초기)

**구현한 개별 컴포넌트 테스트:**
```typescript
// basic-info.test.tsx
test('API 연동 테스트', async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true });
  
  await user.click(continueButton);
  expect(fetch).toHaveBeenCalledWith('/api/onboarding/basic-info');
  // 🤔 문제: Mock이라서 항상 성공
});
```

**성과:** 40개 테스트로 프론트엔드 로직 완전 검증

### Phase 2: Mock의 한계 발견

**결정적 깨달음:**
> *"API 호출 확인은 했지만, 정말 DB에 저장되었는지는 모른다"*

**발견한 Mock 테스트의 문제:**
- API가 무조건 성공 응답 → 실제 문제 감지 불가
- 백엔드 스키마 변경 감지 안됨
- DB 저장 여부 확인 불가능

### Phase 3: 실제 백엔드 연동 전환

**기술적 도전:**
```bash
# 1. 백엔드 서버 실행
cd ../BE && yarn dev  # NestJS + PostgreSQL

# 2. 테스트에서 실제 API 호출
curl http://localhost:3000/api/onboarding/basic-info
```

**실제 API 테스트로 전환:**
```typescript
// 실제 백엔드 연동 버전
describe('BasicInfo - 실제 API', () => {
  beforeEach(async () => {
    // Mock 제거, 실제 임시 사용자 생성
    const { tempUserId } = await fetch('http://localhost:3000/api/onboarding/init');
    useOnboardingStore.getState().setTempUserId(tempUserId);
  });

  test('실제 DB 저장 검증', async () => {
    await user.click(continueButton);
    
    // 실제 DB 상태 확인
    const progress = await fetch(`/api/onboarding/progress/${tempUserId}`);
    const data = await progress.json();
    expect(data.basicInfoCompleted).toBe(true); // 실제 DB 저장됨!
  });
});
```

### Phase 4: 백엔드 연동으로 발견한 실제 문제들

**예상치 못한 API 스키마 차이:**
```typescript
// 프론트엔드에서 보내는 데이터
{
  name: '김간호',
  education: "Bachelor's Degree"
}

// 실제 백엔드가 요구하는 스키마
{
  name: '김간호',
  education: "Bachelor's Degree",
  nursingRole: 'Registered Nurse (RN)',    // 필수 누락!
  experienceYears: 5,                      // 0-50 범위 검증
  tempUserId: 'temp_xxx'                   // 필수 누락!
}

// Employment는 더 복잡:
{
  organizationName, organizationCity, organizationState,
  employmentStartYear: 2023,               // 1950-2025 범위
  isUnionized: false,                      // boolean 필수  
  individualDifferentials: [{
    type: 'Night Shift', amount: 3, unit: 'hourly',
    group: 'Shift Differentials'           // group 필드 필수!
  }]
}
```

**백엔드 에러 로그:**
```
POST /api/onboarding/employment - Status: 400 
- employmentStartYear must be a number (1950-2025)
- isUnionized must be a boolean value
- individualDifferentials.0.group must be a string
```

**Mock 테스트로는 절대 발견할 수 없었던 문제들이었습니다.**

---

## 최종 테스트 아키텍처

### 두 가지 핵심 시나리오 구현

#### 1. 비로그인 사용자 온보딩 (임시사용자 플로우)

**개별 컴포넌트 테스트:**
```
├── welcome.test.tsx        # Welcome 로직 (2개)
├── basic-info.test.tsx     # BasicInfo Q&A + 실제 API (3개)  
├── employment.test.tsx     # Employment 3섹션 + 실제 API (6개)
├── culture.test.tsx        # Culture 평가 + 실제 API (2개)
├── account.test.tsx        # Account 생성 + 실제 API (2개)
└── onboarding.test.tsx     # 모든 테스트 통합 실행
```

**검증하는 핵심 플로우:**
```
temp_xxx 생성 → 5단계 온보딩 → 실계정 생성 → analyzing 페이지
```

#### 2. 로그인 사용자 온보딩 (실계정 플로우)

**signin-onboarding.test.tsx (3개 테스트):**
```typescript
test('로그인 사용자 실계정 ID로 온보딩', async () => {
  // 1. 회원가입 + 로그인 (실제 계정 생성)
  const { user } = await fetch('/api/auth/signup', { ... });
  await fetch('/api/auth/signin', { ... });
  
  // 2. 로그인된 상태에서 온보딩 초기화
  const { tempUserId } = await fetch('/api/onboarding/init', {
    credentials: 'include' // 인증 쿠키 전달
  });
  
  // 3. 핵심 검증: 실계정 ID 사용
  expect(tempUserId).toBe(user.id); // temp_가 아닌 실제 ID!
  expect(tempUserId).not.toMatch(/^temp_/);
});
```

**검증하는 핵심 플로우:**
```
실계정 생성 → 로그인 → 실계정 ID로 온보딩 → 완료
```

### 3. 두 시나리오의 핵심 차이점 검증

```typescript
test('비로그인 vs 로그인 차이점', async () => {
  // Case 1: 비로그인
  const nonLoggedResult = await fetch('/api/onboarding/init');
  expect(nonLoggedResult.tempUserId).toMatch(/^temp_/); // temp_ ID
  
  // Case 2: 로그인 (쿠키 인증)
  const loggedResult = await fetch('/api/onboarding/init', {
    headers: { 'Cookie': authCookie }
  });
  expect(loggedResult.tempUserId).toBe(realUserId); // 실제 ID
  expect(loggedResult.tempUserId).not.toMatch(/^temp_/);
});
```

---

## 기술적 성과

### 발견한 실제 문제들

**1. 백엔드 API 스키마 불일치**
- Employment API: 15개 필수 필드 누락 발견
- 차등수당 데이터: `group` 필드 필수인 것 발견
- 데이터 타입 검증: `boolean`, `number` 범위 체크

**2. 인증 플로우 버그**
- 로그인 사용자도 temp ID 받는 문제 발견
- `credentials: 'include'` 미작동 원인 파악
- 쿠키 기반 인증 방식으로 해결

**3. 의존성 체계**
- Culture API 호출 전 Employment 완료 필수
- API 호출 순서 의존성 발견

### 최종 시스템 아키텍처

```
테스트 환경 검증 (4개)
  ↓
개별 컴포넌트 (실제 API) (15개)  
  ↓
통합 실행 (18개)
  ↓
로그인 시나리오 (3개)

총 40개 테스트, 모두 실제 백엔드 + PostgreSQL 연동
```

### 성과 측정

| 측정 지표 | Mock 기반 테스트 | 실제 백엔드 연동 테스트 |
|-----------|------------------|-------------------------|
| **결함 발견율** | 0건 | 8건 (API 스키마, 인증 등) |  
| **스키마 호환성 검증** | 불가능 | 완전 검증 |
| **데이터 무결성 확인** | 불가능 | 실시간 DB 상태 확인 |
| **배포 안정성** | 제한적 | 높음 |
| **회귀 버그 예방** | 제한적 | 포괄적 |

---

## 기술적 학습 및 성장

### 1. 테스트 방법론의 이해

**단위 테스트:** 개별 함수 및 컴포넌트의 기능적 정확성 검증  
**통합 테스트:** 시스템 간 상호작용 및 데이터 흐름 검증

복잡한 다단계 온보딩 시스템에서는 **통합 테스트의 가치**가 더 높다는 것을 실증적으로 확인했습니다.

### 2. 프론트엔드 테스트 범위의 재정의

기존 프론트엔드 테스트 관례를 넘어서 **백엔드 API와 데이터베이스까지 포함하는 End-to-End 검증**을 구현했습니다. 이를 통해 더 높은 품질 신뢰성을 확보했습니다.

### 3. 사용자 중심 테스트 설계

기술적 구현 세부사항보다는 **실제 사용자가 경험하는 두 가지 핵심 시나리오**에 집중한 테스트 아키텍처 설계를 통해 비즈니스 가치와 기술적 검증을 균형있게 달성했습니다.

---

## 프로젝트 임팩트

### 개발 프로세스 개선
- **조기 문제 발견**: 배포 전 API 스키마 불일치 8건 사전 감지
- **개발 효율성**: 실제 환경과 동일한 테스트로 디버깅 시간 단축
- **코드 품질**: 실제 사용자 플로우 기반 검증으로 안정성 향상

### 기술적 역량 확장
- **풀스택 관점**: 프론트엔드를 넘어 백엔드-DB까지 포괄하는 시스템 이해
- **테스트 엔지니어링**: Mock 의존에서 벗어난 실용적 테스트 전략 수립
- **문제 해결**: 이론적 접근에서 실증적 검증으로의 사고방식 전환