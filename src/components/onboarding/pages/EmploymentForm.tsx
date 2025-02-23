'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  StandaloneSearchBox,
  useJsApiLoader,
  GoogleMap,
} from '@react-google-maps/api';

import ActionButton from 'src/components/button/ActionButton';
import useOnboardingStore from 'src/store/onboardingStores';

// Nurse-Patient Ratio
const NURSE_PATIENT_RATIOS = ['1:1', '1:2', '1:3', '1:4', '1:5+'];

// Specialty 전체 목록 (검색/자동완성)
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

// Employment Types
const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Per Diem/PRN',
  'Temporary/Contract',
  'TravelNursing',
  'Agency Nursing',
];

type ShiftType =
  | 'Day Shift'
  | 'Night Shift'
  | 'Evening Shift'
  | 'Rotating Shift';

/** Specialty 검색/자동완성 커스텀 훅 */
function useSpecialtyAutocomplete(initialValue: string) {
  const [specialtyInput, setSpecialtyInput] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredList = ALL_SPECIALTIES.filter((s) =>
    s.toLowerCase().includes(specialtyInput.toLowerCase())
  );

  const handleSelect = useCallback((selected: string) => {
    setSpecialtyInput(selected);
    setShowSuggestions(false);
  }, []);

  return {
    specialtyInput,
    setSpecialtyInput,
    showSuggestions,
    setShowSuggestions,
    filteredList,
    handleSelect,
  };
}

/** 주소 컴포넌트에서 City와 State 추출 */
function parseCityState(
  addressComponents: google.maps.GeocoderAddressComponent[]
) {
  let city = '';
  let state = '';

  addressComponents.forEach((comp) => {
    if (comp.types.includes('locality')) {
      city = comp.long_name;
    }
    if (comp.types.includes('administrative_area_level_1')) {
      state = comp.short_name;
    }
  });

  return { city, state };
}

