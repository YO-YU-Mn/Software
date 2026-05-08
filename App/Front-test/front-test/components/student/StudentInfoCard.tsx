import { View, Text, StyleSheet } from 'react-native';
import ProfilePicture from './ProfilePicture';
import useStudent from '../../hooks/useStudent';
import { COLORS, SHADOWS } from '../../constants/theme'; // تأكد من وجود المسار


const FIELDS = [
  { label: "الاسم", key: "name" },
  { label: "الكود الجامعي", key: "code" },
  { label: "المستوى", key: "level" },
  { label: "التخصص", key: "specialization" }, 
  { label: "GPA", key: "GPA" },
  { label: "الفصل الدراسي", key: "semester" },
];





export default function StudentInfoCard() {
  const { student, refresh } = useStudent();
  if (!student) return <Text>جاري تحميل البيانات...</Text>;
   return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <ProfilePicture
          currentImageUrl={student.profilePicture}
          studentCode={student.code}
          onUploadSuccess={refresh}
        />
        <Text style={styles.cardTitle}>البيانات الأكاديمية</Text>
      </View>

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
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(203,213,225,0.4)",
    ...SHADOWS.medium,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(37,99,235,0.2)",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.dark,
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
    borderColor: COLORS.lightGray,
  },
  gridLabel: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    textAlign: "right",
  },
  gridValue: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
  },
  loadingText: { textAlign: 'center', marginTop: 20, color: COLORS.gray },
});