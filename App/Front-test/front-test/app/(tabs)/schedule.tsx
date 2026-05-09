import { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { COLORS, SHADOWS } from '../../constants/theme';
import API_URL from '../../config/api';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function SchedulePage() {
  const { token } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSchedule = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/courses/current`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'فشل تحميل الجدول' });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSchedule();
    setRefreshing(false);
  };

  useFocusEffect(
  useCallback(() => {
    loadSchedule();
  }, [token])
);

  // حذف مادة واحدة
  const handleDrop = (courseId: string) => {
    Alert.alert('تأكيد الحذف', 'هل أنت متأكد من حذف هذه المادة؟', [
      { text: 'لا', style: 'cancel' },
      {
        text: 'نعم',
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/courses/drop`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json', Authorization: token as string },
              body: JSON.stringify({ course_id: courseId }),
            });
            if (res.ok) {
              Toast.show({ type: 'success', text1: 'تم حذف المادة بنجاح' });
              setCourses(prev => prev.filter(c => c.course_id !== courseId));
            } else {
              Toast.show({ type: 'error', text1: 'فشل الحذف' });
            }
          } catch {
            Toast.show({ type: 'error', text1: 'حدث خطأ أثناء الحذف' });
          }
        },
      },
    ]);
  };

  // إعادة تسجيل (حذف كل المواد)
  const handleReset = () => {
    Alert.alert('تأكيد إعادة التسجيل', 'سيتم حذف جميع المواد المسجلة حالياً. هل أنت متأكد؟', [
      { text: 'لا', style: 'cancel' },
      {
        text: 'نعم',
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/courses/drop-all`, {
              method: 'DELETE',
              headers: { Authorization: token as string },
            });
            if (res.ok) {
              Toast.show({ type: 'success', text1: 'تم حذف جميع المواد، يمكنك التسجيل من جديد' });
              router.push('/(tabs)/registration');
            } else {
              Toast.show({ type: 'error', text1: 'فشل حذف المواد' });
            }
          } catch {
            Toast.show({ type: 'error', text1: 'حدث خطأ أثناء حذف المواد' });
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (courses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📅</Text>
        <Text style={styles.emptyTitle}>لا يوجد جدول مسجل</Text>
        <Text style={styles.emptySubtitle}>لم تقم بتسجيل أي مواد بعد</Text>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push('/(tabs)/registration')}
        >
          <Text style={styles.registerButtonText}>تسجيل مواد الآن</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // حساب الإحصائيات
  const totalHours = courses.reduce((sum, c) => sum + (c.credits || 0), 0);
  const uniqueDays = new Set(
    courses.flatMap(c => c?.schedule?.map((s: any) => s?.day) || []).filter(Boolean)
  ).size;

  // مواد لكل يوم (للجدول الأسبوعي)
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const coursesByDay: Record<string, any[]> = {};
  daysOfWeek.forEach(day => {
    coursesByDay[day] = courses.filter(c =>
      c?.schedule?.some((s: any) => s?.day === day)
    );
  });

  return (
    <ScrollView
    alwaysBounceVertical={true}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الجدول الدراسي</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}> إعادة تسجيل</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryIcon}>📚</Text>
          <Text style={styles.summaryLabel}>المواد</Text>
          <Text style={styles.summaryValue}>{courses.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryIcon}>⏱️</Text>
          <Text style={styles.summaryLabel}>الساعات</Text>
          <Text style={styles.summaryValue}>
            {totalHours} / 18
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryIcon}>📅</Text>
          <Text style={styles.summaryLabel}>أيام</Text>
          <Text style={styles.summaryValue}>{uniqueDays}</Text>
        </View>
      </View>

      {/* المواد المسجلة (كبطاقات) */}
      <Text style={styles.sectionTitle}>المواد المسجلة</Text>
      {courses.map(course => (
        <View key={course.course_id} style={styles.courseCard}>
          <View style={styles.courseHeader}>
            <Text style={styles.courseTitle}>{course.title || 'بدون عنوان'}</Text>
            <View style={styles.creditBadge}>
              <Text style={styles.creditBadgeText}>{course.credits || 0} ساعات</Text>
            </View>
          </View>
          <Text style={styles.courseInstructor}>د. {course.instructor || 'أحمد محمد'}</Text>
          <Text style={styles.courseCode}>الكود: {course.course_id}</Text>

          {/* مواعيد المادة */}
          {course?.schedule && course.schedule.length > 0 && (
            <View style={styles.scheduleSection}>
              <Text style={styles.scheduleTitle}> مواعيد المحاضرات</Text>
              {course.schedule.map((s: any, idx: number) => (
                <View key={idx} style={styles.scheduleRow}>
                  <Text style={styles.scheduleDay}>{s.day || 'غير محدد'}</Text>
                  <Text style={styles.scheduleTime}>{s.time || 'غير محدد'}</Text>
                  <Text style={styles.scheduleLocation}> {s.location || 'قاعة 101'}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDrop(course.course_id)}>
            <Text style={styles.deleteButtonText}> delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* العرض الأسبوعي (جدول) */}
      <Text style={styles.sectionTitle}>📅 العرض الأسبوعي</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weeklyScroll}>
        <View style={styles.weeklyGrid}>
          {daysOfWeek.map(day => (
            <View key={day} style={styles.weekDayColumn}>
              <View style={styles.weekDayHeader}>
                <Text style={styles.weekDayName}>{day}</Text>
              </View>
              {coursesByDay[day].length === 0 ? (
                <View style={styles.emptyDayCell}>
                  <Text style={styles.emptyDayText}>—</Text>
                </View>
              ) : (
                coursesByDay[day].map(course => {
                  const slot = course.schedule.find((s: any) => s.day === day);
                  return (
                    <View key={course.course_id} style={styles.weekCourseCard}>
                      <Text style={styles.weekCourseTitle}>{course.title}</Text>
                      <Text style={styles.weekCourseTime}>{slot?.time || 'وقت غير محدد'}</Text>
                      <Text style={styles.weekCourseLocation}>{slot?.location || 'قاعة 101'}</Text>
                    </View>
                  );
                })
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark, marginBottom: 8 },
  emptySubtitle: { fontSize: 16, color: COLORS.gray, marginBottom: 24, textAlign: 'center' },
  registerButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 40,
  },
  registerButtonText: { color: '#fff', fontWeight: 'bold' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  resetButton: {
    backgroundColor: COLORS.danger,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
  },
  resetButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    ...SHADOWS.small,
  },
  summaryIcon: { fontSize: 28, marginBottom: 6 },
  summaryLabel: { fontSize: 12, color: COLORS.gray, marginBottom: 4 },
  summaryValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginVertical: 16,
    textAlign: 'right',
  },

  courseCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.dark, flex: 1, textAlign: 'right' },
  creditBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  creditBadgeText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  courseInstructor: { fontSize: 14, color: COLORS.gray, marginBottom: 6, textAlign: 'right' },
  courseCode: { fontSize: 13, color: COLORS.gray, marginBottom: 12, textAlign: 'right' },

  scheduleSection: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 12,
    marginVertical: 12,
  },
  scheduleTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.dark, marginBottom: 8, textAlign: 'right' },
  scheduleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  scheduleDay: { fontSize: 13, fontWeight: '600', color: COLORS.primary, width: 80 },
  scheduleTime: { fontSize: 13, color: COLORS.dark, flex: 1 },
  scheduleLocation: { fontSize: 12, color: COLORS.gray },

  deleteButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 10,
    borderRadius: 40,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: { color: '#dc2626', fontWeight: 'bold' },

  // العرض الأسبوعي
  weeklyScroll: { marginBottom: 30 },
  weeklyGrid: { flexDirection: 'row', gap: 12 },
  weekDayColumn: {
    width: 130,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 8,
    ...SHADOWS.small,
  },
  weekDayHeader: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    paddingBottom: 8,
    marginBottom: 8,
  },
  weekDayName: { fontSize: 14, fontWeight: 'bold', color: COLORS.dark, textAlign: 'center' },
  emptyDayCell: { height: 60, justifyContent: 'center', alignItems: 'center' },
  emptyDayText: { color: COLORS.gray, fontSize: 12 },
  weekCourseCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
  },
  weekCourseTitle: { fontSize: 12, fontWeight: 'bold', color: COLORS.dark, marginBottom: 4 },
  weekCourseTime: { fontSize: 10, color: COLORS.gray },
  weekCourseLocation: { fontSize: 10, color: COLORS.gray, marginTop: 2 },
});