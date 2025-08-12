'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import ActionButton from 'src/components/button/ActionButton';
import useOnboardingStore from 'src/store/onboardingStores';
import type { EmploymentType, ShiftType , IndividualDifferentialItem } from 'src/types/onboarding';
import toast from 'react-hot-toast';
import useEmploymentMutation from 'src/api/onboarding/useEmploymentMutation';
import {
  Users,
  DollarSign,
  MapPin,
  Briefcase,
  Clock,
  Building2,
  Moon,
  Sun,
  Sunrise,
  Calendar,
  Heart,
  Award,
  Activity,
  Building,
  MapPinned,
  Check
} from 'lucide-react';
import { DIFFERENTIAL_LIST } from 'src/lib/constants/differential';
import type {
 Libraries } from '@react-google-maps/api';
import {
  GoogleMap,
  useJsApiLoader,
  StandaloneSearchBox,
  Marker } from '@react-google-maps/api';
import { NURSING_SPECIALTIES, NURSING_SUB_SPECIALTIES } from 'src/lib/constants/specialties';
import AnimatedInput from '../components/AnimatedInput';
import CompactStepIndicator from '../components/CompactStepIndicator';
import SelectionCard from '../components/SelectionCard';
import AnimatedProgressBar from '../components/AnimatedProgressBar';
import SummaryCard from '../components/SummaryCard';
import CustomDropdown from '../components/CustomDropdown';

const libraries: Libraries = ['places'];

const POPULAR_DIFFERENTIALS = [
  'Night Shift',
  'Weekend',
  'Holiday',
  'Call Pay',
  'Charge Nurse',
  'Float Pool'
];

