import React from 'react';
import type { SectionNavigationProps } from '../types';

export function SectionNavigation({
  sections,
  currentSection,
  onSectionClick
}: SectionNavigationProps) {
  return (
    <div className="flex items-center space-x-4">
      {sections.map((section, index) => (
        <React.Fragment key={index}>
          <div
            className={`flex items-center space-x-2 cursor-pointer ${
              section.isActive
                ? 'text-blue-600'
                : section.isCompleted
                ? 'text-green-600'
                : 'text-gray-400'
            }`}
            onClick={() => onSectionClick(index)}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                section.isActive
                  ? 'bg-blue-600 text-white'
                  : section.isCompleted
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {section.isCompleted ? '✓' : index + 1}
            </div>
            <span className="font-medium">{section.label}</span>
          </div>
          
          {index < sections.length - 1 && (
            <div
              className={`h-px w-8 ${
                sections[index + 1].isCompleted ? 'bg-green-600' : 'bg-gray-300'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}