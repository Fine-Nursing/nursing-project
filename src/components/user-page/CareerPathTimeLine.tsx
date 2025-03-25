'use client';

import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  Clipboard,
  Plus,
  Trash2,
  Edit,
  AlertCircle,
  Sparkles,
  BarChart4,
  X as CloseIcon,
} from 'lucide-react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

/** ==================== Custom Bar Shape With Bouncing Dot ====================== */
function CustomBouncingBar(props: any) {
  const { x, y, width, height, fill, payload } = props;
  if (height <= 0) return null;

  const isUser = !!payload.isUser; // highlight bracket

  const barRadius = 4;
  return (
    <g>
      {/* Draw the bar */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={isUser ? '#0d9488' : fill}
        rx={barRadius}
        ry={barRadius}
      />
      {/* If isUser => bouncing circle on top */}
      {isUser && (
        <circle
          cx={x + width / 2}
          cy={y - 8}
          r="8"
          fill="#0d9488"
          className="animate-bounce" // Tailwind's bounce
        />
      )}
    </g>
  );
}

/** ==================== Model ====================== */
interface CareerItem {
  id: number;
  facility: string;
  role: string;
  specialty: string;
  startDate: Date | null;
  endDate: Date | null;
  hourlyRate: number;
}

export default function CareerDashboard() {
  /** =============== 1) CAREER HISTORY STATES =============== */
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
  const [newItem, setNewItem] = useState({
    facility: '',
    role: '',
    specialty: '',
    startDate: new Date(),
    endDate: null as Date | null,
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

  // add new career item
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

  /** =============== 2) AI Role Suggest, Salary Trend (Optional) =============== */
  const [aiReason, setAiReason] = useState<string | null>(null);
  function getAiRoleRecommendation() {
    const roles = ['RN', 'Charge Nurse', 'NP', 'Clinical Nurse Educator'];
    const specs = ['ER', 'ICU', 'Pediatrics', 'Oncology'];
    const reasons = [
      'Leadership potential in the ER',
      'ICU expansion plans soon',
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

  // Salary Trend
  const [showTrend, setShowTrend] = useState(false);
  const [trendData, setTrendData] = useState<
    { month: string; hourlyRate: number }[]
  >([]);
  function getAiSalaryTrend() {
    const data = [];
    let base = 35 + Math.random() * 5;
    for (let i = 0; i < 6; i++) {
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

  /** =============== 3) LINE CHART for "History Graph" =============== */
  const lineData = careerData
    .sort(
      (a, b) => (a.startDate?.getTime() || 0) - (b.startDate?.getTime() || 0)
    )
    .map((item) => ({
      ...item,
      xLabel: item.startDate ? dayjs(item.startDate).format('MMM YYYY') : '',
    }));

  /** =============== 4) BAR CHART "Career Progression" =============== */
  // Compute earliest start => total experience in years
  function getTotalExperienceYears() {
    if (!careerData.length) return 0;
    const earliest = careerData.reduce((acc, cur) => {
      if (!acc || (cur.startDate && cur.startDate < acc)) {
        return cur.startDate;
      }
      return acc;
    }, careerData[0].startDate);
    if (!earliest) return 0;
    const now = new Date();
    const monthsDiff =
      (now.getFullYear() - earliest.getFullYear()) * 12 +
      (now.getMonth() - earliest.getMonth());
    const years = monthsDiff / 12;
    return years < 0 ? 0 : years;
  }

  const totalExp = getTotalExperienceYears();
  // define brackets
  const brackets = [
    { label: '0-1 yrs', minYrs: 0, maxYrs: 1, salary: 62000 },
    { label: '1-3 yrs', minYrs: 1, maxYrs: 3, salary: 67000 },
    { label: '3-5 yrs', minYrs: 3, maxYrs: 5, salary: 73000 },
    { label: '5-8 yrs', minYrs: 5, maxYrs: 8, salary: 80000 },
    { label: '9+ yrs', minYrs: 8, maxYrs: 99, salary: 86000 },
  ];
  const progressionData = brackets.map((b) => {
    let isUser = false;
    if (totalExp >= b.minYrs && totalExp < b.maxYrs) {
      isUser = true;
    } else if (b.maxYrs === 99 && totalExp >= 8) {
      isUser = true;
    }
    return {
      expBracket: b.label,
      salary: b.salary,
      isUser,
    };
  });

  return (
    <div className="bg-white min-h-screen p-6">
      {/* AI Modal */}
      {aiReason && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-4 rounded-lg shadow-md w-80 relative">
            <button
              onClick={handleCloseAiModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            <h3 className="text-teal-600 font-bold text-lg mb-2">
              AI Suggestion
            </h3>
            <p className="text-sm text-gray-700">{aiReason}</p>
            <div className="mt-3 text-right">
              <button
                onClick={handleCloseAiModal}
                className="bg-teal-500 text-white px-3 py-1.5 rounded hover:bg-teal-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Salary Trend Modal */}
      {showTrend && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-4 rounded-lg shadow-md w-96 relative">
            <button
              onClick={handleCloseTrend}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            <h3 className="text-cyan-600 font-bold text-lg mb-2">
              Salary Trend (Next 6 months)
            </h3>
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#0f172a', fontSize: 11 }}
                  />
                  <YAxis
                    label={{
                      value: 'Hourly Rate',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: '#0f172a', fontSize: 11 },
                    }}
                    tick={{ fill: '#0f172a', fontSize: 11 }}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="hourlyRate"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={{ r: 5, fill: '#06b6d4' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              <em>Example AI prediction</em>
            </p>
            <div className="mt-3 text-right">
              <button
                onClick={handleCloseTrend}
                className="bg-cyan-500 text-white px-3 py-1.5 rounded hover:bg-cyan-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center mb-4">
        <Clipboard className="text-teal-500 w-6 h-6 mr-2" />
        <h2 className="text-2xl font-bold text-teal-700">
          My Career Dashboard
        </h2>
      </div>

      {/* Input Form */}
      <div className="bg-mint-50 border border-teal-100 rounded-lg p-4 space-y-4 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Facility */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Facility
            </label>
            <input
              name="facility"
              value={newItem.facility}
              onChange={handleChangeText}
              placeholder="e.g. NYU Langone"
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
            />
          </div>
          {/* Role */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Role
            </label>
            <input
              name="role"
              value={newItem.role}
              onChange={handleChangeText}
              placeholder="e.g. RN"
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
            />
          </div>
          {/* Specialty */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Specialty
            </label>
            <input
              name="specialty"
              value={newItem.specialty}
              onChange={handleChangeText}
              placeholder="e.g. ER, NICU"
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Start Date */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Start Date
            </label>
            <DatePicker
              selected={newItem.startDate}
              onChange={(date) => handleChangeStartDate(date)}
              dateFormat="MMM yyyy"
              showMonthYearPicker
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
            />
          </div>
          {/* End Date */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              End Date
            </label>
            <DatePicker
              selected={newItem.endDate}
              onChange={(date) => handleChangeEndDate(date)}
              dateFormat="MMM yyyy"
              showMonthYearPicker
              placeholderText="Ongoing if empty"
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
            />
          </div>
          {/* Hourly Rate */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Hourly Rate
            </label>
            <input
              name="hourlyRate"
              type="number"
              step="0.01"
              value={newItem.hourlyRate}
              onChange={handleChangeText}
              placeholder="e.g. 35.5"
              className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
            />
          </div>
        </div>
        {/* AI Buttons / Add */}
        <div className="flex flex-wrap justify-between items-center mt-3">
          <div className="space-x-2">
            <button
              onClick={handleAiSuggest}
              className="inline-flex items-center rounded-full bg-purple-100 text-purple-600 px-3 py-1 hover:bg-purple-200 transition"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              AI Suggest Role
            </button>
            <button
              onClick={handleSalaryTrend}
              className="inline-flex items-center rounded-full bg-cyan-100 text-cyan-600 px-3 py-1 hover:bg-cyan-200 transition"
            >
              <BarChart4 className="w-4 h-4 mr-1" />
              Salary Trend
            </button>
          </div>
          <button
            onClick={handleAdd}
            className="rounded-full bg-teal-500 text-white px-4 py-1.5 hover:bg-teal-600 flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Career
          </button>
        </div>
      </div>

      {/* LINE CHART: Career History Over Time */}
      <div
        className="bg-mint-50 border border-teal-100 rounded-lg p-3 shadow-sm mb-6"
        style={{ height: '300px' }}
      >
        {careerData.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <AlertCircle className="w-6 h-6 inline-block mr-1" />
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
              <Tooltip
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-teal-100 text-gray-700 p-2 rounded-xl shadow-sm text-xs">
                        <div className="font-bold text-teal-600">
                          {data.role} {data.specialty && `(${data.specialty})`}
                        </div>
                        <div className="mb-1">{data.facility}</div>
                        <div className="text-sm text-gray-600">
                          Start:{' '}
                          {data.startDate
                            ? dayjs(data.startDate).format('MMM YYYY')
                            : ''}
                          <br />
                          End:{' '}
                          {data.endDate
                            ? dayjs(data.endDate).format('MMM YYYY')
                            : 'Now'}
                        </div>
                        <div className="font-medium text-teal-700 mt-1">
                          ${data.hourlyRate.toFixed(2)}/hr
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
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

      {/* CAREER PROGRESSION CHART (Simple brackets w/ bouncing circle) */}
      <ProgressionBarChart careerData={careerData} />

      {/* CAREER HISTORY LIST */}
      <div className="bg-mint-50 border border-teal-100 rounded-lg p-4 shadow-sm">
        <h4 className="font-extrabold text-teal-700 mb-3 flex items-center">
          <Clipboard className="w-5 h-5 text-teal-500 mr-1" />
          Career History
        </h4>
        {careerData.length === 0 ? (
          <div className="text-sm text-gray-400">No history...</div>
        ) : (
          <ul className="divide-y divide-teal-100 text-sm">
            {careerData
              .sort(
                (a, b) =>
                  (a.startDate?.getTime() || 0) - (b.startDate?.getTime() || 0)
              )
              .map((item) => {
                const ongoing = !item.endDate;
                return (
                  <li
                    key={item.id}
                    className="py-2 flex items-center justify-between"
                  >
                    <div>
                      <div
                        className={`font-bold ${
                          ongoing ? 'text-green-700' : 'text-teal-700'
                        }`}
                      >
                        {item.role} {item.specialty && `(${item.specialty})`}
                        {ongoing && (
                          <span className="ml-1 bg-green-100 text-green-700 px-1 py-0.5 text-xs rounded">
                            Ongoing
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600">
                        {item.facility} |{' '}
                        {item.startDate
                          ? dayjs(item.startDate).format('MMM YYYY')
                          : ''}{' '}
                        ~{' '}
                        {item.endDate
                          ? dayjs(item.endDate).format('MMM YYYY')
                          : 'Now'}
                      </div>
                      <div className="text-gray-500 text-xs">
                        ${item.hourlyRate.toFixed(2)}/hr
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => alert('Edit not implemented.')}
                        className="p-1 rounded text-teal-600 hover:bg-teal-100"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 rounded text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
}

/** Subcomponent: "ProgressionBarChart" with simplified bracket approach. */
function ProgressionBarChart({ careerData }: { careerData: CareerItem[] }) {
  if (!careerData.length) {
    return (
      <div
        className="bg-mint-50 border border-teal-100 rounded-lg p-4 shadow-sm mb-6"
        style={{ height: '320px' }}
      >
        <h4 className="font-bold text-teal-700 text-sm mb-2">
          Career Progression Chart
        </h4>
        <div className="text-center text-gray-400 py-10 text-sm">
          <AlertCircle className="w-6 h-6 inline-block mr-1" />
          No data to compute progression...
        </div>
      </div>
    );
  }

  // Compute earliest start => totalExp
  const earliest = careerData.reduce((acc, cur) => {
    if (!acc || (cur.startDate && cur.startDate < acc)) {
      return cur.startDate;
    }
    return acc;
  }, careerData[0].startDate);
  if (!earliest) {
    return null;
  }
  const now = new Date();
  const monthsDiff =
    (now.getFullYear() - earliest.getFullYear()) * 12 +
    (now.getMonth() - earliest.getMonth());
  const totalYears = monthsDiff / 12;

  const bracketArr = [
    { label: '0-1 yrs', min: 0, max: 1, salary: 62000 },
    { label: '1-3 yrs', min: 1, max: 3, salary: 67000 },
    { label: '3-5 yrs', min: 3, max: 5, salary: 73000 },
    { label: '5-8 yrs', min: 5, max: 8, salary: 80000 },
    { label: '9+ yrs', min: 8, max: 99, salary: 86000 },
  ];
  const data = bracketArr.map((b) => {
    let isUser = false;
    if (totalYears >= b.min && totalYears < b.max) {
      isUser = true;
    } else if (b.max === 99 && totalYears >= 8) {
      isUser = true;
    }
    return {
      expBracket: b.label,
      salary: b.salary,
      isUser,
    };
  });

  return (
    <div
      className="bg-mint-50 border border-teal-100 rounded-lg p-4 shadow-sm mb-6"
      style={{ height: '320px' }}
    >
      <h4 className="font-bold text-teal-700 text-sm mb-2">
        Career Progression Chart
      </h4>
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="expBracket"
              label={{
                value: 'Experience Bracket',
                position: 'insideBottom',
                offset: 0,
                fontSize: 12,
              }}
              tick={{ fill: '#0f172a', fontSize: 11 }}
            />
            <YAxis
              domain={[60000, 90000]}
              label={{
                value: 'Annual Salary ($)',
                angle: -90,
                position: 'insideLeft',
                fontSize: 12,
                fill: '#0f172a',
              }}
              tick={{ fill: '#0f172a', fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="p-2 bg-white border border-teal-100 text-gray-700 text-xs rounded shadow-sm">
                      <p className="font-bold">{item.expBracket}</p>
                      <p>
                        Salary: ${item.salary.toLocaleString()}
                        {item.isUser && ' ← Your bracket'}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="salary"
              fill="#5eead4"
              shape={<CustomBouncingBar />}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-teal-600 rounded-sm mr-1" />
          <span>Your bracket</span>
        </div>
      </div>
    </div>
  );
}
