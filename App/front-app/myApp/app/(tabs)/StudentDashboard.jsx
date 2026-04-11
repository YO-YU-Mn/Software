import { View, ScrollView, StyleSheet } from "react-native";
import StudentInfoCard from "../../components/student/StudentInfoCard";
import RegistrationStatusCard from "../../components/student/RegistrationStatusCard";
import NewsCard from "../../components/student/NewsCard";
import student from "../../data/studentData";
import news from "../../data/newsData";

function StudentDashboard() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StudentInfoCard student={student} />
      <RegistrationStatusCard status="open" />
      <View style={styles.newsSection}>
        {news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2f7",
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  newsSection: {
    gap: 12,
  },
});

export default StudentDashboard;
