import React from 'react';
import type { PaySummaryProps } from '../types';

export function PaySummary({
  baseWeeklyPay,
  totalDifferentialWeekly,
  totalWeeklyPay,
  estimatedAnnualPay,
}: PaySummaryProps) {
  return (
    <div className="bg-green-50 rounded-lg p-4">
      <h4 className="text-md font-medium text-gray-900 mb-3">Pay Summary</h4>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">
            ${baseWeeklyPay.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">Base Weekly</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">
            ${totalDifferentialWeekly.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">Differential Weekly</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800">
            ${totalWeeklyPay.toFixed(2)}
          </div>
          <div className="text-xs text-gray-600">Total Weekly</div>
        </div>
        
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            ${estimatedAnnualPay.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600">Estimated Annual</div>
        </div>
      </div>
    </div>
  );
}