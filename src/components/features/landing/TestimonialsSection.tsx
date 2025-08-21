'use client';

import React from 'react';

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative py-8 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-colors"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-700 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-10">
          <div className="inline-flex items-center justify-center px-4 py-1 mb-4 text-xs font-semibold tracking-wide text-amber-600 dark:text-amber-400 uppercase bg-amber-100 dark:bg-amber-900/20 rounded-full border border-amber-200 dark:border-amber-800">
            Success Stories
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            What Nurses Are Saying
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto px-4">
            Join thousands who transformed their careers with our platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-lg shadow-lg dark:shadow-zinc-900/50 transition-colors">
            <div className="flex mb-3 sm:mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <svg
                  key={`sarah-star-${i}`}
                  className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-300 mb-4">
              &quot;This platform transformed my career. I found my dream position and negotiated a 20% salary increase!&quot;
            </p>
            <div className="flex items-center">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <span className="text-emerald-500 dark:text-emerald-400 font-bold text-xs sm:text-sm">SK</span>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                  Sarah Kim
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-500">
                  ICU Nurse, NYC
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-lg shadow-lg dark:shadow-zinc-900/50 transition-colors">
            <div className="flex mb-3 sm:mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <svg
                  key={`michael-star-${i}`}
                  className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-300 mb-4">
              &quot;The career analytics helped me understand my worth. I&apos;m now earning what I deserve!&quot;
            </p>
            <div className="flex items-center">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-xs sm:text-sm">MJ</span>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                  Michael Johnson
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-500">
                  ER Nurse, LA
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-lg shadow-lg dark:shadow-zinc-900/50 transition-colors">
            <div className="flex mb-3 sm:mb-4">
              {Array.from({ length: 5 }, (_, i) => (
                <svg
                  key={`emily-star-${i}`}
                  className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-300 mb-4">
              &quot;Best platform for nursing professionals. The data insights are invaluable!&quot;
            </p>
            <div className="flex items-center">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                <span className="text-teal-500 dark:text-teal-400 font-bold text-xs sm:text-sm">EC</span>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                  Emily Chen
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-500">
                  NICU Nurse, SF
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}