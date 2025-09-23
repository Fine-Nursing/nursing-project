import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, MapPin, Briefcase, School } from 'lucide-react';

interface InteractiveDemoProps {
  onComplete: () => void;
}

const specialties = ['ICU', 'ER', 'Med-Surg', 'Labor & Delivery', 'Pediatrics', 'OR'];
const locations = ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania'];
const experience = ['0-2 years', '2-5 years', '5-10 years', '10+ years'];

export default function InteractiveDemo({ onComplete }: InteractiveDemoProps) {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    specialty: '',
    location: '',
    experience: ''
  });
  const [showResult, setShowResult] = useState(false);

  const handleSelection = (key: string, value: string) => {
    setSelections({ ...selections, [key]: value });
    if (step < 2) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const calculateEstimate = () => {
    // Simple calculation for demo
    const baseRate = 35;
    const specialtyBonus = selections.specialty === 'ICU' || selections.specialty === 'ER' ? 10 : 5;
    const locationMultiplier = selections.location === 'California' || selections.location === 'New York' ? 1.3 : 1;
    const experienceBonus = selections.experience === '10+ years' ? 15 :
                           selections.experience === '5-10 years' ? 10 :
                           selections.experience === '2-5 years' ? 5 : 0;

    const hourlyRate = Math.round((baseRate + specialtyBonus + experienceBonus) * locationMultiplier);
    const annualSalary = hourlyRate * 2080;

    return { hourlyRate, annualSalary };
  };

  const { hourlyRate, annualSalary } = calculateEstimate();

  return (
    <section className="px-4 py-8 bg-white">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 rounded-full text-purple-700 text-xs font-medium mb-3">
            <Sparkles className="w-3 h-3" />
            Interactive Demo
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            See Your Potential Salary
          </h2>
          <p className="text-xs text-gray-600 max-w-[280px] mx-auto">
            Answer 3 quick questions for an instant estimate
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
          {!showResult ? (
            <>
              {/* Progress indicator */}
              <div className="flex gap-2 mb-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= step ? 'bg-indigo-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Step 1: Specialty */}
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <m.div
                    key="specialty"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <School className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-semibold text-gray-900">What's your specialty?</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {specialties.map((spec) => (
                          <button
                            key={spec}
                            onClick={() => handleSelection('specialty', spec)}
                            className="px-3 py-2.5 bg-white rounded-lg text-xs font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            {spec}
                          </button>
                        ))}
                      </div>
                    </div>
                  </m.div>
                )}

                {/* Step 2: Location */}
                {step === 1 && (
                  <m.div
                    key="location"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-semibold text-gray-900">Where do you work?</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {locations.map((loc) => (
                          <button
                            key={loc}
                            onClick={() => handleSelection('location', loc)}
                            className="px-3 py-2.5 bg-white rounded-lg text-xs font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    </div>
                  </m.div>
                )}

                {/* Step 3: Experience */}
                {step === 2 && (
                  <m.div
                    key="experience"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Briefcase className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-semibold text-gray-900">Years of experience?</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {experience.map((exp) => (
                          <button
                            key={exp}
                            onClick={() => handleSelection('experience', exp)}
                            className="px-3 py-2.5 bg-white rounded-lg text-xs font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            {exp}
                          </button>
                        ))}
                      </div>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            /* Result */
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <div className="mb-6">
                  <div className="text-sm text-indigo-600 font-medium mb-2">
                    Your Estimated Salary
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ${hourlyRate}/hr
                  </div>
                  <div className="text-base text-gray-600">
                    ${(annualSalary / 1000).toFixed(0)}K annually
                  </div>
                </div>

                <div className="bg-white/70 rounded-lg p-3 mb-4">
                  <div className="text-sm text-gray-600 mb-2">Based on your profile:</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Specialty:</span>
                      <span className="font-medium text-gray-900">{selections.specialty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium text-gray-900">{selections.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Experience:</span>
                      <span className="font-medium text-gray-900">{selections.experience}</span>
                    </div>
                  </div>
                </div>

                <m.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onComplete}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  View Complete Analysis
                  <ArrowRight className="w-4 h-4" />
                </m.button>

                <p className="mt-4 text-xs text-gray-500">
                  Estimate based on market data. Sign up for personalized insights.
                </p>
              </div>
            </m.div>
          )}
        </div>
      </m.div>
    </section>
  );
}