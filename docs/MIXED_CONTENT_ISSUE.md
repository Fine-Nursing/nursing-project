# Mixed Content 문제 해결 가이드

## 🔴 현재 문제

프로덕션 환경(Vercel)에서 AI API 호출 시 Mixed Content 에러 발생:

```
Mixed Content: The page at 'https://nursing-project.vercel.app/...' was loaded over HTTPS, 
but requested an insecure XMLHttpRequest endpoint 'http://199.241.139.206:8000/...'
```

**원인**: Vercel은 HTTPS로 서비스되는데 AI API는 HTTP로만 제공됨

## 📊 영향

- 브라우저가 보안상 HTTP 요청을 차단
- AI insights 기능이 프로덕션에서 전혀 작동하지 않음
- 사용자는 AI 기반 추천을 받을 수 없음

## ✅ 해결 방안

### 방안 1: AI API에 HTTPS 적용 (권장)
AI API 서버에 SSL 인증서를 설치하여 HTTPS로 서비스

**장점**:
- 가장 깨끔한 해결책
- 보안 강화
- 별도 코드 수정 불필요

**필요 작업**:
1. AI API 서버에 SSL 인증서 설치 (Let's Encrypt 무료 인증서 추천)
2. FastAPI 서버를 HTTPS로 구동
3. 프론트엔드 .env에서 URL을 https://로 변경

### 방안 2: 백엔드 프록시 구현
NestJS 백엔드를 통해 AI API를 프록시

**장점**:
- AI API 서버 수정 불필요
- 추가 보안 레이어 제공
- API Key를 백엔드에서 관리 가능

**구현 코드**:
```typescript
// BE/src/modules/ai-proxy/ai-proxy.controller.ts
@Controller('api/ai-proxy')
export class AiProxyController {
  private readonly AI_API_URL = 'http://199.241.139.206:8000';
  private readonly AI_API_KEY = process.env.AI_API_KEY;

  @Get('generate/:summaryType')
  async getInsight(
    @Param('summaryType') summaryType: string,
    @Query('user_id') userId: string,
  ) {
    const response = await axios.get(
      `${this.AI_API_URL}/generate/${summaryType}?user_id=${userId}`,
      { headers: { 'X-API-Key': this.AI_API_KEY } }
    );
    return response.data;
  }
}
```

**프론트엔드 수정**:
```typescript
// AI API URL을 백엔드 프록시로 변경
const AI_API_BASE_URL = process.env.NEXT_PUBLIC_BE_URL + '/api/ai-proxy';
```

### 방안 3: Vercel Rewrites 사용
Vercel의 rewrites 기능으로 프록시 설정

**next.config.js**:
```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/ai/:path*',
        destination: 'http://199.241.139.206:8000/:path*',
      },
    ];
  },
};
```

**장점**:
- 빠른 구현
- 백엔드 수정 불필요

**단점**:
- Vercel 설정에서만 작동
- 로컬 개발 환경과 다른 동작

## 🚨 추가 발견된 문제들

### 1. 백엔드 서버 504 Gateway Timeout
```
https://nurse-backend.duckdns.org/api/dashboard/wage-distribution
https://nurse-backend.duckdns.org/api/ai-insights/all
```

**원인**: 백엔드 서버가 응답하지 않음
**해결**: 서버 상태 확인 및 재시작 필요

### 2. 구 버전 코드 잔존
- `src/api/useAiInsights.ts` (구 버전) - 백엔드 API 호출
- `src/api/ai/useAiInsights.ts` (새 버전) - AI API 직접 호출

**해결**: 
- ✅ 모든 import를 새 버전으로 변경 완료
- 구 버전 파일 제거 필요

## 📝 Action Items

1. **즉시 조치** (임시 해결)
   - [ ] 백엔드 프록시 구현으로 Mixed Content 우회
   
2. **장기 조치** (영구 해결)
   - [ ] AI API 서버에 HTTPS 적용 요청
   - [ ] 백엔드 서버 안정성 개선
   - [ ] 구 버전 코드 완전 제거

3. **테스트**
   - [ ] 프로덕션 환경에서 AI insights 동작 확인
   - [ ] 백엔드 API 응답 시간 모니터링
   - [ ] CORS 설정 확인

## 📌 참고사항

- 현재 로컬 개발 환경에서는 CORS 에러 발생 (AI 서버 설정 필요)
- 프로덕션에서는 Mixed Content로 완전 차단
- API Key는 환경 변수로 관리 중