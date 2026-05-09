/**
 * Mobile-first design tokens: 8pt grid, radii, type scale, touch targets.
 * Colors align with styles.js for WCAG-friendly pairings on white/light gray.
 */
import { Platform } from 'react-native';
import { colors } from '../styles';

export { colors };

/** 8pt grid — use multiples of 8 for spacing */
export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  pill: 999,
};

/** Minimum touch target (Apple HIG / WCAG 2.5.5) */
export const touchTargetMin = 44;

export const type = {
  /** Modern system sans stack */
  fontFamily: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  }),
  display: { fontSize: 28, fontWeight: '700', lineHeight: 34, letterSpacing: -0.3 },
  title: { fontSize: 22, fontWeight: '700', lineHeight: 28 },
  headline: { fontSize: 17, fontWeight: '600', lineHeight: 22 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  callout: { fontSize: 15, fontWeight: '500', lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  micro: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
};

export function elevationShadow(level = 2) {
  const map = {
    1: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
    2: { shadowColor: '#1e3a8a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 14, elevation: 5 },
    3: { shadowColor: '#0f172a', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.14, shadowRadius: 22, elevation: 8 },
  };
  return map[level] || map[2];
}

/** Error text on white — contrast ratio > 4.5:1 */
export const a11y = {
  errorText: '#b91c1c',
  successText: colors.success,
  linkOnLight: colors.primary,
};
