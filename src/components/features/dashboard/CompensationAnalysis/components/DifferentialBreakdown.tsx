import React from 'react';
import { Moon, Calendar, Activity, Heart, Shield, Brain, Baby, AlertTriangle, Plus } from 'lucide-react';
import type { UserProfile, DifferentialDetail } from '../types';

interface DifferentialBreakdownProps {
  theme: 'light' | 'dark';
  isEditing: boolean;
  editedProfile: UserProfile;
  setEditedProfile: (profile: UserProfile) => void;
  differentialAmounts?: Array<DifferentialDetail & { monthlyAmount: number }>;
}

export function DifferentialBreakdown({
  theme,
  isEditing,
  editedProfile,
  setEditedProfile,
  differentialAmounts = []
}: DifferentialBreakdownProps) {
  const getIcon = (type: string) => {
    const iconMap: Record<string, React.ElementType> = {
      'night': Moon,
      'weekend': Calendar,
      'critical_care': Activity,
      'trauma': AlertTriangle,
      'pediatric': Baby,
      'cardiac': Heart,
      'emergency': Shield,
      'neuro': Brain,
      'oncology': Shield,
      'other': Activity
    };
    return iconMap[type] || Activity;
  };

  const getIconColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'night': 'emerald',
      'weekend': 'emerald',
      'critical_care': 'orange',
      'trauma': 'red',
      'pediatric': 'purple',
      'cardiac': 'red',
      'emergency': 'orange',
      'neuro': 'indigo',
      'oncology': 'pink',
      'other': 'blue'
    };
    return colorMap[type] || 'gray';
  };

  return (
    <div>
      <h3 className={`text-sm font-semibold mb-3 ${
        theme === 'light' ? 'text-gray-700' : 'text-gray-300'
      }`}>
        Active Differentials
      </h3>
      
      <div className={`rounded-lg border divide-y ${
        theme === 'light' 
          ? 'bg-gray-50 border-gray-200 divide-gray-200' 
          : 'bg-slate-900/30 border-slate-700 divide-slate-700'
      }`}>
        {differentialAmounts.length > 0 ? (
          differentialAmounts.map((differential, index) => (
            <DifferentialItem
              key={differential.type}
              theme={theme}
              isEditing={isEditing}
              icon={getIcon(differential.type)}
              iconColor={getIconColor(differential.type)}
              title={differential.label}
              description={differential.description}
              value={differential.value}
              monthlyAmount={differential.monthlyAmount}
              onChange={(value) => {
                const newDifferentials = [...editedProfile.differentials];
                newDifferentials[index] = { ...newDifferentials[index], value };
                setEditedProfile({
                  ...editedProfile,
                  differentials: newDifferentials
                });
              }}
            />
          ))
        ) : (
          <div className="p-4 text-center">
            <p className={`text-sm ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              No active differentials
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface DifferentialItemProps {
  theme: 'light' | 'dark';
  isEditing: boolean;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  value: number;
  monthlyAmount: number;
  onChange: (value: number) => void;
}

function DifferentialItem({
  theme,
  isEditing,
  icon: Icon,
  iconColor,
  title,
  description,
  value,
  monthlyAmount,
  onChange
}: DifferentialItemProps) {
  const borderColor = iconColor === 'orange' ? 'orange' : 'indigo';
  
  return (
    <div className="p-3 sm:p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          theme === 'light' ? `bg-${iconColor}-100` : `bg-${iconColor}-900/50`
        }`}>
          <Icon className={`w-4 h-4 text-${iconColor}-600 dark:text-${iconColor}-400`} />
        </div>
        <div>
          <p className={`text-sm font-medium ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            {title}
          </p>
          <p className={`text-xs ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {description}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Plus className="w-3 h-3 text-gray-400" />
            <span className="text-sm">$</span>
            <input
              type="number"
              step="0.5"
              value={value}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              className={`w-12 text-center font-semibold bg-transparent border-b ${
                theme === 'light' 
                  ? 'border-gray-300 text-gray-900' 
                  : 'border-slate-600 text-white'
              } focus:outline-none focus:border-${borderColor}-500`}
            />
            <span className="text-sm">/hr</span>
          </div>
        ) : (
          <div className="text-right">
            <p className={`text-sm font-semibold ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>
              +${value}/hr
            </p>
            <p className={`text-xs ${
              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
            }`}>
              ${monthlyAmount}/month
            </p>
          </div>
        )}
      </div>
    </div>
  );
}export default DifferentialBreakdown
