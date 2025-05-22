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

// Types

type ShiftType =
  | 'Day Shift'
  | 'Night Shift'
  | 'Evening Shift'
  | 'Rotating Shift';

// Constants
const NURSE_PATIENT_RATIOS = ['1:1', '1:2', '1:3', '1:4', '1:5+'];

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

const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Per Diem/PRN',
  'Temporary/Contract',
  'TravelNursing',
  'Agency Nursing',
];

// Google Maps libraries - 상수로 분리 (성능 경고 해결)
const GOOGLE_MAPS_LIBRARIES: 'places'[] = ['places'];
const ALL_DIFFERENTIALS = [
  // Shift-Based
  { display: 'Night Shift', group: 'Shift-Based' },
  { display: 'Weekend', group: 'Shift-Based' },
  { display: 'Holiday', group: 'Shift-Based' },
  { display: 'Evening Shift', group: 'Shift-Based' },
  { display: 'Rotating Shift', group: 'Shift-Based' },

  // Role-Based
  { display: 'Charge Nurse', group: 'Role-Based' },
  { display: 'Preceptor', group: 'Role-Based' },
  { display: 'Team Lead', group: 'Role-Based' },
  { display: 'Float Pool', group: 'Role-Based' },
  { display: 'Resource Nurse', group: 'Role-Based' },

  // Unit-Based
  { display: 'ICU', group: 'Unit-Based' },
  { display: 'ER', group: 'Unit-Based' },
  { display: 'OR', group: 'Unit-Based' },
  { display: 'NICU', group: 'Unit-Based' },
  { display: 'Trauma', group: 'Unit-Based' },
  { display: 'Cardiac', group: 'Unit-Based' },
  { display: 'Critical Care', group: 'Unit-Based' },

  // Certification
  { display: 'ACLS/BLS/PALS', group: 'Certification' },
  { display: 'Specialty Certification', group: 'Certification' },
  { display: 'BSN Degree', group: 'Certification' },
  { display: 'MSN Degree', group: 'Certification' },
  { display: 'Advanced Certification', group: 'Certification' },

  // Other
  { display: 'On-call', group: 'Other' },
  { display: 'Overtime Premium', group: 'Other' },
  { display: 'Experience Bonus', group: 'Other' },
  { display: 'Bilingual', group: 'Other' },
];

// 자주 사용되는 Differentials
const POPULAR_DIFFERENTIALS = [
  'Night Shift',
  'Weekend',
  'Holiday',
  'Charge Nurse',
  'ICU',
  'On-call',
];

// Differential 자동완성 커스텀 훅
function useDifferentialAutocomplete() {
  const [differentialInput, setDifferentialInput] = useState('');
  const [showDifferentialSuggestions, setShowDifferentialSuggestions] =
    useState(false);

  const differentialFilteredList = ALL_DIFFERENTIALS.filter((diff) =>
    diff.display.toLowerCase().includes(differentialInput.toLowerCase())
  );

  const handleDifferentialSelect = useCallback((selected: string) => {
    setDifferentialInput(selected);
    setShowDifferentialSuggestions(false);
  }, []);

  return {
    differentialInput,
    setDifferentialInput,
    showDifferentialSuggestions,
    setShowDifferentialSuggestions,
    differentialFilteredList,
    handleDifferentialSelect,
  };
}

