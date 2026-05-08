import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  I18nManager,
  SafeAreaView,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useStudent from "../../hooks/useStudent";
import { API_BASE_URL } from '../../config';

// ─── Force RTL ───────────────────────────────────────────────────────────────
I18nManager.forceRTL(true);

// ─── Theme ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#f5f4f0",
  surface: "#ffffff",
  surface2: "#f0eeea",
  border: "rgba(0,0,0,0.1)",
  border2: "rgba(0,0,0,0.2)",
  text: "#1a1a1a",
  text2: "#5a5a5a",
  text3: "#9a9a9a",
  accent: "#534AB7",
  accentLight: "#EEEDFE",
  accentDark: "#3C3489",
  green: "#27500A",
  greenBg: "#EAF3DE",
  blue: "#0C447C",
  blueBg: "#E6F1FB",
  amber: "#633806",
  amberBg: "#FAEEDA",
  error: "#A32D2D",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
type Course = {
  id: string;
  code: string;
  name: string;
  hours: number;
  instructor: string;
  department?: string;
  type?: string;
  schedule: Array<{ day: string; time: string; location?: string }>;
  canRegister: boolean;
  isRegistered: boolean;
};

const FILTERS = [
  { key: "all", label: "الكل" },
  { key: "إجباري", label: "إجباري" },
  { key: "اختياري", label: "اختياري" },
  { key: "CS", label: "علم الحاسب" },
  { key: "MATH", label: "رياضيات" },
  { key: "ENG", label: "هندسة" },
];

