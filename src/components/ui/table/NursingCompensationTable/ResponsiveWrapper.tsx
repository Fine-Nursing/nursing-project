'use client';

import React from 'react';

interface ResponsiveWrapperProps {
  mobileContent: React.ReactNode;
  desktopContent: React.ReactNode;
}

export default function ResponsiveWrapper({ mobileContent, desktopContent }: ResponsiveWrapperProps) {
  return (
    <>
      {/* Mobile View - CSS로 제어 */}
      <div className="block md:hidden w-full max-w-full overflow-hidden">
        {mobileContent}
      </div>
      
      {/* Desktop View - CSS로 제어 */}
      <div className="hidden md:block">
        {desktopContent}
      </div>
    </>
  );
}