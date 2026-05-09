// Features: Pull-to-refresh + auth guard + logout + Android back → login (replace)
import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { API_BASE_URL } from '../../config';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useStudent from "../../hooks/useStudent";
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuthLogout } from '@/hooks/useAuthLogout';
import { useProtectedBackToLogin } from '@/hooks/useProtectedBackToLogin';
import StudentInfoCard from "../../components/student/StudentInfoCard";
import RegistrationStatusCard from "../../components/student/RegistrationStatusCard";
import NewsCard from "../../components/student/NewsCard";
import { SkeletonBlock } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors, space, type } from '@/constants/designTokens';
import { useAuth } from '@/contexts/AuthContext';
import ProfilePhotoUploader from '@/components/profile/ProfilePhotoUploader';

function StudentDashboard() {
  const router = useRouter();
  const { authReady, checking } = useRequireAuth();
  const { refreshKey } = useAuth();
  const logout = useAuthLogout();
  useProtectedBackToLogin();
  const { student, loading: studentLoading, error: studentError, refetch: refetchStudent } = useStudent();

  const [notifications, setNotifications] = useState([]);
  const [regStatus, setRegStatus] = useState("closed");
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/notifications/get`, {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`خطأ من السيرفر برقم: ${response.status}`);
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

  useEffect(() => {
    if (!authReady) return;
    fetchNotifications();
    fetchRegistrationStatus();
  }, [authReady, refreshKey]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchNotifications(),
      fetchRegistrationStatus(),
      refetchStudent(),
    ]);
    setRefreshing(false);
  }, [refetchStudent]);

  if (checking) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!authReady) {
    return null;
  }

  if (studentLoading) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>لوحة الطالب</Text>
          <TouchableOpacity
            onPress={() => void logout()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="تسجيل الخروج">
            <Text style={styles.logoutLabel}>تسجيل الخروج</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <SkeletonBlock />
          <SkeletonBlock style={{ marginTop: space.md }} />
          <View style={{ marginTop: space.md, gap: space.sm }}>
            <SkeletonBlock />
          </View>
        </ScrollView>
      </View>
    );
  }

  if (studentError || !student) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>لوحة الطالب</Text>
          <TouchableOpacity
            onPress={() => void logout()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="تسجيل الخروج">
            <Text style={styles.logoutLabel}>تسجيل الخروج</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centered}>
          <EmptyState
            icon="⚠️"
            title="تعذر تحميل بيانات الطالب"
            message="تحقق من الاتصال ثم أعد المحاولة."
            actionLabel="إعادة المحاولة"
            onAction={refetchStudent}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>لوحة الطالب</Text>
        <TouchableOpacity
          onPress={() => void logout()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="تسجيل الخروج">
          <Text style={styles.logoutLabel}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
          title="جاري التحديث..."
          titleColor={colors.muted}
        />
      }
    >
      <View style={styles.quickLinks}>
        <TouchableOpacity
          style={styles.linkChip}
          onPress={() => router.push('/usage-guide')}
          accessibilityRole="button"
          accessibilityLabel="دليل الاستخدام">
          <Text style={styles.linkChipText}>دليل الاستخدام</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkChipSecondary}
          onPress={() => router.push('/(tabs)/CoursesBrowse')}
          accessibilityRole="button"
          accessibilityLabel="كتالوج المقررات">
          <Text style={styles.linkChipTextSecondary}>كتالوج المقررات</Text>
        </TouchableOpacity>
      </View>

      <ProfilePhotoUploader
        avatarDataUrl={student?.avatarDataUrl}
        onUploaded={() => void refetchStudent()}
      />
      <StudentInfoCard student={student} />
      <RegistrationStatusCard status={regStatus} loading={loadingStatus} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الإشعارات</Text>
        {notifications.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="لا توجد إشعارات"
            message="ستظهر التنبيهات والأخبار هنا عند توفرها."
          />
        ) : (
          notifications.map((item) => (
            <NewsCard key={item._id} news={item} />
          ))
        )}
      </View>
    </ScrollView>
    </View>
  );
}

export default StudentDashboard;

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.bg },
  boot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topBarTitle: { ...type.headline, color: colors.dark },
  logoutLabel: { ...type.callout, color: colors.primary, fontWeight: '700' },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: space.md,
    gap: space.md,
    paddingBottom: space.xl,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: "center",
    padding: space.md,
  },
  section: {
    gap: space.sm,
  },
  sectionTitle: {
    ...type.title,
    color: colors.dark,
    marginBottom: space.xxs,
    textAlign: "right",
  },
  quickLinks: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: space.sm,
  },
  linkChip: {
    backgroundColor: colors.primary,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: 12,
  },
  linkChipText: {
    ...type.callout,
    color: colors.white,
    fontWeight: "700",
  },
  linkChipSecondary: {
    backgroundColor: colors.white,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  linkChipTextSecondary: {
    ...type.callout,
    color: colors.primary,
    fontWeight: "700",
  },
});
