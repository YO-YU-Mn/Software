import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PressableScale } from '@/components/ui/PressableScale';
import { colors, space, radius, type, elevationShadow } from '@/constants/designTokens';

/**
 * Empty, error, or onboarding feedback with optional primary action.
 */
export function EmptyState({
  icon = '📋',
  title,
  message,
  actionLabel,
  onAction,
  actionDisabled,
}) {
  return (
    <View style={styles.card} accessibilityRole="summary">
      <Text style={styles.icon} accessibilityElementsHidden importantForAccessibility="no">
        {icon}
      </Text>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <PressableScale
          onPress={onAction}
          style={[styles.cta, actionDisabled && styles.ctaDisabled]}
          accessibilityHint={
            actionDisabled ? 'التسجيل غير متاح حالياً' : undefined
          }>
          <Text style={styles.ctaText}>{actionLabel}</Text>
        </PressableScale>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: space.xl,
    paddingHorizontal: space.lg,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    ...elevationShadow(1),
  },
  icon: {
    fontSize: 48,
    marginBottom: space.md,
    opacity: 0.85,
  },
  title: {
    ...type.headline,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: space.xs,
  },
  message: {
    ...type.callout,
    color: colors.muted,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  cta: {
    marginTop: space.lg,
    backgroundColor: colors.primary,
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...elevationShadow(2),
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    ...type.callout,
    color: colors.white,
    fontWeight: '600',
  },
});
