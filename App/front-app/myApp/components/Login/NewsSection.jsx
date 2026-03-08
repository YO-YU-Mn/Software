import { View, Text, ScrollView, StyleSheet } from "react-native";
import NewsCard from "./NewsCard";

function NewsSection() {
  return (
    <View style={styles.newsSection}>
      <Text style={styles.heading}>Latest Announcements</Text>
      <ScrollView contentContainerStyle={styles.newsList}>
        <NewsCard
          title="Midterm Exams Schedule Released"
          date="March 22, 2026"
          description="Students can now view the midterm schedule from their dashboard."
        />
        <NewsCard
          title="Registration Deadline Reminder"
          date="March 20, 2026"
          description="Course registration closes at 11:59 PM."
        />
        <NewsCard
          title="Final Exams Schedule Released"
          date="May 26, 2026"
          description="Best of luck to all students."
        />
        <NewsCard
          title="Homework 3 Deadline Extended"
          date="May 26, 2026"
          description="The deadline for homework 3 has been extended to June 5, 2026."
        />
        <NewsCard
          title="Upcoming Maintenance"
          date="May 26, 2026"
          description="The system will be down for maintenance on June 1, 2026."
        />
        <NewsCard
          title="Keep Up the Good Work"
          date="May 26, 2026"
          description="Keep up the good work, students!"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  newsSection: {
    backgroundColor: "#eef2f7",
    paddingHorizontal: 16,
    paddingTop: 24,
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a3c6e",
    marginBottom: 16,
  },
  newsList: {
    paddingBottom: 24,
  },
});

export default NewsSection;