const PREFS = [
  { key: "صباحي", icon: "🌅", label: "صباحي", desc: "من 8 ص حتى 12 م" },
  { key: "متوسط", icon: "🌤️", label: "متوسط", desc: "من 10 ص حتى 3 م" },
  { key: "مسائي", icon: "🌆", label: "مسائي", desc: "من 2 م حتى 8 م" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type ScheduleItem = {
  code: string;
  name: string;
  hours: number;
  day: string;
  time: string;
};
type ScheduleResult = { schedule: ScheduleItem[]; notes?: string };
type ResultState =
  | { type: "idle" }
  | { type: "pref" }
  | { type: "loading" }
  | { type: "result"; data: ScheduleResult; pref: string }
  | { type: "error"; message: string };

// ─── Main Component ──────────────────────────────────────────────────────────
export default function CourseRegistrationApp() {
  const student = useStudent() as any;
  const [activeFilter, setActiveFilter] = useState("all");
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modalCourse, setModalCourse] = useState<Course | null>(null);
  const [chosenPref, setChosenPref] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState>({ type: "idle" });
  const [pageLoading, setPageLoading] = useState(true);

  const filtered = coursesList.filter((c) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "إجباري" || activeFilter === "اختياري")
      return c.type === activeFilter;
    return c.department === activeFilter;
  });

  const totalHours = [...selected].reduce((sum, id) => {
    const c = coursesList.find((x) => x.id === id);
    return sum + (c ? c.hours : 0);
  }, 0);

  const toggleCourse = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/courses/available-courses`, {
          headers: { Authorization: token },
        });
        const mapped: Course[] = res.data.map((course: any) => ({
          id: course.id,
          code: course.id,
          name: course.name,
          hours: course.hours,
          instructor: course.instructor || "غير محدد",
          department: course.department || "",
          type: course.type || (course.prerequisitesMet ? "إجباري" : "اختياري"),
          schedule: course.schedule || [],
          canRegister: Boolean(course.canRegister),
          isRegistered: Boolean(course.isRegistered),
        }));
        setCoursesList(mapped);
      } catch (err) {
        console.error("Failed to load courses:", err);
        Alert.alert("خطأ","فشل تحميل المواد من السيرفر.");
      } finally {
        setPageLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const generateSchedule = async (pref: string) => {
    setResult({ type: "loading" });
    const selectedCourses = [...selected]
      .map((id) => coursesList.find((c) => c.id === id))
      .filter((course): course is Course => Boolean(course));

    const coursesListText = selectedCourses
      .map((c) => {
        const scheduleText = c.schedule
          .map((s) => `${s.day} ${s.time}${s.location ? ` - ${s.location}` : ""}`)
          .join(" | ");
        return `- ${c.name} (${c.id}) | ${c.hours} ساعات | ${c.type || ""} | مواعيد: ${scheduleText}`;
      })
      .join("\n");

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/advisor/ask`,
        {
          message: `الطالب يريد جدولاً لهذه المقررات مع تفضيل المواعيد: ${pref}.

المقررات المختارة:
${coursesListText}

المطلوب: اقترح جدولاً بدون تعارض، وأجب فقط ب JSON بهذا الشكل:
{"schedule":[{"code":"...","name":"...","hours":0,"day":"...","time":"..."}],"notes":"..."}`,
        },
        {
          headers: { Authorization: token },
        }
      );

      const reply = response.data.reply || "";
      const clean = reply.replace(/```json|```/g, "").trim();
      const parsed: ScheduleResult = JSON.parse(clean);
      setResult({ type: "result", data: parsed, pref });
    } catch (e: any) {
      console.error("Schedule generation failed:", e);
      setResult({ type: "error", message: e?.message || "حصل خطأ" });
    }
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>تسجيل مقررات الترم الحالي</Text>
          <Text style={s.headerSub}>
            اختر المقررات، شوف المواعيد، ثم اضغط Generate لإنشاء جدولك بالذكاء
            الاصطناعي
          </Text>
        </View>

        {/* Student Info */}
        <View style={s.infoRow}>
          <InfoCard
            label="اسم الطالب"
            value={student?.name || "جار التحميل..."}
          />
          <InfoCard
            label="الرقم الجامعي"
            value={student?.code || "—"}
          />
          <InfoCard
            label="الساعات / المسموح"
            value={`${totalHours} / 18`}
          />
        </View>

        {/* Section Title */}
        <Text style={s.sectionTitle}>مقررات الترم الحالي</Text>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.filterScroll}
          contentContainerStyle={s.filterRow}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setActiveFilter(f.key)}
              style={[s.filterBtn, activeFilter === f.key && s.filterBtnActive]}
            >
              <Text
                style={[
                  s.filterBtnText,
                  activeFilter === f.key && s.filterBtnTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Course Cards */}
        <View style={s.coursesGrid}>
          {filtered.map((course) => (
            <CourseCard
              key={course.code}
              course={course}
              isSelected={selected.has(course.code)}
              onToggle={() => toggleCourse(course.code)}
              onSchedule={() => setModalCourse(course)}
            />
          ))}
        </View>

        {/* Summary Bar */}
        <View style={s.summaryBar}>
          <View style={s.summaryStats}>
            <View style={s.stat}>
              <Text style={s.statNum}>{selected.size}</Text>
              <Text style={s.statLabel}>مقرر مختار</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statNum}>{totalHours}</Text>
              <Text style={s.statLabel}>ساعة معتمدة</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[s.generateBtn, selected.size === 0 && s.generateBtnDisabled]}
            onPress={() => {
              if (selected.size === 0) return;
              setChosenPref(null);
              setResult({ type: "pref" });
            }}
            disabled={selected.size === 0}
          >
            <Text style={[s.generateBtnText, selected.size === 0 && s.generateBtnTextDisabled]}>
              ⚡ Generate جدولك
            </Text>
          </TouchableOpacity>
        </View>

        {/* Result Area */}
        <Text style={s.sectionTitle}>الجدول الدراسي المقترح</Text>
        <View style={s.resultArea}>
          <ResultArea
            state={result}
            chosenPref={chosenPref}
            setChosenPref={setChosenPref}
            onConfirm={() => chosenPref && generateSchedule(chosenPref)}
            onRetry={() => {
              setChosenPref(null);
              setResult({ type: "pref" });
            }}
          />
        </View>
      </ScrollView>

      {/* Schedule Modal */}
      <Modal
        visible={modalCourse !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setModalCourse(null)}
      >
        <TouchableOpacity
          style={s.overlay}
          activeOpacity={1}
          onPress={() => setModalCourse(null)}
        >
          <TouchableOpacity activeOpacity={1} style={s.modal}>
            {modalCourse && (
              <>
                <View style={s.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.modalTitle}>{modalCourse.name}</Text>
                    <Text style={s.modalSubtitle}>
                      {modalCourse.code} — {modalCourse.hours} ساعات —{" "}
                      {modalCourse.type}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setModalCourse(null)}>
                    <Text style={s.modalClose}>✕</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView>
                  {modalCourse.schedule.length === 0 ? (
                    <Text style={s.noSlots}>لا توجد مواعيد متاحة حالياً</Text>
                  ) : (
                    modalCourse.schedule.map((slot, i) => (
                      <View key={i} style={s.slotGroup}>
                        <Text style={s.slotDay}>{slot.day}</Text>
                        <View style={s.slotTime}>
                          <Text style={s.slotTimeText}>{slot.time}</Text>
                          {slot.location ? (
                            <Text style={[s.slotTimeText, { marginTop: 4 }]}>المكان: {slot.location}</Text>
                          ) : null}
                        </View>
                      </View>
                    ))
                  )}
                </ScrollView>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Sub-Components ───────────────────────────────────────────────────────────
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.infoCard}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue}>{value}</Text>
    </View>
  );
}

