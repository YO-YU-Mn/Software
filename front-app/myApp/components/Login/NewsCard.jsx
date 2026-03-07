import { View, Text, StyleSheet } from "react-native";

function NewsCard({ title, date, description }) {
  return (
    <View style={styles.newsCard}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  newsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#1a3c6e",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a3c6e",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});

export default NewsCard;
