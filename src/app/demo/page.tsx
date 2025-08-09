'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Trash2, Edit, Home, Settings, User, Bell, DollarSign, Award, Clock, Briefcase, Check } from 'lucide-react';

// 우리가 만든 컴포넌트들 import
import { AnimatedButton, AnimatedIconButton, FloatingActionButton } from 'src/components/common/AnimatedButton';
import { SkeletonLoader, DashboardSkeleton, LoadingSpinner, ProgressBar } from 'src/components/common/SkeletonLoader';
import { AnimatedSalary, AnimatedStatCard } from 'src/components/common/AnimatedNumber';
import { AnimatedTimeline } from 'src/components/common/AnimatedTimeline';
import { ThemeToggle, ThemeSwitch } from 'src/components/common/ThemeToggle';
import { AnimatedTable, AnimatedDataTransition } from 'src/components/common/AnimatedTable';

// 새로운 컴포넌트들
import { AnimatedRadarChart } from 'src/components/common/AnimatedRadarChart';
import { AnimatedProfileCard } from 'src/components/common/AnimatedProfileCard';
import { AnimatedCalendar } from 'src/components/common/AnimatedCalendar';
import { AnimatedShiftCard } from 'src/components/common/AnimatedShiftCard';
import { AnimatedToast, notify } from 'src/components/common/AnimatedNotification';
import { AnimatedLineChart, AnimatedBarChart } from 'src/components/common/AnimatedChart';
import { AnimatedAccordion } from 'src/components/common/AnimatedAccordion';
import { AnimatedBadge, StatusBadge, AchievementBadge } from 'src/components/common/AnimatedBadge';
import { AnimatedModal, ConfirmationModal } from 'src/components/common/AnimatedModal';
import { AnimatedTabs } from 'src/components/common/AnimatedTabs';
import { AnimatedTypingText, AdvancedTypingText } from 'src/components/common/AnimatedTypingText';
import { AnimatedProgressBar, CircularProgressBar, StepProgressBar } from 'src/components/common/AnimatedProgressBar';
import { AnimatedCompensationCard } from 'src/components/common/AnimatedCompensationCard';

