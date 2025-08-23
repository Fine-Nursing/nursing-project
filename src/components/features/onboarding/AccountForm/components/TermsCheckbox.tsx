import React from 'react';
import toast from 'react-hot-toast';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: boolean;
}

export function TermsCheckbox({ checked, onChange, error }: TermsCheckboxProps) {
  const handleTermsClick = () => {
    toast('Terms of Service - Coming Soon', { icon: '📄' });
  };

  const handlePrivacyClick = () => {
    toast('Privacy Policy - Coming Soon', { icon: '🔒' });
  };

  return (
    <div className="flex items-start gap-3">
      <input
        id="terms"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`mt-1 h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded
                   ${error ? 'border-red-500' : ''}`}
      />
      <label htmlFor="terms" className="text-sm text-gray-600">
        We agree to the{' '}
        <button
          type="button"
          onClick={handleTermsClick}
          className="text-slate-600 hover:text-slate-700 underline"
        >
          Terms of Service
        </button>{' '}
        and{' '}
        <button
          type="button"
          onClick={handlePrivacyClick}
          className="text-slate-600 hover:text-slate-700 underline"
        >
          Privacy Policy
        </button>
      </label>
    </div>
  );
}