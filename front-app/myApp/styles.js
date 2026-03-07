/**
 * styles.js — React Native StyleSheet
 * Converted from styles.css
 *
 * Usage:
 *   import styles from '../styles/styles';
 *   <View style={styles.hero}>...</View>
 *
 * Notes:
 *  - CSS pseudo-elements (::before, ::after), @keyframes animations,
 *    and media queries cannot be expressed in RN StyleSheet directly.
 *    Equivalents are noted as comments where relevant.
 *  - Web-only properties (position:sticky, backdrop-filter, grid, etc.)
 *    have been replaced with their closest RN equivalents.
 *  - Hover effects → use onPressIn/onPressOut or Animated API.
 *  - Animations (pulse, spin, slideInLeft, etc.) → use Animated API or
 *    the `react-native-reanimated` library.
 */

import { StyleSheet, Platform } from 'react-native';

// ─── Design Tokens ───────────────────────────────────────────────────────────
export const colors = {
  primary:       '#2563eb',
  primaryDark:   '#1d4ed8',
  primaryDeep:   '#1e40af',
  primaryBg:     '#1e3a8a',
  sky:           '#38bdf8',
  dark:          '#0f172a',
  darkMid:       '#1e293b',
  slate:         '#334155',
  slateLight:    '#475569',
  muted:         '#64748b',
  border:        '#e2e8f0',
  bg:            '#f8fafc',
  bgAlt:         '#f4f6f9',
  bgCard:        '#f1f5f9',
  white:         '#ffffff',
  success:       '#065f46',
  successBg:     '#d1fae5',
  successBorder: '#a7f3d0',
  danger:        '#dc2626',
  dangerDark:    '#991b1b',
  dangerBg:      '#fee2e2',
  dangerBorder:  '#fecaca',
  green:         '#10b981',
  greenDark:     '#059669',
};

