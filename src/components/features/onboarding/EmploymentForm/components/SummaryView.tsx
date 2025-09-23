import { m } from 'framer-motion';
import { Building, MapPinned, Heart, Award, Briefcase, Clock, Users, DollarSign } from 'lucide-react';
import ActionButton from 'src/components/ui/button/ActionButton';
import type { EmploymentType, ShiftType } from 'src/types/onboarding';
import SummaryCard from '../../components/SummaryCard';

interface SummaryViewProps {
  formData: any;
  updateFormData: (data: any) => void;
  calculateTotalDifferentials: (differentials: any[]) => { hourly: number; annual: number };
  handleContinue: () => Promise<void>;
  setShowSummary: (show: boolean) => void;
  employmentMutation: any;
}

export default function SummaryView({
  formData,
  updateFormData,
  calculateTotalDifferentials,
  handleContinue,
  setShowSummary,
  employmentMutation,
}: SummaryViewProps) {
  const summaryItems = [
    { label: 'Organization', value: formData.organizationName || 'Not specified', icon: <Building className="w-4 h-4" /> },
    { label: 'Location', value: `${formData.organizationCity || ''}, ${formData.organizationState || ''}`.trim() || 'Not specified', icon: <MapPinned className="w-4 h-4" /> },
    { label: 'Specialty', value: formData.specialty || 'Not specified', icon: <Heart className="w-4 h-4" /> },
    { label: 'Sub-specialty', value: formData.subSpecialty || 'Not specified', icon: <Award className="w-4 h-4" /> },
    { label: 'Employment Type', value: formData.employmentType || 'Not specified', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Shift Type', value: formData.shiftType || 'Not specified', icon: <Clock className="w-4 h-4" /> },
    { label: 'Nurse-Patient Ratio', value: formData.nurseToPatientRatio || 'Not specified', icon: <Users className="w-4 h-4" /> },
    { label: 'Base Pay', value: formData.basePay ? `$${formData.basePay}/${formData.paymentFrequency === 'yearly' ? 'year' : 'hour'}` : 'Not specified', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Unionized', value: formData.isUnionized ? 'Yes' : 'No', icon: <Users className="w-4 h-4" /> },
  ];

  // Add differentials total if exists
  if (formData.individualDifferentials && formData.individualDifferentials.length > 0) {
    const totals = calculateTotalDifferentials(formData.individualDifferentials);
    summaryItems.push({
      label: 'Total Differentials',
      value: `+$${totals.hourly}/hr${totals.annual > 0 ? ` + $${totals.annual}/year` : ''}`,
      icon: <DollarSign className="w-4 h-4" />
    });
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Excellent! Let's Review Your Details
        </h2>
        <p className="text-gray-500 text-lg">
          Take a moment to review your employment information
        </p>
      </div>

      <SummaryCard
        title="Employment Information"
        items={summaryItems}
        onEdit={(label, newValue) => {
          if (label === 'Organization') {
            updateFormData({ organizationName: newValue });
          } else if (label === 'Location') {
            const [city = '', state = ''] = newValue.split(',').map(s => s.trim());
            updateFormData({ organizationCity: city, organizationState: state });
          } else if (label === 'Specialty') {
            updateFormData({ specialty: newValue });
          } else if (label === 'Sub-specialty') {
            updateFormData({ subSpecialty: newValue });
          } else if (label === 'Employment Type') {
            updateFormData({ employmentType: newValue as EmploymentType });
          } else if (label === 'Shift Type') {
            updateFormData({ shiftType: newValue as ShiftType });
          } else if (label === 'Nurse-Patient Ratio') {
            updateFormData({ nurseToPatientRatio: newValue });
          } else if (label === 'Base Pay') {
            const match = newValue.match(/\$?(\d+(?:\.\d+)?)/);
            if (match) updateFormData({ basePay: parseFloat(match[1]) });
          }
          else if (label === 'Unionized') {
            updateFormData({ isUnionized: newValue === 'Yes' });
          }
        }}
        className="mb-8"
      />

      <div className="flex justify-between">
        <ActionButton
          onClick={() => setShowSummary(false)}
          variant="outline"
          className="px-3 py-1.5 sm:px-6 sm:py-3 text-sm sm:text-base"
        >
          ← Edit Details
        </ActionButton>
        <ActionButton
          onClick={handleContinue}
          disabled={employmentMutation.isPending}
          className="px-3 py-1.5 sm:px-8 sm:py-3 text-sm sm:text-base"
        >
          {employmentMutation.isPending ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Saving...
            </span>
          ) : (
            'Continue to Next Step →'
          )}
        </ActionButton>
      </div>
    </m.div>
  );
}