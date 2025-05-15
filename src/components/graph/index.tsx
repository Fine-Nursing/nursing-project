'use client';

import { useState, useMemo } from 'react';

import { nursingSpecialtyData, statesData } from 'src/api/mock-data';
import { Search, X } from 'lucide-react';

import LocationSelector from './LocationSelector';
import FilterSection from './FilterSections';
import Chart from './Chart';

export default function NursingGraph() {
  const [searchTerm, setSearchTerm] = useState('');
  const [salaryRange, setSalaryRange] = useState<[number, number]>([
    300000, 600000,
  ]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const processedData = useMemo(
    () =>
      [...nursingSpecialtyData]
        .filter((item) => {
          const matchesSearch = item.specialty
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const matchesSalary =
            item.total >= salaryRange[0] && item.total <= salaryRange[1];
          const matchesLocation =
            selectedLocations.length === 0 ||
            selectedLocations.includes(item.state);
          return matchesSearch && matchesSalary && matchesLocation;
        })
        .sort((a, b) => b.total - a.total),
    [searchTerm, salaryRange, selectedLocations]
  );

  return (
    <div className="min-h-[800px] w-full bg-white p-8 rounded-xl shadow-md">
      <div className="space-y-6 mb-8">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Nursing Specialties Explorer
          </h2>
          <p className="text-gray-500 mt-2">
            {selectedLocations.length > 0
              ? `Showing specialties in ${selectedLocations.length} selected ${
                  selectedLocations.length === 1 ? 'location' : 'locations'
                }`
              : 'All nursing specialties across locations'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-violet-500 pl-10"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <LocationSelector
              selectedLocations={selectedLocations}
              onLocationChange={setSelectedLocations}
            />
            <FilterSection
              salaryRange={salaryRange}
              onSalaryRangeChange={setSalaryRange}
              processedData={processedData}
            />
          </div>
        </div>

        {/* Selected Location Tags */}
        {selectedLocations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedLocations.map((locationCode) => {
              const state = statesData.find((s) => s.value === locationCode);
              return (
                <div
                  key={locationCode}
                  className="flex items-center gap-2 px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-sm"
                >
                  <span>{state?.label}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLocations((prev) =>
                        prev.filter((code) => code !== locationCode)
                      );
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedLocations((prev) =>
                          prev.filter((code) => code !== locationCode)
                        );
                      }
                    }}
                    aria-label={`Remove ${state?.label} filter`}
                    className="cursor-pointer hover:text-violet-900 p-0.5 flex items-center justify-center"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Chart data={processedData} />
    </div>
  );
}
