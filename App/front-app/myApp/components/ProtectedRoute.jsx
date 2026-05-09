import { useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * ProtectedRoute for React Native
 * 
 * Note: React Native doesn't use route-based navigation like React Router.
 * Instead, use this component to check authentication and redirect accordingly.
 * 
 * Usage Example:
 * 
 * import { NavigationContainer } from '@react-navigation/native';
 * import { createStackNavigator } from '@react-navigation/stack';
 * 
 * const Stack = createStackNavigator();
 * 
 * function App() {
 *   const [isAuthenticated, setIsAuthenticated] = useState(false);
 *   const [loading, setLoading] = useState(true);
 * 
 *   useEffect(() => {
 *     checkAuth();
 *   }, []);
 * 
 *   async function checkAuth() {
 *     const token = await AsyncStorage.getItem('token');
 *     setIsAuthenticated(!!token);
 *     setLoading(false);
 *   }
 * 
 *   if (loading) return <LoadingScreen />;
 * 
 *   return (
 *     <NavigationContainer>
 *       <Stack.Navigator>
 *         {isAuthenticated ? (
 *           <>
 *             <Stack.Screen name="Home" component={HomePage} />
 *             <Stack.Screen name="Registration" component={RegistrationPage} />
 *             <Stack.Screen name="Schedule" component={SchedulePage} />
 *           </>
 *         ) : (
 *           <>
 *             <Stack.Screen name="Login" component={LoginPage} />
 *             <Stack.Screen name="Register" component={RegisterPage} />
 *           </>
 *         )}
 *       </Stack.Navigator>
 *     </NavigationContainer>
 *   );
 * }
 */

// Alternative approach: Higher-order component
function withProtectedRoute(Component) {
  return function ProtectedComponent(props) {
    const { navigation } = props;

    const checkAuth = useCallback(async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        if (!token) {
          // Redirect to Login screen
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigation.replace('Login');
      }
    }, [navigation]);

    useEffect(() => {
      checkAuth();
    }, [checkAuth]);

    return <Component {...props} />;
  };
}

// Alternative approach: Hook-based protection
export function useProtectedRoute(navigation) {
  const checkAuth = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      navigation.replace('Login');
    }
  }, [navigation]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
}

export default withProtectedRoute;
