import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export default function RegistrationFooter({ selectedCourses, totalHours, loading, onSubmit, disabled }: any) {
  return (
    <View style={styles.footer}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>المواد المختارة: {selectedCourses.length}</Text>
        <Text style={styles.summaryText}>إجمالي الساعات: {totalHours} / 18</Text>
      </View>
      <TouchableOpacity
        style={[styles.submitBtn, (loading || selectedCourses.length === 0 || disabled) && styles.disabledBtn]}
        onPress={onSubmit}
        disabled={loading || selectedCourses.length === 0 || disabled}
      >
        <Text style={styles.submitText}>{loading ? 'جاري التسجيل...' : 'تأكيد التسجيل'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.96)',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summary: { flexDirection: 'column', alignItems: 'flex-end' },
  summaryText: { fontSize: 14, color: COLORS.dark, fontWeight: '500' },
  submitBtn: { backgroundColor: COLORS.secondary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 40 },
  disabledBtn: { backgroundColor: '#94a3b8', opacity: 0.7 },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});