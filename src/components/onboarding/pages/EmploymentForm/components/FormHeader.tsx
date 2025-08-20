import React from 'react';
import { SectionNavigation } from './SectionNavigation';
import type { SectionNavigationProps } from '../types';

interface FormHeaderProps extends SectionNavigationProps {
  title: string;
}

export function FormHeader({ title, ...navigationProps }: FormHeaderProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      
      <SectionNavigation {...navigationProps} />
    </div>
  );
}