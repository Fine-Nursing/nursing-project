import { motion } from 'framer-motion';
import { MapPin, Building2, Search } from 'lucide-react';
import ActionButton from 'src/components/ui/button/ActionButton';
import AnimatedInput from '../../components/AnimatedInput';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import GoogleMapModal from './GoogleMapModal';

interface WorkplaceSectionProps {
  formData: any;
  updateFormData: (data: any) => void;
  handleNextSection: () => void;
  handlePreviousSection: () => void;
  validateWorkplaceSection: () => boolean;
}

export default function WorkplaceSection({
  formData,
  updateFormData,
  handleNextSection,
  handlePreviousSection,
  validateWorkplaceSection,
}: WorkplaceSectionProps) {
  const {
    isLoaded,
    googleMapsState,
    searchBoxRef,
    mapRef,
    markerRef,
    handleOpenMapModal,
    handleCloseMapModal,
    handlePlacesChanged,
    handlePlaceSelect,
    confirmPlaceSelection,
  } = useGoogleMaps();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Building2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Where Do You Work?
        </h3>
        <p className="text-gray-600">
          Tell us about your current workplace so we can provide relevant insights
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization Name
          </label>
          <div className="relative">
            <AnimatedInput
              value={formData.organizationName || ''}
              onChange={(value) => updateFormData({ organizationName: value })}
              placeholder="e.g., Johns Hopkins Hospital"
              icon={<Building2 className="w-5 h-5" />}
            />
            {isLoaded && (
              <button
                type="button"
                onClick={handleOpenMapModal}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-emerald-500 hover:text-emerald-600 transition-colors"
                title="Search on map"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <AnimatedInput
              value={formData.organizationCity || ''}
              onChange={(value) => updateFormData({ organizationCity: value })}
              placeholder="e.g., Baltimore"
              icon={<MapPin className="w-5 h-5" />}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <AnimatedInput
              value={formData.organizationState || ''}
              onChange={(value) => updateFormData({ organizationState: value })}
              placeholder="e.g., MD"
              icon={<MapPin className="w-5 h-5" />}
              maxLength={2}
            />
          </div>
        </div>

        {formData.organizationName && formData.organizationCity && formData.organizationState && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-50 rounded-lg border border-emerald-200"
          >
            <div className="flex items-center gap-2 text-emerald-700">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">Workplace Summary</span>
            </div>
            <p className="text-emerald-600 mt-1">
              {formData.organizationName} in {formData.organizationCity}, {formData.organizationState}
            </p>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <ActionButton
          onClick={handlePreviousSection}
          variant="outline"
          className="px-6 py-3"
        >
          ← Back
        </ActionButton>
        
        <ActionButton
          onClick={handleNextSection}
          disabled={!validateWorkplaceSection()}
          className="px-6 py-3"
        >
          Next: Your Role →
        </ActionButton>
      </div>

      {/* Google Maps Modal */}
      {isLoaded && (
        <GoogleMapModal
          isOpen={googleMapsState.showMapModal}
          onClose={handleCloseMapModal}
          googleMapsState={googleMapsState}
          searchBoxRef={searchBoxRef}
          mapRef={mapRef}
          markerRef={markerRef}
          handlePlacesChanged={handlePlacesChanged}
          handlePlaceSelect={handlePlaceSelect}
          confirmPlaceSelection={() => confirmPlaceSelection(updateFormData)}
        />
      )}
    </motion.div>
  );
}