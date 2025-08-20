/**
 * Theme utility functions to eliminate duplicate theme conditionals
 */

export type Theme = 'light' | 'dark';

/**
 * Returns the appropriate class name based on the current theme
 */
export const getThemeClass = (
  theme: Theme,
  lightClass: string,
  darkClass: string
): string => theme === 'light' ? lightClass : darkClass;

/**
 * Returns multiple theme-based classes
 */
export const getThemeClasses = (
  theme: Theme,
  classes: {
    light: string;
    dark: string;
  }
): string => theme === 'light' ? classes.light : classes.dark;

/**
 * Common theme class combinations used across the app
 */
export const themeClasses = {
  // Background colors
  bgPrimary: (theme: Theme) =>
    getThemeClass(theme, 'bg-white', 'bg-slate-800'),
  bgSecondary: (theme: Theme) =>
    getThemeClass(theme, 'bg-gray-50', 'bg-slate-900'),
  bgCard: (theme: Theme) =>
    getThemeClass(theme, 'bg-white', 'bg-slate-800'),
  
  // Text colors
  textPrimary: (theme: Theme) =>
    getThemeClass(theme, 'text-gray-900', 'text-white'),
  textSecondary: (theme: Theme) =>
    getThemeClass(theme, 'text-gray-600', 'text-gray-400'),
  textMuted: (theme: Theme) =>
    getThemeClass(theme, 'text-gray-500', 'text-gray-500'),
  
  // Border colors
  border: (theme: Theme) =>
    getThemeClass(theme, 'border-gray-200', 'border-slate-600'),
  borderLight: (theme: Theme) =>
    getThemeClass(theme, 'border-gray-100', 'border-slate-700'),
  
  // Component-specific classes
  card: (theme: Theme) =>
    `${getThemeClass(theme, 'bg-white', 'bg-slate-800')} ${getThemeClass(
      theme,
      'border-gray-200',
      'border-slate-600'
    )} rounded-xl shadow-lg border`,
  
  button: {
    primary: (theme: Theme) =>
      getThemeClass(
        theme,
        'bg-emerald-500 text-white hover:bg-emerald-600',
        'bg-emerald-600 text-white hover:bg-emerald-700'
      ),
    secondary: (theme: Theme) =>
      getThemeClass(
        theme,
        'bg-gray-100 text-gray-700 hover:bg-gray-200',
        'bg-slate-700 text-gray-300 hover:bg-slate-600'
      ),
  },
  
  // Status colors
  success: (theme: Theme) =>
    getThemeClass(theme, 'text-emerald-600', 'text-emerald-400'),
  error: (theme: Theme) =>
    getThemeClass(theme, 'text-red-600', 'text-red-400'),
  warning: (theme: Theme) =>
    getThemeClass(theme, 'text-amber-600', 'text-amber-400'),
  info: (theme: Theme) =>
    getThemeClass(theme, 'text-blue-600', 'text-blue-400'),
};

/**
 * Hook for using theme utilities with TypeScript support
 */
export const useThemeClasses = (theme: Theme) => ({
    getClass: (lightClass: string, darkClass: string) =>
      getThemeClass(theme, lightClass, darkClass),
    getClasses: (classes: { light: string; dark: string }) =>
      getThemeClasses(theme, classes),
    // Pre-defined common classes
    bg: {
      primary: themeClasses.bgPrimary(theme),
      secondary: themeClasses.bgSecondary(theme),
      card: themeClasses.bgCard(theme),
    },
    text: {
      primary: themeClasses.textPrimary(theme),
      secondary: themeClasses.textSecondary(theme),
      muted: themeClasses.textMuted(theme),
    },
    border: {
      default: themeClasses.border(theme),
      light: themeClasses.borderLight(theme),
    },
    status: {
      success: themeClasses.success(theme),
      error: themeClasses.error(theme),
      warning: themeClasses.warning(theme),
      info: themeClasses.info(theme),
    },
    components: {
      card: themeClasses.card(theme),
      button: {
        primary: themeClasses.button.primary(theme),
        secondary: themeClasses.button.secondary(theme),
      },
    },
  });