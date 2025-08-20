import React from 'react';
import { GoogleMap, LoadScript, StandaloneSearchBox, Marker } from '@react-google-maps/api';
import { useGoogleMapsSearch } from '../hooks/useGoogleMapsSearch';

interface WorkplaceLocationPickerProps {
  onLocationConfirmed: (locationData: {
    organizationName: string;
    organizationCity: string;
    organizationState: string;
  }) => void;
  initialValues?: {
    organizationName: string;
    organizationCity: string;
    organizationState: string;
  };
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795, // Center of US
};

const libraries: ("places")[] = ["places"];

export const WorkplaceLocationPicker: React.FC<WorkplaceLocationPickerProps> = ({
  onLocationConfirmed,
  initialValues
}) => {
  const {
    // State
    showMapModal,
    placesResult,
    selectedIndex,
    tempOrgName,
    tempCity,
    tempState,
    
    // Refs
    searchBoxRef,
    mapRef,
    markerRef,
    
    // Actions
    handleMapLoad,
    handleSearchBoxLoad,
    handlePlacesChanged,
    handlePlaceSelect,
    confirmLocation,
    clearLocation,
    openMapModal,
    closeMapModal,
    
    // Setters for manual input
    setTempOrgName,
    setTempCity,
    setTempState,
  } = useGoogleMapsSearch();

  React.useEffect(() => {
    if (initialValues) {
      setTempOrgName(initialValues.organizationName);
      setTempCity(initialValues.organizationCity);
      setTempState(initialValues.organizationState);
    }
  }, [initialValues, setTempOrgName, setTempCity, setTempState]);

  const handleConfirmLocation = () => {
    const locationData = confirmLocation();
    onLocationConfirmed(locationData);
  };

  const handleClearLocation = () => {
    clearLocation();
    onLocationConfirmed({
      organizationName: '',
      organizationCity: '',
      organizationState: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Location Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-900 mb-3">
          Workplace Location
        </h3>
        
        {tempOrgName || tempCity || tempState ? (
          <div className="space-y-2">
            {tempOrgName && (
              <div>
                <span className="text-sm font-medium text-blue-800">Organization:</span>
                <span className="ml-2 text-blue-700">{tempOrgName}</span>
              </div>
            )}
            {(tempCity || tempState) && (
              <div>
                <span className="text-sm font-medium text-blue-800">Location:</span>
                <span className="ml-2 text-blue-700">
                  {tempCity}{tempCity && tempState && ', '}{tempState}
                </span>
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleConfirmLocation}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Confirm Location
              </button>
              <button
                onClick={handleClearLocation}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Clear Location
              </button>
            </div>
          </div>
        ) : (
          <p className="text-blue-700">No location selected</p>
        )}
      </div>

      {/* Manual Input Section */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">
          Manual Input (Optional)
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              value={tempOrgName}
              onChange={(e) => setTempOrgName(e.target.value)}
              placeholder="Enter organization name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={tempCity}
              onChange={(e) => setTempCity(e.target.value)}
              placeholder="Enter city"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              type="text"
              value={tempState}
              onChange={(e) => setTempState(e.target.value)}
              placeholder="Enter state"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Map Search Button */}
      <div className="text-center">
        <button
          onClick={openMapModal}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Search on Map
        </button>
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Search Workplace Location
                </h3>
                <button
                  onClick={closeMapModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <LoadScript 
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
                libraries={libraries}
              >
                <div className="mb-4">
                  <StandaloneSearchBox
                    onLoad={handleSearchBoxLoad}
                    onPlacesChanged={handlePlacesChanged}
                  >
                    <input
                      type="text"
                      placeholder="Search for hospitals, clinics, or healthcare facilities"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </StandaloneSearchBox>
                </div>

                {/* Search Results */}
                {placesResult.length > 0 && (
                  <div className="mb-4 max-h-32 overflow-y-auto">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Search Results:</h4>
                    <div className="space-y-1">
                      {placesResult.map((place, index) => (
                        <button
                          key={index}
                          onClick={() => handlePlaceSelect(index)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedIndex === index
                              ? 'bg-blue-100 text-blue-800'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="font-medium">{place.name}</div>
                          <div className="text-gray-600">{place.formatted_address}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={defaultCenter}
                  zoom={4}
                  onLoad={handleMapLoad}
                >
                  {/* Marker will be added by the hook */}
                </GoogleMap>
              </LoadScript>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeMapModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={!tempOrgName && !tempCity}
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};