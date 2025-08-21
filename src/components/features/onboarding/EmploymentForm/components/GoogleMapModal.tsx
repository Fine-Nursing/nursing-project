import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Check } from 'lucide-react';
import { GoogleMap, StandaloneSearchBox } from '@react-google-maps/api';
import ActionButton from 'src/components/ui/button/ActionButton';
import type { GoogleMapsState } from '../types';

interface GoogleMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  googleMapsState: GoogleMapsState;
  searchBoxRef: React.MutableRefObject<google.maps.places.SearchBox | null>;
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  markerRef: React.MutableRefObject<google.maps.Marker | null>;
  handlePlacesChanged: () => void;
  handlePlaceSelect: (index: number) => void;
  confirmPlaceSelection: () => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795, // Center of US
};

export default function GoogleMapModal({
  isOpen,
  onClose,
  googleMapsState,
  searchBoxRef,
  mapRef,
  markerRef,
  handlePlacesChanged,
  handlePlaceSelect,
  confirmPlaceSelection,
}: GoogleMapModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Find Your Workplace
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <StandaloneSearchBox
                  onLoad={(ref) => (searchBoxRef.current = ref)}
                  onPlacesChanged={handlePlacesChanged}
                >
                  <input
                    type="text"
                    placeholder="Search for hospitals, clinics, or healthcare facilities..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </StandaloneSearchBox>
              </div>

              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={4}
                onLoad={(map) => { mapRef.current = map; }}
              />

              {googleMapsState.placesResult.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Search Results:</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {googleMapsState.placesResult.map((place, index) => (
                      <button
                        key={index}
                        onClick={() => handlePlaceSelect(index)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          googleMapsState.selectedIndex === index
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {place.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {place.formatted_address}
                            </div>
                          </div>
                          {googleMapsState.selectedIndex === index && (
                            <Check className="w-4 h-4 text-emerald-500 ml-auto" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {googleMapsState.selectedIndex !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-50 rounded-lg border border-emerald-200"
                >
                  <div className="flex items-center gap-2 text-emerald-700 mb-2">
                    <Check className="w-4 h-4" />
                    <span className="font-medium">Selected Workplace</span>
                  </div>
                  <div className="text-emerald-600">
                    <div className="font-medium">{googleMapsState.tempOrgName}</div>
                    <div className="text-sm">
                      {googleMapsState.tempCity}, {googleMapsState.tempState}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <ActionButton
                onClick={onClose}
                variant="outline"
                className="px-6 py-3"
              >
                Cancel
              </ActionButton>
              <ActionButton
                onClick={confirmPlaceSelection}
                disabled={googleMapsState.selectedIndex === null}
                className="px-6 py-3"
              >
                Use This Location
              </ActionButton>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}