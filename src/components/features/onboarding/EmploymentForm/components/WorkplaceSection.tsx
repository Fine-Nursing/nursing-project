import { motion } from 'framer-motion';
import { MapPin, Building2, Building } from 'lucide-react';
import { useRef, useEffect, useState, useCallback } from 'react';
import ActionButton from 'src/components/ui/button/ActionButton';
import AnimatedInput from '../../components/AnimatedInput';
import { normalizeCity } from 'src/lib/constants/cityMapping';

interface WorkplaceSectionProps {
  formData: any;
  updateFormData: (data: any) => void;
  handleNextSection: () => void;
  handlePreviousSection: () => void;
  validateWorkplaceSection: () => boolean;
  isLoaded: boolean;
}

export default function WorkplaceSection({
  formData,
  updateFormData,
  handleNextSection,
  handlePreviousSection,
  validateWorkplaceSection,
  isLoaded,
}: WorkplaceSectionProps) {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState(formData.organizationName || '');

  // Google Places Autocomplete 초기화
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    try {
      // Autocomplete 인스턴스 생성
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment'],
        fields: ['name', 'address_components', 'formatted_address'],
      });

      // 장소 선택 이벤트 리스너
      const listener = autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        
        if (place && place.address_components) {
          let rawCity = '';
          let state = '';
          let sublocality = '';
          let neighborhood = '';
          let county = '';
          
          // 주소 컴포넌트에서 모든 정보 추출
          place.address_components.forEach((component) => {
            const types = component.types;
            
            if (types.includes('locality')) {
              rawCity = component.long_name;
            }
            if (types.includes('sublocality_level_1')) {
              sublocality = component.long_name;
            }
            if (types.includes('neighborhood')) {
              neighborhood = component.long_name;
            }
            if (types.includes('administrative_area_level_2')) {
              county = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
              state = component.short_name; // 주는 짧은 이름 사용 (예: CA, NY)
            }
          });

          // normalizeCity 함수로 도시명 정규화
          const city = normalizeCity(
            rawCity || sublocality,
            state,
            neighborhood,
            county
          );
          
          // 최종 fallback: formatted_address에서 추출
          let finalCity = city;
          if (!finalCity && place.formatted_address) {
            const addressParts = place.formatted_address.split(',');
            if (addressParts.length >= 3) {
              finalCity = addressParts[addressParts.length - 2].trim();
              finalCity = finalCity.replace(/\s+[A-Z]{2}\s+\d{5}.*$/, '').trim();
            }
          }

          // 디버깅용 로그
          console.log('Google Places Data:', {
            name: place.name,
            originalCity: rawCity,
            normalizedCity: finalCity,
            state: state,
            neighborhood: neighborhood,
            county: county,
            fullAddress: place.formatted_address,
            addressComponents: place.address_components
          });
          
          // 모든 정보 한번에 업데이트
          updateFormData({
            organizationName: place.name || inputValue,
            organizationCity: finalCity,
            organizationState: state,
          });
          
          setInputValue(place.name || inputValue);
        }
      });

      // Cleanup
      return () => {
        if (listener) {
          google.maps.event.removeListener(listener);
        }
      };
    } catch (error) {
      console.warn('Google Places API not available. Manual input only.', error);
      // Billing 문제시 자동완성 없이 수동 입력만 가능
    }
  }, [isLoaded, updateFormData]);

  // 수동 입력 처리
  const handleManualInput = useCallback((value: string) => {
    setInputValue(value);
    updateFormData({ organizationName: value });
  }, [updateFormData]);

  return (
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

      {/* Organization Name with Autocomplete */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Organization Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building className="w-5 h-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => handleManualInput(e.target.value)}
            placeholder="Search for hospital or healthcare facility..."
            className="w-full pl-10 pr-3 py-3 text-gray-900 placeholder-gray-500 
                     bg-white border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                     transition-all duration-200"
          />
        </div>
        <p className="text-xs text-gray-500">
          Start typing to search for healthcare facilities
        </p>
      </div>

      {/* Location Fields */}
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
            placeholder="State (e.g., CA)"
            maxLength={20}
          />
        </div>
        {formData.organizationCity && formData.organizationState && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-emerald-600 mt-1"
          >
            ✓ Location: {formData.organizationCity}, {formData.organizationState}
          </motion.p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <ActionButton
          type="button"
          onClick={handlePreviousSection}
          variant="outline"
          className="px-6 py-3"
        >
          ← Back
        </ActionButton>
        <ActionButton
          type="button"
          onClick={handleNextSection}
          disabled={!validateWorkplaceSection()}
          className="px-6 py-3"
        >
          Next: Your Role →
        </ActionButton>
      </div>
    </motion.div>
  );
}