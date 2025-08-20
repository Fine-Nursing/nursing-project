export type BasicQuestion = {
  key: 'name' | 'education' | 'nursingRole' | 'experienceYears';
  title: string;
  subtitle: string;
  validation?: (value: string) => boolean;
  options?: string[];
  inputType?: 'text' | 'number';
};