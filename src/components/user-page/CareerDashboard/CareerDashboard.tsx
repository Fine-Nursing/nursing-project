// components/CareerDashboard/CareerDashboard.tsx

'use client';

import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { Clipboard } from 'lucide-react';
import type { TooltipProps } from 'recharts';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import type { CareerItem, NewItemInput } from './types';
import AiRoleModal from './AiRoleModal';
import SalaryTrendModal from './SalaryTrendModal';
import ProgressionBarChart from './ProgressionBarChart';
import CareerForm from './CareerForm';
import CareerHistoryList from './CareerHistoryList';

/** ★ (A) 커스텀 툴팁 컴포넌트: 렌더 밖에 정의하여 ESLint 경고 해결 */
function CustomLineTooltip({ active, payload }: TooltipProps<any, any>) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-white border border-teal-100 text-gray-700 p-2 rounded-xl shadow-sm text-xs">
      <div className="font-bold text-teal-600">
        {data.role} {data.specialty && `(${data.specialty})`}
      </div>
      <div className="mb-1">{data.facility}</div>
      <div className="text-sm text-gray-600">
        Start: {data.startDate ? dayjs(data.startDate).format('MMM YYYY') : ''}
        <br />
        End: {data.endDate ? dayjs(data.endDate).format('MMM YYYY') : 'Now'}
      </div>
      <div className="font-medium text-teal-700 mt-1">
        ${data.hourlyRate.toFixed(2)}/hr
      </div>
    </div>
  );
}

