// constants/theme.ts
export const COLORS = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  primaryLight: '#38bdf8',
  secondary: '#10b981',
  secondaryDark: '#059669',
  danger: '#ef4444',
  dangerDark: '#dc2626',
  warning: '#f59e0b',
  dark: '#0f172a',
  light: '#f8fafc',
  gray: '#64748b',
  lightGray: '#e2e8f0',
  white: '#ffffff',
  black: '#000000',
  cardBg: 'rgba(255, 255, 255, 0.95)',
  overlay: 'rgba(0,0,0,0.5)',
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const GRADIENTS = {
  primary: ['#2563eb', '#1e40af'],
  success: ['#10b981', '#059669'],
  danger: ['#ef4444', '#dc2626'],
};
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const TYPOGRAPHY = {
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  body: {
    fontSize: 16,
  },

  small: {
    fontSize: 13,
  },
};