import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useAuthLogout } from "@/hooks/useAuthLogout";

const NAV_ITEMS = [
  { label: "لوحة الطالب", route: "/StudentDashboard" },
  { label: "تسجيل المقررات", route: "/RegistrationPage" },
  { label: "جدولي الدراسي", route: "/SchedulePage" },
  { label: "المساعد الذكي", route: "/ChatScreen" },
];

function Sidebar({ open, setOpen }) {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAuthLogout();

  const handleNavigate = (route) => {
    setOpen(false);
    router.push(route);
  };

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  if (!open) return null;

  return (
    <>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={() => setOpen(false)}
        accessibilityLabel="إغلاق القائمة"
      />

      <View style={styles.sidebar} accessibilityRole="menu">
        <Text style={styles.sidebarTitle}>Student Portal</Text>

        <View style={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.includes(item.route.replace("/", ""));
            return (
              <TouchableOpacity
                key={item.route}
                style={[styles.navLink, isActive && styles.navLinkActive]}
                onPress={() => handleNavigate(item.route)}
                accessibilityRole="menuitem"
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
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
          <TouchableOpacity
            style={styles.logoutLink}
            onPress={handleLogout}
            accessibilityRole="menuitem"
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Text style={styles.logoutText}>تسجيل خروج</Text>
          </TouchableOpacity>
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
    width: 280,
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    paddingVertical: 40,
    zIndex: 2000,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 16,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
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
    gap: 8,
  },
  navLink: {
    minHeight: 48,
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
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
  logoutLink: {
    marginTop: 24,
    minHeight: 48,
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.5)",
  },
  logoutText: {
    color: "#fecaca",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Sidebar;
