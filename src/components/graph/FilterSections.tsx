import { AnimatePresence, motion } from 'framer-motion';
import { Sliders } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { NursingSpecialty } from 'src/types/nurse';
import RangeSlider from '../slider/SalaryRangeSlider';

// components/NursingGraph/FilterSection.tsx
interface FilterSectionProps {
  salaryRange: [number, number];
  onSalaryRangeChange: (range: [number, number]) => void;
  processedData: NursingSpecialty[];
}

function FilterSection({
  salaryRange,
  onSalaryRangeChange,
  processedData,
}: FilterSectionProps) {
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFilter = () => setShowFilter(!showFilter);

  return (
    <div className="relative" ref={filterRef}>
      <button
        type="button"
        onClick={toggleFilter}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleFilter();
          }
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer ${
          showFilter || salaryRange[0] !== 300000 || salaryRange[1] !== 600000
            ? 'border-violet-500 bg-violet-50 text-violet-700'
            : 'hover:border-violet-500 text-gray-700'
        }`}
        aria-expanded={showFilter}
        aria-haspopup="true"
      >
        <Sliders size={16} />
        <span className="text-sm font-medium">Filters</span>
      </button>

      {/* Filter Dropdown */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            {/* Filter Content */}
            <div className="p-4 space-y-4">
              <RangeSlider
                min={300000}
                max={600000}
                value={salaryRange}
                onChange={onSalaryRangeChange}
              />
              {/* Insights Section */}
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Found {processedData.length} specialties in range
                </div>
                {/* Top Paying Section */}
                {processedData.length > 0 && (
                  <div className="mt-3">
                    <div className="text-violet-700 font-medium mb-2">
                      Top Paying:
                    </div>
                    {processedData.slice(0, 3).map((item) => (
                      <div
                        key={item.specialty}
                        className="flex justify-between text-gray-600"
                      >
                        <span>{item.specialty}</span>
                        <span>${(item.total / 1000).toFixed(0)}k</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilterSection;
