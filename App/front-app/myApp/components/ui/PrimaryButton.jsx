import React from 'react';
import { Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors, space, radius, type, elevationShadow, touchTargetMin } from '@/constants/designTokens';

/**
 * Primary action — gradient fill, shadow, 48px+ touch height.
 */
export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
  accessibilityHint,
}) {
  const inactive = disabled || loading;

  return (
    <PressableScale
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      accessibilityHint={accessibilityHint}
      style={[styles.outer, inactive && styles.outerDisabled]}>
      <LinearGradient
        colors={inactive ? [colors.muted, colors.slate] : [colors.primary, colors.primaryDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}>
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.label}>{title}</Text>
        )}
      </LinearGradient>
    </PressableScale>
  );
}

/** Outlined secondary — same touch target */
export function SecondaryButton({ title, onPress, disabled }) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={[styles.secondaryOuter, disabled && styles.outerDisabled]}>
      <View style={styles.secondaryInner}>
        <Text style={styles.secondaryLabel}>{title}</Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: radius.md,
    overflow: 'hidden',
    minHeight: touchTargetMin + 4,
    ...elevationShadow(2),
  },
  outerDisabled: {
    opacity: 0.72,
    elevation: 0,
    shadowOpacity: 0,
  },
  gradient: {
    minHeight: touchTargetMin + 4,
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...type.headline,
    color: colors.white,
    fontWeight: '600',
  },
  secondaryOuter: {
    borderRadius: radius.md,
    minHeight: touchTargetMin + 4,
  },
  secondaryInner: {
    flex: 1,
    minHeight: touchTargetMin + 4,
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  secondaryLabel: {
    ...type.headline,
    color: colors.primary,
    fontWeight: '600',
  },
});
