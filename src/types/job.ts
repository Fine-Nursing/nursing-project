/**
 * Job information (document) structure owned by User
 */
export interface JobDto {
  /** Unique identifier in DB (e.g.: UUID) */
  jobID: string; // e.g.: "jobID1"

  /** Hospital/organization related information */
  organizationName: string; // e.g.: "ABC Hospital"
  organizationEmploymentStartYear: number; // e.g.: 2020
  organizationCity: string; // e.g.: "New York"
  organizationState: string; // e.g.: "NY"

  /** Actual Job detailed information (corresponds to job_details in original document) */
  job_details: {
    nursingRole: string; // e.g.: "Registered Nurse"
    specialty: string; // e.g.: "Cardiology"
    subSpecialty: string; // e.g.: "Pediatric Cardiology"
    shiftType: string; // e.g.: "Night"
    employmentType: string; // e.g.: "Full-time"
    basePay: number; // e.g.: 45
    basePay_unit: string; // e.g.: "hourly"
    nurseToPatientRatio: string; // e.g.: "1:4"
    certifications: string[]; // e.g.: ["ACLS", "BLS", "PALS"]
    unionized: boolean; // e.g.: true
  };

  /** Allowance/differential related information */
  differentials: {
    totalDifferential: number; // e.g.: 20
    differentialsFreeText: string;
    // e.g.: "Bonuses for advanced certifications."

    individualDifferentials: Array<{
      type: string; // e.g.: "Night Shift"
      amount: number; // e.g.: 10
    }>;
  };

  /** Organization culture related information */
  culture: {
    unitFeedback: string; // e.g.: "One thing the unit does well is patient care..."
    unitCultureRating: number; // e.g.: 8
  };

  /** Career history information */
  historicalInfo: {
    startDate: string; // e.g.: "2020-01-01"
    endDate: string | null; // e.g.: null
    yearsInJob: number; // e.g.: 5
  };
}
