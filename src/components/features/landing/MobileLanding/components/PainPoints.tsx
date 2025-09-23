import React from 'react';
import { m } from 'framer-motion';
import { AlertCircle, TrendingDown, HelpCircle } from 'lucide-react';

const painPoints = [
  {
    icon: AlertCircle,
    title: "Am I underpaid?",
    description: "Most nurses don't know if they're earning fair market rate",
    color: "text-orange-500",
    bgColor: "bg-orange-50"
  },
  {
    icon: TrendingDown,
    title: "Missing opportunities?",
    description: "Many nurses miss out on valuable differentials and bonuses",
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  },
  {
    icon: HelpCircle,
    title: "Career stuck?",
    description: "No clear path for advancement or salary negotiation",
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  }
];

export default function PainPoints() {
  return (
    <section className="px-4 py-8 bg-gray-50">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          Sound Familiar?
        </h2>
        <p className="text-xs text-gray-600 text-center mb-6 max-w-[280px] mx-auto">
          You're not alone. These are the top concerns we hear from nurses daily.
        </p>

        <div className="space-y-3">
          {painPoints.map((point, index) => (
            <m.div
              key={point.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg p-3 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className={`${point.bgColor} p-2 rounded-lg flex-shrink-0`}>
                  <point.icon className={`w-5 h-5 ${point.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">
                    {point.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            </m.div>
          ))}
        </div>

        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-xs font-medium text-emerald-600">
            We have the solution →
          </p>
        </m.div>
      </m.div>
    </section>
  );
}