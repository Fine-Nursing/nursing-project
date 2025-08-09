// components/CareerDashboard/CareerForm.tsx
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Sparkles, BarChart4, Plus } from 'lucide-react';

import type { NewItemInput } from './types';

interface CareerFormProps {
  newItem: NewItemInput;
  onChangeText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeStartDate: (date: Date | null) => void;
  onChangeEndDate: (date: Date | null) => void;
  onAdd: () => void;
  onAiSuggest: () => void;
  onSalaryTrend: () => void;
  editingItemId?: number | null;
}

export default function CareerForm({
  newItem,
  onChangeText,
  onChangeStartDate,
  onChangeEndDate,
  onAdd,
  onAiSuggest,
  onSalaryTrend,
  editingItemId,
}: CareerFormProps) {
  return (
    <div className="bg-mint-50 border border-slate-100 rounded-lg p-4 space-y-4 shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Facility */}
        <div>
          <label
            htmlFor="facility"
            className="block mb-1 text-sm font-medium text-gray-600"
          >
            Facility
          </label>
          <input
            id="facility"
            name="facility"
            value={newItem.facility}
            onChange={onChangeText}
            placeholder="e.g. NYU Langone"
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
          />
        </div>
        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="block mb-1 text-sm font-medium text-gray-600"
          >
            Role
          </label>
          <input
            id="role"
            name="role"
            value={newItem.role}
            onChange={onChangeText}
            placeholder="e.g. RN"
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
          />
        </div>
        {/* Specialty */}
        <div>
          <label
            htmlFor="specialty"
            className="block mb-1 text-sm font-medium text-gray-600"
          >
            Specialty
          </label>
          <input
            id="specialty"
            name="specialty"
            value={newItem.specialty}
            onChange={onChangeText}
            placeholder="e.g. ER, NICU"
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Start Date */}
        <div>
          <label
            htmlFor="startDate"
            className="block mb-1 text-sm font-medium text-gray-600"
          >
            Start Date
          </label>
          <DatePicker
            id="startDate"
            selected={newItem.startDate}
            onChange={onChangeStartDate}
            dateFormat="MMM yyyy"
            showMonthYearPicker
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
          />
        </div>
        {/* End Date */}
        <div>
          <label
            htmlFor="endDate"
            className="block mb-1 text-sm font-medium text-gray-600"
          >
            End Date
          </label>
          <DatePicker
            id="endDate"
            selected={newItem.endDate}
            onChange={onChangeEndDate}
            dateFormat="MMM yyyy"
            showMonthYearPicker
            placeholderText="Ongoing if empty"
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
          />
        </div>
        {/* Hourly Rate */}
        <div>
          <label
            htmlFor="hourlyRate"
            className="block mb-1 text-sm font-medium text-gray-600"
          >
            Hourly Rate
          </label>
          <input
            id="hourlyRate"
            name="hourlyRate"
            type="number"
            step="0.01"
            value={newItem.hourlyRate}
            onChange={onChangeText}
            placeholder="e.g. 35.5"
            className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
          />
        </div>
      </div>
      {/* AI Buttons / Add */}
      <div className="flex flex-wrap justify-between items-center mt-3">
        <div className="space-x-2">
          <button
            type="button"
            onClick={onAiSuggest}
            className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-600 px-3 py-1 hover:bg-emerald-200 transition"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            AI Suggest Role
          </button>
          <button
            type="button"
            onClick={onSalaryTrend}
            className="inline-flex items-center rounded-full bg-cyan-100 text-cyan-600 px-3 py-1 hover:bg-cyan-200 transition"
          >
            <BarChart4 className="w-4 h-4 mr-1" />
            Salary Trend
          </button>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-full bg-slate-500 text-white px-4 py-1.5 hover:bg-slate-600 flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          {editingItemId ? 'Update Career' : 'Add Career'}
        </button>
      </div>
    </div>
  );
}
