import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_BASE_URL } from '@/config';
import { colors, space, radius, type } from '@/constants/designTokens';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

/**
 * Course reviews checklist — persists via `/reviews`.
 */
export default function CourseReviewsSection({ courseId, authReady }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(null);
  const [ratingInput, setRatingInput] = useState('5');
  const [comment, setComment] = useState('');

  const load = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/reviews/course/${encodeURIComponent(courseId)}`);
      setReviews(res.data?.reviews ?? []);
      setAverage(res.data?.averageRating ?? null);
    } catch {
      Toast.show({ type: 'error', text1: 'تعذّر تحميل التقييمات' });
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  const submitReview = async () => {
    if (!authReady || !courseId) {
      Toast.show({ type: 'error', text1: 'سجّل الدخول لإرسال تقييم' });
      return;
    }
    const rating = Number(ratingInput);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      Toast.show({ type: 'error', text1: 'الدرجة من 1 إلى 5' });
      return;
    }
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Toast.show({ type: 'error', text1: 'انتهت الجلسة' });
      return;
    }

    setSaving(true);
    try {
      await axios.post(
        `${API_BASE_URL}/reviews/course/${encodeURIComponent(courseId)}`,
        { rating, comment: comment.trim() },
        { headers: { Authorization: token } }
      );
      Toast.show({ type: 'success', text1: 'شكراً لتقييمك' });
      setComment('');
      await load();
    } catch {
      Toast.show({ type: 'error', text1: 'فشل حفظ التقييم' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>مراجعات وتقييم</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summary}>المعدّل: {average != null ? String(average) : '—'}</Text>
        <Text style={styles.summary}>{reviews.length} مراجعة</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginVertical: space.md }} />
      ) : (
        <ScrollView nestedScrollEnabled style={styles.scroll} keyboardShouldPersistTaps="handled">
          {reviews.length === 0 ? (
            <Text style={styles.empty}>لا توجد مراجعات بعد — كن الأول.</Text>
          ) : (
            reviews.map((r) => (
              <View key={r._id} style={styles.review}>
                <Text style={styles.revMeta}>
                  ⭐ {r.rating} · {new Date(r.createdAt || Date.now()).toLocaleDateString('ar')}
                </Text>
                <Text style={styles.revTxt}>{r.comment || 'بدون نص.'}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <Text style={styles.formLabel}>درجتك (1–5)</Text>
      <TextInput
        value={ratingInput}
        onChangeText={setRatingInput}
        keyboardType="numeric"
        style={styles.input}
        editable={authReady !== false}
      />
      <Text style={styles.formLabel}>تعليق مختصر</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        multiline
        style={[styles.input, styles.multiline]}
        placeholder="ما رأيك في المحتوى أو المدرِّس؟"
        placeholderTextColor={colors.muted}
        editable={authReady !== false}
      />

      <PrimaryButton
        title={saving ? 'جاري الإرسال…' : 'إرسال التقييم'}
        onPress={submitReview}
        loading={saving}
        disabled={!authReady || saving || !courseId}
      />

      {/* TODO: Insert review moderation / OpenAI toxicity filter here if enterprise policy requires */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: space.md,
    marginTop: space.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    ...type.title,
    color: colors.dark,
    textAlign: 'right',
    marginBottom: space.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: space.sm,
  },
  summary: {
    ...type.callout,
    color: colors.slateLight,
  },
  scroll: { maxHeight: 220, marginBottom: space.sm },
  empty: {
    ...type.body,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: space.md,
  },
  review: {
    paddingVertical: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  revMeta: { ...type.micro, color: colors.primary, textAlign: 'right' },
  revTxt: {
    ...type.callout,
    color: colors.darkMid,
    textAlign: 'right',
    marginTop: 4,
  },
  formLabel: { ...type.caption, color: colors.muted, textAlign: 'right', marginTop: space.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: space.sm,
    marginVertical: space.xs,
    color: colors.dark,
    ...type.body,
    textAlign: 'right',
  },
  multiline: { minHeight: 72, textAlignVertical: 'top' },
});
