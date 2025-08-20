import { useState, useCallback } from 'react';
import type { Criteria } from '../types';

const initialCriteria: Criteria = {
  shiftPattern: '3x12s',
  rotationPattern: 'Fixed',
  unitType: 'ICU',
  experienceYears: 3,
  totalWeeks: 4,
  maxConsecutiveShifts: 3,
  minRestBetweenShifts: 10,
  preferNight: false,
  preferWeekend: false,
  chargeNurse: false,
  preceptorDuty: false,
  maxWeeklyHours: 40,
  startDate: new Date(),
  certifications: [],
  requestedDaysOff: [],
  selfScheduled: false,
};

export function useCriteriaForm() {
  const [criteria, setCriteria] = useState<Criteria>(initialCriteria);
  const [selectedDaysOff, setSelectedDaysOff] = useState<Date[]>([]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setCriteria((prev) => ({ ...prev, [name]: checked }));
      } else if (type === 'select-multiple') {
        const target = e.target as HTMLSelectElement;
        const arr = Array.from(target.options)
          .filter((opt) => opt.selected)
          .map((opt) => opt.value);
        setCriteria((prev) => ({ ...prev, [name]: arr }));
      } else {
        setCriteria((prev) => ({ ...prev, [name]: value }));
      }
    },
    []
  );

  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCriteria((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
    },
    []
  );

  const handleDateChange = useCallback((date: Date | null) => {
    if (!date) return;
    setCriteria((prev) => ({ ...prev, startDate: date }));
  }, []);

  const handleDayOffSelect = useCallback((date: Date | null) => {
    if (!date) return;
    
    const dateStr = date.toISOString().slice(0, 10);
    const existingIndex = selectedDaysOff.findIndex(
      (d) => d.toISOString().slice(0, 10) === dateStr
    );

    let updated: Date[];
    if (existingIndex >= 0) {
      // Remove if already selected
      updated = [...selectedDaysOff];
      updated.splice(existingIndex, 1);
    } else {
      updated = [...selectedDaysOff, date];
    }
    setSelectedDaysOff(updated);

    // Update requestedDaysOff
    const offStrings = updated.map((d) => d.toISOString().slice(0, 10));
    setCriteria((prev) => ({ ...prev, requestedDaysOff: offStrings }));
  }, [selectedDaysOff]);

  return {
    criteria,
    selectedDaysOff,
    handleChange,
    handleNumberChange,
    handleDateChange,
    handleDayOffSelect,
  };
}