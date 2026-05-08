import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';
import { COLORS, SHADOWS } from '../../constants/theme';
import API_URL from '../../config/api';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import CourseCard from '../../components/student/CourseCard';
import RegistrationFooter from '../../components/student/RegistrationFooter';

import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function RegistrationPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const totalHours = selected.reduce((sum, c) => sum + (c.hours || 0), 0);

  const { data: courses = [], isLoading, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/courses/available-courses`, {
        headers: { Authorization: token as string },
      });
      return res.json();
    },
    enabled: !!token,
  });

  const hasConflict = (course: any) => {
    if (!course.schedule) return false;
    for (let sc of selected) {
      if (!sc.schedule) continue;
      for (let s1 of sc.schedule) {
        for (let s2 of course.schedule) {
          if (s1.day === s2.day && s1.time === s2.time) return true;
        }
      }
    }
    return false;
  };

  const handleSelect = (course: any) => {
    if (course.isRegistered) {
      Toast.show({ type: 'error', text1: 'هذه المادة مسجلة مسبقاً' });
      return;
    }
    if (!course.canRegister) {
      Toast.show({ type: 'error', text1: 'لا يمكنك تسجيل هذه المادة' });
      return;
    }
    const already = selected.find(c => c.id === course.id);
    if (already) {
      setSelected(selected.filter(c => c.id !== course.id));
      return;
    }
    if (totalHours + course.hours > 18) {
      Toast.show({ type: 'error', text1: 'لا يمكن اختيار أكثر من 18 ساعة' });
      return;
    }
    if (hasConflict(course)) {
      Toast.show({ type: 'error', text1: 'يوجد تعارض في المواعيد!' });
      return;
    }
    setSelected([...selected, course]);
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      Toast.show({ type: 'error', text1: 'اختر مواد أولاً' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/courses/register-courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: token as string },
        body: JSON.stringify({ course_ids: selected.map(c => c.id) })
      });
      const data = await res.json();
      if (data.registered?.length > 0) {
        Toast.show({ type: 'success', text1: 'تم التسجيل بنجاح' });
        setSelected([]);
        router.push('/(tabs)/schedule');
      } else {
        Toast.show({ type: 'error', text1: data.message || 'فشل التسجيل' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'خطأ في الاتصال' });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <View style={styles.loader}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <FlatList
      data={courses}
      keyExtractor={(item: any) => item.id.toString()}
      refreshing={isLoading}
      onRefresh={refetch}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>تسجيل المقررات</Text>
          <Text style={styles.hoursInfo}>إجمالي الساعات المختارة: {totalHours} / 18</Text>
        </>
      }
      renderItem={({ item }) => (
        <CourseCard
          course={item}
          isSelected={selected.find(c => c.id === item.id)}
          onSelect={handleSelect}
          totalHours={totalHours}
        />
      )}
      ListFooterComponent={
        <>
          <View style={{ height: 80 }} />
          <RegistrationFooter
            selectedCourses={selected}
            totalHours={totalHours}
            loading={loading}
            onSubmit={handleSubmit}
            disabled={false}
          />
        </>
      }
      ListEmptyComponent={<Text style={styles.emptyText}>لا توجد مواد متاحة</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 120, backgroundColor: '#f8fafc' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.dark, marginBottom: 8, textAlign: 'right' },
  hoursInfo: { fontSize: 16, color: COLORS.gray, marginBottom: 20, textAlign: 'right' },
  emptyText: { textAlign: 'center', marginTop: 40, color: COLORS.gray },
});