export default function CareerDashboard() {
  /** 1) CAREER HISTORY STATE */
  const [careerData, setCareerData] = useState<CareerItem[]>([
    {
      id: 1,
      facility: 'City Hospital',
      role: 'RN',
      specialty: 'MedSurg',
      startDate: new Date('2019-01-01'),
      endDate: new Date('2021-05-01'),
      hourlyRate: 32.0,
    },
    {
      id: 2,
      facility: 'General Medical Center',
      role: 'Charge Nurse',
      specialty: 'ER',
      startDate: new Date('2021-06-01'),
      endDate: null,
      hourlyRate: 42.0,
    },
  ]);

  const [newItem, setNewItem] = useState<NewItemInput>({
    facility: '',
    role: '',
    specialty: '',
    startDate: new Date(),
    endDate: null,
    hourlyRate: '',
  });

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeStartDate = (date: Date | null) => {
    setNewItem((prev) => ({ ...prev, startDate: date }));
  };
  const handleChangeEndDate = (date: Date | null) => {
    setNewItem((prev) => ({ ...prev, endDate: date }));
  };

  const handleAdd = () => {
    if (!newItem.facility || !newItem.role) {
      alert('Facility & Role are required!');
      return;
    }
    const nextId = careerData.length
      ? Math.max(...careerData.map((d) => d.id)) + 1
      : 1;
    setCareerData((prev) => [
      ...prev,
      {
        id: nextId,
        facility: newItem.facility,
        role: newItem.role,
        specialty: newItem.specialty,
        startDate: newItem.startDate || new Date(),
        endDate: newItem.endDate || null,
        hourlyRate: parseFloat(newItem.hourlyRate || '0'),
      },
    ]);
    // reset
    setNewItem({
      facility: '',
      role: '',
      specialty: '',
      startDate: new Date(),
      endDate: null,
      hourlyRate: '',
    });
  };

  const handleDelete = (id: number) => {
    setCareerData((prev) => prev.filter((item) => item.id !== id));
  };

  /** 2) AI ROLE SUGGESTION / SALARY TREND MODALS */
  const [aiReason, setAiReason] = useState<string | null>(null);
  function getAiRoleRecommendation() {
    const roles = ['RN', 'Charge Nurse', 'NP', 'Clinical Nurse Educator'];
    const specs = ['ER', 'ICU', 'Pediatrics', 'Oncology'];
    const reasons = [
      'Leadership potential in the ER',
      'ICU expansion soon',
      'Peds synergy for advanced practice',
      'Oncology is growing fast here',
    ];
    const rRole = roles[Math.floor(Math.random() * roles.length)];
    const rSpec = specs[Math.floor(Math.random() * specs.length)];
    const rReason = reasons[Math.floor(Math.random() * reasons.length)];
    return { role: rRole, specialty: rSpec, reason: rReason };
  }
  const handleAiSuggest = () => {
    const { role, specialty, reason } = getAiRoleRecommendation();
    setNewItem((prev) => ({ ...prev, role, specialty }));
    setAiReason(reason);
  };
  const handleCloseAiModal = () => setAiReason(null);

  // SALARY TREND
  const [showTrend, setShowTrend] = useState(false);
  const [trendData, setTrendData] = useState<
    { month: string; hourlyRate: number }[]
  >([]);
  function getAiSalaryTrend() {
    const data = [];
    let base = 35 + Math.random() * 5;
    for (let i = 0; i < 6; i += 1) {
      base += Math.random() * 1.5;
      data.push({
        month: dayjs().add(i, 'month').format('MMM YYYY'),
        hourlyRate: +base.toFixed(2),
      });
    }
    return data;
  }
  const handleSalaryTrend = () => {
    setTrendData(getAiSalaryTrend());
    setShowTrend(true);
  };
  const handleCloseTrend = () => setShowTrend(false);

  /** 3) LINE CHART: CAREER HISTORY Over Time */
  const lineData = careerData
    .sort(
      (a, b) => (a.startDate?.getTime() || 0) - (b.startDate?.getTime() || 0)
    )
    .map((item) => ({
      ...item,
      xLabel: item.startDate ? dayjs(item.startDate).format('MMM YYYY') : '',
    }));

  return (
    <div className="bg-white min-h-screen p-6">
      <AiRoleModal reason={aiReason} onClose={handleCloseAiModal} />
      <SalaryTrendModal
        visible={showTrend}
        data={trendData}
        onClose={handleCloseTrend}
      />

      {/* Header */}
      <div className="flex items-center mb-4">
        <Clipboard className="text-teal-500 w-6 h-6 mr-2" />
        <h2 className="text-2xl font-bold text-teal-700">
          My Career Dashboard
        </h2>
      </div>

      {/* (A) INPUT FORM */}
      <CareerForm
        newItem={newItem}
        onChangeText={handleChangeText}
        onChangeStartDate={handleChangeStartDate}
        onChangeEndDate={handleChangeEndDate}
        onAdd={handleAdd}
        onAiSuggest={handleAiSuggest}
        onSalaryTrend={handleSalaryTrend}
      />

      {/* (B) LINE CHART: CAREER HISTORY */}
      <div
        className="bg-mint-50 border border-teal-100 rounded-lg p-3 shadow-sm mb-6"
        style={{ height: '300px' }}
      >
        {careerData.length === 0 ? (
          <div className="text-center text-gray-400 py-10 text-sm">
            No career data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineData}
              margin={{ top: 10, right: 10, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="xLabel"
                tick={{ fill: '#0f172a', fontSize: 12 }}
                angle={-15}
              />
              <YAxis
                tick={{ fill: '#0f172a', fontSize: 12 }}
                label={{
                  value: 'Hourly Rate($)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#0f172a', fontSize: 12 },
                }}
              />
              {/** ★ (B) 여기서 인라인 → 별도 컴포넌트 "CustomLineTooltip" 사용 */}
              <Tooltip content={<CustomLineTooltip />} />

              <Line
                type="monotone"
                dataKey="hourlyRate"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ r: 5, fill: '#14b8a6' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* (C) PROGRESSION BAR CHART */}
      <ProgressionBarChart careerData={careerData} />

      {/* (D) CAREER HISTORY LIST */}
      <CareerHistoryList careerData={careerData} onDelete={handleDelete} />
    </div>
  );
}
