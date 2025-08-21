'use client';

import React, { useMemo, memo } from 'react';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength = memo(({ password }: PasswordStrengthProps) => {
  const { strength, color, label } = useMemo(() => {
    if (!password) return { strength: 0, color: '', label: '' };
    
    let str = 0;
    if (password.length >= 8) str += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) str += 1;
    if (/[0-9]/.test(password)) str += 1;
    if (/[^a-zA-Z0-9]/.test(password)) str += 1;
    
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    
    return {
      strength: str,
      color: str > 0 ? colors[str - 1] : '',
      label: str > 0 ? labels[str - 1] : ''
    };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={`strength-${i}`}
            className={`h-1 flex-1 rounded transition-colors duration-200 ${
              i < strength ? color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600">Password strength: {label}</p>
    </div>
  );
});

PasswordStrength.displayName = 'PasswordStrength';

export default PasswordStrength;