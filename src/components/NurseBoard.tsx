'use client';

import React from 'react';
import NurseCard from './card/NurseCard';

function NurseBoard() {
  const nurses = [
    {
      title: 'Senior Nurse',
      subtitle: 'Join our ICU team and make a difference in critical care',
      className: 'bg-emerald-300',
      nurseInfo: {
        role: 'Senior Nurse',
        location: 'ICU Ward',
        salary: '$75,000/year',
        specialty: 'Critical Care',
        workDays: 'Mon-Thu',
        experience: '5 years',
        avatar: '👩‍⚕️',
      },
    },
    {
      title: 'Specialist Nurse',
      subtitle: 'Be part of our emergency response team',
      className: 'bg-blue-300',
      nurseInfo: {
        role: 'Specialist Nurse',
        location: 'Emergency',
        salary: '$82,000/year',
        specialty: 'Emergency Care',
        workDays: 'Wed-Sun',
        experience: '7 years',
        avatar: '👨‍⚕️',
      },
    },
    {
      title: 'Head Nurse',
      subtitle: 'Lead our pediatrics department with care and compassion',
      className: 'bg-pink-300',
      nurseInfo: {
        role: 'Head Nurse',
        location: 'Pediatrics',
        salary: '$88,000/year',
        specialty: 'Child Care',
        workDays: 'Mon-Fri',
        experience: '8 years',
        avatar: '👩‍⚕️',
      },
    },
    {
      title: 'Staff Nurse',
      subtitle: 'Join our surgical team and grow your career',
      className: 'bg-yellow-300',
      nurseInfo: {
        role: 'Staff Nurse',
        location: 'Surgery',
        salary: '$70,000/year',
        specialty: 'Surgical Care',
        workDays: 'Tue-Sat',
        experience: '3 years',
        avatar: '👨‍⚕️',
      },
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Board Header */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Position Board
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Recently posted positions
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Filter
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
              View All
            </button>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div className="p-6">
        <div
          className="relative rounded-lg bg-slate-50 p-8"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.025) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: 'center center',
          }}
        >
          {/* Subtle gradient overlay */}
          <div
            className="absolute inset-0 rounded-lg opacity-50"
            style={{
              background:
                'linear-gradient(to right, rgba(255,255,255,0.5), transparent)',
            }}
          />

          {/* Cards Grid */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nurses.map((nurse, index) => (
              <div
                key={index}
                className="transform transition-all duration-200"
                style={{
                  transform: `rotate(${Math.random() * 2 - 1}deg)`, // Subtle random rotation
                }}
              >
                <NurseCard {...nurse} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Board Footer */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex justify-between items-center text-sm text-slate-600">
          <span>Showing 8 positions</span>
          <button className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}

export default NurseBoard;
