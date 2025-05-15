// components/NurseDashboard/UserProfileCard.tsx
import React from 'react';
import { Award, Smile, Star, Stethoscope, User } from 'lucide-react';

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
  return (
    <div
      className={`${
        theme === 'light' ? 'bg-white' : 'bg-slate-700'
      } rounded-2xl shadow-lg p-6 mb-6 relative border ${
        theme === 'light' ? 'border-emerald-100' : 'border-slate-600'
      }`}
    >
      {/* "AI Personalized" Ribbon */}
      <div className="absolute top-0 right-0 bg-gradient-to-bl from-emerald-400 to-cyan-500 text-white px-3 py-1 rounded-bl-lg flex items-center">
        <Star className="w-4 h-4 mr-1" />
        <span className="text-xs font-medium">AI Personalized</span>
      </div>

      <div className="flex flex-wrap">
        {/* Profile Image */}
        <div className="w-full md:w-1/4 flex justify-center mb-4 md:mb-0">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-emerald-100 to-cyan-100 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin-slow" />
            <User className="w-16 h-16 text-emerald-500" />
          </div>
        </div>

        {/* Info */}
        <div className="w-full md:w-3/4 md:pl-6 space-y-2">
          <h2
            className={`text-2xl font-bold flex items-center ${
              theme === 'light' ? 'text-emerald-700' : ''
            }`}
          >
            {userProfile.name}
            <div
              className={`ml-2 ${
                theme === 'light' ? 'bg-emerald-100' : 'bg-slate-600'
              } p-1 rounded-full`}
            >
              <Award className="w-4 h-4 text-emerald-500" />
            </div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="flex items-center">
                <span className="font-semibold w-24">Role:</span>
                <span className="flex items-center">
                  {userProfile.role}
                  <Stethoscope className="w-4 h-4 ml-1 text-emerald-500" />
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-24">Specialty:</span>
                <span>{userProfile.specialty}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-24">Education:</span>
                <span>{userProfile.education}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center">
                <span className="font-semibold w-24">Org:</span>
                <span>{userProfile.organization}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-24">Location:</span>
                <span>{userProfile.location}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-24">Experience:</span>
                <span className="flex items-center">
                  {userProfile.experience}
                  <Award className="w-4 h-4 ml-1 text-yellow-500" />
                </span>
              </div>
            </div>
          </div>

          <div
            className={`${
              theme === 'light'
                ? 'bg-emerald-50 border-emerald-100'
                : 'bg-slate-600 border-slate-500'
            } border rounded-2xl p-4 text-sm flex items-start mt-2`}
          >
            <div
              className={`bg-white p-2 rounded-full mr-3 flex-shrink-0 ${
                theme === 'light' ? '' : 'border border-slate-400'
              }`}
            >
              <Smile className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <span className="font-medium">AI Advisor:</span> You’re on track
              for a 3-5% raise soon. Consider trauma specialization for +8-12%
              market value.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
