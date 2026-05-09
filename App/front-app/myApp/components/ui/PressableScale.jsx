import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Subtle scale feedback on press (mobile micro-interaction).
 */
export function PressableScale({
  children,
  style,
  disabled,
  scaleTo = 0.98,
  accessibilityRole = 'button',
  ...rest
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole={accessibilityRole}
      style={[style, animatedStyle]}
      disabled={disabled}
      onPressIn={() => {
        if (!disabled) {
          scale.value = withSpring(scaleTo, { damping: 14, stiffness: 400 });
        }
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 400 });
      }}
      {...rest}>
      {children}
    </AnimatedPressable>
  );
}
