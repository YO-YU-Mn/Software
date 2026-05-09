import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
} from 'react-native';
import Animated, { Layout } from 'react-native-reanimated';
import { colors, space, radius, type, touchTargetMin, a11y } from '@/constants/designTokens';

/**
 * Accessible field with animated label and explicit error state.
 * Touch target meets 44px minimum via minHeight on the field.
 */
export function FloatingLabelInput({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  autoCapitalize = 'none',
  keyboardType = 'default',
  editable = true,
  testID,
  onFocus: propOnFocus,
  onBlur: propOnBlur,
  ...restInput
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || (value != null && String(value).length > 0);

  const onFocus = (e) => {
    setFocused(true);
    propOnFocus?.(e);
  };

  const onBlur = (e) => {
    setFocused(false);
    propOnBlur?.(e);
  };

  return (
    <Animated.View style={styles.wrapper} layout={Layout.springify()}>
      <Animated.View
        style={[
          styles.field,
          focused && styles.fieldFocused,
          error && styles.fieldError,
          !editable && styles.fieldDisabled,
        ]}
        layout={Layout.springify()}>
        <Animated.Text
          style={[
            styles.label,
            floated && styles.labelFloated,
            error && styles.labelError,
            focused && !error && styles.labelFocus,
          ]}
          pointerEvents="none"
          layout={Layout.springify()}>
          {label}
        </Animated.Text>
        <TextInput
          testID={testID}
          accessibilityLabel={label}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          editable={editable}
          placeholderTextColor={colors.muted}
          selectionColor={colors.primary}
          {...restInput}
        />
      </Animated.View>
      {error ? (
        <Animated.Text style={styles.errorText} accessibilityLiveRegion="polite" layout={Layout.springify()}>
          {error}
        </Animated.Text>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: space.md,
  },
  field: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.bg,
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    paddingBottom: space.xs,
    minHeight: touchTargetMin + space.md,
    justifyContent: 'center',
  },
  fieldFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  fieldError: {
    borderColor: a11y.errorText,
    backgroundColor: colors.dangerBg,
  },
  fieldDisabled: {
    opacity: 0.6,
  },
  label: {
    ...type.caption,
    color: colors.muted,
    marginBottom: space.xxs,
  },
  labelFloated: {
    ...type.micro,
    marginBottom: space.xxs,
  },
  labelFocus: {
    color: colors.primary,
  },
  labelError: {
    color: a11y.errorText,
  },
  input: {
    ...type.body,
    color: colors.dark,
    paddingVertical: space.xs,
    minHeight: 28,
  },
  errorText: {
    ...type.caption,
    color: a11y.errorText,
    marginTop: space.xs,
    marginLeft: space.xxs,
  },
});
