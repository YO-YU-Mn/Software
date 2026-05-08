import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import LogoutButton from '../../components/LogoutButton';
import useStudent from '../../hooks/useStudent';
import { FontAwesome } from '@expo/vector-icons'; // تأكد من تثبيت الحزمة: npx expo install @expo/vector-icons

function Header() {
  const { student } = useStudent();
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Welcome {student?.name || 'Student'} 👋</Text>
      <LogoutButton />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
  backgroundColor: '#ffffff',
  height: 65,
  paddingBottom: 8,
  borderTopWidth: 0,
  elevation: 8,
  shadowOpacity: 0.05,
},
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="registration"
        options={{
          title: 'Registration',
          tabBarIcon: ({ color }) => <FontAwesome name="book" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <FontAwesome name="calendar" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="schedule-registration"
        options={{
          title: 'AI Schedule',
          tabBarIcon: ({ color }) => <FontAwesome name="magic" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ color }) => <FontAwesome name="comments" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
 header: {
  height: 110,
  backgroundColor: '#2563eb',
  paddingTop: 55,
  paddingHorizontal: 20,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
},
  headerText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});