import { Tabs } from 'expo-router';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import LogoutButton
from '../../components/LogoutButton';

import useStudent
from '../../hooks/useStudent';

function Header() {

  const { student } =
    useStudent();

  return (

    <View style={styles.header}>

      <Text style={styles.headerText}>
        Welcome {student?.name || 'Student'} 👋
      </Text>

      <LogoutButton />

    </View>
  );
}

export default function TabsLayout() {

  return (

    <Tabs
      screenOptions={{
        header: () => <Header />,
      }}
    >

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />

      <Tabs.Screen
        name="registration"
        options={{
          title: 'Registration',
        }}
      />

      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
        }}
      />

      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'AI',
        }}
      />

    </Tabs>
  );
}

const styles = StyleSheet.create({

  header: {

    height: 100,

    backgroundColor: '#2563eb',

    paddingTop: 50,

    paddingHorizontal: 16,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  headerText: {

    color: 'white',

    fontSize: 18,

    fontWeight: 'bold',
  },
});