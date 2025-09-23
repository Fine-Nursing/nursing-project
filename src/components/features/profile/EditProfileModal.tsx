import React, { useState, useEffect, useRef, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, User, Briefcase, GraduationCap, MapPin, Building, Stethoscope } from 'lucide-react';
import { useJsApiLoader, type Libraries } from '@react-google-maps/api';
import CustomDropdown from '../onboarding/components/CustomDropdown';
import { useSpecialties } from 'src/hooks/useSpecialties';
import { normalizeCity } from 'src/lib/constants/cityMapping';

const libraries: Libraries = ['places'];

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: {
    name: string;
    role: string;
    specialty: string;
    education: string;
    organization: string;
    location: string;
    experience?: string | number;
  };
  onSave: (data: {
    name: string;
    role: string;
    specialty: string;
    education: string;
    organization: string;
    location: string;
    experience?: number;
  }) => Promise<void>;
  theme: 'light' | 'dark';
}

// Role options from onboarding
const NURSING_ROLES = [
  'Certified Nursing Assistant (CNA)',
  'Licensed Practical Nurse (LPN)',
  'Registered Nurse (RN)',
  'Nurse Practitioner (NP)',
  'Clinical Nurse Specialist (CNS)',
  'Certified Nurse Midwife (CNM)',
  'Certified Registered Nurse Anesthetist (CRNA)',
  'Nurse Administrator',
  'Travel Nurse',
  'Staff Nurse',
  'Public Health Nurse',
  'Emergency Room Nurse',
  'Critical Care Nurse',
  'Pediatric Nurse',
  'Geriatric Nurse',
  'Neonatal Nurse',
  'Psychiatric Nurse',
  'Hospice Nurse',
  'Case Manager Nurse',
  'Other'
];

// Education level options
const EDUCATION_LEVELS = [
  'High School Diploma or Equivalent',
  'Vocational/Technical Certificate',
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate Degree',
  "Post-Master's Certificate",
  'Specialized Nursing Certification'
];

