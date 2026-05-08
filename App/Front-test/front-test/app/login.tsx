import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';

import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { loginStudent } from '../services/auth';

import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {

  const { login } = useAuth();

  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {

    try {

      const data =
        await loginStudent(code, password);

      if (data.success) {

        await login(data.token);

      } else {

        setError(data.message || 'Login Failed');
      }

    } catch (err) {

      setError('Network Error');
    }
  }

  return (

    <LinearGradient
      colors={['#534AB7', '#6D5DFB', '#8B7FFF']}
      style={styles.gradient}
    >

      <StatusBar
        barStyle="light-content"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Header */}

          <View style={styles.header}>

            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>CU</Text>
            </View>

            <View style={styles.welcomeRow}>
  <FontAwesome name="graduation-cap" size={32} color="#fff" />
  <Text style={styles.welcome}>Welcome Back</Text>
</View>

            <Text style={styles.subtitle}>
              Cairo University Student Portal
            </Text>

          </View>

          {/* Login Card */}

          <View style={styles.card}>

            <Text style={styles.cardTitle}>
              Student Login
            </Text>

            <Text style={styles.cardSubtitle}>
              سجل دخولك للوصول للنظام الأكاديمي
            </Text>

            {/* University ID */}

            <View style={styles.inputWrapper}>

              <Text style={styles.label}>
                University ID
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your university ID"
                placeholderTextColor="#9ca3af"
                value={code}
                onChangeText={setCode}
              />

            </View>

            {/* Password */}

            <View style={styles.inputWrapper}>

              <Text style={styles.label}>
                Password
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

            </View>

            {/* Error */}

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.error}>
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Button */}

            <Pressable
              style={styles.button}
              onPress={handleLogin}
            >

              <Text style={styles.buttonText}>
                Login
              </Text>

            </Pressable>

            {/* Footer */}

            <Text style={styles.footerText}>
              Academic Registration System
            </Text>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({

  gradient: {
    flex: 1,
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  header: {
    marginBottom: 28,
  },

  logoCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },

  logoText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },

  welcome: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.18,
    shadowRadius: 20,

    elevation: 12,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 26,
  },

  inputWrapper: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  button: {
    backgroundColor: '#534AB7',
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 10,

    shadowColor: '#534AB7',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,

    elevation: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  errorBox: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },

  error: {
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: '600',
  },

  footerText: {
    textAlign: 'center',
    marginTop: 22,
    color: '#9ca3af',
    fontSize: 13,
  },
  welcomeRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  marginBottom: 6,
},

});