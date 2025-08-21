'use client';

import { HeaderSection } from './components/HeaderSection';
import { StatsSection } from './components/StatsSection';
import { MiniBarChart } from './components/MiniBarChart';
import { SpecialtyListItem } from './components/SpecialtyListItem';
import { DetailModal } from './components/DetailModal';
import { useSpecialtyData } from './hooks/useSpecialtyData';

export default function MobileNursingGraph() {
  const {
    searchTerm,
    setSearchTerm,
    selectedExperience,
    setSelectedExperience,
    selectedSpecialty,
    setSelectedSpecialty,
    viewMode,
    setViewMode,
    isLoading,
    sortedSpecialties,
    stats,
    selectedSpecialtyData,
  } = useSpecialtyData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-white dark:bg-zinc-900 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <HeaderSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedExperience={selectedExperience}
        onExperienceChange={setSelectedExperience}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      <StatsSection stats={stats} />
      
      {/* Content Area */}
      <div className="bg-white dark:bg-zinc-900 rounded-t-2xl min-h-screen">
        {viewMode === 'list' ? (
          // List View
          <div>
            {sortedSpecialties.map((item, index) => (
              <SpecialtyListItem
                key={item.specialty}
                specialty={item.specialty}
                data={item.data}
                rank={index + 1}
                onClick={() => setSelectedSpecialty(item.specialty)}
                isSelected={selectedSpecialty === item.specialty}
              />
            ))}
          </div>
        ) : (
          // Chart View
          <div className="p-4 space-y-3">
            {sortedSpecialties.map((item, index) => (
              <MiniBarChart
                key={item.specialty}
                value={item.avgCompensation}
                maxValue={stats?.max || 100}
                label={item.specialty.slice(0, 3).toUpperCase()}
                highlighted={index < 3}
              />
            ))}
          </div>
        )}
      </div>
      
      <DetailModal
        selectedSpecialty={selectedSpecialty}
        selectedSpecialtyData={selectedSpecialtyData}
        onClose={() => setSelectedSpecialty(null)}
      />
    </div>
  );
}