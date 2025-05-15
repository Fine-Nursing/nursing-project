'use client';

import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import {
  Sparkles,
  BarChart4,
  Plus,
  History,
  Award,
  Briefcase,
  TrendingUp,
  Clock,
  Check,
  Edit,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  type TooltipProps,
} from 'recharts';

import type { CareerItem, NewItemInput } from './types';
import AiRoleModal from './AiRoleModal';
import SalaryTrendModal from './SalaryTrendModal';
import ProgressionBarChart from './ProgressionBarChart';

interface CareerDashboardProps {
  theme?: 'light' | 'dark';
}

/** ★ 커스텀 툴팁 컴포넌트: 렌더 밖에 정의하여 ESLint 경고 해결 */
function CustomLineTooltip({
  active,
  payload,
  theme = 'light',
}: TooltipProps<any, any> & { theme?: 'light' | 'dark' }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <div
      className={`${theme === 'light' ? 'bg-white border-emerald-100 text-gray-700' : 'bg-slate-700 border-slate-600 text-white'} border p-2 rounded-xl shadow-sm text-xs`}
    >
      <div
        className={`font-bold ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-300'}`}
      >
        {data.role} {data.specialty && `(${data.specialty})`}
      </div>
      <div className="mb-1">{data.facility}</div>
      <div
        className={
          theme === 'light' ? 'text-sm text-gray-600' : 'text-sm text-gray-300'
        }
      >
        Start: {data.startDate ? dayjs(data.startDate).format('MMM YYYY') : ''}
        <br />
        End: {data.endDate ? dayjs(data.endDate).format('MMM YYYY') : 'Now'}
      </div>
      <div
        className={`font-medium mt-1 ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'}`}
      >
        ${data.hourlyRate.toFixed(2)}/hr
      </div>
    </div>
  );
}

// 기간을 표시하는 헬퍼 함수 (중첩된 삼항 연산자를 피하기 위함)
const renderDuration = (years: number, months: number) => {
  if (years > 0) {
    const yearText = `${years}y`;
    return months > 0 ? `${yearText} ${months}m` : yearText;
  }

  // 1년 미만인 경우
  return months > 0 ? `${months}m` : '< 1m';
};