import { fadeInUp, staggerContainer, staggerItem, scaleIn, float, pulse } from 'src/styles/animations';

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(30);
  const [showTable, setShowTable] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);
  
  // Sample timeline data
  const timelineItems = [
    {
      id: '1',
      title: 'Started as RN',
      subtitle: 'Cedar Hospital',
      description: 'Began my nursing career in ICU',
      date: 'Jan 2020',
      status: 'completed' as const,
    },
    {
      id: '2',
      title: 'Senior Nurse',
      subtitle: 'Promotion',
      description: 'Promoted to senior position',
      date: 'Jun 2021',
      status: 'completed' as const,
    },
    {
      id: '3',
      title: 'Charge Nurse',
      subtitle: 'Current Role',
      description: 'Leading night shift team',
      date: 'Mar 2023',
      status: 'current' as const,
    },
    {
      id: '4',
      title: 'Nurse Manager',
      subtitle: 'Goal',
      description: 'Next career milestone',
      date: '2024',
      status: 'upcoming' as const,
    },
  ];
  
  // Sample table data
  const tableData = [
    { id: '1', name: 'John Doe', role: 'RN', department: 'ICU', salary: 75000, experience: 5 },
    { id: '2', name: 'Jane Smith', role: 'NP', department: 'Emergency', salary: 95000, experience: 8 },
    { id: '3', name: 'Mike Johnson', role: 'LPN', department: 'Surgery', salary: 55000, experience: 3 },
    { id: '4', name: 'Sarah Williams', role: 'RN', department: 'Pediatrics', salary: 70000, experience: 4 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 p-8">
      {/* Theme Toggle - 우측 상단 고정 */}
      <div className="fixed top-4 right-4 z-50 flex gap-4">
        <ThemeSwitch />
        <ThemeToggle />
      </div>
      
      {/* 페이지 헤더 */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4">
          Nurse Journey - Component Showcase
        </h1>
        <p className="text-gray-600">View all animation components in one place</p>
      </motion.div>
      
      {/* NEW: 숫자 애니메이션 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          📊 Animated Numbers & Stats
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatedStatCard
            title="Total Experience"
            value={8.5}
            suffix=" years"
            decimals={1}
            icon={<Briefcase className="w-5 h-5 text-primary-600" />}
          />
          
          <AnimatedStatCard
            title="Current Salary"
            value={85000}
            prefix="$"
            change={12.5}
            icon={<DollarSign className="w-5 h-5 text-green-600" />}
          />
          
          <AnimatedStatCard
            title="Patient Satisfaction"
            value={98.7}
            suffix="%"
            decimals={1}
            change={5.2}
            icon={<Award className="w-5 h-5 text-yellow-600" />}
          />
          
          <AnimatedStatCard
            title="Hours Worked"
            value={2340}
            suffix=" hrs"
            change={-8.3}
            icon={<Clock className="w-5 h-5 text-blue-600" />}
          />
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold mb-4">Salary Comparisons</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Your Current Rate</p>
              <AnimatedSalary value={41} period="hour" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Market Average</p>
              <AnimatedSalary value={38} period="hour" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Annual Projection</p>
              <AnimatedSalary value={85280} period="year" />
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* NEW: Timeline 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          📅 Career Timeline
        </h2>
        
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h3 className="font-semibold mb-4">Vertical Timeline</h3>
          <AnimatedTimeline items={timelineItems} orientation="vertical" />
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold mb-4">Horizontal Timeline</h3>
          <AnimatedTimeline items={timelineItems} orientation="horizontal" />
        </div>
      </motion.section>
      
      {/* NEW: Data Table 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          📋 Animated Data Table
        </h2>
        
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowTable(!showTable)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Toggle Table ({showTable ? 'Hide' : 'Show'})
          </button>
        </div>
        
        <AnimatedDataTransition
          isLoading={false}
          isEmpty={!showTable}
          emptyMessage="Click the button above to show the table"
        >
          {showTable && (
            <AnimatedTable
              data={tableData}
              columns={[
                { key: 'name', header: 'Name', sortable: true },
                { key: 'role', header: 'Role', sortable: true },
                { key: 'department', header: 'Department', sortable: true },
                { 
                  key: 'salary', 
                  header: 'Salary', 
                  sortable: true,
                  render: (value) => `$${value.toLocaleString()}`
                },
                { 
                  key: 'experience', 
                  header: 'Experience', 
                  sortable: true,
                  render: (value) => `${value} years`
                },
              ]}
              keyExtractor={(item) => item.id}
              onRowClick={(item) => notify.info('Row Clicked', `Clicked on ${item.name}`)}
            />
          )}
        </AnimatedDataTransition>
      </motion.section>

      {/* 섹션 1: 애니메이션 버튼들 */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-12"
      >
        <motion.h2 variants={staggerItem} className="text-2xl font-bold text-primary-800 mb-6">
          1. Animated Buttons
        </motion.h2>
        
        <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnimatedButton variant="primary" icon={<Plus className="w-4 h-4" />}>
            Primary
          </AnimatedButton>
          
          <AnimatedButton variant="secondary" icon={<Save className="w-4 h-4" />}>
            Secondary
          </AnimatedButton>
          
          <AnimatedButton variant="accent" icon={<Edit className="w-4 h-4" />}>
            Accent
          </AnimatedButton>
          
          <AnimatedButton variant="danger" icon={<Trash2 className="w-4 h-4" />}>
            Danger
          </AnimatedButton>
          
          <AnimatedButton variant="ghost" size="lg">
            Ghost Large
          </AnimatedButton>
          
          <AnimatedButton 
            variant="primary" 
            isLoading={isLoading}
            onClick={() => setIsLoading(!isLoading)}
          >
            {isLoading ? 'Loading...' : 'Click Me'}
          </AnimatedButton>
          
          <AnimatedButton variant="secondary" size="sm">
            Small Button
          </AnimatedButton>
          
          <AnimatedButton variant="accent" fullWidth>
            Full Width
          </AnimatedButton>
        </motion.div>

        {/* Icon Buttons */}
        <motion.div variants={staggerItem} className="flex gap-4 mt-6">
          <AnimatedIconButton icon={<Home className="w-5 h-5" />} />
          <AnimatedIconButton icon={<Settings className="w-5 h-5" />} variant="ghost" />
          <AnimatedIconButton icon={<User className="w-5 h-5" />} variant="ghost" />
          <AnimatedIconButton icon={<Bell className="w-5 h-5" />} variant="ghost" />
        </motion.div>
      </motion.section>

      {/* 섹션 2: 로딩 상태들 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          2. Loading States
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Text Skeleton */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold mb-4">Text Skeleton</h3>
            <SkeletonLoader variant="text" count={3} />
          </div>

          {/* Card Skeleton */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold mb-4">Card Skeleton</h3>
            <SkeletonLoader variant="card" />
          </div>

          {/* Avatar Skeleton */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold mb-4">Avatar Skeleton</h3>
            <SkeletonLoader variant="avatar" count={2} />
          </div>

          {/* Chart Skeleton */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold mb-4">Chart Skeleton</h3>
            <SkeletonLoader variant="chart" />
          </div>

          {/* Table Skeleton */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold mb-4">Table Skeleton</h3>
            <SkeletonLoader variant="table" />
          </div>

          {/* Loading Spinners */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold mb-4">Loading Spinners</h3>
            <div className="flex items-center justify-around">
              <LoadingSpinner size="sm" />
              <LoadingSpinner size="md" />
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-semibold mb-4">Progress Bar</h3>
          <ProgressBar progress={progress} />
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => setProgress(Math.max(0, progress - 10))}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              -10%
            </button>
            <button
              type="button"
              onClick={() => setProgress(Math.min(100, progress + 10))}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              +10%
            </button>
          </div>
        </div>
      </motion.section>

      {/* 섹션 3: 애니메이션 효과들 */}
      <motion.section
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          3. Animation Effects
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Scale In */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-lg cursor-pointer"
          >
            <h3 className="font-semibold text-primary-700">Scale Animation</h3>
            <p className="text-gray-600 mt-2">Hover me to see scale effect</p>
          </motion.div>

          {/* Floating */}
          <motion.div
            animate={float.animate}
            className="bg-gradient-to-br from-primary-400 to-accent-400 text-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="font-semibold">Floating Effect</h3>
            <p className="mt-2">Automatically moves up and down</p>
          </motion.div>

          {/* Pulse */}
          <motion.div
            animate={pulse.animate}
            className="bg-gradient-to-br from-secondary-400 to-secondary-600 text-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="font-semibold">Pulse Effect</h3>
            <p className="mt-2">Continuous pulse animation</p>
          </motion.div>
        </div>
      </motion.section>

      {/* 섹션 4: 색상 팔레트 */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          4. Healthcare Color Palette
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Primary Colors */}
          <div className="space-y-2">
            <h3 className="font-semibold">Primary (Trust)</h3>
            <div className="bg-primary-50 p-3 rounded">50</div>
            <div className="bg-primary-100 p-3 rounded">100</div>
            <div className="bg-primary-200 p-3 rounded">200</div>
            <div className="bg-primary-300 p-3 rounded">300</div>
            <div className="bg-primary-400 p-3 rounded text-white">400</div>
            <div className="bg-primary-500 p-3 rounded text-white">500</div>
            <div className="bg-primary-600 p-3 rounded text-white">600</div>
            <div className="bg-primary-700 p-3 rounded text-white">700</div>
            <div className="bg-primary-800 p-3 rounded text-white">800</div>
            <div className="bg-primary-900 p-3 rounded text-white">900</div>
          </div>

          {/* Secondary Colors */}
          <div className="space-y-2">
            <h3 className="font-semibold">Secondary (Growth)</h3>
            <div className="bg-secondary-50 p-3 rounded">50</div>
            <div className="bg-secondary-100 p-3 rounded">100</div>
            <div className="bg-secondary-200 p-3 rounded">200</div>
            <div className="bg-secondary-300 p-3 rounded">300</div>
            <div className="bg-secondary-400 p-3 rounded text-white">400</div>
            <div className="bg-secondary-500 p-3 rounded text-white">500</div>
            <div className="bg-secondary-600 p-3 rounded text-white">600</div>
            <div className="bg-secondary-700 p-3 rounded text-white">700</div>
            <div className="bg-secondary-800 p-3 rounded text-white">800</div>
            <div className="bg-secondary-900 p-3 rounded text-white">900</div>
          </div>

          {/* Accent Colors */}
          <div className="space-y-2">
            <h3 className="font-semibold">Accent (Care)</h3>
            <div className="bg-accent-50 p-3 rounded">50</div>
            <div className="bg-accent-100 p-3 rounded">100</div>
            <div className="bg-accent-200 p-3 rounded">200</div>
            <div className="bg-accent-300 p-3 rounded">300</div>
            <div className="bg-accent-400 p-3 rounded text-white">400</div>
            <div className="bg-accent-500 p-3 rounded text-white">500</div>
            <div className="bg-accent-600 p-3 rounded text-white">600</div>
            <div className="bg-accent-700 p-3 rounded text-white">700</div>
            <div className="bg-accent-800 p-3 rounded text-white">800</div>
            <div className="bg-accent-900 p-3 rounded text-white">900</div>
          </div>

          {/* Warm Colors */}
          <div className="space-y-2">
            <h3 className="font-semibold">Warm (Support)</h3>
            <div className="bg-warm-50 p-3 rounded">50</div>
            <div className="bg-warm-100 p-3 rounded">100</div>
            <div className="bg-warm-200 p-3 rounded">200</div>
            <div className="bg-warm-300 p-3 rounded">300</div>
            <div className="bg-warm-400 p-3 rounded">400</div>
            <div className="bg-warm-500 p-3 rounded text-white">500</div>
            <div className="bg-warm-600 p-3 rounded text-white">600</div>
            <div className="bg-warm-700 p-3 rounded text-white">700</div>
            <div className="bg-warm-800 p-3 rounded text-white">800</div>
            <div className="bg-warm-900 p-3 rounded text-white">900</div>
          </div>
        </div>
      </motion.section>

      {/* 전체 대시보드 스켈레톤 예시 */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          5. Full Dashboard Skeleton
        </h2>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <DashboardSkeleton />
        </div>
      </motion.section>

      {/* NEW: 레이더 차트 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          📊 Animated Radar Chart
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold mb-4">Skills Assessment</h3>
            <AnimatedRadarChart
              data={[
                { axis: 'Clinical Skills', value: 85 },
                { axis: 'Communication', value: 92 },
                { axis: 'Leadership', value: 78 },
                { axis: 'Technology', value: 88 },
                { axis: 'Patient Care', value: 95 },
                { axis: 'Teamwork', value: 90 },
              ]}
              comparisionData={[
                { axis: 'Clinical Skills', value: 75 },
                { axis: 'Communication', value: 80 },
                { axis: 'Leadership', value: 70 },
                { axis: 'Technology', value: 75 },
                { axis: 'Patient Care', value: 85 },
                { axis: 'Teamwork', value: 82 },
              ]}
              size={300}
            />
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold mb-4">Performance Metrics</h3>
            <AnimatedRadarChart
              data={[
                { axis: 'Efficiency', value: 88 },
                { axis: 'Quality', value: 92 },
                { axis: 'Safety', value: 96 },
                { axis: 'Innovation', value: 82 },
                { axis: 'Compliance', value: 94 },
              ]}
              size={300}
              colors={{
                primary: '#10b981',
                secondary: '#3b82f6',
                grid: '#e5e7eb',
                text: '#6b7280',
              }}
            />
          </div>
        </div>
      </motion.section>

      {/* NEW: 프로필 카드 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          👤 Animated Profile Cards
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatedProfileCard
            profile={{
              name: 'Sarah Johnson',
              title: 'Senior ICU Nurse',
              email: 'sarah.johnson@hospital.com',
              phone: '+1 (555) 123-4567',
              location: 'Seattle, WA',
              department: 'Intensive Care Unit',
              education: 'BSN - University of Washington',
              experience: '8 years',
              rating: 5,
              badges: ['ICU Certified', 'BLS', 'ACLS', 'Team Lead'],
            }}
            variant="default"
            onEdit={() => alert('Edit profile')}
          />
          
          <AnimatedProfileCard
            profile={{
              name: 'Michael Chen',
              title: 'Emergency Nurse',
              email: 'michael.chen@hospital.com',
              location: 'Portland, OR',
              department: 'Emergency Department',
              rating: 4,
              badges: ['TNCC', 'PALS', 'Trauma'],
            }}
            variant="compact"
          />
          
          <AnimatedProfileCard
            profile={{
              name: 'Emily Davis',
              title: 'Pediatric Nurse',
              email: 'emily.davis@hospital.com',
              location: 'Vancouver, BC',
              department: 'Pediatrics',
              education: 'MSN - UBC',
              experience: '12 years',
              rating: 5,
              badges: ['PICU', 'CPN', 'Educator'],
            }}
            variant="detailed"
          />
        </div>
      </motion.section>

      {/* NEW: 캘린더 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          📅 Animated Calendar
        </h2>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <AnimatedCalendar
            events={[
              {
                id: '1',
                date: new Date(2024, 11, 15),
                title: 'Day Shift',
                time: '7:00 AM',
                color: 'bg-blue-100 text-blue-700',
                type: 'shift',
              },
              {
                id: '2',
                date: new Date(2024, 11, 16),
                title: 'Night Shift',
                time: '7:00 PM',
                color: 'bg-purple-100 text-purple-700',
                type: 'shift',
              },
              {
                id: '3',
                date: new Date(2024, 11, 18),
                title: 'Training',
                time: '2:00 PM',
                color: 'bg-green-100 text-green-700',
                type: 'education',
              },
            ]}
            onDateSelect={() => {}}
            onEventClick={(event) => notify.info('Event Clicked', `Event: ${event.title}`)}
            onAddEvent={(date) => notify.info('Add Event', `Add event for ${date.toDateString()}`)}
          />
        </div>
      </motion.section>

      {/* NEW: 시프트 카드 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          🏥 Animated Shift Cards
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatedShiftCard
            shift={{
              id: '1',
              date: 'Dec 15, 2024',
              startTime: '7:00 AM',
              endTime: '7:00 PM',
              type: 'day',
              department: 'ICU',
              location: 'Floor 3',
              rate: 45,
              staffCount: 2,
              isUrgent: true,
              notes: 'High acuity patients expected',
            }}
            variant="default"
            onAccept={(shift) => notify.success('Shift Accepted', `Accepted shift: ${shift.id}`)}
            onDecline={(shift) => notify.error('Shift Declined', `Declined shift: ${shift.id}`)}
          />
          
          <AnimatedShiftCard
            shift={{
              id: '2',
              date: 'Dec 16, 2024',
              startTime: '7:00 PM',
              endTime: '7:00 AM',
              type: 'night',
              department: 'Emergency',
              location: 'Main Campus',
              rate: 52,
              staffCount: 3,
            }}
            variant="swipeable"
            onAccept={(shift) => notify.success('Shift Accepted', `Accepted shift: ${shift.id}`)}
            onDecline={(shift) => notify.error('Shift Declined', `Declined shift: ${shift.id}`)}
          />
          
          <AnimatedShiftCard
            shift={{
              id: '3',
              date: 'Dec 17, 2024',
              startTime: '3:00 PM',
              endTime: '11:00 PM',
              type: 'evening',
              department: 'Pediatrics',
              location: 'Children\'s Wing',
              rate: 48,
              staffCount: 1,
              notes: 'Specialized pediatric care required',
            }}
            variant="flippable"
            onFlip={(shift) => notify.info('Shift Flipped', `Flipped shift: ${shift.id}`)}
          />
        </div>
      </motion.section>

      {/* NEW: 알림 시스템 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          🔔 Animated Notifications
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => notify.success('Success!', 'Shift has been accepted successfully')}
            className="p-4 bg-green-500 text-white rounded-lg font-medium"
          >
            Success Notification
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => notify.error('Error!', 'Failed to process your request')}
            className="p-4 bg-red-500 text-white rounded-lg font-medium"
          >
            Error Notification
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => notify.warning('Warning!', 'Please review your schedule')}
            className="p-4 bg-yellow-500 text-white rounded-lg font-medium"
          >
            Warning Notification
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => notify.info('Info', 'New features are available')}
            className="p-4 bg-blue-500 text-white rounded-lg font-medium"
          >
            Info Notification
          </motion.button>
        </div>
        
        <AnimatedToast />
      </motion.section>

      {/* NEW: 차트 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          📈 Animated Charts
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatedLineChart
            data={[
              { month: 'Jan', salary: 75000, hours: 160 },
              { month: 'Feb', salary: 78000, hours: 168 },
              { month: 'Mar', salary: 82000, hours: 172 },
              { month: 'Apr', salary: 85000, hours: 180 },
              { month: 'May', salary: 88000, hours: 185 },
              { month: 'Jun', salary: 92000, hours: 190 },
            ]}
            xKey="month"
            yKeys={['salary', 'hours']}
            title="Salary & Hours Trend"
            height={300}
          />
          
          <AnimatedBarChart
            data={[
              { department: 'ICU', nurses: 45, satisfaction: 92 },
              { department: 'ER', nurses: 38, satisfaction: 88 },
              { department: 'Surgery', nurses: 32, satisfaction: 94 },
              { department: 'Pediatrics', nurses: 28, satisfaction: 96 },
            ]}
            xKey="department"
            yKeys={['nurses', 'satisfaction']}
            title="Department Statistics"
            height={300}
          />
        </div>
      </motion.section>

      {/* NEW: 아코디언 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          📋 Animated Accordion
        </h2>
        
        <AnimatedAccordion
          items={[
            {
              id: '1',
              title: 'Shift Requirements',
              icon: <Clock className="w-5 h-5 text-blue-500" />,
              content: (
                <div className="space-y-2">
                  <p>• Valid nursing license</p>
                  <p>• BLS certification required</p>
                  <p>• Minimum 2 years experience</p>
                  <p>• Ability to work weekends</p>
                </div>
              ),
            },
            {
              id: '2',
              title: 'Compensation Details',
              icon: <DollarSign className="w-5 h-5 text-green-500" />,
              content: (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Rate:</span>
                    <span className="font-medium">$42/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Night Differential:</span>
                    <span className="font-medium">$5/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekend Differential:</span>
                    <span className="font-medium">$3/hour</span>
                  </div>
                </div>
              ),
            },
            {
              id: '3',
              title: 'Benefits Package',
              icon: <Award className="w-5 h-5 text-purple-500" />,
              content: (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Health & Wellness</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Medical Insurance</li>
                      <li>• Dental Coverage</li>
                      <li>• Vision Care</li>
                      <li>• Mental Health Support</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Professional Development</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Continuing Education</li>
                      <li>• Conference Funding</li>
                      <li>• Certification Support</li>
                      <li>• Career Advancement</li>
                    </ul>
                  </div>
                </div>
              ),
            },
          ]}
          variant="bordered"
          allowMultiple
          defaultOpen={['1']}
        />
      </motion.section>

      {/* NEW: 뱃지 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          🏷️ Animated Badges
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Status Badges</h3>
            <div className="flex flex-wrap gap-3">
              <StatusBadge status="online" />
              <StatusBadge status="offline" />
              <StatusBadge status="busy" />
              <StatusBadge status="away" />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Achievement Badges</h3>
            <div className="flex flex-wrap gap-3">
              <AchievementBadge type="star" level={5} />
              <AchievementBadge type="crown" level={3} />
              <AchievementBadge type="shield" level={2} />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Animated Badges</h3>
            <div className="flex flex-wrap gap-3">
              <AnimatedBadge variant="primary" animation="pulse" icon={<Check className="w-3 h-3" />}>
                Certified
              </AnimatedBadge>
              <AnimatedBadge variant="success" animation="bounce" count={5}>
                New Messages
              </AnimatedBadge>
              <AnimatedBadge variant="warning" animation="glow" dot>
                Urgent
              </AnimatedBadge>
              <AnimatedBadge 
                variant="info" 
                animation="float"
                closable
                onClose={() => notify.info('Badge Closed', 'Badge was closed')}
              >
                Temporary
              </AnimatedBadge>
            </div>
          </div>
        </div>
      </motion.section>

      {/* NEW: 모달 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          🪟 Animated Modals
        </h2>
        
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium"
          >
            Open Modal
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowConfirmModal(true)}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium"
          >
            Confirmation Modal
          </motion.button>
        </div>
        
        <AnimatedModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Sample Modal"
          size="md"
          animation="scale"
        >
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              This is a sample modal with smooth animations. You can customize the size, 
              animation type, and behavior of the modal.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
              >
                Close
              </button>
              <button type="button" className="px-4 py-2 bg-primary-500 text-white rounded-lg">
                Save Changes
              </button>
            </div>
          </div>
        </AnimatedModal>
        
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => notify.success('Confirmed', 'Action was confirmed')}
          title="Confirm Action"
          message="Are you sure you want to proceed with this action?"
          variant="danger"
        />
      </motion.section>

      {/* NEW: 탭 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          📑 Animated Tabs
        </h2>
        
        <AnimatedTabs
          tabs={[
            {
              id: 'overview',
              label: 'Overview',
              icon: <Home className="w-4 h-4" />,
              content: (
                <div className="p-6 bg-white rounded-lg">
                  <h3 className="font-semibold mb-3">Dashboard Overview</h3>
                  <p className="text-gray-600">
                    Welcome to your nursing dashboard. Here you can manage your shifts, 
                    view your compensation, and track your career progress.
                  </p>
                </div>
              ),
            },
            {
              id: 'shifts',
              label: 'Shifts',
              icon: <Clock className="w-4 h-4" />,
              badge: 3,
              content: (
                <div className="p-6 bg-white rounded-lg">
                  <h3 className="font-semibold mb-3">Available Shifts</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">ICU Day Shift</div>
                      <div className="text-sm text-gray-600">Dec 15, 7:00 AM - 7:00 PM</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium">Emergency Night Shift</div>
                      <div className="text-sm text-gray-600">Dec 16, 7:00 PM - 7:00 AM</div>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 'profile',
              label: 'Profile',
              icon: <User className="w-4 h-4" />,
              content: (
                <div className="p-6 bg-white rounded-lg">
                  <h3 className="font-semibold mb-3">Profile Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
                      <input 
                        id="fullName"
                        type="text" 
                        defaultValue="Sarah Johnson"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label htmlFor="specialization" className="block text-sm font-medium mb-1">Specialization</label>
                      <select id="specialization" className="w-full p-2 border rounded-lg">
                        <option>ICU</option>
                        <option>Emergency</option>
                        <option>Surgery</option>
                        <option>Pediatrics</option>
                      </select>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
          variant="pills"
          fullWidth
        />
      </motion.section>

      {/* NEW: 타이핑 텍스트 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          ⌨️ Animated Typing Text
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold mb-4">Simple Typing</h3>
            <AnimatedTypingText
              text="Welcome to your nursing career dashboard!"
              speed={50}
              className="text-lg text-gray-700"
            />
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold mb-4">Multiple Texts</h3>
            <AdvancedTypingText
              texts={[
                "Manage your shifts efficiently",
                "Track your compensation growth",
                "Build your nursing career",
                "Connect with opportunities"
              ]}
              typingSpeed={60}
              deletingSpeed={40}
              className="text-lg text-primary-600 font-medium"
            />
          </div>
        </div>
      </motion.section>

      {/* NEW: 진행률 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          📊 Advanced Progress Bars
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold mb-4">Segmented Progress</h3>
              <AnimatedProgressBar
                progress={75}
                segments={[
                  { value: 30, color: '#3b82f6', label: 'Completed' },
                  { value: 25, color: '#10b981', label: 'In Progress' },
                  { value: 20, color: '#f59e0b', label: 'Pending' },
                ]}
                showLabel
                label="Project Progress"
                size="lg"
              />
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold mb-4">Step Progress</h3>
              <StepProgressBar
                currentStep={currentStep}
                totalSteps={4}
                steps={[
                  { label: 'Profile', description: 'Basic info' },
                  { label: 'Skills', description: 'Certifications' },
                  { label: 'Experience', description: 'Work history' },
                  { label: 'Review', description: 'Final check' },
                ]}
                size="md"
              />
              
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold mb-4">Circular Progress</h3>
              <div className="flex justify-center">
                <CircularProgressBar
                  progress={78}
                  size={160}
                  strokeWidth={12}
                  label="Completion"
                  color="#10b981"
                />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-semibold mb-4">Gradient Progress</h3>
              <div className="space-y-4">
                <AnimatedProgressBar
                  progress={85}
                  variant="gradient"
                  showLabel
                  label="Skills Assessment"
                  size="lg"
                />
                <AnimatedProgressBar
                  progress={92}
                  variant="glow"
                  showLabel
                  label="Patient Satisfaction"
                  color="#10b981"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* NEW: 보상 카드 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-primary-800 mb-6">
          💰 Animated Compensation Card
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatedCompensationCard
            data={{
              currentSalary: 85000,
              previousSalary: 78000,
              hourlyRate: 42,
              annualBonus: 5000,
              overtime: 12500,
              differentials: {
                night: 2400,
                weekend: 1800,
                holiday: 960,
                charge: 3200,
              },
              benefits: {
                health: 8400,
                dental: 1200,
                retirement: 5100,
                pto: 4800,
              },
              marketComparison: {
                average: 82000,
                percentile: 75,
              },
            }}
            variant="detailed"
            showComparison
            showBreakdown
            onViewDetails={() => notify.info('Details', 'View full compensation report')}
          />
          
          <AnimatedCompensationCard
            data={{
              currentSalary: 92000,
              hourlyRate: 45,
              overtime: 8750,
              differentials: {
                night: 3600,
                weekend: 2400,
                charge: 4800,
              },
            }}
            variant="compact"
          />
        </div>
      </motion.section>

      {/* Floating Action Button */}
      <FloatingActionButton 
        icon={<Plus className="w-6 h-6" />}
        onClick={() => notify.info('FAB Clicked!', 'Floating Action Button was clicked')}
      />
      
      <AnimatedToast />
    </div>
  );
}