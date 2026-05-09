import React, { useLayoutEffect } from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, space, radius, type } from '@/constants/designTokens';

/** Usage patterns — checklist item. */
export default function UsageGuideScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'أنماط الاستخدام' });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.h1}>دليل الطالب السريع</Text>
      <Text style={styles.lead}>تسجيل الدخول → لوحة التحكم → التسجيل في المقررات → الجدول.</Text>

      <Section title="1. تسجيل الدخول">
        ادخل الرقم الكود وكلمة المرور وفق حساب المنصّة؛ يتم حفظ الجلسة على الجهاز.
      </Section>
      <Section title="2. الكتالوج والبحث">
        من تبويب «الكتالوج» تصفّح كل المقررات أو ابحث بأحرف متتالية؛ النتائج من الخادم مباشرة.
      </Section>
      <Section title="3. خطة التسجيل (السلة)">
        افتح أي مقرر، أضفه إلى الخطة؛ من الكتالوج اضغط «تحضير للتسجيل» لمزامنة الخطة مع شاشة
        التسجيل حيث تُطبّق القواعد (الحد الأقصى للساعات، المتطلبات، المواعيد).
      </Section>
      <Section title="4. المساعد الذكي">
        تبويب «المساعد» متصل بالمحادثة الأكاديمية على الخادم؛ اطرح أسئلة حول الجدولة والمتطلبات.
      </Section>
      <Section title="5. المراجعات والتقييمات">
        بعد تصفّح أي مقرر يمكن تقييمه مرة واحدة لكل حساب؛ يعرض المتوسط وسجل مختصر بدون الاسم الشخصي.
      </Section>
      <Section title="6. الشبكة المنزلية / العنوان">
        للاختبار المحلي تأكّد أن متغير `EXPO_PUBLIC_API_BASE_URL` يشير إلى الجهاز الذي يشغّل Express
        (عادة المنفذ 9000).

        {/* TODO: Insert جهاز IP من ipconfig أو ip addr لأن هذا العنوان يتغير حسب شبكة المنزل */}
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.h2}>{title}</Text>
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: space.lg, paddingBottom: space.xxl, backgroundColor: colors.bgAlt },
  h1: { ...type.display, fontSize: 26, color: colors.dark, textAlign: 'right', marginBottom: space.sm },
  lead: {
    ...type.body,
    color: colors.darkMid,
    textAlign: 'right',
    marginBottom: space.lg,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  h2: {
    ...type.headline,
    color: colors.primaryDeep,
    textAlign: 'right',
    marginBottom: space.xs,
  },
  body: { ...type.callout, color: colors.darkMid, textAlign: 'right', lineHeight: 22 },
});
