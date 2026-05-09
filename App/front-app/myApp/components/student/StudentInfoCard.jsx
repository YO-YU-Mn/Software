// StudentInfoCard.jsx — React Native
import { View, Text, StyleSheet } from "react-native";
import { colors, space, radius, type, elevationShadow } from "@/constants/designTokens";

const FIELDS = [
  { label: "الاسم",           key: "name" },
  { label: "الكود الجامعي",   key: "code" },
  { label: "المستوى",         key: "level" },
  { label: "التخصص",         key: "specialization" },
  { label: "سنة التخرج",     key: "gradute_year" },
  { label: "GPA",             key: "GPA" },
  { label: "الجامعة",         key: "university" },
  { label: "الفصل الدراسي",   key: "semester" },
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
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
    borderColor: "rgba(203,213,225,0.4)",
    ...elevationShadow(2),
  },
  cardTitle: {
    ...type.headline,
    color: colors.dark,
    marginBottom: space.md,
    paddingBottom: space.sm,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(37,99,235,0.2)",
    textAlign: "right",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space.sm,
  },
  gridItem: {
    width: "47%",
    backgroundColor: "rgba(241,245,249,0.7)",
    borderRadius: radius.sm,
    padding: space.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridLabel: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: "right",
  },
  gridValue: {
    ...type.callout,
    color: colors.darkMid,
    fontWeight: "500",
    textAlign: "right",
  },
});

export default StudentInfoCard;