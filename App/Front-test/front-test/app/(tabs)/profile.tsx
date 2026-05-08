import { ScrollView, RefreshControl, View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import StudentInfoCard from '../../components/student/StudentInfoCard';
import RegistrationStatusCard from '../../components/student/RegistrationStatusCard';
import NewsCard from '../../components/student/NewsCard';
import { fetchNotifications, fetchRegistrationStatus } from '../../services/student';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SHADOWS } from '../../constants/theme';

export default function ProfileScreen() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [regStatus, setRegStatus] = useState<'open' | 'closed'>('closed');
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    if (!token) return;
    try {
      const notifData = await fetchNotifications();
      const statusData = await fetchRegistrationStatus();
      setNotifications(notifData);
      setRegStatus(statusData.registrationOpen ? 'open' : 'closed');
    } catch (err) { console.log(err); }
  }

  async function onRefresh() { setRefreshing(true); await loadData(); setRefreshing(false); }
  useEffect(() => { loadData(); }, [token]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
    >
      <StudentInfoCard />
      <RegistrationStatusCard status={regStatus} />
      <View style={styles.newsSection}>
        <Text style={styles.sectionTitle}>الإشعارات</Text>
        {notifications.length === 0 && <Text style={styles.emptyText}>لا توجد إشعارات حالياً</Text>}
        {notifications.map((item) => <NewsCard key={item._id} news={item} />)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40, backgroundColor: '#f8fafc' },
  newsSection: { marginTop: 8, gap: 8 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark, marginBottom: 12, textAlign: 'right' },
  emptyText: { textAlign: 'center', color: COLORS.gray, marginVertical: 30 },
});