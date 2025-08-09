import React from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  MapPin, 
  Check, 
  ArrowRight, 
  Star, 
  Plus, 
  Clock, 
  Award, 
  Briefcase, 
  TrendingUp, 
  Edit, 
  Trash2 
} from 'lucide-react';
import type { 
  TooltipProps 
} from 'recharts';
import { 
  ResponsiveContainer, 
  LineChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Line 
} from 'recharts';
import dayjs from 'dayjs';

import type { CareerItem } from './types';

interface CareerTimelineProps {
  theme: 'light' | 'dark';
  careerData: CareerItem[];
  filteredAndSortedCareerData: CareerItem[];
  highestHourlyRate: number;
  setFormVisible: (visible: boolean) => void;
  filterRole: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

// 기간을 표시하는 헬퍼 함수 (중첩된 삼항 연산자를 피하기 위함)
const renderDuration = (years: number, months: number) => {
  if (years > 0) {
    const yearText = `${years}y`;
    return months > 0 ? `${yearText} ${months}m` : yearText;
  }
  return months > 0 ? `${months}m` : '< 1m';
};

/** Professional Chart Tooltip */
function CustomLineTooltip({
  active,
  payload,
  theme = 'light',
}: TooltipProps<any, any> & { theme?: 'light' | 'dark' }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <div
      className={`${
        theme === 'light' 
          ? 'bg-white border-slate-200 shadow-lg' 
          : 'bg-slate-800 border-slate-600 shadow-xl'
      } border rounded-lg p-3 text-xs max-w-xs`}
    >
      <div className={`font-semibold mb-2 ${
        theme === 'light' ? 'text-slate-800' : 'text-slate-200'
      }`}>
        {data.role}
        {data.specialty && (
          <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
            theme === 'light' ? 'bg-slate-100 text-slate-600' : 'bg-slate-700 text-slate-400'
          }`}>
            {data.specialty}
          </span>
        )}
      </div>
      
      <div className={`mb-2 ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>
        {data.facility}
      </div>
      
      <div className={`text-xs mb-2 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
        {data.startDate ? dayjs(data.startDate).format('MMM YYYY') : ''} - {data.endDate ? dayjs(data.endDate).format('MMM YYYY') : 'Present'}
      </div>
      
      <div className={`font-bold text-sm px-2 py-1 rounded ${
        theme === 'light' 
          ? 'bg-emerald-50 text-emerald-700' 
          : 'bg-emerald-900/30 text-emerald-400'
      }`}>
        ${data.hourlyRate.toFixed(2)}/hour
      </div>
    </div>
  );
}

export default function CareerTimeline({
  theme,
  careerData,
  filteredAndSortedCareerData,
  highestHourlyRate,
  setFormVisible,
  filterRole,
  onEdit,
  onDelete
}: CareerTimelineProps) {
  const bgClass = theme === 'light' ? 'bg-white' : 'bg-slate-700';
  const borderClass = theme === 'light' ? 'border-slate-200' : 'border-slate-600';
  
  // Chart data preparation
  const lineData = filteredAndSortedCareerData.map((item, index) => ({
    ...item,
    xLabel: item.role.length > 8 ? `${item.role.slice(0, 8)}...` : item.role,
    index: index + 1,
  }));
  
  const chartGridColor = theme === 'light' ? '#e2e8f0' : '#475569';
  const chartTextColor = theme === 'light' ? '#64748b' : '#cbd5e1';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`mb-6 ${bgClass} border ${borderClass} rounded-xl shadow-lg overflow-hidden`}
    >
      <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b ${
        theme === 'light' 
          ? 'bg-slate-50 border-slate-200' 
          : 'bg-slate-800 border-slate-600'
      }`}>
        <h3 className={`text-lg sm:text-xl font-bold flex items-center gap-2 sm:gap-3 ${
          theme === 'light' ? 'text-slate-800' : 'text-slate-100'
        }`}>
          <div className={`p-1.5 sm:p-2 rounded-lg ${
            theme === 'light' ? 'bg-slate-600' : 'bg-slate-700'
          }`}>
            <History className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          My Career Journey
          {filteredAndSortedCareerData.length > 0 && (
            <span className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-lg ${
              theme === 'light' 
                ? 'bg-slate-200 text-slate-700' 
                : 'bg-slate-700 text-slate-300'
            }`}>
              {filteredAndSortedCareerData.length} positions
            </span>
          )}
        </h3>
        <p className={`text-sm mt-1 font-medium ${
          theme === 'light' ? 'text-slate-600' : 'text-slate-300'
        }`}>
          Professional career progression and development
        </p>
      </div>

      {filteredAndSortedCareerData.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-16 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
              theme === 'light' 
                ? 'bg-gradient-to-br from-blue-100 to-purple-100' 
                : 'bg-gradient-to-br from-blue-900/30 to-purple-900/30'
            }`}
          >
            <MapPin className={`w-12 h-12 ${
              theme === 'light' ? 'text-blue-500' : 'text-blue-400'
            }`} />
          </motion.div>
          <h3 className={`text-lg sm:text-xl font-bold mb-2 ${
            theme === 'light' ? 'text-gray-800' : 'text-gray-200'
          }`}>
            {careerData.length === 0 ? 'Start Your Journey!' : 'No matching positions'}
          </h3>
          <p className={`text-sm mb-6 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {careerData.length === 0 
              ? 'Add your work experience to see your amazing career progression'
              : `No positions found matching "${filterRole}". Try a different search.`}
          </p>
          {careerData.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setFormVisible(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-lg transition-all"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Add Your First Job
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="flex flex-col lg:grid lg:grid-cols-2">
          {/* Timeline */}
          <div className={`p-4 sm:p-6 lg:border-r ${
            theme === 'light' ? 'lg:border-slate-200' : 'lg:border-slate-600'
          }`}>
            <div
              className={`relative pl-6 sm:pl-8 space-y-4 sm:space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-0 before:h-full before:w-0.5 ${theme === 'light' ? 'before:bg-slate-300' : 'before:bg-slate-600'}`}
            >
              {filteredAndSortedCareerData.map((item, index) => {
                const startDate = dayjs(item.startDate);
                const endDate = item.endDate ? dayjs(item.endDate) : dayjs();
                const durationMonths = endDate.diff(startDate, 'month');
                const durationYears = Math.floor(durationMonths / 12);
                const remainingDurationMonths = durationMonths % 12;
                const ongoing = !item.endDate;

                // 과거/현재 구분 - 전문적인 색상
                let markerColor;
                let markerIcon;
                
                if (ongoing) {
                  // 현재 진행중
                  markerColor = 'bg-emerald-600';
                  markerIcon = <Clock className="w-4 h-4 text-white" />;
                } else {
                  // 과거 경험 - 완료된 상태
                  markerColor = 'bg-slate-500';
                  markerIcon = <Check className="w-4 h-4 text-white" />;
                }

                return (
                  <div key={item.id} className="relative">
                    {/* Timeline marker */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full ${markerColor} flex items-center justify-center shadow-md ring-2 ${
                        ongoing 
                          ? theme === 'light' ? 'ring-blue-100' : 'ring-blue-800'
                          : theme === 'light' 
                            ? 'ring-white' 
                            : 'ring-slate-800'
                      }`}
                    >
                      {React.cloneElement(markerIcon, { className: "w-3 h-3 sm:w-4 sm:h-4 text-white" })}
                    </div>

                    {/* Content */}
                    <div
                      className={`p-3 sm:p-4 rounded-lg border ${
                        ongoing
                          ? theme === 'light'
                            ? 'border-emerald-200 bg-emerald-50 shadow-sm'
                            : 'border-emerald-600 bg-emerald-900/10 shadow-sm'
                          : theme === 'light'
                            ? 'border-gray-200 bg-white shadow-sm'
                            : 'border-slate-600 bg-slate-800/50 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="space-y-2">
                            <h4 className={`text-base sm:text-lg font-bold flex items-center gap-2 ${
                              theme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                              <Award className={`w-4 h-4 ${
                                ongoing ? 'text-blue-500' : theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                              }`} />
                              {item.role}
                              {ongoing && (
                                <span className={`text-xs px-2 py-1 rounded font-medium ${
                                  theme === 'light' 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : 'bg-emerald-900/50 text-emerald-300'
                                }`}>
                                  Current
                                </span>
                              )}
                            </h4>
                            {item.specialty && (
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                theme === 'light' 
                                  ? 'bg-slate-100 text-slate-700' 
                                  : 'bg-slate-700 text-slate-300'
                              }`}>
                                <Briefcase className="w-3 h-3" />
                                {item.specialty}
                              </div>
                            )}
                            <div className={`flex items-center gap-2 text-sm ${
                              theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                            }`}>
                              <MapPin className="w-4 h-4" />
                              {item.facility}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex space-x-1">
                          <button
                            type="button"
                            onClick={() => onEdit(item.id)}
                            className={`p-1 ${theme === 'light' ? 'text-gray-400 hover:text-slate-600' : 'text-gray-500 hover:text-slate-300'} rounded`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(item.id)}
                            className={`p-1 ${theme === 'light' ? 'text-gray-400 hover:text-red-600' : 'text-gray-500 hover:text-red-400'} rounded`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className={`flex items-center gap-2 text-sm ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          <Clock className="w-4 h-4" />
                          <span>
                            {startDate.format('MMM YYYY')} - {ongoing ? 'Present' : endDate.format('MMM YYYY')}
                          </span>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            theme === 'light' ? 'bg-slate-100 text-slate-600' : 'bg-slate-700 text-slate-400'
                          }`}>
                            {renderDuration(durationYears, remainingDurationMonths)}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg ${
                            theme === 'light' 
                              ? 'bg-slate-100 text-slate-700' 
                              : 'bg-slate-700 text-slate-200'
                          }`}>
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs sm:text-sm font-bold">
                              ${item.hourlyRate.toFixed(2)}/hr
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {item.hourlyRate === highestHourlyRate && (
                              <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                theme === 'light' 
                                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                                  : 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                              }`}>
                                <Star className="w-3 h-3 fill-current" />
                                Peak Rate
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {index < filteredAndSortedCareerData.length - 1 && (
                        <div className={`mt-3 pt-3 border-t flex items-center text-xs ${
                          theme === 'light' ? 'border-slate-100 text-slate-500' : 'border-slate-600 text-slate-400'
                        }`}>
                          <ArrowRight className="w-3 h-3 mr-2" />
                          {(() => {
                            const nextItem = filteredAndSortedCareerData[index + 1];
                            const gap = dayjs(nextItem.startDate).diff(endDate, 'month');
                            return gap > 1 ? (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                theme === 'light' ? 'bg-orange-100 text-orange-700' : 'bg-orange-900/30 text-orange-400'
                              }`}>
                                {gap} month{gap > 1 ? 's' : ''} gap
                              </span>
                            ) : (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-900/30 text-green-400'
                              }`}>
                                Continuous
                              </span>
                            );
                          })()} 
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Career Progression Chart - Hidden on mobile */}
          <div className={`hidden lg:block p-4 sm:p-6 ${
            theme === 'light' ? 'bg-white' : 'bg-slate-800'
          }`}>
            <div className="mb-4">
              <h4 className={`text-lg font-bold mb-1 ${
                theme === 'light' ? 'text-slate-800' : 'text-slate-200'
              }`}>
                Career Progression Chart
              </h4>
              <p className={`text-sm font-medium ${
                theme === 'light' ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Hourly rate development over time
              </p>
            </div>
            
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineData}
                  margin={{ top: 20, right: 20, bottom: 40, left: 30 }}
                >
                  <CartesianGrid
                    strokeDasharray="2 2"
                    stroke={theme === 'light' ? '#e2e8f0' : '#475569'}
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="xLabel"
                    tick={{ 
                      fill: theme === 'light' ? '#64748b' : '#94a3b8', 
                      fontSize: 11,
                      fontWeight: 500
                    }}
                    axisLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#64748b' }}
                    tickLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#64748b' }}
                  />
                  <YAxis
                    tick={{ 
                      fill: theme === 'light' ? '#64748b' : '#94a3b8', 
                      fontSize: 11,
                      fontWeight: 500
                    }}
                    axisLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#64748b' }}
                    tickLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#64748b' }}
                    label={{
                      value: 'Hourly Rate ($)',
                      angle: -90,
                      position: 'insideLeft',
                      style: { 
                        fill: theme === 'light' ? '#64748b' : '#94a3b8', 
                        fontSize: 11,
                        fontWeight: 500,
                        textAnchor: 'middle'
                      }
                    }}
                  />
                  <Tooltip content={<CustomLineTooltip theme={theme} />} />
                  <Line
                    type="monotone"
                    dataKey="hourlyRate"
                    stroke={theme === 'light' ? '#059669' : '#10b981'}
                    strokeWidth={2.5}
                    dot={{
                      r: 4,
                      fill: theme === 'light' ? '#059669' : '#10b981',
                      strokeWidth: 2,
                      stroke: theme === 'light' ? '#ffffff' : '#1f2937'
                    }}
                    activeDot={{
                      r: 6,
                      fill: theme === 'light' ? '#047857' : '#34d399',
                      strokeWidth: 2,
                      stroke: theme === 'light' ? '#ffffff' : '#1f2937'
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Career Statistics */}
            <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg border ${
              theme === 'light' 
                ? 'bg-slate-50 border-slate-200' 
                : 'bg-slate-700 border-slate-600'
            }`}>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className={`text-[10px] sm:text-xs font-medium mb-1 ${
                    theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    Growth Rate
                  </div>
                  <div className={`text-base sm:text-lg font-bold ${
                    theme === 'light' ? 'text-slate-800' : 'text-slate-200'
                  }`}>
                    {lineData.length > 1 ? (
                      `+${(((lineData[lineData.length - 1].hourlyRate - lineData[0].hourlyRate) / lineData[0].hourlyRate) * 100).toFixed(1)}%`
                    ) : '0%'}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-[10px] sm:text-xs font-medium mb-1 ${
                    theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    Rate Increase
                  </div>
                  <div className={`text-base sm:text-lg font-bold ${
                    theme === 'light' ? 'text-slate-800' : 'text-slate-200'
                  }`}>
                    {lineData.length > 1 ? (
                      `+$${(lineData[lineData.length - 1].hourlyRate - lineData[0].hourlyRate).toFixed(2)}/hr`
                    ) : '$0/hr'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}