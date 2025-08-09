const theme = {
  colors: {
    // Primary - Professional Healthcare Blue
    primary: {
      50: '#E8F4FD',
      100: '#C5E4FA',
      200: '#9FD3F7',
      300: '#73BEF3',
      400: '#4AABEF',
      500: '#2196F3', // Main primary
      600: '#1976D2',
      700: '#145A9C',
      800: '#0D3E6B',
      900: '#082340',
    },
    // Secondary - Trust Green (Growth/Success)
    secondary: {
      50: '#E8F5E9',
      100: '#C8E6C9',
      200: '#A5D6A7',
      300: '#81C784',
      400: '#66BB6A',
      500: '#4CAF50', // Main secondary
      600: '#43A047',
      700: '#388E3C',
      800: '#2E7D32',
      900: '#1B5E20',
    },
    // Accent - Caring Teal
    accent: {
      50: '#E0F7FA',
      100: '#B2EBF2',
      200: '#80DEEA',
      300: '#4DD0E1',
      400: '#26C6DA',
      500: '#00BCD4', // Main accent
      600: '#00ACC1',
      700: '#0097A7',
      800: '#00838F',
      900: '#006064',
    },
    // Warm - Supportive Coral
    warm: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: '#FF9800',
      600: '#FB8C00',
      700: '#F57C00',
      800: '#EF6C00',
      900: '#E65100',
    },
    // Neutral - Professional Grays
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    // Semantic Colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    // Backgrounds
    background: {
      primary: '#FFFFFF',
      secondary: '#F8FAFB',
      tertiary: '#F0F4F7',
      elevated: '#FFFFFF',
    },
    // Text
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
      tertiary: '#718096',
      disabled: '#A0AEC0',
      inverse: '#FFFFFF',
    },
  },
  shadows: {
    xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  animation: {
    duration: {
      instant: 0.1,
      fast: 0.2,
      normal: 0.3,
      slow: 0.5,
      slower: 0.7,
    },
    easing: {
      easeInOut: [0.4, 0, 0.2, 1],
      easeOut: [0, 0, 0.2, 1],
      easeIn: [0.4, 0, 1, 1],
      spring: [0.43, 0.13, 0.23, 0.96],
      bounce: [0.68, -0.55, 0.265, 1.55],
    },
  },
}

export default theme;