// Specialty autocomplete hook
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

  // Specialty autocomplete
  const {
    specialtyInput,
    setSpecialtyInput,
    showSuggestions,
    setShowSuggestions,
    filteredList,
    handleSelect,
  } = useSpecialtyAutocomplete(formData.specialty || '');

  // Map modal state
  const [showMapModal, setShowMapModal] = useState(false);

  // Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const [placesResult, setPlacesResult] = useState<
    google.maps.places.PlaceResult[]
  >([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [tempOrgName, setTempOrgName] = useState('');
  const [tempCity, setTempCity] = useState('');
  const [tempState, setTempState] = useState('');

  // Differential autocomplete
  const {
    differentialInput,
    setDifferentialInput,
    showDifferentialSuggestions,
    setShowDifferentialSuggestions,
    differentialFilteredList,
    handleDifferentialSelect,
  } = useDifferentialAutocomplete();

  // Custom differential state - 초기값 명시
  const [customDiff, setCustomDiff] = useState<{
    type: string;
    amount: number;
    unit: 'hourly' | 'annual';
  }>({
    type: '',
    amount: 0,
    unit: 'hourly',
  });

  // Specialty change handler
  const handleSpecialtyChange = (value: string) => {
    setSpecialtyInput(value);
    updateFormData({ specialty: value });
    setShowSuggestions(true);
  };

  // Differential handlers
  const addPopularDifferential = useCallback(
    (diffType: string) => {
      const diffData = ALL_DIFFERENTIALS.find((d) => d.display === diffType);
      if (!diffData) return;

      const currentDifferentials = formData.individualDifferentials || [];

      const exists = currentDifferentials.some(
        (existing) => existing.type === diffType
      );

      if (!exists) {
        // 금액 입력을 위해 customDiff에 설정
        setCustomDiff({
          type: diffType,
          amount: 0,
          unit: 'hourly',
        });
      }
    },
    [formData.individualDifferentials]
  );

  const addCustomDifferential = useCallback(() => {
    if (!customDiff.type || customDiff.amount <= 0) {
      return;
    }

    const currentDifferentials = formData.individualDifferentials || [];

    const exists = currentDifferentials.some(
      (existing) => existing.type === customDiff.type
    );

    if (!exists) {
      // 해당 differential의 그룹 찾기
      const diffData = ALL_DIFFERENTIALS.find(
        (d) => d.display === customDiff.type
      );
      const group = diffData?.group || 'Other';

      const newDifferentials = [
        ...currentDifferentials,
        {
          ...customDiff,
          group,
        },
      ];

      updateFormData({
        individualDifferentials: newDifferentials,
        totalDifferential: newDifferentials
          .filter((diff) => diff.unit !== 'annual')
          .reduce((sum, diff) => sum + diff.amount, 0),
      });

      // Reset form
      setCustomDiff({ type: '', amount: 0, unit: 'hourly' });
      setDifferentialInput('');
    }
  }, [customDiff, formData.individualDifferentials, updateFormData]);

  const handleDifferentialInputChange = (value: string) => {
    setDifferentialInput(value);
    setCustomDiff({ ...customDiff, type: value });
    setShowDifferentialSuggestions(true);
  };

  const handleDifferentialSelectAndSet = (selected: string) => {
    handleDifferentialSelect(selected);
    setCustomDiff({ ...customDiff, type: selected });
  };

  const removeDifferential = useCallback(
    (index: number) => {
      const currentDifferentials = formData.individualDifferentials || [];
      const newDifferentials = currentDifferentials.filter(
        (_, i) => i !== index
      );

      updateFormData({
        individualDifferentials: newDifferentials,
        totalDifferential: newDifferentials
          .filter((diff) => diff.unit !== 'annual')
          .reduce((sum, diff) => sum + diff.amount, 0),
      });
    },
    [formData.individualDifferentials, updateFormData]
  );

  // Map handlers
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handlePlacesChanged = () => {
    if (!searchBoxRef.current) return;
    const places = searchBoxRef.current.getPlaces() || [];
    setPlacesResult(places);
    setSelectedIndex(null);
    setTempOrgName('');
    setTempCity('');
    setTempState('');
  };

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

    setTempOrgName(orgName);
    setTempCity(city);
    setTempState(state);

    if (place.geometry && place.geometry.location && mapRef.current) {
      const loc = place.geometry.location;
      mapRef.current.panTo({ lat: loc.lat(), lng: loc.lng() });
      mapRef.current.setZoom(14);
    }
  };

  const handleSelectPlace = () => {
    if (selectedIndex === null) return;
    updateFormData({
      organizationName: tempOrgName,
      organizationCity: tempCity,
      organizationState: tempState,
    });
    setShowMapModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('culture');
  };

  // Reset map modal state when opening
  const openMapModal = () => {
    setPlacesResult([]);
    setSelectedIndex(null);
    setTempOrgName('');
    setTempCity('');
    setTempState('');
    setShowMapModal(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Let&apos;s Talk About Your Work{' '}
            <span className="text-slate-600">👩‍⚕️</span>
          </h2>
          <p className="text-gray-500 text-lg">
            Tell me about your current position
          </p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Workplace Info Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">🏢</span> Your Workplace
            </h3>

            {/* Specialty + Sub-specialty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                  placeholder="e.g., ICU, Pediatrics"
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl
                             focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                />
                {showSuggestions && filteredList.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto">
                    {filteredList.map((specialty) => (
                      <li key={specialty}>
                        <button
                          type="button"
                          onClick={() => {
                            handleSelect(specialty);
                            updateFormData({ specialty });
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-slate-100 transition-colors"
                        >
                          {specialty}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

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
                             focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* Organization info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                               focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                  />
                  <ActionButton
                    type="button"
                    onClick={openMapModal}
                    className="px-4 py-2 text-sm"
                    style={{ backgroundColor: '#14b8a6', color: 'white' }}
                  >
                    Map
                  </ActionButton>
                </div>
              </div>

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
                      employmentStartYear:
                        parseInt(e.target.value, 10) || undefined,
                    })
                  }
                  placeholder="Start year"
                  className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl
                             focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
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
                             focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
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
                             focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Role Section */}
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
                           focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
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
                           focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
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

            {/* Nurse to Patient Ratio + Base Pay */}
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
                           focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
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
                  Base Pay
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
                        updateFormData({
                          basePay: parseFloat(e.target.value) || undefined,
                        })
                      }
                      className="w-full p-3 pl-8 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl
                               focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
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
                             focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                  >
                    <option value="hourly">/ hour</option>
                    <option value="yearly">/ year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Differential Pay Section */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  Differential Pay
                </h4>
                <span className="text-sm text-gray-600">
                  Optional but recommended
                </span>
              </div>

              {/* Popular Differentials */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  Quick add popular differentials:
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_DIFFERENTIALS.map((diffType) => (
                    <button
                      key={diffType}
                      type="button"
                      onClick={() => addPopularDifferential(diffType)}
                      className="px-3 py-2 text-sm bg-white border-2 border-gray-200 text-gray-700 rounded-lg
                               hover:border-slate-400 hover:bg-slate-50 transition-colors font-medium"
                    >
                      {diffType}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Differential Form */}
              <div className="space-y-4">
                {/* Search Input */}
                <div className="space-y-2 relative">
                  <label
                    htmlFor="differential-search-input"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Search for other differentials:
                  </label>
                  <input
                    type="text"
                    value={differentialInput}
                    onChange={(e) =>
                      handleDifferentialInputChange(e.target.value)
                    }
                    onFocus={() => setShowDifferentialSuggestions(true)}
                    onBlur={() =>
                      setTimeout(
                        () => setShowDifferentialSuggestions(false),
                        200
                      )
                    }
                    placeholder="e.g., ER, Preceptor, Bilingual..."
                    className="w-full p-3 text-lg bg-white border-2 border-gray-200 rounded-xl
                             focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                  />

                  {/* Suggestions dropdown */}
                  {showDifferentialSuggestions &&
                    differentialFilteredList.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-auto">
                        {differentialFilteredList.map((diff) => (
                          <li
                            key={`diff-suggestion-${diff.display}-${diff.group}`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleDifferentialSelectAndSet(diff.display)
                              }
                              className="w-full text-left px-4 py-2 hover:bg-slate-100 transition-colors"
                            >
                              {diff.display}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>

                {/* Amount and Unit - only show when type is selected */}
                {customDiff.type && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-white rounded-xl border border-gray-200">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Selected:{' '}
                        <span className="font-semibold text-slate-600">
                          {customDiff.type}
                        </span>
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="differential-amount"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.5"
                          value={customDiff.amount || ''}
                          onChange={(e) =>
                            setCustomDiff({
                              ...customDiff,
                              amount: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full p-3 pl-8 text-lg bg-white border-2 border-gray-200 rounded-xl
                                   focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="differential-unit-select"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Unit
                      </label>
                      <div className="flex gap-2">
                        <select
                          id="differential-unit-select"
                          value={customDiff.unit}
                          onChange={(e) =>
                            setCustomDiff({
                              ...customDiff,
                              unit: e.target.value as 'hourly' | 'annual',
                            })
                          }
                          className="flex-1 p-3 text-lg bg-white border-2 border-gray-200 rounded-xl
                                   focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                        >
                          <option value="hourly">per hour</option>
                          <option value="annual">per year</option>
                        </select>

                        <ActionButton
                          type="button"
                          onClick={addCustomDifferential}
                          disabled={!customDiff.type || customDiff.amount <= 0}
                          className="px-4 py-3"
                        >
                          Add
                        </ActionButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Differentials List */}
              {formData.individualDifferentials &&
                formData.individualDifferentials.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-gray-700">
                      Your Differentials:
                    </h5>
                    <div className="space-y-2">
                      {formData.individualDifferentials.map((diff, index) => (
                        <div
                          key={`${diff.group}-${diff.type}-${diff.amount}-${diff.unit}`}
                          className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                              {diff.group}
                            </span>
                            <span className="font-medium text-gray-900">
                              {diff.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-green-600 font-semibold">
                              +${diff.amount}/
                              {diff.unit === 'annual' ? 'year' : 'hr'}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeDifferential(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                              aria-label={`Remove ${diff.type} differential`}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total Display */}
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-green-800">
                          Total Hourly Differentials:
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          +$
                          {formData.individualDifferentials
                            .filter((diff) => diff.unit !== 'annual')
                            .reduce((sum, diff) => sum + diff.amount, 0)}
                          /hr
                        </span>
                      </div>
                      {formData.individualDifferentials.some(
                        (diff) => diff.unit === 'annual'
                      ) && (
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-green-200">
                          <span className="font-medium text-green-800">
                            Annual Bonuses:
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            +$
                            {formData.individualDifferentials
                              .filter((diff) => diff.unit === 'annual')
                              .reduce((sum, diff) => sum + diff.amount, 0)}
                            /year
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* Additional Notes */}
              <div className="space-y-2">
                <label
                  htmlFor="differential-notes-textarea"
                  className="block text-sm font-medium text-gray-700"
                >
                  Additional notes about your differentials (optional):
                </label>
                <textarea
                  id="differential-notes-textarea"
                  value={formData.differentialsFreeText || ''}
                  onChange={(e) =>
                    updateFormData({ differentialsFreeText: e.target.value })
                  }
                  placeholder="e.g., Specific conditions for bonuses, additional details, etc."
                  className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl text-sm resize-none
                           focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                  rows={2}
                />
              </div>
            </div>

            {/* Union Checkbox */}
            <div className="flex items-center gap-2 bg-slate-50 p-4 rounded-xl">
              <input
                type="checkbox"
                id="isUnionized"
                checked={formData.isUnionized || false}
                onChange={(e) =>
                  updateFormData({ isUnionized: e.target.checked })
                }
                className="w-5 h-5 rounded border-slate-300 text-slate-600 focus:ring-slate-500"
              />
              <label htmlFor="isUnionized" className="text-slate-900">
                Unionized workplace
              </label>
            </div>
          </div>

          {/* Navigation Buttons */}
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

      {/* Google Maps Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-4 relative">
            <button
              type="button"
              onClick={() => setShowMapModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
              aria-label="Close map modal"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-4 text-slate-700">
              Search on Map
            </h3>

            {!isLoaded ? (
              <div className="text-center py-8">Loading map...</div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Search Box */}
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
                               focus:outline-none focus:border-slate-500"
                  />
                </StandaloneSearchBox>

                {/* Search Results List */}
                {placesResult.length > 0 && (
                  <div className="max-h-40 overflow-auto border border-gray-200 rounded-xl p-2">
                    {placesResult.map((place, idx) => {
                      const isActive = selectedIndex === idx;
                      return (
                        <button
                          key={place.place_id ?? idx}
                          type="button"
                          onClick={() => handlePlaceClick(idx)}
                          className={`w-full text-left px-3 py-2 rounded-md cursor-pointer mb-1 transition-colors ${
                            isActive ? 'bg-slate-100' : 'hover:bg-gray-100'
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

                {/* Google Map */}
                <div className="relative w-full h-[400px]">
                  <GoogleMap
                    onLoad={handleMapLoad}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={{ lat: 39.8283, lng: -98.5795 }}
                    zoom={4}
                  />
                </div>

                {/* Preview Selected Place */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2 text-gray-700">Preview:</p>
                  <ul className="text-gray-600 text-sm space-y-1">
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

                {/* Modal Action Buttons */}
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