function CourseCard({
  course,
  isSelected,
  onToggle,
  onSchedule,
}: {
  course: Course;
  isSelected: boolean;
  onToggle: () => void;
  onSchedule: () => void;
}) {
  return (
    <View style={[s.courseCard, isSelected && s.courseCardSelected]}>
      <View style={s.cardTop}>
        <Text style={s.courseCode}>{course.code}</Text>
        <TouchableOpacity
          onPress={onToggle}
          style={[s.selectToggle, isSelected && s.selectToggleChecked]}
        >
          {isSelected && <Text style={{ color: "#fff", fontSize: 11 }}>✓</Text>}
        </TouchableOpacity>
      </View>
      <Text style={[s.courseName, isSelected && s.courseNameSelected]}>
        {course.name}
      </Text>
      <View style={s.courseMeta}>
        <View style={[s.badge, s.badgeDept]}>
          <Text style={[s.badgeText, { color: C.blue }]}>{course.department || "—"}</Text>
        </View>
        <View style={[s.badge, s.badgeHours]}>
          <Text style={[s.badgeText, { color: C.green }]}>
            {course.hours} ساعات
          </Text>
        </View>
        <View style={[s.badge, s.badgeType]}>
          <Text style={[s.badgeText, { color: C.amber }]}>{course.type || "—"}</Text>
        </View>
      </View>
      <View style={s.cardActions}>
        <TouchableOpacity
          onPress={onToggle}
          style={[s.btnSelect, isSelected && s.btnSelectActive]}
        >
          <Text
            style={[s.btnSelectText, isSelected && s.btnSelectTextActive]}
          >
            {isSelected ? "✓ تم الاختيار" : "+ اختيار"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSchedule} style={s.btnSchedule}>
          <Text style={s.btnScheduleText}>📅 المواعيد</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ResultArea({
  state,
  chosenPref,
  setChosenPref,
  onConfirm,
  onRetry,
}: {
  state: ResultState;
  chosenPref: string | null;
  setChosenPref: (p: string | null) => void;
  onConfirm: () => void;
  onRetry: () => void;
}) {
  if (state.type === "idle") {
    return (
      <Text style={s.placeholder}>
        اختر المقررات التي تريدها ثم اضغط Generate
      </Text>
    );
  }

  if (state.type === "pref") {
    return (
      <View>
        <Text style={s.prefTitle}>ما هو تفضيلك لمواعيد الجدول؟</Text>
        <Text style={s.prefSub}>
          الذكاء الاصطناعي سيختار أفضل المواعيد المتاحة بناءً على اختيارك
        </Text>
        <View style={s.prefOptions}>
          {PREFS.map((p) => (
            <TouchableOpacity
              key={p.key}
              onPress={() => setChosenPref(p.key)}
              style={[s.prefCard, chosenPref === p.key && s.prefCardSelected]}
            >
              <Text style={s.prefIcon}>{p.icon}</Text>
              <Text style={s.prefName}>{p.label}</Text>
              <Text style={s.prefDesc}>{p.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          onPress={onConfirm}
          disabled={!chosenPref}
          style={[s.prefConfirm, !chosenPref && s.prefConfirmDisabled]}
        >
          <Text
            style={[
              s.prefConfirmText,
              !chosenPref && s.prefConfirmTextDisabled,
            ]}
          >
            توليد الجدول ←
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (state.type === "loading") {
    return (
      <View style={s.loadingWrap}>
        <ActivityIndicator size="large" color={C.accent} />
        <Text style={s.loadingText}>جاري إنشاء الجدول المثالي لك...</Text>
      </View>
    );
  }

  if (state.type === "error") {
    return (
      <View style={s.errorWrap}>
        <Text style={s.errorText}>حصل خطأ: {state.message}</Text>
        <TouchableOpacity onPress={onRetry} style={s.retryBtn}>
          <Text style={s.retryBtnText}>↩ حاول تاني</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (state.type === "result") {
    const totalH = state.data.schedule.reduce((s, c) => s + c.hours, 0);
    const prefEmoji: Record<string, string> = {
      صباحي: "🌅",
      متوسط: "🌤️",
      مسائي: "🌆",
    };
    return (
      <View>
        <View style={s.scheduleHeader}>
          <Text style={s.scheduleHeaderTitle}>
            الجدول الدراسي — إجمالي {totalH} ساعة
          </Text>
          <View style={s.schedulePrefBadge}>
            <Text style={s.schedulePrefBadgeText}>
              {prefEmoji[state.pref] || ""} {state.pref}
            </Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={[s.tableRow, s.tableHead]}>
          {["الكود", "المقرر", "ساعات", "اليوم", "الوقت"].map((h) => (
            <Text key={h} style={[s.tableCell, s.tableHeadCell]}>
              {h}
            </Text>
          ))}
        </View>
        {state.data.schedule.map((item, i) => (
          <View
            key={i}
            style={[s.tableRow, i % 2 === 0 ? s.tableRowEven : s.tableRowOdd]}
          >
            <Text style={[s.tableCell, { fontWeight: "700" }]}>
              {item.code}
            </Text>
            <Text style={[s.tableCell, { flex: 2 }]}>{item.name}</Text>
            <Text style={[s.tableCell, { textAlign: "center" }]}>
              {item.hours}
            </Text>
            <Text style={s.tableCell}>{item.day || "—"}</Text>
            <Text style={s.tableCell}>{item.time || "—"}</Text>
          </View>
        ))}

        {state.data.notes ? (
          <View style={s.resultNotes}>
            <Text style={s.resultNotesText}>
              ملاحظات: {state.data.notes}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity onPress={onRetry} style={s.retryBtn}>
          <Text style={s.retryBtnText}>↩ تغيير التفضيل</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 40 },

  // Header
  header: { marginBottom: 20 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.text,
    textAlign: "right",
    marginBottom: 4,
  },
  headerSub: { fontSize: 13, color: C.text2, textAlign: "right" },

  // Info Row
  infoRow: {
    flexDirection: "row-reverse",
    gap: 8,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  infoLabel: { fontSize: 11, color: C.text3, textAlign: "right", marginBottom: 3 },
  infoValue: {
    fontSize: 13,
    fontWeight: "700",
    color: C.text,
    textAlign: "right",
  },

  // Section Title
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: C.text,
    textAlign: "right",
    marginBottom: 12,
  },

  // Filters
  filterScroll: { marginBottom: 12 },
  filterRow: { flexDirection: "row-reverse", gap: 8, paddingHorizontal: 2 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: C.border2,
    backgroundColor: "transparent",
  },
  filterBtnActive: { backgroundColor: C.accent, borderColor: C.accent },
  filterBtnText: { fontSize: 13, fontWeight: "500", color: C.text2 },
  filterBtnTextActive: { color: "#fff" },

  // Courses Grid
  coursesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },

  // Course Card
  courseCard: {
    width: "47%",
    backgroundColor: C.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  courseCardSelected: {
    borderWidth: 1.5,
    borderColor: C.accent,
    backgroundColor: C.accentLight,
  },
  cardTop: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  courseCode: {
    fontSize: 11,
    color: C.text3,
    fontWeight: "600",
  },
  selectToggle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.border2,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  selectToggleChecked: { backgroundColor: C.accent, borderColor: C.accent },
  courseName: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
    textAlign: "right",
    marginBottom: 10,
    lineHeight: 20,
  },
  courseNameSelected: { color: "#26215C" },
  courseMeta: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 5,
    marginBottom: 10,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeDept: { backgroundColor: C.blueBg },
  badgeHours: { backgroundColor: C.greenBg },
  badgeType: { backgroundColor: C.amberBg },
  badgeText: { fontSize: 11, fontWeight: "500" },
  cardActions: { flexDirection: "row-reverse", gap: 8 },
  btnSelect: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: C.accent,
    alignItems: "center",
  },
  btnSelectActive: { backgroundColor: C.accent },
  btnSelectText: { fontSize: 12, fontWeight: "600", color: C.accent },
  btnSelectTextActive: { color: "#fff" },
  btnSchedule: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: C.border2,
    alignItems: "center",
    justifyContent: "center",
  },
  btnScheduleText: { fontSize: 12, fontWeight: "600", color: C.text2 },

  // Summary Bar
  summaryBar: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: C.border,
    padding: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 10,
  },
  summaryStats: { flexDirection: "row-reverse", gap: 28 },
  stat: { alignItems: "center" },
  statNum: { fontSize: 28, fontWeight: "700", color: C.text },
  statLabel: { fontSize: 12, color: C.text3 },
  generateBtn: {
    backgroundColor: C.accent,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  generateBtnDisabled: {
    backgroundColor: C.surface2,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  generateBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  generateBtnTextDisabled: { color: C.text3 },

  // Result Area
  resultArea: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: C.border,
    padding: 16,
    minHeight: 120,
  },
  placeholder: {
    fontSize: 14,
    color: C.text3,
    textAlign: "center",
    paddingVertical: 30,
  },

  // Pref Step
  prefTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: C.text,
    textAlign: "right",
    marginBottom: 4,
  },
  prefSub: {
    fontSize: 13,
    color: C.text2,
    textAlign: "right",
    marginBottom: 16,
  },
  prefOptions: { flexDirection: "row-reverse", gap: 10, marginBottom: 16 },
  prefCard: {
    flex: 1,
    backgroundColor: C.surface2,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: C.border2,
    padding: 12,
    alignItems: "center",
  },
  prefCardSelected: {
    borderWidth: 1.5,
    borderColor: C.accent,
    backgroundColor: C.accentLight,
  },
  prefIcon: { fontSize: 24, marginBottom: 6 },
  prefName: {
    fontSize: 13,
    fontWeight: "700",
    color: C.text,
    textAlign: "center",
    marginBottom: 3,
  },
  prefDesc: { fontSize: 11, color: C.text2, textAlign: "center" },
  prefConfirm: {
    backgroundColor: C.accent,
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: "center",
  },
  prefConfirmDisabled: { backgroundColor: C.surface2, borderWidth: 0.5, borderColor: C.border },
  prefConfirmText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  prefConfirmTextDisabled: { color: C.text3 },

  // Loading
  loadingWrap: { alignItems: "center", paddingVertical: 30, gap: 12 },
  loadingText: { fontSize: 14, color: C.text2 },

  // Error
  errorWrap: { alignItems: "center", paddingVertical: 20 },
  errorText: {
    color: C.error,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  retryBtn: {
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: C.border2,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 12,
    alignSelf: "flex-end",
  },
  retryBtnText: { fontSize: 13, fontWeight: "600", color: C.text2 },

  // Schedule Result
  scheduleHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  scheduleHeaderTitle: { fontSize: 14, fontWeight: "700", color: C.text },
  schedulePrefBadge: {
    backgroundColor: C.accentLight,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  schedulePrefBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: C.accent,
  },
  tableRow: {
    flexDirection: "row-reverse",
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
    paddingVertical: 8,
  },
  tableHead: { backgroundColor: C.surface2 },
  tableRowEven: { backgroundColor: C.surface },
  tableRowOdd: { backgroundColor: C.bg },
  tableCell: { flex: 1, fontSize: 12, color: C.text, textAlign: "right", paddingHorizontal: 4 },
  tableHeadCell: { fontWeight: "600", color: C.text2 },
  resultNotes: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: C.border,
  },
  resultNotesText: { fontSize: 13, color: C.text2, textAlign: "right", lineHeight: 22 },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: C.surface,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: C.border,
    padding: 20,
    width: "100%",
    maxWidth: 420,
    maxHeight: "75%",
  },
  modalHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 8,
  },
  modalTitle: { fontSize: 15, fontWeight: "700", color: C.text, textAlign: "right" },
  modalSubtitle: { fontSize: 12, color: C.text3, textAlign: "right", marginTop: 3 },
  modalClose: { fontSize: 22, color: C.text3 },
  slotGroup: { marginBottom: 12 },
  slotDay: { fontSize: 13, fontWeight: "700", color: C.text, textAlign: "right", marginBottom: 6 },
  slotTime: {
    backgroundColor: C.surface2,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 4,
  },
  slotTimeText: { fontSize: 13, color: C.text2, textAlign: "right" },
  noSlots: { fontSize: 14, color: C.text3, textAlign: "center", paddingVertical: 20 },
});