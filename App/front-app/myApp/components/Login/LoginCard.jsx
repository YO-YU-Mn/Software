/**
 * components/Login/LoginCard.jsx
 *
 * What changed vs original:
 *  - Calls useAuth().login(payload) instead of writing to AsyncStorage
 *    directly. This updates the central auth state, bumps refreshKey,
 *    and triggers the root layout's redirect — single source of truth.
 *  - After login, router.replace('/(tabs)/StudentDashboard') (no tab bar on auth screens).
 *  - Removed the admin Linking.openURL() side-effect (unrelated to auth).
 *    Add it back if needed after the redirect.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatingLabelInput } from '@/components/ui/FloatingLabelInput';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { API_BASE_URL } from '../../config';
import { colors, space, radius, type, elevationShadow } from '@/constants/designTokens';
import { useAuth } from '@/contexts/AuthContext';

function LoginCard() {
 
  const [code,       setCode]       = useState('');
  const [password,   setPassword]   = useState('');
  const [fieldError, setFieldError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  async function handleLogin() {
    setFieldError('');
    if (!code?.trim() || !password?.trim()) {
      const msg = 'يرجى إدخال الكود وكلمة المرور';
      setFieldError(msg);
      Alert.alert('تنبيه', msg);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code: code.trim(), password }),
      });
      const data = await response.json();

      if (data.success) {
        // Persist + update context + bump refreshKey in ONE atomic call.
        // The root _layout's useEffect reacts to isAuthenticated changing
        // and calls router.replace() to the correct dashboard.
        await login({
          token: data.token ?? '',
          name:  data.name  ?? '',
          role:  data.role  ?? 'student',
        });

        router.replace('/(tabs)/StudentDashboard');
      } else {
        const msg = data.message || 'فشل تسجيل الدخول';
        setFieldError(msg);
        Alert.alert('خطأ في تسجيل الدخول', msg);
      }
    } catch (err) {
      console.error(err);
      const msg = 'تعذر الاتصال بالخادم. تأكد من تشغيل الـ Backend.';
      setFieldError(msg);
      Alert.alert('خطأ', msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <LinearGradient
      colors={['#f0f9ff', colors.bgAlt, colors.white]}
      style={styles.gradientBg}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.hero}>
              <Text style={styles.brand}>Student Portal</Text>
              <Text style={styles.heroTitle}>System Login</Text>
              <Text style={styles.heroSubtitle}>
                Sign in with your university credentials
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Welcome back</Text>
              <Text style={styles.cardSubtitle}>
                Enter your details to continue
              </Text>

              <FloatingLabelInput
                label="University ID"
                value={code}
                onChangeText={(t) => {
                  setCode(t);
                  if (fieldError) setFieldError('');
                }}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
                error={
                  fieldError && !code?.trim() ? fieldError : undefined
                }
              />

              <FloatingLabelInput
                label="Password"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (fieldError) setFieldError('');
                }}
                secureTextEntry
                textContentType="password"
                error={
                  fieldError && !password?.trim() ? fieldError : undefined
                }
              />

              {fieldError && code?.trim() && password?.trim() ? (
                <Text
                  style={styles.formError}
                  accessibilityLiveRegion="polite">
                  {fieldError}
                </Text>
              ) : null}

              <PrimaryButton
                title="Login"
                onPress={handleLogin}
                loading={submitting}
                disabled={submitting}
                accessibilityHint="Submits your credentials to sign in"
              />

              <Text style={styles.supportText}>
                For account issues, contact IT Support
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBg:    { flex: 1 },
  safe:          { flex: 1 },
  flex:          { flex: 1 },
  scrollContent: {
    flexGrow:         1,
    paddingHorizontal: space.md,
    paddingBottom:    space.xl,
    paddingTop:       space.lg,
  },
  hero: {
    marginBottom: space.lg,
    alignItems:   'center',
  },
  brand: {
    ...type.micro,
    color:         colors.primary,
    fontWeight:    '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom:  space.sm,
  },
  heroTitle:    { ...type.display, color: colors.dark, textAlign: 'center' },
  heroSubtitle: {
    ...type.callout,
    color:      colors.muted,
    textAlign:  'center',
    marginTop:  space.xs,
    maxWidth:   280,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius:    radius.lg,
    padding:         space.lg,
    ...elevationShadow(3),
    borderWidth:  1,
    borderColor:  'rgba(226,232,240,0.9)',
  },
  cardTitle: {
    ...type.title,
    color:     colors.dark,
    textAlign: 'center',
  },
  cardSubtitle: {
    ...type.caption,
    color:        colors.muted,
    textAlign:    'center',
    marginTop:    space.xs,
    marginBottom: space.md,
  },
  formError: {
    ...type.caption,
    color:        colors.danger,
    textAlign:    'center',
    marginBottom: space.sm,
  },
  supportText: {
    ...type.micro,
    color:     colors.muted,
    textAlign: 'center',
    marginTop: space.lg,
  },
});

export default LoginCard;
