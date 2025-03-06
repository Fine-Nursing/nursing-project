/**
 * User가 가진 직장 정보(문서) 구조
 */
export interface JobDto {
  /** DB 상의 고유 식별자 (예: UUID) */
  jobID: string; // 예: "jobID1"

  /** 병원/기관 관련 정보 */
  organizationName: string; // 예: "ABC Hospital"
  organizationEmploymentStartYear: number; // 예: 2020
  organizationCity: string; // 예: "New York"
  organizationState: string; // 예: "NY"

  /** 실제 Job 세부 정보(원 문서에서 job_details에 해당) */
  job_details: {
    nursingRole: string; // 예: "Registered Nurse"
    specialty: string; // 예: "Cardiology"
    subSpecialty: string; // 예: "Pediatric Cardiology"
    shiftType: string; // 예: "Night"
    employmentType: string; // 예: "Full-time"
    basePay: number; // 예: 45
    basePay_unit: string; // 예: "hourly"
    nurseToPatientRatio: string; // 예: "1:4"
    certifications: string[]; // 예: ["ACLS", "BLS", "PALS"]
    unionized: boolean; // 예: true
  };

  /** 수당/디퍼렌셜 관련 정보 */
  differentials: {
    totalDifferential: number; // 예: 20
    differentialsFreeText: string;
    // 예: "Bonuses for advanced certifications."

    individualDifferentials: Array<{
      type: string; // 예: "Night Shift"
      amount: number; // 예: 10
    }>;
  };

  /** 조직 문화 관련 정보 */
  culture: {
    unitFeedback: string; // 예: "One thing the unit does well is patient care..."
    unitCultureRating: number; // 예: 8
  };

  /** 경력 히스토리 정보 */
  historicalInfo: {
    startDate: string; // 예: "2020-01-01"
    endDate: string | null; // 예: null
    yearsInJob: number; // 예: 5
  };
}