export default function EmploymentForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [customRatio, setCustomRatio] = useState<string>('');
  const [showCustomSpecialty, setShowCustomSpecialty] = useState(false);
  const [customSpecialty, setCustomSpecialty] = useState<string>('');
  
  // Google Maps states
  const [showMapModal, setShowMapModal] = useState(false);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [placesResult, setPlacesResult] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [tempOrgName, setTempOrgName] = useState<string>('');
  const [tempCity, setTempCity] = useState<string>('');
  const [tempState, setTempState] = useState<string>('');
  
  // Differential states
  const [differentialInput, setDifferentialInput] = useState('');
  const [showDifferentialSuggestions, setShowDifferentialSuggestions] = useState(false);
  const [customDiff, setCustomDiff] = useState<{
    type: string;
    amount: number;
    unit: 'hourly' | 'annual';
    group?: string;
  }>({
    type: '',
    amount: 0,
    unit: 'hourly',
  });

  const employmentMutation = useEmploymentMutation();
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const sections = [
    { 
      label: 'Workplace',
      isCompleted: completedSections.includes(0),
      isActive: currentSection === 0
    },
    { 
      label: 'Role',
      isCompleted: completedSections.includes(1),
      isActive: currentSection === 1
    },
    { 
      label: 'Compensation',
      isCompleted: completedSections.includes(2),
      isActive: currentSection === 2
    },
  ];

  const employmentTypeOptions = useMemo(() => [
    { value: 'Full-time', icon: <Clock className="w-5 h-5" />, description: '36+ hours per week' },
    { value: 'Part-time', icon: <Calendar className="w-5 h-5" />, description: 'Less than 36 hours' },
    { value: 'Per Diem/PRN', icon: <Activity className="w-5 h-5" />, description: 'As-needed basis' },
    { value: 'Temporary/Contract', icon: <Award className="w-5 h-5" />, description: 'Fixed-term employment' },
    { value: 'Travel Nursing', icon: <MapPin className="w-5 h-5" />, description: 'Short-term assignments' },
    { value: 'Agency Nursing', icon: <Users className="w-5 h-5" />, description: 'Staffing agency placement' },
  ], []);

  const shiftTypeOptions = useMemo(() => [
    { value: 'Day Shift', icon: <Sun className="w-5 h-5" />, description: '7 AM - 3 PM' },
    { value: 'Evening Shift', icon: <Sunrise className="w-5 h-5" />, description: '3 PM - 11 PM' },
    { value: 'Night Shift', icon: <Moon className="w-5 h-5" />, description: '11 PM - 7 AM' },
    { value: 'Rotating Shift', icon: <Clock className="w-5 h-5" />, description: 'Variable shifts' },
  ], []);

  const nurseRatioOptions = useMemo(() => [
    '1:1', '1:2', '1:3', '1:4', '1:5', 'Custom'
  ], []);

  const differentialFilteredList = useMemo(() => {
    if (!differentialInput) return [];
    const input = differentialInput.toLowerCase();
    return DIFFERENTIAL_LIST.filter(
      (diff) =>
        diff.display.toLowerCase().includes(input) ||
        diff.group.toLowerCase().includes(input)
    ).slice(0, 8); // Limit to 8 suggestions
  }, [differentialInput]);

  const calculateTotalDifferentials = (differentials: IndividualDifferentialItem[]) => differentials.reduce(
      (totals, diff) => {
        if (diff.unit === 'hourly') {
          totals.hourly += diff.amount;
        } else {
          totals.annual += diff.amount;
        }
        return totals;
      },
      { hourly: 0, annual: 0 }
    );

  const handleDifferentialInputChange = (value: string) => {
    setDifferentialInput(value);
    setShowDifferentialSuggestions(true);

    // Auto-select if exact match
    const exactMatch = DIFFERENTIAL_LIST.find(
      (diff) => diff.display.toLowerCase() === value.toLowerCase()
    );
    if (exactMatch) {
      setCustomDiff({
        ...customDiff,
        type: exactMatch.display,
        group: exactMatch.group,
      });
    } else {
      setCustomDiff({
        ...customDiff,
        type: value,
        group: 'Other',
      });
    }
  };

  const handleDifferentialSelectAndSet = (diffType: string) => {
    const selected = DIFFERENTIAL_LIST.find((diff) => diff.display === diffType);
    if (selected) {
      setDifferentialInput(selected.display);
      setCustomDiff({
        ...customDiff,
        type: selected.display,
        group: selected.group,
      });
    }
    setShowDifferentialSuggestions(false);
  };

  const addPopularDifferential = (diffType: string) => {
    // Check if already added
    if (formData.individualDifferentials?.some(d => d.type === diffType)) {
      // Remove if already exists
      const filtered = formData.individualDifferentials.filter(d => d.type !== diffType);
      updateFormData({ individualDifferentials: filtered });
      toast.success(`Removed ${diffType} differential`);
      return;
    }

    // Set up for custom amount input
    const selected = DIFFERENTIAL_LIST.find(d => d.display === diffType);
    setDifferentialInput(diffType);
    setCustomDiff({
      type: diffType,
      amount: diffType === 'Holiday' ? 2 : diffType === 'Weekend' ? 1.5 : 1, // Suggested defaults
      unit: 'hourly',
      group: selected ? selected.group : 'Shift Differentials'
    });
    toast(`💡 Set ${diffType} - now enter the amount below`, {
      icon: '📝',
      duration: 3000
    });
  };

  const addCustomDifferential = () => {
    if (!customDiff.type || customDiff.amount <= 0) return;

    // Check for duplicates
    if (
      formData.individualDifferentials?.some(
        (d) => d.type === customDiff.type && d.unit === customDiff.unit
      )
    ) {
      toast.error('This differential already exists');
      return;
    }

    const newDiff: IndividualDifferentialItem = {
      type: customDiff.type,
      amount: customDiff.amount,
      unit: customDiff.unit,
      group: customDiff.group || 'Other',
    };

    const updatedDifferentials = [
      ...(formData.individualDifferentials || []),
      newDiff,
    ];

    updateFormData({ individualDifferentials: updatedDifferentials });
    
    // Reset form
    setCustomDiff({ type: '', amount: 0, unit: 'hourly' });
    setDifferentialInput('');
    
    toast.success('Differential added!');
  };

  const removeDifferential = (index: number) => {
    const updated = [...(formData.individualDifferentials || [])];
    updated.splice(index, 1);
    updateFormData({ individualDifferentials: updated });
  };

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    
    // Add click listener to map
    map.addListener('click', (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        // Clear previous marker
        if (markerRef.current) {
          markerRef.current.setMap(null);
          markerRef.current = null;
        }
        
        // Add new marker at clicked position
        const marker = new google.maps.Marker({
          position: event.latLng,
          map,
          animation: google.maps.Animation.DROP,
        });
        
        markerRef.current = marker;
        
        // Get address from coordinates (reverse geocoding)
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: event.latLng }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const place = results[0];
            let city = '';
            let state = '';
            
            place.address_components?.forEach((component) => {
              if (component.types.includes('locality')) {
                city = component.long_name;
              } else if (!city && component.types.includes('administrative_area_level_2')) {
                city = component.long_name;
              }
              if (component.types.includes('administrative_area_level_1')) {
                state = component.short_name;
              }
            });
            
            setTempOrgName('');
            setTempCity(city);
            setTempState(state);
          }
        });
      }
    });
  };

  const handlePlacesChanged = () => {
    if (!searchBoxRef.current) return;

    const places = searchBoxRef.current.getPlaces();
    if (!places || places.length === 0) return;

    setPlacesResult(places);
    
    // Auto-select first result and directly handle it with the fresh data
    if (places.length > 0) {
      handlePlaceWithData(0, places);
    }
  };

  const handlePlaceWithData = (index: number, places: google.maps.places.PlaceResult[]) => {
    setSelectedIndex(index);
    const place = places[index];
    
    if (!place || !mapRef.current) {
      return;
    }

    // Extract location information - enhanced parsing
    const addressComponents = place.address_components || [];
    let city = '';
    let state = '';
    let streetNumber = '';
    let route = '';
    
    addressComponents.forEach((component) => {
      // Get street components
      if (component.types.includes('street_number')) {
        streetNumber = component.long_name;
      }
      if (component.types.includes('route')) {
        route = component.long_name;
      }
      
      // Try multiple location types for city
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (!city && component.types.includes('sublocality_level_1')) {
        city = component.long_name;
      } else if (!city && component.types.includes('administrative_area_level_2')) {
        // For places like Manhattan, NYC
        city = component.long_name;
      } else if (!city && component.types.includes('neighborhood')) {
        city = component.long_name;
      }
      
      // Get state
      if (component.types.includes('administrative_area_level_1')) {
        state = component.short_name;
      }
    });

    // Enhanced organization name parsing
    let orgName = place.name || '';
    const formattedAddress = place.formatted_address || '';
    
    // Clean up organization name
    if (orgName && formattedAddress) {
      // Remove street address from org name if it's duplicated
      const streetAddress = streetNumber && route ? `${streetNumber} ${route}` : '';
      if (streetAddress && orgName.includes(streetAddress)) {
        orgName = orgName.replace(streetAddress, '').trim();
        orgName = orgName.replace(/^[,:]?\s*/, ''); // Remove leading comma/colon if any
      }
      
      // Handle patterns like "NYC Health + Hospitals / Bellevue" or "Hospital Name: Department"
      // First, check if org name contains address components that should be removed
      const addressParts = formattedAddress.split(',').map(p => p.trim());
      
      // Remove any address parts from org name
      addressParts.forEach(part => {
        // Skip if it's the actual org name or contains department/division info
        if (part && orgName !== part && !part.match(/Department|Division|Unit|Center|Wing/i)) {
          // Check if this part is purely address (contains numbers or common street words)
          if (part.match(/^\d+/) || part.match(/\b(St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Dr|Drive|Ln|Lane|Way|Place|Pl)\b/i)) {
            orgName = orgName.replace(part, '').trim();
          }
        }
      });
      
      // Clean up any remaining formatting issues
      orgName = orgName.replace(/^[,:\-\s]+/, '').replace(/[,:\-\s]+$/, '').trim();
      
      // Handle special cases for hospitals with departments
      if (orgName.includes(':')) {
        const parts = orgName.split(':').map(p => p.trim());
        if (parts.length === 2 && !parts[1].match(/\d+/)) {
          // Keep department info if it doesn't contain numbers
          orgName = `${parts[0]}: ${parts[1]}`;
        } else {
          orgName = parts[0];
        }
      }
    }

    // Fallback: parse from formatted address if components didn't work
    if (!city && formattedAddress) {
      const parts = formattedAddress.split(',');
      if (parts.length >= 3) {
        // Extract city more carefully
        let potentialCity = parts[parts.length - 3].trim();
        
        // Remove any leading numbers or street info from potential city
        potentialCity = potentialCity.replace(/^\d+\s+/, '').replace(/^(N|S|E|W|North|South|East|West)\s+/i, '');
        
        // Check if this looks like a city name (doesn't start with number)
        if (!potentialCity.match(/^\d/) && !potentialCity.match(/\b(Street|Ave|Avenue|Rd|Road)\b/i)) {
          city = potentialCity;
        }
        
        const statePart = parts[parts.length - 2].trim();
        const stateMatch = statePart.match(/^([A-Z]{2})\s+\d{5}/);
        if (stateMatch) {
          state = stateMatch[1];
        } else {
          // Try to extract state from format like "New York NY"
          const stateOnly = statePart.match(/\b([A-Z]{2})\b/);
          if (stateOnly) {
            state = stateOnly[1];
          }
        }
      }
    }
    
    // Final cleanup - remove state code from city if present
    if (city && state) {
      city = city.replace(new RegExp(`\\s*,?\\s*${state}$`), '').trim();
    }

    setTempOrgName(orgName);
    setTempCity(city);
    setTempState(state);

    // Center map on selected place
    if (place.geometry?.location) {
      // Get lat/lng properly
      let lat: number; 
      let lng: number;
      const {location} = place.geometry;
      if (typeof location.lat === 'function') {
        lat = location.lat();
        lng = location.lng();
      } else {
        lat = location.lat as unknown as number;
        lng = location.lng as unknown as number;
      }
      
      const position = { lat, lng };
      
      // Pan to location smoothly
      mapRef.current.panTo(position);
      mapRef.current.setZoom(15);
      
      // Clear previous marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      
      // Add new marker
      const marker = new google.maps.Marker({
        position,
        map: mapRef.current,
        title: place.name,
        animation: google.maps.Animation.DROP,
      });
      
      markerRef.current = marker;
    }
  };

  const handlePlaceClick = (index: number) => {
    handlePlaceWithData(index, placesResult);
  };

  const handleSelectPlace = () => {
    if (selectedIndex === null) return;
    
    // Update form data
    updateFormData({
      organizationName: tempOrgName,
      organizationCity: tempCity,
      organizationState: tempState,
    });
    
    // Close modal
    setShowMapModal(false);
    setSelectedIndex(null);
    setPlacesResult([]);
    
    toast.success('Location selected!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleContinue = async () => {
    try {
      const payload = {
        organizationName: formData.organizationName || '',
        organizationCity: formData.organizationCity || '',
        organizationState: formData.organizationState || '',
        specialty: formData.specialty || '',
        subSpecialty: formData.subSpecialty || undefined, // Added
        // Calculate start year based on experience years (e.g.: 4 years experience = started in 2021)
        employmentStartYear: new Date().getFullYear() - (formData.experienceYears || 0),
        employmentType: formData.employmentType as EmploymentType,
        shiftType: formData.shiftType as ShiftType,
        nurseToPatientRatio: formData.nurseToPatientRatio || '',
        basePay: formData.basePay || 0,
        paymentFrequency: formData.paymentFrequency || 'hourly',
        isUnionized: formData.isUnionized || false,
        individualDifferentials: formData.individualDifferentials || [],
        differentialsFreeText: formData.differentialsFreeText || undefined,
      };
      await employmentMutation.mutateAsync(payload);
      // 성공 시 자동으로 culture 단계로 이동 (onSuccess에서 처리)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to save employment information'
      );
    }
  };

  const summaryItems = showSummary ? [
    { label: 'Organization', value: formData.organizationName || 'Not specified', icon: <Building className="w-4 h-4" /> },
    { label: 'Location', value: `${formData.organizationCity || ''}, ${formData.organizationState || ''}`.trim() || 'Not specified', icon: <MapPinned className="w-4 h-4" /> },
    { label: 'Specialty', value: formData.specialty || 'Not specified', icon: <Heart className="w-4 h-4" /> },
    { label: 'Sub-specialty', value: formData.subSpecialty || 'Not specified', icon: <Award className="w-4 h-4" /> },
    { label: 'Employment Type', value: formData.employmentType || 'Not specified', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Shift Type', value: formData.shiftType || 'Not specified', icon: <Clock className="w-4 h-4" /> },
    { label: 'Nurse-Patient Ratio', value: formData.nurseToPatientRatio || 'Not specified', icon: <Users className="w-4 h-4" /> },
    { label: 'Base Pay', value: formData.basePay ? `$${formData.basePay}/${formData.paymentFrequency === 'yearly' ? 'year' : 'hour'}` : 'Not specified', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Unionized', value: formData.isUnionized ? 'Yes' : 'No', icon: <Users className="w-4 h-4" /> },
  ] : [];

  // 차액 수당 총계 추가
  if (showSummary && formData.individualDifferentials && formData.individualDifferentials.length > 0) {
    const totals = calculateTotalDifferentials(formData.individualDifferentials);
    summaryItems.push({
      label: 'Total Differentials',
      value: `+$${totals.hourly}/hr${totals.annual > 0 ? ` + $${totals.annual}/year` : ''}`,
      icon: <DollarSign className="w-4 h-4" />
    });
  }

  if (showSummary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Excellent! Let's Review Your Details
          </h2>
          <p className="text-gray-500 text-lg">
            Take a moment to review your employment information
          </p>
        </div>

        <SummaryCard
          title="Employment Information"
          items={summaryItems}
          onEdit={(label, newValue) => {
            if (label === 'Organization') {
              updateFormData({ organizationName: newValue });
            } else if (label === 'Location') {
              const [city = '', state = ''] = newValue.split(',').map(s => s.trim());
              updateFormData({ organizationCity: city, organizationState: state });
            } else if (label === 'Specialty') {
              updateFormData({ specialty: newValue });
            } else if (label === 'Sub-specialty') {
              updateFormData({ subSpecialty: newValue });
            } else if (label === 'Employment Type') {
              updateFormData({ employmentType: newValue as EmploymentType });
            } else if (label === 'Shift Type') {
              updateFormData({ shiftType: newValue as ShiftType });
            } else if (label === 'Nurse-Patient Ratio') {
              updateFormData({ nurseToPatientRatio: newValue });
            } else if (label === 'Base Pay') {
              const match = newValue.match(/\$?(\d+(?:\.\d+)?)/);
              if (match) updateFormData({ basePay: parseFloat(match[1]) });
            }
            else if (label === 'Unionized') {
              updateFormData({ isUnionized: newValue === 'Yes' });
            }
          }}
          className="mb-8"
        />

        <div className="flex justify-between">
          <ActionButton
            onClick={() => setShowSummary(false)}
            variant="outline"
            className="px-6 py-3"
          >
            ← Edit Details
          </ActionButton>
          <ActionButton
            onClick={handleContinue}
            disabled={employmentMutation.isPending}
            className="px-8 py-3"
          >
            {employmentMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Saving...
              </span>
            ) : (
              'Continue to Next Step →'
            )}
          </ActionButton>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-8">
        <CompactStepIndicator
          steps={sections}
          currentStep={currentSection}
          onStepClick={(index) => {
            if (index < currentSection || completedSections.includes(index)) {
              setCurrentSection(index);
            }
          }}
        />
      </div>

      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <form onSubmit={handleSubmit}>
          {/* Section 1: Workplace */}
          {currentSection === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl shadow-sm p-6 space-y-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-emerald-600" />
                Tell us about your workplace
              </h3>

              {/* Organization Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Organization Name
                </label>
                <AnimatedInput
                  value={formData.organizationName || ''}
                  onChange={(value) => updateFormData({ organizationName: value })}
                  placeholder="e.g., Kaiser Permanente"
                  icon={<Building className="w-5 h-5" />}
                />
              </div>

              {/* Location with Map */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatedInput
                    value={formData.organizationCity || ''}
                    onChange={(value) => updateFormData({ organizationCity: value })}
                    placeholder="City"
                    icon={<MapPin className="w-5 h-5" />}
                  />
                  <AnimatedInput
                    value={formData.organizationState || ''}
                    onChange={(value) => updateFormData({ organizationState: value })}
                    placeholder="State (e.g., CA, Bay Area)"
                    maxLength={20}
                  />
                </div>
                
                {/* Google Maps Button */}
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowMapModal(true);
                    setSelectedIndex(null);
                    setPlacesResult([]);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 
                           text-white rounded-lg font-medium shadow-md hover:shadow-lg
                           transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Search on Google Maps
                </motion.button>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <ActionButton
                  type="button"
                  onClick={() => setStep('basicInfo')}
                  variant="outline"
                  className="px-6 py-3"
                >
                  ← Back
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={() => {
                    if (formData.organizationName && formData.organizationCity && formData.organizationState) {
                      if (!completedSections.includes(0)) {
                        setCompletedSections([...completedSections, 0]);
                      }
                      setCurrentSection(1);
                    } else {
                      toast.error('Please fill in all workplace information');
                    }
                  }}
                  className="px-6 py-3"
                >
                  Next: Your Role →
                </ActionButton>
              </div>
            </motion.div>
          )}

          {/* Section 2: Role Details */}
          {currentSection === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl shadow-sm p-6 space-y-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-emerald-600" />
                Your Role & Schedule
              </h3>

              {/* Employment Type */}
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
                      onClick={() => updateFormData({ employmentType: option.value as EmploymentType })}
                      icon={option.icon}
                    />
                  ))}
                </div>
              </div>

              {/* Shift Type */}
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
                      onClick={() => updateFormData({ shiftType: option.value as ShiftType })}
                      icon={option.icon}
                    />
                  ))}
                </div>
              </div>

              {/* Specialty Field - With Custom Input Option */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Nursing Specialty <span className="text-red-500">*</span>
                </label>
                {!showCustomSpecialty ? (
                  <>
                    <CustomDropdown
                      value={formData.specialty || ''}
                      onChange={(value) => {
                        if (value === 'Other') {
                          setShowCustomSpecialty(true);
                          setCustomSpecialty('');
                          updateFormData({ specialty: '' });
                        } else {
                          updateFormData({ specialty: value });
                        }
                      }}
                      options={NURSING_SPECIALTIES}
                      placeholder="Search or select your specialty"
                      searchable
                      className="w-full"
                      icon={<Heart className="w-5 h-5" />}
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
                        icon={<Heart className="w-5 h-5" />}
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
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-emerald-600"
                  >
                    <Check className="w-4 h-4" />
                    <span>Selected: {formData.specialty}</span>
                  </motion.div>
                )}
              </div>

              {/* Sub-specialty Field - Enhanced */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Sub-specialty or Certification <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="space-y-2">
                  <AnimatedInput
                    value={formData.subSpecialty || ''}
                    onChange={(value) => updateFormData({ subSpecialty: value })}
                    placeholder="e.g., Trauma ICU, CCRN, Pediatric Emergency"
                    icon={<Award className="w-5 h-5" />}
                  />
                  {/* Quick suggestions */}
                  <div className="flex flex-wrap gap-1">
                    {NURSING_SUB_SPECIALTIES.slice(0, 5).map((subSpec) => (
                      <motion.button
                        key={subSpec}
                        type="button"
                        onClick={() => updateFormData({ subSpecialty: subSpec })}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 py-1 text-xs bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-700 rounded-md transition-colors"
                      >
                        {subSpec}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Add any specialized area or professional certification
                </p>
              </div>

              {/* Nurse to Patient Ratio */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Typical Nurse-to-Patient Ratio
                </label>
                {formData.nurseToPatientRatio === 'Custom' ? (
                  <div className="flex gap-2 items-center">
                    <AnimatedInput
                      value={customRatio}
                      onChange={setCustomRatio}
                      placeholder="e.g., 1:10"
                      className="flex-1"
                    />
                    <ActionButton
                      type="button"
                      onClick={() => {
                        if (customRatio) {
                          updateFormData({ nurseToPatientRatio: customRatio });
                          setCustomRatio('');
                        }
                      }}
                      className="px-4 py-2"
                    >
                      Set
                    </ActionButton>
                    <ActionButton
                      type="button"
                      onClick={() => {
                        updateFormData({ nurseToPatientRatio: '' });
                        setCustomRatio('');
                      }}
                      variant="outline"
                      className="px-4 py-2"
                    >
                      Cancel
                    </ActionButton>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {nurseRatioOptions.map((ratio) => (
                      <motion.button
                        key={ratio}
                        type="button"
                        onClick={() => updateFormData({ nurseToPatientRatio: ratio })}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                          formData.nurseToPatientRatio === ratio
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {ratio === 'Custom' ? 'Other' : ratio}
                      </motion.button>
                    ))}
                  </div>
                )}
                {formData.nurseToPatientRatio && formData.nurseToPatientRatio !== 'Custom' && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-green-600 mt-2"
                  >
                    ✓ Selected: {formData.nurseToPatientRatio}
                  </motion.p>
                )}
              </div>

              {/* Navigation for Section 2 */}
              <div className="flex justify-between mt-6">
                <ActionButton
                  type="button"
                  onClick={() => setCurrentSection(0)}
                  variant="outline"
                  className="px-6 py-3"
                >
                  ← Back
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={() => {
                    if (formData.employmentType && formData.shiftType && formData.nurseToPatientRatio && formData.specialty) {
                      if (!completedSections.includes(1)) {
                        setCompletedSections([...completedSections, 1]);
                      }
                      setCurrentSection(2);
                    } else {
                      toast.error('Please complete all role information including specialty');
                    }
                  }}
                  className="px-6 py-3"
                >
                  Next: Compensation →
                </ActionButton>
              </div>
            </motion.div>
          )}

          {/* Section 3: Compensation & Extras (Combined) */}
          {currentSection === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl shadow-sm p-6 space-y-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                  className="text-2xl"
                >
                  💵
                </motion.span>
                Let's talk money & benefits
              </h3>

              {/* Base Pay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Base Pay
                  </label>
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <AnimatedInput
                        type="number"
                        value={formData.basePay?.toString() || ''}
                        onChange={(value) => updateFormData({
                          basePay: parseFloat(value) || undefined,
                        })}
                        placeholder="0.00"
                        icon={<DollarSign className="w-5 h-5" />}
                      />
                    </div>
                    <CustomDropdown
                      options={['/ hour', '/ year']}
                      value={formData.paymentFrequency === 'yearly' ? '/ year' : '/ hour'}
                      onChange={(value) => updateFormData({
                        paymentFrequency: value === '/ year' ? 'yearly' : 'hourly',
                      })}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>

              {/* Differential Pay Section - From Extras */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 space-y-4 border-2 border-green-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="text-3xl"
                    >
                      💰
                    </motion.div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Boost Your Total Compensation
                      </h4>
                      <p className="text-sm text-gray-600">
                        Add your differential pay to see your true earnings
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Optional
                  </span>
                </div>

                {/* Popular Differentials - Enhanced */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="text-lg">⚡</span> Quick select common differentials:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {POPULAR_DIFFERENTIALS.map((diffType, index) => {
                      const isAdded = formData.individualDifferentials?.some(d => d.type === diffType);
                      const isSelected = customDiff.type === diffType;
                      return (
                        <motion.button
                          key={diffType}
                          type="button"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => addPopularDifferential(diffType)}
                          className={`
                            px-4 py-3 text-sm font-medium rounded-xl transition-all
                            flex items-center justify-center gap-2
                            ${isAdded 
                              ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                              : isSelected
                                ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-400'
                                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-400 hover:bg-green-50'
                            }
                          `}
                        >
                          {isAdded && <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-green-600"
                          >✓</motion.span>}
                          {diffType}
                        </motion.button>
                      );
                    })}
                  </div>
                  {customDiff.type && POPULAR_DIFFERENTIALS.includes(customDiff.type) && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-emerald-600 flex items-center gap-1"
                    >
                      <span>💡</span> Now set the amount for {customDiff.type} below
                    </motion.p>
                  )}
                </div>

                {/* Add Differential Form */}
                <div className="space-y-4">
                  {/* Search Input */}
                  <div className="space-y-2 relative">
                    <label
                      htmlFor="differential-search-input"
                      className="block text-xs sm:text-sm font-medium text-gray-700"
                    >
                      Or search for other differentials:
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
                      className="w-full px-3 py-2 text-sm bg-white border-2 border-gray-200 rounded-xl
                               focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
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
                                className="w-full text-left px-3 sm:px-4 py-3 sm:py-2 text-base hover:bg-emerald-100 transition-colors border-b border-gray-100 last:border-b-0"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{diff.display}</span>
                                  <span className="text-xs text-gray-500">{diff.group}</span>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                  </div>

                  {/* Amount and Unit - only show when type is selected */}
                  {customDiff.type && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Setting differential for: <span className="font-semibold text-emerald-700">{customDiff.type}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomDiff({ type: '', amount: 0, unit: 'hourly' });
                            setDifferentialInput('');
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Amount
                          </label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
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
                              autoFocus
                              className="w-full px-2 py-2 pl-6 text-sm bg-white border border-gray-200 rounded-lg
                                       focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                            />
                          </div>
                        </div>

                        <CustomDropdown
                          options={['per hour', 'per year']}
                          value={customDiff.unit === 'annual' ? 'per year' : 'per hour'}
                          onChange={(value) => setCustomDiff({
                            ...customDiff,
                            unit: value === 'per year' ? 'annual' : 'hourly',
                          })}
                          className="w-28"
                        />

                        <ActionButton
                          type="button"
                          onClick={addCustomDifferential}
                          disabled={!customDiff.type || customDiff.amount <= 0}
                          className="px-4 py-2 text-sm"
                        >
                          Add
                        </ActionButton>
                      </div>
                    </motion.div>
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
                              <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full font-medium">
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
                      {formData.individualDifferentials &&
                        formData.individualDifferentials.length > 0 && (
                          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                            {(() => {
                              const totals = calculateTotalDifferentials(
                                formData.individualDifferentials
                              );
                              return (
                                <>
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium text-green-800">
                                      Total Hourly Differentials:
                                    </span>
                                    <span className="text-lg font-bold text-green-600">
                                      +${totals.hourly.toFixed(2)}/hr
                                    </span>
                                  </div>
                                  {totals.annual > 0 && (
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-green-200">
                                      <span className="font-medium text-green-800">
                                        Annual Bonuses:
                                      </span>
                                      <span className="text-lg font-bold text-green-600">
                                        +${totals.annual.toLocaleString()}/year
                                      </span>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}
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
                             focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    rows={2}
                  />
                </div>
              </motion.div>

              {/* Union Checkbox - From Extras */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ scale: formData.isUnionized ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl"
                    >
                      {formData.isUnionized ? '🤝' : '🏢'}
                    </motion.div>
                    <div>
                      <label htmlFor="isUnionized" className="text-lg font-medium text-gray-900 cursor-pointer">
                        Are you in a union?
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Union membership can affect your benefits and pay structure
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="isUnionized"
                      checked={formData.isUnionized || false}
                      onChange={(e) => updateFormData({ isUnionized: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600" />
                  </label>
                </div>
              </motion.div>

              {/* Navigation for Section 3 */}
              <div className="flex justify-between mt-6">
                <ActionButton
                  type="button"
                  onClick={() => setCurrentSection(1)}
                  variant="outline"
                  className="px-6 py-3"
                >
                  ← Back
                </ActionButton>
                <ActionButton
                  type="submit"
                  className="px-8 py-3"
                >
                  Review Everything →
                </ActionButton>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>

      {/* Google Maps Modal - Improved */}
      {showMapModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto my-8"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    🏥 Find Your Workplace
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Search for your hospital or healthcare facility
                  </p>
                </div>
                <motion.button
                  type="button"
                  onClick={() => setShowMapModal(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close map modal"
                >
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {!isLoaded ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2" />
                <p>Loading map...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Search Box */}
                <div className="p-4">
                  <StandaloneSearchBox
                  onLoad={(ref) => {
                    if (ref) {
                      searchBoxRef.current = ref;
                    }
                  }}
                  onPlacesChanged={handlePlacesChanged}
                >
                    <input
                      type="text"
                      placeholder="🔍 Search your hospital or organization"
                      className="w-full p-4 text-base border-2 border-gray-200 rounded-xl
                                 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100
                                 transition-all duration-200"
                      autoFocus
                    />
                  </StandaloneSearchBox>
                </div>

                {/* Search Results List - Enhanced */}
                {placesResult.length > 0 && (
                  <div className="mx-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2 font-medium">📍 {placesResult.length} results found:</p>
                    <div className="max-h-48 overflow-auto border-2 border-gray-200 rounded-xl p-2 bg-gray-50">
                      {placesResult.map((place, idx) => {
                      const isActive = selectedIndex === idx;
                      return (
                        <motion.button
                          key={place.place_id ? `place-${place.place_id}` : `idx-${idx}`}
                          type="button"
                          onClick={() => handlePlaceClick(idx)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`w-full text-left px-4 py-3 rounded-lg cursor-pointer mb-2 transition-all
                                     border-2 ${
                            isActive 
                              ? 'bg-emerald-100 border-emerald-400 shadow-md' 
                              : 'bg-white border-transparent hover:border-gray-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 ${
                              isActive ? 'text-emerald-600' : 'text-gray-400'
                            }`}>
                              {isActive ? '🏥' : '🏥'}
                            </div>
                            <div className="flex-1">
                              <div className="text-base font-semibold text-gray-900">
                                {place.name}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {place.formatted_address || place.vicinity}
                              </div>
                            </div>
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-green-600 mt-1"
                              >
                                ✓
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                      })}
                    </div>
                  </div>
                )}

                {/* Google Map - Enhanced */}
                <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border-2 border-gray-200">
                  <GoogleMap
                    onLoad={handleMapLoad}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={{ lat: 39.8283, lng: -98.5795 }}
                    zoom={4}
                    options={{
                      disableDefaultUI: false,
                      zoomControl: true,
                      mapTypeControl: false,
                      scaleControl: false,
                      streetViewControl: false,
                      rotateControl: false,
                      fullscreenControl: false,
                      styles: [
                        {
                          featureType: "poi.business",
                          elementType: "labels",
                          stylers: [{ visibility: "off" }]
                        }
                      ]
                    }}
                  />
                  {selectedIndex !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                    >
                      <div className="flex items-center gap-2 text-green-600 mb-2">
                        <MapPin className="w-5 h-5" />
                        <span className="font-medium">Selected Location</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {placesResult[selectedIndex]?.formatted_address}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Preview Selected Place - Enhanced */}
                {selectedIndex !== null ? (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-4 mb-4"
                  >
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                      <p className="font-semibold mb-3 text-green-800 flex items-center gap-2">
                        <span className="text-xl">✅</span> Selected Location
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Organization</p>
                          <p className="font-medium text-gray-900">{tempOrgName || 'N/A'}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">City</p>
                          <p className="font-medium text-gray-900">{tempCity || 'N/A'}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">State</p>
                          <p className="font-medium text-gray-900">{tempState || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="mx-4 mb-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <p className="text-center text-gray-500">
                      💡 Search above or click anywhere on the map to select a location
                    </p>
                  </div>
                )}

                {/* Modal Action Buttons */}
                <div className="flex justify-end gap-2 mt-2 p-4">
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
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}