'use client';

import { ResponsiveBar } from '@nivo/bar';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sliders,
  Search,
  MapPin,
  DollarSign,
  X,
  ChevronDown,
  Settings2,
} from 'lucide-react';
import SalaryRangeSlider from '../slider/SalaryRangeSlider';

type Region = 'Northeast' | 'South' | 'Midwest' | 'West';

type NursingSpecialty = {
  specialty: string;
  'Base Pay': number;
  'Differential Pay': number;
  total: number;
  state: string;
};

type State = {
  value: string;
  label: string;
  region: Region;
  avgSalary: number;
};

type RegionGroup = {
  [key in Region]: State[];
};

// States data with improved typing
const states: State[] = [
  { value: 'AL', label: 'Alabama', region: 'South', avgSalary: 440000 },
  { value: 'AK', label: 'Alaska', region: 'West', avgSalary: 495000 },
  { value: 'AZ', label: 'Arizona', region: 'West', avgSalary: 455000 },
  { value: 'AR', label: 'Arkansas', region: 'South', avgSalary: 435000 },
  { value: 'CA', label: 'California', region: 'West', avgSalary: 490000 },
  { value: 'CO', label: 'Colorado', region: 'West', avgSalary: 460000 },
  { value: 'CT', label: 'Connecticut', region: 'Northeast', avgSalary: 475000 },
  { value: 'DE', label: 'Delaware', region: 'South', avgSalary: 455000 },
  { value: 'FL', label: 'Florida', region: 'South', avgSalary: 455000 },
  { value: 'GA', label: 'Georgia', region: 'South', avgSalary: 450000 },
  { value: 'HI', label: 'Hawaii', region: 'West', avgSalary: 485000 },
  { value: 'ID', label: 'Idaho', region: 'West', avgSalary: 445000 },
  { value: 'IL', label: 'Illinois', region: 'Midwest', avgSalary: 450000 },
  { value: 'IN', label: 'Indiana', region: 'Midwest', avgSalary: 440000 },
  { value: 'IA', label: 'Iowa', region: 'Midwest', avgSalary: 435000 },
  { value: 'KS', label: 'Kansas', region: 'Midwest', avgSalary: 440000 },
  { value: 'KY', label: 'Kentucky', region: 'South', avgSalary: 435000 },
  { value: 'LA', label: 'Louisiana', region: 'South', avgSalary: 440000 },
  { value: 'ME', label: 'Maine', region: 'Northeast', avgSalary: 445000 },
  { value: 'MD', label: 'Maryland', region: 'South', avgSalary: 465000 },
  {
    value: 'MA',
    label: 'Massachusetts',
    region: 'Northeast',
    avgSalary: 470000,
  },
  { value: 'MI', label: 'Michigan', region: 'Midwest', avgSalary: 445000 },
  { value: 'MN', label: 'Minnesota', region: 'Midwest', avgSalary: 455000 },
  { value: 'MS', label: 'Mississippi', region: 'South', avgSalary: 435000 },
  { value: 'MO', label: 'Missouri', region: 'Midwest', avgSalary: 440000 },
  { value: 'MT', label: 'Montana', region: 'West', avgSalary: 445000 },
  { value: 'NE', label: 'Nebraska', region: 'Midwest', avgSalary: 440000 },
  { value: 'NV', label: 'Nevada', region: 'West', avgSalary: 460000 },
  {
    value: 'NH',
    label: 'New Hampshire',
    region: 'Northeast',
    avgSalary: 455000,
  },
  { value: 'NJ', label: 'New Jersey', region: 'Northeast', avgSalary: 475000 },
  { value: 'NM', label: 'New Mexico', region: 'West', avgSalary: 445000 },
  { value: 'NY', label: 'New York', region: 'Northeast', avgSalary: 485000 },
  { value: 'NC', label: 'North Carolina', region: 'South', avgSalary: 445000 },
  { value: 'ND', label: 'North Dakota', region: 'Midwest', avgSalary: 440000 },
  { value: 'OH', label: 'Ohio', region: 'Midwest', avgSalary: 445000 },
  { value: 'OK', label: 'Oklahoma', region: 'South', avgSalary: 440000 },
  { value: 'OR', label: 'Oregon', region: 'West', avgSalary: 465000 },
  {
    value: 'PA',
    label: 'Pennsylvania',
    region: 'Northeast',
    avgSalary: 460000,
  },
  {
    value: 'RI',
    label: 'Rhode Island',
    region: 'Northeast',
    avgSalary: 465000,
  },
  { value: 'SC', label: 'South Carolina', region: 'South', avgSalary: 440000 },
  { value: 'SD', label: 'South Dakota', region: 'Midwest', avgSalary: 435000 },
  { value: 'TN', label: 'Tennessee', region: 'South', avgSalary: 440000 },
  { value: 'TX', label: 'Texas', region: 'South', avgSalary: 460000 },
  { value: 'UT', label: 'Utah', region: 'West', avgSalary: 450000 },
  { value: 'VT', label: 'Vermont', region: 'Northeast', avgSalary: 450000 },
  { value: 'VA', label: 'Virginia', region: 'South', avgSalary: 455000 },
  { value: 'WA', label: 'Washington', region: 'West', avgSalary: 475000 },
  { value: 'WV', label: 'West Virginia', region: 'South', avgSalary: 435000 },
  { value: 'WI', label: 'Wisconsin', region: 'Midwest', avgSalary: 445000 },
  { value: 'WY', label: 'Wyoming', region: 'West', avgSalary: 445000 },
].sort((a, b) => a.label.localeCompare(b.label));