const shadow = (depth = 1) => {
  const levels = {
    1: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 },  shadowOpacity: 0.06, shadowRadius: 4,  elevation: 2 },
    2: { shadowColor: '#000', shadowOffset: { width: 0, height: 5 },  shadowOpacity: 0.10, shadowRadius: 10, elevation: 4 },
    3: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8 },
    4: { shadowColor: '#000', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.20, shadowRadius: 30, elevation: 12 },
  };
  return levels[depth] || levels[1];
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  // ── Global ────────────────────────────────────────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: colors.bgAlt,
  },

  // ── TopBanner ─────────────────────────────────────────────────────────────
  topBanner: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...shadow(1),
  },
  topBannerH1: {
    color: colors.dark,
    fontSize: 20,
    fontWeight: '700',
    backgroundColor: colors.bgCard,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // ── Header / Navbar ────────────────────────────────────────────────────────
  header: {
    backgroundColor: colors.dark,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadow(2),
  },
  logo: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 2,
  },
  // Status dot — animated pulse via Animated API in component
  headerStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4caf50',
    marginRight: 8,
  },
  headerStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerStatusText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },

  // ── Hero Section ───────────────────────────────────────────────────────────
  hero: {
    backgroundColor: colors.primaryBg, // gradient: use LinearGradient lib
    paddingVertical: 40,
    paddingHorizontal: 20,
    gap: 24,
  },

  // ── Left Content (hero left box) ───────────────────────────────────────────
  heroLeft: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    ...shadow(3),
  },
  heroHeading: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
    lineHeight: 40,
  },
  heroSubtext: {
    fontSize: 16,
    color: '#e2e8f0',
    marginBottom: 20,
    lineHeight: 26,
  },
  featureList: {
    gap: 10,
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 40,
  },
  featureItemText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  featureCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCheckText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Login Card ─────────────────────────────────────────────────────────────
  loginCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 28,
    marginHorizontal: 4,
    ...shadow(3),
  },
  loginTitle: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.darkMid,
    textAlign: 'center',
    marginBottom: 6,
  },
  loginSubtext: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 20,
  },
  loginInput: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    fontSize: 15,
    backgroundColor: colors.bg,
    color: colors.dark,
  },
  loginInputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  loginButton: {
    backgroundColor: colors.primary, // gradient → LinearGradient
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    ...shadow(2),
  },
  loginButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 17,
  },
  loginSupportText: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 13,
    marginTop: 14,
  },

  // ── News Section ───────────────────────────────────────────────────────────
  newsSection: {
    backgroundColor: colors.bgAlt,
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  newsSectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 20,
  },
  newsList: {
    gap: 16,
  },

  // ── News Card ──────────────────────────────────────────────────────────────
  newsCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow(2),
  },
  newsCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkMid,
    marginBottom: 8,
  },
  newsCardDate: {
    display: 'flex',
    backgroundColor: colors.border,
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 30,
    fontSize: 12,
    fontWeight: '500',
    color: colors.slateLight,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  newsCardText: {
    color: colors.slate,
    fontSize: 14,
    lineHeight: 22,
  },

  // ── Footer ─────────────────────────────────────────────────────────────────
  footer: {
    backgroundColor: colors.dark,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 16,
    gap: 20,
  },
  footerSection: {
    gap: 6,
  },
  footerBrand: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  footerSectionTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  footerLink: {
    color: '#a8c4e0',
    fontSize: 13,
  },
  footerBottom: {
    borderTopWidth: 1,
    borderTopColor: '#2e5a96',
    paddingTop: 12,
    alignItems: 'center',
  },
  footerCopyright: {
    color: '#a8c4e0',
    fontSize: 12,
  },

  // ── Student Dashboard ──────────────────────────────────────────────────────
  dashboard: {
    backgroundColor: colors.bg,
    padding: 16,
    gap: 16,
    flexGrow: 1,
  },

  // ── Student Card (general card used across dashboard) ─────────────────────
  studentCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(203,213,225,0.4)',
    ...shadow(3),
  },
  studentCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(37,99,235,0.2)',
  },

  // ── Student Info Grid ──────────────────────────────────────────────────────
  studentGrid: {
    gap: 12,
    marginTop: 8,
  },
  studentGridItem: {
    backgroundColor: 'rgba(241,245,249,0.7)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  studentGridLabel: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  studentGridValue: {
    color: colors.darkMid,
    fontSize: 14,
  },

  // ── Registration Status Card ───────────────────────────────────────────────
  registrationCard: {
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 40,
    marginVertical: 8,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusOpen: {
    backgroundColor: colors.successBg,
    borderWidth: 1,
    borderColor: colors.successBorder,
  },
  statusOpenText: {
    color: colors.success,
  },
  statusClosed: {
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
  statusClosedText: {
    color: colors.dangerDark,
  },

  // ── Registration Page ──────────────────────────────────────────────────────
  registrationPage: {
    flex: 1,
    backgroundColor: colors.bgAlt,
  },
  registrationPageHeader: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadow(2),
  },
  registrationPageTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  hoursCard: {
    backgroundColor: 'rgba(56,189,248,0.15)',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.3)',
  },
  hoursIcon: {
    fontSize: 24,
  },
  hoursInfo: {
    alignItems: 'flex-end',
  },
  hoursLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginBottom: 2,
  },
  hoursValue: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  hoursMax: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 2,
  },

  // ── Course Card ────────────────────────────────────────────────────────────
  courseCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow(2),
  },
  courseCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: '#f0f9ff',
  },
  courseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courseCode: {
    backgroundColor: colors.border,
    color: colors.slateLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 13,
    fontWeight: '500',
  },
  courseHoursBadge: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 13,
    fontWeight: '600',
  },
  courseTitle: {
    fontSize: 18,
    color: colors.dark,
    fontWeight: '600',
    marginBottom: 6,
  },
  courseInstructor: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 12,
  },
  scheduleInfoBox: {
    backgroundColor: colors.bg,
    borderRadius: 14,
    padding: 12,
    marginVertical: 12,
  },
  scheduleInfoTitle: {
    fontSize: 13,
    color: colors.slateLight,
    marginBottom: 8,
    fontWeight: '600',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scheduleItemLast: {
    borderBottomWidth: 0,
  },
  scheduleDay: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '500',
    minWidth: 64,
    textAlign: 'center',
  },
  scheduleTime: {
    color: colors.dark,
    fontWeight: '500',
    fontSize: 13,
  },
  scheduleLocation: {
    color: colors.muted,
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
  },
  courseDescription: {
    color: colors.slateLight,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderStyle: 'dashed',
  },
  courseActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  btnSelect: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSelectText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  btnRemove: {
    flex: 1,
    backgroundColor: colors.dangerBg,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRemoveText: {
    color: colors.danger,
    fontWeight: '600',
    fontSize: 14,
  },
  btnDisabled: {
    opacity: 0.5,
  },

  // ── Registration Footer (sticky bar) ──────────────────────────────────────
  registrationFooter: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow(2),
  },
  selectedSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: '700',
    fontSize: 14,
  },
  countLabel: {
    color: colors.slateLight,
    fontSize: 14,
  },
  totalHoursFooter: {
    backgroundColor: colors.bgCard,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 40,
    color: colors.dark,
    fontWeight: '600',
    fontSize: 13,
  },
  btnSubmit: {
    backgroundColor: colors.green, // gradient → LinearGradient
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...shadow(2),
  },
  btnSubmitText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 15,
  },

  // ── Empty State ────────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    margin: 16,
  },
  emptyStateIcon: {
    fontSize: 52,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyStateTitle: {
    color: colors.dark,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyStateText: {
    color: colors.muted,
    fontSize: 14,
  },

  // ── Schedule Page ──────────────────────────────────────────────────────────
  schedulePage: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
  },
  schedulePageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  schedulePageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.dark,
  },
  scheduleActions: {
    flexDirection: 'row',
    gap: 10,
  },
  btnPrint: {
    backgroundColor: colors.bgCard,
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnPrintText: {
    color: colors.dark,
    fontWeight: '600',
    fontSize: 14,
  },
  btnReset: {
    backgroundColor: colors.dangerBg,
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
  },
  btnResetText: {
    color: colors.danger,
    fontWeight: '600',
    fontSize: 14,
  },

  // ── Schedule Summary ───────────────────────────────────────────────────────
  scheduleSummary: {
    backgroundColor: colors.primary, // gradient → LinearGradient
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    ...shadow(3),
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryIconBox: {
    width: 46,
    height: 46,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryIconText: {
    fontSize: 22,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginBottom: 2,
  },
  summaryValue: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
  },

  // ── Schedule Card ──────────────────────────────────────────────────────────
  scheduleCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow(2),
  },
  scheduleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  scheduleCourseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    flex: 1,
    marginRight: 8,
  },
  scheduleCourseBadge: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 40,
    fontSize: 13,
    fontWeight: '600',
  },
  courseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  detailItem: {
    backgroundColor: colors.bgCard,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 40,
    fontSize: 13,
    color: colors.slateLight,
  },
  timetable: {
    backgroundColor: colors.bg,
    borderRadius: 16,
    padding: 14,
    marginVertical: 12,
  },
  timetableTitle: {
    fontSize: 14,
    color: colors.dark,
    fontWeight: '600',
    marginBottom: 10,
  },
  timetableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timetableDay: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 30,
    fontSize: 12,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'center',
  },
  timetableTime: {
    color: colors.dark,
    fontWeight: '600',
    fontSize: 13,
    minWidth: 80,
  },
  timetableLocation: {
    color: colors.muted,
    fontSize: 13,
    flex: 1,
    textAlign: 'right',
  },
  courseInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  infoItem: {
    color: colors.muted,
    fontSize: 13,
  },

  // ── Weekly View ────────────────────────────────────────────────────────────
  weeklyView: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow(1),
  },
  weeklyViewTitle: {
    fontSize: 20,
    color: colors.dark,
    fontWeight: '700',
    marginBottom: 16,
  },
  weekDay: {
    width: 130,
    backgroundColor: colors.bg,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    ...shadow(1),
  },
  dayHeader: {
    backgroundColor: colors.dark,
    padding: 10,
    alignItems: 'center',
  },
  dayName: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  dayDate: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  weekCourse: {
    backgroundColor: colors.primary, // gradient → LinearGradient
    margin: 6,
    borderRadius: 10,
    padding: 8,
    ...shadow(1),
  },
  weekCourseName: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 2,
  },
  weekCourseTime: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
  },
  weekCourseLocation: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
  },

  // ── No Data State ──────────────────────────────────────────────────────────
  noData: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.white,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    margin: 16,
  },
  noDataIcon: {
    fontSize: 60,
    marginBottom: 16,
    opacity: 0.5,
  },
  noDataTitle: {
    color: colors.dark,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  noDataText: {
    color: colors.muted,
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  btnRegister: {
    backgroundColor: colors.primary,
    borderRadius: 40,
    paddingVertical: 14,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...shadow(2),
  },
  btnRegisterText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 15,
  },

  // ── Sidebar ────────────────────────────────────────────────────────────────
  // In React Native, use a Drawer (e.g. @react-navigation/drawer) for sidebars.
  // These styles are for a manual slide-in View using Animated.
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 260,
    backgroundColor: colors.dark, // gradient → LinearGradient
    paddingHorizontal: 14,
    paddingVertical: 32,
    zIndex: 2000,
    ...shadow(4),
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(56,189,248,0.3)',
    marginBottom: 24,
    letterSpacing: 1,
  },
  sidebarLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  sidebarLinkActive: {
    backgroundColor: colors.primary, // gradient → LinearGradient
    ...shadow(2),
  },
  sidebarLinkText: {
    color: '#cbd5e1',
    fontSize: 15,
    fontWeight: '500',
  },
  sidebarLinkTextActive: {
    color: colors.white,
  },

  // ── Student Header bar ─────────────────────────────────────────────────────
  studentHeader: {
    backgroundColor: colors.white,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadow(1),
  },
  menuBtn: {
    padding: 4,
  },
  menuBtnText: {
    fontSize: 24,
    color: colors.primary,
  },
  studentHeaderTitle: {
    color: colors.dark,
    fontSize: 16,
    fontWeight: '500',
  },
  notificationWrap: {
    position: 'relative',
  },
  notificationText: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#ef4444',
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },

  // ── Announcements ──────────────────────────────────────────────────────────
  announcementItem: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
    ...shadow(1),
  },
  announcementDate: {
    backgroundColor: colors.border,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 30,
    color: colors.darkMid,
    fontWeight: '600',
    fontSize: 13,
  },
  announcementTitle: {
    color: colors.darkMid,
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    marginHorizontal: 8,
  },
  announcementBadge: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 30,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default styles;
