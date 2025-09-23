import React from 'react';
import { m } from 'framer-motion';
import { DollarSign, Map, Award, Users, TrendingUp, Clock } from 'lucide-react';

const features = [
  {
    icon: DollarSign,
    title: "Salary Comparison",
    value: "Better",
    description: "Informed salary negotiations"
  },
  {
    icon: Map,
    title: "Location Insights",
    value: "50 States",
    description: "Complete nationwide coverage"
  },
  {
    icon: Award,
    title: "Specialties",
    value: "45+",
    description: "Nursing specialties tracked"
  },
  {
    icon: Users,
    title: "Data Points",
    value: "Real",
    description: "Verified salary data"
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    value: "Smart",
    description: "Career decisions with data"
  },
  {
    icon: Clock,
    title: "Real-time",
    value: "24/7",
    description: "Live data updates"
  }
];

export default function KeyFeatures() {
  return (
    <section className="px-4 py-8 bg-gray-50">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          Why Nurses Choose Us
        </h2>
        <p className="text-xs text-gray-600 text-center mb-6 max-w-[280px] mx-auto">
          Trusted by healthcare professionals nationwide
        </p>

        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <m.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-white rounded-lg p-3 text-center shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-xl mb-3">
                <feature.icon className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {feature.value}
              </div>
              <div className="text-xs font-medium text-gray-900 mb-1">
                {feature.title}
              </div>
              <div className="text-xs text-gray-500">
                {feature.description}
              </div>
            </m.div>
          ))}
        </div>
      </m.div>
    </section>
  );
}