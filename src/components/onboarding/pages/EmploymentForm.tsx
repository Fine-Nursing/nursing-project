'use client';

import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import ActionButton from 'src/components/button/ActionButton';
import {
  NURSE_PATIENT_RATIOS,
  // NURSING_SPECIALTIES, // 기존 배열은 사용 안함
} from 'src/constants/onbarding';
import useOnboardingStore from 'src/store/onboardingStores';

// Specialty 자동완성을 위해 사용할 전체 리스트
const ALL_SPECIALTIES = [
  'Admin',
  'Aesthetics',
  'Ambulatory Care',
  'Cardiac',
  'Cardiac ICU',
  'Catheterization Lab',
  'Correctional Nursing',
  'Dermatology',
  'Dialysis',
  'Emergency',
  'Endocrinology',
  'Family Practice',
  'Float',
  'Gastroenterology',
  'Geriatric',
  'Hematology/Oncology',
  'Home Health',
  'ICU',
  'IMCU',
  'Infectious Disease',
  'Interventional Radiology',
  'Medical Surgical',
  'NICU',
  'Nephrology',
  'Neuro',
  'Neuro/Cardiac',
  'Nursery',
  'OBGYN',
  'Occupational Health',
  'Oncology',
  'Orthopedics',
  'Palliative Care',
  'Pediatric',
  'Perioperative Care (Operating Room)',
  'Perioperative Care (PACU)',
  'Perioperative Care (Preoperative Care & PACU)',
  'Perioperative Care (Preoperative Care)',
  'Psychiatry',
  'Public Health',
  'Pulmonary',
  'Rehab',
  'Research',
  'Residency',
  'School Nursing',
  'Sexual Assault Nurse Examiner (SANE)',
  'Skilled Nursing',
  'Transplant Care',
  'Triage',
  'Urology',
  'Wound Care',
];

// Employment Type 옵션
const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Per Diem/PRN',
  'Temporary/Contract',
  'TravelNursing',
  'Agency Nursing',
];

// Shift Type 옵션
type ShiftType =
  | 'Day Shift'
  | 'Night Shift'
  | 'Evening Shift'
  | 'Rotating Shift';

