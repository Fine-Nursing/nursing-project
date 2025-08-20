import React from 'react';

interface TermsCheckboxProps {
  acceptTerms: boolean;
  onAcceptTermsChange: (checked: boolean) => void;
}

export default function TermsCheckbox({ acceptTerms, onAcceptTermsChange }: TermsCheckboxProps) {
  return (
    <div className="flex items-start">
      <input
        id="accept-terms"
        type="checkbox"
        checked={acceptTerms}
        onChange={(e) => onAcceptTermsChange(e.target.checked)}
        className="w-4 h-4 mt-0.5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
      />
      <label htmlFor="accept-terms" className="ml-2 text-sm text-gray-600">
        I agree to the{' '}
        <button
          type="button"
          className="text-emerald-600 hover:text-emerald-700"
          onClick={() => {/* TODO: Open terms modal */}}
        >
          Terms of Service
        </button>{' '}
        and{' '}
        <button
          type="button"
          className="text-emerald-600 hover:text-emerald-700"
          onClick={() => {/* TODO: Open privacy modal */}}
        >
          Privacy Policy
        </button>
      </label>
    </div>
  );
}