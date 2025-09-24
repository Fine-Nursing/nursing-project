import type { AxiosError } from 'axios';
import axios from 'axios';
import toast from 'react-hot-toast';

// Vercel Rewrites를 사용하므로 상대 경로 사용
const API_BASE_URL = '';

// 공통 axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 에러 메시지 파싱 함수
const getErrorMessage = (error: AxiosError<{ message?: string; detail?: string }>): string => {
  // 백엔드에서 보낸 에러 메시지가 있는 경우
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // 백엔드에서 보낸 에러 디테일이 있는 경우
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  
  // 백엔드에서 보낸 에러가 문자열인 경우
  if (typeof error.response?.data === 'string') {
    return error.response.data;
  }
  
  // HTTP 상태 코드별 기본 메시지
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Please login to continue.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. Please try again.';
      case 422:
        return 'The provided data is invalid.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return `An error occurred (${error.response.status})`;
    }
  }
  
  // 네트워크 에러
  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }
  
  if (error.code === 'ERR_NETWORK') {
    return 'Network error. Please check your connection.';
  }
  
  // 기본 에러 메시지
  return 'An unexpected error occurred. Please try again.';
};

// Response 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 에러 특별 처리 (로그인 필요)
    if (error.response?.status === 401) {
      // 이미 로그인 페이지거나 공개 API인 경우는 토스트 표시 안함
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      const isPublicEndpoint = error.config?.url?.includes('/dashboard/compensation-cards');
      
      if (!isAuthEndpoint && !isPublicEndpoint) {
        toast.error('Please login to continue', {
          icon: '🔐',
          duration: 4000,
        });
      }
    } else if (error.response?.status !== 404) {
      // 404는 조용히 처리, 다른 에러만 토스트로 표시
      const errorMessage = getErrorMessage(error);
      
      // 개발 환경에서는 404가 아닌 경우만 콘솔에 출력
      if (process.env.NODE_ENV === 'development' && error.response?.status !== 404) {
        // eslint-disable-next-line no-console
        console.error('API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          message: errorMessage,
        });
      }
      
      // 404는 토스트 표시 안 함
      if (error.response?.status !== 404) {
        toast.error(errorMessage, {
          duration: 5000,
          style: {
            maxWidth: '500px',
          },
        });
      }
    }
    
    return Promise.reject(error);
  }
);

// Request 인터셉터 - 요청 로깅 (개발 환경)
apiClient.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;