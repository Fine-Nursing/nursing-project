import React from 'react';
import type { CustomRatioSectionProps } from '../types';

export function CustomRatioSection({
  customRatio,
  updateCustomRatio,
}: CustomRatioSectionProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Custom Tax Ratio or Special Instructions (Optional)
      </label>
      <textarea
        value={customRatio}
        onChange={(e) => updateCustomRatio(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter any special tax considerations, stipend information, or custom ratios..."
      />
    </div>
  );
}