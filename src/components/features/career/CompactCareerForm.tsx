import React, { useState, useRef, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Building,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Stethoscope,
  Check,
  X,
  ChevronDown,
  Plus,
  Trash2,
  Star,
  Moon,
  Sun,
  Award,
  Users,
  Briefcase,
  Heart,
  Shield,
  TrendingUp,
  Building2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSpecialties } from 'src/hooks/useSpecialties';
import CustomDropdown from 'src/components/features/onboarding/components/CustomDropdown';
import AnimatedInput from 'src/components/features/onboarding/components/AnimatedInput';
import { normalizeCity } from 'src/lib/constants/cityMapping';
import type { DifferentialItem } from 'src/api/useDifferentialAPI';
import DifferentialWithFrequency from 'src/components/features/onboarding/EmploymentForm/components/DifferentialWithFrequency';

interface CultureRatings {
  unitCulture: number;
  benefits: number;
  growthOpportunities: number;
  hospitalQuality: number;
  freeTextFeedback?: string;
}

export interface CompactCareerFormData {
  // Basic Info
  hospital: string;
  organizationCity: string;
  organizationState: string;
  employmentStartDate: Date;
  employmentEndDate?: Date | null;

  // Job Details
  specialty: string;
  subSpecialty?: string;
  shiftType: string;
  employmentType: string;
  nurseToPatientRatio: string;
  shiftHours: number;
  isUnionized: boolean;

  // Compensation
  basePay: number;
  basePayUnit: 'hourly' | 'yearly';
  differentials: DifferentialItem[];

  // Culture
  culture: CultureRatings;
}

