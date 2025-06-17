import { AnimatePresence, motion } from 'framer-motion';
import { Sliders } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ExperienceGroup } from 'src/types/common';
import RangeSlider from '../slider/SalaryRangeSlider';

interface FilterSectionProps {
  salaryRange: [number, number];
  onSalaryRangeChange: (range: [number, number]) => void;
  processedData: Array<{
    specialty: string;
    'Base Pay': number;
    'Differential Pay': number;
    total: number;
    state: string;
  }>;
  selectedExperience: ExperienceGroup[];
  onExperienceChange: (experience: ExperienceGroup[]) => void;
  minSalary: number;
  maxSalary: number;
}

function FilterSection({
  salaryRange,
  onSalaryRangeChange,
  processedData,
  selectedExperience,
  onExperienceChange,
  minSalary,
  maxSalary,
}: FilterSectionProps) {
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const experienceOptions: { value: ExperienceGroup; label: string }[] = [
    { value: 'beginner', label: 'Beginner (< 2 years)' },
    { value: 'junior', label: 'Junior (2-5 years)' },
    { value: 'experienced', label: 'Experienced (5-10 years)' },
    { value: 'senior', label: 'Senior (10+ years)' },
  ];

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

  const toggleExperience = (exp: ExperienceGroup) => {
    onExperienceChange(
      selectedExperience.includes(exp)
        ? selectedExperience.filter((e) => e !== exp)
        : [...selectedExperience, exp]
    );
  };

  const hasActiveFilters =
    salaryRange[0] !== 300000 ||
    salaryRange[1] !== 600000 ||
    selectedExperience.length > 0;

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
          showFilter || hasActiveFilters
            ? 'border-violet-500 bg-violet-50 text-violet-700'
            : 'hover:border-violet-500 text-gray-700'
        }`}
        aria-expanded={showFilter}
        aria-haspopup="true"
      >
        <Sliders size={16} />
        <span className="text-sm font-medium">
          Filters{' '}
          {hasActiveFilters &&
            `(${selectedExperience.length + (salaryRange[0] !== 300000 || salaryRange[1] !== 600000 ? 1 : 0)})`}
        </span>
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
              {/* Experience Level Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </h3>
                <div className="space-y-1">
                  {experienceOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedExperience.includes(option.value)}
                        onChange={() => toggleExperience(option.value)}
                        className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                      />
                      <span className="text-sm text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range Filter */}
              <div className="pt-3 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Salary Range
                </h3>
                <RangeSlider
                  min={minSalary}
                  max={maxSalary}
                  value={salaryRange}
                  onChange={onSalaryRangeChange}
                />
              </div>

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
                        className="flex justify-between text-gray-600 text-sm"
                      >
                        <span className="truncate mr-2">{item.specialty}</span>
                        <span className="font-medium">
                          ${(item.total / 1000).toFixed(0)}k
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <div className="pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      onSalaryRangeChange([minSalary, maxSalary]);
                      onExperienceChange([]);
                    }}
                    className="w-full text-center text-sm text-violet-600 hover:text-violet-700 py-1"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilterSection;