export default function EmploymentForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();

  // Specialty 자동완성용 로컬 상태
  const [specialtyInput, setSpecialtyInput] = useState(
    formData.specialty || ''
  );
  const [showSpecialtySuggestions, setShowSpecialtySuggestions] =
    useState(false);

  // specialtyInput 기준으로 필터링된 목록
  const filteredSpecialties = ALL_SPECIALTIES.filter((s) =>
    s.toLowerCase().includes(specialtyInput.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('culture');
  };

  // Specialty를 직접 변경하고, store에도 저장
  const handleSelectSpecialty = useCallback(
    (selected: string) => {
      setSpecialtyInput(selected);
      updateFormData({ specialty: selected });
      setShowSpecialtySuggestions(false);
    },
    [updateFormData]
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Let's Talk About Your Work <span className="text-teal-600">👩‍⚕️</span>
          </h2>
          <p className="text-gray-500 text-lg">
            We'll keep this quick and simple!
          </p>
        </div>

        {/* 메인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 근무 기본 정보 섹션 */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">🏢</span> Your Workplace
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specialty */}
              <div className="space-y-2 relative">
                <label className="block text-sm font-medium text-gray-700">
                  What's your specialty?
                </label>
                {/* 기존 select 대신 검색 가능 input */}
                <input
                  type="text"
                  value={specialtyInput}
                  onChange={(e) => {
                    setSpecialtyInput(e.target.value);
                    updateFormData({ specialty: e.target.value });
                    setShowSpecialtySuggestions(true);
                  }}
                  onFocus={() => setShowSpecialtySuggestions(true)}
                  placeholder="e.g., ICU, Pediatrics"
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                />
                {/* 자동완성 추천 목록 */}
                {showSpecialtySuggestions && filteredSpecialties.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto">
                    {filteredSpecialties.map((s) => (
                      <li
                        key={s}
                        onClick={() => handleSelectSpecialty(s)}
                        className="cursor-pointer px-4 py-2 hover:bg-teal-100"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Sub-specialty */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Have a sub-specialty? (Optional)
                </label>
                <input
                  type="text"
                  value={formData.subSpecialty || ''}
                  onChange={(e) =>
                    updateFormData({ subSpecialty: e.target.value })
                  }
                  placeholder="E.g., Pediatric ICU"
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Where do you work?
                </label>
                {/* 여기서 나중에 구글 플레이스 등과 연동하여 병원 명/기관 명 자동 검색 가능 */}
                <input
                  type="text"
                  value={formData.organizationName || ''}
                  onChange={(e) =>
                    updateFormData({ organizationName: e.target.value })
                  }
                  placeholder="Hospital or organization name"
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                />
              </div>

              {/* Employment Start Year */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Since when?
                </label>
                <input
                  type="number"
                  min={1950}
                  max={new Date().getFullYear()}
                  value={formData.employmentStartYear || ''}
                  onChange={(e) =>
                    updateFormData({
                      employmentStartYear: parseInt(e.target.value, 10),
                    })
                  }
                  placeholder="Start year"
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* 구글 플레이스 API 등을 통한 위치 자동완성을 고려할 수 있음 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  value={formData.organizationCity || ''}
                  onChange={(e) =>
                    updateFormData({ organizationCity: e.target.value })
                  }
                  placeholder="City"
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  value={formData.organizationState || ''}
                  onChange={(e) =>
                    updateFormData({ organizationState: e.target.value })
                  }
                  placeholder="State"
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* 근무 조건 섹션 */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">🩺</span> Your Role
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employment Type 추가 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Employment Type
                </label>
                <select
                  value={formData.employmentType || ''}
                  onChange={(e) =>
                    updateFormData({ employmentType: e.target.value })
                  }
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                >
                  <option value="">Select employment type</option>
                  {EMPLOYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shift Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  What's your shift type?
                </label>
                <select
                  value={formData.shiftType || ''}
                  onChange={(e) =>
                    updateFormData({ shiftType: e.target.value as ShiftType })
                  }
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                >
                  <option value="">Select your shift</option>
                  {[
                    'Day Shift',
                    'Night Shift',
                    'Evening Shift',
                    'Rotating Shift',
                  ].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nurse to Patient Ratio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nurse to Patient Ratio
                </label>
                <select
                  value={formData.nurseToPatientRatio || ''}
                  onChange={(e) =>
                    updateFormData({ nurseToPatientRatio: e.target.value })
                  }
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                >
                  <option value="">Select ratio</option>
                  {NURSE_PATIENT_RATIOS.map((ratio) => (
                    <option key={ratio} value={ratio}>
                      {ratio}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pay 정보 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  What's your base pay?
                </label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={formData.basePay || ''}
                      onChange={(e) =>
                        updateFormData({ basePay: parseFloat(e.target.value) })
                      }
                      className="w-full p-3 pl-8 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    />
                  </div>
                  <select
                    value={formData.paymentFrequency || 'hourly'}
                    onChange={(e) =>
                      updateFormData({
                        paymentFrequency: e.target.value as 'hourly' | 'yearly',
                      })
                    }
                    className="w-32 p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                  >
                    <option value="hourly">/ hour</option>
                    <option value="yearly">/ year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Union 체크박스 */}
            <div className="flex items-center gap-2 bg-teal-50 p-4 rounded-xl">
              <input
                type="checkbox"
                id="isUnionized"
                checked={formData.isUnionized || false}
                onChange={(e) =>
                  updateFormData({ isUnionized: e.target.checked })
                }
                className="w-5 h-5 rounded border-teal-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="isUnionized" className="text-teal-900">
                This is a unionized position
              </label>
            </div>
          </div>

          {/* 네비게이션 버튼 */}
          <div className="flex justify-between pt-6">
            <ActionButton
              onClick={() => setStep('basicInfo')}
              variant="outline"
              className="px-6 py-3"
            >
              ← Back
            </ActionButton>
            <ActionButton type="submit" className="px-8 py-3">
              Continue →
            </ActionButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
