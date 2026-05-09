import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CourseDetailView from '@/components/courses/CourseDetailView';
import AddToPlannedCoursesButton from '@/components/courses/AddToPlannedCoursesButton';
import CourseReviewsSection from '@/components/student/CourseReviewsSection';
import { API_BASE_URL } from '@/config';
import { colors, space } from '@/constants/designTokens';
import { useAuth } from '@/contexts/AuthContext';

function mapMongo(c: Record<string, unknown>) {
  return {
    id: String(c.course_id ?? ''),
    name: String(c.title ?? '—'),
    hours: typeof c.credits === 'number' ? c.credits : 0,
    instructor: String(c.instructor ?? ''),
    department: String(c.department ?? ''),
    level: typeof c.level === 'number' ? c.level : undefined,
    semester: typeof c.semester === 'number' ? c.semester : undefined,
    schedule: Array.isArray(c.schedule) ? c.schedule : [],
    prerequisites: Array.isArray(c.prerequisites) ? (c.prerequisites as string[]) : [],
    enrolledStudents: typeof c.enrolledStudents === 'number' ? c.enrolledStudents : undefined,
    capacity: typeof c.capacity === 'number' ? c.capacity : undefined,
  };
}

export default function CourseDetailScreen() {
  const navigation = useNavigation();
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();
  const cid = typeof courseId === 'string' ? courseId : Array.isArray(courseId) ? courseId[0] : '';
  const { user } = useAuth();

  const [course, setCourse] = useState<ReturnType<typeof mapMongo> | null>(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({ title: cid ? `المقرر ${cid}` : 'مقرر' });
  }, [navigation, cid]);

  const load = useCallback(async () => {
    if (!cid) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/courses/course/${encodeURIComponent(cid)}`);
      const data = res.data as Record<string, unknown>;
      if (!data?.course_id) {
        setCourse(null);
        Toast.show({ type: 'error', text1: 'المقرر غير موجود' });
        return;
      }
      setCourse(mapMongo(data));
    } catch {
      setCourse(null);
      Toast.show({ type: 'error', text1: 'تعذّر تحميل المقرر' });
    } finally {
      setLoading(false);
    }
  }, [cid]);

  useEffect(() => {
    void load();
  }, [load]);

  useLayoutEffect(() => {
    if (course?.id) navigation.setOptions({ title: course.id });
  }, [navigation, course?.id]);

  if (loading || !course) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled">
      <CourseDetailView course={course} />
      <View style={styles.toolbar}>
        <AddToPlannedCoursesButton course={course} />
      </View>
      <CourseReviewsSection courseId={course.id} authReady={!!user} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bgAlt },
  scrollContent: { paddingHorizontal: space.md, paddingBottom: space.xxl },
  toolbar: { paddingVertical: space.md },
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgAlt,
  },
});
