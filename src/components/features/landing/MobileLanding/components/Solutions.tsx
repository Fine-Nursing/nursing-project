import React from 'react';
import { m } from 'framer-motion';
import { CheckCircle2, Database, Brain, Shield } from 'lucide-react';

const solutions = [
  {
    icon: Database,
    title: "Real Salary Data",
    description: "Access verified compensation data from real nurses nationwide",
    features: ["Updated daily", "Location-specific", "Specialty breakdown"]
  },
  {
    icon: Brain,
    title: "AI Career Insights",
    description: "Get personalized recommendations based on your experience",
    features: ["Career roadmap", "Skill gaps", "Growth opportunities"]
  },
  {
    icon: Shield,
    title: "100% Anonymous",
    description: "Share and compare salaries without revealing your identity",
    features: ["Secure platform", "No employer access", "HIPAA compliant"]
  }
];

export default function Solutions() {
  return (
    <section className="px-4 py-8 bg-white">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          How We Help
        </h2>
        <p className="text-xs text-gray-600 text-center mb-6 max-w-[280px] mx-auto">
          Everything you need to make informed career decisions
        </p>

        <div className="space-y-4">
          {solutions.map((solution, index) => (
            <m.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <solution.icon className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base">
                    {solution.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {solution.description}
                </p>

                <div className="space-y-2">
                  {solution.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </m.div>
    </section>
  );
}