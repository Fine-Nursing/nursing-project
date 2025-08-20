import { useState, useRef, useCallback } from 'react';

export const useGoogleMapsSearch = () => {
  // Google Maps states
  const [showMapModal, setShowMapModal] = useState(false);
  const [placesResult, setPlacesResult] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // Temporary organization info (before confirmation)
  const [tempOrgName, setTempOrgName] = useState<string>('');
  const [tempCity, setTempCity] = useState<string>('');
  const [tempState, setTempState] = useState<string>('');

  // Refs for Google Maps API
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
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
            
            setTempCity(city);
            setTempState(state);
          }
        });
      }
    });
  }, []);

  const handleSearchBoxLoad = useCallback((searchBox: google.maps.places.SearchBox) => {
    searchBoxRef.current = searchBox;
  }, []);

  const handlePlacesChanged = useCallback(() => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        setPlacesResult(places);
        
        // Auto-select first result if only one
        if (places.length === 1) {
          handlePlaceSelect(0, places);
        }
      }
    }
  }, []);

  const handlePlaceSelect = useCallback((
    index: number, 
    places?: google.maps.places.PlaceResult[]
  ) => {
    const selectedPlace = places ? places[index] : placesResult[index];
    if (!selectedPlace) return;

    setSelectedIndex(index);
    setTempOrgName(selectedPlace.name || '');

    // Extract city and state from place
    let city = '';
    let state = '';

    selectedPlace.address_components?.forEach((component) => {
      if (component.types.includes('locality')) {
        city = component.long_name;
      } else if (!city && component.types.includes('administrative_area_level_2')) {
        city = component.long_name;
      }
      
      if (component.types.includes('administrative_area_level_1')) {
        state = component.short_name;
      }
    });

    setTempCity(city);
    setTempState(state);

    // Update map position and marker
    if (mapRef.current && selectedPlace.geometry?.location) {
      mapRef.current.panTo(selectedPlace.geometry.location);
      mapRef.current.setZoom(15);

      // Clear previous marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // Add new marker
      const marker = new google.maps.Marker({
        position: selectedPlace.geometry.location,
        map: mapRef.current,
        animation: google.maps.Animation.DROP,
        title: selectedPlace.name,
      });

      markerRef.current = marker;
    }
  }, [placesResult]);

  const confirmLocation = useCallback(() => {
    const locationData = {
      organizationName: tempOrgName,
      organizationCity: tempCity,
      organizationState: tempState,
    };
    
    setShowMapModal(false);
    return locationData;
  }, [tempOrgName, tempCity, tempState]);

  const clearLocation = useCallback(() => {
    setTempOrgName('');
    setTempCity('');
    setTempState('');
    setPlacesResult([]);
    setSelectedIndex(null);
    
    // Clear marker
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
  }, []);

  const openMapModal = useCallback(() => {
    setShowMapModal(true);
  }, []);

  const closeMapModal = useCallback(() => {
    setShowMapModal(false);
  }, []);

  return {
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
  };
};