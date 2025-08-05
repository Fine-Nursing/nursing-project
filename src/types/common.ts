// 정렬 관련
export type SortOrder = 'asc' | 'desc';

// 경력 그룹
export type ExperienceGroup = 'beginner' | 'junior' | 'experienced' | 'senior';

// 페이지네이션 (필요시)
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// API 공통 응답 (필요시)
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
