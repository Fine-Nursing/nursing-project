import { m } from 'framer-motion';
import { User, GraduationCap, Briefcase, Clock } from 'lucide-react';
import ActionButton from 'src/components/ui/button/ActionButton';
import SummaryCard from '../../components/SummaryCard';
import type { BasicQuestion } from '../types';

interface SummaryStepProps {
  questions: BasicQuestion[];
  getFieldLabel: (key: string) => string;
  getFormDataValue: (key: string) => string;
  updateFormData: (data: any) => void;
  handleReset: () => void;
  setStep: (step: any) => void;
  handleContinue: () => void;
  isLoading: boolean;
  isFormValid: () => boolean;
}

export default function SummaryStep({
  questions,
  getFieldLabel,
  getFormDataValue,
  updateFormData,
  handleReset,
  setStep,
  handleContinue,
  isLoading,
  isFormValid,
}: SummaryStepProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8 sm:py-12"
    >
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Perfect! Let&apos;s Review Your Information
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl">
          Please review your details and make any changes if needed.
        </p>
      </div>

      <SummaryCard
        title="Your Information"
        items={questions.map((q) => ({
          label: getFieldLabel(q.key),
          value: q.key === 'experienceYears' 
            ? getFormDataValue(q.key)
            : getFormDataValue(q.key),
          icon: q.key === 'name' ? <User className="w-4 h-4" /> :
                q.key === 'education' ? <GraduationCap className="w-4 h-4" /> :
                q.key === 'nursingRole' ? <Briefcase className="w-4 h-4" /> :
                <Clock className="w-4 h-4" />,
          options: q.options,
          inputType: q.inputType
        }))}
        onEdit={(label, newValue) => {
          const question = questions.find(q => getFieldLabel(q.key) === label);
          if (question) {
            updateFormData({ [question.key]: newValue });
          }
        }}
        className="mb-6 sm:mb-10"
      />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex gap-4 order-2 sm:order-1">
          <ActionButton
            onClick={handleReset}
            variant="outline"
            className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
          >
            Start Over
          </ActionButton>
          <ActionButton
            onClick={() => setStep('welcome')}
            variant="outline"
            className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
          >
            Cancel
          </ActionButton>
        </div>
        <ActionButton
          onClick={handleContinue}
          disabled={isLoading || !isFormValid()}
          className="w-full sm:w-auto px-6 py-2 sm:px-8 sm:py-4 text-base sm:text-lg order-1 sm:order-2"
        >
          {isLoading ? (
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