// Existing nursing data...
const data: NursingSpecialty[] = [
  {
    specialty: 'Travel Nursing',
    'Base Pay': 450000,
    'Differential Pay': 90000,
    total: 540000,
    state: 'CA',
  },
  {
    specialty: 'Labor & Delivery',
    'Base Pay': 440000,
    'Differential Pay': 85000,
    total: 525000,
    state: 'NY',
  },
  {
    specialty: 'Intensive Care Unit (ICU)',
    'Base Pay': 435000,
    'Differential Pay': 85000,
    total: 520000,
    state: 'CA',
  },
  {
    specialty: 'Psychiatric',
    'Base Pay': 420000,
    'Differential Pay': 80000,
    total: 500000,
    state: 'WA',
  },
  {
    specialty: 'Cardiology',
    'Base Pay': 425000,
    'Differential Pay': 75000,
    total: 500000,
    state: 'MA',
  },
  {
    specialty: 'Telemetry',
    'Base Pay': 410000,
    'Differential Pay': 80000,
    total: 490000,
    state: 'TX',
  },
  {
    specialty: 'Orthopedics',
    'Base Pay': 405000,
    'Differential Pay': 80000,
    total: 485000,
    state: 'FL',
  },
  {
    specialty: 'Oncology',
    'Base Pay': 405000,
    'Differential Pay': 80000,
    total: 485000,
    state: 'IL',
  },
  {
    specialty: 'Emergency Room (ER)',
    'Base Pay': 405000,
    'Differential Pay': 80000,
    total: 485000,
    state: 'NY',
  },
  {
    specialty: 'Dialysis',
    'Base Pay': 390000,
    'Differential Pay': 80000,
    total: 470000,
    state: 'CA',
  },
  {
    specialty: 'Surgery',
    'Base Pay': 380000,
    'Differential Pay': 80000,
    total: 460000,
    state: 'TX',
  },
  {
    specialty: 'Operating Room (OR)',
    'Base Pay': 370000,
    'Differential Pay': 80000,
    total: 450000,
    state: 'FL',
  },
  {
    specialty: 'Critical Care',
    'Base Pay': 370000,
    'Differential Pay': 80000,
    total: 450000,
    state: 'CA',
  },
  {
    specialty: 'Neonatal',
    'Base Pay': 355000,
    'Differential Pay': 80000,
    total: 435000,
    state: 'NY',
  },
  {
    specialty: 'Rehabilitation',
    'Base Pay': 340000,
    'Differential Pay': 80000,
    total: 420000,
    state: 'IL',
  },
  {
    specialty: 'Pediatrics',
    'Base Pay': 340000,
    'Differential Pay': 80000,
    total: 420000,
    state: 'CA',
  },
  {
    specialty: 'Home Health',
    'Base Pay': 335000,
    'Differential Pay': 70000,
    total: 405000,
    state: 'TX',
  },
  {
    specialty: 'Geriatrics',
    'Base Pay': 320000,
    'Differential Pay': 70000,
    total: 390000,
    state: 'FL',
  },
  {
    specialty: 'School Nurse',
    'Base Pay': 310000,
    'Differential Pay': 70000,
    total: 380000,
    state: 'NY',
  },
  {
    specialty: 'Nurse Educator',
    'Base Pay': 300000,
    'Differential Pay': 65000,
    total: 365000,
    state: 'CA',
  },
].sort((a, b) => b.total - a.total);

// 지역별 그룹화
const regionGroups = {
  Northeast: states.filter((state) => state.region === 'Northeast'),
  South: states.filter((state) => state.region === 'South'),
  Midwest: states.filter((state) => state.region === 'Midwest'),
  West: states.filter((state) => state.region === 'West'),
};

// Utility functions for data processing
const getStateData = (stateCode: string) => {
  const stateSpecialties = specialties.filter(
    (item) => item.state === stateCode
  );
  const stateInfo = states.find((state) => state.value === stateCode);

  return {
    specialties: stateSpecialties,
    averageSalary: stateInfo?.avgSalary || 0,
    totalSpecialties: stateSpecialties.length,
    highestPaying: stateSpecialties.sort((a, b) => b.total - a.total)[0],
  };
};