export default function EditProfileModal({
  isOpen,
  onClose,
  currentProfile,
  onSave,
  theme
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    ...currentProfile,
    experience: currentProfile.experience
      ? typeof currentProfile.experience === 'string'
        ? parseInt(currentProfile.experience.replace(/[^0-9]/g, '')) || 0
        : currentProfile.experience
      : 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCustomRole, setShowCustomRole] = useState(false);
  const [showCustomSpecialty, setShowCustomSpecialty] = useState(false);
  const [customRole, setCustomRole] = useState('');
  const [customSpecialty, setCustomSpecialty] = useState('');
  const [organizationInput, setOrganizationInput] = useState(currentProfile.organization || '');

  // Google Places Autocomplete refs
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load Google Places API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Get specialties from API
  const { getAllSpecialties } = useSpecialties();
  const { data: specialtiesData, isLoading: specialtiesLoading } = getAllSpecialties;

  // Map specialties to dropdown format
  const specialtyOptions = specialtiesData?.specialties?.map(s => s.name) || [];
  if (specialtyOptions.length > 0 && !specialtyOptions.includes('Other')) {
    specialtyOptions.push('Other');
  }

  useEffect(() => {
    // Only reset form data when modal opens (isOpen changes to true)
    if (isOpen) {
      setFormData({
        ...currentProfile,
        experience: currentProfile.experience
          ? typeof currentProfile.experience === 'string'
            ? parseInt(currentProfile.experience.replace(/[^0-9]/g, '')) || 0
            : currentProfile.experience
          : 0
      });
      setOrganizationInput(currentProfile.organization || '');
      // Check if role or specialty are custom values
      if (currentProfile.role && !NURSING_ROLES.includes(currentProfile.role)) {
        setShowCustomRole(true);
        setCustomRole(currentProfile.role);
      }
      if (currentProfile.specialty && specialtyOptions.length > 0 && !specialtyOptions.includes(currentProfile.specialty)) {
        setShowCustomSpecialty(true);
        setCustomSpecialty(currentProfile.specialty);
      }
    }
  }, [isOpen, currentProfile.name]); // Only reset when modal opens or user changes

  // Debug formData changes
  useEffect(() => {
  }, [formData]);

  // Google Places Autocomplete initialization
  useEffect(() => {
    if (!isLoaded || !inputRef.current || !isOpen) return;

    try {
      // Create Autocomplete instance
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment'],
        fields: ['name', 'address_components', 'formatted_address'],
      });

      // Place selection event listener
      const listener = autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();

        if (place) {
          let rawCity = '';
          let state = '';

          // Extract location info from address components
          if (place.address_components) {
            place.address_components.forEach((component) => {
              const {types} = component;

              if (types.includes('locality')) {
                rawCity = component.long_name;
              }
              if (types.includes('administrative_area_level_1')) {
                state = component.short_name;
              }
            });
          }

          // Normalize city name
          const city = normalizeCity(rawCity, state, '', '');

          // Update form data
          const organizationName = place.name || organizationInput;
          setOrganizationInput(organizationName);
          setFormData(prev => ({
            ...prev,
            organization: organizationName,
            location: city && state ? `${city}, ${state}` : prev.location
          }));
        }
      });

      // Cleanup
      return () => {
        if (listener) {
          google.maps.event.removeListener(listener);
        }
      };
    } catch (error) {
    }
  }, [isLoaded, isOpen, organizationInput]);

  // Manual organization input handler
  const handleOrganizationChange = useCallback((value: string) => {
    setOrganizationInput(value);
    setFormData(prev => ({ ...prev, organization: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleRoleChange = (value: string) => {
    if (value === 'Other') {
      setShowCustomRole(true);
      setCustomRole('');
      setFormData(prev => ({ ...prev, role: '' }));
    } else {
      setShowCustomRole(false);
      setFormData(prev => ({ ...prev, role: value }));
    }
  };

  const handleSpecialtyChange = (value: string) => {
    if (value === 'Other') {
      setShowCustomSpecialty(true);
      setCustomSpecialty('');
      setFormData(prev => ({ ...prev, specialty: '' }));
    } else {
      setShowCustomSpecialty(false);
      setFormData(prev => ({ ...prev, specialty: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div
              className={`w-full max-w-md ${
                theme === 'light' ? 'bg-white' : 'bg-slate-800'
              } rounded-2xl shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`px-6 py-4 border-b ${
                theme === 'light' ? 'border-gray-200' : 'border-slate-700'
              }`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-semibold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Edit Profile
                  </h2>
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'light'
                        ? 'hover:bg-gray-100 text-gray-500'
                        : 'hover:bg-slate-700 text-gray-400'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    <User className="w-4 h-4" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleChange('name')}
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-gray-900'
                        : 'bg-slate-700 border-slate-600 text-white'
                    }`}
                    required
                  />
                </div>

                {/* Role with CustomDropdown */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    <Briefcase className="w-4 h-4" />
                    Nursing Role
                  </label>
                  {!showCustomRole ? (
                    <>
                      <CustomDropdown
                        value={formData.role || ''}
                        onChange={handleRoleChange}
                        options={NURSING_ROLES}
                        placeholder="Search or select your role"
                        searchable
                        className="w-full"
                        icon={<Briefcase className="w-5 h-5" />}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Can't find your role? Select "Other" to enter custom
                      </p>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customRole}
                          onChange={(e) => setCustomRole(e.target.value)}
                          placeholder="Enter your specific role"
                          className={`flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            theme === 'light'
                              ? 'bg-white border-gray-300 text-gray-900'
                              : 'bg-slate-700 border-slate-600 text-white'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customRole.trim()) {
                              setFormData(prev => ({ ...prev, role: customRole.trim() }));
                              setShowCustomRole(false);
                            }
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Set
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomRole(false);
                            setCustomRole('');
                            setFormData(prev => ({ ...prev, role: '' }));
                          }}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            theme === 'light'
                              ? 'border-gray-300 hover:bg-gray-100'
                              : 'border-slate-600 hover:bg-slate-700'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Specialty with CustomDropdown */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    <Stethoscope className="w-4 h-4" />
                    Nursing Specialty
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
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customSpecialty}
                          onChange={(e) => setCustomSpecialty(e.target.value)}
                          placeholder="Enter your specialty"
                          className={`flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            theme === 'light'
                              ? 'bg-white border-gray-300 text-gray-900'
                              : 'bg-slate-700 border-slate-600 text-white'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customSpecialty.trim()) {
                              setFormData(prev => ({ ...prev, specialty: customSpecialty.trim() }));
                              setShowCustomSpecialty(false);
                            }
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Set
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomSpecialty(false);
                            setCustomSpecialty('');
                            setFormData(prev => ({ ...prev, specialty: '' }));
                          }}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            theme === 'light'
                              ? 'border-gray-300 hover:bg-gray-100'
                              : 'border-slate-600 hover:bg-slate-700'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Education with CustomDropdown */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    <GraduationCap className="w-4 h-4" />
                    Education Level
                  </label>
                  <CustomDropdown
                    value={formData.education || ''}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, education: value }));
                    }}
                    options={EDUCATION_LEVELS}
                    placeholder="Select your education level"
                    searchable
                    className="w-full"
                    icon={<GraduationCap className="w-5 h-5" />}
                  />
                </div>

                {/* Organization with Google Places Autocomplete */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    <Building className="w-4 h-4" />
                    Organization
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      value={organizationInput}
                      onChange={(e) => handleOrganizationChange(e.target.value)}
                      placeholder="Search for hospital or healthcare facility..."
                      className={`w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        theme === 'light'
                          ? 'bg-white border-gray-300 text-gray-900'
                          : 'bg-slate-700 border-slate-600 text-white'
                      }`}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Start typing to search for healthcare facilities
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={handleChange('location')}
                    placeholder="e.g., New York, NY"
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-gray-900'
                        : 'bg-slate-700 border-slate-600 text-white'
                    }`}
                    required
                  />
                </div>

                {/* Years of Experience */}
                <div>
                  <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                    theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    <Briefcase className="w-4 h-4" />
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={formData.experience || 0}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                    min="0"
                    max="50"
                    placeholder="Years of nursing experience"
                    className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-gray-900'
                        : 'bg-slate-700 border-slate-600 text-white'
                    }`}
                    required
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}