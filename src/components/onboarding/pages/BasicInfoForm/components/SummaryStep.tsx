import React from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Briefcase, Clock } from 'lucide-react';
import ActionButton from 'src/components/button/ActionButton';
import SummaryCard from '../../../components/SummaryCard';
import CustomDropdown from '../../../components/CustomDropdown';
import { BASIC_INFO_QUESTIONS, FIELD_LABELS } from '../constants';
import type { SummaryStepProps } from '../types';

const ICONS = {
  name: User,
  education: GraduationCap,
  nursingRole: Briefcase,
  experienceYears: Clock,
};

export function SummaryStep({
  formData,
  onEdit,
  onSubmit,
  onBack,
  isSubmitting,
  editingField,
  setEditingField,
  updateFormData,
}: SummaryStepProps) {
  const summaryItems = [
    {
      label: 'Name',
      value: formData.name,
      icon: <User className="w-4 h-4" />,
    },
    {
      label: 'Education',
      value: formData.education,
      icon: <GraduationCap className="w-4 h-4" />,
      options: BASIC_INFO_QUESTIONS.find(q => q.key === 'education')?.options,
      inputType: 'select' as const,
    },
    {
      label: 'Nursing Role',
      value: formData.nursingRole,
      icon: <Briefcase className="w-4 h-4" />,
      options: BASIC_INFO_QUESTIONS.find(q => q.key === 'nursingRole')?.options,
      inputType: 'select' as const,
    },
    {
      label: 'Years of Experience',
      value: formData.experienceYears,
      icon: <Clock className="w-4 h-4" />,
      inputType: 'number' as const,
    },
  ];

  const handleEdit = (itemLabel: string, newValue: string) => {
    const fieldKey = Object.entries(FIELD_LABELS).find(
      ([, label]) => label === itemLabel
    )?.[0] as keyof typeof FIELD_LABELS;

    if (fieldKey) {
      updateFormData({
        [fieldKey]: fieldKey === 'experienceYears' ? Number(newValue) : newValue,
      });
    }
    setEditingField(null);
  };

  const canSubmit = formData.name && 
                   formData.education && 
                   formData.nursingRole && 
                   formData.experienceYears !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Review Your Information
          </h2>
          <p className="text-lg text-gray-600 dark:text-slate-300">
            Please review and confirm your basic information before proceeding
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <SummaryCard
            title="Basic Information"
            items={summaryItems}
            onEdit={handleEdit}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <ActionButton
            variant="outline"
            onClick={onBack}
            className="flex-1"
            disabled={isSubmitting}
          >
            Back to Questions
          </ActionButton>
          
          <ActionButton
            variant="solid"
            onClick={onSubmit}
            className="flex-1"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </ActionButton>
        </motion.div>
      </div>
    </div>
  );
}