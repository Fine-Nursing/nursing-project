import React from 'react';
import type { BasicPaySectionProps } from '../types';
import { payFrequencyOptions, contractTypeOptions } from '../constants';

export function BasicPaySection({
  hourlyRate,
  weeklyHours,
  payFrequency,
  contractType,
  updateHourlyRate,
  updateWeeklyHours,
  updatePayFrequency,
  updateContractType,
}: BasicPaySectionProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-md font-medium text-gray-900 mb-4">Base Pay Information</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Rate *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">$</span>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => updateHourlyRate(e.target.value)}
              step="0.01"
              min="0"
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekly Hours *
          </label>
          <input
            type="number"
            value={weeklyHours}
            onChange={(e) => updateWeeklyHours(e.target.value)}
            min="1"
            max="168"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pay Frequency *
          </label>
          <select
            value={payFrequency}
            onChange={(e) => updatePayFrequency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select frequency</option>
            {payFrequencyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Type *
          </label>
          <select
            value={contractType}
            onChange={(e) => updateContractType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select type</option>
            {contractTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}