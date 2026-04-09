import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSidebar } from "./SidebarContext";

function Header() {
  const { toggle } = useSidebar();

  return (
    <View style={styles.header}>
      {/* Menu button — opens/closes the Sidebar */}
      <TouchableOpacity style={styles.menuBtn} onPress={toggle}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      <Text style={styles.greeting}>Welcome Youssef 👋</Text>

      {/* Notification bell with badge */}
      <View style={styles.notificationWrap}>
        <Text style={styles.bell}>🔔</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>2</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuBtn: {
    padding: 4,
  },
  menuIcon: {
    fontSize: 24,
    color: "#2563eb",
  },
  greeting: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "500",
  },
  notificationWrap: {
    position: "relative",
  },
  bell: {
    fontSize: 22,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "#ef4444",
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
});

export default Header;