const getRegionData = (region: Region) => {
  const regionStates = states.filter((state) => state.region === region);
  const stateSpecialties = specialties.filter((item) =>
    regionStates.some((state) => state.value === item.state)
  );

  return {
    states: regionStates,
    specialties: stateSpecialties,
    averageSalary: Math.round(
      regionStates.reduce((sum, state) => sum + state.avgSalary, 0) /
        regionStates.length
    ),
    totalSpecialties: stateSpecialties.length,
  };
};
function CustomTooltip({ id, value, color, indexValue, data }) {
  return (
    <div className="bg-white p-4 shadow-xl rounded-lg border border-gray-100">
      <div className="font-semibold text-lg mb-2">{indexValue}</div>
      <div
        style={{ color }}
        className="flex items-center justify-between text-base"
      >
        <span>{id}:</span>
        <span className="ml-4 font-medium">
          ${new Intl.NumberFormat().format(value)}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t">
        <div className="font-semibold text-gray-700 text-base">
          Total: ${new Intl.NumberFormat().format(data.total)}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Location: {states.find((s) => s.value === data.state)?.label}
        </div>
      </div>
    </div>
  );
}
const getTopSpecialtiesByLocation = (stateCodes: string[]) =>
  specialties
    .filter((item) => stateCodes.includes(item.state))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

// Helper Functions
const getSimilarStates = (stateCode: string) => {
  const currentState = states.find((s) => s.value === stateCode);
  if (!currentState) return [];

  return states
    .filter(
      (s) =>
        s.region === currentState.region &&
        s.value !== stateCode &&
        Math.abs(s.avgSalary - currentState.avgSalary) < 30000
    )
    .slice(0, 3);
};

const calculateAverageSalaryDiff = (selectedStates: string[]) => {
  if (selectedStates.length < 2) return 0;

  const salaries = selectedStates.map(
    (code) => states.find((s) => s.value === code)?.avgSalary ?? 0
  );

  const maxSalary = Math.max(...salaries);
  const minSalary = Math.min(...salaries);

  return ((maxSalary - minSalary) / 1000).toFixed(0);
};

