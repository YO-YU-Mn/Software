import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

function SchedulePage() {
  const navigation = useNavigation();
  const [coursesList, setCoursesList] = useState([]);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const savedData = await AsyncStorage.getItem("studentSchedule");
        const parsed = savedData ? JSON.parse(savedData) : null;
        if (parsed && Array.isArray(parsed)) setCoursesList(parsed);
      } catch (e) {
        console.error("Failed to load schedule", e);
      }
    }
    loadSchedule();
  }, []);

  async function handleReset() {
    Alert.alert("تأكيد", "هل تريد إعادة التسجيل؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "نعم",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("studentSchedule");
          navigation.navigate("Registration");
        },
      },
    ]);
  }

  if (coursesList.length === 0) {
    return (
      <View style={styles.noData}>
        <Text style={styles.noDataIcon}>📅</Text>
        <Text style={styles.noDataTitle}>لا يوجد جدول مسجل</Text>
        <Text style={styles.noDataSubtext}>لم تقم بتسجيل أي مواد بعد</Text>
        <TouchableOpacity
          style={styles.btnRegister}
          onPress={() => navigation.navigate("Registration")}
        >
          <Text style={styles.btnRegisterText}>➕ تسجيل مواد الآن</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalHours = coursesList.reduce((sum, c) => sum + (c?.hours || 0), 0);
  const studyDays = new Set(
    coursesList
      .flatMap((c) => c?.schedule?.map((s) => s?.day) || [])
      .filter(Boolean)
  ).size;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>الجدول الدراسي</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.btnReset} onPress={handleReset}>
            <Text style={styles.btnResetText}>🔄 إعادة تسجيل</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryIcon}>📚</Text>
          <Text style={styles.summaryLabel}>إجمالي المواد</Text>
          <Text style={styles.summaryValue}>{coursesList.length}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryIcon}>⏱️</Text>
          <Text style={styles.summaryLabel}>إجمالي الساعات</Text>
          <Text style={styles.summaryValue}>{totalHours}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryIcon}>📅</Text>
          <Text style={styles.summaryLabel}>أيام الدراسة</Text>
          <Text style={styles.summaryValue}>{studyDays}</Text>
        </View>
      </View>

      {/* Course Cards */}
      {coursesList.map((course) => (
        <View key={course?.id || Math.random()} style={styles.scheduleCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.courseName}>{course?.name || "بدون عنوان"}</Text>
            <Text style={styles.courseBadge}>⏱️ {course?.hours || 0} ساعات</Text>
          </View>

          <View style={styles.courseDetails}>
            <Text style={styles.detailItem}>
              👨‍🏫 {course?.instructor || "د. أحمد محمد"}
            </Text>
            <Text style={styles.detailItem}>
              🏛️ {course?.department || "علوم حاسب"}
            </Text>
          </View>

          {course?.schedule &&
            Array.isArray(course.schedule) &&
            course.schedule.length > 0 && (
              <View style={styles.timetable}>
                <Text style={styles.timetableTitle}>📅 مواعيد المحاضرات</Text>
                {course.schedule.map((s, index) => (
                  <View key={index} style={styles.timetableRow}>
                    <Text style={styles.timetableDay}>{s?.day || "غير محدد"}</Text>
                    <Text style={styles.timetableTime}>{s?.time || "غير محدد"}</Text>
                    <Text style={styles.timetableLocation}>
                      📍 {s?.location || "قاعة 101"}
                    </Text>
                  </View>
                ))}
              </View>
            )}

          <View style={styles.courseInfo}>
            <Text style={styles.infoItem}>📝 رمز المادة: {course?.code || "CS101"}</Text>
            <Text style={styles.infoItem}>⭐ {course?.hours || 0} ساعات معتمدة</Text>
          </View>
        </View>
      ))}

      {/* Weekly View */}
      <Text style={styles.weeklyTitle}>📊 عرض أسبوعي</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.weeklyGrid}>
          {DAYS.map((day) => {
            const dayCourses = coursesList.filter((course) =>
              course?.schedule?.some((s) => s?.day === day)
            );
            return (
              <View key={day} style={styles.weekDay}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayName}>{day}</Text>
                </View>
                {dayCourses.length === 0 ? (
                  <Text style={styles.noCourse}>—</Text>
                ) : (
                  dayCourses.map((course) => {
                    const slot = course?.schedule?.find((s) => s?.day === day);
                    return (
                      <View key={course?.id} style={styles.weekCourse}>
                        <Text style={styles.weekCourseName}>{course?.name}</Text>
                        <Text style={styles.weekCourseTime}>{slot?.time}</Text>
                        <Text style={styles.weekCourseLocation}>
                          {slot?.location || "قاعة 101"}
                        </Text>
                      </View>
                    );
                  })
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#eef2f7" },
  pageContent: { padding: 16, gap: 16, paddingBottom: 40 },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a3c6e",
    borderRadius: 12,
    padding: 16,
  },
  pageTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  headerActions: { flexDirection: "row", gap: 8 },
  btnReset: {
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  btnResetText: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryIcon: { fontSize: 22, marginBottom: 4 },
  summaryLabel: { fontSize: 11, color: "#888", textAlign: "center" },
  summaryValue: { fontSize: 20, fontWeight: "bold", color: "#1a3c6e" },
  scheduleCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#1a3c6e",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  courseName: { fontSize: 16, fontWeight: "bold", color: "#1a3c6e", flex: 1, textAlign: "right" },
  courseBadge: { color: "#666", fontSize: 12 },
  courseDetails: { flexDirection: "row", justifyContent: "flex-end", gap: 16, marginBottom: 10 },
  detailItem: { color: "#555", fontSize: 13 },
  timetable: { backgroundColor: "#f7f9fc", borderRadius: 8, padding: 10, marginBottom: 10 },
  timetableTitle: { fontWeight: "bold", color: "#1a3c6e", marginBottom: 6, textAlign: "right" },
  timetableRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginBottom: 4,
  },
  timetableDay: { color: "#333", fontSize: 13 },
  timetableTime: { color: "#555", fontSize: 13 },
  timetableLocation: { color: "#888", fontSize: 13 },
  courseInfo: { flexDirection: "row", justifyContent: "flex-end", gap: 16 },
  infoItem: { color: "#666", fontSize: 12 },
  weeklyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a3c6e",
    textAlign: "right",
    marginTop: 8,
  },
  weeklyGrid: { flexDirection: "row", gap: 10, paddingVertical: 8 },
  weekDay: {
    width: 130,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  dayHeader: {
    backgroundColor: "#1a3c6e",
    padding: 8,
    alignItems: "center",
  },
  dayName: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  noCourse: { textAlign: "center", color: "#bbb", padding: 12 },
  weekCourse: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7",
  },
  weekCourseName: { color: "#1a3c6e", fontWeight: "bold", fontSize: 12, textAlign: "right" },
  weekCourseTime: { color: "#555", fontSize: 11, textAlign: "right" },
  weekCourseLocation: { color: "#888", fontSize: 11, textAlign: "right" },
  noData: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  noDataIcon: { fontSize: 56, marginBottom: 12 },
  noDataTitle: { fontSize: 20, fontWeight: "bold", color: "#1a3c6e", marginBottom: 6 },
  noDataSubtext: { fontSize: 14, color: "#888", marginBottom: 20 },
  btnRegister: {
    backgroundColor: "#1a3c6e",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  btnRegisterText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});

export default SchedulePage;
