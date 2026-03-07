import { View, Text, StyleSheet } from "react-native";

function TopBanner() {
  return (
    <View style={styles.topBanner}>
      <Text style={styles.title}>Registration web page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topBanner: {
    backgroundColor: "#1a3c6e",
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TopBanner;
