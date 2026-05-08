import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import courses from "../../data/coursesData";

function RegistrationPage() {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const coursesList = Array.isArray(courses) ? courses : [];
  const totalHours = selectedCourses.reduce((sum, c) => sum + (c.hours || 0), 0);

  function hasConflict(course) {
    if (!course.schedule || !Array.isArray(course.schedule)) return false;
    for (let selected of selectedCourses) {
      if (!selected.schedule || !Array.isArray(selected.schedule)) continue;
      for (let s1 of selected.schedule) {
        for (let s2 of course.schedule) {
          if (s1?.day === s2?.day && s1?.time === s2?.time) return true;
        }
      }
    }
    return false;
  }

  function handleSelect(course) {
    if (!course) return;

    if (selectedCourses.find((c) => c?.id === course.id)) {
      setSelectedCourses(selectedCourses.filter((c) => c?.id !== course.id));
      return;
    }

    if (totalHours + (course.hours || 0) > 18) {
      Alert.alert("تنبيه", "لا يمكن اختيار أكثر من 18 ساعة");
      return;
    }

    if (hasConflict(course)) {
      Alert.alert("تنبيه", "يوجد تعارض في المواعيد!");
      return;
    }

    setSelectedCourses([...selectedCourses, course]);
  }

  async function handleSubmit() {
    if (selectedCourses.length === 0) {
      Alert.alert("تنبيه", "اختر مواد أولاً");
      return;
    }

    setLoading(true);
    try {
      await AsyncStorage.setItem(
        "studentSchedule",
        JSON.stringify(selectedCourses)
      );
      navigation.navigate("Schedule");
    } catch (e) {
      Alert.alert("خطأ", "فشل في حفظ البيانات");
    } finally {
      setLoading(false);
    }
  }

  if (coursesList.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>لا توجد مواد متاحة</Text>
        <Text style={styles.emptySubtext}>سيتم إضافة المواد قريباً</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>تسجيل المقررات</Text>
        <View style={styles.hoursCard}>
          <Text style={styles.hoursIcon}>📚</Text>
          <View>
            <Text style={styles.hoursLabel}>إجمالي الساعات</Text>
            <Text style={styles.hoursValue}>{totalHours}</Text>
            <Text style={styles.hoursMax}>الحد الأقصى: 18 ساعة</Text>
          </View>
        </View>
      </View>

      {/* Course List */}
      <ScrollView contentContainerStyle={styles.coursesList}>
        {coursesList.map((course) => {
          const isSelected = !!selectedCourses.find((c) => c?.id === course?.id);
          const wouldExceed = totalHours + (course?.hours || 0) > 18;

          return (
            <View
              key={course?.id || Math.random()}
              style={[styles.courseCard, isSelected && styles.courseCardSelected]}
            >
              <View style={styles.courseCardHeader}>
                <Text style={styles.courseCode}>{course?.code || "CS101"}</Text>
                <Text style={styles.courseHoursBadge}>
                  ⏱️ {course?.hours || 0} ساعات
                </Text>
              </View>

              <Text style={styles.courseTitle}>
                {course?.name || "بدون عنوان"}
              </Text>

              <Text style={styles.courseInstructor}>
                👨‍🏫 {course?.instructor || "د. أحمد محمد"}
              </Text>

              {course?.schedule &&
                Array.isArray(course.schedule) &&
                course.schedule.length > 0 && (
                  <View style={styles.scheduleInfo}>
                    <Text style={styles.scheduleTitle}>📅 المواعيد</Text>
                    {course.schedule.map((s, index) => (
                      <View key={index} style={styles.scheduleItem}>
                        <Text style={styles.scheduleDay}>
                          {s?.day || "غير محدد"}
                        </Text>
                        <Text style={styles.scheduleTime}>
                          {s?.time || "غير محدد"}
                        </Text>
                        <Text style={styles.scheduleLocation}>
                          📍 {s?.location || "قاعة 101"}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

              <Text style={styles.courseDescription}>
                {course?.description || "وصف المادة الدراسية وأهدافها..."}
              </Text>

              <View style={styles.courseActions}>
                {isSelected ? (
                  <TouchableOpacity
                    style={styles.btnRemove}
                    onPress={() => handleSelect(course)}
                  >
                    <Text style={styles.btnRemoveText}>🗑️ إزالة</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.btnSelect, wouldExceed && styles.btnDisabled]}
                    onPress={() => handleSelect(course)}
                    disabled={wouldExceed}
                  >
                    <Text style={styles.btnSelectText}>➕ اختيار المادة</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.registrationFooter}>
        <View style={styles.selectedSummary}>
          <Text style={styles.countNumber}>{selectedCourses.length}</Text>
          <Text style={styles.countLabel}> مواد مختارة</Text>
          <Text style={styles.totalHoursFooter}>
            {"  "}إجمالي الساعات: {totalHours}/18
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.btnSubmit,
            (loading || selectedCourses.length === 0) && styles.btnDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading || selectedCourses.length === 0}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnSubmitText}>✅ تأكيد التسجيل</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#eef2f7" },
  pageHeader: {
    backgroundColor: "#1a3c6e",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  hoursCard: {
    backgroundColor: "#2e5a96",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  hoursIcon: { fontSize: 22 },
  hoursLabel: { color: "#a8c4e0", fontSize: 11 },
  hoursValue: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  hoursMax: { color: "#a8c4e0", fontSize: 10 },
  coursesList: { padding: 16, gap: 14 },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#d0d7e3",
  },
  courseCardSelected: { borderLeftColor: "#1a3c6e", backgroundColor: "#f0f5ff" },
  courseCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  courseCode: {
    backgroundColor: "#eef2f7",
    color: "#1a3c6e",
    fontWeight: "bold",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  courseHoursBadge: { color: "#666", fontSize: 12 },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a3c6e",
    marginBottom: 4,
    textAlign: "right",
  },
  courseInstructor: { color: "#555", fontSize: 13, marginBottom: 8, textAlign: "right" },
  scheduleInfo: {
    backgroundColor: "#f7f9fc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  scheduleTitle: { fontWeight: "bold", color: "#1a3c6e", marginBottom: 6, textAlign: "right" },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginBottom: 4,
  },
  scheduleDay: { color: "#333", fontSize: 13 },
  scheduleTime: { color: "#555", fontSize: 13 },
  scheduleLocation: { color: "#888", fontSize: 13 },
  courseDescription: { color: "#666", fontSize: 13, marginBottom: 12, textAlign: "right" },
  courseActions: { alignItems: "flex-end" },
  btnSelect: {
    backgroundColor: "#1a3c6e",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  btnSelectText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  btnRemove: {
    backgroundColor: "#c0392b",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  btnRemoveText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  btnDisabled: { opacity: 0.4 },
  registrationFooter: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#d0d7e3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedSummary: { flexDirection: "row", alignItems: "center" },
  countNumber: { fontSize: 22, fontWeight: "bold", color: "#1a3c6e" },
  countLabel: { fontSize: 14, color: "#555" },
  totalHoursFooter: { fontSize: 12, color: "#888" },
  btnSubmit: {
    backgroundColor: "#1a3c6e",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  btnSubmitText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: "#1a3c6e", marginBottom: 6 },
  emptySubtext: { fontSize: 14, color: "#888" },
});

export default RegistrationPage;
