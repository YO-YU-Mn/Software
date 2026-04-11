import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const NAV_ITEMS = [
  { label: "Dashboard",           route: "StudentHome" },
  { label: "تسجيل المقررات",      route: "Registration" },
  { label: "جدولي الدراسي",       route: "Schedule" },
  { label: "النتائج",             route: "Results" },
  { label: "الرسوم الدراسية",     route: "Fees" },
  { label: "الملف الشخصي",        route: "Profile" },
  { label: "تسجيل خروج",         route: "Landing" },
];

function Sidebar({ open, setOpen }) {
  const navigation = useNavigation();
  const route = useRoute();

  const handleNavigate = (targetRoute) => {
    setOpen(false);
    navigation.navigate(targetRoute);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop — tap outside to close */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={() => setOpen(false)}
      />

      {/* Drawer panel */}
      <View style={styles.sidebar}>
        <Text style={styles.sidebarTitle}>Student Portal</Text>

        <View style={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = route.name === item.route;
            return (
              <TouchableOpacity
                key={item.route}
                style={[styles.navLink, isActive && styles.navLinkActive]}
                onPress={() => handleNavigate(item.route)}
              >
                <Text
                  style={[
                    styles.navLinkText,
                    isActive && styles.navLinkTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1999,
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 260,
    backgroundColor: "#0f172a",
    paddingHorizontal: 14,
    paddingVertical: 40,
    zIndex: 2000,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 16,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(56,189,248,0.3)",
    marginBottom: 24,
    letterSpacing: 1,
  },
  nav: {
    gap: 6,
  },
  navLink: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  navLinkActive: {
    backgroundColor: "#2563eb",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  navLinkText: {
    color: "#cbd5e1",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "right",
  },
  navLinkTextActive: {
    color: "#ffffff",
  },
});

export default Sidebar;
