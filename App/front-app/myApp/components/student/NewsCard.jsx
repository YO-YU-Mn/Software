import { View, Text, StyleSheet } from "react-native";

function NewsCard({ news }) {
  return (
    <View style={styles.newsCard}>
      <Text style={styles.title}>{news.title}</Text>
      <Text style={styles.date}>{news.date}</Text>
      <Text style={styles.description}>{news.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  newsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderLeftWidth: 8,
    borderLeftColor: "#2563eb",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "right",
  },
  date: {
    backgroundColor: "#e2e8f0",
    alignSelf: "flex-start",
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 30,
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 10,
    overflow: "hidden",
  },
  description: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "right",
  },
});

export default NewsCard;
