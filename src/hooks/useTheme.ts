import { useThemeClasses } from 'src/utils/theme';

/**
 * Custom hook for theme management in components
 * Provides simplified access to theme utilities
 */
export const useTheme = (theme: 'light' | 'dark') => {
  const tc = useThemeClasses(theme);
  
  return {
    // Direct access to theme utilities
    ...tc,
    
    // Commonly used combinations
    cardClass: `${tc.bg.card} rounded-xl shadow-lg border ${tc.border.default}`,
    modalClass: `${tc.bg.primary} rounded-lg shadow-xl border ${tc.border.default}`,
    sectionClass: `${tc.bg.secondary} rounded-lg p-4`,
    
    // Extended background utilities
    bg: {
      ...tc.bg,
      gradient: theme === 'light' 
        ? 'bg-gradient-to-b from-white via-emerald-50/20 to-white' 
        : 'bg-gradient-to-b from-black via-zinc-950 to-black',
      decorative: theme === 'light'
        ? 'bg-gradient-to-br from-emerald-50/20 via-transparent to-blue-50/20'
        : 'bg-gradient-to-br from-emerald-900/10 via-transparent to-blue-900/10'
    },
    
    // Quick access to theme value
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
};

export default useTheme;