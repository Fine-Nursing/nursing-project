import type { JobDto } from './job';

/**
 * 프론트엔드에서 'User' 엔티티를 표시하거나
 * API로부터 GET 응답을 받을 때 사용하는 DTO
 */
export interface UserDto {
  /** DB 상의 고유 식별자 (예: UUID) */
  userID: string; // 예: "userID1"

  /** 공개 정보 영역 */
  public: {
    firstName: string; // 예: "John"
    lastName: string; // 예: "Doe"
  };

  /** 비공개 정보 영역 */
  private: {
    email: string; // 예: "john.doe@example.com"
    password: string; // 예: "hashed_password_here"
    dateSubmitted: string; // 예: "2024-11-15" (ISO Date String)
  };

  /** 전문 정보 영역 */
  professionalInfo: {
    nursingRole: string; // 예: "Registered Nurse"
    highestLevelOfEducation: string; // 예: "Bachelor's of Science in Nursing"
    totalYearsOfExperience: number; // 예: 3
  };

  /**
   * 사용자가 여러 직장(Job)을 가질 수 있다고 했으므로,
   * 배열 형태로 JobDto를 보관
   */
  jobs: JobDto[];
}
