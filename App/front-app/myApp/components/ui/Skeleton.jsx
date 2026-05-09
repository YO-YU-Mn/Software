import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radius, space } from '@/constants/designTokens';

/**
 * Lightweight loading placeholder (pulse) for lists and screens.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = radius.sm,
  style,
}) {
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.95,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.border,
          opacity: pulse,
        },
        style,
      ]}
    />
  );
}

/** Dashboard / card block skeleton */
export function SkeletonBlock({ style }) {
  return (
    <View style={[styles.block, style]}>
      <Skeleton width="55%" height={14} borderRadius={8} />
      <Skeleton width="100%" height={12} style={{ marginTop: space.sm }} />
      <Skeleton width="88%" height={12} style={{ marginTop: space.xs }} />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
