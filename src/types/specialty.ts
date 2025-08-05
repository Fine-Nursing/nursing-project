export interface SpecialtyCompensation {
  specialty: string;
  totalCompensation: number;
  basePay: number;
  differentialPay: number;
}

export type CompensationSortBy = 'total' | 'base' | 'differential';