export default function CareerDashboard({
  theme = 'light',
}: CareerDashboardProps) {
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

  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [formVisible, setFormVisible] = useState(false);

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
    setFormVisible(false);
  };

  const handleEdit = (id: number) => {
    const itemToEdit = careerData.find((item) => item.id === id);
    if (itemToEdit) {
      setNewItem({
        facility: itemToEdit.facility,
        role: itemToEdit.role,
        specialty: itemToEdit.specialty || '',
        startDate: itemToEdit.startDate,
        endDate: itemToEdit.endDate,
        hourlyRate: itemToEdit.hourlyRate.toString(),
      });
      setEditingItemId(id);
      setFormVisible(true);
    }
  };

  const handleUpdate = () => {
    if (editingItemId === null) return;

    setCareerData((prev) =>
      prev.map((item) => {
        if (item.id === editingItemId) {
          return {
            ...item,
            facility: newItem.facility,
            role: newItem.role,
            specialty: newItem.specialty,
            startDate: newItem.startDate || new Date(),
            endDate: newItem.endDate,
            hourlyRate: parseFloat(newItem.hourlyRate || '0'),
          };
        }
        return item;
      })
    );

    setNewItem({
      facility: '',
      role: '',
      specialty: '',
      startDate: new Date(),
      endDate: null,
      hourlyRate: '',
    });
    setEditingItemId(null);
    setFormVisible(false);
  };

  const handleCancel = () => {
    setNewItem({
      facility: '',
      role: '',
      specialty: '',
      startDate: new Date(),
      endDate: null,
      hourlyRate: '',
    });
    setEditingItemId(null);
    setFormVisible(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this career entry?')) {
      setCareerData((prev) => prev.filter((item) => item.id !== id));
    }
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

  /** 3) 경력 통계 계산 */
  const sortedCareerData = [...careerData].sort(
    (a, b) => (a.startDate?.getTime() || 0) - (b.startDate?.getTime() || 0)
  );

  const totalMonths = sortedCareerData.reduce((total, item) => {
    const startDate = dayjs(item.startDate);
    const endDate = item.endDate ? dayjs(item.endDate) : dayjs();
    return total + endDate.diff(startDate, 'month');
  }, 0);

  const totalYears = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  const currentRole = sortedCareerData.length
    ? sortedCareerData[sortedCareerData.length - 1]
    : null;

  const highestSalary = Math.max(
    ...sortedCareerData.map((item) => item.hourlyRate)
  );
  const annualSalary = highestSalary * 40 * 52; // 40 hours per week, 52 weeks per year

  /** 4) LINE CHART: CAREER HISTORY Over Time */
  const lineData = sortedCareerData.map((item) => ({
    ...item,
    xLabel: item.startDate ? dayjs(item.startDate).format('MMM YYYY') : '',
  }));

  // 다크모드 조건부 클래스
  const bgClass = theme === 'light' ? 'bg-white' : 'bg-slate-700';

  const borderClass =
    theme === 'light' ? 'border-emerald-200' : 'border-slate-600';

  const chartGridColor = theme === 'light' ? '#e2e8f0' : '#475569';
  const chartTextColor = theme === 'light' ? '#0f172a' : '#e2e8f0';

  return (
    <div>
      <AiRoleModal
        reason={aiReason}
        onClose={handleCloseAiModal}
        theme={theme}
      />
      <SalaryTrendModal
        visible={showTrend}
        data={trendData}
        onClose={handleCloseTrend}
        theme={theme}
      />

      {/* Header & Stats */}
      <div className="mb-8">
        <div className="flex items-center mb-3">
          <Briefcase
            className={`${theme === 'light' ? 'text-emerald-600' : 'text-emerald-300'} w-7 h-7 mr-2`}
          />
          <h2
            className={`text-2xl font-bold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'}`}
          >
            My Career Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div
            className={`${theme === 'light' ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200' : 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600'} rounded-xl p-4 border flex flex-col`}
          >
            <span
              className={`${theme === 'light' ? 'text-emerald-500' : 'text-emerald-300'} text-sm font-medium`}
            >
              Total Experience
            </span>
            <div className="flex items-center mt-2">
              <Clock
                className={`w-5 h-5 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-300'} mr-2`}
              />
              <span
                className={`text-xl font-bold ${theme === 'light' ? 'text-emerald-800' : 'text-emerald-200'}`}
              >
                {totalYears} Year{totalYears !== 1 ? 's' : ''}{' '}
                {remainingMonths > 0
                  ? `${remainingMonths} Month${remainingMonths !== 1 ? 's' : ''}`
                  : ''}
              </span>
            </div>
          </div>

          <div
            className={`${theme === 'light' ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' : 'bg-gradient-to-br from-slate-800 to-blue-900 border-blue-800'} rounded-xl p-4 border flex flex-col`}
          >
            <span
              className={`${theme === 'light' ? 'text-blue-500' : 'text-blue-300'} text-sm font-medium`}
            >
              Current Role
            </span>
            <div className="flex items-center mt-2">
              <Award
                className={`w-5 h-5 ${theme === 'light' ? 'text-blue-600' : 'text-blue-300'} mr-2`}
              />
              <span
                className={`text-xl font-bold ${theme === 'light' ? 'text-blue-800' : 'text-blue-200'}`}
              >
                {currentRole
                  ? `${currentRole.role}${currentRole.specialty ? ` (${currentRole.specialty})` : ''}`
                  : 'None'}
              </span>
            </div>
          </div>

          <div
            className={`${theme === 'light' ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200' : 'bg-gradient-to-br from-slate-800 to-purple-900 border-purple-800'} rounded-xl p-4 border flex flex-col`}
          >
            <span
              className={`${theme === 'light' ? 'text-purple-500' : 'text-purple-300'} text-sm font-medium`}
            >
              Highest Hourly Rate
            </span>
            <div className="flex items-center mt-2">
              <TrendingUp
                className={`w-5 h-5 ${theme === 'light' ? 'text-purple-600' : 'text-purple-300'} mr-2`}
              />
              <span
                className={`text-xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-200'}`}
              >
                ${highestSalary.toFixed(2)}/hr
              </span>
            </div>
          </div>

          <div
            className={`${theme === 'light' ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200' : 'bg-gradient-to-br from-slate-800 to-emerald-900 border-emerald-800'} rounded-xl p-4 border flex flex-col`}
          >
            <span
              className={`${theme === 'light' ? 'text-emerald-500' : 'text-emerald-300'} text-sm font-medium`}
            >
              Est. Annual Salary
            </span>
            <div className="flex items-center mt-2">
              <Award
                className={`w-5 h-5 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-300'} mr-2`}
              />
              <span
                className={`text-xl font-bold ${theme === 'light' ? 'text-emerald-800' : 'text-emerald-200'}`}
              >
                ${Math.round(annualSalary).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Career Button & Form */}
      <div className="mb-6">
        {!formVisible ? (
          <button
            type="button"
            onClick={() => setFormVisible(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-emerald-700 transition shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Career Entry
          </button>
        ) : (
          <div
            className={`${bgClass} border ${borderClass} rounded-lg p-5 shadow-sm`}
          >
            <h3
              className={`text-lg font-bold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'} mb-4 flex items-center`}
            >
              <Briefcase
                className={`w-5 h-5 mr-2 ${theme === 'light' ? 'text-emerald-500' : 'text-emerald-300'}`}
              />
              {editingItemId ? 'Edit Career Entry' : 'Add New Career Entry'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Facility */}
              <div>
                <label
                  htmlFor="facility"
                  className={`block mb-1 text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}
                >
                  Facility/Organization*
                </label>
                <input
                  id="facility"
                  name="facility"
                  value={newItem.facility}
                  onChange={handleChangeText}
                  placeholder="e.g. NYU Langone"
                  className={`w-full px-3 py-2 border ${theme === 'light' ? 'border-gray-200 bg-white text-gray-900' : 'border-slate-600 bg-slate-800 text-white'} rounded-lg text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className={`block mb-1 text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}
                >
                  Role/Position*
                </label>
                <input
                  id="role"
                  name="role"
                  value={newItem.role}
                  onChange={handleChangeText}
                  placeholder="e.g. RN"
                  className={`w-full px-3 py-2 border ${theme === 'light' ? 'border-gray-200 bg-white text-gray-900' : 'border-slate-600 bg-slate-800 text-white'} rounded-lg text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
                  required
                />
              </div>

              {/* Specialty */}
              <div>
                <label
                  htmlFor="specialty"
                  className={`block mb-1 text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}
                >
                  Specialty
                </label>
                <input
                  id="specialty"
                  name="specialty"
                  value={newItem.specialty}
                  onChange={handleChangeText}
                  placeholder="e.g. ER, NICU"
                  className={`w-full px-3 py-2 border ${theme === 'light' ? 'border-gray-200 bg-white text-gray-900' : 'border-slate-600 bg-slate-800 text-white'} rounded-lg text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Start Date */}
              <div>
                <label
                  htmlFor="startDate"
                  className={`block mb-1 text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}
                >
                  Start Date*
                </label>
                <DatePicker
                  id="startDate"
                  selected={newItem.startDate}
                  onChange={handleChangeStartDate}
                  dateFormat="MMM yyyy"
                  showMonthYearPicker
                  className={`w-full px-3 py-2 border ${theme === 'light' ? 'border-gray-200 bg-white text-gray-900' : 'border-slate-600 bg-slate-800 text-white'} rounded-lg text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
                  required
                />
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="endDate"
                  className={`block mb-1 text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}
                >
                  End Date{' '}
                  <span
                    className={
                      theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                    }
                  >
                    (Leave empty if current)
                  </span>
                </label>
                <DatePicker
                  id="endDate"
                  selected={newItem.endDate}
                  onChange={handleChangeEndDate}
                  dateFormat="MMM yyyy"
                  showMonthYearPicker
                  placeholderText="Ongoing"
                  className={`w-full px-3 py-2 border ${theme === 'light' ? 'border-gray-200 bg-white text-gray-900' : 'border-slate-600 bg-slate-800 text-white'} rounded-lg text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
                  isClearable
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <label
                  htmlFor="hourlyRate"
                  className={`block mb-1 text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}
                >
                  Hourly Rate ($)*
                </label>
                <input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  step="0.01"
                  value={newItem.hourlyRate}
                  onChange={handleChangeText}
                  placeholder="e.g. 35.5"
                  className={`w-full px-3 py-2 border ${theme === 'light' ? 'border-gray-200 bg-white text-gray-900' : 'border-slate-600 bg-slate-800 text-white'} rounded-lg text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
                  required
                />
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={handleAiSuggest}
                  className={`inline-flex items-center rounded-lg ${theme === 'light' ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' : 'bg-purple-900 text-purple-200 hover:bg-purple-800'} px-3 py-2 transition text-sm`}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI Suggest Role
                </button>
                <button
                  type="button"
                  onClick={handleSalaryTrend}
                  className={`inline-flex items-center rounded-lg ${theme === 'light' ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-blue-900 text-blue-200 hover:bg-blue-800'} px-3 py-2 transition text-sm`}
                >
                  <BarChart4 className="w-4 h-4 mr-1" />
                  Salary Trend
                </button>
              </div>

              <div className="space-x-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`px-4 py-2 border rounded-lg ${theme === 'light' ? 'border-gray-300 text-gray-600 hover:bg-gray-50' : 'border-slate-500 text-gray-300 hover:bg-slate-600'} text-sm`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={editingItemId ? handleUpdate : handleAdd}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
                >
                  {editingItemId ? 'Update' : 'Add'} Career Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Combined Timeline & Graph */}
      {/* Combined Timeline & Graph */}
      <div
        className={`mb-8 ${bgClass} border ${borderClass} rounded-xl shadow-sm overflow-hidden`}
      >
        <div className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600">
          <h3 className="text-lg font-bold text-white mb-1 flex items-center">
            <History className="w-5 h-5 mr-2" />
            Career Journey Timeline
          </h3>
          <p className="text-emerald-100 text-sm">
            Your professional growth visualized
          </p>
        </div>

        {careerData.length === 0 ? (
          <div
            className={`p-12 text-center ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-25" />
            <p className="text-lg font-medium">Your career timeline is empty</p>
            <p className="text-sm">
              Add your first career entry to see your journey visualized
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left side: Timeline */}
            <div
              className={`p-6 ${theme === 'light' ? 'border-r border-gray-100' : 'border-r border-slate-600'}`}
            >
              <div
                className={`relative pl-8 space-y-8 before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 ${theme === 'light' ? 'before:bg-emerald-200' : 'before:bg-emerald-700'}`}
              >
                {sortedCareerData.map((item, index) => {
                  const startDate = dayjs(item.startDate);
                  const endDate = item.endDate ? dayjs(item.endDate) : dayjs();
                  const durationMonths = endDate.diff(startDate, 'month');
                  const durationYears = Math.floor(durationMonths / 12);
                  const remainingDurationMonths = durationMonths % 12;
                  const ongoing = !item.endDate;

                  // Determine marker color based on role level
                  let markerColor =
                    theme === 'light' ? 'bg-emerald-500' : 'bg-emerald-600';
                  if (
                    item.role.toLowerCase().includes('senior') ||
                    item.role.toLowerCase().includes('director') ||
                    item.role.toLowerCase().includes('manager')
                  ) {
                    markerColor =
                      theme === 'light' ? 'bg-purple-500' : 'bg-purple-600';
                  } else if (
                    item.role.toLowerCase().includes('charge') ||
                    item.role.toLowerCase().includes('lead')
                  ) {
                    markerColor =
                      theme === 'light' ? 'bg-blue-500' : 'bg-blue-600';
                  }

                  return (
                    <div key={item.id} className="relative">
                      {/* Timeline marker */}
                      <div
                        className={`absolute -left-8 top-0 w-8 h-8 rounded-full ${markerColor} flex items-center justify-center shadow-md`}
                      >
                        {index === sortedCareerData.length - 1 && ongoing ? (
                          <Clock className="w-4 h-4 text-white" />
                        ) : (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Content */}
                      <div
                        className={`
                        p-4 rounded-lg border transition-all
                        ${
                          // eslint-disable-next-line no-nested-ternary
                          ongoing
                            ? theme === 'light'
                              ? 'border-emerald-200 bg-emerald-50 shadow-sm'
                              : 'border-emerald-800 bg-slate-800 shadow-sm'
                            : theme === 'light'
                              ? 'border-gray-100 hover:border-emerald-200 hover:shadow-sm'
                              : 'border-slate-600 hover:border-emerald-700 hover:shadow-sm'
                        }
                      `}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4
                              className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'} flex items-center`}
                            >
                              {item.role}
                              {item.specialty && (
                                <span
                                  className={
                                    theme === 'light'
                                      ? 'text-gray-500 ml-1'
                                      : 'text-gray-400 ml-1'
                                  }
                                >
                                  ({item.specialty})
                                </span>
                              )}
                            </h4>
                            <div
                              className={
                                theme === 'light'
                                  ? 'text-gray-600 mt-1'
                                  : 'text-gray-300 mt-1'
                              }
                            >
                              {item.facility}
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex space-x-1">
                            <button
                              type="button"
                              onClick={() => handleEdit(item.id)}
                              className={`p-1 ${theme === 'light' ? 'text-gray-400 hover:text-emerald-600' : 'text-gray-500 hover:text-emerald-300'} rounded`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className={`p-1 ${theme === 'light' ? 'text-gray-400 hover:text-red-600' : 'text-gray-500 hover:text-red-400'} rounded`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div
                          className={`flex items-center mt-2 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}
                        >
                          <Clock
                            className={`w-3.5 h-3.5 mr-1 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}
                          />
                          <span>
                            {startDate.format('MMM YYYY')} -{' '}
                            {ongoing ? 'Present' : endDate.format('MMM YYYY')}{' '}
                            <span
                              className={`font-medium ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-300'}`}
                            >
                              (
                              {renderDuration(
                                durationYears,
                                remainingDurationMonths
                              )}
                              )
                            </span>
                          </span>
                        </div>

                        <div className="mt-2 flex items-center">
                          <TrendingUp
                            className={`w-3.5 h-3.5 mr-1 ${theme === 'light' ? 'text-emerald-500' : 'text-emerald-300'}`}
                          />
                          <span
                            className={`text-sm font-medium ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'}`}
                          >
                            ${item.hourlyRate.toFixed(2)}/hr
                          </span>
                        </div>

                        {index < sortedCareerData.length - 1 && (
                          <div
                            className={`mt-3 text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'} flex items-center`}
                          >
                            <ArrowRight className="w-3 h-3 mr-1" />
                            {dayjs(sortedCareerData[index + 1].startDate).diff(
                              endDate,
                              'month'
                            ) > 1 ? (
                              <span>
                                {dayjs(
                                  sortedCareerData[index + 1].startDate
                                ).diff(endDate, 'month')}{' '}
                                month gap
                              </span>
                            ) : (
                              <span>Direct transition</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right side: Salary Chart */}
            <div className="p-6" style={{ height: '400px' }}>
              <h4
                className={`text-sm font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'} mb-3`}
              >
                Salary Progression
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineData}
                  margin={{ top: 10, right: 10, bottom: 20, left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={chartGridColor}
                  />
                  <XAxis
                    dataKey="xLabel"
                    tick={{ fill: chartTextColor, fontSize: 12 }}
                    angle={-15}
                  />
                  <YAxis
                    tick={{ fill: chartTextColor, fontSize: 12 }}
                    label={{
                      value: 'Hourly Rate($)',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: chartTextColor, fontSize: 12 },
                    }}
                  />
                  <Tooltip content={<CustomLineTooltip theme={theme} />} />
                  <Line
                    type="monotone"
                    dataKey="hourlyRate"
                    stroke={theme === 'light' ? '#14b8a6' : '#2dd4bf'} // 라이트모드: emerald-500, 다크모드: emerald-400
                    strokeWidth={3}
                    dot={{
                      r: 5,
                      fill: theme === 'light' ? '#14b8a6' : '#2dd4bf',
                    }}
                    activeDot={{
                      r: 8,
                      fill: theme === 'light' ? '#0f766e' : '#5eead4',
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Progression Bar Chart */}
      <ProgressionBarChart careerData={careerData} theme={theme} />
    </div>
  );
}
