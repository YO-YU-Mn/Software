import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { PrimaryButton, SecondaryButton } from '@/components/ui/PrimaryButton';
import { useCourseCart } from '../../contexts/CourseCartContext';
import Toast from 'react-native-toast-message';

/**
 * “Add to cart” for student planning — persists until registration merges.
 */
export default function AddToPlannedCoursesButton({ course }) {
  const { addItem, items, removeItem } = useCourseCart();
  const id = course?.id;
  const inCart = id && items.some((i) => i.id === String(id));

  const onAdd = () => {
    if (!id) return;
    addItem(course);
    Toast.show({ type: 'success', text1: 'أُضيفت إلى خطة التسجيل (السلة)' });
  };

  const onRemove = () => {
    if (!id) return;
    removeItem(id);
    Toast.show({ type: 'info', text1: 'أُزيلت من خطة التسجيل' });
  };

  return (
    <View style={styles.wrap}>
      {inCart ? (
        <SecondaryButton title="إزالة من الخطة" onPress={onRemove} />
      ) : (
        <PrimaryButton title="إضافة إلى خطة التسجيل" onPress={onAdd} />
      )}
      <Text style={styles.help}>
        افتح «تسجيل المقررات»، ثم اضغط «تحضير للتسجيل» أسفل الكتالوج لدمج السلة بعد التحقّق من القواعد.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  help: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
    lineHeight: 18,
  },
});
