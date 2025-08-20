import { useState, useCallback } from 'react';

export interface Section {
  label: string;
  isCompleted: boolean;
  isActive: boolean;
}

export const useEmploymentFlow = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  const sections: Section[] = [
    { 
      label: 'Workplace',
      isCompleted: completedSections.includes(0),
      isActive: currentSection === 0
    },
    { 
      label: 'Role',
      isCompleted: completedSections.includes(1),
      isActive: currentSection === 1
    },
    { 
      label: 'Compensation',
      isCompleted: completedSections.includes(2),
      isActive: currentSection === 2
    },
  ];

  const goToNextSection = useCallback(() => {
    if (currentSection < sections.length - 1) {
      // Mark current section as completed
      setCompletedSections(prev => 
        prev.includes(currentSection) ? prev : [...prev, currentSection]
      );
      setCurrentSection(prev => prev + 1);
    } else {
      // All sections completed, show summary
      setCompletedSections(prev => 
        prev.includes(currentSection) ? prev : [...prev, currentSection]
      );
      setShowSummary(true);
    }
  }, [currentSection, sections.length]);

  const goToPreviousSection = useCallback(() => {
    if (showSummary) {
      setShowSummary(false);
    } else if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  }, [currentSection, showSummary]);

  const goToSection = useCallback((sectionIndex: number) => {
    if (sectionIndex >= 0 && sectionIndex < sections.length) {
      setShowSummary(false);
      setCurrentSection(sectionIndex);
    }
  }, [sections.length]);

  const markSectionCompleted = useCallback((sectionIndex: number) => {
    setCompletedSections(prev => 
      prev.includes(sectionIndex) ? prev : [...prev, sectionIndex]
    );
  }, []);

  const resetFlow = useCallback(() => {
    setCurrentSection(0);
    setCompletedSections([]);
    setShowSummary(false);
  }, []);

  const isLastSection = currentSection === sections.length - 1;
  const allSectionsCompleted = sections.every(section => section.isCompleted);

  return {
    // State
    currentSection,
    completedSections,
    showSummary,
    sections,
    
    // Computed
    isLastSection,
    allSectionsCompleted,
    
    // Actions
    goToNextSection,
    goToPreviousSection,
    goToSection,
    markSectionCompleted,
    resetFlow,
  };
};