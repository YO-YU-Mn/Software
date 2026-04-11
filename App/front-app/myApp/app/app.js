import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Stack } from 'expo-router';
import Login from '../screens/LandingPage';
import  StudentDashboard  from './(tabs)/StudentDashboard';
import  RegistrationPage  from './(tabs)/RegistrationPage';
// import Dashboard from '../screens/StudentDashboard';
// ./src/screens/Dashboard

// const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Dashboard" component={StudentDashboard}/>
        <Stack.Screen name="RegistrationPage" component={RegistrationPage}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}