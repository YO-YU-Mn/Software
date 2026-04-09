import { View, Text, StyleSheet } from "react-native";

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>Faculty of Science</Text>
      <View style={styles.statusContainer}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>System Online</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a3c6e",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4caf50",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default Header;
