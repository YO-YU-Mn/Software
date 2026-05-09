import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, space, radius, type } from '@/constants/designTokens';

/**
 * Single “item” detail view for a catalog course.
 */
export default function CourseDetailView({ course }) {
  const c = course || {};
  return (
    <View style={styles.root}>
      <View style={styles.hero}>
        <Text style={styles.code}>{c.id ?? '—'}</Text>
        <Text style={styles.title}>{c.name ?? '—'}</Text>
        <Text style={styles.meta}>
          {c.hours ?? 0} ساعات · {c.department ?? '—'} · المستوى {c.level ?? '—'} · الفصل {c.semester ?? '—'}
        </Text>
        {c.instructor ? <Text style={styles.ins}>المدرِّس: د. {c.instructor}</Text> : null}
      </View>

      {Array.isArray(c.schedule) && c.schedule.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>الجدول</Text>
          {c.schedule.map((s, idx) => (
            <Text key={`${idx}-${s?.day}`} style={styles.line}>
              {s?.day}: {s?.time} {s?.location ? `· ${s.location}` : ''}
            </Text>
          ))}
        </View>
      ) : null}

      {Array.isArray(c.prerequisites) && c.prerequisites.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>المتطلبات السابقة</Text>
          <Text style={styles.line}>{c.prerequisites.join('، ')}</Text>
        </View>
      ) : null}

      <Text style={styles.hint}>السعة: {typeof c.capacity === 'number' ? `${c.enrolledStudents ?? 0} / ${c.capacity}` : '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {},
  hero: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space.md,
  },
  code: { ...type.caption, color: colors.primary, fontWeight: '800', marginBottom: space.xxs, textAlign: 'right' },
  title: { ...type.display, fontSize: 24, color: colors.dark, textAlign: 'right' },
  meta: {
    ...type.callout,
    color: colors.slateLight,
    marginTop: space.sm,
    textAlign: 'right',
    lineHeight: 22,
  },
  ins: { ...type.body, marginTop: space.xs, textAlign: 'right', color: colors.darkMid },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space.md,
  },
  cardTitle: { ...type.headline, marginBottom: space.sm, textAlign: 'right', color: colors.dark },
  line: {
    ...type.callout,
    color: colors.darkMid,
    textAlign: 'right',
    marginBottom: 4,
    lineHeight: 20,
  },
  hint: { ...type.micro, color: colors.muted, textAlign: 'right' },
});