export default function NursingGraph() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([
    300000, 600000,
  ]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const filterRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Process data based on filters
  const processedData = [...data]
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
    .sort((a, b) => b.total - a.total);

  // Location handling
  const toggleLocation = (stateCode: string) => {
    setSelectedLocations((prev) =>
      prev.includes(stateCode)
        ? prev.filter((s) => s !== stateCode)
        : [...prev, stateCode]
    );
  };

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilter(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-[800px] w-full bg-white p-8 rounded-xl shadow-md">
      {/* Header & Controls */}
      <div className="space-y-6 mb-8">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Nursing Specialties Explorer
          </h2>
          <p className="text-gray-500 mt-2">
            {selectedLocations.length > 0
              ? `Showing specialties in ${selectedLocations.length} selected ${selectedLocations.length === 1 ? 'location' : 'locations'}`
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
            {/* Location Selector */}
            <div className="relative" ref={locationDropdownRef}>
              <div
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors
                  ${
                    showLocationDropdown || selectedLocations.length > 0
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'hover:border-violet-500 text-gray-700'
                  }`}
              >
                <MapPin size={16} />
                <span className="text-sm font-medium">
                  {selectedLocations.length > 0
                    ? `${selectedLocations.length} selected`
                    : 'Location'}
                </span>
              </div>

              {/* Location Selector Dropdown */}
              <AnimatePresence>
                {showLocationDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-[320px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[380px] flex flex-col"
                  >
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-3">
                        {Object.entries(regionGroups).map(
                          ([region, states]) => (
                            <div key={region} className="mb-3 last:mb-0">
                              <div className="text-xs font-medium text-gray-500 mb-1">
                                {region}
                              </div>
                              <div className="grid grid-cols-2 gap-1">
                                {states.map((state) => (
                                  <div
                                    key={state.value}
                                    onClick={() => toggleLocation(state.value)}
                                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-colors
                      ${
                        selectedLocations.includes(state.value)
                          ? 'bg-violet-50 text-violet-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                                  >
                                    <span>{state.label}</span>
                                    {selectedLocations.includes(
                                      state.value
                                    ) && (
                                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Fixed Footer */}
                    {selectedLocations.length > 0 && (
                      <div className="border-t p-2 bg-white rounded-b-lg">
                        <div
                          onClick={() => setSelectedLocations([])}
                          className="text-center text-sm text-violet-600 hover:text-violet-700 cursor-pointer py-1"
                        >
                          Clear all
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filter Button */}
            <div className="relative" ref={filterRef}>
              <div
                onClick={() => setShowFilter(!showFilter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors
                  ${
                    showFilter ||
                    salaryRange[0] !== 300000 ||
                    salaryRange[1] !== 600000
                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                      : 'hover:border-violet-500 text-gray-700'
                  }`}
              >
                <Sliders size={16} />
                <span className="text-sm font-medium">Filters</span>
              </div>

              <AnimatePresence>
                {showFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  >
                    <div className="p-4">
                      <div className="space-y-4">
                        {/* Salary Range */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <DollarSign
                                size={15}
                                className="text-violet-600"
                              />
                              <span className="font-medium text-sm text-gray-700">
                                Salary Range
                              </span>
                            </div>
                            <div
                              onClick={() => setSalaryRange([300000, 600000])}
                              className="text-xs text-violet-600 hover:text-violet-700 font-medium cursor-pointer"
                            >
                              Reset
                            </div>
                          </div>
                          <SalaryRangeSlider
                            min={300000}
                            max={600000}
                            value={salaryRange}
                            onChange={setSalaryRange}
                          />
                        </div>

                        {/* AI Insights */}
                        <div className="pt-4 border-t">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-violet-500 rounded-full" />
                            <span className="font-medium text-sm text-violet-900">
                              AI Insights
                            </span>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                            <div className="text-sm text-gray-600">
                              Found {processedData.length} specialties in range
                              ${(salaryRange[0] / 1000).toFixed(0)}k - $
                              {(salaryRange[1] / 1000).toFixed(0)}k
                            </div>
                            {processedData.length > 0 && (
                              <div className="text-sm">
                                <div className="text-violet-700 font-medium mb-2">
                                  Top Paying:
                                </div>
                                <div className="space-y-1">
                                  {processedData.slice(0, 3).map((item) => (
                                    <div
                                      key={item.specialty}
                                      className="flex justify-between text-gray-600"
                                    >
                                      <span>{item.specialty}</span>
                                      <span>
                                        ${(item.total / 1000).toFixed(0)}k
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Selected Locations Tags */}
        {selectedLocations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedLocations.map((locationCode) => {
              const state = states.find((s) => s.value === locationCode);
              return (
                <div
                  key={locationCode}
                  className="flex items-center gap-2 px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-sm"
                >
                  <span>{state?.label}</span>
                  <div
                    onClick={() => toggleLocation(locationCode)}
                    className="cursor-pointer hover:text-violet-900"
                  >
                    <X size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-[600px]">
        <ResponsiveBar
          data={processedData}
          keys={['Base Pay', 'Differential Pay']}
          indexBy="specialty"
          groupMode="stacked"
          layout="vertical"
          // 여백 증가로 텍스트 겹침 방지
          margin={{ top: 50, right: 160, bottom: 120, left: 120 }} // left 여백 증가
          // 바 두께 증가
          padding={0.4}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={({ id }) =>
            id === 'Base Pay' ? 'rgb(109, 40, 217)' : 'rgb(192, 132, 252)'
          }
          borderRadius={4}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 12,
            tickRotation: -35,
            legend: 'Nursing Specialties',
            legendPosition: 'middle',
            legendOffset: 90, // 아래쪽 여백 증가
            legendFontSize: 14, // 폰트 크기 증가
            renderTick: ({ value, x, y }) => (
              <g transform={`translate(${x},${y})`}>
                <text
                  x={0}
                  y={0}
                  dy={16}
                  transform="rotate(-35)"
                  textAnchor="end"
                  className="fill-gray-600 text-[13px] font-medium"
                >
                  {value}
                </text>
              </g>
            ),
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 12,
            tickRotation: 0,
            legend: 'Annual Compensation ($)',
            legendPosition: 'middle',
            legendOffset: -90, // 왼쪽 여백 증가
            format: (value) => `$${value / 1000}k`,
            renderTick: ({ value, x, y }) => (
              <g transform={`translate(${x},${y})`}>
                <text
                  x={-12}
                  y={0}
                  textAnchor="end"
                  className="fill-gray-600 text-[13px] font-medium"
                >
                  ${value / 1000}k
                </text>
              </g>
            ),
          }}
          theme={{
            axis: {
              legend: {
                text: {
                  fontSize: 14,
                  fontWeight: 600,
                  fill: '#1F2937', // 더 진한 색상
                },
              },
            },
          }}
          enableGridY
          enableGridX={false}
          gridYValues={6}
          animate
          motionConfig="gentle"
          // 범례 스타일 개선
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'top-right',
              direction: 'column',
              justify: false,
              translateX: 140,
              translateY: 0,
              itemsSpacing: 6,
              itemWidth: 140,
              itemHeight: 24,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              itemTextColor: '#4B5563',
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          // 툴팁 스타일도 개선
          tooltip={CustomTooltip}
        />
      </div>
    </div>
  );
}
