import {
  ScrollView,
  RefreshControl,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {
  useState,
  useEffect,
} from 'react';

import StudentInfoCard
from '../../components/student/StudentInfoCard';

import RegistrationStatusCard
from '../../components/student/RegistrationStatusCard';

import NewsCard
from '../../components/student/NewsCard';

import {
  fetchNotifications,
  fetchRegistrationStatus,
} from '../../services/student';

import { useAuth }
from '../../context/AuthContext';

export default function ProfileScreen() {

  const { token } =
    useAuth();

  const [notifications, setNotifications] =
    useState<any[]>([]);

  const [regStatus, setRegStatus] =
    useState<'open' | 'closed'>('closed');

  const [refreshing, setRefreshing] =
    useState(false);

  async function loadData() {

    if (!token) return;

    try {

      const notifData =
        await fetchNotifications(token);

      const statusData =
        await fetchRegistrationStatus(token);

      setNotifications(notifData);

      setRegStatus(
        statusData.registrationOpen
          ? 'open'
          : 'closed'
      );

    } catch (err) {

      console.log(err);
    }
  }

  async function onRefresh() {

    setRefreshing(true);

    await loadData();

    setRefreshing(false);
  }

  useEffect(() => {

    loadData();

  }, [token]);

  return (

    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >

      <StudentInfoCard />

      <RegistrationStatusCard
        status={regStatus}
      />

      <View style={styles.newsSection}>

        <Text style={styles.newsTitle}>
          Notifications
        </Text>

        {notifications.map((item) => (

          <NewsCard
            key={item._id}
            news={item}
          />

        ))}

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {

    padding: 16,

    backgroundColor: '#f5f5f5',
  },

  newsSection: {

    marginTop: 16,
  },

  newsTitle: {

    fontSize: 20,

    fontWeight: 'bold',

    marginBottom: 12,
  },
});