import { View, Text, StyleSheet } from 'react-native';
import ProfilePicture from './ProfilePicture';
import useStudent from '../../hooks/useStudent';

export default function StudentInfoCard() {
  const { student, refresh } = useStudent();

  if (!student) return <Text>جاري تحميل البيانات...</Text>;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ProfilePicture
          currentImageUrl={student.profilePicture}
          studentCode={student.code}
          onUploadSuccess={refresh}
        />
        <Text style={styles.headerTitle}>البيانات الأكاديمية</Text>
      </View>
      <View style={styles.grid}>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>الاسم</Text>
          <Text style={styles.value}>{student.name}</Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>الرقم الجامعي</Text>
          <Text style={styles.value}>{student.code}</Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>التخصص</Text>
          <Text style={styles.value}>{student.specialization}</Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>السنة الدراسية</Text>
          <Text style={styles.value}>{student.level}</Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>الفصل الدراسي</Text>
          <Text style={styles.value}>{student.semester}</Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.label}>المعدل التراكمي</Text>
          <Text style={styles.value}>{student.GPA}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  infoGroup: { width: '48%', marginBottom: 12 },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '500' },
});