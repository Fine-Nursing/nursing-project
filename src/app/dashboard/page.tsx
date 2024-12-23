'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import FloatingOnboardButton from 'src/components/button/FloatingOnboardButton';
import NurseBoard from 'src/components/NurseBoard';
import type {
  CompensationDataPoint,
  HospitalCompensation,
} from 'src/types/nurse';

const CompensationGraph = dynamic(
  () => import('../../components/charts/CompensationGraph'),
  { ssr: false } // 서버사이드 렌더링 비활성화
);

interface CompensationTableProps {
  data: HospitalCompensation[];
}

function CompensationTable({ data }: CompensationTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm mt-8">
      <div className="p-6 border-b border-slate-100">
        <input
          type="text"
          placeholder="Location Search"
          className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        />
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50">
            <th className="text-left p-4 text-sm font-semibold text-slate-700">
              Hospital
            </th>
            <th className="text-left p-4 text-sm font-semibold text-slate-700">
              Specialty
            </th>
            <th className="text-left p-4 text-sm font-semibold text-slate-700">
              Years of Experience
            </th>
            <th className="text-left p-4 text-sm font-semibold text-slate-700">
              Total Compensation
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item, index) => (
            <tr key={index}>
              <td className="p-4 text-slate-900">{item.hospital}</td>
              <td className="p-4 text-slate-500">{item.specialty || '—'}</td>
              <td className="p-4 text-slate-500">
                {item.yearsOfExperience || '—'}
              </td>
              <td className="p-4 text-slate-500">
                {item.totalCompensation || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-8 text-center border-t border-slate-100 bg-slate-50">
        <p className="text-lg font-semibold text-slate-700">
          Unlock by Adding Your Salary!
        </p>
      </div>
    </div>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <a
    href={href}
    className="text-slate-600 hover:text-slate-900 transition-colors"
  >
    {children}
  </a>
);

export default function DashboardPage() {
  const compensationData: CompensationDataPoint[] = [
    { hourly: 30, concentration: 300, years: '4.8 yrs' },
    { hourly: 35, concentration: 400, years: '5.1 yrs' },
    { hourly: 40, concentration: 150, years: '4.4 yrs' },
    { hourly: 45, concentration: 50, years: '6.2 yrs' },
    { hourly: 50, concentration: 100, years: '5.0 yrs' },
    { hourly: 55, concentration: 80, years: '5.2 yrs' },
    { hourly: 60, concentration: 60, years: '4.4 yrs' },
    { hourly: 65, concentration: 40, years: '5.1 yrs' },
  ];

  const hospitalData: HospitalCompensation[] = [
    {
      hospital: 'NYU Langone',
      specialty: 'ICU',
      yearsOfExperience: '5 years',
      totalCompensation: '$85,000',
    },
    {
      hospital: 'Columbia University Hospital',
      specialty: 'Emergency',
      yearsOfExperience: '7 years',
      totalCompensation: '$92,000',
    },
  ];

  const specialties = [
    'Intensive Care Unit',
    'Emergency Room',
    'Pediatrics',
    'Surgery',
    'Oncology',
    'Cardiology',
  ];

  return (
    <main className="min-h-screen flex flex-col font-sans bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl tracking-tight font-semibold">
              <span className="text-slate-900">Nurse</span>
              <span className="text-purple-600">Insights</span>
            </div>
            <nav>
              <ul className="flex space-x-8 text-sm font-medium">
                <li>
                  <NavLink href="#">프로필</NavLink>
                </li>
                <li>
                  <NavLink href="#">알림</NavLink>
                </li>
                <li>
                  <NavLink href="#">설정</NavLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 tracking-tight">
            Own Your{' '}
            <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Worth
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            We provide the data. You make the call.
            <br />
            Let&apos;s make job searching smarter.
          </p>
          <div className="relative h-[48px] flex justify-center">
            <FloatingOnboardButton />
          </div>
        </section>
        {/* NurseBoard */}
        <section className="mt-24">
          <NurseBoard />
        </section>

        {/* Data Visualization */}
        <section className="mt-24">
          <div className="flex space-x-4 mb-8 overflow-x-auto px-1">
            {specialties.map((specialty, index) => (
              <button
                type="button"
                key={specialty}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow whitespace-nowrap ${
                  index === 0
                    ? 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                    : 'bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
          <CompensationGraph data={compensationData} />
          <CompensationTable data={hospitalData} />
        </section>
      </div>
    </main>
  );
}
