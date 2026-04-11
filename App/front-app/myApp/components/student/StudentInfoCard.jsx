import { View, Text, StyleSheet } from "react-native";

const FIELDS = [
  { label: "الاسم",          key: "fullName" },
  { label: "الكود الجامعي",  key: "id" },
  { label: "السنة الدراسية", key: "year" },
  { label: "التخصص",        key: "major" },
  { label: "الفرقة",         key: "level" },
  { label: "سنة التخرج",    key: "graduationYear" },
  { label: "GPA",            key: "gpa" },
  { label: "الكلية",         key: "faculty" },
];

function StudentInfoCard({ student }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>البيانات الأكاديمية</Text>

      <View style={styles.grid}>
        {FIELDS.map((field) => (
          <View key={field.key} style={styles.gridItem}>
            <Text style={styles.gridLabel}>{field.label}</Text>
            <Text style={styles.gridValue}>{student?.[field.key] ?? "—"}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(203,213,225,0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(37,99,235,0.2)",
    textAlign: "right",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "47%",
    backgroundColor: "rgba(241,245,249,0.7)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  gridLabel: {
    color: "#2563eb",
    fontWeight: "600",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: "right",
  },
  gridValue: {
    color: "#1e293b",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
  },
});

export default StudentInfoCard;
