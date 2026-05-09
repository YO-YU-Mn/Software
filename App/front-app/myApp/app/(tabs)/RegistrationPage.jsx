/**
 * app/(tabs)/RegistrationPage.jsx
 *
 * What changed vs original:
 *  - Imports useAuth to read refreshKey.
 *  - All three useEffect data-fetches now include refreshKey in their
 *    dependency arrays so they always re-run after a fresh login.
 *  - Everything else is identical to the original.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SkeletonBlock }  from '@/components/ui/Skeleton';
import { EmptyState }     from '@/components/ui/EmptyState';
import { colors, space, radius, type, elevationShadow } from '@/constants/designTokens';
import { useRouter }      from 'expo-router';
import CourseCard         from '../../components/student/CourseCard';
import RegistrationFooter from '../../components/student/RegistrationFooter';
import axios              from 'axios';
import AsyncStorage       from '@react-native-async-storage/async-storage';
import Toast              from 'react-native-toast-message';
import { API_BASE_URL }   from '../../config';
import { useAuth }        from '@/contexts/AuthContext';
import { useCourseCart } from '../../contexts/CourseCartContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useProtectedBackToLogin } from '@/hooks/useProtectedBackToLogin';

function RegistrationPage() {
  const { authReady, checking } = useRequireAuth();
  useProtectedBackToLogin();

  const { refreshKey } = useAuth(); // bump on login → force re-fetch

  const [selectedCourses,  setSelectedCourses]  = useState([]);
  const [loading,          setLoading]          = useState(false);
  const [pageLoading,      setPageLoading]      = useState(true);
  const [coursesList,      setCoursesList]      = useState([]);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [creditLimit,      setCreditLimit]      = useState(18);
  const [advisorWarnings,  setAdvisorWarnings]  = useState([]);
  const [suggestedIds,     setSuggestedIds]     = useState([]);
  const router = useRouter();
  const { consumePlannedCoursesMerge } = useCourseCart();

  const totalHours = selectedCourses.reduce((s, c) => s + (c.hours || 0), 0);

  // Re-fetch all page data whenever auth refreshKey changes.
  useEffect(() => {
    if (!authReady) return;

    const fetchRegStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/settings/status`, {
          headers: { Authorization: token },
        });
        setRegistrationOpen(res.data.registrationOpen);
      } catch (err) {
        console.error(err);
        Toast.show({ type: 'error', text1: 'فشل تحميل حالة التسجيل' });
      }
    };

    const fetchAdvisor = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/courses/advisor-summary`, {
          headers: { Authorization: token },
        });
        if (typeof res.data.effectiveMaxCredits === 'number') {
          setCreditLimit(res.data.effectiveMaxCredits);
        }
        setAdvisorWarnings(res.data.warnings      || []);
        setSuggestedIds(res.data.suggestedCourseIds || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchCourses = async () => {
      setPageLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/courses/available-courses`, {
          headers: { Authorization: token },
        });
        setCoursesList(res.data);
      } catch (err) {
        console.error(err);
        Toast.show({ type: 'error', text1: 'فشل تحميل المواد' });
      } finally {
        setPageLoading(false);
      }
    };

    fetchRegStatus();
    fetchAdvisor();
    fetchCourses();
  }, [authReady, refreshKey]); // ← refreshKey ensures fresh data after login

  const hasConflict = useCallback(
    (course, pool = selectedCourses) => {
      if (!course.schedule) return false;
      for (const selected of pool) {
        if (!selected.schedule) continue;
        for (const s1 of selected.schedule) {
          for (const s2 of course.schedule) {
            if (s1.day === s2.day && s1.time === s2.time) return true;
          }
        }
      }
      return false;
    },
    [selectedCourses]
  );

  useEffect(() => {
    if (!authReady || pageLoading || coursesList.length === 0) return;

    const planner = consumePlannedCoursesMerge();
    if (!planner || planner.length === 0) return;

    setSelectedCourses((prev) => {
      const merged = [...prev];
      for (const plan of planner) {
        const course = coursesList.find((x) => x.id === plan.id);
        if (!course || !registrationOpen || !course.canRegister || course.isRegistered) continue;
        if (merged.some((x) => x.id === course.id)) continue;

        const total = merged.reduce((s, c) => s + (c.hours || 0), 0);
        if (total + (course.hours || 0) > creditLimit) continue;
        if (hasConflict(course, merged)) continue;
        merged.push(course);
      }

      if (merged.length > prev.length) {
        Toast.show({
          type: 'info',
          text1: 'تم دمج بعض المواد من «خطة التسجيل» حيث سُمح بالقواعد.',
        });
      }
      return merged;
    });
  }, [
    authReady,
    pageLoading,
    coursesList,
    creditLimit,
    registrationOpen,
    consumePlannedCoursesMerge,
    hasConflict,
  ]);

  function handleSelect(course) {
    if (!registrationOpen) {
      Toast.show({ type: 'error', text1: 'تسجيل المواد مغلق حالياً' });
      return;
    }
    if (course.isRegistered) {
      Toast.show({ type: 'error', text1: 'هذه المادة مسجلة مسبقاً' });
      return;
    }
    if (!course.canRegister) {
      Toast.show({
        type:  'error',
        text1: 'لا يمكنك تسجيل هذه المادة (المتطلبات غير مكتملة أو السعة ممتلئة)',
      });
      return;
    }
    if (selectedCourses.find(c => c.id === course.id)) {
      setSelectedCourses(selectedCourses.filter(c => c.id !== course.id));
      return;
    }
    if (totalHours + course.hours > creditLimit) {
      Toast.show({ type: 'error', text1: `لا يمكن تجاوز ${creditLimit} ساعة لهذا الفصل` });
      return;
    }
    if (hasConflict(course)) {
      Toast.show({ type: 'error', text1: 'يوجد تعارض في المواعيد!' });
      return;
    }
    setSelectedCourses([...selectedCourses, course]);
  }

  async function performRegistration() {
    setLoading(true);
    try {
      const token      = await AsyncStorage.getItem('token');
      const course_ids = selectedCourses.map(c => c.id);
      const response   = await axios.post(
        `${API_BASE_URL}/courses/register-courses`,
        { course_ids },
        { headers: { Authorization: token } },
      );

      if (response.data.success) {
        const registered = response.data.registered || [];
        const errors     = response.data.errors     || [];

        if (registered.length === 0 && errors.length > 0) {
          Toast.show({ type: 'error', text1: 'لم يُسجَّل أي مادة. راجع الأسباب أدناه.' });
          errors.forEach(err =>
            Toast.show({ type: 'error', text1: `فشل ${err.course_id}: ${err.message}` }),
          );
        } else if (registered.length > 0 && errors.length > 0) {
          Toast.show({ type: 'info', text1: `تم تسجيل ${registered.length} مادة؛ فشل ${errors.length}.` });
          errors.forEach(err =>
            Toast.show({ type: 'error', text1: `فشل ${err.course_id}: ${err.message}` }),
          );
        } else if (registered.length > 0) {
          Toast.show({ type: 'success', text1: 'تم تسجيل موادك بنجاح!' });
        }

        setSelectedCourses([]);
        if (registered.length > 0) router.replace('/SchedulePage');
      } else {
        Toast.show({
          type:  'error',
          text1: response.data.message || 'فشل في تسجيل المواد',
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'حدث خطأ في الاتصال بالسيرفر' });
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit() {
    if (!registrationOpen) {
      Toast.show({ type: 'error', text1: 'تسجيل المواد مغلق حالياً' });
      return;
    }
    if (selectedCourses.length === 0) {
      Toast.show({ type: 'error', text1: 'اختر مواد أولاً' });
      return;
    }
    if (totalHours > creditLimit) {
      Toast.show({ type: 'error', text1: `إجمالي الساعات يتجاوز الحد المسموح (${creditLimit})` });
      return;
    }
    Alert.alert(
      'تأكيد التسجيل',
      `سيتم تسجيل ${selectedCourses.length} مادة بإجمالي ${totalHours} ساعة (الحد ${creditLimit}). هل تريد المتابعة؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تأكيد', style: 'default', onPress: performRegistration },
      ],
    );
  }

  // ── Render guards ─────────────────────────────────────────────────────────
  if (checking) {
    return (
      <View style={styles.authBoot}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (!authReady) return null;

  if (pageLoading) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.bgAlt }]}
        contentContainerStyle={{ padding: space.md, gap: space.md, flexGrow: 1 }}>
        <SkeletonBlock /><SkeletonBlock /><SkeletonBlock />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>تسجيل المقررات</Text>
        <View style={styles.hoursCard}>
          <Text style={styles.hoursIcon}>📚</Text>
          <View style={styles.hoursInfo}>
            <Text style={styles.hoursLabel}>إجمالي الساعات</Text>
            <Text style={styles.hoursValue}>{totalHours}</Text>
            <Text style={styles.hoursMax}>الحد الأقصى لهذا الفصل: {creditLimit} ساعة</Text>
          </View>
        </View>
      </View>

      {coursesList.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            icon="📚"
            title="لا توجد مواد متاحة"
            message="سيتم إضافة المواد قريباً. اسحب للتحديث أو راجع لاحقاً."
          />
        </View>
      ) : (
        <>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.coursesGrid}>
            {advisorWarnings.length > 0 && (
              <View style={styles.advisorBox}>
                <Text style={styles.advisorTitle}>تنبيهات أكاديمية</Text>
                {advisorWarnings.map((w, i) => (
                  <Text key={i} style={styles.advisorLine}>• {w}</Text>
                ))}
              </View>
            )}
            {coursesList.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                isSelected={selectedCourses.find(c => c.id === course.id)}
                onSelect={handleSelect}
                totalHours={totalHours}
                maxCredits={creditLimit}
                suggestedIds={suggestedIds}
              />
            ))}
          </ScrollView>

          <RegistrationFooter
            selectedCourses={selectedCourses}
            totalHours={totalHours}
            loading={loading}
            onSubmit={handleSubmit}
            disabled={!registrationOpen}
            maxCredits={creditLimit}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  authBoot: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: colors.bgAlt,
  },
  container:  { flex: 1, backgroundColor: colors.bgAlt },
  emptyWrap:  { flex: 1, justifyContent: 'center', padding: space.md, minHeight: 280 },
  header: {
    backgroundColor:   colors.white,
    paddingHorizontal: space.lg,
    paddingVertical:   space.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...elevationShadow(1),
  },
  headerTitle: { ...type.title, color: colors.dark, textAlign: 'right', marginBottom: space.sm + 4 },
  hoursCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#e0f2fe', padding: space.md,
    borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(14, 165, 233, 0.35)',
  },
  hoursIcon:  { fontSize: 32, marginRight: space.md },
  hoursInfo:  { flex: 1 },
  hoursLabel: { ...type.micro,   color: colors.slateLight, textAlign: 'right' },
  hoursValue: { fontSize: 28, fontWeight: '700', color: colors.primary, textAlign: 'right', lineHeight: 34 },
  hoursMax:   { ...type.micro,   color: colors.muted, textAlign: 'right', marginTop: 2 },
  scrollView: { flex: 1 },
  coursesGrid: { padding: space.md, paddingBottom: 120 },
  advisorBox: {
    backgroundColor: '#fffbeb', borderRadius: radius.md, padding: space.md,
    marginBottom: space.md, borderWidth: 1, borderColor: '#fcd34d',
  },
  advisorTitle: { ...type.headline, color: colors.dark, marginBottom: space.xs, textAlign: 'right' },
  advisorLine:  { ...type.caption,  color: '#92400e', textAlign: 'right', marginTop: 4 },
});

export default RegistrationPage;
