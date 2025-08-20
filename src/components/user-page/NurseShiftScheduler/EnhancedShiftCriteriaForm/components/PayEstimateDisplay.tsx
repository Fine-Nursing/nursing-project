import React from 'react';
import type { PayEstimates, Criteria } from '../types';

interface PayEstimateDisplayProps {
  payEstimates: PayEstimates;
  totalWeeks: number;
  theme: 'light' | 'dark';
}

export function PayEstimateDisplay({ payEstimates, totalWeeks, theme }: PayEstimateDisplayProps) {
  return (
    <div
      className={`border-t pt-3 mt-3 ${
        theme === 'light' ? 'border-slate-200' : 'border-slate-500'
      }`}
    >
      <h4
        className={`text-sm font-medium mb-2 ${
          theme === 'light' ? 'text-slate-700' : 'text-slate-300'
        }`}
      >
        Quick Pay Estimate
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div>
          <span className="font-medium">Base Pay:</span> $
          {payEstimates.basePay}/hr
          <br />
          <span className="font-medium">Differential:</span> +$
          {payEstimates.diffRate}/hr
          <br />
          <span className="font-medium">Total Hourly Rate:</span> $
          {payEstimates.totalRate}/hr
        </div>
        <div>
          <span className="font-medium">Expected Hrs/Week:</span>{' '}
          {payEstimates.weeklyHours}
          <br />
          <span className="font-medium">Weekly Earnings:</span> $
          {payEstimates.weeklyEarnings}
          <br />
          <span className="font-medium">
            Total ({totalWeeks} wks):
          </span>{' '}
          ${payEstimates.totalEarnings}
        </div>
      </div>
    </div>
  );
}