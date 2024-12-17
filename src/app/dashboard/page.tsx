'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import NurseBoard from 'src/components/NurseBoard';

function CompensationGraph() {
  const data = [
    { hourly: 30, concentration: 300, years: '4.8 yrs' },
    { hourly: 35, concentration: 400, years: '5.1 yrs' },
    { hourly: 40, concentration: 150, years: '4.4 yrs' },
    { hourly: 45, concentration: 50, years: '6.2 yrs' },
    { hourly: 50, concentration: 100, years: '5.0 yrs' },
    { hourly: 55, concentration: 80, years: '5.2 yrs' },
    { hourly: 60, concentration: 60, years: '4.4 yrs' },
    { hourly: 65, concentration: 40, years: '5.1 yrs' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        Compensation Distribution Analysis
      </h3>
      <AreaChart width={800} height={400} data={data}>
        <XAxis
          dataKey="hourly"
          label={{ value: 'Hourly Pay', position: 'bottom' }}
          tick={{ fill: '#64748B' }}
        />
        <YAxis
          label={{ value: 'Concentration', angle: -90, position: 'left' }}
          tick={{ fill: '#64748B' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#FFF',
            border: '1px solid #E2E8F0',
            borderRadius: '0.5rem',
          }}
        />
        <ReferenceLine
          x={42.04}
          stroke="#7C3AED"
          strokeDasharray="3 3"
          label={{
            value: 'Avg: $42.04',
            fill: '#7C3AED',
          }}
        />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="concentration"
          stroke="#7C3AED"
          fill="url(#colorGradient)"
        />
      </AreaChart>
    </div>
  );
}

function CompensationTable() {
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
          <tr>
            <td className="p-4 text-slate-900">NYU Langone</td>
            <td className="p-4 text-slate-500">—</td>
            <td className="p-4 text-slate-500">—</td>
            <td className="p-4 text-slate-500">—</td>
          </tr>
          <tr>
            <td className="p-4 text-slate-900">Columbia University Hospital</td>
            <td className="p-4 text-slate-500">—</td>
            <td className="p-4 text-slate-500">—</td>
            <td className="p-4 text-slate-500">—</td>
          </tr>
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
export default function DashboardPage() {
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
                  <a
                    href="#"
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    프로필
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    알림
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    설정
                  </a>
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
            Let's make job searching smarter.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center mx-auto">
            Start Onboarding
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </section>

        {/* Stats Section */}
        <section className="mt-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-200">
              <h3 className="text-4xl text-white font-bold mb-4">10,000+</h3>
              <p className="text-xl text-purple-100">
                Data points from verified nurses
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Median Compensation (NYC)
              </h3>
              <div className="text-4xl font-bold text-slate-900 mb-4">
                $91,456
              </div>
              <p className="text-lg text-slate-600">
                Includes base pay, differentials, and bonuses
              </p>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Compensation Growth (YoY)
              </h3>
              <div className="text-4xl font-bold text-slate-900 mb-4">4.8%</div>
              <p className="text-lg text-slate-600">
                Compared to 3.2% national average
              </p>
            </div>
          </div>
        </section>

        {/* NurseBoard */}
        <section className="mt-24">
          <NurseBoard />
        </section>
        {/* Data Visualization */}
        <section className="mt-24">
          <div className="flex space-x-4 mb-8 overflow-x-auto px-1">
            <button className="bg-purple-100 text-purple-900 px-6 py-2.5 rounded-lg font-medium hover:bg-purple-200 transition-all duration-200 shadow-sm hover:shadow whitespace-nowrap">
              Intensive Care Unit
            </button>
            <button className="bg-white hover:bg-slate-50 px-6 py-2.5 rounded-lg font-medium text-slate-600 transition-all duration-200 shadow-sm hover:shadow whitespace-nowrap">
              Emergency Room
            </button>
            {/* Other buttons remain the same... */}
          </div>
          <CompensationGraph />
          <CompensationTable />
        </section>
      </div>
    </main>
  );
}
