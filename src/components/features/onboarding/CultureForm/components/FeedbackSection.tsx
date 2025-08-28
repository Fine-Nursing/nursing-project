import { m } from 'framer-motion';
import type { CultureFormData } from '../types';

interface FeedbackSectionProps {
  formData: CultureFormData;
  onFeedbackChange: (feedback: string) => void;
}

export default function FeedbackSection({
  formData,
  onFeedbackChange,
}: FeedbackSectionProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-1">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          Anything else to share?
        </h3>
        <span className="text-xs sm:text-sm text-gray-400">
          Optional • {formData.freeTextFeedback?.length || 0}/500
        </span>
      </div>

      <textarea
        value={formData.freeTextFeedback || ''}
        onChange={(e) => onFeedbackChange(e.target.value)}
        maxLength={500}
        rows={4}
        placeholder="Share your thoughts about work environment, team dynamics, or suggestions for improvement..."
        className="w-full p-3 sm:p-4 text-sm sm:text-base text-gray-700 bg-gray-50 border border-gray-200 rounded-xl
                 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 
                 outline-none transition-all resize-none"
      />
    </m.div>
  );
}