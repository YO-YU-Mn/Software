import { View, Text, StyleSheet } from 'react-native';

import AppCard from '../common/AppCard';
import AppButton from '../common/AppButton';

import { COLORS } from '../../constants/theme';

export default function CourseCard({
  course,
  selected,
  handleSelect,
}: any) {
  const isSelected = selected.find(
    (c: any) => c.id === course.id
  );

  return (
    <AppCard
      style={[
        isSelected && {
          borderColor: COLORS.secondary,
          borderWidth: 2,
        },
      ]}
    >
      <Text style={styles.code}>{course.id}</Text>

      <Text style={styles.name}>
        {course.name}
      </Text>

      <Text style={styles.hours}>
        {course.hours} ساعات
      </Text>

      <AppButton
        title={isSelected ? 'حذف' : 'اختيار'}
        onPress={() => handleSelect(course)}
        danger={isSelected}
      />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  code: {
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: 6,
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
  },

  hours: {
    marginVertical: 10,
    color: COLORS.gray,
  },
});