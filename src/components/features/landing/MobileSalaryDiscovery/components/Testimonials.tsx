import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { HiOutlineSparkles } from 'react-icons/hi';
import { TESTIMONIALS } from '../constants';

interface TestimonialsProps {
  activeTestimonial: number;
}

export function Testimonials({ activeTestimonial }: TestimonialsProps) {
  const testimonial = TESTIMONIALS[activeTestimonial];

  return (
    <section className="px-6 py-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">What nurses say</h2>
      
      <AnimatePresence mode="wait">
        <m.div
          key={activeTestimonial}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-emerald-50 rounded-2xl p-6"
        >
          <HiOutlineSparkles className="w-5 h-5 text-emerald-500 mb-3" />
          <p className="text-gray-700 leading-relaxed mb-4">
            "{testimonial.text}"
          </p>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">
                {testimonial.name}
              </div>
              <div className="text-sm text-gray-600">
                {testimonial.role}
              </div>
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeTestimonial ? 'w-6 bg-emerald-500' : 'w-1.5 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </m.div>
      </AnimatePresence>
    </section>
  );
}