/**
 * app/(tabs)/SchedulePage.jsx
 *
 * What changed vs original:
 *  - Replaced useNavigation() (React Navigation) with useRouter() (expo-router)
 *    for consistent navigation and to fix potential freeze when mixing the two.
 *  - Added refreshKey from useAuth() to the two useEffect dependency arrays
 *    so both fetchSchedule and fetchRegStatus re-run after every fresh login.
 *  - navigation.navigate() → router.push() for tab navigation.
 *  - Everything else (UI, drop/reset handlers, styles) is unchanged.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SkeletonBlock } from '@/components/ui/Skeleton';
import { EmptyState }    from '@/components/ui/EmptyState';
import { colors, space } from '@/constants/designTokens';
import { useRouter }     from 'expo-router';       // ← expo-router, not RN nav
import axios             from 'axios';
import Toast             from 'react-native-toast-message';
import AsyncStorage      from '@react-native-async-storage/async-storage';
import { API_BASE_URL }  from '../../config';
import { useAuth }       from '@/contexts/AuthContext';
import { useRequireAuth }         from '@/hooks/useRequireAuth';
import { useProtectedBackToLogin } from '@/hooks/useProtectedBackToLogin';

function SchedulePage() {
  const { authReady, checking } = useRequireAuth();
  useProtectedBackToLogin();
  const router = useRouter();

  const { refreshKey } = useAuth();
  const [courses,          setCourses]          = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [registrationOpen, setRegistrationOpen] = useState(true);

  const fetchRegStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res   = await axios.get(`${API_BASE_URL}/settings/status`, {
        headers: { Authorization: token },
      });
      setRegistrationOpen(res.data.registrationOpen);
    } catch (err) {
      console.error('Failed to fetch registration status', err);
    }
  }, []);

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res   = await axios.get(`${API_BASE_URL}/courses/current`, {
        headers: { Authorization: token },
      });
      setCourses(res.data);
    } catch (err) {
      console.error(err);
      Toast.show({ type: 'error', text1: 'فشل تحميل الجدول' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-run on mount AND on every fresh login (refreshKey bump).
  useEffect(() => {
    if (!authReady) return;
    fetchRegStatus();
    fetchSchedule();
  }, [authReady, refreshKey, fetchRegStatus, fetchSchedule]);

  const handleDrop = (courseId) => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد من حذف هذه المادة؟',
      [
        { text: 'no', style: 'cancel' },
        {
          text:  'yes',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.delete(`${API_BASE_URL}/courses/drop`, {
                headers: { Authorization: token },
                data:    { course_id: courseId },
              });
              Toast.show({ type: 'success', text1: 'تم حذف المادة بنجاح' });
              setCourses(prev => prev.filter(c => c.course_id !== courseId));
            } catch {
              Toast.show({ type: 'error', text1: 'حدث خطأ أثناء الحذف' });
            }
          },
        },
      ],
    );
  };

  const handleReset = () => {
    Alert.alert(
      'تأكيد إعادة التسجيل',
      'هل أنت متأكد من إعادة تسجيل المواد؟ سيتم حذف جميع المواد المسجلة حالياً.',
      [
        { text: 'no', style: 'cancel' },
        {
          text:  'yes',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await axios.delete(`${API_BASE_URL}/courses/drop-all`, {
                headers: { Authorization: token },
              });
              Toast.show({ type: 'success', text1: 'تم حذف جميع المواد، يمكنك التسجيل من جديد' });
              router.push('/RegistrationPage'); // expo-router push
            } catch {
              Toast.show({ type: 'error', text1: 'حدث خطأ أثناء حذف المواد' });
            }
          },
        },
      ],
    );
  };

  // ── Render guards ─────────────────────────────────────────────────────────
  if (checking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (!authReady) return null;

  if (loading) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.bg }]}
        contentContainerStyle={{ padding: space.md, gap: space.md }}>
        <SkeletonBlock /><SkeletonBlock /><SkeletonBlock />
      </ScrollView>
    );
  }

  if (courses.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg, justifyContent: 'center', padding: space.md }]}>
        <EmptyState
          icon="📅"
          title="لا يوجد جدول مسجل"
          message="لم تقم بتسجيل أي مواد بعد. انتقل إلى تسجيل المقررات لإضافة موادك."
          actionLabel="تسجيل مواد الآن"
          actionDisabled={!registrationOpen}
          onAction={() => {
            if (!registrationOpen) {
              Toast.show({ type: 'error', text1: 'تسجيل المواد مغلق حالياً' });
              return;
            }
            router.push('/RegistrationPage');
          }}
        />
      </View>
    );
  }

  const totalHours = courses.reduce((sum, c) => sum + (c.credits || 0), 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الجدول الدراسي</Text>
        <View style={styles.scheduleActions}>
          <TouchableOpacity style={styles.btnReset} onPress={handleReset}>
            <Text style={styles.btnResetText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.scheduleSummary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryIcon}>📚</Text>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle}>Subjects</Text>
            <Text style={styles.summaryValue}>{courses.length}</Text>
          </View>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryIcon}>⏱️</Text>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle}>Total Hours</Text>
            <Text style={styles.summaryValue}>{totalHours}/18</Text>
          </View>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryIcon}>📅</Text>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle}>Days</Text>
            <Text style={styles.summaryValue}>
              {new Set(
                courses.flatMap(c => c?.schedule?.map(s => s?.day) || []).filter(Boolean),
              ).size}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.scheduleCards}>
        {courses.map(course => (
          <View key={course.course_id} style={styles.scheduleCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.courseName}>{course.title || 'بدون عنوان'}</Text>
              <View style={styles.courseBadge}>
                <Text style={styles.courseBadgeText}>{course.credits || 0} Hours</Text>
              </View>
            </View>

            <View style={styles.courseDetails}>
              <Text style={styles.detailItem}>👨‍🏫 {course.instructor || 'د. أحمد محمد'}</Text>
              <Text style={styles.detailItem}>🏛️ {course.department  || 'علوم حاسب'}</Text>
            </View>

            {Array.isArray(course.schedule) && course.schedule.length > 0 && (
              <View style={styles.scheduleTimetable}>
                <Text style={styles.timetableTitle}>📍 مواعيد المحاضرات</Text>
                <View style={styles.timetableGrid}>
                  {course.schedule.map((s, index) => (
                    <View key={index} style={styles.timetableRow}>
                      <Text style={styles.timetableDay}>{s?.day      || 'غير محدد'}</Text>
                      <Text style={styles.timetableTime}>{s?.time     || 'غير محدد'}</Text>
                      <Text style={styles.timetableLocation}>📍 {s?.location || 'قاعة 101'}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.courseInfo}>
              <Text style={styles.infoItem}>🆔 Subject Code: {course.course_id}</Text>
              <Text style={styles.infoItem}>⏰ {course.credits || 0} Hours</Text>
            </View>

            <TouchableOpacity
              style={styles.btnDrop}
              onPress={() => handleDrop(course.course_id)}>
              <Text style={styles.btnDropText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Weekly View */}
      <View style={styles.weeklyView}>
        <Text style={styles.weeklyTitle}>📅 عرض أسبوعي</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.weeklyGrid}>
            {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'].map(day => (
              <View key={day} style={styles.weekDay}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayName}>{day}</Text>
                  <Text style={styles.dayDate}>2026/03/01</Text>
                </View>
                {courses
                  .filter(c => c?.schedule?.some(s => s?.day === day))
                  .map(course => (
                    <View key={course.course_id} style={styles.weekCourse}>
                      <Text style={styles.weekCourseTitle}>{course.title}</Text>
                      <Text style={styles.weekCourseTime}>
                        {course.schedule.find(s => s?.day === day)?.time || ''}
                      </Text>
                      <Text style={styles.weekCourseLocation}>
                        {course.schedule.find(s => s?.day === day)?.location || ''}
                      </Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

export default SchedulePage;

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#F5F5F5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
  header: {
    backgroundColor: '#FFF', padding: 20,
    borderBottomWidth: 1, borderBottomColor: '#E0E0E0',
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  headerTitle:    { fontSize: 24, fontWeight: 'bold', color: '#333' },
  scheduleActions: { flexDirection: 'row', gap: 10 },
  btnReset: { backgroundColor: '#FF3B30', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  btnResetText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  scheduleSummary: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: '#FFF', padding: 20,
    marginTop: 10, marginHorizontal: 15,
    borderRadius: 12, elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  summaryItem: { alignItems: 'center' },
  summaryIcon:  { fontSize: 32, marginBottom: 8 },
  summaryInfo:  { alignItems: 'center' },
  summaryTitle: { fontSize: 12, color: '#666', marginBottom: 4 },
  summaryValue: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  scheduleCards: { padding: 15 },
  scheduleCard: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 20, marginBottom: 15,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 15,
  },
  courseName:       { fontSize: 18, fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'right' },
  courseBadge:      { backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  courseBadgeText:  { color: '#1976D2', fontSize: 12, fontWeight: '600' },
  courseDetails:    { marginBottom: 15 },
  detailItem:       { fontSize: 14, color: '#666', marginBottom: 5, textAlign: 'right' },
  scheduleTimetable: { backgroundColor: '#F8F9FA', borderRadius: 8, padding: 15, marginBottom: 15 },
  timetableTitle:   { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10, textAlign: 'right' },
  timetableGrid:    { gap: 8 },
  timetableRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: '#FFF', padding: 10, borderRadius: 6,
  },
  timetableDay:      { fontSize: 13, fontWeight: '600', color: '#333', flex: 1, textAlign: 'right' },
  timetableTime:     { fontSize: 13, color: '#666', flex: 1, textAlign: 'center' },
  timetableLocation: { fontSize: 12, color: '#999', flex: 1, textAlign: 'left' },
  courseInfo: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 15, paddingTop: 15,
    borderTopWidth: 1, borderTopColor: '#E0E0E0',
  },
  infoItem:  { fontSize: 12, color: '#666' },
  btnDrop:   { backgroundColor: '#FF3B30', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnDropText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  weeklyView:  { padding: 15, marginBottom: 20 },
  weeklyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'right' },
  weeklyGrid:  { flexDirection: 'row', gap: 15 },
  weekDay: {
    backgroundColor: '#FFF', borderRadius: 12, padding: 15, width: 200,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  dayHeader:        { borderBottomWidth: 2, borderBottomColor: '#007AFF', paddingBottom: 10, marginBottom: 10 },
  dayName:          { fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'right' },
  dayDate:          { fontSize: 12, color: '#666', marginTop: 4, textAlign: 'right' },
  weekCourse:       { backgroundColor: '#F0F8FF', padding: 12, borderRadius: 8, marginBottom: 10 },
  weekCourseTitle:  { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 5, textAlign: 'right' },
  weekCourseTime:   { fontSize: 12, color: '#666', marginBottom: 3, textAlign: 'right' },
  weekCourseLocation: { fontSize: 11, color: '#999', textAlign: 'right' },
});
