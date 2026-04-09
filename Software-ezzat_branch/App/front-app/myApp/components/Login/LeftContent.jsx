import { View, Text, StyleSheet } from "react-native";

function LeftContent() {
  return (
    <View style={styles.heroLeft}>
      <Text style={styles.heading}>Welcome to the Academic Portal</Text>
      <Text style={styles.subtext}>
        Manage your courses, view your academic records, and register easily.
      </Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>✔ Course Registration</Text>
        <Text style={styles.listItem}>✔ Academic Transcript</Text>
        <Text style={styles.listItem}>✔ Smart Schedule Generator</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroLeft: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a3c6e",
    marginBottom: 12,
  },
  subtext: {
    fontSize: 15,
    color: "#444",
    marginBottom: 16,
    lineHeight: 22,
  },
  list: {
    gap: 8,
  },
  listItem: {
    fontSize: 15,
    color: "#2e7d32",
    fontWeight: "600",
  },
});

export default LeftContent;
