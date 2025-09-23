import React, { useState, useRef, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Users,
  ChevronRight,
  ChevronLeft,
  Building,
  Award,
  Sun,
  Moon,
  Sunrise,
  Calendar,
  Activity,
  Heart,
  Shield,
  TrendingUp,
  Building2,
  Stethoscope,
  Check,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSpecialties } from 'src/hooks/useSpecialties';
import CustomDropdown from 'src/components/features/onboarding/components/CustomDropdown';
import SelectionCard from 'src/components/features/onboarding/components/SelectionCard';
import AnimatedInput from 'src/components/features/onboarding/components/AnimatedInput';
import ActionButton from 'src/components/ui/button/ActionButton';
import DifferentialWithFrequency from 'src/components/features/onboarding/EmploymentForm/components/DifferentialWithFrequency';
import { normalizeCity } from 'src/lib/constants/cityMapping';
import type { DifferentialItem } from 'src/api/useDifferentialAPI';

// Types
interface CultureRatings {
  unitCulture: number;
  benefits: number;
  growthOpportunities: number;
  hospitalQuality: number;
  freeTextFeedback?: string;
}

export interface ImprovedCareerFormData {
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

interface ImprovedCareerFormProps {
  onSubmit: (data: ImprovedCareerFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  currentCompensation?: any;
  userProfile?: any;
  isLoaded?: boolean;
  theme?: 'light' | 'dark';
}

// Constants - Matching onboarding exactly
const employmentTypeOptions = [
  { value: 'Full-time', icon: <Clock className="w-5 h-5" />, description: '36+ hours per week' },
  { value: 'Part-time', icon: <Calendar className="w-5 h-5" />, description: 'Less than 36 hours' },
  { value: 'Per Diem/PRN', icon: <Activity className="w-5 h-5" />, description: 'As-needed basis' },
  { value: 'Temporary/Contract', icon: <Award className="w-5 h-5" />, description: 'Fixed-term employment' },
  { value: 'Travel Nursing', icon: <MapPin className="w-5 h-5" />, description: 'Short-term assignments' },
  { value: 'Agency Nursing', icon: <Users className="w-5 h-5" />, description: 'Staffing agency placement' },
];

const shiftTypeOptions = [
  { value: 'Day Shift', icon: <Sun className="w-5 h-5" />, description: 'Daytime hours' },
  { value: 'Evening Shift', icon: <Sunrise className="w-5 h-5" />, description: 'Evening hours' },
  { value: 'Night Shift', icon: <Moon className="w-5 h-5" />, description: 'Overnight hours' },
  { value: 'Rotating Shift', icon: <Clock className="w-5 h-5" />, description: 'Variable shifts' },
];

const nurseRatioOptions = ['1:1', '1:2', '1:3', '1:4', '1:5', 'Custom'];

const CULTURE_CATEGORIES = [
  {
    key: 'unitCulture' as const,
    label: 'Unit Culture',
    description: 'Team collaboration and work environment',
    icon: Heart,
  },
  {
    key: 'benefits' as const,
    label: 'Benefits',
    description: 'Healthcare, PTO, retirement plans',
    icon: Shield,
  },
  {
    key: 'growthOpportunities' as const,
    label: 'Growth Opportunities',
    description: 'Professional development and advancement',
    icon: TrendingUp,
  },
  {
    key: 'hospitalQuality' as const,
    label: 'Hospital Quality',
    description: 'Overall hospital standards and reputation',
    icon: Building2,
  },
];

const RATING_OPTIONS = [
  { value: 1, label: 'Poor' },
  { value: 2, label: 'Fair' },
  { value: 3, label: 'Good' },
  { value: 4, label: 'Great' },
  { value: 5, label: 'Excellent' },
];

export default function ImprovedCareerFormV2({
  onSubmit,
  onCancel,
  isSubmitting = false,
  currentCompensation,
  userProfile,
  isLoaded = false,
  theme = 'light'
}: ImprovedCareerFormProps) {
  const [step, setStep] = useState(1);
  const [showCustomSpecialty, setShowCustomSpecialty] = useState(false);
  const [customSpecialty, setCustomSpecialty] = useState('');
  const [customRatio, setCustomRatio] = useState('');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(null);

  // Refs for Google Places
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // API hooks
  const { getAllSpecialties, getSubSpecialties } = useSpecialties();
  const { data: specialtiesData, isLoading: specialtiesLoading } = getAllSpecialties;
  const { data: subSpecialtiesData } = getSubSpecialties(selectedSpecialtyId);

  // Form state
  const [formData, setFormData] = useState<ImprovedCareerFormData>({
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
  const updateFormData = (updates: Partial<ImprovedCareerFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Google Places Autocomplete initialization
  useEffect(() => {
    if (!isLoaded || !inputRef.current || step !== 1) return;

    try {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment'],
        fields: ['name', 'address_components', 'formatted_address'],
      });

      const listener = autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();

        if (place && place.address_components) {
          let rawCity = '';
          let state = '';

          place.address_components.forEach((component) => {
            const {types} = component;

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
  }, [isLoaded, step]);

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
      // Find the ID for sub-specialties
      const selected = specialtiesData?.specialties?.find(s => s.name === value);
      setSelectedSpecialtyId(selected?.id || null);
    }
  };

  // Handle differential changes
  const handleDifferentialsChange = (differentials: DifferentialItem[]) => {
    updateFormData({ differentials });
  };

  const handlePreviewChange = (preview: any) => {
    // Handle preview if needed
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
  const validateStep = (stepNum: number): boolean => {
    switch (stepNum) {
      case 1:
        return !!(formData.hospital && formData.organizationCity && formData.organizationState && formData.specialty);
      case 2:
        return formData.basePay > 0;
      case 3:
        return !!(formData.culture.unitCulture && formData.culture.benefits &&
                 formData.culture.growthOpportunities && formData.culture.hospitalQuality);
      default:
        return true;
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Render steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-xl shadow-sm p-6 space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Building className="w-6 h-6 text-emerald-600" />
              Workplace & Role
            </h3>

            {/* Hospital Search */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Hospital/Facility Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={formData.hospital}
                  onChange={(e) => updateFormData({ hospital: e.target.value })}
                  placeholder="Search for hospital..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              {isLoaded && (
                <p className="text-xs text-gray-500">
                  Start typing to search for hospitals and facilities
                </p>
              )}
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <AnimatedInput
                  type="text"
                  value={formData.organizationCity}
                  onChange={(val) => updateFormData({ organizationCity: val })}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
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
            </div>

            {/* Employment Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  selected={formData.employmentStartDate}
                  onChange={(date) => updateFormData({ employmentStartDate: date || new Date() })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  End Date <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <DatePicker
                  selected={formData.employmentEndDate}
                  onChange={(date) => updateFormData({ employmentEndDate: date })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  isClearable
                  placeholderText="Current position"
                />
              </div>
            </div>

            {/* Employment Type - Like onboarding */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Employment Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {employmentTypeOptions.map((option) => (
                  <SelectionCard
                    key={option.value}
                    value={option.value}
                    label={option.value}
                    description={option.description}
                    isSelected={formData.employmentType === option.value}
                    onClick={() => updateFormData({ employmentType: option.value })}
                    icon={option.icon}
                  />
                ))}
              </div>
            </div>

            {/* Shift Type - Like onboarding */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Primary Shift
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shiftTypeOptions.map((option) => (
                  <SelectionCard
                    key={option.value}
                    value={option.value}
                    label={option.value}
                    description={option.description}
                    isSelected={formData.shiftType === option.value}
                    onClick={() => updateFormData({ shiftType: option.value })}
                    icon={option.icon}
                  />
                ))}
              </div>
            </div>

            {/* Shift Hours - Like onboarding */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Shift Length (Hours per shift)
              </label>
              <div className="flex gap-2">
                {[8, 10, 12, 16].map((hours) => (
                  <m.button
                    key={hours}
                    type="button"
                    onClick={() => updateFormData({ shiftHours: hours })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex-1 py-2 px-3 rounded-lg border-2 font-semibold transition-all
                      ${formData.shiftHours === hours
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-gray-200 hover:border-emerald-300 text-gray-600'
                      }
                    `}
                  >
                    {hours}h
                  </m.button>
                ))}
              </div>
              {formData.shiftHours && (
                <p className="text-sm text-green-600">
                  ✓ Selected: {formData.shiftHours} hours per shift
                </p>
              )}
            </div>

            {/* Specialty Field - With Search Like Onboarding */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
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
                  <p className="text-xs text-gray-500">
                    Can't find your specialty? Select "Other" to enter custom
                  </p>
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    <AnimatedInput
                      value={customSpecialty}
                      onChange={setCustomSpecialty}
                      placeholder="Enter your specialty"
                      icon={<Stethoscope className="w-5 h-5" />}
                      className="flex-1"
                    />
                    <ActionButton
                      type="button"
                      onClick={() => {
                        if (customSpecialty.trim()) {
                          updateFormData({ specialty: customSpecialty.trim() });
                          setShowCustomSpecialty(false);
                        }
                      }}
                      className="px-4 py-2"
                    >
                      Set
                    </ActionButton>
                    <ActionButton
                      type="button"
                      onClick={() => {
                        setShowCustomSpecialty(false);
                        setCustomSpecialty('');
                        updateFormData({ specialty: '' });
                      }}
                      variant="outline"
                      className="px-4 py-2"
                    >
                      Cancel
                    </ActionButton>
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter your specific specialty or area of practice
                  </p>
                </>
              )}
              {formData.specialty && !showCustomSpecialty && (
                <m.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-emerald-600"
                >
                  <Check className="w-4 h-4" />
                  <span>Selected: {formData.specialty}</span>
                </m.div>
              )}
            </div>

            {/* Sub-specialty */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Sub-specialty or Certification <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <AnimatedInput
                value={formData.subSpecialty || ''}
                onChange={(value) => updateFormData({ subSpecialty: value })}
                placeholder="e.g., Trauma ICU, CCRN, Pediatric Emergency"
                icon={<Award className="w-5 h-5" />}
              />
              {subSpecialtiesData?.subSpecialties && subSpecialtiesData.subSpecialties.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Suggestions based on {formData.specialty}:</p>
                  <div className="flex flex-wrap gap-1">
                    {subSpecialtiesData.subSpecialties.slice(0, 5).map((subSpec) => (
                      <m.button
                        key={subSpec.name}
                        type="button"
                        onClick={() => updateFormData({ subSpecialty: subSpec.name })}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-700 rounded-md transition-colors"
                      >
                        {subSpec.name}
                      </m.button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Nurse to Patient Ratio - Like onboarding */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Nurse to Patient Ratio
              </label>
              <div className="flex gap-2 flex-wrap">
                {nurseRatioOptions.map((ratio) => {
                  const isCustom = ratio === 'Custom';
                  const isSelected = isCustom ? customRatio !== '' : formData.nurseToPatientRatio === ratio;

                  return (
                    <m.button
                      key={ratio}
                      type="button"
                      onClick={() => {
                        if (isCustom) {
                          setCustomRatio('1:');
                        } else {
                          updateFormData({ nurseToPatientRatio: ratio });
                          setCustomRatio('');
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        px-3 py-2 rounded-lg border-2 font-semibold text-sm transition-all
                        ${isSelected
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                          : 'border-gray-200 hover:border-emerald-300 text-gray-600'
                        }
                      `}
                    >
                      {ratio}
                    </m.button>
                  );
                })}
              </div>
              {customRatio !== '' && (
                <AnimatedInput
                  value={customRatio}
                  onChange={(val) => {
                    setCustomRatio(val);
                    updateFormData({ nurseToPatientRatio: val });
                  }}
                  placeholder="1:6"
                  className="w-32"
                />
              )}
            </div>

            {/* Union Status */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Union Status
              </label>
              <div className="flex gap-3">
                <m.button
                  type="button"
                  onClick={() => updateFormData({ isUnionized: true })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition-all
                    ${formData.isUnionized
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'border-gray-200 hover:border-emerald-300 text-gray-600'
                    }
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    {formData.isUnionized && <Check className="w-5 h-5" />}
                    <span>Unionized</span>
                  </div>
                </m.button>
                <m.button
                  type="button"
                  onClick={() => updateFormData({ isUnionized: false })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition-all
                    ${!formData.isUnionized
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                      : 'border-gray-200 hover:border-emerald-300 text-gray-600'
                    }
                  `}
                >
                  <div className="flex items-center justify-center gap-2">
                    {!formData.isUnionized && <X className="w-5 h-5" />}
                    <span>Non-Union</span>
                  </div>
                </m.button>
              </div>
            </div>
          </m.div>
        );

      case 2:
        return (
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Base Pay Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-emerald-600" />
                Base Compensation
              </h3>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Base Pay Amount <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
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
                  <CustomDropdown
                    value={formData.basePayUnit === 'hourly' ? 'Per Hour' : 'Per Year'}
                    onChange={(val) => updateFormData({ basePayUnit: val === 'Per Hour' ? 'hourly' : 'yearly' })}
                    options={['Per Hour', 'Per Year']}
                    className="w-40"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Enter your base pay without any differentials
                </p>
              </div>
            </div>

            {/* Differentials Section - Using Onboarding Component */}
            <DifferentialWithFrequency
              basePay={formData.basePay}
              paymentFrequency={formData.basePayUnit}
              shiftType={formData.shiftType}
              shiftHours={formData.shiftHours}
              differentials={formData.differentials}
              onDifferentialsChange={handleDifferentialsChange}
              onPreviewChange={handlePreviewChange}
            />
          </m.div>
        );

      case 3:
        return (
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-8">
              Rate Your Experience
            </h3>
            <div className="space-y-4 sm:space-y-6">
              {CULTURE_CATEGORIES.map((category, index) => {
                const Icon = category.icon;
                const isRated = !!formData.culture[category.key];

                return (
                  <m.div
                    key={category.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className={`space-y-3 p-3 rounded-lg transition-all ${
                      isRated ? 'bg-emerald-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        isRated ? 'bg-emerald-200' : 'bg-emerald-100'
                      }`}>
                        <Icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900">
                          {category.label}
                          {isRated && (
                            <span className="ml-2 text-sm font-normal text-emerald-500">
                              ✓
                            </span>
                          )}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1.5 sm:gap-2 pl-0 sm:pl-11">
                      {RATING_OPTIONS.map((option) => {
                        const isSelected = formData.culture[category.key] === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleRatingChange(category.key, option.value)}
                            className={`
                              flex-1 min-h-[75px] py-3 px-1 rounded-lg border-2 transition-all duration-200
                              ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-50 shadow-md scale-105'
                                  : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm hover:scale-102'
                              }
                            `}
                          >
                            <div className="text-center">
                              <div className={`text-2xl font-bold mb-1 ${
                                isSelected
                                  ? 'text-emerald-700'
                                  : 'text-gray-500'
                              }`}>
                                {option.value}
                              </div>
                              <div
                                className={`text-[11px] font-medium ${
                                  isSelected
                                    ? 'text-emerald-600'
                                    : 'text-gray-400'
                                }`}
                              >
                                {option.label}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </m.div>
                );
              })}

              {/* Feedback text */}
              <div className="space-y-2 mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Feedback (optional)
                </label>
                <textarea
                  value={formData.culture.freeTextFeedback}
                  onChange={(e) => updateFormData({
                    culture: { ...formData.culture, freeTextFeedback: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Share any additional thoughts about the workplace culture..."
                />
              </div>
            </div>
          </m.div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Add Career History</h2>
          <span className="text-sm text-gray-500">Step {step} of 3</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Form content */}
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <ActionButton
            type="button"
            onClick={() => setStep(step - 1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </ActionButton>
        ) : (
          <ActionButton
            type="button"
            onClick={onCancel}
            variant="outline"
          >
            Cancel
          </ActionButton>
        )}

        {step < 3 ? (
          <ActionButton
            type="button"
            onClick={() => {
              if (validateStep(step)) {
                setStep(step + 1);
              } else {
                toast.error('Please fill in all required fields');
              }
            }}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </ActionButton>
        ) : (
          <ActionButton
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Career'}
          </ActionButton>
        )}
      </div>
    </div>
  );
}