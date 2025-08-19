# AI API 요청 최적화 TODO

## 🔴 현재 문제점

### 1. 타임아웃 미설정
```javascript
// 현재 코드 - src/api/ai/useAiInsights.ts
const aiApiClient = axios.create({
  baseURL: AI_API_BASE_URL,
  headers: {
    'X-API-Key': AI_API_KEY,
    'Content-Type': 'application/json'
  }
  // ❌ timeout 설정이 없음!
});
```

**문제**: 
- 요청이 실패해도 연결을 끊지 않고 무한정 대기
- 서버 리소스 계속 점유
- 브라우저 연결 제한(6개)에 도달 가능

### 2. React Query 재요청 설정
```javascript
// 현재 설정
{
  enabled: !!userId,
  staleTime: 5 * 60 * 1000,  // 5분
  retry: false
  // ❌ refetchOnWindowFocus 미설정 (기본값: true)
  // ❌ refetchOnMount 미설정 (기본값: true)
}
```

**문제**:
- 탭 전환 시마다 자동 재요청
- 컴포넌트 재마운트 시마다 재요청
- 불필요한 API 호출 반복

### 3. 동시 다발적 요청
```javascript
// useAllAiInsights
const results = await Promise.allSettled(
  ['nurse_summary', 'culture', 'skill_transfer'].map(type => 
    aiApiClient.get(`/generate/${type}?user_id=${userId}`)
  )
);
```

**문제**:
- 3개 API 동시 호출
- 각각 타임아웃 없이 대기
- 여러 컴포넌트에서 사용 시 요청 수 폭증

## 📊 서버 CPU 부하 원인

### 시나리오
1. 사용자가 대시보드 진입 → 3개 요청 시작
2. CORS 에러 발생 → 하지만 연결은 유지
3. 사용자가 탭 전환 → refetchOnWindowFocus로 또 3개 요청
4. 페이지 새로고침 → 또 3개 요청
5. **결과**: 끊기지 않는 연결들이 서버에 누적

### 서버 영향
- **Connection Pool 고갈**: 최대 연결 수 도달
- **메모리 누수**: 각 연결마다 메모리 할당
- **CPU 오버헤드**: 많은 연결 관리로 Context Switching 증가
- **로그 처리 부하**: 실패한 요청들의 로그 처리

## ✅ 해결 방안

### 1. Axios 타임아웃 설정
```javascript
// 수정 후
const aiApiClient = axios.create({
  baseURL: AI_API_BASE_URL,
  timeout: 10000,  // 10초 타임아웃
  headers: {
    'X-API-Key': AI_API_KEY,
    'Content-Type': 'application/json'
  }
});
```

### 2. React Query 최적화
```javascript
// 수정 후
{
  enabled: !!userId,
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,  // 10분 (구 cacheTime)
  retry: false,
  refetchOnWindowFocus: false,  // 윈도우 포커스 시 재요청 방지
  refetchOnMount: false,  // 재마운트 시 재요청 방지
  refetchOnReconnect: false,  // 재연결 시 재요청 방지
}
```

### 3. 에러 처리 개선
```javascript
// 타임아웃과 CORS 에러 구분
queryFn: async () => {
  try {
    const response = await aiApiClient.get(url);
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.log('AI API 타임아웃 (10초)');
      return null;
    }
    if (error.code === 'ERR_NETWORK' || error.message?.includes('CORS')) {
      console.log('CORS 에러 - 로컬 환경에서는 정상');
      return null;
    }
    throw error;
  }
}
```

### 4. 요청 디바운싱 (선택사항)
```javascript
import { debounce } from 'lodash';

// 디바운스된 요청 함수
const debouncedFetch = debounce(async (userId) => {
  // API 호출 로직
}, 1000);  // 1초 디바운싱
```

### 5. 순차적 요청으로 변경 (선택사항)
```javascript
// 동시 요청 대신 순차적 요청
const fetchAllInsights = async (userId) => {
  const insights = {};
  
  for (const type of ['nurse_summary', 'culture', 'skill_transfer']) {
    try {
      const response = await aiApiClient.get(`/generate/${type}?user_id=${userId}`);
      insights[type] = response.data;
    } catch (error) {
      insights[type] = null;
    }
  }
  
  return insights;
};
```

## 📝 구현 체크리스트

- [ ] axios 인스턴스에 타임아웃 설정 추가
- [ ] React Query 옵션 최적화 (refetch 설정)
- [ ] 에러 처리 로직 개선 (타임아웃/CORS 구분)
- [ ] 로딩 상태 UI 개선 (타임아웃 시 적절한 메시지)
- [ ] 프로덕션과 개발 환경 분기 처리
- [ ] 테스트 (네트워크 탭에서 요청 횟수 확인)

## 🧪 테스트 방법

1. **Chrome DevTools Network 탭**에서 요청 횟수 모니터링
2. 탭 전환 시 재요청 발생 여부 확인
3. 타임아웃 동작 확인 (Network 탭에서 Slow 3G 설정)
4. 서버 CPU 사용률 모니터링

## 📌 참고사항

- 로컬 개발 환경에서는 CORS 에러가 발생하지만 프로덕션에서는 정상 동작
- AI API 서버 측에 CORS 설정 요청 중
- 타임아웃은 AI 생성 시간을 고려하여 조정 필요 (현재 제안: 10초)