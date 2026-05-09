import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';
import API_URL from '../../config/api';

import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

const GROQ_API_KEY = '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';
const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';



export default function ScheduleRegistration() {
  const { token } = useAuth();
  const [student, setStudent] = useState<any>(null);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [currentCourses, setCurrentCourses] = useState<any[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [currentFilter, setCurrentFilter] = useState('all');
  const [chosenPref, setChosenPref] = useState<string | null>(null);
  const [showPrefStep, setShowPrefStep] = useState(false);
  const [scheduleResult, setScheduleResult] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [modalCourse, setModalCourse] = useState<any>(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadAll = async () => {
    if (!token) return;
    try {
      const [profileRes, availRes, currentRes] = await Promise.all([
        fetch(`${API_URL}/students/profile`, { headers: { Authorization: token } }),
        fetch(`${API_URL}/courses/available-courses`, { headers: { Authorization: token } }),
        fetch(`${API_URL}/courses/current`, { headers: { Authorization: token } })
      ]);
      const profile = await profileRes.json();
      const avail = await availRes.json();
      const current = await currentRes.json();
      setStudent(profile);
      setAvailableCourses(Array.isArray(avail) ? avail : []);
      setCurrentCourses(Array.isArray(current) ? current : []);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'فشل تحميل البيانات' });
    } finally {
      setPageLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

 useFocusEffect(
  useCallback(() => {
    loadAll();
  }, [token])
);

  const registeredHours = currentCourses.reduce((sum: number, c: any) => sum + (c.credits || 0), 0);
  const selectedHours = [...selectedCourses].reduce((sum: number, id: string) => {
    const c = availableCourses.find(x => x.id === id);
    return sum + (c?.hours || 0);
  }, 0);

  const getCourseSlots = (course: any) => {
    if (!course.schedule || course.schedule.length === 0) return [];
    const map: Record<string, string[]> = {};
    course.schedule.forEach((s: any) => {
      if (!map[s.day]) map[s.day] = [];
      map[s.day].push(s.time);
    });
    return Object.entries(map).map(([day, times]) => ({ day, times }));
  };

  const getFiltered = () => {
    if (currentFilter === 'all') return availableCourses;
    return availableCourses.filter(c => (c.id || '').startsWith(currentFilter));
  };

 const toggleCourse = (id: string) => {
  const course = availableCourses.find(c => c.id === id);

  if (!course?.canRegister) {
    Toast.show({
      type: 'error',
      text1: 'لا يمكن اختيار هذه المادة',
    });
    return;
  }

  const newSet = new Set(selectedCourses);

  if (newSet.has(id)) {
    newSet.delete(id);
  } else {
    newSet.add(id);
  }

  setSelectedCourses(newSet);
};

 const registerSelected = async () => {
  if (selectedCourses.size === 0) return;
  if (!token) {
    Toast.show({ type: 'error', text1: 'الرجاء تسجيل الدخول أولاً' });
    return;
  }
  setRegisterLoading(true);
  try {
    const res = await fetch(`${API_URL}/courses/register-courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token },
      body: JSON.stringify({ course_ids: [...selectedCourses] })
    });
    const data = await res.json();
    if (data.registered?.length > 0) {
      Toast.show({ type: 'success', text1: `تم تسجيل ${data.registered.length} مادة` });
      setSelectedCourses(new Set());
      await loadAll();
    } else {
      Toast.show({ type: 'error', text1: 'فشل التسجيل' });
    }
  } catch (err) {
    Toast.show({ type: 'error', text1: 'خطأ في الاتصال' });
  } finally {
    setRegisterLoading(false);
  }
};

  const startGenerate = () => {
    if (selectedCourses.size === 0) {
      Toast.show({ type: 'error', text1: 'اختر مواد أولاً' });
      return;
    }
    setShowPrefStep(true);
    setScheduleResult(null);
    setChosenPref(null);
  };

  const generateSchedule = async () => {
    if (!chosenPref) return;
    setLoadingAI(true);
    setShowPrefStep(false);

    const list = [...selectedCourses].map(id => availableCourses.find(c => c.id === id)).filter(Boolean);
    const coursesDescription = list.map(c => {
      const slots = getCourseSlots(c);
      const slotsText = slots.map(s => `${s.day}: ${s.times.join(' أو ')}`).join(' | ');
      return `- ${c.name} (${c.id}) | ${c.hours} ساعات | المواعيد: ${slotsText}`;
    }).join('\n');

    const timeRange = chosenPref === 'صباحي' ? '8 ص — 12 م' : chosenPref === 'متوسط' ? '10 ص — 3 م' : '2 م — 8 م';
    const userPrompt = `الطالب "${student?.name}" يريد جدولاً دراسياً ${chosenPref}ياً (يفضل أوقات ${timeRange}).

المقررات المختارة:
${coursesDescription}

المطلوب: اختر لكل مقرر اليوم والوقت المناسب من المواعيد المتاحة فقط، مع مراعاة التفضيل وعدم التعارض في المواعيد.
أجب فقط بـ JSON بهذا الشكل بدون أي نص خارجه:
{"schedule":[{"code":"...","name":"...","hours":3,"day":"...","time":"..."}],"notes":"ملاحظة مختصرة"}`;

    try {
      const response = await fetch(GROQ_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({
          model: GROQ_MODEL,
          max_tokens: 1000,
          temperature: 0.3,
          messages: [
            { role: 'system', content: 'أنت مساعد جامعي متخصص في تنظيم الجداول الدراسية. أجب دائماً بـ JSON فقط بدون أي نص إضافي أو markdown.' },
            { role: 'user', content: userPrompt }
          ]
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Groq error');
      const text = data.choices?.[0]?.message?.content || '';
      const clean = text.replace(/```json|```/g, '').trim();
      setScheduleResult(JSON.parse(clean));
    } catch (err: any) {
      setScheduleResult({ error: err.message });
    } finally {
      setLoadingAI(false);
    }
  };

  if (pageLoading) {
    return <View style={styles.loader}><ActivityIndicator size="large" /></View>;
  }

  const filteredCourses = getFiltered();

  return (
   <ScrollView
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  }
  contentContainerStyle={styles.container}
>
      <Text style={styles.mainTitle}>تسجيل مقررات الترم الحالي</Text>
      <Text style={styles.subTitle}>اختر المقررات، ثم اضغط Generate لإنشاء جدولك بالذكاء الاصطناعي</Text>

      <View style={styles.infoGrid}>
        <View style={styles.infoCard}><Text style={styles.infoLabel}>اسم الطالب</Text><Text>{student?.name}</Text></View>
        <View style={styles.infoCard}><Text style={styles.infoLabel}>الرقم الجامعي</Text><Text>{student?.code}</Text></View>
        <View style={styles.infoCard}><Text style={styles.infoLabel}>الساعات المسجلة</Text><Text>{registeredHours} / 18</Text></View>
      </View>

      {currentCourses.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>المواد المسجلة حالياً ({currentCourses.length})</Text>
          {currentCourses.map(c => (
            <View key={c.course_id} style={styles.currentCard}>
              <Text>{c.title} ({c.credits} ساعات)</Text>
            </View>
          ))}
        </>
      )}

      <Text style={styles.sectionTitle}>مقررات متاحة للتسجيل</Text>
      <View style={styles.filterRow}>
        {['all', 'CS', 'MATH', 'ENG'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, currentFilter === f && styles.filterActive]}
            onPress={() => setCurrentFilter(f)}
          >
            <Text>{f === 'all' ? 'الكل' : f === 'CS' ? 'علم الحاسب' : f === 'MATH' ? 'رياضيات' : 'هندسة'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredCourses.map(course => {
        const isSelected = selectedCourses.has(course.id);
        const slots = getCourseSlots(course);
        return (
          <View
  key={course.id}
  style={[
    styles.courseCard,
    isSelected && styles.selectedCard,
    !course.canRegister && styles.disabledCourseCard,
  ]}
>
            <View style={styles.cardHeaderRow}>
              <Text
  style={[
    styles.courseCode,
    !course.canRegister && {
      color: '#6b7280',
    },
  ]}
>
  {course.id}
</Text>
             <TouchableOpacity
  disabled={!course.canRegister}
  onPress={() => toggleCourse(course.id)}
  style={[
    styles.checkbox,
    isSelected && styles.checked,
    !course.canRegister && styles.disabledCheckbox,
  ]}
>
                {isSelected && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
            </View>
            {!course.canRegister && (
  <View style={styles.disabledBadge}>
    <Text style={styles.disabledBadgeText}>
      {course.alreadyRegistered
        ? 'مسجلة بالفعل'
        : 'غير متاحة'}
    </Text>
  </View>
)}
            <Text style={styles.hours}>{course.hours} ساعات</Text>
            {slots.length > 0 && (
              <TouchableOpacity style={styles.scheduleBtn} onPress={() => setModalCourse({ ...course, slots })}>
                <Text>🕒 المواعيد</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}

      <View style={styles.summaryBar}>
        <View style={styles.summaryRow}>
          <Text>المادة المختارة: {selectedCourses.size}</Text>
          <Text>الساعات الإضافية: {selectedHours}</Text>
        </View>
        <View style={styles.summaryButtons}>
          <TouchableOpacity
            style={[styles.registerBtn, (selectedCourses.size === 0 || registerLoading) && styles.disabledBtn]}
            onPress={registerSelected}
            disabled={selectedCourses.size === 0 || registerLoading}
          >
            <Text>{registerLoading ? '...' : 'تسجيل المواد'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.generateBtn, selectedCourses.size === 0 && styles.disabledBtn]}
            onPress={startGenerate}
            disabled={selectedCourses.size === 0}
          >
            <Text> Generate جدولك</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showPrefStep && (
        <View style={styles.prefStep}>
          <Text style={styles.prefTitle}>ما هو تفضيلك لمواعيد الجدول؟</Text>
          <View style={styles.prefOptions}>
            {['صباحي', 'متوسط', 'مسائي'].map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.prefCard, chosenPref === p && styles.prefSelected]}
                onPress={() => setChosenPref(p)}
              >
                <Text style={styles.prefIcon}>{p === 'صباحي' ? '🌅' : p === 'متوسط' ? '🌤️' : '🌆'}</Text>
                <Text>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.confirmBtn} onPress={generateSchedule} disabled={!chosenPref}>
            <Text>توليد الجدول </Text>
          </TouchableOpacity>
        </View>
      )}

      {loadingAI && <ActivityIndicator size="large" style={styles.aiLoader} />}

      {scheduleResult && (
        <View style={styles.resultBox}>
          {scheduleResult.error ? (
            <Text style={styles.errorText}>خطأ: {scheduleResult.error}</Text>
          ) : (
            <>
              <Text style={styles.resultTitle}>الجدول الدراسي المقترح</Text>
              {scheduleResult.schedule?.map((item: any, idx: number) => (
                <View key={idx} style={styles.resultRow}>
                  <Text style={styles.resultCode}>{item.code}</Text>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text>{item.hours}</Text>
                  <Text>{item.day}</Text>
                  <Text>{item.time}</Text>
                </View>
              ))}
              {scheduleResult.notes && <Text style={styles.notes}>{scheduleResult.notes}</Text>}
            </>
          )}
        </View>
      )}

      <Modal visible={!!modalCourse} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalCourse?.name}</Text>
            {modalCourse?.slots?.map((slot: any, i: number) => (
              <View key={i} style={styles.slotRow}>
                <Text style={styles.slotDay}>{slot.day}</Text>
                <Text>{slot.times.join('، ')}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalCourse(null)}>
              <Text>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
     backgroundColor: '#f5f4f0',
  padding: 16,
  paddingBottom: 120,
  flexGrow: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f4f0',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: '#5a5a5a',
    marginBottom: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    flex: 1,
    minWidth: '45%',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#9a9a9a',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
    marginTop: 8,
  },
  currentCard: {
    backgroundColor: '#f0eeea',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  filterActive: {
    backgroundColor: '#534AB7',
    borderColor: '#534AB7',
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5a5a5a',
  },
  filterActiveText: {
    color: '#ffffff',
  },
  courseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 1.8,
    borderColor: '#534AB7',
    backgroundColor: '#EEEDFE',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  courseCode: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9a9a9a',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checked: {
    backgroundColor: '#534AB7',
    borderColor: '#534AB7',
  },
  checkMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  courseName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  hours: {
    fontSize: 12,
    color: '#5a5a5a',
    marginBottom: 10,
  },
  scheduleBtn: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#f0eeea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  scheduleBtnText: {
    fontSize: 12,
    color: '#534AB7',
    fontWeight: '500',
  },
  summaryBar: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 20,
    gap: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  registerBtn: {
    backgroundColor: '#27500A',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 40,
    flex: 1,
    alignItems: 'center',
  },
  generateBtn: {
    backgroundColor: '#534AB7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 40,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  disabledBtn: {
    backgroundColor: '#e0e0e0',
  },
  prefStep: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginVertical: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  prefTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1a1a1a',
  },
  prefSub: {
    fontSize: 13,
    color: '#5a5a5a',
    marginBottom: 18,
  },
  prefOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  prefCard: {
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f0eeea',
    borderRadius: 16,
    minWidth: 90,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  prefSelected: {
    backgroundColor: '#EEEDFE',
    borderWidth: 1.5,
    borderColor: '#534AB7',
  },
  prefIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  prefName: {
    fontSize: 14,
    fontWeight: '600',
  },
  prefDesc: {
    fontSize: 11,
    color: '#5a5a5a',
    marginTop: 4,
  },
  confirmBtn: {
    backgroundColor: '#534AB7',
    paddingVertical: 12,
    borderRadius: 40,
    alignItems: 'center',
    marginTop: 8,
  },
  aiLoader: {
    marginVertical: 40,
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginTop: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  resultCode: {
    fontWeight: 'bold',
    width: 70,
    color: '#534AB7',
  },
  resultName: {
    flex: 1,
    marginLeft: 8,
    color: '#1a1a1a',
  },
  notes: {
    marginTop: 12,
    fontStyle: 'italic',
    color: '#5a5a5a',
    fontSize: 13,
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  errorText: {
    color: '#A32D2D',
    textAlign: 'center',
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    width: '85%',
    maxHeight: '80%',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  slotRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  slotDay: {
    fontWeight: 'bold',
    width: 70,
    color: '#534AB7',
  },
  closeModalBtn: {
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: '#f0eeea',
    borderRadius: 30,
    alignItems: 'center',
  },
disabledCourseCard: {
  backgroundColor: '#d1d5db',
  borderColor: '#9ca3af',
  opacity: 0.55,
},

disabledCheckbox: {
  backgroundColor: '#e5e7eb',
  borderColor: '#cbd5e1',
},

disabledBadge: {
  alignSelf: 'flex-start',
  backgroundColor: '#e5e7eb',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 20,
  marginBottom: 8,
},

disabledBadgeText: {
  color: '#475569',
  fontSize: 11,
  fontWeight: '700',
},
});