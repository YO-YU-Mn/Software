// Features: Pull-to-refresh + proper back navigation (goes to previous page, not login)
import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import {API_BASE_URL} from '../../config';
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useStudent from "../../hooks/useStudent";
import StudentInfoCard from "../../components/student/StudentInfoCard";
import RegistrationStatusCard from "../../components/student/RegistrationStatusCard";
import NewsCard from "../../components/student/NewsCard";
import { useRouter } from 'expo-router';

function StudentDashboard({ navigation }) {
  // component function
  const router = useRouter();

  const student = useStudent();
  const [notifications, setNotifications]   = useState([]);
  const [regStatus, setRegStatus]           = useState("closed");
  const [loadingStatus, setLoadingStatus]   = useState(true);
  const [refreshing, setRefreshing]         = useState(false);  // ← pull-to-refresh state
  const [checkingAuth, setCheckingAuth]     = useState(true);

  /* ------------------------------------------------------------------
     Fetch functions (reused by both useEffect and the pull-to-refresh handler)
  ------------------------------------------------------------------ */
const fetchNotifications = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    console.log("token of user is:", token); // token may be missing

    const response = await fetch(`${API_BASE_URL}/notifications/get`, {
      method: 'GET',
      headers: { 
        'Authorization': token, // authorization header uses token
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      console.log("Server error:", response.status);
      throw new Error(`Failed to fetch notifications: ${response.status}`);
    }

    const data = await response.json();
    setNotifications(data);
  } catch (err) {
    console.error("Failed to fetch notifications:", err.message);
  }
};

  const fetchRegistrationStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/settings/status`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      setRegStatus(data.registrationOpen ? "open" : "closed");
    } catch (err) {
      console.error("Failed to fetch registration status:", err);
    } finally {
      setLoadingStatus(false);
    }
  };

  /* ------------------------------------------------------------------
     Initial load
  ------------------------------------------------------------------ */
  useEffect(() => {
    fetchNotifications();
    fetchRegistrationStatus();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('token')
      .then((token) => {
        if (!token) {
          router.replace('/login');
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => router.replace('/login'));
  }, [router]);

  /* ------------------------------------------------------------------
     Pull-to-refresh handler
     Called when user pulls down from the top
  ------------------------------------------------------------------ */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);                      // shows the spinner
    await Promise.all([
      fetchNotifications(),
      fetchRegistrationStatus(),
    ]);
    setRefreshing(false);                     // hides the spinner
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'name']);
      router.replace('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  /* ------------------------------------------------------------------
     Hardware back button (Android)
     Override default behavior so it goes to
     the previous screen in the stack,
     NOT to the login screen.
  ------------------------------------------------------------------ */
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (router && router.canGoBack && router.canGoBack()) {
          router.back();   // goes to the previous screen
          return true;           // prevents default behavior from closing the app
        }
return false;            // let default behavior happen if no screen behind
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();    // cleanup when screen loses focus
    }, [navigation])
  );

  /* ------------------------------------------------------------------
     Loading state (first load only)
  ------------------------------------------------------------------ */
  if (checkingAuth || !student) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  /* ------------------------------------------------------------------
     Main render
  ------------------------------------------------------------------ */
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      // This is all you need for pull-to-refresh
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#2563eb"]}           // Android spinner color
          tintColor={"#2563eb"}          // iOS spinner color
          title="جاري التحديث..."        // iOS only — text under spinner
          titleColor={"#64748b"}
        />
      }
    >
      <View style={styles.headerRow}>
        <Text style={styles.welcomeText}>مرحبا بك في الملف الشخصي</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>تسجيل خروج</Text>
        </TouchableOpacity>
      </View>
      <StudentInfoCard student={student} />
      <RegistrationStatusCard status={regStatus} loading={loadingStatus} />

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الإشعارات</Text>
        {notifications.length === 0 ? (
          <Text style={styles.emptyText}>لا توجد إشعارات حالياً</Text>
        ) : (
          notifications.map((item) => (
            <NewsCard key={item._id} news={item} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

export default StudentDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    gap: 12,
  },
  loadingText: {
    color: "#64748b",
    fontSize: 14,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
    textAlign: "right",
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  logoutText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});

