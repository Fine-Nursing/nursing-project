import { AnimatePresence, m } from 'framer-motion';
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
        className={`inline-flex items-center px-3 py-2 border border-emerald-200 rounded-xl shadow-sm text-sm font-medium text-emerald-700 bg-white/80 backdrop-blur-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 ${
          showFilter || hasActiveFilters
            ? 'border-emerald-400 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700'
            : ''
        }`}
        aria-expanded={showFilter}
        aria-haspopup="true"
      >
        <Sliders className="w-4 h-4" />
        Filter
        {hasActiveFilters && (
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
            {selectedExperience.length + (salaryRange[0] !== 300000 || salaryRange[1] !== 600000 ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Filter Dropdown */}
      <AnimatePresence>
        {showFilter && (
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute right-0 mt-2 w-[280px] sm:w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-emerald-200 dark:border-zinc-700 z-[200] max-h-[70vh] overflow-y-auto"
          >
            {/* Filter Content */}
            <div className="p-4 space-y-4">
              {/* Experience Level Filter */}
              <div>
                <label className="block text-sm font-medium text-emerald-700 dark:text-zinc-200 mb-2">
                  Experience Level
                </label>
                <div className="space-y-1">
                  {experienceOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-3 p-2.5 hover:bg-emerald-50 dark:hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedExperience.includes(option.value)}
                        onChange={() => toggleExperience(option.value)}
                        className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500 dark:text-emerald-400 dark:border-zinc-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-zinc-300">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range Filter */}
              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                <label className="block text-sm font-medium text-emerald-700 dark:text-zinc-200 mb-3">
                  Salary Range
                </label>
                <RangeSlider
                  min={minSalary}
                  max={maxSalary}
                  value={salaryRange}
                  onChange={onSalaryRangeChange}
                />
              </div>

              {/* Insights Section */}
              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800">
                <div className="text-sm text-gray-600 dark:text-zinc-400 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  {processedData.length} specialties found
                </div>
                {/* Top Paying Section */}
                {processedData.length > 0 && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 dark:from-zinc-800/50 dark:to-zinc-800/30 rounded-lg">
                    <div className="text-emerald-700 dark:text-emerald-400 font-medium text-sm mb-2">
                      Top Paying Specialties
                    </div>
                    {processedData.slice(0, 3).map((item) => (
                      <div
                        key={item.specialty}
                        className="flex justify-between text-gray-600 dark:text-zinc-400 text-sm py-1"
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
                <div className="pt-4 border-t border-emerald-100 dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => {
                      onSalaryRangeChange([minSalary, maxSalary]);
                      onExperienceChange([]);
                    }}
                    className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 py-2 px-4 rounded-lg hover:bg-emerald-50 dark:hover:bg-zinc-800/50 transition-colors font-medium"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilterSection;
