import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SHADOWS } from '../../constants/theme';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CourseCard({ course, isSelected, onSelect, totalHours }: any) {
  const canSelect = course.canRegister && !isSelected;
  const isOverLimit = totalHours + (course?.hours || 0) > 18;

  // حالة المادة مسجلة مسبقاً
  if (course.isRegistered) {
    return (
      <View style={[styles.courseCard, styles.registeredCard]}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseCode}>{course?.id || 'CS101'}</Text>
          <View style={styles.hoursBadge}>
            <Text style={styles.hoursText}>{course?.hours || 0} ساعات</Text>
          </View>
        </View>
        <Text style={styles.courseTitle}>{course?.name || 'بدون عنوان'}</Text>
        <Text style={styles.courseInstructor}>د. {course?.instructor || 'أحمد محمد'}</Text>

        {course?.schedule && Array.isArray(course.schedule) && (
          <View style={styles.scheduleInfo}>
            <Text style={styles.scheduleTitle}>مواعيد المحاضرات</Text>
            {course.schedule.map((s: any, idx: number) => (
              <View key={idx} style={styles.scheduleItem}>
                <Text style={styles.scheduleDay}>{s?.day || 'غير محدد'}: </Text>
                <Text style={styles.scheduleTime}>{s?.time || 'غير محدد'}</Text>
                <Text style={styles.scheduleLocation}> - {s?.location || 'قاعة 101'}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={[styles.btnSelect, styles.btnDisabled]} disabled>
          <Text style={styles.btnTextDisabled}>مسجل مسبقاً</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // الحالة العادية
  return (
    <View style={[styles.courseCard, isSelected && styles.selectedCard]}>
      <View style={styles.courseHeader}>
        <Text style={styles.courseCode}>{course?.id || 'CS101'}</Text>
        <View style={styles.hoursBadge}>
          <Text style={styles.hoursText}>{course?.hours || 0} ساعات</Text>
        </View>
      </View>

      <Text style={styles.courseTitle}>{course?.name || 'بدون عنوان'}</Text>
      <Text style={styles.courseInstructor}>د. {course?.instructor || 'أحمد محمد'}</Text>

      {course?.schedule && Array.isArray(course.schedule) && (
        <View style={styles.scheduleInfo}>
          <Text style={styles.scheduleTitle}>مواعيد المحاضرات</Text>
          {course.schedule.map((s: any, idx: number) => (
            <View key={idx} style={styles.scheduleItem}>
              <Text style={styles.scheduleDay}>{s?.day} </Text>
              <Text style={styles.scheduleTime}>{s?.time}</Text>
              <Text style={styles.scheduleLocation}> ({s?.location})</Text>
            </View>
          ))}
        </View>
      )}

      {!course.canRegister && !isSelected && (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            {!course.prerequisitesMet && " لم تستوفِ المتطلبات السابقة لهذه المادة."}
            {course.prerequisitesMet && !course.hasCapacity && " السعة ممتلئة لهذه المادة."}
          </Text>
        </View>
      )}

      <View style={styles.courseActions}>
        {isSelected ? (
          <TouchableOpacity style={styles.btnRemove} onPress={() => onSelect(course)}>
            <Text style={styles.btnTextWhite}>delete</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btnSelect, (!canSelect || isOverLimit) && styles.btnDisabled]}
            onPress={() => onSelect(course)}
            disabled={!canSelect || isOverLimit}
          >
            <Text style={styles.btnTextWhite}>choose</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...SHADOWS.small,
  },
  registeredCard: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  selectedCard: { borderColor: COLORS.primary, borderWidth: 2 },
  courseHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  courseCode: { fontWeight: 'bold', color: COLORS.gray },
  hoursBadge: { backgroundColor: '#e2e8f0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  hoursText: { fontSize: 12, color: '#475569' },
  courseTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 4, textAlign: 'right' },
  courseInstructor: { fontSize: 14, color: '#64748b', marginBottom: 12, textAlign: 'right' },
  scheduleInfo: { backgroundColor: '#f8fafc', padding: 8, borderRadius: 8, marginBottom: 12 },
  scheduleTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 4, color: '#475569', textAlign: 'right' },
  scheduleItem: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 2 },
  scheduleDay: { fontSize: 12, fontWeight: '600' },
  scheduleTime: { fontSize: 12 },
  scheduleLocation: { fontSize: 12, fontStyle: 'italic' },
  warningContainer: { padding: 8, backgroundColor: '#fff1f2', borderRadius: 6, marginBottom: 12 },
  warningText: { color: '#e11d48', fontSize: 12 },
  courseActions: { marginTop: 8 },
  btnSelect: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 8, alignItems: 'center' },
  btnRemove: { backgroundColor: '#dc2626', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#cbd5e1' },
  btnTextWhite: { color: '#fff', fontWeight: 'bold' },
  btnTextDisabled: { color: '#94a3b8' },
});