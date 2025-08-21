import { AnimatePresence, motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { StateInfo, RegionStates } from 'src/types/location';

interface RegionSectionProps {
  region: string;
  states: StateInfo[];
  selectedLocations: string[];
  onToggleLocation: (stateCode: string) => void;
}

interface LocationSelectorProps {
  selectedLocations: string[];
  onLocationChange: (locations: string[]) => void;
  statesData?: StateInfo[] | RegionStates;
}

function RegionSection({
  region,
  states,
  selectedLocations,
  onToggleLocation,
}: RegionSectionProps) {
  return (
    <div className="mb-2 sm:mb-3 last:mb-0 p-2 sm:p-3">
      <div className="text-xs font-medium text-gray-500 mb-1">{region}</div>
      <div className="grid grid-cols-2 gap-1">
        {states.map((state) => (
          <button
            key={state.code}
            onClick={() => onToggleLocation(state.code)}
            type="button"
            aria-pressed={selectedLocations.includes(state.code)}
            className={`flex items-center justify-between p-1.5 sm:p-2 rounded-md cursor-pointer text-xs sm:text-sm transition-colors w-full
                ${
                  selectedLocations.includes(state.code)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'hover:bg-emerald-50 text-gray-700'
                }`}
          >
            <span>{state.name}</span>
            {selectedLocations.includes(state.code) && (
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function LocationSelector({
  selectedLocations,
  onLocationChange,
  statesData,
}: LocationSelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLocation = (stateCode: string) => {
    onLocationChange(
      selectedLocations.includes(stateCode)
        ? selectedLocations.filter((s) => s !== stateCode)
        : [...selectedLocations, stateCode]
    );
  };
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // statesData가 배열인지 RegionStates 객체인지 확인
  const isRegionStates = (
    data: StateInfo[] | RegionStates
  ): data is RegionStates => !Array.isArray(data);

  // 데이터가 없으면 버튼만 표시
  if (!statesData || (Array.isArray(statesData) && statesData.length === 0)) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          disabled
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border cursor-not-allowed opacity-50 text-gray-500"
        >
          <MapPin size={14} className="sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm font-medium">Loading...</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Location Selector Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        aria-expanded={showDropdown}
        aria-haspopup="true"
        aria-controls="location-dropdown"
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border cursor-pointer transition-all duration-200 ${
          showDropdown || selectedLocations.length > 0
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
            : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50 text-gray-600'
        }`}
      >
        <MapPin size={14} className="sm:w-4 sm:h-4" />
        <span className="text-xs sm:text-sm font-medium">
          {selectedLocations.length > 0
            ? `${selectedLocations.length} selected`
            : 'Location'}
        </span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 mt-2 w-[280px] sm:w-[320px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[60vh] overflow-y-auto"
          >
            {/* Dropdown Content */}
            {isRegionStates(statesData) ? (
              // RegionStates 형태일 경우
              Object.entries(statesData).map(([region, states]) => (
                <RegionSection
                  key={region}
                  region={region}
                  states={states}
                  selectedLocations={selectedLocations}
                  onToggleLocation={toggleLocation}
                />
              ))
            ) : (
              // 배열 형태일 경우 (getAllStates를 사용한 경우)
              <div className="p-3">
                <div className="grid grid-cols-2 gap-1">
                  {statesData.map((state) => (
                    <button
                      key={state.code}
                      onClick={() => toggleLocation(state.code)}
                      type="button"
                      aria-pressed={selectedLocations.includes(state.code)}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-colors w-full
                          ${
                            selectedLocations.includes(state.code)
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'hover:bg-emerald-50 text-gray-700'
                          }`}
                    >
                      <span>{state.name}</span>
                      {selectedLocations.includes(state.code) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Button */}
            {selectedLocations.length > 0 && (
              <div className="border-t p-2">
                <button
                  type="button"
                  onClick={() => onLocationChange([])}
                  className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 py-1"
                >
                  Clear all
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LocationSelector;