interface CompactCareerFormProps {
  onSubmit: (data: CompactCareerFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  isLoaded?: boolean;
}

// Constants
const employmentTypes = [
  { value: 'Full-time', label: 'Full-time', icon: Clock },
  { value: 'Part-time', label: 'Part-time', icon: Calendar },
  { value: 'Per Diem/PRN', label: 'Per Diem', icon: Briefcase },
  { value: 'Contract', label: 'Contract', icon: Award },
];

const shiftTypes = [
  { value: 'Day Shift', label: 'Day', icon: Sun },
  { value: 'Night Shift', label: 'Night', icon: Moon },
  { value: 'Evening Shift', label: 'Evening', icon: Clock },
  { value: 'Rotating Shift', label: 'Rotating', icon: Clock },
];


const CULTURE_CATEGORIES = [
  {
    key: 'unitCulture' as const,
    label: 'Unit Culture',
    icon: Heart,
    color: 'rose',
  },
  {
    key: 'benefits' as const,
    label: 'Benefits',
    icon: Shield,
    color: 'blue',
  },
  {
    key: 'growthOpportunities' as const,
    label: 'Growth',
    icon: TrendingUp,
    color: 'emerald',
  },
  {
    key: 'hospitalQuality' as const,
    label: 'Hospital Quality',
    icon: Building2,
    color: 'purple',
  },
];

export default function CompactCareerForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  isLoaded = false
}: CompactCareerFormProps) {
  const [showCustomSpecialty, setShowCustomSpecialty] = useState(false);
  const [customSpecialty, setCustomSpecialty] = useState('');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(null);

  // Refs for Google Places
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // API hooks
  const { getAllSpecialties, getSubSpecialties } = useSpecialties();
  const { data: specialtiesData, isLoading: specialtiesLoading } = getAllSpecialties;
  const { data: subSpecialtiesData } = getSubSpecialties(selectedSpecialtyId);

  // Form state
  const [formData, setFormData] = useState<CompactCareerFormData>({
    hospital: '',
    organizationCity: '',
    organizationState: '',
    employmentStartDate: new Date(),
    employmentEndDate: null,
    specialty: '',
    subSpecialty: '',
    shiftType: 'Day Shift',
    employmentType: 'Full-time',
    nurseToPatientRatio: '1:4',
    shiftHours: 12,
    isUnionized: false,
    basePay: 0,
    basePayUnit: 'hourly',
    differentials: [],
    culture: {
      unitCulture: 0,
      benefits: 0,
      growthOpportunities: 0,
      hospitalQuality: 0,
      freeTextFeedback: ''
    }
  });

  // Update form data helper
  const updateFormData = (updates: Partial<CompactCareerFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Google Places Autocomplete
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    try {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment'],
        fields: ['name', 'address_components'],
      });

      const listener = autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();

        if (place && place.address_components) {
          let rawCity = '';
          let state = '';

          place.address_components.forEach((component) => {
            const { types } = component;

            if (types.includes('locality')) {
              rawCity = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
              state = component.short_name;
            }
          });

          const city = normalizeCity(rawCity, state, '', '');

          updateFormData({
            hospital: place.name || '',
            organizationCity: city || rawCity,
            organizationState: state,
          });
        }
      });

      return () => {
        if (listener) {
          google.maps.event.removeListener(listener);
        }
      };
    } catch (error) {
      console.error('Google Places initialization error:', error);
    }
  }, [isLoaded]);

  // Map specialties for dropdown
  const specialtyOptions = specialtiesData?.specialties?.map(s => s.name) || [];
  if (specialtyOptions.length > 0 && !specialtyOptions.includes('Other')) {
    specialtyOptions.push('Other');
  }

  // Handle specialty selection
  const handleSpecialtyChange = (value: string) => {
    if (value === 'Other') {
      setShowCustomSpecialty(true);
      setCustomSpecialty('');
      updateFormData({ specialty: '' });
      setSelectedSpecialtyId(null);
    } else {
      updateFormData({ specialty: value });
      setShowCustomSpecialty(false);
      const selected = specialtiesData?.specialties?.find(s => s.name === value);
      setSelectedSpecialtyId(selected?.id || null);
    }
  };


  // Handle culture rating
  const handleRatingChange = (category: keyof CultureRatings, value: number) => {
    if (category !== 'freeTextFeedback') {
      updateFormData({
        culture: {
          ...formData.culture,
          [category]: value
        }
      });
    }
  };


  // Validation
  const isValid = () => {
    return !!(
      formData.hospital &&
      formData.organizationCity &&
      formData.organizationState &&
      formData.specialty &&
      formData.basePay > 0
    );
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!isValid()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <h2 className="text-xl font-bold text-gray-900">Add Work Experience</h2>
          <p className="text-sm text-gray-600 mt-1">Fill in your past employment details</p>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Building className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-semibold text-gray-900">Workplace Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hospital - Full width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Hospital/Facility <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={formData.hospital}
                    onChange={(e) => updateFormData({ hospital: e.target.value })}
                    placeholder="Search for hospital..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                {isLoaded && (
                  <p className="text-xs text-gray-500 mt-1">Start typing to search hospitals</p>
                )}
              </div>

              {/* City & State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <AnimatedInput
                  type="text"
                  value={formData.organizationCity}
                  onChange={(val) => updateFormData({ organizationCity: val })}
                  placeholder="City"
                  icon={<MapPin className="w-4 h-4" />}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <AnimatedInput
                  type="text"
                  value={formData.organizationState}
                  onChange={(val) => updateFormData({ organizationState: val })}
                  placeholder="State (e.g., CA)"
                  maxLength={2}
                />
              </div>

              {/* Employment Dates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={formData.employmentStartDate}
                  onChange={(date) => updateFormData({ employmentStartDate: date || new Date() })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  End Date
                </label>
                <DatePicker
                  selected={formData.employmentEndDate}
                  onChange={(date) => updateFormData({ employmentEndDate: date })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  isClearable
                  placeholderText="Current position"
                />
              </div>
            </div>
          </div>

          {/* Job Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-semibold text-gray-900">Role Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Specialty with Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nursing Specialty <span className="text-red-500">*</span>
                </label>
                {!showCustomSpecialty ? (
                  <>
                    <CustomDropdown
                      value={formData.specialty || ''}
                      onChange={handleSpecialtyChange}
                      options={specialtyOptions}
                      placeholder={specialtiesLoading ? "Loading specialties..." : "Search or select your specialty"}
                      searchable
                      className="w-full"
                      icon={<Stethoscope className="w-5 h-5" />}
                      disabled={specialtiesLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Can't find your specialty? Select "Other" to enter custom
                    </p>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <AnimatedInput
                      value={customSpecialty}
                      onChange={setCustomSpecialty}
                      placeholder="Enter your specialty"
                      icon={<Stethoscope className="w-5 h-5" />}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customSpecialty.trim()) {
                          updateFormData({ specialty: customSpecialty.trim() });
                          setShowCustomSpecialty(false);
                        }
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Set
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomSpecialty(false);
                        setCustomSpecialty('');
                        updateFormData({ specialty: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {formData.specialty && !showCustomSpecialty && (
                  <m.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-emerald-600 mt-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Selected: {formData.specialty}</span>
                  </m.div>
                )}
              </div>

              {/* Sub-specialty with suggestions */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Sub-specialty or Certification
                </label>
                <AnimatedInput
                  value={formData.subSpecialty || ''}
                  onChange={(value) => updateFormData({ subSpecialty: value })}
                  placeholder="e.g., CCRN, Trauma ICU"
                  icon={<Award className="w-5 h-5" />}
                />
                {subSpecialtiesData?.subSpecialties && subSpecialtiesData.subSpecialties.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Quick select:</p>
                    <div className="flex flex-wrap gap-1">
                      {subSpecialtiesData.subSpecialties.slice(0, 5).map((subSpec) => (
                        <button
                          key={subSpec.name}
                          type="button"
                          onClick={() => updateFormData({ subSpecialty: subSpec.name })}
                          className="px-2 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md transition-colors"
                        >
                          {subSpec.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Employment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {employmentTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateFormData({ employmentType: type.value })}
                        className={`px-3 py-2 text-xs rounded-lg border-2 transition-all flex items-center gap-2 ${
                          formData.employmentType === type.value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 hover:border-emerald-300 bg-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shift Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Primary Shift
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {shiftTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateFormData({ shiftType: type.value })}
                        className={`px-3 py-2 text-xs rounded-lg border-2 transition-all flex items-center gap-2 ${
                          formData.shiftType === type.value
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 hover:border-emerald-300 bg-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shift Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Shift Hours
                </label>
                <div className="flex gap-2">
                  {[8, 10, 12, 16].map(hours => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => updateFormData({ shiftHours: hours })}
                      className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg border-2 transition-all ${
                        formData.shiftHours === hours
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      {hours}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Nurse Ratio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nurse:Patient Ratio
                </label>
                <AnimatedInput
                  type="text"
                  value={formData.nurseToPatientRatio}
                  onChange={(val) => updateFormData({ nurseToPatientRatio: val })}
                  placeholder="1:4"
                  icon={<Users className="w-4 h-4" />}
                />
              </div>

              {/* Union Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Union Status
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateFormData({ isUnionized: true })}
                    className={`flex-1 py-2 px-3 text-sm rounded-lg border-2 transition-all ${
                      formData.isUnionized
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    Union
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFormData({ isUnionized: false })}
                    className={`flex-1 py-2 px-3 text-sm rounded-lg border-2 transition-all ${
                      !formData.isUnionized
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    Non-Union
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Compensation Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-semibold text-gray-900">Compensation</h3>
              </div>

              {/* Base Pay */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Base Pay <span className="text-red-500">*</span>
                  </label>
                  <AnimatedInput
                    type="number"
                    value={formData.basePay.toString()}
                    onChange={(val) => updateFormData({ basePay: parseFloat(val) || 0 })}
                    placeholder="0.00"
                    min={0}
                    step="0.5"
                    icon={<DollarSign className="w-5 h-5" />}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Pay Unit
                  </label>
                  <CustomDropdown
                    value={formData.basePayUnit === 'hourly' ? 'Per Hour' : 'Per Year'}
                    onChange={(val) => updateFormData({ basePayUnit: val === 'Per Hour' ? 'hourly' : 'yearly' })}
                    options={['Per Hour', 'Per Year']}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Differentials Component */}
            <DifferentialWithFrequency
              basePay={formData.basePay}
              paymentFrequency={formData.basePayUnit}
              shiftType={formData.shiftType}
              shiftHours={formData.shiftHours}
              differentials={formData.differentials}
              onDifferentialsChange={(differentials) => updateFormData({ differentials })}
              onPreviewChange={(preview) => {
                // Handle preview if needed
              }}
            />
          </div>

          {/* Culture Ratings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-semibold text-gray-900">Rate Your Experience</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CULTURE_CATEGORIES.map(category => {
                const Icon = category.icon;
                const rating = formData.culture[category.key];

                return (
                  <div key={category.key} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 text-${category.color}-600`} />
                      <label className="text-sm font-medium text-gray-700">
                        {category.label}
                      </label>
                      {rating > 0 && (
                        <span className="ml-auto text-xs text-emerald-600">✓</span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(value => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleRatingChange(category.key, value)}
                          className={`flex-1 py-2 text-sm font-medium rounded-md border-2 transition-all ${
                            rating === value
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                              : 'border-gray-200 hover:border-emerald-300 bg-white'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Feedback */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Additional Feedback (Optional)
                </label>
                <textarea
                  value={formData.culture.freeTextFeedback}
                  onChange={(e) => updateFormData({
                    culture: { ...formData.culture, freeTextFeedback: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Share any additional thoughts about the workplace..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              <span className="text-red-500">*</span> Required fields
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isValid() || isSubmitting}
                className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${
                  !isValid() || isSubmitting
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-sm'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save Career'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}