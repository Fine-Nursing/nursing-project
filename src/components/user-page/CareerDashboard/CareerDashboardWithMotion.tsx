'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import toast from 'react-hot-toast';
import useCareerHistory from 'src/api/useCareerHistory';
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

import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  chartEntrance,
} from 'src/styles/animations';
import type { CareerItem, NewItemInput } from './types';
import AiRoleModal from './AiRoleModal';
import SalaryTrendModal from './SalaryTrendModal';
import ProgressionBarChart from './ProgressionBarChart';

interface CareerDashboardProps {
  theme?: 'light' | 'dark';
}

function CustomLineTooltip({
  active,
  payload,
  theme = 'light',
}: TooltipProps<any, any> & { theme?: 'light' | 'dark' }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${
        theme === 'light' 
          ? 'bg-white border-primary-100 text-gray-700' 
          : 'bg-slate-800 border-slate-600 text-white'
      } border-2 p-3 rounded-xl shadow-lg text-xs backdrop-blur-sm`}
    >
      <div className={`font-bold ${theme === 'light' ? 'text-primary-600' : 'text-primary-300'}`}>
        {data.role} {data.specialty && `(${data.specialty})`}
      </div>
      <div className="mb-1">{data.facility}</div>
      <div className={theme === 'light' ? 'text-sm text-gray-600' : 'text-sm text-gray-300'}>
        Start: {data.startDate ? dayjs(data.startDate).format('MMM YYYY') : ''}
        <br />
        End: {data.endDate ? dayjs(data.endDate).format('MMM YYYY') : 'Now'}
      </div>
      <div className={`font-medium mt-1 ${theme === 'light' ? 'text-secondary-600' : 'text-secondary-400'}`}>
        ${data.hourlyRate.toFixed(2)}/hr
      </div>
    </motion.div>
  );
}

const renderDuration = (years: number, months: number) => {
  if (years > 0) {
    const yearText = `${years}y`;
    return months > 0 ? `${yearText} ${months}m` : yearText;
  }
  return months > 0 ? `${months}m` : '< 1m';
};

function CareerDashboardWithMotion({ theme = 'light' }: CareerDashboardProps) {
  const [careerData, setCareerData] = useState<CareerItem[]>([]);
  const { data: careerHistoryData } = useCareerHistory();

  useEffect(() => {
    if (careerHistoryData) {
      const transformedData = careerHistoryData.map((item, index) => ({
        id: index + 1,
        facility: item.facility,
        role: item.role,
        specialty: item.specialty,
        startDate: item.startDate ? new Date(item.startDate) : new Date(),
        endDate: item.endDate ? new Date(item.endDate) : null,
        hourlyRate: item.hourlyRate,
      }));
      setCareerData(transformedData);
    }
  }, [careerHistoryData]);

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

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [salaryModalOpen, setSalaryModalOpen] = useState(false);

  const sortedCareer = useMemo(
    () => [...careerData].sort((a, b) => {
      if (!a.startDate || !b.startDate) return 0;
      return b.startDate.getTime() - a.startDate.getTime();
    }),
    [careerData]
  );

  const progressionData = useMemo(() => sortedCareer
      .slice()
      .reverse()
      .map((item) => ({
        ...item,
        startDateString: dayjs(item.startDate).format('MMM YYYY'),
        endDateString: item.endDate ? dayjs(item.endDate).format('MMM YYYY') : 'Now',
      })), [sortedCareer]);

  const currentHourlyRate = sortedCareer.length > 0 ? sortedCareer[0].hourlyRate : 0;
  const startingHourlyRate = sortedCareer.length > 0 ? sortedCareer[sortedCareer.length - 1].hourlyRate : 0;
  const salaryGrowth = startingHourlyRate > 0 ? ((currentHourlyRate - startingHourlyRate) / startingHourlyRate) * 100 : 0;

  const avgTenure = useMemo(() => {
    if (careerData.length === 0) return 0;
    const tenures = careerData.map((item) => {
      const end = item.endDate || new Date();
      return dayjs(end).diff(dayjs(item.startDate), 'month');
    });
    return tenures.reduce((a, b) => a + b, 0) / tenures.length;
  }, [careerData]);

  const totalExperience = useMemo(() => {
    if (careerData.length === 0) return { years: 0, months: 0 };
    const allMonths = careerData.reduce((acc, item) => {
      const end = item.endDate || new Date();
      return acc + dayjs(end).diff(dayjs(item.startDate), 'month');
    }, 0);
    return {
      years: Math.floor(allMonths / 12),
      months: allMonths % 12,
    };
  }, [careerData]);

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = useCallback(() => {
    if (!newItem.facility || !newItem.role) {
      toast.error('Facility & Role are required!');
      return;
    }
    const nextId = careerData.length ? Math.max(...careerData.map((d) => d.id)) + 1 : 1;
    setCareerData((prev) => [
      ...prev,
      {
        id: nextId,
        ...newItem,
        hourlyRate: newItem.hourlyRate ? parseFloat(newItem.hourlyRate) : 0,
      },
    ]);
    setNewItem({
      facility: '',
      role: '',
      specialty: '',
      startDate: new Date(),
      endDate: null,
      hourlyRate: '',
    });
    setFormVisible(false);
    toast.success('Career added successfully!');
  }, [careerData, newItem]);

  const handleDelete = (id: number) => {
    setCareerData((prev) => prev.filter((c) => c.id !== id));
    toast.success('Career removed');
  };

  const handleStartEdit = (item: CareerItem) => {
    setEditingItemId(item.id);
    setNewItem({
      facility: item.facility,
      role: item.role,
      specialty: item.specialty || '',
      startDate: item.startDate,
      endDate: item.endDate,
      hourlyRate: item.hourlyRate.toString(),
    });
    setFormVisible(true);
  };

  const handleSaveEdit = useCallback(() => {
    if (!newItem.facility || !newItem.role) {
      toast.error('Facility & Role are required!');
      return;
    }
    setCareerData((prev) =>
      prev.map((c) =>
        c.id === editingItemId
          ? {
              ...c,
              facility: newItem.facility,
              role: newItem.role,
              specialty: newItem.specialty,
              startDate: newItem.startDate!,
              endDate: newItem.endDate,
              hourlyRate: newItem.hourlyRate ? parseFloat(newItem.hourlyRate) : c.hourlyRate,
            }
          : c
      )
    );
    setEditingItemId(null);
    setNewItem({
      facility: '',
      role: '',
      specialty: '',
      startDate: new Date(),
      endDate: null,
      hourlyRate: '',
    });
    setFormVisible(false);
    toast.success('Career updated!');
  }, [editingItemId, newItem]);

  const bgClass = theme === 'light' ? 'bg-gradient-to-br from-primary-50 to-accent-50' : 'bg-gray-900';
  const cardBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-gray-100';
  const mutedText = theme === 'light' ? 'text-gray-600' : 'text-gray-400';

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className={`min-h-screen ${bgClass} p-4 md:p-8`}
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="mb-8">
        <h1 className={`text-4xl font-bold ${textColor} mb-2 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent`}>
          Career Progression Tracker
        </h1>
        <p className={mutedText}>Track your nursing career journey and compensation growth</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {/* Total Experience Card */}
        <motion.div
          variants={staggerItem}
          whileHover={{ scale: 1.02, y: -4 }}
          className={`${cardBg} rounded-2xl p-6 shadow-lg border border-primary-100 backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-medium text-primary-600 bg-primary-100 px-3 py-1 rounded-full"
            >
              Total
            </motion.span>
          </div>
          <div className={`text-3xl font-bold ${textColor} mb-1`}>
            {renderDuration(totalExperience.years, totalExperience.months)}
          </div>
          <div className={mutedText}>Total Experience</div>
        </motion.div>

        {/* Current Hourly Rate Card */}
        <motion.div
          variants={staggerItem}
          whileHover={{ scale: 1.02, y: -4 }}
          className={`${cardBg} rounded-2xl p-6 shadow-lg border border-secondary-100 backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-medium text-secondary-600 bg-secondary-100 px-3 py-1 rounded-full"
            >
              Current
            </motion.span>
          </div>
          <div className={`text-3xl font-bold ${textColor} mb-1`}>
            ${currentHourlyRate.toFixed(0)}/hr
          </div>
          <div className={mutedText}>Current Rate</div>
        </motion.div>

        {/* Salary Growth Card */}
        <motion.div
          variants={staggerItem}
          whileHover={{ scale: 1.02, y: -4 }}
          className={`${cardBg} rounded-2xl p-6 shadow-lg border border-accent-100 backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-xs font-medium ${salaryGrowth >= 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} px-3 py-1 rounded-full`}
            >
              {salaryGrowth >= 0 ? '+' : ''}{salaryGrowth.toFixed(1)}%
            </motion.span>
          </div>
          <div className={`text-3xl font-bold ${textColor} mb-1`}>
            {salaryGrowth >= 0 ? '+' : ''}{salaryGrowth.toFixed(0)}%
          </div>
          <div className={mutedText}>Salary Growth</div>
        </motion.div>

        {/* Average Tenure Card */}
        <motion.div
          variants={staggerItem}
          whileHover={{ scale: 1.02, y: -4 }}
          className={`${cardBg} rounded-2xl p-6 shadow-lg border border-warm-100 backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-warm-400 to-warm-600 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <motion.span 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-medium text-warm-600 bg-warm-100 px-3 py-1 rounded-full"
            >
              Average
            </motion.span>
          </div>
          <div className={`text-3xl font-bold ${textColor} mb-1`}>
            {Math.round(avgTenure)} mo
          </div>
          <div className={mutedText}>Avg Tenure</div>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        variants={fadeInUp}
        className="flex flex-wrap gap-3 mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFormVisible(!formVisible)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Career Entry
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAiModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <Sparkles className="w-5 h-5" />
          AI Career Insights
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSalaryModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <BarChart4 className="w-5 h-5" />
          Salary Trends
        </motion.button>
      </motion.div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {formVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`${cardBg} rounded-2xl p-6 mb-8 shadow-xl border border-primary-100`}
          >
            <h3 className={`text-xl font-bold ${textColor} mb-4`}>
              {editingItemId ? 'Edit Career Entry' : 'Add New Career Entry'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                name="facility"
                value={newItem.facility}
                onChange={handleChangeText}
                placeholder="Facility Name"
                className={`px-4 py-3 rounded-xl border-2 ${
                  theme === 'light' 
                    ? 'border-primary-200 focus:border-primary-400 bg-primary-50' 
                    : 'border-gray-600 focus:border-primary-400 bg-gray-700'
                } outline-none transition-all ${textColor}`}
              />
              <input
                type="text"
                name="role"
                value={newItem.role}
                onChange={handleChangeText}
                placeholder="Role/Position"
                className={`px-4 py-3 rounded-xl border-2 ${
                  theme === 'light' 
                    ? 'border-primary-200 focus:border-primary-400 bg-primary-50' 
                    : 'border-gray-600 focus:border-primary-400 bg-gray-700'
                } outline-none transition-all ${textColor}`}
              />
              <input
                type="text"
                name="specialty"
                value={newItem.specialty}
                onChange={handleChangeText}
                placeholder="Specialty (Optional)"
                className={`px-4 py-3 rounded-xl border-2 ${
                  theme === 'light' 
                    ? 'border-primary-200 focus:border-primary-400 bg-primary-50' 
                    : 'border-gray-600 focus:border-primary-400 bg-gray-700'
                } outline-none transition-all ${textColor}`}
              />
              <DatePicker
                selected={newItem.startDate}
                onChange={(date) => setNewItem((prev) => ({ ...prev, startDate: date }))}
                dateFormat="MMM yyyy"
                showMonthYearPicker
                placeholderText="Start Date"
                className={`px-4 py-3 rounded-xl border-2 w-full ${
                  theme === 'light' 
                    ? 'border-primary-200 focus:border-primary-400 bg-primary-50' 
                    : 'border-gray-600 focus:border-primary-400 bg-gray-700'
                } outline-none transition-all ${textColor}`}
              />
              <DatePicker
                selected={newItem.endDate}
                onChange={(date) => setNewItem((prev) => ({ ...prev, endDate: date }))}
                dateFormat="MMM yyyy"
                showMonthYearPicker
                placeholderText="End Date (Optional)"
                isClearable
                className={`px-4 py-3 rounded-xl border-2 w-full ${
                  theme === 'light' 
                    ? 'border-primary-200 focus:border-primary-400 bg-primary-50' 
                    : 'border-gray-600 focus:border-primary-400 bg-gray-700'
                } outline-none transition-all ${textColor}`}
              />
              <input
                type="number"
                name="hourlyRate"
                value={newItem.hourlyRate}
                onChange={handleChangeText}
                placeholder="Hourly Rate ($)"
                className={`px-4 py-3 rounded-xl border-2 ${
                  theme === 'light' 
                    ? 'border-primary-200 focus:border-primary-400 bg-primary-50' 
                    : 'border-gray-600 focus:border-primary-400 bg-gray-700'
                } outline-none transition-all ${textColor}`}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={editingItemId ? handleSaveEdit : handleAdd}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl font-medium"
              >
                <Check className="w-5 h-5" />
                {editingItemId ? 'Save Changes' : 'Add Entry'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setFormVisible(false);
                  setEditingItemId(null);
                  setNewItem({
                    facility: '',
                    role: '',
                    specialty: '',
                    startDate: new Date(),
                    endDate: null,
                    hourlyRate: '',
                  });
                }}
                className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Career Timeline & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Career Timeline */}
        <motion.div 
          variants={fadeInUp}
          className={`${cardBg} rounded-2xl p-6 shadow-xl`}
        >
          <div className="flex items-center gap-2 mb-6">
            <History className="w-6 h-6 text-primary-500" />
            <h2 className={`text-2xl font-bold ${textColor}`}>Career Timeline</h2>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            <AnimatePresence>
              {sortedCareer.map((item, index) => {
                const duration = item.endDate
                  ? dayjs(item.endDate).diff(dayjs(item.startDate), 'month')
                  : dayjs().diff(dayjs(item.startDate), 'month');
                const years = Math.floor(duration / 12);
                const months = duration % 12;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className={`relative pl-8 pb-4 ${
                      index !== sortedCareer.length - 1 ? 'border-l-2 border-primary-200' : ''
                    }`}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className={`absolute left-0 w-4 h-4 rounded-full -translate-x-1/2 ${
                        index === 0 
                          ? 'bg-gradient-to-br from-secondary-400 to-secondary-600 ring-4 ring-secondary-100' 
                          : 'bg-primary-400'
                      }`}
                    />
                    
                    <div className={`${theme === 'light' ? 'bg-gradient-to-r from-primary-50 to-accent-50' : 'bg-gray-700'} rounded-xl p-4 hover:shadow-lg transition-all`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className={`font-bold ${textColor}`}>{item.role}</h3>
                          <p className={`text-sm ${mutedText}`}>{item.facility}</p>
                          {item.specialty && (
                            <span className="inline-block mt-1 px-3 py-1 bg-accent-100 text-accent-700 text-xs rounded-full">
                              {item.specialty}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleStartEdit(item)}
                            className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-primary-600" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(item.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </motion.button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4 text-sm">
                          <span className={mutedText}>
                            {dayjs(item.startDate).format('MMM YYYY')} - {
                              item.endDate ? dayjs(item.endDate).format('MMM YYYY') : 'Present'
                            }
                          </span>
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs font-medium">
                            {renderDuration(years, months)}
                          </span>
                        </div>
                        <span className="font-bold text-secondary-600">
                          ${item.hourlyRate}/hr
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Progression Chart */}
        <motion.div 
          variants={chartEntrance}
          className={`${cardBg} rounded-2xl p-6 shadow-xl`}
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-secondary-500" />
            <h2 className={`text-2xl font-bold ${textColor}`}>Salary Progression</h2>
          </div>
          
          {progressionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressionData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#E5E7EB' : '#374151'} />
                <XAxis 
                  dataKey="startDateString" 
                  stroke={theme === 'light' ? '#6B7280' : '#9CA3AF'}
                  fontSize={12}
                />
                <YAxis 
                  stroke={theme === 'light' ? '#6B7280' : '#9CA3AF'}
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomLineTooltip theme={theme} />} />
                <Line
                  type="monotone"
                  dataKey="hourlyRate"
                  stroke="url(#colorGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#2196F3', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2196F3" />
                    <stop offset="100%" stopColor="#00BCD4" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className={mutedText}>Add career entries to see progression</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bar Chart Section */}
      {progressionData.length > 0 && (
        <motion.div 
          variants={fadeInUp}
          className="mt-8"
        >
          <ProgressionBarChart careerData={progressionData} theme={theme} />
        </motion.div>
      )}

      {/* Modals - temporarily disabled for build */}
      {/* <AnimatePresence>
        {aiModalOpen && (
          <AiRoleModal
            isOpen={aiModalOpen}
            onClose={() => setAiModalOpen(false)}
            careerData={careerData}
            theme={theme}
          />
        )}
        {salaryModalOpen && (
          <SalaryTrendModal
            isOpen={salaryModalOpen}
            onClose={() => setSalaryModalOpen(false)}
            careerData={careerData}
            theme={theme}
          />
        )}
      </AnimatePresence> */}
    </motion.div>
  );
}

export default CareerDashboardWithMotion;