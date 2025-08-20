import React from 'react';
import { DIFFERENTIALS } from '../../../../../utils/constants';
import type { Criteria } from '../types';

interface PreferencesSectionProps {
  criteria: Criteria;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  theme: 'light' | 'dark';
}

export function PreferencesSection({ criteria, onChange, theme }: PreferencesSectionProps) {
  return (
    <div
      className={`p-3 rounded-lg border shadow-sm ${
        theme === 'light'
          ? 'bg-white border-gray-100'
          : 'bg-slate-800 border-slate-600'
      }`}
    >
      <fieldset>
        <legend className="block mb-1 text-sm font-medium">
          Additional Preferences
        </legend>

        <div className="flex flex-wrap gap-4 mt-2 text-sm">
          <div>
            <input
              type="checkbox"
              name="preferNight"
              id="preferNight"
              checked={criteria.preferNight}
              onChange={onChange}
              className="mr-1"
            />
            <label htmlFor="preferNight">
              Prefer Night (+${DIFFERENTIALS.NIGHT.toFixed(2)}/hr)
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              name="preferWeekend"
              id="preferWeekend"
              checked={criteria.preferWeekend}
              onChange={onChange}
              className="mr-1"
            />
            <label htmlFor="preferWeekend">
              Prefer Weekend (+${DIFFERENTIALS.WEEKEND.toFixed(2)}/hr)
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              name="chargeNurse"
              id="chargeNurse"
              checked={criteria.chargeNurse}
              onChange={onChange}
              className="mr-1"
            />
            <label htmlFor="chargeNurse">
              Charge Nurse (+${DIFFERENTIALS.CHARGE.toFixed(2)}/hr)
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              name="preceptorDuty"
              id="preceptorDuty"
              checked={criteria.preceptorDuty}
              onChange={onChange}
              className="mr-1"
            />
            <label htmlFor="preceptorDuty">
              Preceptor (+${DIFFERENTIALS.PRECEPTOR.toFixed(2)}/hr)
            </label>
          </div>
        </div>
      </fieldset>

      {/* Certifications */}
      <div className="mt-3">
        <label
          htmlFor="certifications"
          className="block mb-1 text-sm font-medium"
        >
          Certifications
        </label>
        <select
          id="certifications"
          name="certifications"
          multiple
          value={criteria.certifications}
          onChange={onChange}
          className={`w-full p-2 border rounded text-sm h-20 ${
            theme === 'light'
              ? 'border-gray-200'
              : 'border-slate-500 bg-slate-700 text-white'
          }`}
        >
          <option value="ACLS">ACLS</option>
          <option value="PALS">PALS</option>
          <option value="CCRN">CCRN</option>
          <option value="CEN">CEN</option>
          <option value="CNOR">CNOR</option>
          <option value="OCN">OCN</option>
          <option value="RNC-OB">RNC-OB</option>
        </select>
        <p className="text-xs mt-1 opacity-80">
          Each cert adds +${DIFFERENTIALS.CERTIFICATION}/hr
        </p>
      </div>
    </div>
  );
}