# Frontend Coding Convention

## 📋 목차
1. [컴포넌트 선언 방식](#1-컴포넌트-선언-방식)
2. [Props 정의 방식](#2-props-정의-방식)
3. [상태 관리](#3-상태-관리)
4. [파일/폴더 구조](#4-파일폴더-구조)
5. [스타일링 방식](#5-스타일링-방식)
6. [Import 순서](#6-import-순서)

---

## 1. 컴포넌트 선언 방식

### 기본 규칙
```typescript
// ✅ 기본: named export
export const ComponentName = () => {
  return <div>...</div>;
};

// default export도 제공 (dynamic import 지원)
export default ComponentName;
```

### memo 사용 기준
```typescript
// ✅ 리렌더링 최적화가 필요한 경우만 memo 사용
// - 무거운 연산이 있는 컴포넌트
// - 자주 리렌더링되는 부모를 가진 컴포넌트
// - props가 자주 변경되지 않는 컴포넌트

export const ExpensiveComponent = memo(() => {
  // 복잡한 연산...
  return <div>...</div>;
});

ExpensiveComponent.displayName = 'ExpensiveComponent';
```

---

## 2. Props 정의 방식

### 간단한 Props - Inline 정의
```typescript
// ✅ 3개 이하의 간단한 props
export const SimpleButton = ({ 
  onClick, 
  label,
  disabled = false 
}: { 
  onClick: () => void; 
  label: string;
  disabled?: boolean;
}) => {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
};
```

### 복잡한 Props - Interface 정의
```typescript
// ✅ 4개 이상 또는 복잡한 타입의 props
interface ComplexComponentProps {
  user: User;
  settings: Settings;
  onUpdate: (data: UpdateData) => void;
  className?: string;
  children?: React.ReactNode;
}

export const ComplexComponent = ({ 
  user, 
  settings, 
  onUpdate,
  className,
  children 
}: ComplexComponentProps) => {
  // ...
};
```

### 공유 Props - 별도 파일 분리
```typescript
// types.ts
export interface SharedComponentProps {
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

// Component.tsx
import type { SharedComponentProps } from './types';
```

---

## 3. 상태 관리

### 현재 유지 (추후 개선 예정)
- 복잡한 로직: Custom Hook 사용
- 간단한 UI 상태: 컴포넌트 내부 useState
- 구체적인 기준은 추후 정립

---

## 4. 파일/폴더 구조

### 단순 컴포넌트 (단일 파일)
```
components/
└── SimpleButton.tsx
```

### 복잡한 컴포넌트 (폴더 구조)
```
components/
└── ComponentName/
    ├── index.tsx           # 메인 컴포넌트 (필수)
    ├── types.ts           # TypeScript 타입 정의 (필요시)
    ├── hooks/             # Custom hooks (필요시)
    │   └── useComponentName.ts
    ├── components/        # 하위 컴포넌트 (2개 이상일 때)
    │   ├── SubComponent1.tsx
    │   └── SubComponent2.tsx
    ├── utils/            # 유틸리티 함수 (필요시)
    │   └── helpers.ts
    └── constants.ts      # 상수 정의 (필요시)
```

### 폴더 구조 전환 기준
- 파일이 200줄 이상
- 하위 컴포넌트 2개 이상
- Custom Hook 필요
- 복잡한 타입 정의 필요

---

## 5. 스타일링 방식

### 기본: Tailwind CSS dark 모드
```typescript
// ✅ 기본 스타일링
className="bg-white dark:bg-black text-gray-900 dark:text-white"
```

### 조건부 스타일링: cn() 유틸리티
```typescript
// ✅ 조건부 클래스 적용
import { cn } from 'src/utils/cn';

export const Button = ({ isActive, isDisabled, className }) => {
  return (
    <button 
      className={cn(
        // 기본 스타일
        "px-4 py-2 rounded-lg transition-colors",
        // 조건부 스타일
        isActive && "bg-blue-500 text-white",
        isDisabled && "opacity-50 cursor-not-allowed",
        // 외부에서 전달된 스타일
        className
      )}
    >
      Click me
    </button>
  );
};
```

### 스타일링 우선순위
1. Tailwind 클래스 사용
2. dark: 모드 활용
3. cn() 유틸리티로 조건부 처리
4. inline style 사용 금지 (동적 값 제외)

---

## 6. Import 순서

### 표준 Import 순서
```typescript
// 1️⃣ React/Next.js (핵심 라이브러리)
import React, { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// 2️⃣ 외부 라이브러리
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { z } from 'zod';

// 3️⃣ 내부 절대 경로 (src/)
import { useAuth } from 'src/hooks/useAuth';
import { Button } from 'src/components/common/Button';
import { formatDate } from 'src/utils/date';
import type { User } from 'src/types/user';

// 4️⃣ 상대 경로 (같은 폴더 내부)
import { SubComponent } from './components/SubComponent';
import { useLocalHook } from './hooks/useLocalHook';
import type { LocalType } from './types';
import { LOCAL_CONSTANT } from './constants';

// 5️⃣ 스타일 (필요한 경우)
import './styles.css';
```

### Import 규칙
- 각 그룹 사이에 빈 줄 추가
- 그룹 내에서는 알파벳 순서 권장 (강제 아님)
- type import는 일반 import와 함께 배치
- 절대 경로는 항상 `src/`로 시작
- 상대 경로는 같은 컴포넌트 폴더 내부만 사용

---

## 🚀 적용 가이드

### 새 컴포넌트 생성시
1. 이 컨벤션을 따라 작성
2. PR 리뷰시 체크리스트로 활용

### 기존 컴포넌트 수정시
1. 해당 컴포넌트 수정할 때 점진적 적용
2. 대규모 리팩토링은 별도 PR로 진행

### ESLint 설정 (추후 적용)
```json
{
  "rules": {
    "import/order": ["error", {
      "groups": [
        ["builtin", "external"],
        "internal",
        ["parent", "sibling", "index"]
      ],
      "pathGroups": [{
        "pattern": "src/**",
        "group": "internal"
      }],
      "newlines-between": "always"
    }]
  }
}
```

---

## 📝 체크리스트

PR 생성 전 확인사항:
- [ ] 컴포넌트가 named export로 선언되었는가?
- [ ] Props가 적절한 방식으로 정의되었는가?
- [ ] 파일/폴더 구조가 규칙을 따르는가?
- [ ] Tailwind dark 모드를 활용했는가?
- [ ] Import 순서가 올바른가?
- [ ] 불필요한 memo 사용은 없는가?

---

## 🔄 버전 히스토리

- v1.0.0 (2024-01-20): 초기 컨벤션 문서 작성