import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, TrendingUp } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah M.",
    role: "ICU Nurse, California",
    content: "The salary data helped me negotiate a much better offer. I finally know my worth!",
    rating: 5,
    salary: "Better compensation"
  },
  {
    name: "Michael R.",
    role: "ER Nurse, Texas",
    content: "The insights helped me identify differentials I didn't know existed. Game changer!",
    rating: 5,
    salary: "Increased hourly rate"
  },
  {
    name: "Jennifer L.",
    role: "L&D Nurse, New York",
    content: "The location data helped me find better opportunities. Best career tool ever!",
    rating: 5,
    salary: "Career advancement"
  },
  {
    name: "David K.",
    role: "Travel Nurse",
    content: "Essential for contract negotiations. I never go in blind anymore.",
    rating: 5,
    salary: "Fair contracts"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="px-4 py-8 bg-gray-50">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          Success Stories
        </h2>
        <p className="text-xs text-gray-600 text-center mb-6 max-w-[280px] mx-auto">
          Real nurses, real results
        </p>

        <div className="relative">
          <AnimatePresence mode="wait">
            <m.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start gap-3 mb-4">
                <Quote className="w-6 h-6 text-emerald-100 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    "{testimonials[currentIndex].content}"
                  </p>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full text-emerald-700 text-xs font-semibold mb-3">
                    <TrendingUp className="w-3 h-3" />
                    {testimonials[currentIndex].salary}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonials[currentIndex].name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonials[currentIndex].role}
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex gap-1.5">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-6 bg-emerald-500'
                      : 'w-1.5 bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>100% Anonymous</span>
            </div>
          </div>
        </div>
      </m.div>
    </section>
  );
}

import { Shield, Users } from 'lucide-react';