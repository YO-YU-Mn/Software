import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors, space, radius, type } from '@/constants/designTokens';

/**
 * Catalog list for “Items list” checklist — maps to browseable courses.
 */
export default function CoursesList({ data = [], emptyMessage = 'لا نتائج', onPressItem, style }) {
  if (!data.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={[{ flex: 1 }, style]}
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <PressableScale accessibilityRole="button" onPress={() => onPressItem?.(item)} style={styles.row}>
          <View style={styles.rowTop}>
            <Text style={styles.code}>{item.id}</Text>
            <Text style={styles.chip}>{item.hours ?? 0} س</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
          {item.instructor ? (
            <Text style={styles.sub} numberOfLines={1}>
              د. {item.instructor}
            </Text>
          ) : null}
        </PressableScale>
      )}
      ItemSeparatorComponent={() => <View style={{ height: space.sm }} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 120, paddingHorizontal: space.xxs },
  row: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  code: { ...type.caption, color: colors.primary, fontWeight: '700' },
  chip: {
    ...type.micro,
    color: colors.slateLight,
    backgroundColor: colors.bgAlt,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  title: { ...type.headline, color: colors.dark, marginTop: space.xs, textAlign: 'right' },
  sub: { ...type.callout, color: colors.muted, marginTop: 4, textAlign: 'right' },
  empty: { flex: 1, padding: space.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { ...type.body, color: colors.muted, textAlign: 'center' },
});
