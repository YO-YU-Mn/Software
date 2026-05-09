import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Text,
} from 'react-native';
import { colors, space, radius, type } from '@/constants/designTokens';

/**
 * Mobile-first debounced search field (catalog / assistant flows).
 */
export function AppSearchBar({
  placeholder = 'بحث…',
  onDebouncedChange,
  debounceMs = 320,
  showAiHint,
  footerLabel,
}) {
  const [value, setValue] = useState('');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(true);
    const t = setTimeout(() => {
      onDebouncedChange?.(value.trim());
      setPending(false);
    }, debounceMs);
    return () => clearTimeout(t);
  }, [value, debounceMs, onDebouncedChange]);

  return (
    <View style={styles.wrap} accessibilityRole="search">
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.input}
        returnKeyType="search"
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
        {...(Platform.OS === 'android' ? { underlineColorAndroid: 'transparent' } : {})}
      />
      {(pending || showAiHint) && (
        <View style={styles.metaRow}>
          {pending ? <ActivityIndicator size="small" color={colors.primary} /> : <View />}
          {footerLabel ? <Text style={styles.meta}>{footerLabel}</Text> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    paddingHorizontal: space.md,
    paddingVertical: Platform.select({ ios: space.sm, android: space.xxs, default: space.sm }),
  },
  input: {
    ...type.body,
    color: colors.dark,
    paddingVertical: 4,
    textAlign: 'right',
    minHeight: 44,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: space.xxs,
    minHeight: 20,
  },
  meta: {
    ...type.micro,
    color: colors.muted,
    flex: 1,
    marginLeft: space.sm,
    textAlign: 'right',
  },
});
