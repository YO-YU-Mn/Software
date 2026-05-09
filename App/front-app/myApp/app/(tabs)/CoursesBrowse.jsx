import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppSearchBar } from '@/components/search/AppSearchBar';
import CoursesList from '@/components/courses/CoursesList';
import { SecondaryButton } from '@/components/ui/PrimaryButton';
import { API_BASE_URL } from '@/config';
import { colors, space, radius, type } from '@/constants/designTokens';
import { useCourseCart } from '../../contexts/CourseCartContext';

/** Mongo Course → list row shape */
function mapMongo(c) {
  return {
    id: c.course_id,
    name: c.title,
    hours: c.credits,
    instructor: c.instructor,
    department: c.department,
    level: c.level,
    semester: c.semester,
    schedule: c.schedule ?? [],
    prerequisites: c.prerequisites ?? [],
    enrolledStudents: c.enrolledStudents,
    capacity: c.capacity,
  };
}

export default function CoursesBrowse() {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { items, scheduleApplyCartToRegistration, clearCart } = useCourseCart();

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/courses/allcourses`);
      const data = Array.isArray(res.data) ? res.data : [];
      setRows(data.map(mapMongo));
    } catch {
      Toast.show({
        type: 'error',
        text1: 'تعذّر تحميل الكتالوج',
        text2:
          Platform.OS !== 'web'
            ? `تحقّق أن السيرفر متاح وأن عنوان API صحيح (${API_BASE_URL})`
            : undefined,
      });
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const handleSearchDebounced = useCallback(
    async (q) => {
      if (!q || q.length < 2) {
        await loadAll();
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/courses/catalog-search`, {
          params: { q },
        });
        setRows(Array.isArray(res.data) ? res.data : []);
      } catch {
        Toast.show({ type: 'error', text1: 'فشل البحث الذكي' });
      }
    },
    [loadAll]
  );

  const subtitle = useMemo(() => `${rows.length} مادة في الكتالوج`, [rows.length]);

  const confirmClearCart = () => {
    if (items.length === 0) return;
    Alert.alert('مسح السلة', 'سيتم حذف خطة التسجيل المحفوظة محلياً.', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'مسح',
        style: 'destructive',
        onPress: () => {
          clearCart();
          Toast.show({ type: 'info', text1: 'تم مسح السلة' });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.head}>
        <Text style={styles.title}>كتالوج المقررات</Text>
        <Text style={styles.sub}>{subtitle}</Text>

        <View style={{ marginTop: space.md }}>
          <AppSearchBar
            placeholder="ابحث بالرمز أو الاسم أو المدرِّس…"
            onDebouncedChange={handleSearchDebounced}
            footerLabel="بحث أوّلي على الخادم (بدون embeddings)."
          />
        </View>

        <View style={styles.actions}>
          <SecondaryButton title="المساعد الذكي" onPress={() => router.push('/(tabs)/ChatScreen')} />
          <TouchableOpacity
            style={[styles.pillBtn, items.length === 0 && styles.pillBtnDisabled]}
            disabled={items.length === 0}
            onPress={() => {
              scheduleApplyCartToRegistration();
              router.push('/(tabs)/RegistrationPage');
            }}>
            <Text style={styles.pillBtnText}>تحضير للتسجيل · {items.length}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity hitSlop={10} style={styles.clearLink} onPress={confirmClearCart}>
          <Text style={[styles.clearText, items.length === 0 && styles.clearTextMuted]}>
            مسح السلة المحلية
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listWrap}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : (
          <CoursesList
            data={rows}
            emptyMessage="لا توجد مقررات مطابقة"
            onPressItem={(course) =>
              router.push({
                pathname: '/course/[courseId]',
                params: { courseId: String(course.id) },
              })
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgAlt },
  head: {
    paddingHorizontal: space.md,
    paddingBottom: space.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  title: { ...type.display, fontSize: 24, marginTop: space.xs, textAlign: 'right', color: colors.dark },
  sub: {
    ...type.caption,
    color: colors.muted,
    textAlign: 'right',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: space.sm,
    alignItems: 'center',
    marginTop: space.md,
    justifyContent: 'flex-start',
  },
  pillBtn: {
    flexGrow: 1,
    minHeight: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primaryDeep,
    paddingHorizontal: space.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBtnDisabled: { opacity: 0.42 },
  pillBtnText: { ...type.headline, color: '#fff' },
  clearLink: { alignSelf: 'flex-end', marginTop: space.sm, paddingVertical: space.xxs },
  clearText: { ...type.callout, color: colors.primaryDeep, fontWeight: '700' },
  clearTextMuted: { color: colors.muted, fontWeight: '500' },
  listWrap: { flex: 1, paddingTop: space.sm, paddingHorizontal: space.md },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: space.xl,
  },
});
