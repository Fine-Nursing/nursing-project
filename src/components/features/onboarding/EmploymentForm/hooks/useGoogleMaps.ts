import { useState, useRef, useCallback } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import type { GoogleMapsState } from '../types';
import { GOOGLE_MAPS_LIBRARIES } from '../constants';

export function useGoogleMaps() {
  const [googleMapsState, setGoogleMapsState] = useState<GoogleMapsState>({
    showMapModal: false,
    placesResult: [],
    selectedIndex: null,
    tempOrgName: '',
    tempCity: '',
    tempState: '',
  });

  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const handleOpenMapModal = useCallback(() => {
    setGoogleMapsState(prev => ({ ...prev, showMapModal: true }));
  }, []);

  const handleCloseMapModal = useCallback(() => {
    setGoogleMapsState(prev => ({
      ...prev,
      showMapModal: false,
      placesResult: [],
      selectedIndex: null,
      tempOrgName: '',
      tempCity: '',
      tempState: '',
    }));
  }, []);

  const handlePlacesChanged = useCallback(() => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      setGoogleMapsState(prev => ({ ...prev, placesResult: places }));
    }
  }, []);

  const handlePlaceSelect = useCallback((index: number) => {
    const place = googleMapsState.placesResult[index];
    if (place) {
      const addressComponents = place.address_components || [];
      const city = addressComponents.find(component =>
        component.types.includes('locality') ||
        component.types.includes('administrative_area_level_2')
      )?.long_name || '';
      
      const state = addressComponents.find(component =>
        component.types.includes('administrative_area_level_1')
      )?.short_name || '';

      setGoogleMapsState(prev => ({
        ...prev,
        selectedIndex: index,
        tempOrgName: place.name || '',
        tempCity: city,
        tempState: state,
      }));

      // Update map center and marker
      if (place.geometry?.location && mapRef.current) {
        const {location} = place.geometry;
        mapRef.current.setCenter(location);
        mapRef.current.setZoom(15);

        // Update marker
        if (markerRef.current) {
          markerRef.current.setPosition(location);
        } else {
          markerRef.current = new google.maps.Marker({
            position: location,
            map: mapRef.current,
            title: place.name,
          });
        }
      }
    }
  }, [googleMapsState.placesResult]);

  const confirmPlaceSelection = useCallback((updateFormData: (data: any) => void) => {
    if (googleMapsState.selectedIndex !== null) {
      updateFormData({
        organizationName: googleMapsState.tempOrgName,
        organizationCity: googleMapsState.tempCity,
        organizationState: googleMapsState.tempState,
      });
      handleCloseMapModal();
    }
  }, [googleMapsState, handleCloseMapModal]);

  return {
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
  };
}