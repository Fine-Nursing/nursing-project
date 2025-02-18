// src/components/onboarding/pages/CultureForm.tsx

import useOnboardingStore from 'src/store/onboardingStores';

export default function CultureForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('account');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Help us understand your workplace culture
      </h2>

      <div>
        <label
          htmlFor="cultureRating"
          className="block text-sm font-medium text-gray-700"
        >
          On a scale of 1 to 10, how would you rate the culture and support in
          your unit?
        </label>
        <div className="mt-2">
          <input
            id="cultureRating"
            type="range"
            min="1"
            max="10"
            step="1"
            required
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            value={formData.cultureRating || 5}
            onChange={(e) =>
              updateFormData({ cultureRating: parseInt(e.target.value) })
            }
          />
          <div className="flex justify-between text-xs text-gray-600">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <span
                key={num}
                className={`${formData.cultureRating === num ? 'font-bold text-blue-600' : ''}`}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="unitStrengths"
          className="block text-sm font-medium text-gray-700"
        >
          What's one thing your unit does well?
        </label>
        <textarea
          id="unitStrengths"
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.unitStrengths || ''}
          onChange={(e) => updateFormData({ unitStrengths: e.target.value })}
          placeholder="Ex: Strong teamwork, Effective communication, Great mentorship..."
        />
      </div>

      <div>
        <label
          htmlFor="improvementAreas"
          className="block text-sm font-medium text-gray-700"
        >
          What's one thing that could be improved?
        </label>
        <textarea
          id="improvementAreas"
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.improvementAreas || ''}
          onChange={(e) => updateFormData({ improvementAreas: e.target.value })}
          placeholder="Ex: Staffing ratios, Work-life balance, Professional development opportunities..."
        />
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => setStep('employment')}
          className="text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  );
}