export default function EmploymentForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();

  // Specialty 자동완성
  const {
    specialtyInput,
    setSpecialtyInput,
    showSuggestions,
    setShowSuggestions,
    filteredList,
    handleSelect,
  } = useSpecialtyAutocomplete(formData.specialty || '');

  // Specialty 변경 시 store 반영
  const handleSpecialtyChange = (value: string) => {
    setSpecialtyInput(value);
    updateFormData({ specialty: value });
    setShowSuggestions(true);
  };

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('culture');
  };

  // 지도 검색 모달 관련
  const [showMapModal, setShowMapModal] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  // 검색 결과 목록
  const [placesResult, setPlacesResult] = useState<
    google.maps.places.PlaceResult[]
  >([]);
  // 클릭해서 선택된 인덱스
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Preview 표시를 위한 임시 상태
  const [tempOrgName, setTempOrgName] = useState('');
  const [tempCity, setTempCity] = useState('');
  const [tempState, setTempState] = useState('');

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  // 검색이 일어났을 때
  const handlePlacesChanged = () => {
    if (!searchBoxRef.current) return;
    const places = searchBoxRef.current.getPlaces() || [];
    setPlacesResult(places);
    // 선택 인덱스/미리보기 초기화
    setSelectedIndex(null);
    setTempOrgName('');
    setTempCity('');
    setTempState('');
  };

  // 검색 결과 목록에서 클릭 시
  const handlePlaceClick = (index: number) => {
    setSelectedIndex(index);

    const place = placesResult[index];
    const orgName = place.name || '';

    let city = '';
    let state = '';
    if (place.address_components) {
      const parsed = parseCityState(place.address_components);
      city = parsed.city;
      state = parsed.state;
    }

    // 임시 Preview 업데이트
    setTempOrgName(orgName);
    setTempCity(city);
    setTempState(state);

    // 지도 이동
    if (place.geometry && place.geometry.location && mapRef.current) {
      const loc = place.geometry.location;
      mapRef.current.panTo({ lat: loc.lat(), lng: loc.lng() });
      mapRef.current.setZoom(14);
    }
  };

  // "Select" 버튼
  const handleSelectPlace = () => {
    if (selectedIndex === null) return; // 아무 항목도 선택 안 한 경우
    updateFormData({ organizationName: tempOrgName });
    updateFormData({ organizationCity: tempCity });
    updateFormData({ organizationState: tempState });
    setShowMapModal(false);
  };

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
            Let&apos;s Talk About Your Work{' '}
            <span className="text-teal-600">👩‍⚕️</span>
          </h2>
          <p className="text-gray-500 text-lg">
            We&apos;ll keep this quick and simple!
          </p>
        </div>

        {/* 메인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 근무 기본 정보 섹션 */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">🏢</span> Your Workplace
            </h3>

            {/* Specialty + Sub-specialty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specialty (검색/자동완성) */}
              <div className="space-y-2 relative">
                <label
                  htmlFor="specialty"
                  className="block text-sm font-medium text-gray-700"
                >
                  What&apos;s your specialty?
                </label>
                <input
                  id="specialty"
                  type="text"
                  value={specialtyInput}
                  onChange={(e) => handleSpecialtyChange(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="e.g., ICU, Pediatrics"
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl
                             focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                />
                {/* Specialty 자동완성 추천 목록 */}
                {showSuggestions && filteredList.length > 0 && (
                  <ul
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto"
                    role="listbox"
                  >
                    {filteredList.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          handleSelect(s);
                          updateFormData({ specialty: s });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleSelect(s);
                            updateFormData({ specialty: s });
                          }
                        }}
                        role="option"
                        aria-selected={false}
                        tabIndex={0}
                        className="w-full text-left px-4 py-2 hover:bg-teal-100"
                      >
                        {s}
                      </button>
                    ))}
                  </ul>
                )}
              </div>

              {/* Sub-specialty */}
              <div className="space-y-2">
                <label
                  htmlFor="subSpecialty"
                  className="block text-sm font-medium text-gray-700"
                >
                  Have a sub-specialty? (Optional)
                </label>
                <input
                  id="subSpecialty"
                  type="text"
                  value={formData.subSpecialty || ''}
                  onChange={(e) =>
                    updateFormData({ subSpecialty: e.target.value })
                  }
                  placeholder="E.g., Pediatric ICU"
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl
                             focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* Organization info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Name + 버튼(지도 검색) */}
              <div className="space-y-2">
                <label
                  htmlFor="organizationName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Where do you work?
                </label>
                <div className="flex gap-2">
                  <input
                    id="organizationName"
                    type="text"
                    value={formData.organizationName || ''}
                    onChange={(e) =>
                      updateFormData({ organizationName: e.target.value })
                    }
                    placeholder="Hospital or Organization Name"
                    className="flex-1 p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl
                               focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                  />
                  {/* Search on Map 버튼 (크기/스타일 다운) */}
                  <ActionButton
                    type="button"
                    onClick={() => {
                      // 초기화 후 모달 열기
                      setPlacesResult([]);
                      setSelectedIndex(null);
                      setTempOrgName('');
                      setTempCity('');
                      setTempState('');
                      setShowMapModal(true);
                    }}
                    className="px-4 py-2 text-sm"
                    style={{
                      backgroundColor: '#14b8a6', // Tailwind teal-500
                      color: 'white',
                    }}
                  >
                    Map
                  </ActionButton>
                </div>
              </div>

              {/* Employment Start Year */}
              <div className="space-y-2">
                <label
                  htmlFor="employmentStartYear"
                  className="block text-sm font-medium text-gray-700"
                >
                  Since when?
                </label>
                <input
                  id="employmentStartYear"
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
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl
                             focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* City + State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="organizationCity"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  id="organizationCity"
                  type="text"
                  value={formData.organizationCity || ''}
                  onChange={(e) =>
                    updateFormData({ organizationCity: e.target.value })
                  }
                  placeholder="City"
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl
                             focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="organizationState"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  id="organizationState"
                  type="text"
                  value={formData.organizationState || ''}
                  onChange={(e) =>
                    updateFormData({ organizationState: e.target.value })
                  }
                  placeholder="State"
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl
                             focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
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
              {/* Employment Type */}
              <div className="space-y-2">
                <label
                  htmlFor="employmentType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Employment Type
                </label>
                <select
                  id="employmentType"
                  value={formData.employmentType || ''}
                  onChange={(e) =>
                    updateFormData({ employmentType: e.target.value })
                  }
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl
                             focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
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
                <label
                  htmlFor="shiftType"
                  className="block text-sm font-medium text-gray-700"
                >
                  What&apos;s your shift type?
                </label>
                <select
                  id="shiftType"
                  value={formData.shiftType || ''}
                  onChange={(e) =>
                    updateFormData({ shiftType: e.target.value as ShiftType })
                  }
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl
                             focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
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

            {/* Nurse to Patient Ratio + Pay */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="nurseToPatientRatio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nurse to Patient Ratio
                </label>
                <select
                  id="nurseToPatientRatio"
                  value={formData.nurseToPatientRatio || ''}
                  onChange={(e) =>
                    updateFormData({ nurseToPatientRatio: e.target.value })
                  }
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl
                             focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                >
                  <option value="">Select ratio</option>
                  {NURSE_PATIENT_RATIOS.map((ratio) => (
                    <option key={ratio} value={ratio}>
                      {ratio}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="basePay"
                  className="block text-sm font-medium text-gray-700"
                >
                  What&apos;s your base pay?
                </label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      id="basePay"
                      type="number"
                      min={0}
                      step={0.01}
                      value={formData.basePay || ''}
                      onChange={(e) =>
                        updateFormData({ basePay: parseFloat(e.target.value) })
                      }
                      className="w-full p-3 pl-8 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl
                                 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    />
                  </div>
                  <select
                    id="paymentFrequency"
                    value={formData.paymentFrequency || 'hourly'}
                    onChange={(e) =>
                      updateFormData({
                        paymentFrequency: e.target.value as 'hourly' | 'yearly',
                      })
                    }
                    className="w-32 p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl
                               focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
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

      {/* ------------------------------------------------------------------
          모달: 구글 맵 + SearchBox + 검색결과 목록
      ------------------------------------------------------------------ */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-4 relative">
            <button
              type="button"
              onClick={() => setShowMapModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              aria-label="Close map modal"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-4 text-teal-700">
              Search on Map
            </h3>

            {!isLoaded ? (
              <div className="text-center py-8">Loading map...</div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* 검색창 */}
                <StandaloneSearchBox
                  onLoad={(ref) => {
                    searchBoxRef.current = ref;
                  }}
                  onPlacesChanged={handlePlacesChanged}
                >
                  <input
                    type="text"
                    placeholder="Search your hospital or organization"
                    className="w-full p-3 mb-2 text-lg border border-gray-200 rounded-xl
                               focus:outline-none focus:border-teal-500"
                  />
                </StandaloneSearchBox>

                {/* 검색 결과 목록 */}
                {placesResult.length > 0 && (
                  <div
                    className="max-h-40 overflow-auto border border-gray-200 rounded-xl p-2"
                    role="listbox"
                  >
                    {placesResult.map((place, idx) => {
                      const isActive = selectedIndex === idx;
                      return (
                        <button
                          key={place.place_id ?? idx}
                          type="button"
                          onClick={() => handlePlaceClick(idx)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handlePlaceClick(idx);
                            }
                          }}
                          role="option"
                          aria-selected={isActive}
                          tabIndex={0}
                          className={`w-full text-left px-3 py-2 rounded-md cursor-pointer mb-1 ${
                            isActive
                              ? 'bg-teal-100'
                              : 'hover:bg-gray-100 transition-colors'
                          }`}
                        >
                          <div className="text-base font-semibold">
                            {place.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {place.formatted_address || place.vicinity}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 지도 */}
                <div className="relative w-full h-[400px]">
                  <GoogleMap
                    onLoad={handleMapLoad}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={{ lat: 39.8283, lng: -98.5795 }} // 미국 중앙 정도
                    zoom={4}
                  />
                </div>

                {/* 선택된 곳 미리보기 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2 text-gray-700">Preview:</p>
                  <ul className="text-gray-600 text-sm">
                    <li>
                      <span className="font-medium">Name:</span>{' '}
                      {tempOrgName || 'N/A'}
                    </li>
                    <li>
                      <span className="font-medium">City:</span>{' '}
                      {tempCity || 'N/A'}
                    </li>
                    <li>
                      <span className="font-medium">State:</span>{' '}
                      {tempState || 'N/A'}
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <ActionButton
                    variant="outline"
                    onClick={() => setShowMapModal(false)}
                    className="px-6 py-2 text-sm"
                  >
                    Cancel
                  </ActionButton>
                  <ActionButton
                    onClick={handleSelectPlace}
                    disabled={selectedIndex === null}
                    className="px-8 py-2 text-sm"
                  >
                    Select
                  </ActionButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
