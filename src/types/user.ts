import type { JobDto } from './job';

/**
 * DTO used to display User entity in frontend
 * or receive GET responses from API
 */
export interface UserDto {
  /** Unique identifier in DB (e.g.: UUID) */
  userID: string; // e.g.: "userID1"

  /** Public information section */
  public: {
    firstName: string; // e.g.: "John"
    lastName: string; // e.g.: "Doe"
    emojiJson?: string; // beanheads avatar config JSON
  };

  /** Private information section */
  private: {
    email: string; // e.g.: "john.doe@example.com"
    password: string; // e.g.: "hashed_password_here"
    dateSubmitted: string; // e.g.: "2024-11-15" (ISO Date String)
  };

  /** Professional information section */
  professionalInfo: {
    nursingRole: string; // e.g.: "Registered Nurse"
    highestLevelOfEducation: string; // e.g.: "Bachelor's of Science in Nursing"
    totalYearsOfExperience: number; // e.g.: 3
  };

  /**
   * Since users can have multiple jobs,
   * store JobDto in array format
   */
  jobs: JobDto[];
}
