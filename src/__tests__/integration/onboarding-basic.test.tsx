import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import useOnboardingStore from '../../store/onboardingStores';

// Test wrapper
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Mock components for initial test
function MockOnboardingFlow() {
  return (
    <div>
      <h1>Onboarding Flow</h1>
      <button type="button">시작하기</button>
      <div>Welcome to Nurse Journey</div>
    </div>
  );
}

describe('기본 환경 검증', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    useOnboardingStore.getState().resetForm();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  test('1. 렌더링이 동작한다', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <MockOnboardingFlow />
      </TestWrapper>
    );

    // 기본 요소들이 렌더링되는지 확인
    expect(screen.getByText('Onboarding Flow')).toBeInTheDocument();
    expect(screen.getByText('시작하기')).toBeInTheDocument();
    
    // 버튼 클릭 동작 확인
    await user.click(screen.getByText('시작하기'));
    
    // 테스트 환경이 제대로 동작하는지 확인
    expect(screen.getByText('Welcome to Nurse Journey')).toBeInTheDocument();
  });

  test('2. Zustand store가 동작한다', () => {
    // 초기값 확인
    const initialState = useOnboardingStore.getState();
    expect(initialState.currentStep).toBe('welcome');
    expect(initialState.tempUserId).toBeNull();
    
    // 상태 변경 확인
    useOnboardingStore.getState().setStep('basicInfo');
    expect(useOnboardingStore.getState().currentStep).toBe('basicInfo');
    
    // 폼 데이터 업데이트 확인
    useOnboardingStore.getState().updateFormData({ name: '테스트' });
    expect(useOnboardingStore.getState().formData.name).toBe('테스트');
    
    // 리셋 확인
    useOnboardingStore.getState().resetForm();
    expect(useOnboardingStore.getState().currentStep).toBe('welcome');
    expect(useOnboardingStore.getState().formData.name).toBe('');
  });

  test('3. localStorage가 동작한다', () => {
    // 저장 확인
    localStorage.setItem('test-key', 'test-value');
    expect(localStorage.getItem('test-key')).toBe('test-value');
    
    // JSON 저장/로드 확인 (온보딩에서 실제 사용하는 방식)
    const sessionData = {
      tempUserId: 'temp_123',
      sessionId: 'session_456',
      startedAt: new Date().toISOString()
    };
    
    localStorage.setItem('onboarding_session', JSON.stringify(sessionData));
    
    const retrieved = JSON.parse(localStorage.getItem('onboarding_session') || '{}');
    expect(retrieved.tempUserId).toBe('temp_123');
    expect(retrieved.sessionId).toBe('session_456');
    
    // 삭제 확인
    localStorage.removeItem('onboarding_session');
    expect(localStorage.getItem('onboarding_session')).toBeNull();
  });

  test('4. 사용자 인터랙션이 동작한다', async () => {
    const user = userEvent.setup();
    
    // 클릭, 타이핑, 선택 등 기본 인터랙션 테스트
    function InteractiveComponent() {
      const [inputValue, setInputValue] = useState('');
      const [selectedValue, setSelectedValue] = useState('');
      const [clickCount, setClickCount] = useState(0);
      
      return (
        <div>
          {/* 입력 테스트 */}
          <input 
            placeholder="이름을 입력하세요"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <span>입력된 값: {inputValue}</span>
          
          {/* 선택 테스트 */}
          <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
            <option value="">선택하세요</option>
            <option value="RN">Registered Nurse</option>
            <option value="LPN">Licensed Practical Nurse</option>
          </select>
          <span>선택된 값: {selectedValue}</span>
          
          {/* 클릭 테스트 */}
          <button type="button" onClick={() => setClickCount(count => count + 1)}>
            클릭 ({clickCount})
          </button>
        </div>
      );
    }
    
    render(<InteractiveComponent />);
    
    // 타이핑 테스트
    await user.type(screen.getByPlaceholderText('이름을 입력하세요'), '김간호');
    expect(screen.getByText('입력된 값: 김간호')).toBeInTheDocument();
    
    // 선택 테스트  
    await user.selectOptions(screen.getByRole('combobox'), 'RN');
    expect(screen.getByText('선택된 값: RN')).toBeInTheDocument();
    
    // 클릭 테스트
    await user.click(screen.getByText(/클릭/));
    expect(screen.getByText('클릭 (1)')).toBeInTheDocument();
  });
});