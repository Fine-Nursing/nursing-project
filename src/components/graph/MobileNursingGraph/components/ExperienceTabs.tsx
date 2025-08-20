import type { ExperienceGroup } from 'src/types/common';
import type { ExperienceTabsProps } from '../types';

// Experience Level Selector - Pill Style
export function ExperienceTabs({ 
  selected, 
  onChange 
}: ExperienceTabsProps) {
  const levels: { id: ExperienceGroup; label: string; emoji: string }[] = [
    { id: 'beginner', label: 'Entry', emoji: '🌱' },
    { id: 'junior', label: 'Junior', emoji: '📘' },
    { id: 'experienced', label: 'Mid', emoji: '💼' },
    { id: 'senior', label: 'Senior', emoji: '👑' },
  ];
  
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar">
      {levels.map(level => {
        const isSelected = selected.includes(level.id);
        return (
          <button
            key={level.id}
            type="button"
            onClick={() => {
              if (isSelected) {
                onChange(selected.filter(l => l !== level.id));
              } else {
                onChange([...selected, level.id]);
              }
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              isSelected 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'
            }`}
          >
            <span className="mr-1">{level.emoji}</span>
            {level.label}
          </button>
        );
      })}
    </div>
  );
}