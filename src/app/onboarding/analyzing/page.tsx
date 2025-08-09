'use client';

import dynamic from 'next/dynamic';

const AnalyzingDataScreen = dynamic(
  () => import('src/components/onboarding/AnalyzingDataScreen'),
  { ssr: false }
);

export default function AnalyzingPage() {
  return <AnalyzingDataScreen />;
}