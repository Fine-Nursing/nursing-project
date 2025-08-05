// components/NurseDashboard/UserProfileCard.tsx
import React from 'react';
import { Award, Smile, Star, Stethoscope, User } from 'lucide-react';
import { useAiInsight } from 'src/api/useAiInsights';

interface UserProfile {
  name: string;
  role: string;
  specialty: string;
  education: string;
  organization: string;
  location: string;
  experience: string;
}

interface UserProfileCardProps {
  userProfile: UserProfile;
  theme: 'light' | 'dark';
}

export default function UserProfileCard({
  userProfile,
  theme,
}: UserProfileCardProps) {
  const { data: careerInsight, isLoading } = useAiInsight('career');
  return (
    <div
      className={`${
        theme === 'light' ? 'bg-white' : 'bg-slate-700'
      } rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 relative border ${
        theme === 'light' ? 'border-slate-100' : 'border-slate-600'
      }`}
    >
      {/* "AI Personalized" Ribbon */}
      <div className="absolute top-0 right-0 bg-gradient-to-bl from-slate-400 to-cyan-500 text-white px-2 sm:px-3 py-1 rounded-bl-lg flex items-center">
        <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
        <span className="text-xs font-medium">AI Personalized</span>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Profile Image */}
        <div className="w-full sm:w-1/4 flex justify-center mb-4 sm:mb-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-slate-100 to-cyan-100 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200 border-t-slate-500 animate-spin-slow" />
            <User className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500" />
          </div>
        </div>

        {/* Info */}
        <div className="w-full sm:w-3/4 sm:pl-4 lg:pl-6 space-y-2">
          <h2
            className={`text-lg sm:text-xl lg:text-2xl font-bold flex items-center justify-center sm:justify-start ${
              theme === 'light' ? 'text-slate-700' : ''
            }`}
          >
            {userProfile.name}
            <div
              className={`ml-2 ${
                theme === 'light' ? 'bg-slate-100' : 'bg-slate-600'
              } p-1 rounded-full`}
            >
              <Award className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
            </div>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm sm:text-base">
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-semibold w-20 sm:w-24 text-xs sm:text-sm">Role:</span>
                <span className="flex items-center">
                  {userProfile.role}
                  <Stethoscope className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-slate-500" />
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-semibold w-20 sm:w-24 text-xs sm:text-sm">Specialty:</span>
                <span className="truncate">{userProfile.specialty}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-semibold w-20 sm:w-24 text-xs sm:text-sm">Education:</span>
                <span className="truncate">{userProfile.education}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-semibold w-20 sm:w-24 text-xs sm:text-sm">Org:</span>
                <span className="truncate">{userProfile.organization}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-semibold w-20 sm:w-24 text-xs sm:text-sm">Location:</span>
                <span className="truncate">{userProfile.location}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-semibold w-20 sm:w-24 text-xs sm:text-sm">Experience:</span>
                <span className="flex items-center">
                  {userProfile.experience}
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-yellow-500" />
                </span>
              </div>
            </div>
          </div>

          <div
            className={`${
              theme === 'light'
                ? 'bg-slate-50 border-slate-100'
                : 'bg-slate-600 border-slate-500'
            } border rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-start mt-2 gap-3`}
          >
            <div
              className={`bg-white p-2 rounded-full flex-shrink-0 self-center sm:self-start ${
                theme === 'light' ? '' : 'border border-slate-400'
              }`}
            >
              <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
            </div>
            <div className="text-center sm:text-left">
              <span className="font-medium">AI Advisor:</span> {(() => {
                if (isLoading) {
                  return <span className="text-slate-400">Loading insights...</span>;
                }
                if (careerInsight?.insight) {
                  return <span className="leading-relaxed">{careerInsight.insight}</span>;
                }
                return <span className="leading-relaxed">You&apos;re on track for a 3-5% raise soon. Consider trauma specialization for +8-12% market value.</span>;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
