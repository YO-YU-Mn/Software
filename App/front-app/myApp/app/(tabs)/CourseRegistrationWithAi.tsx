import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import CourseCard from '../../components/student/CourseCard';
import RegistrationFooter from '../../components/student/RegistrationFooter';
import { API_BASE_URL } from '../../config';
import {
  colors,
  space,
  radius,
  type,
  elevationShadow,
} from '@/constants/designTokens';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useProtectedBackToLogin } from '@/hooks/useProtectedBackToLogin';
import { useAuth } from '@/contexts/AuthContext';

const DRAFT_IDS_KEY = '@ai_registration_draft_ids_v1';

type ApiCourse = {
  id: string;
  name: string;
  hours: number;
  instructor?: string;
  schedule?: { day: string; time: string; location?: string }[];
  canRegister: boolean;
  isRegistered: boolean;
  prerequisitesMet?: boolean;
  hasCapacity?: boolean;
  blockReasons?: string[];
};

export default function CourseRegistrationWithAi() {
  const router = useRouter();
  const { refreshKey } = useAuth();
  const { authReady, checking } = useRequireAuth();
  useProtectedBackToLogin();
  const [coursesList, setCoursesList] = useState<ApiCourse[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<ApiCourse[]>([]);
  const [creditLimit, setCreditLimit] = useState(18);
  const [suggestedIds, setSuggestedIds] = useState<string[]>([]);
  const [advisorWarnings, setAdvisorWarnings] = useState<string[]>([]);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const isInitialLoadRef = useRef(true);

  const totalHours = selectedCourses.reduce((s, c) => s + (c.hours || 0), 0);

  const loadData = useCallback(async () => {
    void refreshKey; // bust deps after login; value unused inside fetch
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      setPageLoading(false);
      return;
    }
    if (!isInitialLoadRef.current) {
      setRefreshing(true);
    }
    try {
      const [statusRes, advisorRes, coursesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/settings/status`, {
          headers: { Authorization: token },
        }),
        axios.get(`${API_BASE_URL}/courses/advisor-summary`, {
          headers: { Authorization: token },
        }),
        axios.get(`${API_BASE_URL}/courses/available-courses`, {
          headers: { Authorization: token },
        }),
      ]);

      setRegistrationOpen(!!statusRes.data.registrationOpen);
      if (typeof advisorRes.data.effectiveMaxCredits === 'number') {
        setCreditLimit(advisorRes.data.effectiveMaxCredits);
      }
      setAdvisorWarnings(advisorRes.data.warnings || []);
      setSuggestedIds(advisorRes.data.suggestedCourseIds || []);

      const list: ApiCourse[] = coursesRes.data || [];
      setCoursesList(list);

      const rawDraft = await AsyncStorage.getItem(DRAFT_IDS_KEY);
      if (rawDraft) {
        const ids: string[] = JSON.parse(rawDraft);
        const picked = list.filter((c) => ids.includes(c.id));
        setSelectedCourses(picked);
      }
    } catch (e) {
      console.error(e);
      Toast.show({ type: 'error', text1: 'فشل تحميل بيانات التسجيل' });
    } finally {
      isInitialLoadRef.current = false;
      setPageLoading(false);
      setRefreshing(false);
    }
  }, [refreshKey]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  useEffect(() => {
    if (pageLoading) return;
    const ids = selectedCourses.map((c) => c.id);
    AsyncStorage.setItem(DRAFT_IDS_KEY, JSON.stringify(ids)).catch(() => {});
  }, [selectedCourses, pageLoading]);

  function hasConflict(course: ApiCourse) {
    if (!course.schedule) return false;
    for (const sel of selectedCourses) {
      if (!sel.schedule) continue;
      for (const s1 of sel.schedule) {
        for (const s2 of course.schedule) {
          if (s1.day === s2.day && s1.time === s2.time) return true;
        }
      }
    }
    return false;
  }

  function addOrToggleCourse(course: ApiCourse) {
    if (!registrationOpen) {
      Toast.show({ type: 'error', text1: 'تسجيل المواد مغلق حالياً' });
      return;
    }
    if (course.isRegistered) {
      Toast.show({ type: 'error', text1: 'المادة مسجّلة مسبقاً' });
      return;
    }
    if (!course.canRegister) {
      Toast.show({
        type: 'error',
        text1: 'غير متاحة للتسجيل (متطلبات / سعة / المعدل)',
      });
      return;
    }
    const existing = selectedCourses.find((c) => c.id === course.id);
    if (existing) {
      setSelectedCourses(selectedCourses.filter((c) => c.id !== course.id));
      return;
    }
    if (totalHours + course.hours > creditLimit) {
      Toast.show({
        type: 'error',
        text1: `تجاوز حد الساعات (${creditLimit})`,
      });
      return;
    }
    if (hasConflict(course)) {
      Toast.show({ type: 'error', text1: 'تعارض في المواعيد' });
      return;
    }
    setSelectedCourses([...selectedCourses, course]);
  }

  async function performRegistration() {
    setSubmitLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const course_ids = selectedCourses.map((c) => c.id);
      const response = await axios.post(
        `${API_BASE_URL}/courses/register-courses`,
        { course_ids },
        { headers: { Authorization: token } }
      );

      if (response.data.success) {
        const registered = response.data.registered || [];
        const errors = response.data.errors || [];

        if (registered.length === 0 && errors.length > 0) {
          Toast.show({
            type: 'error',
            text1: 'لم يُسجَّل أي مادة.',
          });
          errors.forEach((err: { course_id: string; message: string }) => {
            Toast.show({
              type: 'error',
              text1: `فشل ${err.course_id}: ${err.message}`,
            });
          });
          return;
        }

        if (registered.length > 0 && errors.length > 0) {
          Toast.show({
            type: 'info',
            text1: `تم تسجيل ${registered.length} مادة؛ فشل ${errors.length}.`,
          });
          errors.forEach((err: { course_id: string; message: string }) => {
            Toast.show({
              type: 'error',
              text1: `فشل ${err.course_id}: ${err.message}`,
            });
          });
        } else if (registered.length > 0) {
          Toast.show({ type: 'success', text1: 'تم تسجيل موادك بنجاح!' });
        }

        await AsyncStorage.removeItem(DRAFT_IDS_KEY);
        setSelectedCourses([]);
        if (registered.length > 0) {
          router.replace('/SchedulePage');
        }
      } else {
        Toast.show({
          type: 'error',
          text1: response.data.message || 'فشل التسجيل',
        });
      }
    } catch (e) {
      console.error(e);
      Toast.show({ type: 'error', text1: 'خطأ في الاتصال' });
    } finally {
      setSubmitLoading(false);
    }
  }

  function onConfirmPress() {
    if (!registrationOpen) {
      Toast.show({ type: 'error', text1: 'التسجيل مغلق' });
      return;
    }
    if (!selectedCourses.length) {
      Toast.show({ type: 'error', text1: 'اختر مواداً' });
      return;
    }
    if (totalHours > creditLimit) {
      Toast.show({ type: 'error', text1: `تجاوز الحد ${creditLimit} ساعة` });
      return;
    }
    Alert.alert(
      'تأكيد التسجيل',
      `تسجيل ${selectedCourses.length} مادة (${totalHours} ساعة / ${creditLimit}). المتابعة؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'تأكيد', onPress: performRegistration },
      ]
    );
  }

  const suggestedCourses = coursesList.filter((c) => suggestedIds.includes(c.id));

  const eligibleList = coursesList.filter((c) => c.canRegister || c.isRegistered);

  if (checking) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (!authReady) return null;

  if (pageLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.muted}>جاري التحميل...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>تسجيل بالمساعد الأكاديمي</Text>
        <Text style={styles.sub}>
          بيانات حقيقية من الخادم (المتطلبات، المعدل، السعة، التعارض). المقترحات من
          واجهة المستشار الأكاديمي فقط دون اختراع مواد.
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>
            الحد: {creditLimit} ساعة · المختار: {totalHours} ساعة
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
            }}
            tintColor={colors.primary}
          />
        }>
        {advisorWarnings.length > 0 ? (
          <View style={styles.warnBox}>
            <Text style={styles.warnTitle}>تنبيهات</Text>
            {advisorWarnings.map((w, i) => (
              <Text key={i} style={styles.warnLine}>
                • {w}
              </Text>
            ))}
          </View>
        ) : null}

        {suggestedCourses.length > 0 ? (
          <View style={styles.suggestSection}>
            <Text style={styles.sectionTitle}>مقترحات النظام (اضغط للإضافة)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipRow}>
                {suggestedCourses.map((c) => {
                  const selected = !!selectedCourses.find((x) => x.id === c.id);
                  return (
                    <TouchableOpacity
                      key={c.id}
                      style={[
                        styles.chip,
                        selected && styles.chipOn,
                        !c.canRegister && styles.chipDisabled,
                      ]}
                      onPress={() => addOrToggleCourse(c)}
                      disabled={!c.canRegister && !selected}>
                      <Text
                        style={[
                          styles.chipText,
                          selected && styles.chipTextOn,
                        ]}>
                        {c.id} · {c.hours}h
                      </Text>
                      <Text style={styles.chipName} numberOfLines={2}>
                        {c.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>
          المواد التي يمكنك التسجيل فيها أو المسجّلة لديك
        </Text>
        {eligibleList.length === 0 ? (
          <Text style={styles.muted}>
            لا توجد مواد مؤهّل لها في خطتك الحالية. راجع المعدل أو المتطلبات.
          </Text>
        ) : null}
        {eligibleList.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isSelected={!!selectedCourses.find((c) => c.id === course.id)}
            onSelect={addOrToggleCourse}
            totalHours={totalHours}
            maxCredits={creditLimit}
            suggestedIds={suggestedIds}
          />
        ))}
      </ScrollView>

      <RegistrationFooter
        selectedCourses={selectedCourses}
        totalHours={totalHours}
        loading={submitLoading}
        onSubmit={onConfirmPress}
        disabled={!registrationOpen}
        maxCredits={creditLimit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgAlt },
  center: { justifyContent: 'center', alignItems: 'center' },
  muted: { color: colors.muted, ...type.callout },
  header: {
    backgroundColor: colors.white,
    padding: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...elevationShadow(1),
  },
  title: { ...type.title, color: colors.dark, textAlign: 'right' },
  sub: {
    ...type.caption,
    color: colors.muted,
    textAlign: 'right',
    marginTop: space.xs,
  },
  metaRow: { marginTop: space.sm },
  meta: { ...type.caption, color: colors.primary, textAlign: 'right' },
  scroll: { flex: 1 },
  scrollContent: { padding: space.md, paddingBottom: 140 },
  warnBox: {
    backgroundColor: '#fffbeb',
    borderRadius: radius.md,
    padding: space.md,
    marginBottom: space.md,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  warnTitle: { ...type.headline, color: colors.dark, textAlign: 'right' },
  warnLine: { ...type.caption, color: '#92400e', textAlign: 'right', marginTop: 4 },
  suggestSection: { marginBottom: space.lg },
  sectionTitle: {
    ...type.headline,
    color: colors.dark,
    textAlign: 'right',
    marginBottom: space.sm,
  },
  chipRow: { flexDirection: 'row', gap: space.sm, paddingVertical: space.xs },
  chip: {
    width: 160,
    padding: space.sm,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipOn: { borderColor: colors.primary, backgroundColor: '#eff6ff' },
  chipDisabled: { opacity: 0.45 },
  chipText: { ...type.micro, fontWeight: '700', color: colors.primary },
  chipTextOn: { color: colors.primaryDeep },
  chipName: { ...type.caption, color: colors.dark, textAlign: 'right', marginTop: 4 },
});
