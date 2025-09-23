import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Is my information really anonymous?",
    answer: "Yes! We never ask for your name or employer. Your data is encrypted and you control what you share. We're HIPAA compliant and take privacy seriously."
  },
  {
    question: "How accurate is the salary data?",
    answer: "Our data comes from verified nurses who share their actual compensation. We validate all entries to ensure accuracy and update regularly."
  },
  {
    question: "What's included in the free version?",
    answer: "Free users get access to salary comparisons, basic career insights, and community features. Premium adds AI coaching and advanced analytics."
  },
  {
    question: "Can my employer see my data?",
    answer: "No. Employers cannot access individual data. We only provide aggregated, anonymous market insights to help everyone make fair compensation decisions."
  },
  {
    question: "How quickly can I see results?",
    answer: "Immediately! After a 5-minute setup, you'll get instant access to salary comparisons and personalized insights based on your profile."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-4 py-12 bg-white">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-gray-600 text-center mb-8 max-w-[300px] mx-auto leading-relaxed">
          Everything you need to know
        </p>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-gray-50 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-gray-900 pr-2">
                  {faq.question}
                </span>
                <m.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </m.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <m.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>
          ))}
        </div>
      </m.div>
    </section>
  );
}