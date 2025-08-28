import React from 'react';
import { m } from 'framer-motion';
import { Activity, BarChart3, Binary, CircuitBoard, Server } from 'lucide-react';
import type { FloatingParticlesProps } from '../types';

const PARTICLE_ICONS = [Activity, BarChart3, Binary, CircuitBoard, Server];

export function FloatingParticles({ count = 20, isDark }: FloatingParticlesProps) {
  const particles = Array.from({ length: count }, (_, i) => {
    const IconComponent = PARTICLE_ICONS[i % PARTICLE_ICONS.length];
    return {
      id: i,
      icon: IconComponent,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 4,
    };
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <m.div
          key={particle.id}
          className={`absolute ${
            isDark 
              ? 'text-slate-600/20' 
              : 'text-gray-300/40'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        >
          <particle.icon className="w-4 h-4" />
        </m.div>
      ))}
    </div>
  );
}