import { View, StyleSheet } from "react-native";
import LeftContent from "./LeftContent";
import LoginCard from "./LoginCard";

function HeroSection() {
  return (
    <View style={styles.hero}>
      <LeftContent />
      <LoginCard />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: "column",
    backgroundColor: "#eef2f7",
    paddingVertical: 20,
  },
});

export default HeroSection;
