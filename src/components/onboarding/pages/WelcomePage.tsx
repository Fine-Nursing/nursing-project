'use client';

import { Eye, Ear, Handshake } from 'lucide-react';
import ActionButton from 'src/components/button/ActionButton';

import useOnboardingStore from 'src/store/onboardingStores';

export default function WelcomePage() {
  const { setStep } = useOnboardingStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-teal-600">Nurse Network</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect, Share, and Grow with Our Healthcare Community
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Real-time Compensation Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="p-8">
              <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <div className="bg-teal-100 p-4 rounded-2xl">
                  <Eye className="w-10 h-10 text-teal-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-900">
                Real-time Compensation data
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                  </div>
                  <p className="text-gray-600 ml-2">
                    See how your pay compares in real time and drive
                    transparency.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                  </div>
                  <p className="text-gray-600 ml-2">
                    Help build a pay dashboard that empowers nurses.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                  </div>
                  <p className="text-gray-600 ml-2">
                    Contribute to real-time insights for fair nurse
                    compensation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Listen to Nurse Stories Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="p-8">
              <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <div className="bg-teal-100 p-4 rounded-2xl">
                  <Ear className="w-10 h-10 text-teal-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-900">
                Listen to Nurse Stories
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                  </div>
                  <p className="text-gray-600 ml-2">
                    Hear real stories from nurses about their workplaces and
                    cultures.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                  </div>
                  <p className="text-gray-600 ml-2">
                    Join a community where experiences are shared and valued.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                  </div>
                  <p className="text-gray-600 ml-2">
                    Share your voice to shape a supportive network for nurses.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated Career Partner Card */}
          <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className="p-8">
              <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <div className="bg-teal-100 p-4 rounded-2xl">
                  <Handshake className="w-10 h-10 text-teal-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-900">
                Dedicated Career Partner
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                  </div>
                  <p className="text-gray-600 ml-2">
                    Get personalized guidance for every step of your career.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                  </div>
                  <p className="text-gray-600 ml-2">
                    Access tailored insights to achieve your goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <ActionButton onClick={() => setStep('basicInfo')} size="lg">
            Get Started 🚀
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
